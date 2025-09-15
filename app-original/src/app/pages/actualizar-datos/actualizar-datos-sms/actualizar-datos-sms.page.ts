import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTES_ACTUALIZAR_DATOS, CONSTANTES_TRAZAS_DATOS } from '../util/datos.constantes';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { ActualizarDatosService } from 'src/app/services/api/restful/actualizar-datos.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services'; 
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { ResizeClass } from '../../../../../src/app/util/resize.class';
import { Location } from '@angular/common';

@Component({
  selector: 'app-actualizar-datos-sms',
  templateUrl: './actualizar-datos-sms.page.html',
  styleUrls: ['./actualizar-datos-sms.page.scss'],
})
export class ActualizarDatosSmsPage extends ResizeClass implements OnInit {
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

  @ViewChild('codigo0') codigo0;
  @ViewChild('codigo1') codigo1;
  @ViewChild('codigo2') codigo2;
  @ViewChild('codigo3') codigo3;
  @ViewChild('codigo4') codigo4;
  @ViewChild('codigo5') codigo5;

  // Arreglo de codigo sms
  codigo: any;
  // Validador tiempo completo , para volver a solicitar sms.
  validadorTiempoCompleto: boolean = false;
  // Validador modal informativo de max intentos solicitud giro
  modalIntentosSolicitudClave: boolean = false;
  // Referencia a componente loading.
  indicadorLoading: any;
  // Validador que muestra pantalla de solicitud generada
  solicitudGenerada: boolean = false;
  // Numero celular usuario.
  numeroCelular: number;
  // Numero celular formateado usuario.
  numeroCelularFormateado: string;
  // Referencia datos a guardar 
  objetoActualizarDatos: any;
  // Referencia a constantes modulo 
  readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;
  // referencia celular usuario
  telefonoCelular: string;
  // referenvia datos usuario
  datosUsuario: DatosUsuario;
  // Validador modal Numero incorrecto
  modalInfo: boolean = false;
  // Se asigna el uuid desde la pantalla anterior (actualizar datos)
  uuid: string;


  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    public readonly contextoAPP: ContextoAPP,
    private route: ActivatedRoute,
    private actualizarDatosService: ActualizarDatosService,
    private readonly location: Location
  ) {
    super(contextoAPP);
    this.codigo = new Array();
    this.sSegundos = '' + this.segundos;
    this.telefonoCelular = this.contextoAPP.datosCliente.telefonoCelular;
    this.datosUsuario = this.contextoAPP.datosCliente;
    this.route.queryParams.subscribe(params => {
      this.objetoActualizarDatos = params.option;
    });
  }

  async ngOnInit() {
    this.generarNumeroCelular();
    this.solicitarSMS();
    this.uuid = await this.utilService.getStorageUuid();
  }


  /**
  * Función encargada de llamar a servicio que solicita sms.
  */
  async solicitarSMS() {
    const loading = await this.contextoAPP.mostrarLoading();

    this.actualizarDatosService.solicitudCodigoDinamicoSMS(
      this.datosUsuario.rut,
      this.datosUsuario.dv,
      this.datosUsuario.nombre,
      this.datosUsuario.apellidoPaterno,
      this.numeroCelular
      ).subscribe(async (response: any) => {
        let codigoValidacionOK = response["respuestaEnvioSMS"] !== undefined ? response["respuestaEnvioSMS"].estadoEnvio : null;
        let validadorSMS = response["respuestaEnvioSMS"] !== undefined ? response["respuestaEnvioSMS"].validador : "";
        let codigoError = response["Context-Error"] !== undefined ? response["Context-Error"].cod : null;
       this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_SOLICITUD_SMS_EXITO.CODIGO_OPERACION);

      this.contextoAPP.ocultarLoading(loading);
        if (codigoValidacionOK != null && codigoValidacionOK === this.CONSTANTES.CODIGO_VERDADERO_SMS) {
          this.mostrarToastNumeroSolicitudes(validadorSMS);
          this.iniciarContadorTiempo();
        } else if (codigoError != null && codigoError === this.CONSTANTES.CODIGO_ERROR_MAX_SMS) {
          this.modalIntentosSolicitudClave = true;
        } else {
          this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
        }
      }, async (error) => {
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_SOLICITUD_SMS_ERROR.CODIGO_OPERACION);

        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
      });
  }

  /**
  * Genera número celular , agregando prefijo y casteando a number
  */
  generarNumeroCelular() {
    let numeroConPrefijo = this.CONSTANTES.PREFIJO_NUMERO + this.telefonoCelular;
    this.numeroCelular = +numeroConPrefijo;
    let terceroDosNumeros = this.telefonoCelular.slice(6);
    this.numeroCelularFormateado = this.CONSTANTES.PREFIJO_NUMERO + " " + this.CONSTANTES.MASCARA_NUMERO + " " + terceroDosNumeros;
  }

  /**
  * Encargado de Validar codigo SMS , con código ingresado por el usuario.
  */
  async validarCodigoSMS() {
    let claveIngresada = +this.obtenerClaveIngresada();
    const loading = await this.contextoAPP.mostrarLoading();

    this.actualizarDatosService.validarCodigoDinamicoSMS(
      +this.datosUsuario.rut,
      this.datosUsuario.dv,
      claveIngresada
    ).subscribe(async (response: any) => {
      let codigoValidacionOK = response["consultaCodigoResponse"] !== undefined ? response["consultaCodigoResponse"].valido : null;
      let codigoError = response["Context-Error"] !== undefined ? response["Context-Error"].cod : null;
      this.contextoAPP.ocultarLoading(loading);

      if (codigoValidacionOK != null && codigoValidacionOK === this.CONSTANTES.CODIGO_VERDADERO_SMS) {
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_EXITO.CODIGO_OPERACION);

        this.realizarSolicitud(); 
      } else if (codigoError != null && codigoError === this.CONSTANTES.CODIGO_ERROR_ERROR_CODIGO) {
        this.mostrarErrorEnCodigoSMS();
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_ERROR.CODIGO_OPERACION);

      } else if (codigoError != null && codigoError === this.CONSTANTES.CODIGO_ERROR_MAX_INTENTOS) {
        this.mostrarPopUpMaxIntentosFallidos = true;
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_ERROR.CODIGO_OPERACION);

      } else {
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_ERROR.CODIGO_OPERACION);

        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
      }
    }, async (error) => {
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_ERROR.CODIGO_OPERACION);

      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
    });
  }

  async realizarSolicitud(){
    const loading = await this.contextoAPP.mostrarLoading();
    this.actualizarDatosService.enviarSolicitud(this.datosUsuario.rut, this.datosUsuario.dv, JSON.parse(this.objetoActualizarDatos)).subscribe(async (respuestaServicio: any) => {
      this.contextoAPP.ocultarLoading(loading);
      if(respuestaServicio.exito === "true"){
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_EXITO.CODIGO_OPERACION);

        this.navCtrl.navigateForward('actualizar-datos-exito');
      } else {
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_ERROR.CODIGO_OPERACION);

        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
      }
    }, async (error) => {
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_ERROR.CODIGO_OPERACION);

      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
    });
  }

  /**
 * Encargado de obtener clave ingresada por el usuario.
 */
  obtenerClaveIngresada() {
    let claveIngresada: string = '';
    for (const caracter of this.codigo) {
      if (caracter && caracter !== '') {
        claveIngresada += caracter;
      }
    }
    return claveIngresada;
  }

  /**
   * Encargado de mostrar toast de cantidad intentos SMS.
   * @param validadorSMS , contador desde servicio , con intentos de sms.
  */
  mostrarToastNumeroSolicitudes(validadorSMS: string) {
    this.utilService.mostrarToastIcono(this.CONSTANTES.TOAST_VALIDACION_NUMERO_SMS.
      replace(this.CONSTANTES.TOAST_VALIDACION_NUMERO_SMS_PARAM, validadorSMS));
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
   * Muestra mensaje de error cuando se ingresa un codigo sms incorrecto.
   */
  mostrarErrorEnCodigoSMS(){
    this.limpiarInputsClave();
    this.nroIntentosFallidos ++;
    if(this.nroIntentosFallidos > 0){
      this.intentosFallidos = true;
    }

    if(this.nroIntentosFallidos === this.CONSTANTES.MAX_INTENTOS_FALLIDOS){
      this.mostrarPopUpMaxIntentosFallidos = true;
    }
    this.focusElement(0);
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

    if(this.mostrarPopUpMaxIntentosFallidos){
      this.eliminarFocoInputs();
    } else if(position != this.CONSTANTES.INDEX_INPUT_VALIDAR) { //Se realiza salto automatico , solo en el caso que no se este mostrando popup de error.
      this.focusElement(position);
    }
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
          this.location.back();
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
    const _confirm = this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: botones
    }).then(confirmData => confirmData.present());
  }

  /**
  * Regresa al usuario al home de la app.
  */
  volverAlHome() {
    this.navCtrl.navigateRoot('HomeClientePage');
  }

  /**
  * Encargada de realizar acción de llamar a contact center.
  */
  llamarContactCenter() {
    window.open('tel:' + this.CONSTANTES.TELEFONO_CONTACT, '_system');
  }


  /**
    * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    */
   async registrarTrazabilidad(codigoOperacion: number) {
    let parametroTraza: ParametroTraza = new ParametroTraza();
      const datosGenerales = {
          traza : CONSTANTES_TRAZAS_DATOS,
          uuid : this.uuid,
          rut: this.datosUsuario.rut,
          dv: this.datosUsuario.dv,
      }

      switch (codigoOperacion) {
        case CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_SOLICITUD_SMS_EXITO.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_SOLICITUD_SMS_EXITO);
          break;
        case CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_SOLICITUD_SMS_ERROR.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_SOLICITUD_SMS_ERROR);
          break;
        case CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_EXITO.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_EXITO);
          break;
        case CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_ERROR.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_ENVIO_SMS_ERROR);
          break;
        case CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_EXITO.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_EXITO);
          break;
        case CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_ERROR.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.SMS.CODIDO_TRAZA_FINAL_ERROR);
          break;
      }
    this.actualizarDatosService.registraTrazaUUID(parametroTraza, this.datosUsuario.rut, this.datosUsuario.dv).subscribe();

  }

  /**
   * Redirige a pantalla sucursales
   */
  irSucursales(){
    this.modalIntentosSolicitudClave = false;
    this.navCtrl.navigateForward('SucursalesPage');
  } 
  
}