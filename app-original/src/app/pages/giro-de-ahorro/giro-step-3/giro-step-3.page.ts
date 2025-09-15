import { Component, ViewChild } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { RegimenGiro } from '../util/regimen.giro';
import { CONSTANTES_GIRO_STEP_1, CONSTANTES_GIRO_STEP_3, CONSTANTES_GIRO, CONSTANTES_TRAZAS_GIRO } from '../util/constantes.giro';
import { ParametrosGiro } from '../util/parametros.giro';
import { NavController, AlertController } from '@ionic/angular';
import { UtilService, GiroService, TrazabilidadService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { ParametrosCorreoGiro } from '../util/parametros.correo';
import { SolicitudGiro } from '../util/solicitud.giro';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';

@Component({
  selector: 'page-giro-step-3',
  templateUrl: 'giro-step-3.page.html',
  styleUrls: [ './giro-step-3.page.scss'],
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

export class GiroStepTresPage {

  readonly CONSTANTES = CONSTANTES_GIRO_STEP_3;
  readonly CONSTANTES_STEP_1 = CONSTANTES_GIRO_STEP_1;
  sMinutos: string = '00';
  sSegundos: string = '00';
  segundos: number = 59;
  contador: any;

  nroIntentosFallidos: number = 0;
  intentosFallidos: boolean = false;
  mostrarPopUpMaxIntentosFallidos: boolean = false;

  maxNroSolicitudesClave: number = 5;
  solicitudesClave: boolean = false;
  validadorEnvioCorreo: boolean = false;

  @ViewChild('codigo0') codigo0: any;
  @ViewChild('codigo1') codigo1: any;
  @ViewChild('codigo2') codigo2: any;
  @ViewChild('codigo3') codigo3: any;
  @ViewChild('codigo4') codigo4: any;
  @ViewChild('codigo5') codigo5: any;

  // Arreglo de codigo sms
  codigo: any;
  // Validador tiempo completo , para volver a solicitar sms.
  validadorTiempoCompleto: boolean = false;
  // Validador modal Numero incorrecto
  modalInfo: boolean = false;
  // Validador modal informativo de max intentos solicitud giro
  modalIntentosSolicitudClave: boolean = false;
  // Referencia a componente loading.
  indicadorLoading: any;
  // Parametros giro.
  parametrosGiro: ParametrosGiro;
  // Validador que muestra pantalla de solicitud generada
  solicitudGenerada: boolean = false;
  // bytes de datos pdf solicitud.
  pdfBytesArraySolicitud: string;
  //numeroFolioSolicitud solicitudes procesadas
  listadoNumeroFoliosSolicitud: string = "";
  // validador que determina si es un listado de solicitudes o solo una
  validadorListaSolicitudes: boolean = false;
  // Numero celular usuario.
  numeroCelular: number;
  // Numero celular formateado usuario.
  numeroCelularFormateado: string;

  // Variables utilizadas para envio de correo giro.
  tipoOperacionCorreo = "";
  tituloCorreo = "";
  textoLibreCorreo = "";
  nombreArchivoCorreo = "";

  envioSolicitudGiro: boolean = false; //Validacion para asegurar que solo se enviará una solicitud de giros

  /**
   * UUID de la transacción
   */
  uuid: string;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private giroService: GiroService,
    private utilService: UtilService,
    private contextoAPP: ContextoAPP,
    private route: ActivatedRoute,
    private trazabilidadProvider: TrazabilidadService
  ) {
    this.codigo = new Array();
    this.sSegundos = '' + this.segundos;

    this.route.queryParams.subscribe(params => {
      let jsonObject = JSON.parse(params.option) as Object;
      this.parametrosGiro = jsonObject as ParametrosGiro;
      this.validarRegimenCOVID()
    });
  }

  async ngOnInit() {
    this.uuid = await this.utilService.getStorageUuid();
    
    this.generarNumeroCelular();
    this.utilService.setLogEvent('event_habitat', { option: 'Giro Ahorro Step 3A / Paso 3 INICIO CODIGO' });
    await this.registraTrazabilidadInicioGiro();
    this.solicitarSMS();
  }

  /**
   * Función encargada de llamar a servicio que solicita sms.
   */
  async solicitarSMS(){
    const loading = await this.contextoAPP.mostrarLoading();

    this.giroService.solicitudCodigoDinamicoSMS(
      this.parametrosGiro.rut,
      this.parametrosGiro.dv,
      this.parametrosGiro.nombreUsuario,
      this.parametrosGiro.apellidoUsuario,
      this.numeroCelular,
      this.parametrosGiro.tipoProductoSeleccionado).subscribe((response: any) => {
        let codigoValidacionOK = response["respuestaEnvioSMS"] !== undefined ? response["respuestaEnvioSMS"].estadoEnvio : null;
        let validadorSMS = response["respuestaEnvioSMS"] !== undefined ? response["respuestaEnvioSMS"].validador : "";
        let codigoError = response["Context-Error"] !== undefined ? response["Context-Error"].cod : null;
        this.contextoAPP.ocultarLoading(loading);

        if(codigoValidacionOK != null && codigoValidacionOK === this.CONSTANTES.CODIGO_VERDADERO_SMS) {
          this.mostrarToastNumeroSolicitudes(validadorSMS);
          this.iniciarContadorTiempo();
        } else if(codigoError != null && codigoError === this.CONSTANTES.CODIGO_ERROR_MAX_SMS){
          this.modalIntentosSolicitudClave = true;
        } else {
          this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
        }
    },(error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
    });
  }

  /**
   * Genera número celular , agregando prefijo y casteando a number
   */
  generarNumeroCelular(){
    let numeroConPrefijo = this.CONSTANTES.PREFIJO_NUMERO + this.parametrosGiro.telefonoCelular;
    this.numeroCelular = +numeroConPrefijo;
    let terceroDosNumeros = this.parametrosGiro.telefonoCelular.slice(6);
    this.numeroCelularFormateado = this.CONSTANTES.PREFIJO_NUMERO + " " + this.CONSTANTES.MASCARA_NUMERO + " " + terceroDosNumeros;
  }

  /**
   * Encargado de Validar codigo SMS , con código ingresado por el usuario.
   */
  async validarCodigoSMS() {
    this.utilService.setLogEvent('event_habitat', {option: 'Fin_Banco_Giro_Ahorro_Step3D'});
    let claveIngresada = +this.obtenerClaveIngresada();
    const loading = await this.contextoAPP.mostrarLoading();

    if (this.envioSolicitudGiro) {
      this.contextoAPP.ocultarLoading(loading);
      return;
    }

    //Solo entra a llamada de servicios si es la primera petición
    this.envioSolicitudGiro = true;
    // Validación necesaria , servicio espera cuenta 2 , con el espacio como tipo producto. Si es APV , se mantiene.
    let tipoProductoSMS = this.parametrosGiro.tipoProductoSeleccionado;
    if (this.parametrosGiro.tipoProductoSeleccionado == this.CONSTANTES_STEP_1.NOMBRE_PRODUCTO_CUENTA_2) {
      tipoProductoSMS = this.CONSTANTES.TIPO_PRODUCTO_SMS_CUENTA_2;
    }

    this.giroService.validarCodigoDinamicoSMS(
        this.parametrosGiro.rut,
        this.parametrosGiro.dv,
        tipoProductoSMS,
        claveIngresada
    ).subscribe(async (response: any) => {
      let codigoValidacionOK = response["consultaCodigoResponse"] !== undefined ? response["consultaCodigoResponse"].valido : null;
      let codigoError = response["Context-Error"] !== undefined ? response["Context-Error"].cod : null;
      this.contextoAPP.ocultarLoading(loading);

      if (codigoValidacionOK != null && codigoValidacionOK === this.CONSTANTES.CODIGO_VERDADERO_SMS) {
        await this.registraTrazabilidadFinCodigoGiro();
        this.realizarSolicitudGiro();
      } else if (codigoError != null && codigoError === this.CONSTANTES.CODIGO_ERROR_ERROR_CODIGO) {
        await this.registraTrazabilidadErrorCodigoGiro();
        this.envioSolicitudGiro = false;
        this.mostrarErrorEnCodigoSMS();
      } else if (codigoError != null && codigoError === this.CONSTANTES.CODIGO_ERROR_MAX_INTENTOS) {
        await this.registraTrazabilidadErrorCodigoGiro();
        this.mostrarPopUpMaxIntentosFallidos = true;
      } else {
        await this.registraTrazabilidadErrorCodigoGiro();
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
      }
    }, async (error) => {
      await this.registraTrazabilidadErrorCodigoGiro();
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
    });
  }

  /**
   * Encargado de realizar solicitud de giro.
   * Si la solicitud se procesa correctamente , se procede a setear variable pdfBytesArraySolicitud , y a servicio envio de correo.
   */
  async realizarSolicitudGiro() {

    const loading = await this.contextoAPP.mostrarLoading();

    let solicitud: SolicitudGiro = this.generarObjetoSolicitudGiro();
    let tokenIngresado: string = this.obtenerClaveIngresada();
    solicitud.token = tokenIngresado;
    
    this.giroService.realizarSolicitud(solicitud).subscribe(async (response: any) => {
      if (response != undefined && response.SolicitudRetiroResponse[0] != undefined &&
          response.SolicitudRetiroResponse[0].EstadoSolicitud == this.CONSTANTES.CODIGO_VERDADERO_SMS) {
        this.utilService.setLogEvent('event_habitat', {option: 'Giro Ahorro Step 3F / Paso 3 EXITO'});
        await this.registraTrazabilidadExitoGiro();
        this.validarNumerosFolioSolicitud(response);
        this.pdfBytesArraySolicitud = response.SolicitudRetiroResponse[0].BinPdf;
        let fechaValorCuota = response.SolicitudRetiroResponse[0].fechaValorCuota;
        this.solicitudGenerada = true;
        
      this.enviarCorreoSolicitud(fechaValorCuota);
        
      } else {
        await this.registraTrazabilidadErrorGiro();
        this.errorEnRealizarSolicitudGiro(response);
      }
      this.contextoAPP.ocultarLoading(loading);
    }, async (error) => {
      await this.registraTrazabilidadErrorGiro();
      this.contextoAPP.ocultarLoading(loading);
      this.errorEnRealizarSolicitudGiro(error);
    });
  }

  /**
   * Encargado de mostrar pantalla de error , al intentar realizar solicitud de giro.
   * @param error
   */
  async errorEnRealizarSolicitudGiro(error){
    const loading = await this.contextoAPP.mostrarLoading();
    this.utilService.setLogEvent('event_habitat', { option:'Error_Banco_Giro_Ahorro_Step3F' });
    this.contextoAPP.ocultarLoading(loading);
    this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.giroAhorro));
  }

  /**
   * Encargado de generar listado de números de solicitud , visibles en pantalla.
   * Tambien setea flag , de cuando es un elemento o varios.
   * @param responseSolicitud
   */
  validarNumerosFolioSolicitud(responseSolicitud){
    const respuesta = responseSolicitud.SolicitudRetiroResponse?.[0];
    const esAPV = this.parametrosGiro.idTipoProducto === this.CONSTANTES_STEP_1.ID_PRODUCTO_APV; // Validacion para APV
  
    if (!respuesta) return;
  
    const solicitudUnica = respuesta.NroFolio; // Respuesta para una solicitud
    const listadoSolicitudes = respuesta.NroFolios; // Respuesta varias solicitudes
  
    if (esAPV && solicitudUnica !== undefined) {
      this.listadoNumeroFoliosSolicitud = solicitudUnica;
    }
  
    if (Array.isArray(listadoSolicitudes)) {
      const soloUnFolio = listadoSolicitudes.length === 1;
      const tieneMultiplesFolios = listadoSolicitudes.length > 1;
  
      if (!esAPV && soloUnFolio) {
        this.listadoNumeroFoliosSolicitud = listadoSolicitudes[0].nroFolio;
        return;
      }
  
      if ((esAPV && listadoSolicitudes) || (!esAPV && tieneMultiplesFolios)) {
        this.listadoNumeroFoliosSolicitud = listadoSolicitudes
          .map((f: any) => f.nroFolio)
          .join(', ');
        this.validadorListaSolicitudes = true;
      }
    }
  }

  /**
   * Función encargada de generar objeto solicitud giro , con información necesaria para el servicio.
   * La estructura que se debe generar no es un json normal , ya que debe incluir los nombres de los objetos
   * regimen & tipofondo. Estos objetos , son utilizados dentro de la logica del servicio , para procesar las
   * solicitudes.
   * @returns SolicitudGiro
   */
  generarObjetoSolicitudGiro(): SolicitudGiro {
    const solicitudGiro = new SolicitudGiro();
    solicitudGiro.rut = this.parametrosGiro.rut.toString();
    solicitudGiro.dv = this.parametrosGiro.dv;
    solicitudGiro.IdEntidadBanco = this.parametrosGiro.idBancoSeleccionado;
    solicitudGiro.IdTipoCuenta = this.parametrosGiro.idTipoCuentaBancoSeleccionada.toString();
    solicitudGiro.NroCtaCte = this.parametrosGiro.numeroCuenta;
    solicitudGiro.IdTipoProducto = this.parametrosGiro.idTipoProducto.toString();

    const regimenesFormateados = this.parametrosGiro.listadoRegimenesAGirar.map((regimen) => {
      let objetoRegimen = this.CONSTANTES.OBJETO_REGIMEN_SOLICITUD;
      objetoRegimen = objetoRegimen.replace("ID_REGIMEN", regimen.idTipoRegimenTributario.toString());
  
      const fondosFormateados = regimen.listadoFondos.map((fondo) => {
        const comisionCuotas = (fondo.comision / fondo.valorCuotaActual).toString();
        let objetoTipoFondo = this.CONSTANTES.OBJETO_TIPO_FONDO_SOLICITUD;
  
        objetoTipoFondo = objetoTipoFondo
          .replace("ID_TIPO_FONDO", fondo.idFondo.toString())
          .replace("ID_MAE_CUENTA", fondo.idCuentaMae.toString())
          .replace("COMISION_PESOS", fondo.comision.toString())
          .replace("COMISION_CUOTAS", comisionCuotas)
          .replace("MONTO_PESOS", fondo.montoBruto.toString())
          .replace("MONTO_CUOTAS", fondo.totalCuotasGirar.toString())
          .replace("ES_EN_CUOTAS", fondo.esGiroEnCuotas + "")
          .replace("VALOR_CUOTA", fondo.valorCuotaActual.toString())
          .replace("IMPUESTO_PESOS", fondo.impuestos.toString()); // Impuestos solo aplica para cuenta apv regimen B
  
        return objetoTipoFondo;
      });
  
      objetoRegimen = objetoRegimen.replace("TIPOS_FONDO", fondosFormateados.join(','));
      return objetoRegimen;
    });
  
    solicitudGiro.regimenesProducto = `[{${regimenesFormateados.join(',')}}]`;
    return solicitudGiro;
  }

  /**
   * Evento boton Solicitar nueva clave SMS.
   */
  solicitarNuevaClave() {
    this.focusElement(this.CONSTANTES.INDEX_INICIAL_INPUT_VALIDAR);
    this.segundos = 59;
    this.sSegundos = '' + this.segundos;
    this.nroIntentosFallidos = 0;
    this.intentosFallidos = false;
    this.solicitarSMS();
  }

  /**
   * Encargada de eliminar focus de todos los inputs de codigo sms
   */
  eliminarFocoInputs(){
    this.codigo1.setBlur();
    this.codigo2.setBlur();
    this.codigo3.setBlur();
    this.codigo4.setBlur();
    this.codigo5.setBlur();
    this.codigo0.setBlur();
  }

  /**
   * Evento onKey input codigo SMS
   * @param event
   * @param position
   */
  onKey(event: any, position: number) {
    this.codigo[position] = event.target.value;

   //Esto es para volver a input anterior
    if (event.keyCode === 8) {
      position -= 2;
    }

    //Valida que el dato ingresado sea númerico
    let numberInteger = this.codigo[position] * 1;
    if (numberInteger !== parseInt(this.codigo[position], 10)) {
      this.codigo[position] = "";
      position -= 1;
    }

    this.validarBotonRealizarSolicitud();
    if(this.mostrarPopUpMaxIntentosFallidos){
      this.eliminarFocoInputs();
    } else if(position != this.CONSTANTES.INDEX_INPUT_VALIDAR) { //Se realiza salto automatico , solo en el caso que no se este mostrando popup de error.
      this.focusElement(position);
    }
  }

  /**
   * Setea focus a un input en especial.
   * @param position
   */
  focusElement(position: any) {
    let element: any;
    switch (position) {
      case 0:
        element = this.codigo1;
        break;
      case 1:
        element = this.codigo2;
        break;
      case 2:
        element = this.codigo3;
        break;
      case 3:
        element = this.codigo4;
        break;
      case 4:
        element = this.codigo5;
        break;
      case 5:
        break;
      default:
        element = this.codigo0;
        break;
    }
    if (element) {
      element.setFocus();
    }
  }

  /**
   * Evento asociado a tecla enter último input sms.
   * Primero se valida si el código sms es valido.
   * Luego se procede a llamar al servicio Validar Codigo SMS.
   */
  eventoRealizarSolicitudTeclado(){
    if(!this.validarBotonRealizarSolicitud()){
      this.validarCodigoSMS()
    }
  }

  /**
   * Setea estado boton realizar solicitud de giro.
   * @returns true : boton desactivado
   */
  validarBotonRealizarSolicitud() {
    let claveIngresada = this.obtenerClaveIngresada();
    if (claveIngresada.length == this.CONSTANTES.CANTIDAD_CODIGOS_CORRECTA) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Encargado de obtener clave ingresada por el usuario.
   */
  obtenerClaveIngresada(){
    let claveIngresada:string = '';
    for (let codigo of this.codigo) {
      if (codigo && codigo != undefined && codigo != '') {
        claveIngresada += codigo;
      }      
    }
    return claveIngresada;
  }

  /**
   * Encargado de limpiar inputs clave
   */
  limpiarInputsClave(){
    for (let i=0; i < this.codigo.length; i++) {
      this.codigo[i] = '';
    }
  }

  /**
   * Muestra mensaje de error cuando se ingresa un codigo sms incorrecto.
   */
  mostrarErrorEnCodigoSMS(){
    this.limpiarInputsClave();
    this.nroIntentosFallidos ++;
    if(this.nroIntentosFallidos > 0){
      this.intentosFallidos = true;
    }

    if(this.nroIntentosFallidos === 3){
      this.mostrarPopUpMaxIntentosFallidos = true;
    }
    this.focusElement(0);
  }

  /**
   * Evento boton cancelar. Muestra confirmación volver.
   */
  mostrarConfirmacionVolver() {
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
          this.utilService.setLogEvent('event_habitat', { option:'Giro Ahorro Step 3A / Paso 3 SIN FINALIZAR CODIGO (Volver)' });
          await this.registraTrazabilidadFinalizarGiro();
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
   * Evento boton Volver a Intentar , modal MaxIntentosFallidos
   */
  volverAIntentarSMS() {
    this.nroIntentosFallidos = 0;
    this.intentosFallidos = false;
    this.mostrarPopUpMaxIntentosFallidos = false;
    this.solicitarNuevaClave();
  }

  /**
   * Regresa al usuario al home de la app.
   */
  volverAlHome() {
    this.navCtrl.navigateRoot('HomeClientePage');
  }

  /**
   * Inicia contador de segundos , para uso de codigo sms enviado.
   */
  iniciarContadorTiempo() {
    this.limpiarTiempo();
    this.contador = setInterval(() => {
      this.segundos -= 1;
      if (this.segundos < 10) {
        this.sSegundos = '0' + this.segundos;
      } else {
        this.sSegundos = '' + this.segundos;
      }

      if (this.segundos === 0) {
        this.validadorTiempoCompleto = true;
      }
    }, 1000)
  }

  /**
   * Limpia tiempo contador segundos sms codigo
   */
  limpiarTiempo() {
    this.validadorTiempoCompleto = false;
    clearInterval(this.contador);
  }

  /**
   * Encargado de mostrar toast de cantidad intentos SMS.
   * @param validadorSMS , contador desde servicio , con intentos de sms.
  */
  mostrarToastNumeroSolicitudes(validadorSMS:string){
    this.utilService.mostrarToast(this.CONSTANTES.TOAST_VALIDACION_NUMERO_SMS.
      replace(this.CONSTANTES.TOAST_VALIDACION_NUMERO_SMS_PARAM,validadorSMS));
  }

  /**
  * Encargado retornar estado de contador de tiempo.
  * @returns true: mostrar contador de segundos, false: mostrar boton solicitar nueva clave.
   */
  mostrarContadorTiempoSMS() {
    if (this.nroIntentosFallidos <= this.CONSTANTES.MAX_INTENTOS_FALLIDOS) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Encargada de realizar acción de llamar a contact center.
  */
  llamarContactCenter() {
      window.open('tel:' + this.CONSTANTES_STEP_1.TELEFONO_CONTACT, '_system');
  }

  /**
   * Función utilitaria , que reemplaza valores de texto , para retornar valor numerico.
   * @param numeroString
   */
  obtenerNumeroMonto(numeroString:string): string {
    let numeroFormateado = (numeroString.replace("$",""));
    return numeroFormateado.split('.').join("");
  }

  /**
   * Función encargada de descargar PDF solicitud.
   */
  async descargarPdf() {
    this.utilService.setLogEvent('event_habitat', { option:'Descargar_Banco_Giro_Ahorro_Step3F' });
    await this.registraTrazabilidadDescargarPDFGiro();
    this.utilService.generarPdf(this.pdfBytesArraySolicitud);
  }

  /**
   * Encargada de enviar correo de solicitud al cliente , luedo del procesamiento del giro.
   * Si el usuario no cuenta con correo , retornamos.
   */
  async enviarCorreoSolicitud(fechaValorCuota: string){
    if(this.parametrosGiro.email === undefined || this.parametrosGiro.email == null){
      return;
    }
    const loading = await this.contextoAPP.mostrarLoading();
    fechaValorCuota = fechaValorCuota.replace(/-/g, '/'); // cambiamos el formato para el correo.
    let fechaRetiroDate = new Date();
    let diaRetiro = this.obtenerMesHoraConCero(fechaRetiroDate.getDate());
    let mesRetiro = fechaRetiroDate.getMonth() + 1; //Enero es 0!
    let mesRetiroString = this.obtenerMesHoraConCero(mesRetiro.toString());
    let anioRetiro = fechaRetiroDate.getFullYear();
    let horas = this.obtenerMesHoraConCero(fechaRetiroDate.getHours());
    let minutos = this.obtenerMesHoraConCero(fechaRetiroDate.getMinutes());
    let segundos = this.obtenerMesHoraConCero(fechaRetiroDate.getSeconds());
    let horaSolicitud = horas + this.CONSTANTES.SEPARADOR_HORA + minutos + this.CONSTANTES.SEPARADOR_HORA + segundos;

    let fechaSolicitud:string = diaRetiro + this.CONSTANTES.SEPARADOR_FECHA_SLASH + mesRetiroString + this.CONSTANTES.SEPARADOR_FECHA_SLASH + anioRetiro;
    let fechaHora:string = anioRetiro + this.CONSTANTES.SEPARADOR_FECHA_GUION + mesRetiroString + this.CONSTANTES.SEPARADOR_FECHA_GUION + diaRetiro;
    fechaHora = fechaHora + this.CONSTANTES.SEPARADOR_FECHA_HORA + horaSolicitud;
    let nombreCompleto = this.parametrosGiro.nombreUsuario + " " + this.parametrosGiro.apellidoUsuario;
    nombreCompleto = this.sacarTildesNombre(nombreCompleto);
    this.setearParametrosCorreoGiro(fechaSolicitud,fechaValorCuota);

    let parametrosCorreo: ParametrosCorreoGiro = new ParametrosCorreoGiro(
      this.parametrosGiro.rut.toString(),
      this.parametrosGiro.dv,
      this.pdfBytesArraySolicitud,
      this.nombreArchivoCorreo,
      fechaHora,
      nombreCompleto,
      this.listadoNumeroFoliosSolicitud,
      this.textoLibreCorreo,
      this.tipoOperacionCorreo,
      this.tituloCorreo,
      this.parametrosGiro.email
    );

    this.giroService.enviarCorreoSolicitud(parametrosCorreo).subscribe((response: any) => {
      this.validadorEnvioCorreo = true;
      this.contextoAPP.ocultarLoading(loading);
    },(error) => {
      this.validadorEnvioCorreo = false;
      this.contextoAPP.ocultarLoading(loading);
      this.utilService.mostrarToastConLlamada(this.CONSTANTES.TOAST_ERROR_ENVIO_CORREO,this.CONSTANTES_STEP_1.NUMERO_CALL_CENTER_GIROS);
    });
  }

  /**
   * Función encargada de setear parametros utilizados en correo giro.
   * Dependiendo del tipo de giro apv o cuenta 2 .
   */
  setearParametrosCorreoGiro(fechaSolicitud: any ,fechaValorCuota: any){
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      this.tipoOperacionCorreo = this.CONSTANTES.TIPO_OPERACION_CORREO_APV;
      this.tituloCorreo = this.CONSTANTES.TITULO_CORREO_APV;
      this.textoLibreCorreo = this.CONSTANTES.TEXTO_LIBRE_CORREO_APV.replace(this.CONSTANTES.FECHA_TEXTO_LIBRE_CORREO,fechaSolicitud);
      this.nombreArchivoCorreo = this.CONSTANTES.NOMBRE_ARCHIVO_CORREO_APV;
    } else {
      this.tipoOperacionCorreo = this.CONSTANTES.TIPO_OPERACION_CORREO_CUENTA_2;
      this.tituloCorreo = this.CONSTANTES.TITULO_CORREO_CUENTA_2;
      this.textoLibreCorreo = this.CONSTANTES.TEXTO_LIBRE_CORREO_CUENTA_2.replace(this.CONSTANTES.FECHA_TEXTO_LIBRE_CORREO,fechaSolicitud);
      this.nombreArchivoCorreo = this.CONSTANTES.NOMBRE_ARCHIVO_CORREO_CUENTA_2;
    }

    this.textoLibreCorreo = this.textoLibreCorreo.replace(this.CONSTANTES.FECHA_CUOTA_TEXTO_LIBRE_CORREO,fechaValorCuota);
  }

  /**
   * Encargado de reemplazar tildes a código html
   * @param nombre
   */
  sacarTildesNombre(nombre:string){
    nombre = nombre.replace(/á/g, '&aacute;');
    nombre = nombre.replace(/é/g, '&eacute;');
    nombre = nombre.replace(/í/g, '&iacute;');
    nombre = nombre.replace(/ó/g, '&oacute;');
    nombre = nombre.replace(/ú/g, '&uacute;');

    nombre = nombre.replace(/Á/g, '&Aacute;');
    nombre = nombre.replace(/É/g, '&Eacute;');
    nombre = nombre.replace(/Í/g, '&Iacute;');
    nombre = nombre.replace(/Ó/g, '&Oacute;');
    nombre = nombre.replace(/Ú/g, '&Uacute;');

    return nombre;
  }

  /**
   * El servicio se alimienta de hora con formato 2019-06-25 01:12:11 , se debe agregar un cero a la iz , cuando aplique.
   * @param valor
   */
  obtenerMesHoraConCero(valor){
    return String("00" + valor).slice(-2);
  }

  /**
   * Encargado de registrar traza descargar pdf , dependiendo de tipo de producto.
   */
  async registraTrazabilidadDescargarPDFGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.DESCARGA_PDF_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.DESCARGA_PDF_GIRO_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar traza error step 3 , dependiendo de tipo de producto.
   */
  async registraTrazabilidadErrorGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_GIRO_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar traza step 3 exito , dependiendo de tipo de producto.
   */
  async registraTrazabilidadExitoGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.EXITO_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.EXITO_GIRO_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar traza error codigo , dependiendo de tipo de producto.
   */
  async registraTrazabilidadErrorCodigoGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_CODIGO_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_CODIGO_GIRO_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar traza fin codigo , dependiendo de tipo de producto.
   */
  async registraTrazabilidadFinCodigoGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.FIN_CODIGO_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.FIN_CODIGO_GIRO_CAV.CODIGO_OPERACION);
    }
  }

   /**
   * Encargado de registrar traza fin step 3 ( codigo ) , dependiendo de tipo de producto.
   */
  async registraTrazabilidadFinalizarGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.FINALIZAR_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.FINALIZAR_GIRO_CAV.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de registrar traza inicio step 3 ( codigo ) , dependiendo de tipo de producto.
   */
  async registraTrazabilidadInicioGiro() {
    if(this.parametrosGiro.idTipoProducto == this.CONSTANTES_STEP_1.ID_PRODUCTO_APV){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.INICIO_GIRO_APV.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_GIRO.STEP3.INICIO_GIRO_CAV.CODIGO_OPERACION);
    }
  }

    /**
    * Metodo que registra la trazabilidad de giros. Registrando data en los servicios de habitat
    * @param codigoOperacion
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
      case CONSTANTES_TRAZAS_GIRO.STEP3.DESCARGA_PDF_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.DESCARGA_PDF_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.DESCARGA_PDF_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.DESCARGA_PDF_GIRO_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_GIRO_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.EXITO_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.EXITO_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.EXITO_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.EXITO_GIRO_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_CODIGO_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_CODIGO_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_CODIGO_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.ERROR_CODIGO_GIRO_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.FIN_CODIGO_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.FIN_CODIGO_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.FIN_CODIGO_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.FIN_CODIGO_GIRO_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.FINALIZAR_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.FINALIZAR_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.FINALIZAR_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.FINALIZAR_GIRO_CAV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.INICIO_GIRO_APV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.INICIO_GIRO_APV);
        break;
      case CONSTANTES_TRAZAS_GIRO.STEP3.INICIO_GIRO_CAV.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_GIRO.STEP3.INICIO_GIRO_CAV);
        break;
    }

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.parametrosGiro.rut, this.parametrosGiro.dv).subscribe();
  }

  /**
   * Utilitario para validar si se encuentra regimen covid en el giro.
   * @returns true : exite regimen covid / false: no existe.
  */
  validarRegimenCOVID(): boolean {
    let validadorCOVID = this.parametrosGiro.listadoRegimenesAGirar.find((regimen: RegimenGiro) => regimen.idTipoRegimenTributario.toString() === CONSTANTES_GIRO.ID_REGIMEN_COVID);
    if(validadorCOVID !== undefined){
      return true;
    }
    return false;
  }
}