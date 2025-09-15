import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import type { SwiperContainer } from 'swiper/element';

import {
  ClienteCuentasDatos,
  ClienteDatos,
  GiroService,
  TrazabilidadService,
  UtilService,
  DepositoDirectoService,
  NotificacionService,
  // PlanesService
} from '../../../services';
import { NavigationExtras } from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_GIRO_STEP_1 } from 'src/app/pages/giro-de-ahorro/util/constantes.giro';
import {
  CONSTANTES_HOME_CLIENTE,
  CONSTANTES_REDIRECCION_APP,
  CONSTANTES_TRAZAS_HOME,
} from '../util/constantes.home';
import { UtilGiro } from '../../giro-de-ahorro/util/util.giro';
import { AppComponent } from '../../../app.component';
import { CONSTANTES_NOTIFICACIONES_HOME } from '../../notificaciones/util/constantes.notificaciones';
import { Preferences } from '@capacitor/preferences';
import {
  catchError,
  combineLatest,
  finalize,
  firstValueFrom,
  map,
  of,
  Subscription,
} from 'rxjs';
// import { ObtenerDataPlanesService } from '../../planes-de-ahorro/util/obtenerDataPlanes.service';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { ResizeClass } from '../../../../../src/app/util/resize.class';
import { PrudentialService } from 'src/app/services/api/restful/prudential.service';
import { CONSTANTES_TOAST_SALDOS_CONSOLIDADOS } from '../../otras-suscripciones/util/saldos-consolidados.constantes';
import { CONSTANTES_CONFIGURACION } from 'src/app/constants/constantes-centro-asesoria';
import { BarraInformativaInterface, Notificacion } from 'src/app/interfaces';
import { PrudentialDatos } from 'src/app/services/api/data/prudential.datos';
import {
  CONSTANTES_LISTA_PRODUCTOS,
  CONSTANTES_PRUDENTIAL,
} from 'src/app/util/producto.constantes';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';
import { NgClass, SlicePipe, TitleCasePipe } from '@angular/common';
import { ChileanCurrencyPipe } from 'src/app/pipes/chilean-currency.pipe';

type ConstantesHome = typeof CONSTANTES_HOME_CLIENTE;
type ConstKey = keyof ConstantesHome;

function isConstKey(k: unknown): k is ConstKey {
  return typeof k === 'string' && k in CONSTANTES_HOME_CLIENTE;
}

register(); // Para Swiper

