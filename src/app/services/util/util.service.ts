import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { v4 as uuidv4 } from 'uuid';
import { ToastController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { NavigationExtras } from '@angular/router';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor(private toast: ToastController) {}
  setStorageData(key: string, value: string, isSecure: boolean): void {
    // Phase 2 minimal: only Preferences (non-secure)
    Preferences.set({ key, value });
  }

  async getStorageData(key: string, isSecure: boolean): Promise<string> {
    const value = (await Preferences.get({ key })).value;
    return value ?? '';
  }

  /**
   * Metodo encargado de registrar log firebase.
   */
  public async setLogEvent(logName: string, logOption: any) {
    await FirebaseAnalytics.logEvent({
      name: logName,
      params: logOption,
    });
  }

  /**
   * Se genera el uuid de forma aleatoria
   */
  generarUuid() {
    const myuuid = uuidv4();
    this.setStorageData('uuid', myuuid, false);
    return myuuid;
  }

  /**
   * Obtenemos el uuid desde el storage
   */
  getStorageUuid() {
    return this.getStorageData('uuid', false);
  }

  mostrarToast(texto: string) {
    this.toast
      .create({
        message: texto,
        position: 'top',
        cssClass: 'custom-toast',
        duration: 8000,
      })
      .then((toastData) => {
        toastData.present();
      });
  }

  /**
   * Metodo encargado de desplegar toast con icono.
   *
   * @param texto a desplegar
   */
  mostrarToastIcono(texto: any) {
    this.toast
      .create({
        message: texto,
        position: 'top',
        cssClass: 'custom-toast icono-toast',
        duration: 5000,
        icon: 'alert-circle-outline',
      })
      .then((toastData) => {
        toastData.present();
      });
  }

  /**
   * Metodo encargado de desplegar toast con icono y clickeable.
   *
   * @param texto a desplegar
   * @param url a redireccionar
   */
  async mostrarToastIconoConLink(texto: string, url: string) {
    const toast = await this.toast.create({
      message: texto,
      position: 'top',
      duration: 5000,
      cssClass: 'custom-toast icono-toast',
      icon: 'alert-circle-outline'
    });

    toast.addEventListener('click', () => {
      this.openWithSystemBrowser(url);
    });

    await toast.present();
  }

  openWithSystemBrowser(url: string) {
    Browser.open({ url: url });
  }

  /**
   * Metodo que genera objeto de navegacion extra.
   *
   * @param urlNavegacion a la que se debe redirigir
   * @returns objeto navegacionExtra
   */
  generarNavegacionExtra(urlNavegacion: any): NavigationExtras {
    return {
      queryParams: { data: urlNavegacion, timestamp: Date.now().toString() },
    };
  }
}
