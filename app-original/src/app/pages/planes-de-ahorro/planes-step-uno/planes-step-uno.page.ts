import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import {
  CONSTANTES_PLANES_STEP_1,
  TRAZAS_PLANES,
  CONSTANTES_TRAZA_GENERAL,
  CONSTANTES_TRAZAS_PLAN,
} from 'src/app/pages/planes-de-ahorro/util/constantes.planes';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { ClienteCuentasDatos, PlanesService, UtilService, TrazabilidadService } from 'src/app/services';
import { SolicitudCuentaPlanAhorro } from 'src/app/services/api/data/solicitud.cuenta.planahorro';
import { NavigationExtras } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { ObtenerDataPlanesService } from '../util/obtenerDataPlanes.service';
import { AppComponent } from 'src/app/app.component';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';

@Component({
  selector: 'app-planes-step-uno',
  templateUrl: './planes-step-uno.page.html',
  styleUrls: ['./planes-step-uno.page.scss'],
})
export class PlanesStepUnoPage implements OnInit {
  // Referencia a constantes planes 1 , utilizada directamente en la vista.
  readonly CONSTANTES = CONSTANTES_PLANES_STEP_1;

  // Referencia a constantes para trazas solo para módulo planes.
  readonly CONSTANTES_TRAZA = TRAZAS_PLANES;
  // Referencia a constantes generales para trazas
  readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;
  // Tipo de producto seleccionado por el usuario , valores CAV (Cuenta 2) o CCICV (APV)
  idTipoProducto: number;
  // Referencia al rut
  rut: number;
  // Referencia al digito verificador.
  dv: string;
  // Referencia a la edad del usuario
  edad: number;
  // referencia email usuario
  email: string;
  // referencia primer nombre usuario
  primerNombre: string;
  // referencia segundo nombre usuario
  segundoNombre: string;
  // referencia primer apellido usuario
  apellidoPaterno: string;
  // referencia segundo apellido usuario
  apellidoMaterno: string;
  // Validador usuario pensionado
  esPensionado: boolean;
  // referencia celular usuario
  telefonoCelular: string;
  // Slides utilizados en modal informativo de tipos de cuentas.
  slides: any[];
  // Slides utilizados en modal informativo de regimenes APV.
  slidesRegimenesAPV: any[];
  // Slides utilizados en modal informativo de regimenes Cuenta 2.
  slidesRegimenesCuenta2: any[];
  // Indicar para mostrar listado de regimenes.
  mostrarListadoRegimenes: boolean = false;
  // Indicador para mostrar modal detalle planes.
  mostrarFormulario: boolean = false;
  // Indicador de texto informativo inicio ( que se muestra solo la primera vez)
  mostraTextoInformativoInicio = true;

  listadoFormularios: any[] = [];
  mostrarForm: number;
  tituloFormulario: string;
  mostrarModalInformativo: boolean = false;
  mostrarModalRegimen: boolean = false;
  regimenesParaModal: any[];
  mostrarModalEmpleador: boolean = false;
  modalData = {};
  fondoRecaudador = {};
  tipoModal: number;
  fondosDestino: any[] = [];
  cargos: any[] = [];

  regiones: any[] = [];
  comunas: any[] = [];
  mostrarComunas: any[] = [];
  empleadores: any[] = [];

  selectorTipoMoneda: any = {
    header: 'Selecciona Moneda',
  };
  selectorFondoDestino: any = {
    header: 'Selecciona Fondo',
  };

  selectorMesFechaFin: any = {
    header: 'Selecciona Mes',
  };
  selectorAnioFechaFin: any = {
    header: 'Selecciona Año',
  };
  selectorRegimen: any = {
    header: 'Selecciona Régimen',
  };
  selectorOcupacion: any = {
    header: 'Selecciona Ocupación',
  };

  selectorEmpleador: any = {
    header: 'Selecciona Empleador Actual',
  };

  selectorRegion: any = {
    header: 'Selecciona Región',
  };
  selectorComuna: any = {
    header: 'Selecciona Comuna',
  };

  mesesTermino: any[] = [];
  aniosTermino: any[] = [];

  tiposMonedas: any[] = [];
  regimenes: any[] = [];

  rentaMinima: string;
  rentaMaxima: string;
  rentaMinimaTexto: string;
  rentaMaximaTexto: string;
  productoAnterior: number;

  solicitudDePlan: SolicitudCuentaPlanAhorro;

  fondoSeleccionado: number;
  regimenSeleccionado: number;
  tipoSeleccionado: number;
  cargoSeleccionado: number;
  regionSeleccionada: number;
  comunaSeleccionada: number;
  empleadorSeleccionado: number;

  // Variables de resplado para cuando se cierre un formulario y se debe volver los campos
  // a su estado original, estas variables reciben los parametros del objeto solicitud
  // cuando se guarda un formario, en caso de cerrar el formulario (con el boton X), el
  // objeto recupera los datos de estas variables

  //Form 1
  copiaIdTipoSeleccionado: number;
  copiaNombreTipoSeleccionado: string;
  copiaMontoSeleccionado: string;
  copiaIdFondoSeleccionado: number;
  copiaNombreFondoSeleccionado: string;
  copiaIdRegimenSeleccionado: number;
  copiaNombreRegimenSeleccionado: string;
  copiaFechaIndefinida: boolean = true;
  copiaMesSeleccionado: number;
  copiaAnioSeleccionado: number;
  //Form 2
  copiaIdCargoSeleccionado: number;
  copiaNombreCargoSeleccionado: string;
  copiaRentaImponible: string;
  //Form 3
  copiaIdEmpleadorSeleccionado: number;
  copiaNombreEmpleadorSeleccionado: string;
  copiaIdRegionSeleccionada: number;
  copiaNombreRegionSeleccionada: string;
  copiaIdComunaSeleccionada: number;
  copiaNombreComunaSeleccionada: string;
  copiaCalle: string;
  copiaNumero: string;
  copiaOficina: string;
  copiaCorreo: string;
  empleadorSelec = {};
  empleadoresEnPlanes: any = [];
  fondos = [];
  agregaSelectorAnios: boolean = false;

