import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MenuController, NavController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { MainPageCliente } from '../../../pages';
import { rutValidate, rutFormat, rutClean } from 'rut-helpers';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RutValidator } from '../../../validators';
import { ENV, environment } from '../../../../environments/environment';
import { Network } from '@capacitor/network';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { Store } from '@ngxs/store';
import { AppLauncher } from '@capacitor/app-launcher';

import {
  SeguridadService,
  ClienteService,
  ClienteDatos,
  ClienteCuentasDatos,
  UtilService,
  TrazabilidadService,
  NotificacionService
} from '../../../services';

import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { CONSTANTES_NOTIFICACIONES_HOME } from '../../notificaciones/util/constantes.notificaciones';
import { Capacitor } from '@capacitor/core';
import { CONSTANTES_LOGIN, CONSTANTES_TOAST_LOGIN, CONSTANTES_TRAZAS_LOGIN, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA, CONSTANTES_WHATSAPP } from '../util/login.constantes';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Keyboard } from '@capacitor/keyboard';
import { ResizeClass } from '../../../../../src/app/util/resize.class';
import { OAuthService, OAuthErrorEvent, UserInfo } from 'angular-oauth2-oidc';
import { ActualizarDatosUsuario, ActualizarDatosAutenticacion } from '../../../state/login.actions';
import { DatosUser, DatosAutenticacions } from '../../../shared/login.model';
import { authConfig } from '../../../shared/auth.config';
import { PrudentialDatos } from 'src/app/services/api/data/prudential.datos';
import { LlamadaSaldosConsolidados } from 'src/app/util/llamada-saldos-consolidados';
declare let MCCordovaPlugin: any;
declare let SFMCEvent: any;

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
  styleUrls: ['signin.scss']
})
export class SigninPage extends ResizeClass implements OnInit {

  @ViewChild('contentLogin') contentLogin: ElementRef;
  @ViewChild('imgLogo') imgLogo: ElementRef;

  // Referencia a constantes de notificaciones, utilizada directamente en la vista.
  readonly CONSTANTES_NOTIF = CONSTANTES_NOTIFICACIONES_HOME;

  nombre: string;
  rutInput: string;
  clave: string;
  rut: number;
  dv: string;
  esCliente: boolean;
  form: FormGroup;
  ingresoClave: boolean = false;
  actualizarApp: boolean = false;
  mensajeUpgrade: string;
  tituloUpgrade: string;
  urlStore: string;
  huellaActiva: boolean = false;
  pathRecuperarClave: string = '/recuperaClaveWeb/Recovery/index.htm';
  dominio: string = ENV.base_url_habitat;
  loginHibrido: boolean = false;
  modalHuellaAppError: boolean = false;
  usuarioConConsultor: string = '';

  /**
  * Glosa ambiente de la app.
  */
  glosaAmbiente: string;

  /**
   * Número de versión obtenido desde package.json
   */
  versionNumber: string;

  /**
   * Número de build obtenido desde package.json
   */
  build: number;

  /**
   * variable que contiene el texto a mostrar en boton segun plataforma.
   */
  textoBotonIngreso: string;

  /**
   * Constante con texto a mostrar en boton para iOS.
   */
  TEXTO_BTN_IOS_INGRESO: string = 'Ingresar con tu Huella / Face ID';

  /**
   * Constante con texto a mostrar en boton para Android.
   */
  TEXTO_BTN_ANDROID_INGRESO: string = 'Ingresar con tu Huella';

  /**
   * Constante con URL para acceder al store de Android
   */
  URL_STORE_ANDROID: string = 'market://details?id=com.app.p8414JG';
  /**
   * Constante con URL para acceder al store de iOS
   */
  URL_STORE_IOS: string = 'https://itunes.apple.com/cl/app/afp-habitat-chile/id1150499489?mt=8';

  /**
   * Constante con URL para acceder al store de Huawei
   */
  URL_STORE_HUAWEI = 'https://appgallery.huawei.com/app/C101903697';

  /**
   * Tipo de input password o texto
   */
  tipoInput  =  'password';

  /**
   * Flag error ingresar rut
   */
  errorRut: boolean;

  /**
   * Flag para mostrar validacion rut 
   */
  mostrarValidacionRut = false;

  /**
   * Tipo de biometria activa
   */
  tipoBiometria: string;

  /**
   * Flag para agregar margen de teclado en el login
   */
  margenTecladoLogin = false;

