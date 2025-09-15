import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ClienteDatos, UtilService } from '../../../services/index';
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { CONSTANTES_ACTIVACION_BIOMETRIA, CONSTANTES_LOGIN } from '../util/login.constantes';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { Capacitor } from '@capacitor/core';
import { ResizeClass } from '../../../../../src/app/util/resize.class';

@Component({
  selector: 'app-activacion-huella',
  templateUrl: './activacion-huella.page.html',
  styleUrls: ['./activacion-huella.page.scss'],
})
export class ActivacionHuellaComponent extends ResizeClass {

  /**
   * Modal error huella
   */
  modalHuellaAppError = false;

  /**
   * Tipo de biometria a desplegar
   */
  tipoBiometria =  'biometric';

  /**
   * Tipo de biometria a desplegar
   */
  textoTipoBiometria =  CONSTANTES_ACTIVACION_BIOMETRIA[this.tipoBiometria];

  /**
   * Constantes de la pantalla
   */
  CONSTANTES = CONSTANTES_ACTIVACION_BIOMETRIA;

  constructor(
      private readonly nav: NavController,
      private readonly faio: FingerprintAIO,
      private readonly clienteDatos: ClienteDatos,
      private readonly utilService: UtilService,
      public readonly contextoApp: ContextoAPP
  ) {
    super(contextoApp);
    this.utilService.setStorageData('estado-huella', '', false);
    
    this.validarTipoBiometria()
  }

  /**
   * Metodo encargado de determinar metodo de biometria
   */
  validarTipoBiometria(): void {
    if (Capacitor.isNativePlatform()) {
      this.faio.isAvailable().then((result) => {
        this.textoTipoBiometria = this.CONSTANTES[result];
        this.tipoBiometria = result;
      });
    }
  }

  /**
   * Muestra modal de ingreso de biometria
   */
  mostrarModalHuella(): void {
    if (Capacitor.isNativePlatform()) {
      this.faio.isAvailable().then(() => {
        this.faio.show({
          title: CONSTANTES_LOGIN.TITULO_HUELLA,
          disableBackup: true,
          cancelButtonTitle: CONSTANTES_LOGIN.BOTON_HUELLA,
          description: CONSTANTES_LOGIN.SUBTITULO_HUELLA
        }).then(() => {
          this.procesarRegistroBiometria();
        }).catch((error: any) => {
          this.procesarErrorBiometria(error.code);
        })
      });
    }
  }

  /**
   * Metodo encargado de registrar la biometria
   */
  procesarRegistroBiometria(): void {
    this.utilService.setLogEvent('event_habitat', { option: 'Registro_Huella_exitoso_28289' });
    this.clienteDatos.setHuellaActiva(true);

    // guarda clave encriptada en storage.
    this.utilService.obtenerPWDSS().then(async (pwd: string) => {
      await this.utilService.registrarPWDSS(pwd);
    });

    // guardar en storage que ingreso huella ok y valor de variable que debo enviar a ingreso
    this.utilService.setStorageData('huella-activa', 'si',false);
    this.utilService.setStorageData('tipo-biometria', this.tipoBiometria ,false);    
    this.nav.navigateRoot('HomeClientePage');
  }

  /**
   * Metodo encargado de registrar error biometria
   * 
   * @param error al registrar biometría
   */
  procesarErrorBiometria(error: number): void {
    this.utilService.setLogEvent('event_habitat', { option: 'Registro_Huella_error_28250' });
    this.clienteDatos.setHuellaActiva(false);
    this.utilService.setStorageData('huella-activa', 'no',false);
  }

  /**
   * Despliega una pagina de la app
   * 
   * @param pagina a desplegar
   */
  cambiarPagina(pagina: string): void {
    this.nav.navigateRoot(pagina);
  }

  /**
   * Despliega home cliente
   */
  cambiarPaginaSinHuella(): void {
    this.utilService.setStorageData('huella-activa', 'no', false);
    this.nav.navigateRoot('HomeClientePage');
  }
}