  /**
   * UUID utilizado en las trazas del flujo
   */
  uuid: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private contextoAPP: ContextoAPP,
    private utilService: UtilService,
    private clienteCuentasDatos: ClienteCuentasDatos,
    private planesService: PlanesService,
    private trazabilidadService: TrazabilidadService,
    private obtenerDataPlanes: ObtenerDataPlanesService
  ) {
    this.slidesRegimenesAPV = this.CONSTANTES.SLIDES_REGIMENES_APV;
    this.slidesRegimenesCuenta2 = this.CONSTANTES.SLIDES_REGIMENES_CUENTA_2;
  }

  /**
   * Al inicar se valida que el acceso al módulo no sea desde el menú
   * para evitar que se la caga de datos se haga dos veces
   */
  async ngOnInit() {
    this.uuid = this.utilService.generarUuid();

    if (AppComponent.accesoPlanes != this.CONSTANTES.ACCESO_MENU) {
      this.reiniciarData();
      this.asignacionInicial();
    }
  }

  ionViewWillEnter() {
    /**
     * Debido a que al acceder al módulo desde el menú no se borran los datos
     * previamente seleccionados, se debe hacer un reset de todas las variables
     * para este caso y asi utilizar el módulo de forma limpia
     */
    if (AppComponent.accesoPlanes === this.CONSTANTES.ACCESO_MENU) {
      this.idTipoProducto = undefined!;
      this.mostraTextoInformativoInicio = true;
      this.mostrarListadoRegimenes = false;
      this.mostrarFormulario = false;
      this.listadoFormularios = [];
      this.reiniciarData();
      this.asignacionInicial();
    }
  }

  /**
   * Asignacion de variables iniciales para utilizar en page
   */
  asignacionInicial() {
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    this.edad = this.contextoAPP.datosCliente.edad;
    this.primerNombre = this.contextoAPP.datosCliente.nombre;
    this.segundoNombre = this.contextoAPP.datosCliente.segundoNombre;
    this.apellidoPaterno = this.contextoAPP.datosCliente.apellidoPaterno;
    this.apellidoMaterno = this.contextoAPP.datosCliente.apellidoMaterno;
    this.solicitudDePlan = new SolicitudCuentaPlanAhorro();
    this.cargarEmpleadores();
  }

  /**
   * Se crea listado de formularios, el primer elemento varia segun tipo de cuenta seleccionada
   * @param productoId
   */
  setListado(productoId) {
    this.listadoFormularios = [
      {
        id: 0,
        nombre: productoId == this.CONSTANTES.ID_PRODUCTO_CUENTA_2 ? 'Datos de Cuenta 2' : 'Datos de APV',
        confirmado: false
      },
      {
        id: 1,
        nombre: this.CONSTANTES.FORMULARIO_2,
        confirmado: false
      },
      {
        id: 2,
        nombre: this.CONSTANTES.FORMULARIO_3,
        confirmado: false
      },
    ];
  }

  /**
   * Encargada de mostrar modales de validación de planes.
   * Se el usuario no cumple con alguna validación ,se mostrara un modal de error.
   * En el caso de que el usuario cumple, se continua con la carga de regimenes.
   * @param tipoCuentaValidar
   */
  async validarTipoCuenta(tipoCuentaValidar: string) {
    const loading = await this.contextoAPP.mostrarLoading();
    this.reiniciarData();
    this.agregaSelectorAnios = false;
    this.productoAnterior = this.idTipoProducto;

    const cuentasUsuario = this.clienteCuentasDatos.productosCliente.value;
    this.idTipoProducto =
      tipoCuentaValidar == this.CONSTANTES.NOMBRE_PRODUCTO_CUENTA_2 ? this.CONSTANTES.ID_PRODUCTO_CUENTA_2 : this.CONSTANTES.ID_PRODUCTO_APV;

    try {
      const esCuenta2 = this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2;
      const esAPV = this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV;

      if (esCuenta2) {
        const exito = await this.validarCuenta2(cuentasUsuario);
        if (!exito) return;
      }

      if (esAPV) {
        const exito = await this.validarAPV(cuentasUsuario);
        if (!exito) return;
      }

      this.setListado(this.idTipoProducto);
      this.mostraTextoInformativoInicio = false;
      this.mostrarListadoRegimenes = true;
    } catch (e) {
      await this.registrarTrazabilidad(
        this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_ERROR.CODIGO_OPERACION
          : CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_ERROR.CODIGO_OPERACION
      );
    } finally {
      this.contextoAPP.ocultarLoading(loading);
    }
  }

  // Valida que el usuario ya tenga cuenta2
  private async validarCuenta2(cuentasUsuario: any[]): Promise<boolean> {
    // Si el usuario no tiene cuentas se muestra toast
    if (cuentasUsuario.length === 0) {
      this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_CUENTA_OBLIGATORIA);
      this.idTipoProducto = this.productoAnterior;
      return false;
    }

    // Si tiene cuentas, se verifica qué cuentas tiene
    const tieneCuenta2 = cuentasUsuario.find((cuenta: any) => cuenta.idProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2);
    const tieneCuentaObligatoria = cuentasUsuario.find((cuenta: any) => cuenta.idProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_OBLIGATORIA);
    const tieneCuentaCCIAV = cuentasUsuario.find((cuenta: any) => cuenta.idProducto === this.CONSTANTES.ID_PRODUCTO_CCIAV);

    if (!tieneCuenta2) {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_INICIO.CODIGO_OPERACION);
      return true;
    }
    if (!tieneCuentaObligatoria && !tieneCuentaCCIAV) {
      this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_CUENTA_OBLIGATORIA);
      this.idTipoProducto = this.productoAnterior;
      return false;
    }
    // En caso de tener, se puede continuar con el proceso
    this.fondoRecaudador = tieneCuenta2.fondos.find((fondo: any) => fondo.esRecaudadorActual);
    this.asignarFondo(this.fondoRecaudador);

    this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_INICIO.CODIGO_OPERACION);
    return true;
  }

  private asignarFondo(fondo: any) {
    if (fondo) {
      fondo['id_tipo_fondo'] = fondo['idFondo'];
      fondo['nombre_tipo_fondo'] = fondo['nombreFondo'];
    }
  }

  private async validarAPV(cuentasUsuario: any[]): Promise<boolean> {
    // El usuario debe ser mayor de edad para APV
    if (this.edad < this.CONSTANTES.MAYORIA_DE_EDAD) {
      this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_MENOR_DE_EDAD);
      this.idTipoProducto = this.productoAnterior;
      return false;
    }

    this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_INICIO.CODIGO_OPERACION);

    const tieneAPV = cuentasUsuario.find((cuenta: any) => cuenta.idProducto === this.CONSTANTES.ID_PRODUCTO_APV);

    // Si el usuario tiene APV, se debe seleccionar el fondo recaudador para el selector de fondo, en caso contrario el selector de fondo tiene todas las opciones disponibles
    if (tieneAPV) {
      this.fondoRecaudador = tieneAPV.fondos.find((fondo: any) => fondo.esRecaudadorActual);
      this.asignarFondo(this.fondoRecaudador);
    }
    return true;
  }

  /**
   * Carga modal para formulario según id seleccionada
   * @param regimenSeleccionado
   */
  async eventoMostrarFormulario(regimenSeleccionado: any) {
    const loading = await this.contextoAPP.mostrarLoading();
    this.mostrarForm = regimenSeleccionado.id;
    if (this.mostrarForm === this.CONSTANTES.FORMULARIO_CUENTAS) {
      this.mostrarFormularioCuentas(loading);
    } else if (this.mostrarForm === this.CONSTANTES.FORMULARIO_TRABAJO) {
      this.mostrarFormularioTrabajo(loading);
    } else if (this.mostrarForm === this.CONSTANTES.FORMULARIO_EMPLEADOR) {
      this.mostrarFormularioEmpleador(loading);
    }
  }

  /**
   * Encargado de mostrar formulario empleador
   * @param loading
   */
  async mostrarFormularioEmpleador(loading) {
    this.tituloFormulario = this.CONSTANTES.FORMULARIO_3;

    try {
      this.regiones = await this.planesService.obtenerRegiones(this.rut, this.dv).toPromise();
      this.comunas = await this.planesService.obtenerComunas(this.rut, this.dv).toPromise();
      this.empleadores = await this.planesService.obtenerEmpleadores(this.rut, this.dv).toPromise();

      this.normalizarRegiones();
      this.normalizarComunas();
      this.empleadores = this.filtrarYNormalizarEmpleadores(this.empleadores);

      await this.asignarVariablesRespaldo(this.mostrarForm);

      this.registrarTrazabilidad(
        this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_3_INICIO.CODIGO_OPERACION
          : CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_3_INICIO.CODIGO_OPERACION
      );
      this.mostrarFormulario = true;
    } catch (error) {
      this.registrarTrazabilidad(
        this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_3_ERROR.CODIGO_OPERACION
          : CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_3_ERROR.CODIGO_OPERACION
      );
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
    } finally {
      this.contextoAPP.ocultarLoading(loading);
    }
  }

  /**
   * Se eliminan los espacios al final de los nombres de las regiones y se ordenan alfabeticamente
   */
  private normalizarRegiones(): void {
    this.regiones = this.regiones
      .map((region: any) => ({
        ...region,
        nombre_region: region.nombre_region.trim(),
      }))
      .sort((a, b) => a.nombre_region.localeCompare(b.nombre_region));
  }

  /**
   * Corrige formato de comunas, ya que las comunas retornadas por el servicio
   * presentan problemas con la letra ñ
   */
  private normalizarComunas(): void {
    this.comunas = this.comunas
      .map((comuna: any) => {
        let nombre = comuna.nombre_comuna.split('?').join('Ñ').toLowerCase();
        nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).trim();
        return { ...comuna, nombre_comuna: nombre };
      })
      .sort((a, b) => a.nombre_comuna.localeCompare(b.nombre_comuna)); // Comunas ordenadas alfabeticamente
  }

  /**
   * Filtra que el usuario logeado y el empleador no tengan el mismo rut, porque no se debe mostrar en el listado
   */
  private filtrarYNormalizarEmpleadores(empleadores: any[]): any[] {
    const rutUsuario = `${this.rut}-${this.dv}`;
    const empleadoresAMostrar = empleadores.filter((empleador) => {
      const rutEmpleador = `${empleador.rut_empleador}-${empleador.dv_empleador}`;
      // Si el usuario logeado y el empleador tienen el mismo rut, no se debe mostrar en el listado
      if (rutEmpleador === rutUsuario) return false;

      empleador.email_empleador = this.obtenerCorreoPrioritario(empleador.email_empleador);

      // Si el empleador no tiene razón social, se debe utilizar el rut del empleador
      empleador.razon_social = empleador.razon_social || rutEmpleador;

      const yaEstaEnPlan = this.empleadoresEnPlanes.some(
        (empleadorEnPlan: any) =>
          empleadorEnPlan.rut === empleador.rut_empleador &&
          empleadorEnPlan.cuenta ===
            (this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2 ? this.CONSTANTES.NOMBRE_CUENTA2 : this.CONSTANTES.NOMBRE_APV)
      );

      return !yaEstaEnPlan;
    });

    return this.removerEmpleadoresDuplicados(empleadoresAMostrar);
  }

  /**
   * En caso de que el empleador tenga más de un correo, se debe dar prioridad al
   * que tenga tipo "COM", si no lo contiene, se busca al tipo "EMPL" y si este
   * no se encuentra, se busca al tipo "PART"
   */
  private obtenerCorreoPrioritario(correos: any[]): string | undefined {
    if (!Array.isArray(correos)) return undefined;
    const prioridades = [this.CONSTANTES.PRIORIDAD_1_DIRECCIONES, this.CONSTANTES.PRIORIDAD_2_DIRECCIONES, this.CONSTANTES.PRIORIDAD_3_DIRECCIONES];

    for (const tipo of prioridades) {
      const encontrado = correos.find((email) => email.tipo_correo === tipo);
      if (encontrado) return encontrado.email;
    }

    return undefined;
  }

  private removerEmpleadoresDuplicados(listaEmpleadores: any[]): any[] {
    return listaEmpleadores.reduce(
      (empleador, actual) => (empleador.some((emp: any) => emp.id_mae_empleador === actual.id_mae_empleador) ? empleador : [...empleador, actual]),
      []
    );
  }

  /**
   * Encargado de mostrar formulario trabajo
   * @param loading
   */
  mostrarFormularioTrabajo(loading) {
    this.tituloFormulario = this.CONSTANTES.FORMULARIO_2;
    this.planesService.obtenerCargos(this.rut, this.dv).subscribe(
      async (respuestaCargos: any) => {
        this.cargos = respuestaCargos;
        this.planesService.obtenerTopesImponibles(this.rut, this.dv).subscribe(
          async (respuestaTopes: any) => {
            this.rentaMinima = respuestaTopes.minimo_imponible;
            this.rentaMaxima = respuestaTopes.maximo_imponible_pesos;
            this.validarRenta(this.solicitudDePlan.rentaImponible, 'cargarFormulario');
            await this.asignarVariablesRespaldo(this.mostrarForm);

            if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
              this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_INICIO.CODIGO_OPERACION);
            } else {
              this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_INICIO.CODIGO_OPERACION);
            }
            this.mostrarFormulario = true;
            this.contextoAPP.ocultarLoading(loading);
          },
          async (error) => {
            if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
              this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_ERROR.CODIGO_OPERACION);
            } else {
              this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_ERROR.CODIGO_OPERACION);
            }
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
          }
        );
      },
      async (error) => {
        if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
          this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_ERROR.CODIGO_OPERACION);
        } else {
          this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_ERROR.CODIGO_OPERACION);
        }
        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
      }
    );
  }

  /**
   * Encargado de mostrar formulario cuentas
   * @param loading
   */
  async mostrarFormularioCuentas(loading) {
    const tipoProducto = this.obtenerNombreProducto();

    try {
      this.tiposMonedas = await this.planesService.obtenerMoneda(tipoProducto, this.rut, this.dv).toPromise();
      const respuestaRegimenes = await this.planesService.obtenerRegimenes(tipoProducto, this.rut, this.dv).toPromise();

      this.fondosDestino = [];
      this.tituloFormulario =
        this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? this.CONSTANTES.FORMULARIO_PRODUCTO_CUENTA_2
          : this.CONSTANTES.FORMULARIO_PRODUCTO_APV;
      this.setPrimerDescuento();

      if (this.fondoRecaudador?.['id_tipo_fondo']) {
        const fondo = {
          id_tipo_fondo: this.fondoRecaudador['id_tipo_fondo'],
          nombre_tipo_fondo: this.fondoRecaudador['nombre_tipo_fondo'],
        };
        this.fondosDestino.push(fondo);
        this.fondoSeleccionado = fondo.id_tipo_fondo;
        this.solicitudDePlan.fondoSeleccionado = fondo;
      } else {
        await this.cargarFondosAlternativos(loading);
      }

      if (!this.agregaSelectorAnios) {
        this.llenarCamposFechaTermino(this.solicitudDePlan.primerDescuento.getFullYear());
        this.agregaSelectorAnios = true;
      }

      this.tipoSeleccionado = this.CONSTANTES.TIPO_MONEDA_PESO;
      this.asignarTipoMonto(this.tipoSeleccionado);
      this.regimenes = this.filtrarRegimenes(respuestaRegimenes);

      await this.asignarVariablesRespaldo(this.mostrarForm);

      this.registrarTrazabilidad(
        this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_INICIO.CODIGO_OPERACION
          : CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_INICIO.CODIGO_OPERACION
      );
      this.mostrarFormulario = true;
    } catch (error) {
      this.registrarTrazabilidad(
        this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_ERROR.CODIGO_OPERACION
          : CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_ERROR.CODIGO_OPERACION
      );
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
    } finally {
      this.contextoAPP.ocultarLoading(loading);
    }
  }

  private obtenerNombreProducto(): string {
    return this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2 ? this.CONSTANTES.NOMBRE_CAV : this.CONSTANTES.NOMBRE_APV;
  }

  private setPrimerDescuento(): void {
    this.solicitudDePlan.primerDescuento = new Date();
    this.solicitudDePlan.primerDescuento.setMonth(this.solicitudDePlan.primerDescuento.getUTCMonth() + 1);
  }

  private async cargarFondosAlternativos(loading: any): Promise<void> {
    try {
      const respuestaFondos = await this.planesService.obtenerFondos(this.rut, this.dv).toPromise();
      this.fondosDestino = respuestaFondos;
    } catch {
      const traza =
        this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2
          ? CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_ERROR
          : CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_ERROR;
      this.registrarTrazabilidad(traza.CODIGO_OPERACION);
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
      throw new Error('Fondos error');
    }
  }

  // Si es Cuenta 2 filtramos arreglo para que solo se muestre regimen general y se asigna a variable para envío
  private filtrarRegimenes(regimenes: any[]): any[] {
    if (this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      const filtrados = regimenes.filter((r) => r.id_regimen === this.CONSTANTES.VALOR_ID_REG_GENERAL);
      this.regimenSeleccionado = filtrados[0]?.id_regimen;
      this.asignarObjetoRegimen(this.regimenSeleccionado);
      return filtrados;
    }
    return regimenes;
  }

  /**
   *  Se completan campos para mostrar en selector de fecha de término
   *  (Los ids comienzan en cero debido a que el formato Date enumera los meses de esta forma)
   * @param anio
   */
  llenarCamposFechaTermino(anio: number) {
    this.mesesTermino = this.CONSTANTES.MESES;

    if (this.aniosTermino.length == 0) {
      for (let x = 0; x <= 10; x++) {
        this.aniosTermino.push(anio + x);
      }
    }
  }

  /**
   * Encargada de ocultar detalle & regresar objetos a estado inicial.
   * Además , limpia variables de objeto a mostrar , en caso que no haya confirmado.
   */
  eventoCerrarFormulario(form) {
    this.mostrarFormulario = false;
    this.fondosDestino = [];
    if (form === this.CONSTANTES.ID_FORMULARIO_DATOS) {
      this.solicitudDePlan.montoSeleccionado = undefined!;
    } else if (form === this.CONSTANTES.ID_FORMULARIO_TRABAJO) {
      this.solicitudDePlan.rentaImponible = undefined!;
    } else if (form === this.CONSTANTES.ID_FORMULARIO_EMPLEADOR) {
      this.solicitudDePlan.calle = undefined!;
      this.solicitudDePlan.numero = undefined!;
      this.solicitudDePlan.oficina = undefined!;
      this.solicitudDePlan.correo = undefined!;

      this.solicitudDePlan.regionSeleccionada.id_region = undefined!;
      this.solicitudDePlan.regionSeleccionada.nombre_region = undefined!;
      this.solicitudDePlan.comunaSeleccionada.id_comuna = undefined!;
      this.solicitudDePlan.comunaSeleccionada.nombre_comuna = undefined!;
      this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador = undefined!;
      this.solicitudDePlan.empleadorSeleccionado.razon_social = undefined!;
    }
    this.asignarVariablesRespaldo(form);
  }

  /**
   * Valida que el campo monto cumpla con las condiciones del tipo
   * de moneda seleccionado
   * @param monto
   */
  validarMonto(monto: string, desde: string, tipo: string) {
    if (monto === undefined) {
      this.solicitudDePlan.montoSeleccionado = undefined!;
      return false;
    }

    monto = monto.toString().replace('$', '');
    monto = this.contextoAPP.limpiaCaracteres(monto) + '';

    let montoNumerico = Number(this.eliminarFormato(monto));

    this.formatoMontoDinero(monto, monto, tipo);

    if (this.tipoSeleccionado === this.CONSTANTES.ID_TIPO_UF) {
      // Si es de tipo UF
      return this.validarMontosDetalle(
        this.CONSTANTES.MONTO_MINIMO_UF,
        this.CONSTANTES.MONTO_MAXIMO_UF,
        montoNumerico,
        desde,
        this.CONSTANTES.TEXTO_ERROR_UF
      );
    } else if (this.tipoSeleccionado === this.CONSTANTES.ID_TIPO_PORCENTAJE) {
      // Si es de tipo Porcentaje
      return this.validarMontosDetalle(
        this.CONSTANTES.MONTO_MINIMO_PORCENTAJE,
        this.CONSTANTES.MONTO_MAXIMO_PORCENTAJE,
        montoNumerico,
        desde,
        this.CONSTANTES.TEXTO_ERROR_PORCENTAJE
      );
    } else if (this.tipoSeleccionado === this.CONSTANTES.ID_TIPO_PESOS) {
      // Si es de tipo Porcentaje
      return this.validarMontoPesos(
        this.CONSTANTES.MONTO_MINIMO_PESO,
        this.CONSTANTES.MONTO_MAXIMO_PESO,
        montoNumerico,
        desde,
        this.CONSTANTES.TEXTO_ERROR_MONTO_BAJO_PESO,
        this.CONSTANTES.TEXTO_ERROR_MONTO_ALTO_PESO
      );
    }
  }

  /**
   * Funcion general para validar montos segun minimo y maximo permitidos
   * @param montoMinimo
   * @param montoMaximo
   * @param montoNumerico
   * @param desde
   * @param toast
   */
  validarMontosDetalle(montoMinimo: number, montoMaximo: number, montoNumerico: number, desde: string, toast: string) {
    if (montoNumerico < montoMinimo || montoNumerico > montoMaximo) {
      //Segun de donde se haya llamado la funcion, se muestra toast
      if (desde === 'input' || (desde === 'select' && montoNumerico != undefined)) {
        //Si es llamada desde el selector, se elimina el valor de la variable
        this.utilService.mostrarToast(toast);
      }
      if (desde === 'select') {
        //Si es llamada desde el selector, se elimina el valor de la variable
        this.solicitudDePlan.montoSeleccionado = undefined!;
      }
      return false;
    } else {
      //En caso de cumplir con las validaciones, se retorna true
      return true;
    }
  }

  /**
   * Valida montos para seleccion de peso, se muestras toast distintos para máximo y mínimo
   * @param montoMinimo
   * @param montoMaximo
   * @param montoNumerico
   * @param desde
   * @param toastMinimo
   * @param toastMaximo
   */
  validarMontoPesos(montoMinimo: number, montoMaximo: number, montoNumerico: number, desde: string, toastMinimo: string, toastMaximo: string) {
    if (montoNumerico < montoMinimo) {
      //Si no cumple con el monto mínimo
      if (desde === 'input' || (desde === 'select' && montoNumerico != undefined)) {
        //Segun de donde se haya llamado la funcion, se muestra toast
        this.utilService.mostrarToast(toastMinimo);
      }
      if (desde === 'select') {
        //Si es llamada desde el selector, se elimina el valor de la variable
        this.solicitudDePlan.montoSeleccionado = undefined!;
      }
      return false;
    } else if (montoNumerico > montoMaximo) {
      //Si no cumple con el monto máximo
      if (desde === 'input' || (desde === 'select' && montoNumerico != undefined)) {
        //Segun de donde se haya llamado la funcion, se muestra toast
        this.utilService.mostrarToast(toastMaximo);
      }
      if (desde === 'select') {
        //Si es llamada desde el selector, se elimina el valor de la variable
        this.solicitudDePlan.montoSeleccionado = undefined!;
      }
      return false;
    } else {
      //En caso de cumplir con las validaciones, se retorna true
      return true;
    }
  }

  /**
   * Se verifica que la fecha de término seleccionada cumpla su validación
   * (La fecha debe ser minimo la actual mas un mes)
   */
  validarFechaTermino(desde: string) {
    if (
      this.solicitudDePlan.anioSeleccionado != undefined &&
      this.solicitudDePlan.mesSeleccionado != undefined &&
      !this.solicitudDePlan.fechaIndefinida
    ) {
      /**
       * La fecha mínima se calcula agregando un mes a la fecha actual (se definió asi a nivel de valdiaciones)
       */
      let fechaMinima = new Date();
      fechaMinima.setMonth(fechaMinima.getMonth() + 1);

      /**
       * La fecha seleccionada se crea con los datos ingresados
       */
      let fechaSeleccionada = new Date();
      fechaSeleccionada.setMonth(this.solicitudDePlan.mesSeleccionado);
      fechaSeleccionada.setFullYear(this.solicitudDePlan.anioSeleccionado);
      if (fechaMinima > fechaSeleccionada) {
        if (desde == 'mes' || desde == 'anio') {
          this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_FECHA_TERMINO);
        }
        return false;
      } else {
        return true;
      }
    } else if (this.solicitudDePlan.fechaIndefinida) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Valida que el campo renta cumpla con las condiciones de valor mínimo y máximo, en caso
   * de ser llamada desde el evento blur del campo renta, se activan los avisos por toast.
   * @param desde
   */
  validarRenta(monto: string, desde: string): boolean {
    if (!this.rentaMinima || !this.rentaMaxima) return false;

    const rentaMinimaNumerica = this.parsearMontoNumerico(this.rentaMinima);
    const rentaMaximaNumerica = this.parsearMontoNumerico(this.rentaMaxima);

    this.rentaMinimaTexto = this.formatearTextoMonto(this.rentaMinima);
    this.rentaMaximaTexto = this.formatearTextoMonto(this.rentaMaxima);

    const montoLimpio = this.contextoAPP.limpiaCaracteres(monto);
    if (!montoLimpio) return false;

    const montoNumerico = Number(this.eliminarFormato(montoLimpio));

    if (montoNumerico < rentaMinimaNumerica) {
      this.mostrarErrorYFormatear(
        desde,
        monto,
        `${this.CONSTANTES.TEXTO_ERROR_RENTA_MINIMA}${this.CONSTANTES.TEXTO_SIGNO_PESO}${this.rentaMinimaTexto}`
      );
      return false;
    }

    if (montoNumerico > rentaMaximaNumerica) {
      this.mostrarErrorYFormatear(
        desde,
        monto,
        `${this.CONSTANTES.TEXTO_ERROR_RENTA_MAXIMA}${this.CONSTANTES.TEXTO_SIGNO_PESO}${this.rentaMaximaTexto}`
      );
      return false;
    }

    if (desde === 'input') {
      this.formatoMontoDinero(monto, monto, 'rentaImponible');
    }

    return true;
  }

  private parsearMontoNumerico(monto: string): number {
    const sinPuntos = monto.split('.')[0];
    return +sinPuntos.split(',').join('');
  }

  private formatearTextoMonto(monto: string): string {
    const sinPuntos = monto.split('.')[0];
    return sinPuntos.split(',').join('.');
  }

  private mostrarErrorYFormatear(desde: string, monto: string, mensaje: string): void {
    if (desde === 'input') {
      this.formatoMontoDinero(monto, monto, 'rentaImponible');
      this.utilService.mostrarToast(mensaje);
    }
  }

  /**
   * Valida que los campos del formulario de empleador se hallan llenado correctamente
   */
  validarCamposEmpleador(campo: any, desde: string): boolean {
    if (!campo) {
      if (desde == 'input') {
        this.utilService.mostrarToast(this.CONSTANTES.TEXTO_CAMPOS_SIN_COMPLETAR);
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * Elimina caracteres que sobrepasen el limite permitido en un string
   * @param campo
   * @param desde
   * @param maximoCaracteres
   */
  limiteDeCaracteres(campo: any, desde: string, maximoCaracteres: number) {
    if (campo) {
      if (campo.length >= maximoCaracteres) {
        let array = Array.from(campo);
        let nuevaVariable = '';
        for (let x = 0; x < maximoCaracteres; x++) {
          nuevaVariable = '' + nuevaVariable + array[x];
        }
        if (desde === this.CONSTANTES.INGRESO_CALLE) {
          this.solicitudDePlan.calle = nuevaVariable;
        } else if (desde === this.CONSTANTES.INGRESO_NUMERO) {
          this.solicitudDePlan.numero = nuevaVariable;
        } else if (desde === this.CONSTANTES.INGRESO_OFICINA) {
          this.solicitudDePlan.oficina = nuevaVariable;
        } else if (desde === this.CONSTANTES.INGRESO_CORREO) {
          this.solicitudDePlan.correo = nuevaVariable;
        }
      }
    }
  }

  /**
   * Se valida que el fomato del correo ingresado sea válido
   *
   * @param email
   */
  validarEmail(email, desde) {
    if (!email) {
      if (desde == 'input') {
        this.utilService.mostrarToast(this.CONSTANTES.TEXTO_CAMPOS_SIN_COMPLETAR);
      }
      return false;
    } else {
      let expReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!expReg.test(email)) {
        if (desde == 'input') {
          this.utilService.mostrarToast(this.CONSTANTES.TEXTO_FORMATO_CORREO);
        }
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * Funcion al oprimir boton ir en teclado email
   * @param email
   * @param desde
   */
  keyUpEmail(email, desde) {
    Keyboard.hide();
    this.validarEmail(email, desde);
  }

  /**
   * Funcion al oprimir boton ir en teclado oficina
   * @param oficina
   * @param evento
   * @param desde
   */
  keyUpOficina(oficina, evento, desde) {
    Keyboard.hide();
    this.formatoMontoDinero(oficina, evento, desde);
  }

  /**
   * Funcion al oprimir boton ir en teclado número
   * @param numero
   * @param desde
   */
  keyUpNumero(numero, desde) {
    Keyboard.hide();
    this.validarCamposEmpleador(numero, desde);
  }

  /**
   * Funcion al oprimir boton ir en teclado calle
   * @param calle
   * @param desde
   */
  keyUpCalle(calle, desde) {
    Keyboard.hide();
    this.validarCamposEmpleador(calle, desde);
  }

  /**
   * Funcion al oprimir boton ir en teclado monto
   * @param montoSeleccionado
   * @param desde
   * @param texto
   */
  keyUpMonto(montoSeleccionado, desde, texto) {
    Keyboard.hide();
    this.validarMonto(montoSeleccionado, desde, texto);
  }

  /**
   * Funcion al oprimir boton ir en teclado renta
   * @param montoSeleccionado
   * @param desde
   */
  keyUpRenta(montoSeleccionado, desde) {
    Keyboard.hide();
    this.validarRenta(montoSeleccionado, desde);
  }
  /**
   * Procesa solicitud de cada formulario y asigna campos seleccionados a variables de respaldo
   */
  guardarFormulario(desde: number) {
    if (desde === this.CONSTANTES.ID_FORMULARIO_DATOS) {
      this.copiaMontoSeleccionado = this.solicitudDePlan.montoSeleccionado;
      this.copiaIdTipoSeleccionado = this.solicitudDePlan.tipoSeleccionado.id_tipo_moneda;
      this.copiaNombreTipoSeleccionado = this.solicitudDePlan.tipoSeleccionado.nombre_tipo_moneda;
      this.copiaIdFondoSeleccionado = this.solicitudDePlan.fondoSeleccionado.id_tipo_fondo;
      this.copiaNombreFondoSeleccionado = this.solicitudDePlan.fondoSeleccionado.nombre_tipo_fondo;
      this.copiaIdRegimenSeleccionado = this.solicitudDePlan.regimenSeleccionado.id_regimen;
      this.copiaNombreRegimenSeleccionado = this.solicitudDePlan.regimenSeleccionado.nombre_regimen;
      this.copiaFechaIndefinida = this.solicitudDePlan.fechaIndefinida;
      this.copiaMesSeleccionado = this.solicitudDePlan.mesSeleccionado;
      this.copiaAnioSeleccionado = this.solicitudDePlan.anioSeleccionado;
    } else if (desde === this.CONSTANTES.ID_FORMULARIO_TRABAJO) {
      this.copiaIdCargoSeleccionado = this.solicitudDePlan.cargoSeleccionado.id_cargo;
      this.copiaNombreCargoSeleccionado = this.solicitudDePlan.cargoSeleccionado.nombre_cargo;
      this.copiaRentaImponible = this.solicitudDePlan.rentaImponible;
    } else if (desde === this.CONSTANTES.ID_FORMULARIO_EMPLEADOR) {
      this.copiaIdEmpleadorSeleccionado = this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador;
      this.copiaNombreEmpleadorSeleccionado = this.solicitudDePlan.empleadorSeleccionado.razon_social;
      this.copiaIdRegionSeleccionada = this.solicitudDePlan.regionSeleccionada.id_region;
      this.copiaNombreRegionSeleccionada = this.solicitudDePlan.regionSeleccionada.nombre_region;
      this.copiaIdComunaSeleccionada = this.solicitudDePlan.comunaSeleccionada.id_comuna;
      this.copiaNombreComunaSeleccionada = this.solicitudDePlan.comunaSeleccionada.nombre_comuna;
      this.copiaCalle = this.solicitudDePlan.calle;
      this.copiaNumero = this.solicitudDePlan.numero;
      this.copiaOficina = this.solicitudDePlan.oficina;
      this.copiaCorreo = this.solicitudDePlan.correo;
    }

    this.mostrarFormulario = false;
    if (desde >= this.CONSTANTES.ID_FORMULARIO_DATOS) {
      if (this.listadoFormularios[desde]) {
        this.listadoFormularios[desde].confirmado = true;
      }
    }
  }

  /**
   * Actualiza comunas cada vez que se cambia la región seleccionada, en caso de venir precarga
   * una comuna, se asigna al selector
   * @param regionSelec
   * @param comunaSeleccionada
   */
  async cambioRegion(regionSelec: number, comunaSeleccionada) {
    this.comunaSeleccionada = undefined!;
    this.mostrarComunas = this.comunas.filter((comuna: any) => comuna.id_region === regionSelec);
    if (comunaSeleccionada) {
      let buscarComuna = this.mostrarComunas.find((comuna: any) => Number(comunaSeleccionada) === comuna.id_comuna);
      if (buscarComuna) {
        this.comunaSeleccionada = buscarComuna.id_comuna;
      }
    }
    this.asignarObjetoRegiones(regionSelec);
  }

  /**
   * Asigna al formulario campos que contiene el empleador seleccionado, para seleccionar la
   * direccion, se evaluan las prioridades definidas.
   * @param empleador
   */
  async usarDataEmpleador(empleador: number) {
    const empleadorSeleccionado = this.empleadores.find((emp: any) => emp.id_mae_empleador === String(empleador));
    
    if (!empleadorSeleccionado) return;

    const direccionOficial = this.obtenerDireccionPrioritaria(empleadorSeleccionado.direcciones);

    if (direccionOficial) {
      this.asignarDireccion(direccionOficial, empleadorSeleccionado.email_empleador);
      await this.cambioRegion(Number(direccionOficial.id_region), direccionOficial.id_comuna);
    }

    this.empleadorSelec = empleadorSeleccionado;
    this.asignarObjetoEmpleadores(empleadorSeleccionado);
  }

  private obtenerDireccionPrioritaria(direcciones: any[] = []): any | null {
    const prioridades = [
      this.CONSTANTES.PRIORIDAD_1_DIRECCIONES,
      this.CONSTANTES.PRIORIDAD_2_DIRECCIONES,
      this.CONSTANTES.PRIORIDAD_3_DIRECCIONES,
    ];
  
    for (const prioridad of prioridades) {
      const encontrada = direcciones.find((dir) => dir.prioridad === prioridad);
      if (encontrada) return encontrada;
    }
  
    return null;
  }

  private asignarDireccion(direccion: any, email: string): void {
    this.solicitudDePlan.calle = direccion.direccion;
    this.solicitudDePlan.numero = direccion.numero;
    this.solicitudDePlan.oficina = direccion.numero_oficina;
    this.solicitudDePlan.correo = email;
    //Se envía valor cero en caso de no tener codigo postal para que el servicio no genere error 500
    this.solicitudDePlan.codigoPostal = direccion.codigo_postal || "0";
    this.regionSeleccionada = Number(direccion.id_region);
  }
  /**
   * Se asignan las variables de respaldo al objeto solicitud en caso
   * de cerrar un formulario
   * @param form
   */
  async asignarVariablesRespaldo(form): Promise<boolean> {
    switch (form) {
      case this.CONSTANTES.ID_FORMULARIO_DATOS:
        this.asignarDatosFinancieros();
        return true;
  
      case this.CONSTANTES.ID_FORMULARIO_TRABAJO:
        this.asignarDatosTrabajo();
        return true;
  
      case this.CONSTANTES.ID_FORMULARIO_EMPLEADOR:
        this.asignarDatosEmpleador();
        await this.verificarEmpleadorSeleccionado();
        return true;
  
      default:
        return false;
    }
  }

  private asignarDatosFinancieros(): void {
    this.solicitudDePlan.montoSeleccionado = this.copiaMontoSeleccionado ?? this.solicitudDePlan.montoSeleccionado;
  
    // Copiar tipo
    this.asignarCopia(this.solicitudDePlan.tipoSeleccionado, {
      id_tipo_moneda: this.copiaIdTipoSeleccionado,
      nombre_tipo_moneda: this.copiaNombreTipoSeleccionado,
    });
    // Copiar fondo
    this.asignarCopia(this.solicitudDePlan.fondoSeleccionado, {
      id_tipo_fondo: this.copiaIdFondoSeleccionado,
      nombre_tipo_fondo: this.copiaNombreFondoSeleccionado,
    });
    // Copiar régimen
    this.asignarCopia(this.solicitudDePlan.regimenSeleccionado, {
      id_regimen: this.copiaIdRegimenSeleccionado,
      nombre_regimen: this.copiaNombreRegimenSeleccionado,
    });
  
    this.solicitudDePlan.fechaIndefinida = this.copiaFechaIndefinida;
    this.solicitudDePlan.mesSeleccionado = this.copiaMesSeleccionado ?? this.solicitudDePlan.mesSeleccionado;
    this.solicitudDePlan.anioSeleccionado = this.copiaAnioSeleccionado ?? this.solicitudDePlan.anioSeleccionado;
  
    this.tipoSeleccionado = this.solicitudDePlan.tipoSeleccionado.id_tipo_moneda;
    this.regimenSeleccionado = this.solicitudDePlan.regimenSeleccionado.id_regimen ?? this.regimenSeleccionado;
    this.fondoSeleccionado = this.solicitudDePlan.fondoSeleccionado.id_tipo_fondo ?? this.fondoSeleccionado;
  }
  
  private asignarDatosTrabajo(): void {
    this.asignarCopia(this.solicitudDePlan.cargoSeleccionado, {
      id_cargo: this.copiaIdCargoSeleccionado,
      nombre_cargo: this.copiaNombreCargoSeleccionado,
    });
  
    this.solicitudDePlan.rentaImponible = this.copiaRentaImponible ?? this.solicitudDePlan.rentaImponible;
    this.cargoSeleccionado = this.solicitudDePlan.cargoSeleccionado.id_cargo;
  }
  
  private asignarDatosEmpleador(): void {
    this.asignarCopia(this.solicitudDePlan.empleadorSeleccionado, {
      id_mae_empleador: this.copiaIdEmpleadorSeleccionado,
      razon_social: this.copiaNombreEmpleadorSeleccionado,
    });
  
    this.asignarCopia(this.solicitudDePlan.regionSeleccionada, {
      id_region: this.copiaIdRegionSeleccionada,
      nombre_region: this.copiaNombreRegionSeleccionada,
    });
  
    this.asignarCopia(this.solicitudDePlan.comunaSeleccionada, {
      id_comuna: this.copiaIdComunaSeleccionada,
      nombre_comuna: this.copiaNombreComunaSeleccionada,
    });
  
    this.solicitudDePlan.calle = this.copiaCalle ?? this.solicitudDePlan.calle;
    this.solicitudDePlan.numero = this.copiaNumero ?? this.solicitudDePlan.numero;
    this.solicitudDePlan.oficina = this.copiaOficina ?? this.solicitudDePlan.oficina;
    this.solicitudDePlan.correo = this.copiaCorreo ?? this.solicitudDePlan.correo;
  
    this.empleadorSeleccionado = this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador;
    this.regionSeleccionada = this.solicitudDePlan.regionSeleccionada.id_region;
    this.comunaSeleccionada = this.solicitudDePlan.comunaSeleccionada.id_comuna;
  
    this.asignarObjetoRegiones(this.regionSeleccionada);
  }
  
  private asignarCopia(objetivo: any, origen: any): void {
    for (const clave in origen) {
      if (origen[clave] !== undefined) {
        objetivo[clave] = origen[clave];
      }
    }
  }
  
  private async verificarEmpleadorSeleccionado(): Promise<void> {
    const idEmpleador = this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador;
    if (!idEmpleador || !this.empleadorSelec) return;
  
    if (String(idEmpleador) !== String(this.empleadorSelec['id_mae_empleador'])) return;
  
    const empleadorSelecccionado = this.empleadores.find((empleador: any) => String(empleador.id_mae_empleador) === String(idEmpleador));
  
    if (!empleadorSelecccionado) {
      this.empleadores.push(this.empleadorSelec);
      this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador = Number(this.empleadorSelec['id_mae_empleador']);
      this.solicitudDePlan.empleadorSeleccionado.razon_social = this.empleadorSelec['razon_social'];
      this.empleadorSeleccionado = this.empleadorSelec['id_mae_empleador'];
    } else {
      this.solicitudDePlan.empleadorSeleccionado.id_mae_empleador = Number(empleadorSelecccionado.id_mae_empleador);
      this.solicitudDePlan.empleadorSeleccionado.razon_social = empleadorSelecccionado.razon_social;
      this.empleadorSeleccionado = empleadorSelecccionado.id_mae_empleador;
    }
  }

  /**
   * Validacion de formulario, si cumple las condiciones, se habilita el boton
   */
  validarEstadoBotonAceptar() {
    switch (this.mostrarForm) {
      case this.CONSTANTES.ID_FORMULARIO_DATOS:
        return this.validarFormularioDatos();
  
      case this.CONSTANTES.ID_FORMULARIO_TRABAJO:
        return this.validarFormularioTrabajo();
  
      case this.CONSTANTES.ID_FORMULARIO_EMPLEADOR:
        return this.validarFormularioEmpleador();
  
      default:
        return false;
    }
  }


  /*
  * Validaciones Formulario Cuenta
  */
  private validarFormularioDatos(): boolean {
    const plan = this.solicitudDePlan;
  
    if (!plan.montoSeleccionado || !this.fondoSeleccionado || !this.regimenSeleccionado) return false;
  
    if (!this.validarMonto(plan.montoSeleccionado, 'validador', null!)) return false;
  
    if (!this.validarFechaTermino('validador')) return false;
  
    if (!plan.autorizacionEmpleador && this.idTipoProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_2) return false;
  
    return true;
  }
  
  /*
  * Validaciones Formulario Trabajo
  */
  private validarFormularioTrabajo(): boolean {
    const plan = this.solicitudDePlan;
    const cargo = plan.cargoSeleccionado;
  
    return !!(
      plan.rentaImponible &&
      cargo?.id_cargo &&
      cargo?.nombre_cargo &&
      this.validarRenta(plan.rentaImponible, 'validador')
    );
  }
  
  /**
   * Validaciones Formulario Empleador
   */
  private validarFormularioEmpleador(): boolean {
    const plan = this.solicitudDePlan;
  
    const comunaValida =
      plan.empleadorSeleccionado?.id_mae_empleador &&
      plan.regionSeleccionada?.id_region &&
      plan.comunaSeleccionada?.id_comuna &&
      this.comunaSeleccionada;
  
    const direccionValida =
      plan.calle && plan.calle.trim() !== '' &&
      plan.numero &&
      plan.correo &&
      this.validarEmail(plan.correo, 'validador');
  
    return !!(comunaValida && direccionValida);
  }

  /**
   * Función encargada de validar estado boton continuar.
   * Si existe un regimen confirmado para girar , puede continuar con el flujo.
   */
  validarBotonContinuar() {
    let formulariosCompletos = true;
    for (let listado of this.listadoFormularios) {
      if (!listado.confirmado) {
        formulariosCompletos = false;
      }
    }
    return formulariosCompletos;
  }

  /**
   * Encargado de mostrar alerta de confirmación cuando el usuario intenta cancelar.
   */
  eventoCancelar() {
    const titulo: string = 'Importante';
    const mensaje: string = 'Al continuar, perderás los datos ya ingresados.';
    const botones: any[] = [
      {
        text: 'CANCELAR',
        handler: () => {},
      },
      {
        text: 'CONTINUAR',
        handler: () => {
          if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_CANCELAR.CODIGO_OPERACION);
          } else {
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_CANCELAR.CODIGO_OPERACION);
          }
          this.navCtrl.navigateRoot('HomeClientePage');
        },
      },
    ];
    this.mostrarAlert(titulo, mensaje, botones);
  }

  /**
   * Encargado de mostrar alerta.
   * @param titulo
   * @param mensaje
   * @param botones
   */
  mostrarAlert(titulo: string, mensaje: string, botones: any[]) {
    this.alertCtrl
      .create({
        header: titulo,
        message: mensaje,
        buttons: botones,
      })
      .then((confirmData) => confirmData.present());
  }

  /**
   * Redireccion al paso 2 para confirmar plan de ahorro.
   */
  continuarStep2() {
    const enviarStep2 = {
      cuentaSeleccionada: this.idTipoProducto,
      objetoSolicitud: this.solicitudDePlan,
    };

    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(enviarStep2),
      },
    };
    this.navCtrl.navigateForward(['planes-step-dos'], navigationExtras);
  }

  /**
   * Se muestra modal informativo y se asignan los textos correspondientes
   */
  verModalInformativo() {
    this.mostrarModalInformativo = true;
    if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      this.modalData = {
        titulo: this.CONSTANTES.TITULO_MODAL_INICIAL_CUENTA2,
        texto1: this.CONSTANTES.TEXTO1_MODAL_INICIAL_CUENTA2,
        texto2: this.CONSTANTES.TEXTO2_MODAL_INICIAL_CUENTA2,
        tipoProducto: this.idTipoProducto,
        boton: 'Conocer Más',
      };
    } else if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV) {
      this.modalData = {
        titulo: this.CONSTANTES.TITULO_MODAL_INICIAL_APV,
        texto1: this.CONSTANTES.TEXTO1_MODAL_INICIAL_APV,
        texto2: null,
        tipoProducto: this.idTipoProducto,
        boton: 'Conocer Más',
      };
    }
    this.tipoModal = 1;
  }

  /**
   * Se muestra modal para regimenes y se asignan los textos correspondientes
   */
  verModalRegimenes() {
    this.mostrarModalRegimen = true;

    if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      this.regimenesParaModal = this.CONSTANTES.SLIDES_REGIMENES_CUENTA_2;
    } else if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV) {
      this.regimenesParaModal = this.CONSTANTES.SLIDES_REGIMENES_APV;
    }
  }

  /**
   * Encargado de cerrar modal para regímenes
   */
  ocultarModalRegimenes() {
    this.mostrarModalRegimen = false;
  }

  /**
   * Se muestra modal para regimenes y se asignan los textos correspondientes
   */
  verModalEmpleador() {
    this.mostrarModalEmpleador = true;

    this.mostrarModalInformativo = true;
    if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      this.modalData = {
        empleadoresUtilizados: this.empleadoresEnPlanes,
        titulo: this.CONSTANTES.TITULO_MODAL_EMPLEADOR,
        texto1: this.CONSTANTES.TEXTO1_MODAL_EMPLEADOR_CUENTA2,
        texto2: this.CONSTANTES.TEXTO2_MODAL_EMPLEADOR,
        tipoProducto: this.idTipoProducto,
        boton: 'Buscar',
      };
    } else if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV) {
      this.modalData = {
        empleadoresUtilizados: this.empleadoresEnPlanes,
        titulo: this.CONSTANTES.TITULO_MODAL_EMPLEADOR,
        texto1: this.CONSTANTES.TEXTO1_MODAL_EMPLEADOR_APV,
        texto2: this.CONSTANTES.TEXTO2_MODAL_EMPLEADOR,
        tipoProducto: this.idTipoProducto,
        boton: 'Buscar',
      };
    }
    this.tipoModal = 2;
  }

  /**
   * Evento que escucha cierre de modal desde componente, el modal a cerrar
   * se evalua según el modal que se haya seccionado.
   */
  ocultarModals(data: any) {
    if (this.tipoModal === this.CONSTANTES.FORMULARIO_EMPLEADOR) {
      if (data) {
        if (data.empleador) {
          this.agregaEmpleadorEnListado(data.empleador);
          this.mostrarModalEmpleador = false;
          this.mostrarModalInformativo = false;
        } else {
          this.utilService.mostrarToast(this.CONSTANTES.TEXTO_NO_EXISTE_EMPLEADOR);
        }
      } else {
        this.mostrarModalEmpleador = false;
        this.mostrarModalInformativo = false;
      }
    } else {
      this.mostrarModalEmpleador = false;
      this.mostrarModalInformativo = false;
    }
  }

  /**
   * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
   * @param codigoOperacion
   */
  async registrarTrazabilidad(codigoOperacion: number) {
    let parametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza: CONSTANTES_TRAZAS_PLAN,
      uuid: this.uuid,
      rut: this.contextoAPP.datosCliente.rut,
      dv: this.contextoAPP.datosCliente.dv,
    };

    switch (codigoOperacion) {
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_3_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_3_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_3_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_3_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_3_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_3_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_3_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_3_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_2_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_2_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_FORMULARIO_1_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_INICIO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_INICIO);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_FORMULARIO_1_ERROR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_CANCELAR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_CANCELAR);
        break;
      case CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_CANCELAR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_CANCELAR);
        break;
    }

    this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
  }

  /**
   * Selector de fecha indefinida.
   * Si es true se reinician las fechas de término
   * Si es false se muestra el selector de fecha de término
   */
  fechaIndefinidaSeleccionada() {
    if (this.solicitudDePlan.fechaIndefinida) {
      this.solicitudDePlan.mesSeleccionado = undefined!;
      this.solicitudDePlan.anioSeleccionado = undefined!;
    }
  }

  /**
   * Si no se autoriza al empleador, se debe mostrar un aviso.
   */
  autorizaEmpleador() {
    if (!this.solicitudDePlan.autorizacionEmpleador) {
      //TODO: agregar mensaje en web
      //this.utilService.mostrarToast(this.CONSTANTES.TEXTO_ERROR_AUTORIZACION);
    }
  }

  /**
   * En caso de cambiar la cuenta seleccionada, se reinician los campos de los formularios
   */
  reiniciarData() {
    this.solicitudDePlan = new SolicitudCuentaPlanAhorro();
    this.fondoSeleccionado = undefined!;
    this.regimenSeleccionado = undefined!;
    this.tipoSeleccionado = undefined!;
    this.cargoSeleccionado = undefined!;
    this.regionSeleccionada = undefined!;
    this.comunaSeleccionada = undefined!;
    this.empleadorSeleccionado = undefined!;
    this.copiaMontoSeleccionado = undefined!;
    this.copiaIdTipoSeleccionado = undefined!;
    this.copiaNombreTipoSeleccionado = undefined!;
    this.copiaIdFondoSeleccionado = undefined!;
    this.copiaNombreFondoSeleccionado = undefined!;
    this.copiaIdRegimenSeleccionado = undefined!;
    this.copiaNombreRegimenSeleccionado = undefined!;
    this.copiaFechaIndefinida = true;
    this.copiaMesSeleccionado = undefined!;
    this.copiaAnioSeleccionado = undefined!;
    this.copiaIdCargoSeleccionado = undefined!;
    this.copiaNombreCargoSeleccionado = undefined!;
    this.copiaRentaImponible = undefined!;
    this.copiaIdEmpleadorSeleccionado = undefined!;
    this.copiaNombreEmpleadorSeleccionado = undefined!;
    this.copiaIdRegionSeleccionada = undefined!;
    this.copiaNombreRegionSeleccionada = undefined!;
    this.copiaIdComunaSeleccionada = undefined!;
    this.copiaNombreComunaSeleccionada = undefined!;
    this.copiaCalle = undefined!;
    this.copiaNumero = undefined!;
    this.copiaOficina = undefined!;
    this.copiaCorreo = undefined!;

    if (this.contextoAPP.datosCliente.rentaImponible && this.contextoAPP.datosCliente.rentaImponible !== 'null') {
      this.solicitudDePlan.rentaImponible = this.contextoAPP.datosCliente.rentaImponible;
      this.formatoMontoDinero(this.solicitudDePlan.rentaImponible, this.solicitudDePlan.rentaImponible, 'rentaImponible');
      this.copiaRentaImponible = this.solicitudDePlan.rentaImponible;
    } else {
      this.solicitudDePlan.rentaImponible = undefined!;
    }
  }

  /**
   * Funcion llamada cuando un empleador es seleccionado desde el
   * buscador de empleadores, primero se busca ese empleador en el arreglo,
   * en caso de no existir, se agrega y posteriormente se deja
   * como empleador seleccionado  y se completan sus campos asociados
   *
   * @param empleador
   */
  agregaEmpleadorEnListado(empleador) {
    let empleadorSeleccionado = this.empleadores.find((emp: any) => emp.id_mae_empleador === String(empleador.id_mae_empleador));
    if (!empleadorSeleccionado) {
      if (!empleador.razon_social) {
        empleador.razon_social =
          (empleador.primer_nombre ? empleador.primer_nombre : '') +
          ' ' +
          (empleador.segundo_nombre ? empleador.segundo_nombre : '') +
          ' ' +
          (empleador.apellido_paterno ? empleador.apellido_paterno : '') +
          ' ' +
          (empleador.apellido_materno ? empleador.apellido_materno : '');
      }
      this.empleadores.push(empleador);
    }
    this.empleadorSeleccionado = empleador.id_mae_empleador;
    this.empleadorSelec = {
      id_mae_empleador: empleador.id_mae_empleador,
      razon_social: empleador.razon_social,
    };
    this.usarDataEmpleador(empleador.id_mae_empleador);
  }

  /**
   * Elimina formato de monto ingresado por parametros
   * @param val
   */
  eliminarFormato(val: any) {
    if (!val) {
      return '';
    }
    val = val.toString().replace(/^0+/, '');

    if (this.CONSTANTES.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
    } else {
      val = val.replace(/\./g, '');
      return val;
    }
  }

  /**
   * Encargado de autoformatear monto ingresado por parametro a formato de dinero
   */
  formatoMontoDinero(monto: string, valString: string, desde: string) {
    if (!valString) {
      this.asignarMonto('', desde);
      return;
    }
  
    valString = this.contextoAPP.limpiaCaracteres(valString.toString().replace('$', '')) + '';
    const parts = this.eliminarFormato(valString).split(this.CONSTANTES.DECIMAL_SEPARATOR);
  
    switch (desde) {
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_SELECCIONADO:
        monto = this.formatearMoneda(parts, false);
        this.solicitudDePlan.montoSeleccionado = this.normalizarNull(monto) ?? undefined!;
        break;
  
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_RENTA:
        monto = this.formatearMoneda(parts, true);
        this.solicitudDePlan.rentaImponible = this.normalizarNull(monto) ?? undefined!;
        break;
  
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_NUMERO:
        monto = parts[0];
        this.solicitudDePlan.numero = this.normalizarNull(monto) ?? undefined!;
        break;
  
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_OFICINA:
        monto = parts[0];
        this.solicitudDePlan.oficina = this.normalizarNull(monto) ?? undefined!;
        break;
    }
  }

  private formatearMoneda(parts: string[], conSimbolo: boolean): string {
    const base = new Intl.NumberFormat('es-CL').format(Number(parts[0]));
    const decimal = parts[1] ? this.CONSTANTES.DECIMAL_SEPARATOR + parts[1] : '';
    return (conSimbolo ? '$' : '') + base + decimal;
  }
  
  private normalizarNull(valor: string): string | undefined {
    return valor === 'null' || valor === '$null' ? undefined : valor;
  }
  
  private asignarMonto(valor: string, desde: string): void {
    switch (desde) {
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_SELECCIONADO:
        this.solicitudDePlan.montoSeleccionado = valor;
        break;
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_RENTA:
        this.solicitudDePlan.rentaImponible = valor;
        break;
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_NUMERO:
        this.solicitudDePlan.numero = valor;
        break;
      case this.CONSTANTES.ACCESO_FORMATEADOR_MONTO_OFICINA:
        this.solicitudDePlan.oficina = valor;
        break;
    }
  }

  /**
   * Se asigna monto seleccionado a objeto solicitud
   * @param tipoSeleccionado
   */
  asignarTipoMonto(tipoSeleccionado) {
    let tipoEncontrado = this.tiposMonedas.find((tipo: any) => tipo.id_tipo_moneda === tipoSeleccionado);
    if (tipoEncontrado) {
      this.solicitudDePlan.tipoSeleccionado = {
        id_tipo_moneda: tipoEncontrado.id_tipo_moneda,
        nombre_tipo_moneda: tipoEncontrado.nombre_tipo_moneda,
      };
    }
  }

  /**
   * Se asigna fondo seleccionado a objeto solicitud
   * @param fondoSeleccionado
   */
  asignarObjetoFondo(fondoSeleccionado) {
    let fondoEncontrado = this.fondosDestino.find((fondo: any) => fondo.id_tipo_fondo === fondoSeleccionado);
    if (fondoEncontrado) {
      this.solicitudDePlan.fondoSeleccionado = {
        id_tipo_fondo: fondoEncontrado.id_tipo_fondo,
        nombre_tipo_fondo: fondoEncontrado.nombre_tipo_fondo,
      };
    }
  }

  /**
   * Se asigna regimen seleccionado a objeto solicitud
   * @param regimenSeleccionado
   */
  asignarObjetoRegimen(regimenSeleccionado) {
    let regimenEncontrado = this.regimenes.find((regimen: any) => regimen.id_regimen === regimenSeleccionado);
    if (regimenEncontrado) {
      this.solicitudDePlan.regimenSeleccionado = {
        id_regimen: regimenEncontrado.id_regimen,
        nombre_regimen: regimenEncontrado.nombre_regimen,
      };
    }
  }

  /**
   * Se asigna cargo seleccionado a objeto solicitud
   * @param cargoSeleccionado
   */
  asignarObjetoCargo(cargoSeleccionado) {
    let cargoEncontrado = this.cargos.find((cargo: any) => cargo.id_cargo === cargoSeleccionado);
    if (cargoEncontrado) {
      this.solicitudDePlan.cargoSeleccionado = {
        id_cargo: cargoEncontrado.id_cargo,
        nombre_cargo: cargoEncontrado.nombre_cargo,
      };
    }
  }

  /**
   * Se asigna empleador seleccionado a objeto solicitud
   * @param empleadorSeleccionado
   */
  asignarObjetoEmpleadores(empleadorSeleccionado) {
    let empleadorEncontrado = this.empleadores.find((empleador: any) => empleador.id_mae_empleador === empleadorSeleccionado.id_mae_empleador);
    if (empleadorEncontrado) {
      this.solicitudDePlan.empleadorSeleccionado = {
        id_mae_empleador: Number(empleadorSeleccionado.id_mae_empleador),
        razon_social: empleadorSeleccionado.razon_social ? empleadorSeleccionado.razon_social : '',
      };
      this.solicitudDePlan.rutEmpleador = empleadorSeleccionado.rut_empleador;
      this.solicitudDePlan.dvEmpleador = empleadorSeleccionado.dv_empleador;
      this.solicitudDePlan.idTipoTrabajador = empleadorSeleccionado.id_tipo_trabajador_empleador;
    }
  }

  /**
   * Se asigna region seleccionada a objeto solicitud
   * @param regionSeleccionada
   */
  asignarObjetoRegiones(regionSeleccionada) {
    let regionEncontrada = this.regiones.find((region: any) => region.id_region === regionSeleccionada);
    if (regionEncontrada) {
      this.solicitudDePlan.regionSeleccionada = {
        id_region: regionEncontrada.id_region,
        nombre_region: regionEncontrada.nombre_region,
      };
    }
    this.validarEstadoBotonAceptar();
  }

  /**
   * Se asigna comuna seleccionado a objeto solicitud
   * @param comunaSeleccionada
   */
  asignarObjetoComuna(comunaSeleccionada) {
    let comunaEncontrada = this.mostrarComunas.find((comuna: any) => comuna.id_comuna === comunaSeleccionada);
    if (comunaEncontrada) {
      this.solicitudDePlan.comunaSeleccionada = {
        id_comuna: comunaEncontrada.id_comuna,
        nombre_comuna: comunaEncontrada.nombre_comuna,
      };

      this.solicitudDePlan.ciudadSeleccionada = {
        id_ciudad: comunaEncontrada.id_ciudad,
        nombre_ciudad: comunaEncontrada.nombre_ciudad,
      };
    }
    this.validarEstadoBotonAceptar();
  }

  /**
   * Función para cargar empleadores asociados a los planes del usuario
   * para esto se llama a la funcion this.utilService.traerEmpleadores, la cual requiere de regimes y fondos
   * previamente cargados
   */
  async cargarEmpleadores() {
    this.empleadores = [];

    const loading = await this.contextoAPP.mostrarLoading();

    this.planesService.obtenerSolicitudesAPV(this.rut, this.dv).subscribe(
      async (respuestaSolicitudesApv: any) => {
        this.planesService.obtenerSolicitudesCAV(this.rut, this.dv).subscribe(
          async (respuestaSolicitudesCav: any) => {
            //En caso de no tener solicitudes de planes, solo en envian los empleadores vacios
            if (
              respuestaSolicitudesCav.solicitudes_activadas.length <= 0 &&
              respuestaSolicitudesCav.solicitudes_modificada.length <= 0 &&
              respuestaSolicitudesCav.solicitudes_suscripcion.length <= 0 &&
              respuestaSolicitudesApv.solicitudes_aprovadas.length <= 0 &&
              respuestaSolicitudesApv.solicitudes_ingresadas.length <= 0
            ) {
              this.contextoAPP.ocultarLoading(loading);
            } else {
              this.planesService.obtenerRegimenes(this.CONSTANTES.NOMBRE_CAV, this.rut, this.dv).subscribe(
                async (respuestaRegimenesCAV: any) => {
                  this.planesService.obtenerRegimenes(this.CONSTANTES.NOMBRE_APV, this.rut, this.dv).subscribe(
                    async (respuestaRegimenesAPV: any) => {
                      this.regimenes = respuestaRegimenesCAV.concat(respuestaRegimenesAPV);
                      this.planesService.obtenerFondos(this.rut, this.dv).subscribe(
                        async (respuestaFondos: any) => {
                          this.fondos = respuestaFondos;

                          let retornoFuncion = await this.obtenerDataPlanes.traerEmpleadores(
                            this.rut,
                            this.dv,
                            respuestaSolicitudesApv,
                            respuestaSolicitudesCav,
                            this.regimenes,
                            this.fondos
                          );
                          if (retornoFuncion['error']) {
                            this.contextoAPP.ocultarLoading(loading);
                            this.navCtrl.navigateRoot(
                              'ErrorGenericoPage',
                              this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro)
                            );
                          } else {
                            this.empleadores = retornoFuncion['empleadores'];
                            this.empleadoresEnPlanes = this.empleadores;
                            this.contextoAPP.ocultarLoading(loading);
                          }
                        },
                        async (error) => {
                          this.contextoAPP.ocultarLoading(loading);
                          this.navCtrl.navigateRoot(
                            'ErrorGenericoPage',
                            this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro)
                          );
                        }
                      );
                    },
                    async (error) => {
                      this.contextoAPP.ocultarLoading(loading);
                      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
                    }
                  );
                },
                async (error) => {
                  this.contextoAPP.ocultarLoading(loading);
                  this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
                }
              );
            }
          },
          async (error) => {
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
          }
        );
      },
      async (error) => {
        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.planAhorro));
      }
    );
  }

  /**
   * Metodo encargado de volver al home
   */
  volverAlHome() {
    this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
  }
}