  constructor(
    private menu: MenuController,
    private nav: NavController,
    private seguridadService: SeguridadService,
    private loading: LoadingController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private clienteService: ClienteService,
    private clienteDatos: ClienteDatos,
    private clienteCuentasDatos: ClienteCuentasDatos,
    private utilService: UtilService,
    private renderer: Renderer2,
    private notificacionService: NotificacionService,
    private platform: Platform,
    private trazabilidadService: TrazabilidadService,
    private saldosConsolidados: LlamadaSaldosConsolidados,
    private prudentialDatos: PrudentialDatos,
    private readonly faio: FingerprintAIO,
    public contextoAPP: ContextoAPP,
    private oauthService: OAuthService,
    private readonly store: Store,
  ) {

    super(contextoAPP);

    switch (environment.individeoEnv) {
      case 'dev':
        this.glosaAmbiente = '(Dev)';
        break;
      case 'uat':
        this.glosaAmbiente = '(Cert)';
        break;
      default:
        this.glosaAmbiente = '';
        break;
    }

      // Ajustamos la configuración para el flujo de OpenId Connect
      this.oauthService.configure(authConfig);

      // Cargamos el documento de descubrimiento, necesaria para la configuración OpenId Connect
      this.oauthService.loadDiscoveryDocumentAndTryLogin().then((res: boolean) => {
      })
      .catch((error) => {
      });

     // Validar uso de JwksValidationHandler
     this.oauthService.tokenValidationHandler = new JwksValidationHandler();
     this.cargarInformacionAutenticacion();

     this.oauthService.events.subscribe(event => {
      if (!(event instanceof OAuthErrorEvent)) {
        if (event.type === 'logout') {
          this.store.dispatch(new ActualizarDatosAutenticacion(undefined));
          this.store.dispatch(new ActualizarDatosUsuario(undefined));
        }
      }
    });

    this.contextoAPP.ocultarLoading(loading); // Remueve Loading que pueda venir de un TIMEOUT
    this.clave = '';
    this.subscribeCacheDatosCliente();
    this.form = this.formBuilder.group({
      rutInput: new FormControl('', {
        validators: [Validators.required, RutValidator.checkRut],
        updateOn: 'blur'
      }),
      clave: new FormControl('', { validators: [Validators.required] })
    });
    this.platform.ready().then(() => {
      this.contextoAPP.appActiva = true;
      if (this.platform.is('ios')) {
        this.textoBotonIngreso = this.TEXTO_BTN_IOS_INGRESO;
      } else if (this.platform.is('android')) {
        this.textoBotonIngreso = this.TEXTO_BTN_ANDROID_INGRESO;

        Keyboard.addListener('keyboardDidShow', info => {
          this.resizePantalla('25%');
        });
    
        Keyboard.addListener('keyboardDidHide', () => {
          this.resizePantalla('40%');
        });
      }


      Network.addListener('networkStatusChange', status => {
        if (!status) {
          this.mostrarMensajeSinInternet();
        }
      });

      this.platform.resume.subscribe(async () => {
        this.contextoAPP.appActiva = true;
        const respuesta: string | null = await this.utilService.getStorageData("ultima-actividad", false);
        if (respuesta && respuesta !== null) {
          const ultimaActividad = respuesta!;
          const actividadActual = new Date().valueOf();
          const diffMs = (actividadActual - +ultimaActividad);
          const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutos
          if (diffMins >= 5) {
            this.nav.navigateRoot('SigninPage');
          }
        }
      });

      this.cargarUltimaActividad();

      this.activarMenu();
    });
  }

   /**
   * Función encargada de cargar información de usuario entregada por servicio openId.
   * Esta información es acotada , para obtener la informacion detalla del usuario se debe utilizar OTRO servicio.
   */
   cargarInformacionUsuarioOauth(): void {
    this.oauthService.loadUserProfile().then((up: UserInfo) => {
      this.store.dispatch(new ActualizarDatosUsuario(new DatosUser(up)));
      this.cargarInformacionAutenticacion();
    });
  }

   /**
   * Encargado de cargar información de autenticación (token)
   */
   cargarInformacionAutenticacion(): void {
      this.store.dispatch(new ActualizarDatosAutenticacion(new DatosAutenticacions(this.oauthService.getAccessToken(), this.oauthService.getAccessTokenExpiration())));
   }

  /**
   * Metodo encargado de cargar ultima actividad
   */
  cargarUltimaActividad(): void {
    this.platform.pause.subscribe(() => {
      this.contextoAPP.appActiva = false;
      const ultimaActividad = new Date().valueOf();
      this.utilService.setStorageData("ultima-actividad", ultimaActividad.toString(), false);
    });
  }

