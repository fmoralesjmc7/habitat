import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import { SplashScreen } from '@capacitor/splash-screen';

import { environment } from '../../src/environments/environment';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { ClienteDatos, UtilService } from './services';
import { ContextoAPP } from './util/contexto-app';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  FirebaseAnalytics,
  SetConsentOptions,
} from '@capacitor-firebase/analytics';
import { Keyboard } from '@capacitor/keyboard';
import {
  SucursalesService,
  SucursalPage,
} from './services/sucursales/sucursal.service';
import { CONSTANTES_CONFIGURACION } from './constants/constantes-centro-asesoria';
import { CONSTANTES_PLANES_STEP_1 } from './pages/planes-de-ahorro/util/constantes.planes';

declare let IRoot: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent implements OnInit {
  readonly CONSTANTES_CA = CONSTANTES_CONFIGURACION;
  readonly CONSTANTES_PLANES = CONSTANTES_PLANES_STEP_1;

  private pushHandles: PluginListenerHandle[] = [];
  private pushInitialized = false;

  static accesoPlanes: string;
  /**
   * Nombre de la plataforma del dispositivo
   */
  platformDevice: string;
  /**
   * Flag mostrar tus datos
   */
  tusDatosActivo = false;
  usuarioCliente = false;
  rut = 0;
  dv = '';
  nombreUsuario = '';
  edadUsuario = 0;
  gender = '';

  usuarioConConsultor = '';
  esPensionado = false;

  // Variables para posicionamiento de teclado ( Solo Android )
  coordenadaY: any;
  alturaPantalla: any;
  offsetTeclado: any;
  lastPage = '';

  constructor(
    private clienteDatos: ClienteDatos,
    private contextoAPP: ContextoAPP,
    private nav: NavController,
    private platform: Platform,
    private sucursalesService: SucursalesService,
    private titleCase: TitleCasePipe,
    private utilService: UtilService,
    public menuCtrl: MenuController
  ) {
    if (environment.production) {
      this.tusDatosActivo = false;
    }
    this.platformDevice = Capacitor.getPlatform();

    this.subscribeCacheDatosCliente();
    this.initializeApp();

    // Configuración para posicionamiento de teclado , solo android.
    if (this.platformDevice === 'android') {
      this.platform.pause.subscribe(() => {
        Keyboard.hide();
      });
      this.configuracionTeclado();
    }

    this.clienteDatos.edad.subscribe((edad) => {
      this.edadUsuario = edad;
    });

    this.clienteDatos.sexo.subscribe((sexo) => {
      this.gender = sexo;
    });

    this.clienteDatos.rut.subscribe((rut) => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe((dv) => {
      this.dv = dv;
    });
  }

  async ngOnInit() {
    if (this.platform.is('mobile')) {
      await ScreenOrientation.lock({ orientation: 'portrait' }); // pone la pantalla en VERTICAL  por si viene bug desde el video.
    }
    this.registerNotifications();
  }

  private subscribeCacheDatosCliente() {
    this.clienteDatos.nombre.subscribe((nombre) => {
      this.nombreUsuario = this.titleCase.transform(nombre);
    });
    this.clienteDatos.esCliente.subscribe((esCliente) => {
      this.usuarioCliente = esCliente;
    });
    this.clienteDatos.poseeConsultor.subscribe((poseeConsultor) => {
      this.usuarioConConsultor = poseeConsultor;
    });
    this.clienteDatos.esPensionado.subscribe((esPensionado) => {
      this.esPensionado = esPensionado;
    });
  }

  async initializeApp() {
    await this.platform.ready();
    this.addListeners();
    this.disableBackButton();

    const continuar = await this.checkRootEmulador();
    if (!continuar) return;

    await this.cargarClienteRegistrado();
    this.configurarStatusBar();
    this.habilitarAnaliticas();
    this.resetZoom();
    this.ocultarSplashScreen();
  }

  /**
   * La app resetea los cambios de resolución en caso de que
   * el dispositivo tenga zoom predeterminado
   */
  private resetZoom() {
    if (!this.platform.is('mobile')) return;
    TextZoom.set({ value: 1 });
  }

  /**
   * Se habilitan las analiticas de firebase
   */
  private async habilitarAnaliticas() {
    // habilitar / deshabilitar la recolección (aplica desde el próximo arranque)
    await FirebaseAnalytics.setEnabled({ enabled: true });

    // consentimiento (si usas CMP)
    await FirebaseAnalytics.setConsent({
      type: 'ANALYTICS_STORAGE',
      status: 'GRANTED',
    } as SetConsentOptions);
  }

  /**
   * Se aplica style dark para que las letras del status bar (solo android)sean blancas
   */
  private configurarStatusBar() {
    if (this.platform.is('mobile')) {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#B4123B' });
    }
  }

  /**
   * Se oculta el splash cuando el DOM termine de cargar con un delay
   */
  private ocultarSplashScreen() {
    window.addEventListener('DOMContentLoaded', () => {
      SplashScreen.hide({ fadeOutDuration: 250 });
    });
  }

  /**
   * Inicia los listener para los diferentes casos de notificaciones (registro y recibidas)
   */
  async addListeners(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // Caso pluggin push no disponible , retornamos
      console.warn(
        '[registerNotifications] Pluggin PushNotifications no disponible'
      );
      return;
    }

    if (this.pushInitialized) return;

    try {
      this.pushHandles.push(
        await PushNotifications.addListener('registration', (token: Token) => {
          this.contextoAPP.tokenFCM = token.value;
          this.utilService.setStorageData(
            'NOTIFICATION_TOKEN',
            token.value,
            false
          );
        })
      );

      this.pushHandles.push(
        await PushNotifications.addListener('registrationError', (err) => {
          console.warn('[push] Registration error:', err);
        })
      );
      this.pushHandles.push(
        await PushNotifications.addListener(
          'pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            console.log('[push] Received:', notification);
          }
        )
      );

      this.configurarPushNotifications();

      this.pushInitialized = true;
    } catch (error) {
      console.warn(
        '[push] No se pudieron registrar listeners de notificación:',
        error
      );
    }
  }

  /**
   * Deshabilita el boton volver del dispositivo (hardware button)
   */
  private disableBackButton() {
    document.addEventListener('backbutton', () => {}, false);
  }

  private async checkRootEmulador(): Promise<boolean> {
    const isRootEmulador = await this.validaRootEmulador();
    if (isRootEmulador) {
      this.nav.navigateForward('error-root');
      return false;
    }
    return true;
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
        console.error('Se detectó un emulador o dispositivo virtual.');
      }
    }

    return isRooted || isEmulator;
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
      info.model.includes('Emulator') ||
      info.model.includes('Android SDK built for x86') ||
      info.model.includes('Genymotion');

    return isEmulator;
  }

  /**
   * Identifica si se ejecuta la app en un dispositivo rooteado.
   *
   * @returns Promise<boolean>
   */
  async isDeviceRoot(): Promise<boolean> {
    if (!['android', 'ios'].includes(this.platformDevice)) return false;

    try {
      const rooted = await this.checkIRoot();
      if (rooted) return true;

      if (this.platformDevice === 'ios') {
        // return await this.checkAntiJail();
      }

      return false;
    } catch (error) {
      console.error(
        'No se pudo comprobar si el dispositivo está rooteado',
        error
      );
      return false;
    }
  }

  // private async checkAntiJail(): Promise<boolean> {
  //   try {
  //     const result = await AntiJail.validate();
  //     if (result.status) {
  //       console.error('Se detectó dispositivo rooteado.(AntiJail)');
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  private checkIRoot(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        IRoot.isRooted(
          (result: any) => {
            console.log('typeof iroot:::', typeof result, result);

            if (result) {
              console.error('Se detectó dispositivo rooteado.(IRoot)');
              resolve(true);
            } else {
              resolve(false);
            }
          },
          () => {
            console.error(
              'No se pudo comprobar si el dispositivo está rooteado'
            );
            resolve(false);
          }
        );
      } catch (error) {
        console.error(
          'No se pudo comprobar si el dispositivo esta rooteado',
          error
        );
        resolve(false);
      }
    });
  }

  private async configurarPushNotifications() {
    this.pushHandles.push(
      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (actionNotification: ActionPerformed) => {
          this.utilService.setLogEvent('event_habitat', {
            option: 'notificacion_open',
          });
          const dataNotificacion = actionNotification.notification.data;

          if (
            dataNotificacion?.cliente_rut &&
            dataNotificacion?.notificacion_id
          ) {
            this.utilService.setLogEvent('event_habitat_audit', {
              option: {
                cliente_id: dataNotificacion.cliente_rut,
                notificacion_id: dataNotificacion.notificacion_id,
              },
            });
          }

          if (dataNotificacion?.click_link && !this.contextoAPP.appActiva) {
            // Solo se redirige al link cuando la app no se encuentra activa (segundo plano o apagada)
            this.utilService.openWithSystemBrowser(dataNotificacion.click_link);
          }
        }
      )
    );
  }

  private async cargarClienteRegistrado() {
    const clienteRegistrado = await this.utilService.getStorageData(
      'cliente-registrado',
      false
    );
    if (clienteRegistrado === 'SI') {
      this.clienteDatos.setEsCliente(true);
      this.clienteDatos.setPoseeConsultor('consultorOK');
      this.clienteDatos.setRut(
        +(await this.utilService.getStorageData('cliente-rut', false))
      );
      this.clienteDatos.setDv(
        await this.utilService.getStorageData('cliente-dv', false)
      );
      this.clienteDatos.setNombre(
        await this.utilService.getStorageData('cliente-nombre', false)
      );
    } else {
      this.clienteDatos.setEsCliente(false);
      this.clienteDatos.setPoseeConsultor('');
    }
  }

  /**
   * Inicia el registro de notificaciones (solicitud de permisos)
   */
  async registerNotifications(): Promise<void> {
    console.log('isNativePlatform:::', Capacitor.isNativePlatform());

    if (!Capacitor.isNativePlatform()) {
      // Caso pluggin push no disponible , retornamos
      console.warn(
        '[registerNotifications] Pluggin PushNotifications no disponible'
      );
      return;
    }

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.log('User denied permissions!');
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
      let bodyMove = <HTMLElement>document.querySelector('ion-app'),
        bodyMoveStyle = bodyMove.style;
      this.offsetTeclado = this.alturaPantalla - this.coordenadaY;

      if (this.offsetTeclado < alturaTeclado + deltaTeclado) {
        let calculoAltura = alturaTeclado - this.offsetTeclado + deltaTeclado;
        let valorTop = '-' + calculoAltura + 'px';
        bodyMoveStyle.top = valorTop;
      }
    });

    /**
     * Encargado de eliminar style que agrega el top a la pantalla.
     */
    window.addEventListener('keyboardDidHide', (e: any) => {
      let removeStyles = <HTMLElement>document.querySelector('ion-app');
      removeStyles.removeAttribute('style');
    });
  }

  async openPage(page: string) {
    this.lastPage = page;

    if (page === 'IndicadoresPage') {
      this.utilService.setLogEvent('event_habitat', {
        option: 'Acceso_Indicadores',
      });
    } else if (page === 'ValorCuotaPage') {
      this.utilService.setLogEvent('event_habitat', {
        option: 'Acceso_Valor_Cuota',
      });
    } else if (page === 'SucursalesPage') {
      this.utilService.setLogEvent('event_habitat', {
        option: 'Acceso_Sucursales',
      });
    } else if (page === 'ContactoPage') {
      this.utilService.setLogEvent('event_habitat', {
        option: 'Acceso_Contacto',
      });
    } else if (page === 'PoliticaPrivacidad') {
      this.utilService.setLogEvent('event_habitat', {
        option: 'Acceso_Politica',
      });
    } else if (page === 'signin') {
      if (this.usuarioCliente) {
        this.utilService.setLogEvent('event_habitat', {
          option: 'Cerrar_Sesion',
        });
      } else {
        this.utilService.setLogEvent('event_habitat', {
          option: 'Iniciar_Sesion_Menu',
        });
      }
    }

    if (
      page === 'signin' ||
      page === 'home-cliente' ||
      page === 'HomeInvitadoPage'
    ) {
      this.nav.navigateRoot(page);
    } else if (page === 'planes-step-uno') {
      // Para planes se debe especificar desde donde se accede al módulo
      AppComponent.accesoPlanes = this.CONSTANTES_PLANES.ACCESO_MENU;
      this.nav.navigateForward(page);
    } else if (page === 'PoliticaPrivacidad') {
      this.utilService.openWithSystemBrowser(
        'https://www.afphabitat.cl/politica-privacidad-y-seguridad-canales-digitales/'
      );
    } else {
      this.nav.navigateForward(page);
    }
  }

  /**
   * Se evalua si se muestra acceso a plan de ahorro dsde menú
   * para esto debe ser pensionado o cumplir con la edad de
   * jubilación respectiva segun su sexo
   */
  mostrarPlanDeAhorro() {
    if (this.esPensionado) {
      return true;
    } else if (
      this.gender === this.CONSTANTES_CA.FEMENINO &&
      this.edadUsuario > this.CONSTANTES_CA.maxAgeWomen
    ) {
      return true;
    } else if (
      this.gender === this.CONSTANTES_CA.MASCULINO &&
      this.edadUsuario > this.CONSTANTES_CA.maxAgeMen
    ) {
      return true;
    } else {
      return false;
    }
  }

  cerrarMenu(): void {
    const sucursalCurrent = this.lastPage === 'SucursalesPage' ? true : false;

    const sucursalPage: SucursalPage = {
      eliminarMapa: false,
      sucursalCurrentPage: sucursalCurrent,
    };

    this.sucursalesService.eventoEliminarMapa(sucursalPage);
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  ngOnDestroy(): void {
    for (const pushH of this.pushHandles) {
      try {
        pushH.remove();
      } catch {}
    }
    this.pushHandles = [];
    this.pushInitialized = false;
  }
}