@Component({
  selector: 'app-home-cliente',
  templateUrl: 'home-cliente.page.html',
  styleUrls: ['home-cliente.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ChileanCurrencyPipe,
    FormatoPesoChilenoPipe,
    SlicePipe,
    TitleCasePipe,
    NgClass,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeClientePage extends ResizeClass implements OnInit {
  // Referencia a constantes giro 1, utilizada directamente en la vista.
  readonly CONSTANTES_GIRO = CONSTANTES_GIRO_STEP_1;
  readonly CONSTANTES_PRUDENTIAL = CONSTANTES_PRUDENTIAL;

  @ViewChild('lastSlider') lastSlider!: ElementRef;

  productos!: any[];
  productosSlide!: any[];
  lastSlide!: boolean;
  nombre!: string;
  totalAhorrado!: number;
  idPersona!: number;
  rut!: number;
  dv!: string;
  telefonoCelular!: string;
  bono!: any;
  prudential!: any;
  esPensionado!: boolean;
  loginHibrido!: boolean;
  indicadorLoading!: any;
  textoSaldos = CONSTANTES_HOME_CLIENTE.TEXTO_SALDO;

  SIN_TELEFONO_VALIDO = 'Sin telefono valido';
  MAX_DEPOSITOS_DIARIOS =
    'Has excedido el máximo de depósitos diarios permitidos. Vuelve a intentar a partir de mañana.';
  MAX_DEPOSITOS_DIARIOS_ERROR =
    'Importante: Nuestro servicio presenta problemas en este momento. Por favor vuelve a intentar más tarde.';
  ERROR_SIN_PRODUCTOS =
    '¡Lo sentimos! Ha ocurrido un error. Usuario sin productos.';

  // validador modal Sin cuentas vigentes Giro
  modalValidacionSinCuentasVigentesGiro!: boolean;

  // validador modal Sin cuentas vigentes Giro
  modalCuentasSinSaldosGiro!: boolean;

  // validador modal Sin celular valido
  modalSinCelularValido!: boolean;

  // validador saldos discordantes giro
  modalValidacionSaldoDiscordante!: boolean;

  // validador modal autorizacion de consolidacion saldos
  modalPrudentialAutorizaConsolidacion!: boolean;

  // validador modal felicitaciones consolidacion prudential
  modalPrudentialFelicitaciones!: boolean;

  // validador modal informativo prudential
  modalInformativoPrudential!: boolean;

  //Constantes para validaciones de centro de asesoria
  readonly CONSTANTES_CA = CONSTANTES_CONFIGURACION;
  readonly CONSTANTES_HOME = CONSTANTES_HOME_CLIENTE;

  // Referencia a constantes de notificaciones, utilizada directamente en la vista.
  readonly CONSTANTES_NOTIF = CONSTANTES_NOTIFICACIONES_HOME;
  public ocultarSimuladorPension = false;
  public ocultarContacto = true;
  public edadUsuario!: number;
  public gender!: string;
  utilGiro!: UtilGiro;

  //Variable que determina si se muestra o no el aviso de notifiaciones sin leer
  notifNoLeidas: boolean = false;

  // generador de uuid dinamico
  uuid!: string;

  public empleadores = [];
  public regimenes = [];
  public fondos = [];

  /**
   * Suscripcion a datos de cliente
   */
  suscripcionDatosCliente!: Subscription;

  /**
   * Datos para despliegue de barra informativa.
   */
  datosBarraInformativa!: BarraInformativaInterface;

  /**
   * Variable que almacena la preferencia de producto prudential
   */
  verSaldosPrudential: boolean = false;

  /**
   * Variable que almacena si ver la barra de prudential
   */
  verBarraPrudential: boolean = false;

  /**
   * Slider nombres de cuentas
   */
  @ViewChild('sliderCuentas') sliderCuentas!: SwiperContainer;

  /**
   * Slider nombres de cuentas
   */
  @ViewChild('sliderDetalleCuentas') sliderDetalleCuentas!: SwiperContainer;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private menu: MenuController,
    private clienteCuentasDatos: ClienteCuentasDatos,
    private clienteDatos: ClienteDatos,
    contextoAPP: ContextoAPP,
    private trazabilidadProvider: TrazabilidadService,
    private utilService: UtilService,
    // TODO: Usar service
    // private obtenerDataPlanes: ObtenerDataPlanesService,
    private depDirService: DepositoDirectoService,
    private giroService: GiroService,
    private notificacionService: NotificacionService,
    private prudentialDatos: PrudentialDatos,
    private prudentialService: PrudentialService // private planesService: PlanesService
  ) {
    super(contextoAPP);
    this.utilGiro = new UtilGiro();
    this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Privado' });
  }

  async ngOnInit() {
    this.uuid = this.utilService.generarUuid();
    this.obtenerBarraInformativa();

    const tipoBiometria = await this.utilService.getStorageData(
      'tipo-biometria',
      false
    );

    if (tipoBiometria !== '' && isConstKey(tipoBiometria)) {
      this.utilService.mostrarToastIcono(
        CONSTANTES_HOME_CLIENTE[tipoBiometria]
      );
      this.utilService.setStorageData('tipo-biometria', '', false);
    }

    this.menu.enable(true);

    if (this.loginHibrido) {
      this.loginHibrido = false;
    }

    const loading = await this.contextoAPP.mostrarLoading();

    this.clienteDatos.nombre.subscribe((nombre) => {
      this.nombre = nombre;
    });
    this.clienteCuentasDatos.saldoTotalCuentas.subscribe((totalAhorrado) => {
      this.totalAhorrado = totalAhorrado;
    });
    this.clienteDatos.idPersona.subscribe((idPersona) => {
      this.idPersona = idPersona;
    });
    this.clienteDatos.esPensionado.subscribe((esPensionado) => {
      this.esPensionado = esPensionado;
    });
    this.clienteDatos.rut.subscribe((rut) => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe((dv) => {
      this.dv = dv;
    });
    this.clienteDatos.telefonoCelular.subscribe((telefonoCelular) => {
      this.telefonoCelular = telefonoCelular;
    });
    this.clienteDatos.loginHibrido.subscribe((loginHibrido) => {
      this.loginHibrido = loginHibrido;
    });
    this.clienteDatos.edad.subscribe((edad) => {
      this.edadUsuario = edad;
    });
    this.clienteDatos.sexo.subscribe((sexo) => {
      this.gender = sexo;
    });
    this.suscripcionDatosCliente =
      this.clienteCuentasDatos.productosCliente.subscribe((productos) => {
        console.log('typeof Productos::::', typeof productos, productos);

        this.generarDatosCuentas(productos);
      });
    await this.cargarValorNotificaciones();
    this.contextoAPP.ocultarLoading(loading);
    this.validarEstadoSimuladorPension();
    this.validarBarraPrudential();
  }

  ionViewDidEnter() {
    this.menu.enable(true);
    this.cargarEstadoNotificaciones();
  }

  /**
   * Evento navegación a otro componente
   */
  ionViewDidLeave() {
    this.suscripcionDatosCliente.unsubscribe();
  }

  /**
   * Carga notificaciones desde servicio, luego se busca en memoria si ya fueron leidas, si existe al menos una sin leer
   * se muestra circulo amarillo en icono
   */
  public async cargarValorNotificaciones() {
    try {
      const respuestaNotificaciones = await firstValueFrom(
        this.notificacionService.obtenerNotificaciones(
          this.rut,
          this.dv,
          this.CONSTANTES_NOTIF.NOTIFICACIONES_EN_SERVICIO
        )
      );

      let notificaciones = respuestaNotificaciones.filter(
        (notif: Notificacion) => notif.mensaje
      );
      console.log('notificaciones:::', notificaciones);

      if (!notificaciones || notificaciones.length <= 0) {
        // Validacion en caso de que las notificaciones llegen vacias
        this.notifNoLeidas = false;
      } else {
        Preferences.get({
          key: this.CONSTANTES_NOTIF.NOMBRE_NOTIFICACIONES_MEMORIA,
        }).then((notificacionesLeidas) => {
          if (notificacionesLeidas.value !== '') {
            notificaciones.forEach((notificacion: any) => {
              let buscarNotificacion = JSON.parse(
                notificacionesLeidas.value!
              )?.find((notif: any) => notificacion.id === notif.id);
              if (!buscarNotificacion) {
                this.notifNoLeidas = true;
              }
            });
          } else {
            this.notifNoLeidas = true;
          }
        });
      }
    } catch (error) {
      // En caso de error de servicios, se considera que no hay notificaciones leidas
      this.notifNoLeidas = false;
    }
  }

  public cargarEstadoNotificaciones() {
    Preferences.get({
      key: this.CONSTANTES_NOTIF.ESTADO_NO_LEIDAS_MEMORIA,
    }).then((noLeidos) => {
      if (noLeidos.value != null) {
        this.notifNoLeidas = noLeidos.value == 'true';
      } else {
        this.notifNoLeidas = true;
      }
    });
  }

  /**
   * Valida el estado del boton simulador de pension
   */
  public validarEstadoSimuladorPension() {
    let edadMax: number | undefined;

    if (this.gender === 'F') {
      edadMax = this.CONSTANTES_CA.maxAgeWomen;
    } else if (this.gender === 'M') {
      edadMax = this.CONSTANTES_CA.maxAgeMen;
    }

    if (edadMax !== undefined && this.edadUsuario > edadMax) {
      this.ocultarSimuladorPension = true;
      this.ocultarContacto = false;
    }
  }

  public validarBarraPrudential(): void {
    this.prudentialDatos.productoPrudential.subscribe((producto) => {
      this.verBarraPrudential = true;
      // !!producto &&
      // producto?.estadoConsolidacion ===
      //   CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.NO_FIRMADO;
    });
  }

  //TO-DO En un futuro se moverá este parámetro a firebase.
  mostrarFechaPagoPensiones() {
    this.utilService.setLogEvent('event_habitat', {
      option: 'Acceso_Fecha_Pago_Pension',
    });
    this.utilService.openWithSystemBrowser(
      'https://www.afphabitat.cl/pensiones/pagos-de-pension/fechas-de-pago-de-pension/'
    );
  }

  generarDatosCuentas(productos: any[]) {
    let primeraEjecucion = true;

    const observablesSaldos = [
      this.clienteCuentasDatos.saldoTotalBonosCliente,
      this.prudentialDatos.productoPrudential,
    ];

    combineLatest(observablesSaldos).subscribe(
      ([totalBono, prudentialProducto]) => {
        let totalCuenta = 0;

        this.productosSlide = productos.slice().map((item) => {
          return {
            nombreCortoProducto: item.nombreCortoProducto,
          };
        });

        if (totalBono > 0) {
          totalCuenta += totalBono;
          this.bono = {
            totalMonto: totalBono,
          };
          this.productosSlide.push({
            nombreCortoProducto:
              CONSTANTES_LISTA_PRODUCTOS.BONO.NOMBRE_CORTO_CUENTA,
          });
        }

        this.textoSaldos = CONSTANTES_HOME_CLIENTE.TEXTO_SALDO;
        if (prudentialProducto) {
          this.prudential = prudentialProducto;
          if (
            prudentialProducto.estadoConsolidacion ===
            CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.ACEPTADO
          ) {
            this.productosSlide.push({
              nombreCortoProducto:
                CONSTANTES_LISTA_PRODUCTOS.PRUDENTIAL.NOMBRE_CORTO_CUENTA,
            });
            this.verSaldosPrudential = prudentialProducto.preferencia;
            if (
              prudentialProducto.preferencia &&
              prudentialProducto.detalle.length > 0
            ) {
              totalCuenta += prudentialProducto.totalMonto;
              this.textoSaldos = CONSTANTES_HOME_CLIENTE.TEXTO_SALDO_PRUD;
            }
          }
        }

        productos.forEach((element) => {
          totalCuenta += element.saldoTotal;
        });

        this.clienteCuentasDatos.setSaldoTotalCuentas(totalCuenta);
        this.productos = productos;

        if (primeraEjecucion) {
          this.registrarTrazabilidad();
          primeraEjecucion = false;
        }
      }
    );
  }

  verDetalleProducto(producto: any): void {
    let pagina = 'HomeClienteDetalleProductoPage';
    this.irPaginaDetalles(pagina, producto);
  }

  verDetalleCuenta(producto: any) {
    let pagina: string;
    if (producto.idProducto === 2 || producto.idProducto === 4) {
      pagina = 'HomeClienteDetalleCarruselPage';
    } else {
      pagina = 'HomeClienteDetalleSimplePage';
    }
    this.irPaginaDetalles(pagina, producto);
  }

  irPaginaDetalles(pagina: string, producto: any): void {
    this.utilService.setLogEvent('event_habitat', {
      option: 'Acceso_Detalles_Cuentas',
    });
    this.utilService.setStorageData('producto', producto, false);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        producto: JSON.stringify(producto),
      },
    };
    this.navCtrl.navigateForward([pagina], navigationExtras);
  }

  /**
   * Se encarga de cambiar la preferencia para mostrar saldos
   * dependiendo de la seleccion se buscan productos especificos o se ocultan
   */
  onCambioPreferencia(): void {
    this.prudentialService
      .guardarPreferenciaSaldo(
        CONSTANTES_PRUDENTIAL.USUARIO.INTERNET,
        this.verSaldosPrudential
      )
      .subscribe(
        async (response) => {
          this.prudentialDatos.setPreferenciaVerSaldos(
            this.verSaldosPrudential
          );
          if (this.verSaldosPrudential) {
            try {
              const saldos = await firstValueFrom(
                this.prudentialService.obtenerSaldosConsolidados()
              );
              const producto = this.prudentialDatos.obtenerProductoPrudential(
                saldos.detalleCuentas,
                CONSTANTES_LISTA_PRODUCTOS.PRUDENTIAL
              );
              this.prudentialDatos.setProductoPrudential(producto);
            } catch (error) {
              this.verSaldosPrudential = !this.verSaldosPrudential;
              this.utilService.mostrarToastIcono(
                CONSTANTES_TOAST_SALDOS_CONSOLIDADOS.TEXTO_ERROR_SERVICIO
              );
            }
          } else {
            const producto = this.prudentialDatos.obtenerProductoPrudential(
              [],
              CONSTANTES_LISTA_PRODUCTOS.PRUDENTIAL
            );
            this.prudentialDatos.setProductoPrudential(producto);
          }
        },
        (error) => {
          this.verSaldosPrudential = !this.verSaldosPrudential;
          this.utilService.mostrarToastIcono(
            CONSTANTES_TOAST_SALDOS_CONSOLIDADOS.TEXTO_ERROR_SERVICIO
          );
        }
      );
  }

  /**
   * Encargada de mostrar modales de validación giro.
   * Si el usuario no cumple con alguna validación ,se mostrara un modal de error.
   * En el caso de que el usuario cumpla , se continua a pantalla de sacu.
   * Orden de validaciones ( apv - cuenta 2).
   * 1. Usuario con numero de telefono registrado.
   * 2. Cuentas vigentes.
   * 3. Cuentas sin saldo.
   * 4. Cuentas con saldos discordantes.
   */
  async validacionGiros() {
    if (
      this.telefonoCelular == null ||
      this.telefonoCelular === undefined ||
      this.telefonoCelular === this.SIN_TELEFONO_VALIDO
    ) {
      this.modalSinCelularValido = true;
      return;
    }

    if (this.validacionCuentasVigenteGiros()) {
      return;
    }

    let validadorSaldosDiscordantes =
      await this.validarSaldosDiscordantesGiro();
    if (validadorSaldosDiscordantes) {
      this.modalValidacionSaldoDiscordante = true;
      return;
    }

    this.cambiarPantalla('ClaveSacuPage', 2);
  }

  /**
   * Función encargada de validar si se puede realizar giro en ambas cuentas.
   * Primera validación : Que cuente con cuentas vigentes ( apv - cuenta 2)
   * Segunda validación : Validar que ambas cuentas cuenten con saldo.
   */
  private validacionCuentasVigenteGiros() {
    if (this.validarCuentasVigentesGiro()) {
      this.modalValidacionSinCuentasVigentesGiro = true;
      return true;
    }

    if (this.validarSaldoCuentasGiro()) {
      this.modalCuentasSinSaldosGiro = true;
      return true;
    }
    return false;
  }

  /**
   * Encargada de validar si una o ambas cuentas (apv , cuenta 2 ) cuentan con saldo = 0
   * Se buscan con ambos productos , si existen un objeto con saldo 0 & tipo producto.
   * @returns true : ambas cuentas ( apv + cuenta 2) sin saldo.
   */
  validarSaldoCuentasGiro() {
    const validadorCuenta2 = this.productos.find(
      (p: any) => p.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_CUENTA_2
    );
    const validadorCuentaAPV = this.productos.find(
      (p: any) => p.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_APV
    );
    const validadorSaldoCuenta2 = this.productos.find(
      (p: any) =>
        p.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_CUENTA_2 &&
        p.saldoTotal === 0
    );
    const validadorSaldoCuentaAPV = this.validarSaldoAPV();

    // Combinamos todas las condiciones que retornan true
    const sinSaldoCuenta2 =
      validadorCuenta2 && !validadorCuentaAPV && validadorSaldoCuenta2;
    const sinSaldoCuentaAPV =
      validadorCuentaAPV && !validadorCuenta2 && validadorSaldoCuentaAPV;
    const ambasSinSaldo = validadorSaldoCuenta2 && validadorSaldoCuentaAPV;

    return !!(sinSaldoCuenta2 || sinSaldoCuentaAPV || ambasSinSaldo);
  }

  /**
   * Encargado de validar saldo en producto APV
   * @returns
   * true: Cuenta sin saldo.
   */
  validarSaldoAPV(): boolean {
    // Si el usuario es pensionado se debe realizar una validacion especial
    if (
      this.esPensionado &&
      !this.utilGiro.validarCuentaConSaldoAPVPensionado(
        this.productos,
        this.CONSTANTES_GIRO.ID_PRODUCTO_APV
      )
    ) {
      return true;
    }
    // En el caso contrario , se realiza la validación normal , buscando el saldo total = 0 en el producto apv
    let validadorSaldoCuentaAPV = this.productos.find(
      (producto: any) =>
        producto.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_APV &&
        producto.saldoTotal === 0
    );
    if (validadorSaldoCuentaAPV !== undefined) {
      return true;
    }

    return false;
  }

  /**
   * Encargado de validar si existe apertura de un productos APV o Cuenta 2
   * @returns true : sin cuentas vigentes para giro
   */
  validarCuentasVigentesGiro(): boolean {
    const validadorCuenta2 = this.productos.find(
      (producto: any) =>
        producto.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_CUENTA_2
    );
    const validadorCuentaAPV = this.productos.find(
      (producto: any) =>
        producto.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_APV
    );

    if (validadorCuenta2 === undefined && validadorCuentaAPV === undefined) {
      return true;
    }

    return false;
  }

  /**
   * Función encargada de validar si en una o ambas cuentas ( apv o cuenta 2 ) cuenta con saldos discordantes
   * En el caso de que se encuentre una o ambas cuenta con saldo discordante , se muestra modal de validación saldo discordante.
   * @returns
   * True  = saldos discordantes.
   * False = sin saldos discordantes.
   */
  async validarSaldosDiscordantesGiro(): Promise<boolean> {
    // Validadores de producto
    const validadorCuenta2 = this.productos.find(
      (producto: any) =>
        producto.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_CUENTA_2
    );
    const validadorCuentaAPV = this.productos.find(
      (producto: any) =>
        producto.idProducto === this.CONSTANTES_GIRO.ID_PRODUCTO_APV
    );

    // Validadores de saldo discordante
    const validadorDiscordanteCuenta2 = validadorCuenta2
      ? await this.validarSaldoDiscordanteTipoCuenta(
          this.CONSTANTES_GIRO.NOMBRE_PRODUCTO_CUENTA_2
        )
      : false;

    const validadorDiscordanteAPV = validadorCuentaAPV
      ? await this.validarSaldoDiscordanteTipoCuenta(
          this.CONSTANTES_GIRO.NOMBRE_PRODUCTO_APV
        )
      : false;

    // Combinamos todas las condiciones que retornan true
    const soloCuenta2Discordante =
      validadorCuenta2 && !validadorCuentaAPV && validadorDiscordanteCuenta2;
    const soloCuentaAPVDiscordante =
      validadorCuentaAPV && !validadorCuenta2 && validadorDiscordanteAPV;
    const ambasDiscordantes =
      validadorCuenta2 &&
      validadorCuentaAPV &&
      validadorDiscordanteCuenta2 &&
      validadorDiscordanteAPV;

    return !!(
      soloCuenta2Discordante ||
      soloCuentaAPVDiscordante ||
      ambasDiscordantes
    );
  }

  /**
   * Función encargada de validar a nivel de servicio si el tipo de cuenta cuenta con saldo discordantesñ
   * Retorna
   * TRUE , en el caso de que cuente con saldo discordante
   * @param tipoCuentaValidar
   */
  async validarSaldoDiscordanteTipoCuenta(
    tipoCuentaValidar: string
  ): Promise<boolean> {
    const loading = await this.contextoAPP.mostrarLoading();

    return firstValueFrom(
      this.giroService.validarGiro(tipoCuentaValidar, this.rut, this.dv).pipe(
        map(
          (res: any) =>
            res?.['Context-Error']?.cod ===
            this.CONSTANTES_GIRO.CODIGO_ERROR_SALDOS_DISCORDANTES
        ),
        catchError((error: any) => {
          if (error.status === this.CONSTANTES_HOME.CODIGO_ERROR_SESION)
            this.redireccionLogin();
          else
            this.navCtrl.navigateRoot(
              'ErrorGenericoPage',
              this.utilService.generarNavegacionExtra(
                CONSTANTES_ERROR_GENERICO.home
              )
            );
          return of(false);
        }),
        finalize(() => this.contextoAPP.ocultarLoading(loading))
      )
    );
  }

  /**
   * Validar que el cliente no pueda realizar más de 10 depósitos al día (independiente si es Cuenta 2 o APV).
   * Incluye los realizados desde la web
   */
  async validarCantidadDepositosDiarios() {
    const loading = await this.contextoAPP.mostrarLoading();
    return new Promise((resolve, reject) => {
      let parametroDD = 'DEPOSITODIA;' + this.rut + ';0;10';
      this.depDirService.obtenerParametros(parametroDD).subscribe(
        (response: any) => {
          if (response && response.estado == 'OK' && response.parametros) {
            // Buscamos dentro de la respuesta de parametros , el valor "SIN".
            // SIN = sin restricciones | CON = con restricciones.
            let validador = response.parametros.find(
              (parametro: any) =>
                parametro.key == 'RESTRICCIONDEP' && parametro.value == 'SIN'
            );
            if (validador) {
              this.cambiarPantalla('IngresoDatosPage');
            } else {
              this.utilService.mostrarToast(this.MAX_DEPOSITOS_DIARIOS);
            }
          } else {
            this.utilService.mostrarToast(this.MAX_DEPOSITOS_DIARIOS_ERROR);
          }
          this.contextoAPP.ocultarLoading(loading);
        },
        (error) => {
          this.contextoAPP.ocultarLoading(loading);
          this.utilService.mostrarToast(this.MAX_DEPOSITOS_DIARIOS_ERROR);
          if (error.status === this.CONSTANTES_HOME.CODIGO_ERROR_SESION) {
            this.redireccionLogin();
          }
          resolve(false);
        }
      );
    });
  }

  /**
   * Método que determina a que pagina se redirige desde el home y posee bon boton back al menú.
   *
   * Se asume que si la variable 'option' es igual a 1 se utilizaran textos de flujo CDF en clave SACU.
   * Se asume que si la variable 'option' es igual a 2 se utilizaran textos de flujo GIRO en clave SACU.
   *
   * @param pagina {string} nombre pagina de destino.
   * @param option {number} valor que detemina si se ingresa a CDF o Giro.
   */
  async cambiarPantalla(pagina: string, option?: number) {
    // Mapeo de páginas a eventos
    const eventosMapa: Record<string, string> = {
      'certificado-home': 'Acceso_Certificados',
      HomeClienteSimuladorPage: 'Acceso_Simulador_Pension_Privado',
      ClaveSacuPage: 'Acceso_Administra_tus_Fondos',
      IngresoDatosPage: 'Acceso_Deposito_Directo',
    };

    // Registrar evento si existe
    if (eventosMapa[pagina]) {
      this.utilService.setLogEvent('event_habitat', {
        option: eventosMapa[pagina],
      });
    }

    const navigationExtras: NavigationExtras = {
      queryParams: { option: JSON.stringify(option) },
    };

    if (pagina === 'simulator-start' && this.ocultarSimuladorPension) {
      this.utilService.mostrarToast(
        '¡Pronto! Estamos trabajando en mejoras para darte un mejor servicio.'
      );
    } else if (pagina === 'planes-step-uno') {
      AppComponent.accesoPlanes = 'Home';
      this.navCtrl.navigateForward(pagina);
    } else {
      this.navCtrl.navigateForward([pagina], navigationExtras);
    }
  }

  estiloSlider(slider: any) {
    // Aplicar logica
  }

  async registrarTrazabilidad() {
    let parametroTraza = {} as ParametroTraza;
    parametroTraza.uuid = '';
    const datosGenerales = {
      traza: CONSTANTES_TRAZAS_HOME,
      uuid: this.uuid,
      rut: this.rut,
      dv: this.dv,
    };

    parametroTraza = this.contextoAPP.generarObjetoTraza(
      datosGenerales,
      CONSTANTES_TRAZAS_HOME
    );
    parametroTraza.datos = `${CONSTANTES_TRAZAS_HOME.DATOS} ${this.rut}-${this.dv}`;
    this.trazabilidadProvider
      .registraTrazaUUID(parametroTraza, this.rut, this.dv)
      .subscribe(
        (response) => {},
        async (error) => {
          if (error.status === this.CONSTANTES_HOME.CODIGO_ERROR_SESION) {
            this.redireccionLogin();
          }
        }
      );
  }

  /**
   * Encargada de realizar acción de llamar a contact center.
   */
  llamarContactCenter() {
    window.open('tel:' + this.CONSTANTES_GIRO.TELEFONO_CONTACT, '_system');
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  /**
   * En caso de tener problemas con la sesión del usuario, se redirige hacia
   * pantalla login para volver a ingresar credenciales
   */
  redireccionLogin() {
    this.navCtrl.navigateRoot('signin');
  }

  /**
   * Encargado de llevar al usuario a la pantalla de actualizar datos.
   */
  irActualizarDatos() {
    this.navCtrl.navigateForward('actualizar-datos-home');
  }

  /**
   * Encargado de llevar al usuario a la pantalla de Evolución de tus ahorros.
   */
  irEvolucionAhorros() {
    this.navCtrl.navigateForward('EvolucionAhorrosPage');
  }

  /**
   * Metodo encargado de obtener datos de barra informativa.
   */
  async obtenerBarraInformativa(): Promise<void> {
    const datos = await this.contextoAPP.obtenerBarraInformativa();

    if (datos && this.validarDesliegueBarra(datos)) {
      this.datosBarraInformativa = datos;
    }
  }

  /**
   * Valida si existe alguna url valida de redirección.
   * @param datos barra informativa
   * @returns si existe al menos una url valida de redirección
   */
  validarDesliegueBarra(datos: BarraInformativaInterface): boolean {
    const REDIRIGE = CONSTANTES_REDIRECCION_APP as Record<string, string>;

    const urlAppCorrecta = REDIRIGE[datos.app] !== undefined;
    const urlHttpCorrecta = this.validarTexto(datos.url);

    const tituloCorrecto = this.validarTexto(datos.titulo);
    const subtituloCorrecto = this.validarTexto(datos.subtitulo);
    const tituloBoton = this.validarTexto(datos.titulo_boton);

    const textosCorrectos = tituloCorrecto && subtituloCorrecto && tituloBoton;

    return (urlAppCorrecta || urlHttpCorrecta) && textosCorrectos;
  }

  /**
   * Valida si el texto no es nulo y tiene texto
   *
   * @param texto a validar
   * @returns texto valido o invalido
   */
  validarTexto(texto: string): boolean {
    return texto !== undefined && texto !== null && texto !== '';
  }

  /**
   * Metodo encargado de redireccionar a funcionalidad de la app o navegador según prelación.
   */
  redireccionarBarra(): void {
    const appKey = this.datosBarraInformativa?.app ?? '';
    // Ensanchamos el tipo SOLO aquí
    const REDIRS = CONSTANTES_REDIRECCION_APP as Record<string, string>;

    const urlRedireccionAPP: string | false = REDIRS[appKey] ?? false;
    if (urlRedireccionAPP) {
      this.navCtrl.navigateForward(urlRedireccionAPP);
    } else {
      this.utilService.openWithSystemBrowser(this.datosBarraInformativa.url);
    }
  }

  /**
   * Metodo encargado de sincronizar los slides de cuentas
   */
  async cambiarCuenta(): Promise<void> {
    const indexSlideActivo = await this.sliderDetalleCuentas.swiper.activeIndex;
    this.sliderCuentas.swiper.slideTo(indexSlideActivo);
  }

  /**
   * Metodo encargado de sincronizar los slides de detalle de cuentas al hacer swipe
   */
  async cambiarDetalleCuentaSlider(): Promise<void> {
    const indexSlideActivo = await this.sliderCuentas.swiper.activeIndex;
    this.sliderDetalleCuentas.swiper.slideTo(indexSlideActivo);
  }

  /**
   * Metodo encargado de sincronizar los slides de detalle de cuentas
   */
  cambiarDetalleCuenta(indexCuenta: number): void {
    this.sliderDetalleCuentas.swiper.slideTo(indexCuenta);
  }

  /**
   * Metodo encargado de formatear el nombre del producto
   */
  formatearNombreProducto(
    nombreProducto: string,
    codigoProducto: string
  ): string {
    let nombreProductoTransformado;
    const constantes = CONSTANTES_HOME_CLIENTE;

    if (codigoProducto === constantes.CODIGO_CUENTA_OBLIGATORIA) {
      nombreProductoTransformado = nombreProducto.replace(
        constantes.ESPACIO,
        constantes.SALTO_LINEA
      );
    } else {
      nombreProductoTransformado = nombreProducto.replace(
        constantes.TEXTO_REEMPLAZAR,
        constantes.TEXTO_REEMPLAZAR_SALTO
      );
    }

    return nombreProductoTransformado;
  }

  abrirModalInformativoPrudential() {
    this.modalInformativoPrudential = true;
  }
}