  /**
   * Metodo encargado de activar menú
   */
  activarMenu(): void {
    this.menu.isEnabled().then(isEnabled => {
      if (isEnabled) {
        this.menu.enable(false);
      }
    });
  }

  async cambiarPagina(pagina: string) {
    if (pagina == 'ActivacionHuellaPage') {
      const loading = await this.contextoAPP.mostrarLoading();
      // corregir problema con la clave como variable de instancia.
      this.utilService.registrarPWDSS(this.clave.toString()).then(() => {
        this.contextoAPP.ocultarLoading(loading);
        this.nav.navigateRoot(pagina);
      }).catch((error: any) => {
        this.contextoAPP.ocultarLoading(loading);
      });
    } else {
      this.nav.navigateRoot(pagina);
    }
  }

  mostrarMensajeSinInternet() {
    const titulo: string = 'Problema de red';
    const mensaje: string = 'Detectamos problemas en tu conexión a internet. Revisa los Ajustes para conectar a una red disponible';
    const botones: any[] = [
      {
        text: 'CERRAR',
        handler: () => { console.log('>>> SigninPage - disconnectSubscription boton cerrar') }
      }
    ];
    this.mostrarAlert(titulo, mensaje, botones);
  }

  ingresarOtroUsuario() {
    const titulo: string = 'Cambio de Usuario';
    const mensaje: string = 'Al cambiar de usuario, se cerrará tu sesión y deberás registrarte nuevamente.';
    const botones: any[] = [
      {
        text: 'CANCELAR',
        handler: () => { console.log('>>> SigninPage - ingresarOtroUsuario boton cancelar') }
      },
      {
        text: 'CONTINUAR',
        handler: () => {
          this.limpiarUsuario()
        }
      }
    ];
    this.mostrarAlert(titulo, mensaje, botones);
  }

  mostrarMensajeBloqueoHuella() {
    const titulo: string = 'Autentificación Fallida';
    const mensaje: string = 'El lector de huella se encuentra bloqueado o tu Touch ID se encuentra desactivado. Actívalo nuevamente en la configuración de tu dispositivo.';
    const botones: any[] = [
      {
        text: 'ACEPTAR',
        handler: () => {
          this.cambiarLoginContraseña();
        }
      }
    ];
    this.mostrarAlert(titulo, mensaje, botones);
  }

