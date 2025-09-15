import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CONSTANTES_PLANES_STEP_1 } from 'src/app/pages/planes-de-ahorro/util/constantes.planes';
import { Browser } from '@capacitor/browser';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Preferences } from '@capacitor/preferences';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { v4 as uuidv4 } from 'uuid';
import { NavigationExtras, Router } from '@angular/router';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private digitosLlave = '0123456789';

  private secureSK = 'hbt-app-ss020-secureSK';
  private secureIVK = 'hbt-app-ss020-secureIVK';
  private securePWDK = 'hbt-app-ss020-securePWDK';

  readonly CONSTANTES = CONSTANTES_PLANES_STEP_1;

  constructor(
    private aes256: AES256,
    private readonly toast: ToastController,
    private readonly appAvailability: AppAvailability,
    public router: Router) {}

  public async validarStore():Promise<boolean>{
    return this.appAvailability.check("com.android.vending");
  }

  /**
   * Permite generar un string aleatorio de la longitud especificada,
   * usando los caracteres existentes en el string rango indicado.
   *
   * @param longitud es la cantidad de caracteres del string a construir.
   * @param rango es el string con los caracteres posibles a utilizar
   *        para construir el nuevo string.
   */
  public generarLlave(longitud: number, rango: string): string {
    let result = '';
    const cryptoArray = new Uint16Array(longitud);
    window.crypto.getRandomValues(cryptoArray);

    for (let i = 0; i < longitud; i++) {
      result += rango.charAt(cryptoArray[i] % rango.length);
    }
    return result;
  }

  /**
   * Este método permite obtener la clave desencriptada desde el
   * storage seguro.
   *
   * Retorna una promesa de la entrega de la clave desencriptada.
   */
  public async obtenerPWDSS(): Promise<string> {
    const llaves = await this.inicializarLlaves();
    console.log('llaves', llaves);
    
    const data = await this.getStorageData(this.securePWDK, true);
    return await this.aes256.decrypt(llaves[0], llaves[1], data);
  }

  /**
   * Este método permite encriptar y registrar el la clave encriptada especificada
   * en el storage seguro del dispositivo.
   *
   * Retorna una promesa con la clave encriptada (si es que se necesita).
   *
   * @param data es la clave que se desea encruptar y registrar.
   */
  public async registrarPWDSS(data: string): Promise<string> {
    let encriptada: string = '';
    const llaves = await this.inicializarLlaves();
    const result_1 = await this.aes256.encrypt(llaves[0], llaves[1], data);
    encriptada = result_1;
    this.setStorageData(this.securePWDK, encriptada, true);
    return encriptada;
  }

  /**
   * Este método permite eliminar todas las claves y llaves de los storages
   * seguros del dispositivo que a su vez la aplicación utiliza.
   */
  public async resetPWDSS(): Promise<any> {
    this.clearSecureData();
  }

  /**
   * Permite obtener las llaves de encriptación y desencriptación desde el
   * storage seguro del dispositivo. En caso de que estas no hayan sido creadas
   * con anterioridad, entonces este método las crea y almacena en el
   * storage seguro.
   *
   * Retorna una promesa de las llaves de encriptación (SecureKey e SecureIV).
   */
  private async inicializarLlaves(): Promise<string[]> {
    const datos: string[] = [];
    let reset = false;
    let sk: string = '';
    let ivk: string = '';

    try {
      try {
        sk = await this.getStorageData(this.secureSK,true);
      } catch (error: any) {
        reset = true;
        sk = this.generarLlave(32, this.digitosLlave);
      }
      datos.push(sk);
      ivk = await this.getStorageData(this.secureIVK,true);
    } catch (error: any) {
      reset = true;
      ivk = this.generarLlave(16, this.digitosLlave);
    }

    datos.push(ivk);
    if (reset) {
      this.setStorageData(this.secureSK, datos[0],true);
      this.setStorageData(this.secureIVK, datos[1],true);
    }
    return datos;
  }

  generarModeloDatosCliente(datos: any): any {
    return {
      rut: parseInt(datos.rut),
      dv: datos.digitoVerificadorRut,
      nombre: datos.primerNombre,
      apellidoPaterno: datos.apellidoPaterno,
      apellidoMaterno: datos.apellidoMaterno,
      email: datos.correoElectronico,
      apodo: datos.primerNombre,
      sexo: datos.sexo,
      fechaAfiliacion: datos.fechaAfiliacion,
      fechaIncorporacion: datos.fechaIncorporacion,
      idPersona: datos.idMaePersona,
      edad: parseInt(datos.edad),
      esPensionado: datos.esPensionado,
      telefonoCelular: datos.telefonoCelular
    };
  }

  /**
   * Encargado de visualizar archivo pdf
   * @param base64 archivo en base64
   */
  async generarPdf(base64: string) {
    const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-');
    const fileName = `/certificado-${currentDate}.pdf`;
    this.openFile(fileName, base64);
  }

  /**
   * Lógica para abrir archivo pdf usando directorio data
   * 
   * @param rutaArchivo ruta archivo pdf
   * @param base64 archivo en base64
   */
  openFile(rutaArchivo:string, base64: string) {
    Filesystem.writeFile({
      path: rutaArchivo,
      data: base64,
      directory: Directory.Data,
      recursive: true,
    }).then(async (res) => {
      await FileOpener.open({
        filePath: res.uri,
      });
    }).catch((e:any) => {
      console.log('Error', e);
    });
  }

  openWithSystemBrowser(url: string) {
    Browser.open({ url: url });
  }

  mostrarToast(texto: string) {
    this.toast.create({
      message: texto,
      position: 'top',
      cssClass: 'custom-toast',
      duration: 8000
    }).then((toastData) => {
      toastData.present();
    });
  }

  /**
   * Metodo encargado de desplegar toast con icono.
   * 
   * @param texto a desplegar
   */
  mostrarToastIcono(texto: string) {
    this.toast.create({
      message: texto,
      position: 'top',
      cssClass: 'custom-toast icono-toast',
      duration: 5000,
      icon: 'alert-circle-outline'
    }).then((toastData) => {
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

  async mostrarToastConLink(texto: string, url: string) {
    const toast = await this.toast.create({
      message: texto,
      position: 'top',
      duration: 8000,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'Ir',
          handler: () => {
            this.openWithSystemBrowser(url);
          }
        }
      ]
    });

    await toast.present();
  }

  /**
   * Muestra toast con parametro de numero.
   * Incluye boton Ir , que permite llamar a la funcionalidad de llamada.
   * @param texto 
   * @param telefono 
   */
    async mostrarToastConLlamada(texto: string, telefono: string) {
    const toast = await this.toast.create({
      message: texto,
      position: 'top',
      duration: 8000,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'Ir',
          handler: () => {
            window.open('tel:' + telefono, '_system');
          }
        }
      ]
    });

    await toast.present();
  }

  /**
   * Permite almacenar un dato en el storage seguro del dispositivo.
   * @param key clave segura
   * @param value , datos a guardar
   * @param isSecure true , es valor seguro , false nope
   */
  public setStorageData(key: string, value: string, isSecure: boolean): void {
    if (isSecure) {
      SecureStoragePlugin.set({ key, value }).then(data => {
        // eslint-disable-next-line no-console
        console.log("OK al guardar key segura", data);
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('Error al guardar key segura', error);
      });
      return;
    }

    Preferences.set({ key, value }).then(data => {
      // eslint-disable-next-line no-console
      console.log("OK al guardar key", key);
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('Error al guardar key', error);
    });
  }

  /**
    * Este método permite obtener la clave desencriptada desde el storage seguro
    *
    * Retorna valor asociado al key.
    *
    * @param key para
    */
  public async getStorageData(key: string, isSecure: boolean): Promise<string> {
    if (isSecure) {
      return (await SecureStoragePlugin.get({ key })).value;
    }

    const value = (await Preferences.get({ key })).value;
    return value !== null ? value : "";
  }

  /**
  * Este método permite eliminar todas las claves y llaves de storage seguro
  */
  public async clearSecureData(): Promise<any> {
    return (await SecureStoragePlugin.clear()).value;
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
  generarUuid(){
    const myuuid = uuidv4();
    this.setStorageData('uuid',myuuid,false);
    return myuuid;
  }

  /**
  * Se genera el uuid de forma aleatoria
  */
  generarUuidRandom(){
    return uuidv4();
  }

  /**
  * Obtenemos el uuid desde el storage
  */
  getStorageUuid() {
    return this.getStorageData('uuid',false);
  }
  
  /**
   * Metodo que genera objeto de navegacion extra.
   * 
   * @param urlNavegacion a la que se debe redirigir
   * @returns objeto navegacionExtra
   */
  generarNavegacionExtra(urlNavegacion): NavigationExtras {
    return { queryParams: { data: urlNavegacion, timestamp: Date.now().toString() } };
  }

   /**
   * Metodo para navegar entre paginas.
   * 
   * @param page a cargar
   */
  recargarVista(page) {
    this.router.navigateByUrl(page);
  }
}
