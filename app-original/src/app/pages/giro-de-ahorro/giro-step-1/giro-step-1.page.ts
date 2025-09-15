import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RegimenGiro } from '../util/regimen.giro';
import { FondoRegimenGiro } from '../util/fondo.regimen.giro';
import { CONSTANTES_GIRO, CONSTANTES_GIRO_STEP_1, CONSTANTES_TRAZAS_GIRO } from '../util/constantes.giro';
import { ParametrosGiro } from '../util/parametros.giro';
import { ParametrosComisionGiro } from '../util/parametros.comision';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { UtilService, ClienteDatos,ClienteService, GiroService, TrazabilidadService } from 'src/app/services';
import { NavigationExtras } from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { Keyboard } from '@capacitor/keyboard'; 
import { UtilGiro } from '../util/util.giro';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';

@Component({
  selector: 'page-giro-step-1',
  templateUrl: 'giro-step-1.page.html',
  styleUrls: [ './giro-step-1.page.scss']
})

export class GiroStepUnoPage implements OnInit{
  // Referencia a constantes giro 1 , utilizada directamente en la vista. 
  readonly CONSTANTES = CONSTANTES_GIRO_STEP_1;
  // Tipo de producto seleccionado por el usuario , valores CAV (Cuenta 2) o CCICV (APV)
  idTipoProducto: number;
  // Listado de productos del usuario.
  productosCliente: any[];
  // Producto seleccionado
  productoSeleccionado: any;
  // Referencia al rut
  rut: number;
  // Referencia al digito verificador.
  dv: string;
  // Referencia a nombre usuario.
  nombreUsuario: string;
  // Referencia a apellido usuario.
  apellidoUsuario: string;
  // referencia email usuario
  email: string;
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
  // Validador para mostrar modal detalle slide giro
  modalDetalleSlideGiro: boolean = false;
  // Validador para mostrar modal informativo cuenta 2
  modalSelectedCtaDos: boolean = false;
 // Validador para mostrar modal informativo APV
  modalSelectedAPV: boolean = false;
  // Validador para mostrar modal saldos discordantes
  modalValidacionSaldoDiscordante: boolean = false;
  // Validador para mostrar modal 24 giros
  modalValidacion24Giros: boolean = false;
  // Validador para mostrar modal sin saldo.
  modalValidacionSinSaldo: boolean = false;
  // Indicar para mostrar listado de regimenes.
  mostrarListadoRegimenes: boolean = false;
  // Modal detalle regimenes APV
  modalDetalleRegimenGiroAPV: boolean = false;
  // Modal detalle regimenes Cuenta 2
  modalDetalleRegimenGiroCuenta2: boolean = false;
  // Modal de validación de cuentas digitales y bipersonales
  modalValidacionCuentas = false;
  // Objeto referencia del regimen seleccionado para girar. Utilizado en el modal de detalle de giro. 
  regimenSeleccionado: RegimenGiro;
  // Listado general de regimenes a girar , para un producto en especifico.
  listadoRegimenes: RegimenGiro[] = [];
  // Titulo utilizado en el modal detalle giro. Indica cuando es creación o edición.
  tituloModalDetalleGiro: string
  // Indicador para mostrar modal detalle giro.
  mostrarDetalleGiro: boolean = false;
  // Indicador de texto informativo inicio ( que se muestra solo la primera vez)
  mostraTextoInformativoInicio = true;
  // referencia a componente loading.
  indicadorLoading: any;
  // Tipo cuenta seleccionado por el usuario ( APV o Cuenta 2)
  tipoCuentaValidar:string;
  utilGiro:UtilGiro;

  // UUID de la transacción
  uuid: string;

  /**
   * Boton regimen.
   */
  btnRegimen: ElementRef;

  // validar si tiene saldo o esta en cdf ( APV o Cuenta 2)
  modalValidacionSaldoCDFAPV: boolean = false;
  modalValidacionSaldoCDFCAV: boolean = false;

  modalValidacionSaldoCDFAPVMensaje: string;
  modalValidacionSaldoCDFCAVMensaje: string;
  modalValidacionSaldoCDFAPVMensajeTitulo: string;
  modalValidacionSaldoCDFCAVMensajeTitulo: string;


  // Indicar para mostrar listado de regimenes.