  mostrarAlert(titulo: string, mensaje: string, botones: any[]) {
    const confirm = this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: botones
    }).then(confirmData => confirmData.present());
  }

  limpiarUsuario() {
    
    this.utilService.setStorageData('cliente-rut', '',false);
    this.utilService.setStorageData('cliente-dv', '',false);
    this.utilService.setStorageData('cliente-nombre','',false);
    this.utilService.setStorageData('cliente-registrado','NO',false);
    this.utilService.setStorageData('contador-reintento-sacu','0',false);
    this.clienteDatos.limpiarDatos();
    this.clienteCuentasDatos.limpiarDatos();
    this.prudentialDatos.limpiarDatos();
    this.loginHibrido = false;
    this.huellaActiva = false;
    this.clave = undefined!;
    this.utilService.setStorageData('huella-activa','',false);

    this.utilService.setStorageData(this.CONSTANTES_NOTIF.NOMBRE_NOTIFICACIONES_MEMORIA, '', false); // Se agrega borrado de notificaciones leidas
    this.utilService.setStorageData(this.CONSTANTES_NOTIF.ESTADO_NO_LEIDAS_MEMORIA, '', false); // Se agrega borrado de notificaciones leidas
    this.utilService.resetPWDSS().then(result => { })
    this.utilService.setStorageData('consultor-disponible', 'false', true);
  }

  subscribeCacheDatosCliente() {
    this.clienteDatos.esCliente.subscribe(esCliente => {
      this.esCliente = esCliente;
    });
    this.clienteDatos.rut.subscribe(rut => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe(dv => {
      this.dv = dv;
    });
    this.clienteDatos.nombre.subscribe(nombre => {
      this.nombre = nombre;
    });
    this.clienteDatos.huellaActiva.subscribe(huellaActiva => {
      this.huellaActiva = huellaActiva;
    });
    this.clienteDatos.poseeConsultor.subscribe(poseeConsultor => {
      this.usuarioConConsultor = poseeConsultor;
    });
  }

  async ngOnInit() {
    this.getVersionNumber();
    const loading = await this.contextoAPP.mostrarLoading();

    this.seguridadService.upgradeApplication().subscribe(async (response: any) => {
      /* eslint @typescript-eslint/no-var-requires: "off" */
      const { version: appVersion } = require('package.json');
      this.contextoAPP.ocultarLoading(loading);
      try {
        if (this.platform.is('android')) {
          if (this.validarVersionApp(response[0].acf.version_android[0], appVersion)) {
            this.actualizarApp = true;
            this.mensajeUpgrade = response[0].acf.mensaje_obligatorio;
            this.tituloUpgrade = response[0].acf.titulo_obligatorio;

            const storeOK =  await this.utilService.validarStore();
            
            const isAvailable = {
              available : storeOK
            }
            this.urlStore = isAvailable.available ? this.URL_STORE_ANDROID : this.URL_STORE_HUAWEI;
          } else {
            this.validaPoseeHuella();
          }
        } else if (this.platform.is('ios')) {
          if (this.validarVersionApp(response[0].acf.version_ios[0], appVersion)) {
            this.actualizarApp = true;
            this.mensajeUpgrade = response[0].acf.mensaje_obligatorio;
            this.tituloUpgrade = response[0].acf.titulo_obligatorio;
            this.urlStore = this.URL_STORE_IOS;
          } else {
            this.validaPoseeHuella();
          }
        }else{
            //WebAPP
            if (this.validarVersionApp(response[0].acf.version_android[0], appVersion)) {
              this.actualizarApp = true;
              this.mensajeUpgrade = response[0].acf.mensaje_obligatorio;
              this.tituloUpgrade = response[0].acf.titulo_obligatorio;
              this.urlStore = this.URL_STORE_ANDROID;
            }
        }
      } catch (e) {
        this.contextoAPP.ocultarLoading(loading);
        this.validaPoseeHuella();
      }
    }, () => {
      this.contextoAPP.ocultarLoading(loading);
      this.validaPoseeHuella();
    });
  }

  /**
   * Retorna true si la version actual de la app es mejor a la del servicio, por lo que se deberia mostrar el mensaje de upgrade.
   * @param versionApi (x,y,z)
   */
  validarVersionApp(versionApi: any, versionApp: string): boolean {
    let muestraMsj: boolean = false;
    const versionAppArray: any[] = versionApp.split('.');
    if (parseInt(versionApi.x) > parseInt(versionAppArray[0])) {
      muestraMsj = true;
    } else if (parseInt(versionApi.x) === parseInt(versionAppArray[0])) {
      if (parseInt(versionApi.y) > parseInt(versionAppArray[1])) {
        muestraMsj = true;
      } else if (parseInt(versionApi.y) === parseInt(versionAppArray[1])) {
        if (parseInt(versionApi.z) > parseInt(versionAppArray[2])) {
          muestraMsj = true;
        }
      }
    }
    return muestraMsj;
  }

  validarRut() {
    this.renderer.removeClass(this.contentLogin.nativeElement, 'content--active');
    this.rutInput = rutFormat(this.rutInput);
    this.mostrarValidacionRut = true;
    if (!rutValidate(this.rutInput)) {
      this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_DATOS_INDALIDOS);
      this.errorRut = true;
    } else {
      this.errorRut = false;
    }
  }

  cleanRut() {
    this.rutInput = rutClean(this.rutInput);
    this.clave = '';
    this.renderer.removeClass(this.contentLogin.nativeElement, 'content--active');
    this.renderer.addClass(this.contentLogin.nativeElement, 'content--active');
  }

  focusElement() {
    this.renderer.addClass(this.contentLogin.nativeElement, 'content--active');
    if (this.platform.is('ios')) {
      setTimeout(()=>{
        this.margenTecladoLogin = true;
      }, 500);
    }
  }

  blurElement() {
    this.renderer.removeClass(this.contentLogin.nativeElement, 'content--active');
    this.margenTecladoLogin = false;
  }

  actualizaCacheDatosCliente(cliente: any, productos: any, totalBonos: any, ejecutivo: any) {
    this.clienteDatos.setNombre(cliente.nombre);
    this.clienteDatos.setApellidoPaterno(cliente.apellidoPaterno);
    this.clienteDatos.setApellidoMaterno(cliente.apellidoMaterno);
    this.clienteDatos.setEsCliente(true);
    this.clienteDatos.setEmail(cliente.email);
    this.clienteDatos.setRut(cliente.rut);
    this.clienteDatos.setDv(cliente.dv);
    this.clienteDatos.setApodo(cliente.apodo);
    this.clienteDatos.setSexo(cliente.sexo);
    this.clienteDatos.setFechaAfiliacion(cliente.fechaAfiliacion);
    this.clienteDatos.setFechaIncorporacion(cliente.fechaIncorporacion);
    this.clienteCuentasDatos.setProductosCliente(productos);
    this.clienteCuentasDatos.setSaldoTotalBonosCliente(totalBonos)
    this.clienteDatos.setIdPersona(cliente.idPersona);
    this.clienteDatos.setEdad(cliente.edad);
    this.clienteDatos.setEsPensionado(cliente.esPensionado);
    this.clienteDatos.setPoseeConsultor(ejecutivo);
    this.clienteDatos.setTelefonoCelular(cliente.telefonoCelular);
  }

  /**
   * Encargado de actualizar datos contexto usuario
   */
  actualizarDatosContextoUsuario(cliente: any) {
    this.contextoAPP.datosCliente = new DatosUsuario(cliente);
  }

  setContactKeyUser(cliente: any) {
    if (cliente) {
      const client = new DatosUsuario(cliente);
      if (client.idMaePersona) {
        this.setContactKeyMC(client.idMaePersona.toString())
        .then((success: boolean) => {
            if(success) {
              console.warn("============== Exito asignar el Contact key ==============")
            } else {
              console.warn('============== No se pudo asignar el Contact Key ==============');
            }
        })
        .catch((error: Error) => console.warn(error.message));
      }
    }

  }

  /**
   * Encargado de validar:
   * - Si se encuentra la preferencia de huella activa 
   * - Si se encuentra correctamente almacenada la pwd del usuario.
   * - En caso de error en obtener pwd de usuario , el estado de la huella queda en false y se resetea el valor de la preferencia.
   * 
   */
  async validaPoseeHuella() {
    const loading = await this.contextoAPP.mostrarLoading();
    const data = await this.utilService.getStorageData("huella-activa", false);
    if (data !== null && data === 'si') {
      this.utilService.obtenerPWDSS().then((res: string) => {
        this.contextoAPP.ocultarLoading(loading);
        if (res == null || res === undefined) {
          this.huellaActiva = false;
          return;
        }

        // Si se encuentra habilitada la huella , con pwd guardada , activamos pantalla en modo huella.
        this.huellaActiva = true; // oculta formulario de input
        this.ingresoClave = true; // activa boton ingresar
        this.clienteDatos.setHuellaActiva(true);
      }).catch((error: any) => {
        this.cancelarIngresoHuella(error, loading);
      });
    } else {
      this.contextoAPP.ocultarLoading(loading);
      this.huellaActiva = false;
    }
  }

  /**
   * Encargado de limpiar variables de ingreso con huella.
   * @param error 
   * @param loading 
   */
  cancelarIngresoHuella(error: any, loading: any) {
    this.contextoAPP.ocultarLoading(loading);
    this.utilService.resetPWDSS();
    this.utilService.setStorageData('huella-activa', 'no', false);// Limpiamos variable de ingreso de huella.
    this.huellaActiva = false;
  }

  /**
   * Metodo encargado de desplegar login con huella
   * 
   * @param responseStorage del storage del flag para la huella
   * @param poseeLoginHibrido flag login hibrido
   */
  mostrarModalHuella(responseStorage: string, poseeLoginHibrido: boolean) {
    if (responseStorage === 'si' && !poseeLoginHibrido) {
      this.faio.show({
        title: CONSTANTES_LOGIN.TITULO_HUELLA,
        description: CONSTANTES_LOGIN.SUBTITULO_HUELLA,
        cancelButtonTitle: CONSTANTES_LOGIN.BOTON_HUELLA,
        disableBackup:true
      }).then(async (result: any) => {
        this.utilService.setLogEvent('event_habitat', { option: 'Login_Huella_19405' });
        const loading = await this.contextoAPP.mostrarLoading();
        this.utilService.obtenerPWDSS().then(async (res: string) => {
          await this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(this.rut + '-' + this.dv, res);

          this.seguridadService.signIn(this.rut, this.dv, res).subscribe((responseLogin: any) => {
            switch (responseLogin.codigo) {
              case CONSTANTES_LOGIN.LOGEADO:
                Promise.all([this.obtenerDatosCliente(), this.saldosConsolidados.obtenerDatosPrudential()])
                .then(async ([cliente, prudential]) => {
                  if (cliente.cliente !== null) {
                    cliente.prudential = prudential;
                    await this.registrarClienteHuella(cliente, loading);
                  } else {
                    this.mostrarToastErrorServicioLogin(loading);
                  }
                })
                .catch((error) => {
                  this.mostrarToastErrorServicioLogin(loading);
                });
                break;
              case CONSTANTES_LOGIN.NO_LOGEADO:
                this.contextoAPP.ocultarLoading(loading);
                this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_CLAVE_MODIFICADA);
                this.limpiarLogin();
                
                break;
              case CONSTANTES_LOGIN.BLOQUEADO:
                this.contextoAPP.ocultarLoading(loading);
                this.utilService.mostrarToastIconoConLink(CONSTANTES_TOAST_LOGIN.TEXTO_CLAVE_BLOQUEADA, `${this.dominio}${this.pathRecuperarClave}`);  
                
                break;
              default:
                this.mostrarToastErrorServicioLogin(loading);
                break;
            }
          }, (error: any) => {
            this.mostrarToastErrorServicioLogin(loading);
          });
        }).catch((error: any) => {
          this.registrarTrazabilidad(CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA.CODIGO_OPERACION);
          this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_INGRESA_CLAVE);
          this.limpiarLogin();
          this.contextoAPP.ocultarLoading(loading);
        });
      }).catch(async (error: any) => {
        await this.procesarErrorBiometria(error);
      });
    }
  }

  /**
   * Metodo encargado de procesar error biometría
   * 
   * @param error registro biometria
   */
  async procesarErrorBiometria(error: any) {
    this.faio.isAvailable().then(result=>{
      this.tipoBiometria = result.toString();
    })

    this.registrarTrazabilidad(CONSTANTES_TRAZAS_LOGIN_BIOMETRIA, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA.CODIGO_OPERACION);
    this.huellaActiva = false;
    this.clienteDatos.setHuellaActiva(false);
    this.loginHibrido = true;
    this.ingresoClave = false;

    if (error.indexOf('retry limit exceeded') !== -1) {
      this.modalHuellaAppError = true;
    } else if (error.indexOf('locked out') !== -1) {
      this.modalHuellaAppError = false;
      this.mostrarMensajeBloqueoHuella();
    } else {
      this.modalHuellaAppError = false;
    }
  }

  /**
   * Metodo encargado de registrar cliente logeado con huella
   * 
   * @param responseDatosCliente registrado
   * @param loading de la aplicacion
   */
  async registrarClienteHuella(responseDatosCliente: any, loading: HTMLIonLoadingElement) {
    if (responseDatosCliente.cliente !== null) {
      const cliente = this.utilService.generarModeloDatosCliente(responseDatosCliente.cliente);
      const productos = responseDatosCliente.productos;
      const ejecutivo = responseDatosCliente.ejecutivo;
      this.actualizaCacheDatosCliente(cliente, productos, responseDatosCliente.cliente.totalBonosReconocimiento, ejecutivo);
      this.actualizarDatosContextoUsuario(responseDatosCliente.cliente);
      this.registrarClienteNotificacion(this.rut, this.dv);
      this.registrarDatosPrudential(responseDatosCliente);
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_LOGIN, CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO.CODIGO_OPERACION);
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_LOGIN_BIOMETRIA, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_REGISTRAR_HUELLA.CODIGO_OPERACION);
      this.contextoAPP.ocultarLoading(loading);
      this.cambiarPagina(MainPageCliente);
    } else {
      this.mostrarToastErrorServicioLogin(loading);
    }
  }

  /**
   * Muestra mensaje estandar de error al realizar login y oculta componente loading.
   * @param loading 
   */
  mostrarToastErrorServicioLogin(loading: any) {
    this.contextoAPP.ocultarLoading(loading);
    this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_ERROR_SERVICIO);
  }

  /**
   * Funcion llamada desde modal de error fingerprint.
   */
  cambiarLoginHibrido() {
    this.huellaActiva = false;
    this.clienteDatos.setHuellaActiva(false);
    this.loginHibrido = true;
    this.modalHuellaAppError = false;
  }

  cambiarLoginContraseña() {
    this.huellaActiva = false;
    this.clienteDatos.setHuellaActiva(false);
  }


  /**
   * Metodo encargado de iniciar sesión
   * 
   * @returns en caso de que el cliente no ingrese clave
   */
  async iniciarSesion() {
    if (!this.ingresoClave) {// SI el usuario no a ingresado clave , no puede iniciar sesión.
      return;
    }

    const responseStorage = await this.utilService.getStorageData("huella-activa", false);

    if (responseStorage === 'si' && !this.loginHibrido) {
      this.mostrarModalHuella(responseStorage, this.loginHibrido);
    } else {
      const loading = await this.contextoAPP.mostrarLoading();

      if (!this.esCliente) {
        const rutSinFormato = rutClean(this.rutInput);
        this.rut = parseInt(rutSinFormato.slice(0, -1), 10);
        this.dv = rutSinFormato.slice(-1);
      }

      await this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(this.rut + '-' + this.dv, this.clave.toString())
      .then((data) => {
        // Data
      })
      .catch((errorResponse) => {
          console.error('Error during login:', errorResponse);
      });

      this.seguridadService.signIn(this.rut, this.dv, this.clave.toString()).subscribe(async (response: any) => {
          switch (response.codigo) {
            case CONSTANTES_LOGIN.LOGEADO:
              this.utilService.setStorageData('token',response.token,false);
              Promise.all([this.obtenerDatosCliente(), this.saldosConsolidados.obtenerDatosPrudential()])
              .then(async ([cliente, prudential]) => {
                if (cliente.cliente !== null) {
                  if (cliente.cliente.esFallecido) {
                    this.contextoAPP.ocultarLoading(loading);
                    this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_CLIENTE_FALLECIDO);
                  } else {
                    cliente.prudential = prudential;
                    await this.registrarCliente(cliente, loading, responseStorage);
                  }
                } else {
                  this.mostrarToastErrorServicioLogin(loading);
                }
              })
              .catch((error) => {
                this.mostrarToastErrorServicioLogin(loading);
              });
              break;
            case CONSTANTES_LOGIN.NO_LOGEADO:
              this.contextoAPP.ocultarLoading(loading);
              this.utilService.mostrarToastIcono(CONSTANTES_TOAST_LOGIN.TEXTO_DATOS_INDALIDOS);

              break;
            case CONSTANTES_LOGIN.BLOQUEADO:
              this.contextoAPP.ocultarLoading(loading);
              this.utilService.mostrarToastIconoConLink(CONSTANTES_TOAST_LOGIN.TEXTO_CLAVE_BLOQUEADA, `${this.dominio}${this.pathRecuperarClave}`);
              
              break;
            default:
              this.mostrarToastErrorServicioLogin(loading);
              break;
          }
        }, (error: any) => {
          this.mostrarToastErrorServicioLogin(loading);
        }
      );
    }
  }

  async obtenerDatosCliente(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.clienteService.obtenerDatosCliente(this.rut, this.dv).subscribe(async (response: any) => {
        resolve(response);
      }, (error: any) => {
        reject();
      });
    });
  }

  /**
   * Metodo encargado de registrar los datos del cliente logeado
   * 
   * @param response del servicio de datos cliente
   * @param loading de la app
   * @param responseStorage con datos de la huella activa
   */
  async registrarCliente(response: any, loading: HTMLIonLoadingElement, responseStorage: string):Promise<void> {
    const cliente = this.utilService.generarModeloDatosCliente(response.cliente);
    const productos = response.productos;
    const ejecutivo = response.ejecutivo;
    this.actualizaCacheDatosCliente(cliente, productos, response.cliente.totalBonosReconocimiento, ejecutivo);
    this.actualizarDatosContextoUsuario(response.cliente);
    this.setContactKeyUser(response.cliente);
    this.utilService.setStorageData('cliente-rut', cliente.rut.toString(), false);
    this.utilService.setStorageData('cliente-dv', cliente.dv, false);
    this.utilService.setStorageData('cliente-nombre', cliente.nombre, false);
    this.utilService.setStorageData('cliente-email', cliente.email, false);
    this.utilService.setStorageData('cliente-registrado', 'SI', false);
    this.utilService.setStorageData('consultor-disponible', ejecutivo, false);
    this.registrarClienteNotificacion(this.rut, this.dv);
    this.registrarDatosPrudential(response);
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_LOGIN, CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO.CODIGO_OPERACION);
    if (this.loginHibrido) {
      this.contextoAPP.ocultarLoading(loading);
      this.cambiarPagina(MainPageCliente);
    } else {
      this.faio.isAvailable().then(result=>{
        this.utilService.setLogEvent('event_habitat', { option: 'Registro_Huella_inicio_28240' });
        this.contextoAPP.ocultarLoading(loading);
        if (responseStorage === 'no') {
          this.cambiarPagina(MainPageCliente);
        } else {
          this.cambiarPagina('ActivacionHuellaPage');
        }
      }).catch(()=>{
        this.contextoAPP.ocultarLoading(loading);
        this.cambiarPagina(MainPageCliente);
      });
    }
  }

  /**
   * Metodo encargado de registrar los datos de prudential del cliente logeado
   *
   * @param datos del servicio de datos cliente
   */
  registrarDatosPrudential(datos: any): void {
    this.saldosConsolidados.registrarDatosPrudential(datos.prudential);
  }

  /**
   * Encargada de limpiar login , datos & vista.
   */
  limpiarLogin() {
    this.utilService.setStorageData('huella-activa', 'no', false);// Limpiamos variable de ingreso de huella.
    this.utilService.resetPWDSS();
    this.loginHibrido = false;
    this.esCliente = false;
    this.limpiarUsuario();
  }

  registrarClienteNotificacion(rut: number, dv: string) {
    const rutCliente: string = rut + '-' + dv;

    if (Capacitor.isNativePlatform() && this.contextoAPP.tokenFCM !== "") {
      this.notificacionService.registrarDispositivo(Capacitor.getPlatform(), rutCliente, this.contextoAPP.tokenFCM).subscribe((response: any) => {
        console.warn("[registrarClienteNotificacion] Exito en el registro del dispositivo");
       });
    }else{
      console.warn("[registrarClienteNotificacion] No se puede realizar el registro del dispositivo");
    }
  }

  detectaClave() {
    if (this.clave !== undefined && this.clave.toString().length >= 4) {
      this.ingresoClave = true;
    } else {
      this.ingresoClave = false;
    }
  }

  abrirPaginaStore() {
    if (this.platform.is('android')) {
      window.open(this.URL_STORE_ANDROID, '_system', 'location=yes');
    } else {
      this.utilService.openWithSystemBrowser(this.urlStore);
    }
  }

  recuperarClave() {
    this.utilService.openWithSystemBrowser(this.dominio + this.pathRecuperarClave);
  }

  async registrarTrazabilidad(traza, codigoOperacion: number) {
    let parametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza : traza,
      uuid : '',
      rut: this.rut,
      dv: this.dv
    }

    switch (codigoOperacion) {
      case CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_LOGIN.LOGIN_EXITO);
        break;
      case CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_HUELLA);
        break;
      case CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_REGISTRAR_HUELLA.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_REGISTRAR_HUELLA);
        break;
      case CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_LOGIN_BIOMETRIA.LOGIN_BIOMETRIA_ERROR);
        break;
    }
  
    this.trazabilidadService.registraTraza(parametroTraza, this.rut, this.dv).subscribe((response) => { });
  }

  // Se utiliza para poder hacer que el elemento sea clickeable y de esta forma se pueda perder el foco de los inputs
  ocultaTeclado() {
    return;
  }

  /**
   * Obtiene versión de aplicación desde environment
   */
  getVersionNumber(): void {
    /* eslint @typescript-eslint/no-var-requires: "off" */
    const { version: appVersion } = require('package.json');
    this.versionNumber = appVersion;

    /* eslint @typescript-eslint/no-var-requires: "off" */
    const { build: appBuild } = require('package.json');
    this.build = appBuild;
  }

  /**
   * Metodo encargado de desplegar password
   */
  togglePasswordMode() {
    this.tipoInput = this.tipoInput === 'text' ? 'password' : 'text';
  }

  /**
   * Metodo encargado de agrandar el modal cuando se habre el teclado.
   */
  resizePantalla(margen: string): void {
    if (this.imgLogo) {
      this.renderer.setStyle(this.imgLogo.nativeElement, 'height', margen);
    }
  }

  public setContactKeyMC(contactKey: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      MCCordovaPlugin.setContactKey(
        contactKey,
        () => resolve(true),
        () => reject('Can Not Set Contact Key')
      );
    });
  }

  async abrirWhatsApp() {
    const numero  = CONSTANTES_WHATSAPP.WHATSAPP_NUMERO;
    const mensaje = CONSTANTES_WHATSAPP.WHATSAPP_MENSAJE;
    const link    = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    try {
      await AppLauncher.openUrl({ url: link });
    } catch (error) {
      this.utilService.mostrarToastIcono('Ocurrió un error al abrir WhatsApp.');
    }
  }
}
