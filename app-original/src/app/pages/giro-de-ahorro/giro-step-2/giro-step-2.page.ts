import { Component, ApplicationRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { RegimenGiro } from '../util/regimen.giro';
import { CONSTANTES_GIRO_STEP_2, CONSTANTES_GIRO, CONSTANTES_CUENTA_DIGITAL, CONSTANTES_TRAZAS_GIRO } from '../util/constantes.giro';
import { ParametrosGiro } from '../util/parametros.giro';
import { LoadingController, NavController, AlertController, Platform } from '@ionic/angular';
import { UtilService, GiroService, TrazabilidadService } from 'src/app/services';
import { NavigationExtras, ActivatedRoute } from '@angular/router';  
import { ContextoAPP } from 'src/app/util/contexto-app';
import { Keyboard } from '@capacitor/keyboard';
import { RequestValidacionCuenta, ResponseValidacionCuenta } from '../util/validacion-cuenta';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';

@Component({
  selector: 'page-giro-step-2',
  templateUrl: 'giro-step-2.page.html',
  styleUrls: [ './giro-step-2.page.scss'],
  animations: [
    trigger('fadeInOut', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate(300, style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate(300, style({ opacity: 0 }))
        ])
    ])
]
})

export class GiroStepDosPage {
  // Referencia a constantes giro 1 , utilizada directamente en la vista. 
  readonly CONSTANTES = CONSTANTES_GIRO_STEP_2;
  // Listado de bancos general utilizados por habitat.
  listadoBancosGeneral: any[];
  // Listado de bancos almacenados para el usuario
  listadoBancosGuardados: any[];
  // ID banco seleccionado , desde combo banco.
  idBancoSeleccionado: any;
  // ID Tipo cuenta seleccionado , desde combo tipo cuenta.
  idTipoCuentaSeleccionada: any;
  // Referencia a componente loading.
  indicadorLoading: any;
  // Numero de cuenta ingresada por el usuario , para realizar el giro.
  numeroCuenta: number;
  // Validador para mostrar modal informativo Número de cuenta.
  mostrarModalNumeroCuenta: boolean = false;
  // Validador para mostrar modal informativo banco.
  mostrarModalBanco: boolean = false;
  // Validor utilizado para mostrar o ocultar , combo tipo cuenta.
  validadorComboTipoCuenta: boolean = false;
  // Validador utilizado para mostrar o ocultar , input tipo cuenta.
  validadorInputCuenta: boolean = false;
  // Validador utilizado para mostrar o ocultar , modal condiciones giro.
  validadorModalCondicionesGiro: boolean = false;
  // Placeholder combo bancos
  tituloBancoADepositar: any = { header: this.CONSTANTES.TEXTO_COMBO_BANCO };
  // Placeholder combo tipo cuenta.
  tituloTipoCuenta: any = { header: this.CONSTANTES.TEXTO_COMBO_TIPO_CUENTA };
  // Listado constante con tipo de cuenta.
  listadoTipoCuenta: any[] = [];
  // listado de regimenes a girar.
  listadoRegimenesAGirar: RegimenGiro[] = [];

  parametrosGiro: ParametrosGiro;
  // Monto total a girar , aplica para regimenes con varios fondos girados
  montoTotalAGirar:number = 0;

  // Validador giro covid
  validacionGiroCOVID:boolean = false;
  // tipo vale vista santander covid
  validacionValeVistaCOVID:boolean = false;

  // Tipo cuenta bloqueada
  tipoCuentaBloqueada: string;

  // Flag que bloquea la cuenta ingresada
  cuentaBloqueada: boolean;

  /**
   * Flag modal cuenta bloqueada.
   */
  modalCuentaBloqueada: boolean;

  /**
   * Loading para validacion de cuentas.
   */
  loadingCuentas: HTMLIonLoadingElement;

  /**
   * UUID de la transacción
   */
  uuid: string;

  /**
   * Boton regimen.
   */
   @ViewChild('botoneraCuenta') botoneraCuenta: ElementRef;

  constructor (
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private giroService: GiroService,
              private utilService: UtilService,
              private loading: LoadingController,
              private ref: ApplicationRef,
              private route: ActivatedRoute,
              private contextoAPP: ContextoAPP,
              private readonly trazabilidadProvider: TrazabilidadService,
              private readonly renderer: Renderer2,
              private readonly platform: Platform) {
    this.route.queryParams.subscribe(params => {
      let jsonObject = JSON.parse(params.option) as Object;
      this.parametrosGiro = jsonObject as ParametrosGiro;
      this.listadoRegimenesAGirar = this.parametrosGiro.listadoRegimenesAGirar;
      this.validarRegimenCOVID();
    });
  }