  @ViewChild('btnRegimen') set content(content: ElementRef) {
    if(content) {
        this.btnRegimen = content;
    }
  }

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private clienteDatos: ClienteDatos,
    private giroService: GiroService,
    private clienteProvider: ClienteService,
    private contextoAPP: ContextoAPP,
    private trazabilidadProvider: TrazabilidadService,
    private readonly renderer: Renderer2,
    private readonly platform: Platform
  ) {
    this.slides = this.CONSTANTES.SLIDES_INFO_PRODUCTOS;
    this.slidesRegimenesAPV = this.CONSTANTES.SLIDES_REGIMENES_APV;
    this.slidesRegimenesCuenta2 = this.CONSTANTES.SLIDES_REGIMENES_CUENTA_2;
    this.utilGiro = new UtilGiro();

    if (this.platform.is('android')) {
      Keyboard.addListener('keyboardDidShow', info => {
        this.resizeModalRegimen(`${info.keyboardHeight.toString()}px`);
      });
  
      Keyboard.addListener('keyboardDidHide', () => {
        this.resizeModalRegimen('inherit');
      });
    } 
  }

  async ngOnInit() {
    this.uuid = this.utilService.generarUuid();

    const loading = await this.contextoAPP.mostrarLoading();
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    this.email = this.contextoAPP.datosCliente.email;
    this.nombreUsuario = this.contextoAPP.datosCliente.nombre;
    this.apellidoUsuario = this.contextoAPP.datosCliente.apellidoPaterno;
    this.telefonoCelular = this.contextoAPP.datosCliente.telefonoCelular;
    this.esPensionado = this.contextoAPP.datosCliente.esPensionado;
    this.utilService.setLogEvent('event_habitat', { option: 'Giro Ahorro Step 1A / Paso 1 INICIO' });

    this.contextoAPP.ocultarLoading(loading);
  }

  /**
   * Encargado de llamar a servicio datos clientes.
   * @param tipoCuentaValidar 
   * @param loading 
   */
  async obtenerDatosCliente(tipoCuentaValidar: string,loading: any){
    if (
        tipoCuentaValidar !== this.CONSTANTES.NOMBRE_PRODUCTO_APV &&
        tipoCuentaValidar !== this.CONSTANTES.NOMBRE_PRODUCTO_CUENTA_2
      ) return;
    
    this.clienteProvider.obtenerDatosClienteGiro(this.rut, this.dv).subscribe(
      async (responseDatosCliente: any) => {
        this.contextoAPP.ocultarLoading(loading);
  
        const cliente = responseDatosCliente.cliente;
        const errorCDF = tipoCuentaValidar === this.CONSTANTES.NOMBRE_PRODUCTO_APV
          ? responseDatosCliente.cuentaCCICVErrorSaldoCDF?.nombreCortoErrorSaldoCdf
          : responseDatosCliente.cuentaCAVErrorSaldoCDF?.nombreCortoErrorSaldoCdf;

        if (cliente !== null) {
          if (errorCDF === "0") {
            const modeloCliente = this.utilService.generarModeloDatosCliente(cliente);
            const productos = responseDatosCliente.productos;
            const ejecutivo = responseDatosCliente.ejecutivo;
            this.actualizarDatosCliente(modeloCliente, productos, cliente.totalBonosReconocimiento, ejecutivo);
            this.crearListadoRegimenes();
            this.validarGiro(tipoCuentaValidar, loading);
          } else {
            this.mostrarModalError(tipoCuentaValidar, errorCDF);
          }
        } else {
          this.desplegarErrorDatosClientes();
        }
      },
      async (error: any) => {
        console.error(error);
        this.contextoAPP.ocultarLoading(loading);
        this.desplegarErrorDatosClientes();
      }
    );
  }

  private mostrarModalError(tipoCuenta: string, errorCDF: string) {
    const mensajes = {
      "-1011": {
        texto: CONSTANTES_GIRO_STEP_1.ERROR_CDF_ENCURSO,
        titulo: CONSTANTES_GIRO_STEP_1.ERROR_CDF_ENCURSO_TITULO,
      },
      "-1005": {
        texto: CONSTANTES_GIRO_STEP_1.ERROR_SINSALDOCDF,
        titulo: CONSTANTES_GIRO_STEP_1.ERROR_SINSALDOCDF_TITULO,
      },
    };

    const modalInfo = mensajes[errorCDF];
    if (!modalInfo) return;

    if (tipoCuenta === this.CONSTANTES.NOMBRE_PRODUCTO_APV) {
      this.modalValidacionSaldoCDFAPVMensaje = modalInfo.texto;
      this.modalValidacionSaldoCDFAPVMensajeTitulo = modalInfo.titulo;
      this.modalValidacionSaldoCDFAPV = true;
    } else {
      this.modalValidacionSaldoCDFCAVMensaje = modalInfo.texto;
      this.modalValidacionSaldoCDFCAVMensajeTitulo = modalInfo.titulo;
      this.modalValidacionSaldoCDFCAV = true;
    }
  }

  /**
   * Encargado de mostrar pantalla de error + registrar trazabilidad.
   */
  async desplegarErrorDatosClientes() {
    await this.registrarTrazaErrorGiros();
    this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
  }

  /**
   * Encargado de actualizar datos cliente. 
   * @param cliente 
   * @param productos 
   * @param totalBonos 
   * @param ejecutivo 
   */
  actualizarDatosCliente(cliente: any, productos: any, totalBonos: any, ejecutivo: any) {
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
    this.productosCliente = productos;
    this.clienteDatos.setIdPersona(cliente.idPersona);
    this.clienteDatos.setEdad(cliente.edad);
    this.clienteDatos.setEsPensionado(cliente.esPensionado);
    this.clienteDatos.setPoseeConsultor(ejecutivo);
    this.clienteDatos.setTelefonoCelular(cliente.telefonoCelular);
  }

  /**
   * Ejecutado al seleccionar tab tipo producto (cav / apv)
   * @param tipoCta
   */
  async seleccionarGiro(tipoCuentaValidar: string){
    const loading = await this.contextoAPP.mostrarLoading();
    this.idTipoProducto = tipoCuentaValidar == this.CONSTANTES.NOMBRE_PRODUCTO_CUENTA_2 ? this.CONSTANTES.ID_PRODUCTO_CUENTA_2 : this.CONSTANTES.ID_PRODUCTO_APV; // Seteamos tipo de producto seleccionado ( APV o CAV)
    
    await this.registrarTrazaInicioGiros();
    await this.obtenerDatosCliente(tipoCuentaValidar,loading);
  }

  /**
   * Encargado de mostrar modales de validación giro.
   * Se el usuario no cumple con alguna validación ,se mostrara un modal de error. 
   * En el caso de que el usuario cumple , se continua con la carga de regimenes.
   * @param tipoCuentaValidar 
   * @param loading 
   */
  validarGiro(tipoCuentaValidar: string,loading: any): void {
    this.giroService.validarGiro(tipoCuentaValidar, this.rut, this.dv).subscribe(async (response: any) => {
      const codigoError = response["Context-Error"]?.cod ?? null;
      const codigoValidacionOK = response["ValidacionGiros"]?.cod ?? null;

      if (codigoError) {
        this.procesarErroresValidacionGiro(codigoError, tipoCuentaValidar, loading);
      } else if (codigoValidacionOK === this.CONSTANTES.CODIGO_VALIDACION_OK_GIRO) {
        this.tipoCuentaValidar = tipoCuentaValidar;
        this.continuarValidacionSinSaldoGiro();
      } else {
        this.procesarErrorGenerico(loading);
      }
    },
      async () => {
        this.procesarErrorGenerico(loading);
    });
  }

  private procesarErroresValidacionGiro(codigoError: string, tipoCuentaValidar: string, loading: any): void {
    this.contextoAPP.ocultarLoading(loading);
  
    switch (codigoError) {
      case this.CONSTANTES.CODIGO_ERROR_SALDOS_DISCORDANTES:
        this.ocultarListadoRegimenes();
        this.modalValidacionSaldoDiscordante = true;
        break;
  
      case this.CONSTANTES.CODIGO_ERROR_CLIENTE_SIN_CUENTA_2:
        const mensaje = tipoCuentaValidar === this.CONSTANTES.NOMBRE_PRODUCTO_CUENTA_2
          ? this.CONSTANTES.MENSAJE_CTA_2_APERTURADA
          : this.CONSTANTES.MENSAJE_CTA_APV_APERTURADA;
        const url = tipoCuentaValidar === this.CONSTANTES.NOMBRE_PRODUCTO_CUENTA_2
          ? this.CONSTANTES.URL_APERTURA_CUENTA_2
          : this.CONSTANTES.URL_APERTURA_CUENTA_APV;
        this.utilService.mostrarToastConLink(mensaje, url);
        break;
  
      case this.CONSTANTES.CODIGO_ERROR_SUPERA_24_GIROS:
        if (this.existeRegimenCOVID24Giros()) {
          this.continuarValidacionSinSaldoGiro();
        } else {
          this.ocultarListadoRegimenes();
          this.modalValidacion24Giros = true;
        }
        break;
  
      default:
        this.procesarErrorGenerico(loading);
    }
  }
  
  private procesarErrorGenerico(loading: any): void {
    this.contextoAPP.ocultarLoading(loading);
    this.registrarTrazaErrorGiros();
    this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
  }

  /**
   * Segundo metodo encargado de validar cuenta sin saldo.
   * Se ejecuta a continuación que se cargan los datos del cliente. 
   */
  continuarValidacionSinSaldoGiro(){
    if(this.validarCuentaSinSaldo()){
      this.modalValidacionSinSaldo = true;
      this.ocultarListadoRegimenes();
    } else {
      this.mostrarListadoRegimenes = true;
      this.seleccionarProducto();
    }
  }

  /**
   * Encargada de ocultar listado de regimenes
   */
  ocultarListadoRegimenes(): void {
    this.listadoRegimenes = undefined!;
    this.mostrarListadoRegimenes = false;
  }

  /**
   * Encargado de validar si el tipo de producto no tiene saldo
   * @returns true : cuenta cuenta sin saldo.
   */
  validarCuentaSinSaldo() {
    // Si el usuario es pensionado, se debe realizar una validacion especial al producto apv 
    if((this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV) && 
       this.esPensionado && !this.utilGiro.validarCuentaConSaldoAPVPensionado(this.productosCliente,this.CONSTANTES.ID_PRODUCTO_APV)) {
      return true;
    }

    let validador = this.listadoRegimenes.find((regimen: RegimenGiro) => regimen.saldoTotal !== 0);

    return (validador == undefined); // No se encuentra un producto con saldo != 0 , retornamos verdadero.
  }

  /**
   * Función encargada de seleccionar producto APV o CUENTA 2 
   */
  seleccionarProducto() {
    this.mostraTextoInformativoInicio = false;
    if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      this.validarCuentaCOVID();
    } else if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV) {
      this.modalSelectedAPV = true;
    }
  }

  /**
   * Encargado de validar mensaje cuenta covid (bloqueado)
   */
  validarCuentaCOVID(): void {
    if (this.idTipoProducto !== this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      return; // validación solo aplica para cuenta 2
    }
    
    this.modalSelectedCtaDos = true;
  }

  /**
   * Encargado mover al usuario al home de la app.
   */
  irAlInicio(): void{    
    this.navCtrl.navigateRoot('HomeClientePage');
  }

  /**
   * Función encatgada e mostrar toast de producto no disponible.
   */
  seleccionarProductoNoDisponible(){
    this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_1.TOAST_APV_NO_DISPONIBLE);
  }

  /**
   * Función encargada de crear listado de regimenes , utilizando respuesta de servicio  
   */
  crearListadoRegimenes(): void {
    this.listadoRegimenes = [];
    const producto = this.obtenerJSONTipoProducto();
    this.productoSeleccionado = producto;

    if (!producto || !producto.fondos) return;

    producto.fondos.forEach((fondo: any) => {
      fondo.regimenes.forEach((regimen: any) => {
        const idRegimen = regimen.idTipoRegimenTributario;
        // No se debe agregar regimen antiguo
        if (idRegimen !== this.CONSTANTES.ID_REGIMEN_ANTIGUO){
          const regimenExistente = this.obtenerRegimenExistente(idRegimen);
          regimenExistente
            ? this.agregarFondoRegimenExistente(regimenExistente, regimen, fondo)
            : this.crearRegimenGiro(regimen, fondo);
        }
      });
    });
  }

  /**
   * Función que obtiene json para un tipo de producto en especifico, desde listado de productos. 
   */
  obtenerJSONTipoProducto() {
    return this.productosCliente.find((producto: any) => producto.idProducto === this.idTipoProducto);
  }

  /**
   * Función encargada de agregar fondo a regimen ya almacenado
   * @param regimenExistente 
   * @param regimen 
   * @param fondo 
   */
  agregarFondoRegimenExistente(regimenExistente:RegimenGiro, regimen: any, fondo: any) {
    let fondoRegimen:FondoRegimenGiro = this.crearFondoRegimenGiro(regimen,fondo);
    regimenExistente.sumarMontoSaldoTotal(fondoRegimen.saldoActual);
    regimenExistente.listadoFondos.push(fondoRegimen);
  }

  /**
   * Función Encargada de crear regimen giro , con fondo inicial , luego agrega al listado general de regimenes 
   * @param regimen 
   * @param fondo 
   */
  crearRegimenGiro(regimen: any,fondo: any) {
    let fondoInicial = this.crearFondoRegimenGiro(regimen,fondo);
    let nuevoRegimen: RegimenGiro = new RegimenGiro();
    nuevoRegimen.idTipoRegimenTributario = regimen.idTipoRegimenTributario;
    nuevoRegimen.nombreRegimen = regimen.descripcionRegimenTributario;
    nuevoRegimen.listadoFondos.push(fondoInicial);
    nuevoRegimen.sumarMontoSaldoTotal(fondoInicial.saldoActual);

    this.listadoRegimenes.push(nuevoRegimen);
  }

  /**
   * Función encargada de crear fondo para un regimen en especifico. 
   * @param regimen del cual se obtiene el saldo actual.
   * @param fondo a crear 
   */
  crearFondoRegimenGiro(regimen: any, fondo:any) : FondoRegimenGiro{
    let fondoRegimenGiro: FondoRegimenGiro = new FondoRegimenGiro();
    fondoRegimenGiro.idFondo = fondo.idFondo;
    fondoRegimenGiro.nombreFondo = fondo.nombreFondo;
    fondoRegimenGiro.cuotasActual = regimen.montoCuotasEnLinea;
    fondoRegimenGiro.idCuentaMae = fondo.idCuenta.toString();
    fondoRegimenGiro.valorCuotaActual = fondo.valorCuota;
    fondoRegimenGiro.saldoActual = regimen.saldoEnPesosEnLinea;

    return fondoRegimenGiro;
  }

  /* Función encargada de validar si se encuentra regimen en listado de regimenes , evita duplicidad  */
  obtenerRegimenExistente(idTipoRegimenTributario: string) {
    if (this.listadoRegimenes.length == 0){
      return null;
    }

    // Buscamos dentro del listado de regimenes si existe el elemento buscado.
    return this.listadoRegimenes.find((regimenGiro: any) => regimenGiro.idTipoRegimenTributario === idTipoRegimenTributario);
  }

  /*
    Función que carga modal detalle giro
    @param regimenSeleccionando desde listado de regimenes
   */
  eventoMostrarDetalleGiro(regimenSeleccionado: RegimenGiro): void {
    
    // En caso de que se encuentre regimen 24 giros covid activado , mostrar toast!
    if(regimenSeleccionado.estado24GirosCOVID){
      this.utilService.mostrarToast(CONSTANTES_GIRO.MENSAJE_24_GIROS_COVID);
      return;
    }

    this.regimenSeleccionado = regimenSeleccionado;
    
    // Validamos saldos negativos / comprometidos
    if(this.validarSaldoFondoNegativo()){
      this.utilService.mostrarToast(this.CONSTANTES.TEXTO_VALIDACION_SALDOS_COMPROMETIDOS);
      return;
    } else {
      this.reemplazarSaldoFondoNegativo();
    }

    if(regimenSeleccionado.confirmado) {
      this.regimenSeleccionado.resetearConfirmacionFondos();
      this.tituloModalDetalleGiro = this.CONSTANTES.TITULO_DETALLE_GIRO_EDITAR;
    } else {
      this.tituloModalDetalleGiro = this.CONSTANTES.TITULO_DETALLE_GIRO_AGREGAR;
    }
    this.mostrarDetalleGiro = true;
  }

  /**
   * Encargado de validar:
   * Si el tipo de producto es apv & usuario es pensionado & dentro del listado de fondos no existe uno con saldo >= 0 
   * @returns
   * true: No existen fondos con saldos >= 0 ( solo fondos negativos ), el cual indica al usuario que no puede girar y no se muestra detalle giro.
   * false: Caso contrario , se continua con el flujo ( mostrar modal de detalle de giro ).
   */
  validarSaldoFondoNegativo(): boolean {
    let validadorSaldosNegativos = this.regimenSeleccionado.listadoFondos.find((fondo: any) => fondo.saldoActual >= 0 ); // buscamos fondos con saldos >= 0 
    return this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV && this.esPensionado && validadorSaldosNegativos === undefined;
  }

   /**
   * En el caso de cuenta APV , pensionado , se puede dar el caso de que el saldo de un fondo llegue negativo ( por saldo comprometidos ) , para este o todos los casos que sucedan (saldos negativos ), se reemplazan por un '0'
   */
  reemplazarSaldoFondoNegativo() {
    if(this.regimenSeleccionado.saldoTotal < 0 ){
      this.regimenSeleccionado.saldoTotal = 0;
    }
    for(let fondo of this.regimenSeleccionado.listadoFondos) {
      if (fondo.saldoActual < 0 ){
          fondo.saldoActual = 0;
      }
    }
  }

  /**
   * Encargada de ocultar detalle giro & regresar objetos a estado inicial.
   * Además , limpia variables de objeto a mostrar , en caso que no haya confirmado.
   */
  eventoCerrarDetalleGiro() {
    this.mostrarDetalleGiro = false;
    for(let fondo of this.regimenSeleccionado.listadoFondos) {
      fondo.mostrarDetalleGiroFondo = false;
      fondo.botonConfirmadoDesactivado = false;
      if (!this.regimenSeleccionado.confirmado) {
        fondo.montoGirar = "";
        fondo.confirmadoParaGirar = false;
      }
    }
  }

  /**
   * Encargado de validar si aplica Impuesto del 15 %, aplicado al monto de retiro.
   * Este impuesto es solo valido para cuenta apv & regimen B
   * En en caso de que aplique , se realiza la asignacion de impuesto.
   * En el caso de que NO aplique , solo se retorna ( return )
   * @param fondoSeleccionado 
   * @param montoRetiro 
   */
  async validarCalculoImpuestos(fondoSeleccionado: FondoRegimenGiro,montoRetiro: number){
    // Impuesto solo aplicable para cuenta APV + regimen B
    if(this.idTipoProducto != this.CONSTANTES.ID_PRODUCTO_APV){
      return;
    }
    if(this.regimenSeleccionado.idTipoRegimenTributario != this.CONSTANTES.ID_REGIMEN_B_APV){
      return;
    }

    fondoSeleccionado.impuestos = montoRetiro * this.CONSTANTES.FACTOR_QUINCE_PORCIENTO;
  }
  /**
   * Encargado de calcular comision giro
   * @param fondoSeleccionado fondo seleccionado por el usuario.
  */
  async calcularComisionGiro(fondoSeleccionado: FondoRegimenGiro){
    if(this.validarRegimenCOVID()){
      this.calcularDetalleGiro(fondoSeleccionado);
      return;
    }

    const loading = await this.contextoAPP.mostrarLoading();
    const valorASumarMes = 1;
    const fechaRetiroDate = new Date();
    const diaRetiro = fechaRetiroDate.getDate();
    const mesRetiro = fechaRetiroDate.getMonth() + valorASumarMes; //Enero es 0!
    const anioRetiro = fechaRetiroDate.getFullYear();

    let fechaRetiro:string = diaRetiro + "-" + mesRetiro + "-" + anioRetiro;
    let idMaeCuenta = fondoSeleccionado.idCuentaMae;
    let idTipRegTribu = this.regimenSeleccionado.idTipoRegimenTributario;
    let idTipoFondo = fondoSeleccionado.idFondo;
    let idTipoProducto = this.productoSeleccionado.idProducto;
    let montoRetiro = this.obtenerNumeroMonto(fondoSeleccionado.montoGirar);

    let parametrosComision = new ParametrosComisionGiro(
      this.rut.toString(),
      this.dv,
      fechaRetiro,
      idMaeCuenta,
      idTipRegTribu,
      idTipoFondo,
      idTipoProducto,
      montoRetiro.toString()
      );
    this.giroService.obtenerComisionGiro(parametrosComision).subscribe(async (response: any) => {
      this.contextoAPP.ocultarLoading(loading);
      if(response != undefined && response.MontoPesos != undefined){
        fondoSeleccionado.comision = +(response.MontoPesos);
        this.validarCalculoImpuestos(fondoSeleccionado,montoRetiro);
        this.calcularDetalleGiro(fondoSeleccionado);
      } else {
        await this.registrarTrazaErrorGiros();
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
      }
    }, async (error) => {
      this.procesarErrorGenerico(loading);
    });
  }

  /**
   * Función encargada de mostrar calculo con detalle de giro 
   * @param fondoSeleccionado 
   */
  calcularDetalleGiro(fondoSeleccionado: FondoRegimenGiro) {
    fondoSeleccionado.mostrarDetalleGiroFondo = true;
    let montoGirarNumber = this.obtenerNumeroMonto(fondoSeleccionado.montoGirar);
    let valorCuotaActual = fondoSeleccionado.valorCuotaActual;
    
    fondoSeleccionado.montoBruto = montoGirarNumber;
    fondoSeleccionado.montoLiquido = (montoGirarNumber - fondoSeleccionado.impuestos ) - fondoSeleccionado.comision;
    fondoSeleccionado.saldoPostGiro = fondoSeleccionado.saldoActual - montoGirarNumber;
    fondoSeleccionado.totalCuotasGirar = (montoGirarNumber / valorCuotaActual).toFixed(2);
    fondoSeleccionado.totalCuotasGirarFormat = fondoSeleccionado.totalCuotasGirar.replace(".",",");
    fondoSeleccionado.cuotasPostGiro = fondoSeleccionado.saldoPostGiro / valorCuotaActual;

    let totalNoventaPorciento = fondoSeleccionado.saldoActual * this.CONSTANTES.FACTOR_NOVENTA_PORCIENTO;

    // Validación de giros en cuotas SOLO aplica para cuenta 2 
    if((montoGirarNumber > totalNoventaPorciento) && (this.tipoCuentaValidar == this.CONSTANTES.NOMBRE_PRODUCTO_CUENTA_2)){
      fondoSeleccionado.esGiroEnCuotas = true;
    }
  }

  /*Función encargada de aceptar giro para regimen seleccionado
    Se deja en estado por defecto la variable mostrar detalle giro */
  aceptarGiroRegimen(): void {
    if(this.validarMontoMaxMultiFondos()){
      this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_1.TEXTO_VALIDACION_MAX_SUMA);
      return;
    }

    for(let fondo of this.regimenSeleccionado.listadoFondos) {
      fondo.mostrarDetalleGiroFondo = false;
      fondo.botonConfirmadoDesactivado = false;
    }
    this.regimenSeleccionado.confirmado = true;
    this.mostrarDetalleGiro = false;
  }

  /* Confirma giro para fondo / regimen seleccionado */
  confirmarGiro(fondoSeleccionado: FondoRegimenGiro): void {
    fondoSeleccionado.confirmadoParaGirar = true;
    fondoSeleccionado.botonConfirmadoDesactivado = true;
    fondoSeleccionado.montoGirarConfirmado = fondoSeleccionado.montoGirar;

     if (this.regimenSeleccionado.listadoFondos.length == 1 ) {
       this.aceptarGiroRegimen();
     }
  }
   
  /*Cancela giro */ 
  cancelarGiro(fondoSeleccionado: FondoRegimenGiro) {
    if(fondoSeleccionado.confirmadoParaGirar === undefined){
      fondoSeleccionado.confirmadoParaGirar = false;
    }
    fondoSeleccionado.mostrarDetalleGiroFondo = false;
    fondoSeleccionado.botonConfirmadoDesactivado = false;
  }

  /**
   * Función utilitaria , que reemplaza valores de texto , para retornar valor numerico.
   * @param numeroString 
   */
  obtenerNumeroMonto(numeroString:string): number {
    let numeroFormateado = (numeroString.replace("$",""));
    let numeroFormateadoInt = +(numeroFormateado.split('.').join(""));
    return numeroFormateadoInt;
  }

  /**
   * Valida estado de boton calcular , al ingresar un monto  
   * @param idFondo a validar 
   * @returns true : Estado de boton desactivado por que no cumple con las validaciones.
   */
  validarEstadoBotonCalcular(fondo: FondoRegimenGiro):boolean {
    if (fondo.montoGirar === undefined || fondo.montoGirar === '') return true;
  
    const valorMinimo = fondo.valorCuotaActual * this.CONSTANTES.CONSTANTE_MONTO_MIN;
    const valorString = fondo.montoGirar.toString().replace('$', '');
    const montoGirar = Number(this.eliminarFormato(valorString));
    const totalNoventaPorciento = fondo.saldoActual * this.CONSTANTES.FACTOR_NOVENTA_PORCIENTO;
  
    // Validacion max ( mayor al monto total o mayor a 100.000.000 )
    const excedeMaximo = montoGirar > fondo.saldoActual || montoGirar > this.CONSTANTES.CONSTANTE_MONTO_MAX;
    // Validación monto minimo.
    const esMenorQueMinimo = montoGirar < valorMinimo;
    //  Validación solo para APV | El monto ingresado no puede ser mayor al 90 % del saldo actual
    const excedeNoventaPorciento = montoGirar > totalNoventaPorciento &&
      this.tipoCuentaValidar === this.CONSTANTES.NOMBRE_PRODUCTO_APV;
  
    return excedeMaximo || esMenorQueMinimo || excedeNoventaPorciento;
  }

  /**
   * Encargada de validar estado boton aceptar giro.
   */
  validarEstadoBotonAceptar() {
    if(this.regimenSeleccionado.listadoFondos.length > 1){
      return !this.regimenSeleccionado.listadoFondos.find((fondo: any) => fondo.botonConfirmadoDesactivado === true);
    } else if(!this.regimenSeleccionado.confirmado) {
      return true;
    }
  }

  /**
   * Encargado de validar monto min & max para un fondo en especifico. 
   * @param fondo 
   */
  validaMontoMinMax(fondo: FondoRegimenGiro) {
    let valorMinimo = fondo.valorCuotaActual * this.CONSTANTES.CONSTANTE_MONTO_MIN;


    fondo.montoGirar = this.contextoAPP.limpiaCaracteres(fondo.montoGirar) + "";
    if(fondo.montoGirar == 'null'){
      fondo.montoGirar="";
    }
    const parts = this.eliminarFormato(fondo.montoGirar).split(this.CONSTANTES.DECIMAL_SEPARATOR);
    fondo.montoGirar = '$' + new Intl.NumberFormat('es-CL').format(parts[0]) +
    (!parts[1] ? '' : this.CONSTANTES.DECIMAL_SEPARATOR + parts[1]);

    // Validación solo para APV
    // El monto ingresado no puede ser mayor al 90 % del saldo actual
    let totalNoventaPorciento = fondo.saldoActual * this.CONSTANTES.FACTOR_NOVENTA_PORCIENTO;

    if (fondo && fondo.montoGirar) {
      const valString = fondo.montoGirar.toString().replace("$", "");
      const montoGirar = this.eliminarFormato(valString).split(this.CONSTANTES.DECIMAL_SEPARATOR);
      if (montoGirar && (montoGirar > fondo.saldoActual)) {
        this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_1.VALIDACION_MONTO_MAX);
      }
      else if(montoGirar &&  (montoGirar > this.CONSTANTES.CONSTANTE_MONTO_MAX)){
        this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_1.TEXTO_VALIDACION_MAX);
      }
      else if(montoGirar && montoGirar < valorMinimo){
        this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_1.VALIDACION_MONTO_MIN);
      }
      else if((montoGirar > totalNoventaPorciento) && (this.tipoCuentaValidar == this.CONSTANTES.NOMBRE_PRODUCTO_APV)){
        this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_1.MENSAJE_VALIDACION_APV_NOVENTA);
      }
    }
  }

  /**
   * Si el regimen se encuentra distribuido en dos fondos. 
   * La sumatoria de ambos montos , no puede exceder los 30 MM. 
   * @returns true : Supera los 30 millones en la suma de sus fondos.
   */
  validarMontoMaxMultiFondos(): boolean{
    if(this.regimenSeleccionado.listadoFondos.length > 1 ){
      let sumaTotal = 0 ;
      for(let fondo of this.regimenSeleccionado.listadoFondos) {
        let valString = "";
        if(fondo.confirmadoParaGirar && fondo.montoGirarConfirmado != undefined) {// Si el fondo esta confirmado , sumamos el fondo confirmado
          valString = fondo.montoGirarConfirmado.toString().replace("$", "");
        }

        if(valString != "") {
          const montoGirar = +this.eliminarFormato(valString).split(this.CONSTANTES.DECIMAL_SEPARATOR);
          sumaTotal = sumaTotal + montoGirar;
        }
      }
      if(sumaTotal > this.CONSTANTES.CONSTANTE_MONTO_MAX){
        return true;
      }
    }

    return false;
  }

  /**
   * Función encargada de validar estado boton continuar.
   * Si existe un regimen confirmado para girar , puede continuar con el flujo.
   */
  validarBotonContinuar() {
    for(let regimenGiro of this.listadoRegimenes) {
      if (regimenGiro.confirmado) {
        return false;
      }
    }

    return true;
  }
  
  /**
   * Función encargada de generar lista de regimenes a girar , utilizada en el step 2.
   */
  procesarListadoRegimenesAGirar(): RegimenGiro[] {
    let listadoRegimenesAGirar: RegimenGiro[] = [];
    // Buscamos regimenes confirmados para girar, luego filtramos sus fondos sin confirmar y  los almacenamos en nuestra lista 
    for(let regimenGiro of this.listadoRegimenes) {
      let regimenConfirmado:RegimenGiro = new RegimenGiro();
      if (!regimenGiro.confirmado) {
        continue;
      }
      regimenConfirmado =  JSON.parse(JSON.stringify(regimenGiro));
      regimenConfirmado.listadoFondos = regimenConfirmado.listadoFondos.filter(fondo => fondo.confirmadoParaGirar);
      listadoRegimenesAGirar.push(regimenConfirmado);
    }

    return listadoRegimenesAGirar;
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
        handler: () => {}
      },
      {
        text: 'CONTINUAR',
        handler: () => {
          this.navCtrl.navigateRoot('HomeClientePage');
        }
    }
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
    this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: botones
    }).then(confirmData => confirmData.present());
  }

  /**
   * Función que continua al step 2 , pasando como parametro listado de regimenes a girar
   */
  continuarStep2() {
    let listadoRegimenesAGirar = this.procesarListadoRegimenesAGirar();
    let parametrosGiro: ParametrosGiro = new ParametrosGiro(
      this.rut,
      this.dv,
      this.email,
      this.nombreUsuario,
      this.apellidoUsuario,
      this.telefonoCelular,
      listadoRegimenesAGirar,
      this.idTipoProducto,
      this.tipoCuentaValidar);
    
    const parametros: NavigationExtras = {
        queryParams: {
            option: JSON.stringify(parametrosGiro)
        }
    };
    this.navCtrl.navigateForward('GiroStepDosPage',parametros);
    this.mostrarDetalleGiro = false;
  }

  /**
   * Encargado de cerrar modal informativo para un tipo de producto en especifico.
   * @param tipoCta
   */
  ocultarModal(tipoCta: string) {
    if (tipoCta == this.CONSTANTES.CODIGO_PRODUCTO_CUENTA_2) {
      this.modalSelectedCtaDos = false;
    } else if (tipoCta == this.CONSTANTES.CODIGO_PRODUCTO_CUENTA_APV) {
      this.modalSelectedAPV = false;
    }
  }

  /**
   * Encargado de autoformatear monto a girar ingresado por el usuario.
   * @param valString
   */
  formatMontoGirar(fondo:FondoRegimenGiro,valString: string) {
    if (!valString) {
      fondo.montoGirar = '';
    }
    valString = valString.toString().replace( '$', '');
    const parts = this.eliminarFormato(valString).split(this.CONSTANTES.DECIMAL_SEPARATOR);
    fondo.montoGirar = '$' + new Intl.NumberFormat('es-CL').format(parts[0]) +
    (!parts[1] ? '' : this.CONSTANTES.DECIMAL_SEPARATOR + parts[1]);
  }

  /**
   * Elimina formato.
   * @param val
   */
  eliminarFormato(val: any) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '');

    if (this.CONSTANTES.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
    } else {
      return val.replace(/\./g, '');
    }
  }

  /**
   * Encargada de abrir url especifica en browser
   * @param slide
   */
  abrirLinkGiro(slide: any) {
    this.utilService.openWithSystemBrowser(slide.link);
  }

  /**
   * Encargada de realizar acción de llamar a contact center.
   */
  llamarContactCenter() {
    window.open('tel:' + this.CONSTANTES.TELEFONO_CONTACT, '_system');
  }

  /**
   * Evento gatillado desde el enter del teclado.
   * Si se cumple con las condiciones , se ejecuta evento calcular.
   */
  validarEventoCalcular(fondoSeleccionado: FondoRegimenGiro){
    Keyboard.hide();
    this.validaMontoMinMax(fondoSeleccionado);
    if(this.validarEstadoBotonCalcular(fondoSeleccionado)){ // Si no se cumple con la validación del boton calcular , retornamos.
      return;
    }

    this.calcularComisionGiro(fondoSeleccionado);
  }

   /**
   * Encargado de registrar traza inicio, dependiendo del tipo producto.
   */
  async registrarTrazaInicioGiros(){
    if(this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_APV.CODIGO_OPERACION);
    } else{
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar traza error, dependiendo del tipo producto.
   */
  async registrarTrazaErrorGiros(){
    if(this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_ERROR_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_ERROR_CAV.CODIGO_OPERACION);
    }
  }

   /**
    * Metodo que registra la trazabilidad de giros. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    */
  async registrarTrazabilidad(codigoOperacion:number) {
    let parametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza : CONSTANTES_TRAZAS_GIRO,
      uuid : this.uuid,
      rut: this.rut,
      dv: this.dv,
    }

    switch (codigoOperacion) {
      case CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_ERROR_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_ERROR_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_ERROR_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP1.INICIO_GIROS_ERROR_CAV);
        break;
    }

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
  }

  /**
   * Encargado de mostrar modal informativo de regimenes para cuenta 2 o apv.
   */
  mostrarModalInfoRegimenes() {
    if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_CUENTA_2) {
      this.modalDetalleRegimenGiroCuenta2 = true;
    } else if (this.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV) {
      this.modalDetalleRegimenGiroAPV = true;
    }
  }

  /**
   * Utilitario para validar si se encuentra regimen covid
   * @returns true : exite regimen covid / false: no existe.
   */
  existeRegimenCOVID24Giros(): boolean {
    if(this.idTipoProducto !== this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
      return false;// en el caso de que sea distinto a cuenta 2
    }

    let validadorCOVID = this.listadoRegimenes.find((regimen: RegimenGiro) => regimen.idTipoRegimenTributario.toString() === CONSTANTES_GIRO.ID_REGIMEN_COVID);
    if(validadorCOVID === undefined){
      return false;// en el caso de que no exista cuenta covid
    }

    // si existe cuenta covid , seteamos validador de toast 24 giros covid cav
    for(let regimen of this.listadoRegimenes) {
      if(regimen.idTipoRegimenTributario.toString() !== CONSTANTES_GIRO.ID_REGIMEN_COVID){
        regimen.estado24GirosCOVID = true;
      }
    }
    
    return true;
  }

  /**
   * Utilitario para validar si se encuentra regimen covid
   * @returns true : es regimen covid / false: no es regimen covid 
  */
  validarRegimenCOVID(): boolean {
    if(this.regimenSeleccionado.idTipoRegimenTributario.toString() === CONSTANTES_GIRO.ID_REGIMEN_COVID ){
      return true;
    }
    return false;
  }

  /**
   * Metodo encargado de agrandar el modal cuando se habre el teclado.
   */
  resizeModalRegimen(margen: string): void {
    if (this.btnRegimen) {
      this.renderer.setStyle(this.btnRegimen.nativeElement, 'margin-bottom', margen);
    }
  }
}
