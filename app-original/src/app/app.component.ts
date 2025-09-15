import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { constantes } from './shared/constantes';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Capacitor } from '@capacitor/core';
import { CONSTANTES_CONFIGURACION } from './constants/constantes-centro-asesoria';
import { CONSTANTES_PLANES_STEP_1 } from './pages/planes-de-ahorro/util/constantes.planes';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { ClienteDatos, UtilService } from './services';
import { StatusBar, Style } from '@capacitor/status-bar';
declare let IRoot: any;
import { SplashScreen } from '@capacitor/splash-screen';
import { TextZoom, SetOptions } from '@capacitor/text-zoom';
import { Keyboard } from '@capacitor/keyboard';
import { PushNotifications, ActionPerformed } from '@capacitor/push-notifications';
import { ContextoAPP } from './util/contexto-app';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { SucursalesService, SucursalPage } from './services/sucursales/sucursal.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { environment } from '../../src/environments/environment';
import { Device } from '@capacitor/device';
import { AntiJail } from 'anti-jail';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  readonly CONSTANTES = constantes;
  /**
   * Idioma de app, por defecto Español
   */
  language: string;
  /**
   * Nombre de la plataforma del dispositivo
   */
  platformDevice: string;

  /**
  * Elemento HTML de toast
  */
  @ViewChild('ionicContent', { read: ElementRef }) ionicContent: ElementRef;

  /**
   * Flag para mostrar modal toast
   */
  modalToastState: boolean;

  /**
   * Flag mostrar tus datos
   */
  tusDatosActivo = false;

  readonly CONSTANTES_CA = CONSTANTES_CONFIGURACION;
  // Referencia a constantes planes 1 , utilizada directamente en la vista.
  readonly CONSTANTES_PLANES = CONSTANTES_PLANES_STEP_1;
  rootPage: any;
  usuarioCliente: boolean;
  nombreUsuario: string;
  usuarioConConsultor: string;
  esPensionado: boolean;
  rut: number;
  dv: string;
  // Variables para posicionamiento de teclado ( Solo Android ) 
  coordenadaY: any;
  alturaPantalla: any;
  offsetTeclado: any;
  lastPage: string;

  public edadUsuario: number;
  public gender: string;

  public empleadores = [];
  public regimenes = [];
  public fondos = [];

  static accesoPlanes: string;
  static descargaPDF: string; //Variable para guardar pdf en base64 para descargar

  constructor(
    private translate: TranslateService,
    public router: Router,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private clienteDatos: ClienteDatos,
    private utilService: UtilService,
    private nav: NavController,
    private contextoAPP: ContextoAPP,
    private sucursalesService: SucursalesService,
    public menuCtrl: MenuController,
    private readonly zone: NgZone
  ) {

    if (environment.production) {
      this.tusDatosActivo = false;
    }

    this.platformDevice = Capacitor.getPlatform();

    this.subscribeCacheDatosCliente();
    this.initializeApp();

    if (this.platform.is('mobile')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT); // pone la pantalla en VERTICAL  por si viene bug desde el video.
    }

    // Configuración para posicionamiento de teclado , solo android.
    if (this.platformDevice === 'android') {
      this.platform.pause.subscribe(() => {
        Keyboard.hide();
      });
      this.configuracionTeclado();
    }

    this.clienteDatos.esPensionado.subscribe(esPensionado => {
      this.esPensionado = esPensionado;
    });

    this.clienteDatos.edad.subscribe(edad => {
      this.edadUsuario = edad;
    });

    this.clienteDatos.sexo.subscribe(sexo => {
      this.gender = sexo;
    });

    this.clienteDatos.rut.subscribe(rut => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe(dv => {
      this.dv = dv;
    });
  }

  ngOnInit(): void {
    this.language = this.CONSTANTES.LANGUAGE;
    this.initTranslate(this.language);
    this.registerNotifications();
  }

  /**
   * Setea lenguaje seleccionado e inicializa traducciones
   */
  translateLanguage(): void {
    this.translate.use(this.language);
  }

  /**
   * Asigna lenguaje por defecto
   * @param language Lenguaje seleccionado
   */
  initTranslate(language: any): void {
    this.translate.setDefaultLang(language);
    if (language) {
      this.language = language;
    }
    else {
      // En caso de no encontrar lenguaje seleccionado setea español automaticamente
      this.language = this.CONSTANTES.LANGUAGE;
    }
    this.translateLanguage();
  }

  initializeApp() {
    this.platform.ready().then(async () => {

      this.addListeners();

      //Deshabilita el boton volver del dispositivo (hardware button)
      document.addEventListener("backbutton", function (e) { }, false);
      // fin deshabilita boton
      let continuar = true;
      this.validaRootEmulador().then(isRootEmulador => {
        if (isRootEmulador) {
          this.nav.navigateForward('ErrorRootPage');
          continuar =  false;
        }
      });

      if (!continuar){
        return;
      }

      const clienteRegistrado = await this.utilService.getStorageData("cliente-registrado", false);
      if (clienteRegistrado == 'SI') {
        this.clienteDatos.setEsCliente(true);
        this.clienteDatos.setPoseeConsultor('consultorOK');
        this.clienteDatos.setRut(+await this.utilService.getStorageData("cliente-rut", false));
        this.clienteDatos.setDv(await this.utilService.getStorageData("cliente-dv", false));
        this.clienteDatos.setNombre(await this.utilService.getStorageData("cliente-nombre", false));
      } else {
        this.clienteDatos.setEsCliente(false);
        this.clienteDatos.setPoseeConsultor('');
      }

      if (this.platform.is('mobile')) {
        // Se aplica style dark para que las letras del status bar sean blancas
        StatusBar.setStyle({ style: Style.Dark });
        // Se aplica color para status bar (solo android)
        StatusBar.setBackgroundColor({ color: '#B4123B' })
      }

      // Se habilitan las analiticas
      FirebaseAnalytics.enable();

      if (this.platform.is('mobile')) {
        PushNotifications.addListener('pushNotificationActionPerformed', (actionNotification: ActionPerformed) => {
          this.utilService.setLogEvent('event_habitat', { option: 'notificacion_open' });
          const dataNotificacion = actionNotification.notification.data;
          if (dataNotificacion && dataNotificacion.cliente_rut && dataNotificacion.notificacion_id) {
            this.utilService.setLogEvent('event_habitat_audit', { option: { cliente_id: dataNotificacion.cliente_rut, notificacion_id: dataNotificacion.notificacion_id } })
          }
          if (dataNotificacion && dataNotificacion.click_link && !this.contextoAPP.appActiva) { // Solo se redirige al link cuando la app no se encuentra activa (segundo plano o apagada)
            this.utilService.openWithSystemBrowser(dataNotificacion.click_link);
          }
        },
        );
      }

      // La app resetea los cambios de resolución en caso de que
      // el dispositivo tenga zoom predeterminado
      const zoomOption: SetOptions = {
        value: 1
      };

      if (this.platform.is('mobile')) {
        TextZoom.set(zoomOption);
      }

      // Se oculta el splash cuando el DOM termine de cargar con un delay
      window.addEventListener('DOMContentLoaded', () => {
        SplashScreen.hide({
          fadeOutDuration: 250,
        });
      });
    });

    // Listener para redirección de clave unica
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      if (this.platformDevice === 'android') {
        this.zone.run(() => {
          const domain = 'tokenUAF=';
          const pathArray = event.url.split(domain);
          const appPath = pathArray.pop();
          if (appPath) {
            Browser.close();
            this.router.navigateByUrl(`ClaveUnicaComponent?tokenUAF=${appPath}`);
          }
        });
      } else {
        this.zone.run(async () => {
          const domain = 'tokenUAF=';
          const pathArray = event.url.split(domain);
          const appPath = pathArray.pop();

          if (appPath) {
            await Browser.close();
            this.router.navigateByUrl(`ClaveUnicaComponent?tokenUAF=${appPath}`);
          }
        });
      }
    });
  }

   /**
   * Inicia los listener para los diferentes casos de notificaciones (registro y recibidas)
   */
   async addListeners(): Promise<void> {
    await PushNotifications.addListener('registration', token => {
      this.contextoAPP.tokenFCM = token.value;
      this.utilService.setStorageData("NOTIFICATION_TOKEN", token.value, false);
    });
  
    await PushNotifications.addListener('registrationError', err => {
      console.log('Registration error: ', err.error);
    });
  
    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });
  
    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  /**
   * Inicia el registro de notificaciones (solicitud de permisos)
   */
  async registerNotifications(): Promise<void> {

    if (!Capacitor.isPluginAvailable('PushNotifications')) { // Caso pluggin push no disponible , retornamos
      console.warn("[registerNotifications] Pluggin PushNotifications no disponible");
      return;
    }

    let permStatus = await PushNotifications.checkPermissions();
  
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
  
    if (permStatus.receive !== 'granted') {
      console.log("User denied permissions!");
      throw new Error('User denied permissions!');
    }
  
    await PushNotifications.register();
  
  }


  /**
   * Función encargada de registrar eventos para posicionamiento de teclado.
   * eventos:+
   * - registrar coordenadas.
   * - eventoMostrarTeclaco.
   * - eventoOcultarTeclado.
   */
  configuracionTeclado() {
    this.alturaPantalla = this.platform.height();

    /**
     * Registramos Coordenada y , donde se realizo la acción (touch)
     */
    window.addEventListener('touchstart', (e: any) => {
      this.coordenadaY = e.touches[0].clientY;
    });

    /**
    * Realiza la acción de agregar un top a la pantalla (ion-app div) , con el fin de que siempre que se realiza un click a un input 
    * el teclado se situa debajo de el.
    */
    window.addEventListener('keyboardDidShow', (e: any) => {
      let alturaTeclado = e.keyboardHeight;
      const deltaTeclado = 40;
      let bodyMove = <HTMLElement>document.querySelector("ion-app"), bodyMoveStyle = bodyMove.style;
      this.offsetTeclado = (this.alturaPantalla - this.coordenadaY);

      if (this.offsetTeclado < (alturaTeclado + deltaTeclado)) {
        let calculoAltura = (alturaTeclado - this.offsetTeclado + deltaTeclado);
        let valorTop = "-" + calculoAltura + "px";
        bodyMoveStyle.top = valorTop;
      }
    });

    /**
     * Encargado de eliminar style que agrega el top a la pantalla.
     */
    window.addEventListener('keyboardDidHide', (e: any) => {
      let removeStyles = <HTMLElement>document.querySelector("ion-app");
      removeStyles.removeAttribute("style");
    });
  }

  titleCaseWord(word: string) {
    if (!word) {
      return word;
    } else {
      return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
  }

  subscribeCacheDatosCliente() {
    this.clienteDatos.nombre.subscribe(nombre => {
      this.nombreUsuario = this.titleCaseWord(nombre);
    });
    this.clienteDatos.esCliente.subscribe(esCliente => {
      this.usuarioCliente = esCliente;
    });
    this.clienteDatos.poseeConsultor.subscribe(poseeConsultor => {
      this.usuarioConConsultor = poseeConsultor;
    });
    this.clienteDatos.esPensionado.subscribe(esPensionado => {
      this.esPensionado = esPensionado;
    });
  }

  /**
   * Identifica si se ejecutando la app en un emulador.
   * 
   * @returns Promise<boolean>
   */
  async isVirtualDevice(): Promise<boolean> {
    const info = await Device.getInfo();
    const isEmulator =
      info.isVirtual ||
      info.model.includes("Emulator") ||
      info.model.includes("Android SDK built for x86") ||
      info.model.includes("Genymotion");

    return isEmulator;
  }

  /**
   * Identifica si se ejecutando la app en un dispositivo rooteado.
   * 
   * @returns Promise<boolean>
   */
  isDeviceRoot(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.platformDevice === 'android' || this.platformDevice === 'ios') {
        try {
          IRoot.isRooted(
            (result) => {
              if (result) {
                console.error("Se detectó dispositivo rooteado.(IRoot)");
                resolve(true);
              } else if (this.platformDevice === 'ios') {
                AntiJail.validate().then((r) => {
                  if (r.status) {
                    console.error("Se detectó dispositivo rooteado.(AntiJail)");
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                }).catch(() => resolve(false));
              } else {
                resolve(false);
              }
            },
            () => {
              console.error('No se pudo comprobar si el dispositivo esta rooteado');
              resolve(false);
            }
          );
        } catch (error) {
          console.error('No se pudo comprobar si el dispositivo esta rooteado ');
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Valida si es un dispositivo permitido.
   * 
   * @returns Promise<boolean>
   */
  async validaRootEmulador(): Promise<boolean> {
    const isRooted = await this.isDeviceRoot();
    let isEmulator = false;
  
    if (this.platformDevice === 'android') {
      isEmulator = await this.isVirtualDevice();
      if (isEmulator) {
        console.error("Se detectó un emulador o dispositivo virtual.");
      }
    }
  
    return isRooted || isEmulator;
  }
  

  async openPage(page: string) {

    this.lastPage = page;

    if (page === 'IndicadoresPage') {
      this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Indicadores' });
    } else if (page === 'ValorCuotaPage') {
      this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Valor_Cuota' });
    } else if (page === 'SucursalesPage') {
      this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Sucursales' });
    } else if (page === 'ContactoPage') {
      this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Contacto' });
    } else if (page === 'PoliticaPrivacidad') {
      this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Politica' });
    } else if (page === 'SigninPage') {
      if (this.usuarioCliente) {
        this.utilService.setLogEvent('event_habitat', { option: 'Cerrar_Sesion' });
      } else {
        this.utilService.setLogEvent('event_habitat', { option: 'Iniciar_Sesion_Menu' });
      }
    }

    if (page === 'SigninPage' || page === 'HomeClientePage' || page === 'HomeInvitadoPage') {
      this.nav.navigateRoot(page);
    } else if (page === 'planes-step-uno') {
      //Para planes se debe especificar desde donde se accede al módulo
      AppComponent.accesoPlanes = this.CONSTANTES_PLANES.ACCESO_MENU;
      this.nav.navigateForward(page);
    } else if (page === 'PoliticaPrivacidad') {
      this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/politica-privacidad-y-seguridad-canales-digitales/');
    } else {
      this.nav.navigateForward(page);
    }
  }

  mostrarFechaPagoPensiones() {
    this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Fecha_Pago_Pension' });
    this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/pensiones/pagos-de-pension/fechas-de-pago-de-pension/');
  }

  /**
   * Se evalua si se muestra acceso a plan de ahorro dsde menú
   * para esto debe ser pensionado o cumplir con la edad de
   * jubilación respectiva segun su sexo
   */
  mostrarPlanDeAhorro() {
    if (this.esPensionado) {
      return true;
    } else if (this.gender === this.CONSTANTES_CA.FEMENINO && this.edadUsuario > this.CONSTANTES_CA.maxAgeWomen) {
      return true;
    } else if (this.gender === this.CONSTANTES_CA.MASCULINO && this.edadUsuario > this.CONSTANTES_CA.maxAgeMen) {
      return true;
    } else {
      return false;
    }
  }

  cerrarMenu(): void {
    const sucursalCurrent = this.lastPage === 'SucursalesPage' ? true : false;

    let sucursalPage: SucursalPage = {
      eliminarMapa: false,
      sucursalCurrentPage: sucursalCurrent
    }

    this.sucursalesService.eventoEliminarMapa(sucursalPage);
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