  async ngOnInit() { 
    this.uuid = await this.utilService.getStorageUuid();

    const loading = await this.contextoAPP.mostrarLoading();
    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Giro_Ahorro_Step2A' });
    await this.registrarTrazabilidadInicioGiros();
    this.utilService.mostrarToast(CONSTANTES_GIRO_STEP_2.TOAST_STEP_2_GIRO);
    this.cargarListadoBancoGeneral();
    this.contextoAPP.ocultarLoading(loading);

    if (this.platform.is('android')) {
      Keyboard.addListener('keyboardDidShow', info => {
        this.resizePantalla(`${info.keyboardHeight.toString()}px`);
      });
  
      Keyboard.addListener('keyboardDidHide', () => {
        this.resizePantalla('inherit');
      });
    } 
  }

  /**
   * Evento on chage combo listado de bancos
   */
  async eventoOnChangeBanco(){
    // En el caso de seleccionar vale vista covid , no se debe ejecutar evento onchange
    if(this.validacionValeVistaCOVID){
      return;
    }
    this.utilService.setLogEvent('event_habitat', { option:'Giro Ahorro Step 2 Selector A /	Paso 2 INICIO BANCO' });
    await this.registrarTrazabilidadBancoGiro();
    this.validadorComboTipoCuenta = true
    this.numeroCuenta = null!;
    this.validarCuentaBancoGuardada();
  }

  /**
   * Evento on chage combo tipo de cuenta banco
   */
  eventoOnChangeTipoCuenta(){
    this.validarCuentaVistaBancoEstado();
    this.validadorInputCuenta = true;
  }

    /**
   * Metodo que cambia estado realizar solicitud de giro.
   * @returns true , desactivado , false activado
   */
  soloNumeros(){
    this.numeroCuenta= this.contextoAPP.limpiaCaracteres(this.numeroCuenta);
  }
  
  /**
   * Valida estamod boton continuar
   * @returns false , continuar activado
   * @returns true , continuar disabled
   */
  validarBotonRealizarGiro(): boolean {
    if(this.validacionValeVistaCOVID){// En el caso de vale vista covid , habilitamos continuar
      return false;
    }

    const largoNumeroCuenta = String(this.numeroCuenta); 
    if ( (largoNumeroCuenta.length < this.CONSTANTES.CANTIDAD_MIN_INPUT_NUMERO_CUENTA) || (this.idBancoSeleccionado === undefined) || (this.idTipoCuentaSeleccionada == undefined) || (this.idTipoCuentaSeleccionada == -1) ) {
      return true;
    }
    return false;
  }

  validarIntroRealizarGiro() {
    const largoNumero = String(this.numeroCuenta); 
    if ( (largoNumero.length < this.CONSTANTES.CANTIDAD_MIN_INPUT_NUMERO_CUENTA) || (this.idBancoSeleccionado === undefined) || (this.idTipoCuentaSeleccionada == undefined) || (this.idTipoCuentaSeleccionada == -1) ) {
      Keyboard.hide();
    }
    else {
      this.eventoRealizarSolicitudGiro();
    }
  
  }

   /**
     * Función utilizada en step 2, para mostrar la suma de giros en fondos confirmados
     */
  obtenerMontoTotalAGirar(regimenGiro: RegimenGiro): number {
      let montoTotalGirar = 0;
      for(let fondo of regimenGiro.listadoFondos) {
        let monto = fondo.montoLiquido;
        montoTotalGirar = montoTotalGirar + monto;
      }
      return montoTotalGirar;
  }

  /**
   * Encargado de mostrar modal de condiciones de giro.
   */
  async eventoRealizarSolicitudGiro(): Promise<void> {
    this.loadingCuentas = await this.contextoAPP.mostrarLoading();

    await this.validarCuentasDigitales();
        
    if (!this.cuentaBloqueada) {   
      this.utilService.setLogEvent('event_habitat', { option:'Fin_Banco_Giro_Ahorro_Step2A' });
      this.validadorModalCondicionesGiro = true;
    } else {
      this.modalCuentaBloqueada = true;
      // Se activa flag existente para desliegue de check de vale vista
      this.validacionGiroCOVID = true;
    }
    
    this.contextoAPP.ocultarLoading(this.loadingCuentas);
  }

  /**
   * Metodo encargado de validar si la cuenta ingresada es una cuenta digital
   */
  async validarCuentasDigitales(): Promise<void> {
    this.tipoCuentaBloqueada = '';
    this.cuentaBloqueada = false;

    if (+this.idTipoCuentaSeleccionada === CONSTANTES_CUENTA_DIGITAL.TIPO_CUENTA_VISTA) {
      switch (+this.idBancoSeleccionado) {
        case CONSTANTES_CUENTA_DIGITAL.BANCO_BCI:
          this.validarCuentaDigital(CONSTANTES_CUENTA_DIGITAL.LARGO_CUENTA_12, CONSTANTES_CUENTA_DIGITAL.PREFIJO_BCI);
          break;
        case CONSTANTES_CUENTA_DIGITAL.BANCO_RIPLEY:
          this.validarCuentaDigital(CONSTANTES_CUENTA_DIGITAL.LARGO_CUENTA_10, CONSTANTES_CUENTA_DIGITAL.PREFIJO_RIPLEY);
          this.validarCuentaDigital(CONSTANTES_CUENTA_DIGITAL.LARGO_CUENTA_11, CONSTANTES_CUENTA_DIGITAL.PREFIJO_RIPLEY);
          break;
        case CONSTANTES_CUENTA_DIGITAL.BANCO_SANTANDER:
          this.validarCuentaDigital(CONSTANTES_CUENTA_DIGITAL.LARGO_CUENTA_11, CONSTANTES_CUENTA_DIGITAL.PREFIJO_SANTANDER);
          break;
        default:
          this.tipoCuentaBloqueada = '';
          this.cuentaBloqueada = false;
          break;
      }
    }

    if (!this.cuentaBloqueada && !this.validacionValeVistaCOVID) {
      await this.validarBlacklist();
    }
  }

  /**
   * Metodo que realiza llama a servicio de validación de blacklist para cuentas.
   */
  async validarBlacklist(): Promise<boolean> {
    return new Promise(resolve => {
      const indexBancoSeleccionado = this.listadoBancosGeneral.findIndex(item => item.IdEntidad.toString() === this.idBancoSeleccionado.toString());
      const bancoSeleccionado =  this.listadoBancosGeneral[indexBancoSeleccionado];

      let codigoEntidad;

      if (bancoSeleccionado) {
        codigoEntidad = bancoSeleccionado.CodEntidad;
      }

      const requestValidacionCuenta = new RequestValidacionCuenta();
      requestValidacionCuenta.codi_banco = codigoEntidad;
      requestValidacionCuenta.nmro_cuenta = this.numeroCuenta.toString();
      requestValidacionCuenta.nrut_cuenta = `${this.contextoAPP.datosCliente.rut.toString()}-${this.contextoAPP.datosCliente.dv}`;
  
      this.giroService.validarCuentaCliente(requestValidacionCuenta).subscribe((validacion: ResponseValidacionCuenta) => {      
        if (validacion.return  !== '') {
          this.tipoCuentaBloqueada = validacion.return;
          this.cuentaBloqueada = true;
        }

        resolve(this.cuentaBloqueada);
      }, error => {
        this.contextoAPP.ocultarLoading(this.loadingCuentas);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
      });
    });

  }


  /**
   * Metodo que valida si la cuenta ingresada es cuenta digital, 
   * esto se da si tiene el prefijo validado y es del largo determinado
   * 
   * @param largoCuentaDigital que determina si la cuenta es digital
   * @param prefijoCuentaDigital que determina si la cuenta es digital
   */
  validarCuentaDigital(largoCuentaDigital: number, prefijoCuentaDigital: string): void {
    const numeroCuentaString = this.numeroCuenta.toString();
    const largoNumeroCuenta = numeroCuentaString.length;
    if (largoNumeroCuenta === largoCuentaDigital && numeroCuentaString.startsWith(prefijoCuentaDigital)) {
      this.tipoCuentaBloqueada = CONSTANTES_CUENTA_DIGITAL.TIPO_DIGITAL;
      this.cuentaBloqueada = true;
    }
  }

  /**
   * Encargado de llevar al usuario al step 3 , luego de aceptar condiciones desde el modal de condiciones.
   */
  async eventoAceptarCondiciones() {
    this.parametrosGiro.idBancoSeleccionado = this.idBancoSeleccionado;
    this.parametrosGiro.idTipoCuentaBancoSeleccionada = this.validacionValeVistaCOVID ? CONSTANTES_GIRO.TIPO_CUENTA_VALE_VISTA_COVID : this.idTipoCuentaSeleccionada;
    this.parametrosGiro.numeroCuenta = this.numeroCuenta === undefined ? "" : this.numeroCuenta.toString();
    this.utilService.setLogEvent('event_habitat', { option:'Giro Ahorro Step 2D / Paso 2 FIN BANCO' });
    await this.registrarTrazabilidadFinBancoGiro();
    const parametros: NavigationExtras = {
      queryParams: {
          option: JSON.stringify(this.parametrosGiro)
      }
    };
    this.navCtrl.navigateForward('GiroStepTresPage',parametros);
  }

  /**
   * Encargado de mostrar alerta / confirmación de cancelar giro.
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
        handler: async () => {
          this.utilService.setLogEvent('event_habitat', { option:'Giro Ahorro Step 2D / Paso 2 SIN FINALIZAR (Volver o Cancelar)' });
          await this.registraTrazabilidadSinFinalizarGiro();
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
    const confirm = this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: botones
    }).then(confirmData => confirmData.present());
  }


  /**
   * Función encargada de cargar listado de banco general.
   */
  async cargarListadoBancoGeneral() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.giroService.obtenerListaBancos(this.parametrosGiro.rut, this.parametrosGiro.dv).subscribe((response: any) => {
      this.listadoBancosGeneral = new Array();
      response.ListaBancos.forEach((banco: any) => {
        // Se filtran bancos con estado 1 / activo. 
        if (banco !== undefined && this.CONSTANTES.ID_BANCOS_HABILITADOS.find(valor => valor === Number(banco.CodEntidad)) ) {
          this.listadoBancosGeneral.push(banco);
        }
      });
      this.cargarListadoBancosGuardados();
      this.cargarListadoTipoCuenta(); //  cargamos listado de tipo cuenta
      this.contextoAPP.ocultarLoading(loading);
    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
    });
  }

   /**
   * Función encargada de cargar listado de banco guardados por el usuario.
   */
  async cargarListadoBancosGuardados() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.giroService.obtenerBancosRegistrados(this.parametrosGiro.rut, this.parametrosGiro.dv).subscribe((response: any) => {
      this.listadoBancosGuardados = new Array();
      this.contextoAPP.ocultarLoading(loading);
      if (response.CuentasBancarias === undefined){
        return;
      }
      this.listadoBancosGuardados = response.CuentasBancarias;
      this.validarBancoPrecargado();
    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
    });
  }

 /**
   * Función encargada de cargar listado de tipos de cuenta.
   */
  async cargarListadoTipoCuenta() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.giroService.obtenerListaTipoDeCuentas(this.parametrosGiro.rut, this.parametrosGiro.dv).subscribe((response: any) => {
      if (response.ListaTipoCuentas != undefined) {
        this.listadoTipoCuenta = response.ListaTipoCuentas;
      } else {
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
      }
      this.contextoAPP.ocultarLoading(loading);
    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
    });
  }

  /**
   * Si el usuario cuenta con solo un banco almacenado.
   * Se debe setear por defecto los combo de banco , tipo cuenta , input número de cuenta.
   */
  validarBancoPrecargado(){
    if (this.listadoBancosGuardados === undefined) {
      return;
    }

    let bancoGuardado = this.listadoBancosGuardados.find((banco: any) => banco.indicadorPredeterminada === "1");
    if (bancoGuardado === undefined) {
      return;
    }

    this.validadorInputCuenta = true;
    this.validadorComboTipoCuenta = true;
    this.idBancoSeleccionado = bancoGuardado.idEntidad;
    this.idTipoCuentaSeleccionada = bancoGuardado.idTipCuentaBanco;
    this.numeroCuenta = bancoGuardado.numeroCuentaBanco;
  }
  
  /**
   * Función encargada de validar , si el banco seleccionado por el usuario , se encuentra en el listado
   * de cuentas almacenadas y si lo encuentra , setea por defecto el combo tipo cuenta y el input número de cuenta.
   */
  validarCuentaBancoGuardada() {
    this.idTipoCuentaSeleccionada = -1;
    this.numeroCuenta = null!;

    if (this.listadoBancosGuardados === undefined) {
      return;
    }

    let bancoGuardado = this.listadoBancosGuardados.find((banco: any) => banco.idEntidad === this.idBancoSeleccionado && banco.indicadorPredeterminada === "1");
    if (bancoGuardado === undefined) {
      return;
    }
    // Si encontramos un banco guardado , se setean idTipoCuenta & numeroCuenta
    this.validadorInputCuenta = true;
    this.idTipoCuentaSeleccionada = bancoGuardado.idTipCuentaBanco;
    this.numeroCuenta = bancoGuardado.numeroCuentaBanco;
  }

  /**
   * Función encargada de validar si el usuario selecciona banco estado + tipo cuenta vista , se setea el numero de cuenta con el rut del usuario.
   */
  validarCuentaVistaBancoEstado(){
    if(this.idBancoSeleccionado == this.CONSTANTES.ID_BANCO_ESTADO && this.idTipoCuentaSeleccionada == this.CONSTANTES.ID_TIPO_CUENTA_VISTA){
      this.numeroCuenta = this.parametrosGiro.rut;
    }
  }

  /**
   * Función que levanta url de condiciones 
   */
  leerCondiciones() {
    if(this.parametrosGiro.tipoProductoSeleccionado === CONSTANTES_GIRO.NOMBRE_PRODUCTO_CUENTA_2){
      this.utilService.openWithSystemBrowser(this.CONSTANTES.LINK_CONDICIONES_CUENTA_2);
    } else {
      this.utilService.openWithSystemBrowser(this.CONSTANTES.LINK_CONDICIONES_APV);
    }
  }

  /**
   * Formateador de número cuenta , que elimina ceros al comienzo del input.
   * @param valString 
   */
  formatNumeroCuenta(event) {
    let caracterValido = false;
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < this.CONSTANTES.CARACTER_0 || charCode > this.CONSTANTES.CARACTER_9)) {
      event.preventDefault();
      caracterValido = false;
    } else {
      if(event.target.value.length === 0 && event.key === '0'){
        event.preventDefault();
      }else{
        caracterValido = true;
      }
    }
    return caracterValido;
  }

  /**
   * Encargado de registrar trazabilidad inicio step 2 dependiendo de tipo de producto.
   */
  async registrarTrazabilidadInicioGiros() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_GIROS_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_GIROS_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar trazabilidad inicio banco de tipo de producto.
   */
  async registrarTrazabilidadBancoGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_BANCO_GIROS_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_BANCO_GIROS_CAV.CODIGO_OPERACION);
    }
  }

   /**
   * Encargado de registrar trazabilidad fin banco de tipo de producto.
   */
  async registrarTrazabilidadFinBancoGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_FIN_BANCO_GIROS_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_FIN_BANCO_GIROS_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar sin finalizar , dependiendo de tipo de producto.
   */
  async registraTrazabilidadSinFinalizarGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_SIN_BANCO_GIROS_APV.CODIGO_OPERACION);  
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_SIN_BANCO_GIROS_CAV.CODIGO_OPERACION);  
    }
  }

   /**
    * Metodo que registra la trazabilidad de giros. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    * @param datos 
    * @param exito 
    * @modulo APV o CAV
    */
  async registrarTrazabilidad(codigoOperacion:number) {
    let parametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza : CONSTANTES_TRAZAS_GIRO,
      uuid : this.uuid,
      rut: this.parametrosGiro.rut,
      dv: this.parametrosGiro.dv,
    }

    switch (codigoOperacion) {
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_GIROS_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_GIROS_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_GIROS_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_GIROS_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_BANCO_GIROS_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_BANCO_GIROS_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_BANCO_GIROS_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_BANCO_GIROS_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_FIN_BANCO_GIROS_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_FIN_BANCO_GIROS_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_FIN_BANCO_GIROS_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_FIN_BANCO_GIROS_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_SIN_BANCO_GIROS_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_SIN_BANCO_GIROS_APV);
        break;
        case CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_SIN_BANCO_GIROS_CAV.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP2.INICIO_SIN_BANCO_GIROS_CAV);
        break;
    }

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.parametrosGiro.rut, this.parametrosGiro.dv).subscribe();
  }

  /**
   * Utilitario para validar si se encuentra regimen covid y solo se gira este regimen
   * @returns true : exite regimen covid / false: no existe.
   */
  validarRegimenCOVID(): void {
    let validadorCOVID = this.listadoRegimenesAGirar.find((regimen: RegimenGiro) => regimen.idTipoRegimenTributario.toString() === CONSTANTES_GIRO.ID_REGIMEN_COVID);
    if(validadorCOVID !== undefined && this.listadoRegimenesAGirar.length === 1){
      this.validacionGiroCOVID = true;
    }
  }

  /**
   * Si el usuario selecciona tipo vale vista covid , se debe reiniciar las selecciones de los combos tipo cuenta , banco , número cuenta.
   * @param e 
   */
  seleccionTipoValeVistaCOVID(): void {
    if(this.validacionValeVistaCOVID){
      this.validadorComboTipoCuenta = false;
      this.validadorInputCuenta = false;
      this.numeroCuenta = undefined!;
      this.idTipoCuentaSeleccionada = undefined;
      this.idBancoSeleccionado = undefined;
    }
  }

  /**
   * Metodo encargado de agrandar el modal cuando se habre el teclado.
   */
  resizePantalla(margen: string): void {
    if (this.botoneraCuenta) {
      this.renderer.setStyle(this.botoneraCuenta.nativeElement, 'margin-bottom', margen);
    }
  }
}
