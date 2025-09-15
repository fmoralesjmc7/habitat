import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { AlertController, NavController } from '@ionic/angular';
import { ResizeTecladoClass } from '../../../../../src/app/util/resize-teclado.class';
import { DatosActualizarUsuario } from '../../../../../src/app/pages/actualizar-datos/util/datos.actualizar.usuario';
import { UtilService } from '../../../../../src/app/services';
import { ActualizarDatosService } from '../../../../../src/app/services/api/restful/actualizar-datos.service';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { CONSTANTES_ACTUALIZAR_DATOS, CONSTANTES_TRAZAS_DATOS } from '../../../pages/actualizar-datos/util/datos.constantes';
import { ValidadorActualizarDatos } from '../util/validador';
import { CommonActualizarDatosClass } from '../util/common-actualizar-datos.class';

@Component({
  selector: 'app-formulario-edicion-contacto',
  templateUrl: './formulario-edicion-contacto.component.html',
  styleUrls: ['./formulario-edicion-contacto.component.scss']
})
export class FormularioEdicionContactoComponent extends CommonActualizarDatosClass implements OnInit {

  /**
   * Listado conbo regiones 
   */
  @Input() listadoRegiones: any[] = [];

  /**
   * Listado combo area
   */
  @Input() listadoCodigosArea: any[] = [];

  /**
   * Listado combo nacionalidad
   */
  @Input() listadoNacionalidad: any[] = [];


  /**
   * Datos de usuario
   */
  @Input() datosUsuario: DatosActualizarUsuario;

  /**
   * Listado combo ciudades
   */
  @Input() listadoCiudades = [];

  /**
  * Listado ciudades visibles según la región
  */
  @Input() listadoCiudadesVisibles: any[] = [];

  /**
  * Dirección seleccionada
  */
  @Input() direccionSeleccionada: any;

  /**
  * Listado comunas visibles según la ciudad.
  */
  @Input() listadoComunasVisibles: any[] = [];

  /**
  * Listado combo comunas
  */
  @Input() listadoComunas = [];

  /**
   * Volver a modo visualización. 
   */
  @Output() volverVisualizar: EventEmitter<void> = new EventEmitter();

  /**
   * nacionalidad usuario
   */
  nacionalidad: string;

  /**
   * Nacionalidad seleccionada por el usuario
   */
  nacionalidadSeleccionada: number;

  /**
   * Constantes de la aplicación
   */
  readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;

  /**
   * Validador correo particular
   */
  validadorCorreoParticular: boolean;

  /**
   * Validador correo comercial
   */
  validadorCorreoComercial: boolean;

  /**
   * Validador celular
   */
  validadorCelular: boolean;

  /**
   * Validador Codigo area particular
   */
  validadorCodigoAreaParticular: boolean;

  /**
   * Validador codigo area comercial
   */
  validadorCodigoAreaComercial: boolean;

  /**
   * Validador Telefono particular
   */
  validadorTelefonoParticular: boolean;

  /**
   * Validador Telefono Comercial
   */
  validadorTelefonoComercial: boolean;

  /**
   * Validador calle
   */
  validadorCalle: boolean;

  /**
   * Validador numero
   */
  validadorNumero: boolean;

  /**
   * Validador ciudad
   */
  validadorCiudad: boolean;

  /**
   * Validador comuna
   */
  validadorComuna: boolean;

  /**
   * Validador Nacionalidad
   */
  validadorNacionalidad: boolean;

  /**
   * Validador Region
   */
  validadorRegion: boolean;

  /**
   * Cantidad de errores del formulario
   */
  cantidadErrores: number;

  /**
  * Último error del formulario
  */
  ultimoError: string;

  /**
   * Objeto solicitud
   */
  REQUEST_GUARDAR_SOLICITUD_LABORAL_CONTACTO =
    {
      "solicitud": {
        "modificaDatosLaborales": false,
        "id_nacionalidad": -1,
        "nacionalidad": "",
        "id_renta": -1,
        "id_profesion": -1,
        "id_cargo": -1,
        "tipo_suscripcion_cartola": 1,
        "telefonos": [],
        "correos": [],
        "direcciones": []
      }
    };

  /**
   * Boton regimen.
   */
  @ViewChild('btnCancelar') boton: ElementRef;

  constructor(public readonly actualizarDatosService: ActualizarDatosService,
    private readonly navCtrl: NavController,
    public readonly contextoAPP: ContextoAPP,
    private readonly utilService: UtilService,
    public readonly cdr: ChangeDetectorRef,
    private readonly alertCtrl: AlertController,
    private readonly resizeTeclado: ResizeTecladoClass
  ) {

    super(actualizarDatosService, contextoAPP, cdr);
  }

  async ngOnInit(): Promise<void> {
    this.uuid = await this.utilService.getStorageUuid();

    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;

    this.nacionalidadSeleccionada = this.datosUsuario.idNacionalidadParticular;

    this.resizeTeclado.agregarBoton(this.boton);
  }

  /**
   * Metodo encargado de validar suscripción
   * 
   * @param esSuscripcionCorreoComercial 
   * @returns 
   */
  confirmarSuscripcionCorreo(esSuscripcionCorreoComercial: boolean): any {
    // No se muestra confirmacion al des seleccionar
    if (!this.datosUsuario.esSuscripcionCorreoComercial && esSuscripcionCorreoComercial) {
      return;
    }

    if (!this.datosUsuario.esSuscripcionCorreoParticular && !esSuscripcionCorreoComercial) {
      return;
    }

    const titulo = 'Suscripción Cartola Cuatrimestral vía Email';
    const mensaje = '¿Deseas confirmar la suscripción?';
    const botones: any[] = [
      {
        text: 'CANCELAR',
        handler: () => {
          if (esSuscripcionCorreoComercial) {
            this.datosUsuario.esSuscripcionCorreoComercial = false;
          } else {
            this.datosUsuario.esSuscripcionCorreoParticular = false;
          }
        }
      },
      {
        text: 'SI, CONFIRMO',
        handler: () => {
          this.datosUsuario.esSuscripcionCorreoComercial = esSuscripcionCorreoComercial;
          this.datosUsuario.esSuscripcionCorreoParticular = !esSuscripcionCorreoComercial;
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
  mostrarAlert(titulo: string, mensaje: string, botones: any[]): void {
    this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: botones,
      backdropDismiss: false
    }).then(confirmData => confirmData.present());
  }

  /**
   * Funcion al oprimir boton ir en teclado email
   * @param email
   * @param tipo
   */
  keyUpEmail(email, tipo): void {
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
    this.esCorreoValido(email, tipo);
  }

  /**
   * Se valida que el fomato del correo ingresado sea válido
   *
   * @param email
   * @returns true : valido , false: NO valido
   */
  esCorreoValido(email, tipo): boolean {
    if (!email && tipo === 'particular') {
      this.utilService.mostrarToastIcono(this.CONSTANTES.TEXTO_CAMPOS_SIN_COMPLETAR);
      this.desplegarErrorEmail(tipo as string, true);

      return false;
    } else if (!email && tipo === 'comercial') {
      return true;
    } else {
      return this.validarRegexEmail(email as string, tipo as string);
    }
  }

  /**
   * Valida formato de correo.
   * 
   * @param email a validar
   * @param tipo de correo
   * @returns 
   */
  validarRegexEmail(email: string, tipo: string): boolean {
    const validador = new ValidadorActualizarDatos(this.datosUsuario, this.utilService);
    if (!validador.validarRegexEmail(email)) {
      this.utilService.mostrarToastIcono(this.CONSTANTES.TEXTO_FORMATO_CORREO);
      this.desplegarErrorEmail(tipo, true);

      return false;
    } else {
      this.desplegarErrorEmail(tipo, false);

      return true;
    }
  }

  /**
   * Despliega error de validación de correo según el tipo.
   * 
   * @param tipo de correo
   * @param desplegar error
   */
  desplegarErrorEmail(tipo: string, desplegar: boolean): void {
    if (tipo === 'particular') {
      this.validadorCorreoParticular = desplegar;
    } else {
      this.validadorCorreoComercial = desplegar;
    }
  }

  /**
   * Encargado de limpiar validadores visuales ( bordes rojos )
   */
  reiniciarValidadores(): void {
    this.validadorCalle = false;
    this.validadorCelular = false;
    this.validadorCorreoComercial = false;
    this.validadorCorreoParticular = false;
    this.validadorCiudad = false;
    this.validadorComuna = false;
    this.validadorNacionalidad = false;
    this.validadorRegion = false;
    this.validadorNumero = false;
    this.validadorTelefonoComercial = false;
    this.validadorTelefonoParticular = false;
    this.validadorCodigoAreaParticular = false;
    this.validadorCodigoAreaComercial = false;
    this.cantidadErrores = 0;
    this.ultimoError = '';
  }

  /**
   * Encargado de autoformatear monto ingresado por parametro a formato de dinero
  */
  formatoSoloNumero(valor: string): string {
    return this.contextoAPP.limpiaCaracteres(valor.replace('.', '')).toString();
  }

  /**
   * Encargado de validar datos obligatorios dependiendo del tipo de modal.
   */
  esformularioConErrores(): boolean {
    this.reiniciarValidadores();

    const validador = new ValidadorActualizarDatos(this.datosUsuario, this.utilService);

    // En el caso de modal laboral , siempre es obligatoria la residencia , en el caso contacto , depende del la opcion Residencia chile ( radio )
    const validarResidencia: boolean = this.datosUsuario.opcionResidenciaChile;

    this.validadorCorreoParticular = validador.validadorCorreoParticular();
    this.validadorCorreoComercial = validador.validadorCorreoComercial();
    this.validadorCodigoAreaComercial = validador.validadorCodigoArea(this.datosUsuario.telefonoComercial, this.listadoCodigosArea);
    this.validadorTelefonoComercial = validador.validadorTelefono(this.datosUsuario.telefonoComercial);
    this.validadorCodigoAreaParticular = validador.validadorCodigoArea(this.datosUsuario.telefonoParticular, this.listadoCodigosArea);
    this.validadorTelefonoParticular = validador.validadorTelefono(this.datosUsuario.telefonoParticular);
    this.validadorCelular = validador.validadorCelular();

    if (validarResidencia) {
      this.validadorCalle = validador.validarCalle(this.direccionSeleccionada);
      this.validadorNumero = validador.validarNumero(this.direccionSeleccionada);
      this.validadorNacionalidad = validador.validarNacionalidad(this.nacionalidadSeleccionada, this.listadoNacionalidad);
      this.validadorRegion = validador.validarRegion(this.direccionSeleccionada, this.listadoRegiones);
      this.validadorCiudad = validador.validarCiudad(this.direccionSeleccionada, this.listadoCiudades);
      this.validadorComuna = validador.validarComuna(this.direccionSeleccionada, this.listadoComunas);
    }

    this.validarCantidadErrores();

    return this.cantidadErrores > 0;
  }

  /**
   * Metodo encargado de validar la cantidad de errores y la glosa a desplegar
   */
  validarCantidadErrores(): void {
    const listadoErrores = new Map<string, boolean>();
    const camposObligatorios = ['nacionalidad', 'region', 'comuna', 'ciudad', 'numero', 'calle'];
    const telefonosObligatorios = ['codigoAreaComercial', 'codigoAreaParticular', 'telefonoComercial', 'telefonoParticular', 'celular'];
    const correosObligatorios = ['correoComercial', 'correoParticular'];

    listadoErrores.set('celular', this.validadorCelular);
    listadoErrores.set('nacionalidad', this.validadorNacionalidad);
    listadoErrores.set('region', this.validadorRegion);
    listadoErrores.set('ciudad', this.validadorCiudad);
    listadoErrores.set('comuna', this.validadorComuna);
    listadoErrores.set('numero', this.validadorNumero);
    listadoErrores.set('calle', this.validadorCalle);
    listadoErrores.set('codigoAreaComercial', this.validadorCodigoAreaComercial);
    listadoErrores.set('codigoAreaParticular', this.validadorCodigoAreaParticular);
    listadoErrores.set('telefonoComercial', this.validadorTelefonoComercial);
    listadoErrores.set('telefonoParticular', this.validadorTelefonoParticular);
    listadoErrores.set('correoComercial', this.validadorCorreoComercial);
    listadoErrores.set('correoParticular', this.validadorCorreoParticular);

    // Se obtiene cantidad de errores y se registra el último item con error
    listadoErrores.forEach((value, key) => {
      if (value) {
        this.cantidadErrores++;

        if (this.validarListado(camposObligatorios, key)) {
          this.ultimoError = 'datoObligatorio';
        } else if (this.validarListado(telefonosObligatorios, key)) {
          this.ultimoError = 'telefonoObligatorio';
        } else if (this.validarListado(correosObligatorios, key)) {
          this.ultimoError = 'emailObligatorio';
        } else {
          this.ultimoError = '';
        }
      }
    });
  }

  /**
   * Busca una llave en el listado recibido.
   * 
   * @param listado para buscar
   * @param key a buscar
   * @returns true o false si existe el key en el listado
   */
  validarListado(listado, key): boolean {
    return listado.indexOf(key) > -1;
  }

  /**
   * Metodo que gatilla el guardado de los datos del cliente
   * 
   * @returns en caso de haber un error
   */
  guardarDatosPersonales(): void {
    try {
      const formularioConErrores = this.esformularioConErrores();
      if (formularioConErrores) {

        if (this.cantidadErrores === 1) {
          this.utilService.mostrarToastIcono(this.CONSTANTES.LISTADO_ERRORES[this.ultimoError] as string);
        } else {
          this.utilService.mostrarToastIcono(this.CONSTANTES.MENSAJE_VALIDACION);
        }

        return;
      }

      const objetoActualizarDatos = this.generarObjetoSolicitud();

      const parametros: NavigationExtras = {
        queryParams: {
          option: JSON.stringify(objetoActualizarDatos)
        }
      };

      this.navCtrl.navigateForward('actualizar-datos-sms', parametros);
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_EXITO.CODIGO_OPERACION);
    } catch (e) {
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_ERROR.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de generar objeto solicitud actualización de datos
   * @returns objetoActualizarDatos
   */
  generarObjetoSolicitud(): any {
    let objetoActualizarDatos = this.REQUEST_GUARDAR_SOLICITUD_LABORAL_CONTACTO;
    objetoActualizarDatos.solicitud.modificaDatosLaborales = false;

    // Se mantiene el campo de profesión desde los datos del usuario
    objetoActualizarDatos.solicitud.id_profesion = this.datosUsuario.idProfesion;

    // Se valida nacionalidad en caso de seleccionar residencia Chile
    objetoActualizarDatos.solicitud.id_nacionalidad = this.datosUsuario.opcionResidenciaChile ? this.nacionalidadSeleccionada : this.CONSTANTES.ID_COD_PAIS_SIN_RECIDENCIA;

    objetoActualizarDatos = this.generarObjetoTelefono(objetoActualizarDatos);
    objetoActualizarDatos = this.generarObjetoCorreos(objetoActualizarDatos);
    objetoActualizarDatos = this.generarObjetoDirecciones(objetoActualizarDatos);

    return objetoActualizarDatos;
  }

  /**
   * Genera datos de telefono para request de actualización
   * 
   * @param objetoActualizarDatos para llamada de servicio
   */
  generarObjetoTelefono(objetoActualizarDatos: any): any {
    // Se agrega celular
    if (this.datosUsuario.celularUsuario.numero_telefono !== "") {
      objetoActualizarDatos.solicitud.telefonos.push(this.datosUsuario.celularUsuario as never);
    }

    // Se agrega telefono comercial
    if (this.datosUsuario.telefonoComercial && this.datosUsuario.telefonoComercial !== "") {

      // En caso de no ingresar telefono comercial se envia vacío
      if (this.datosUsuario.telefonoComercial.numero_telefono === "") {
        this.datosUsuario.telefonoComercial.numero_telefono = " ";
        this.datosUsuario.telefonoComercial.codigo_area = " ";
      }

      objetoActualizarDatos.solicitud.telefonos.push(this.datosUsuario.telefonoComercial as never);
    }

    // Se agrega telefono particular
    if (this.datosUsuario.telefonoParticular && this.datosUsuario.telefonoParticular !== "") {

      // En caso de no ingresar telefono comercial se envia vacío
      if (this.datosUsuario.telefonoParticular.numero_telefono === "") {
        this.datosUsuario.telefonoParticular.numero_telefono = " ";
        this.datosUsuario.telefonoParticular.codigo_area = " ";
      }
      objetoActualizarDatos.solicitud.telefonos.push(this.datosUsuario.telefonoParticular as never);
    }

    return objetoActualizarDatos;
  }

  /**
   * Genera datos de correos para request de actualización
   * 
   * @param objetoActualizarDatos para llamada de servicio
   */
  generarObjetoCorreos(objetoActualizarDatos: any): any {
    // Se agrega tipo de sucripción
    if (this.datosUsuario.esSuscripcionCorreoComercial) {
      objetoActualizarDatos.solicitud.tipo_suscripcion_cartola = this.CONSTANTES.TIPO_SUSC_CORREO_COM;
    } else if (this.datosUsuario.esSuscripcionCorreoParticular) {
      objetoActualizarDatos.solicitud.tipo_suscripcion_cartola = this.CONSTANTES.TIPO_SUSC_CORREO_PART;
    } else {
      objetoActualizarDatos.solicitud.tipo_suscripcion_cartola = this.CONSTANTES.TIPO_SUSC_VACIA;
    }

    // Se agrega correo Particular
    if (this.datosUsuario.correoParticular.correo !== "") {
      objetoActualizarDatos.solicitud.correos.push(this.datosUsuario.correoParticular as never);
    }

    // Se agrega correo comercial
    if (this.datosUsuario.correoComercial && this.datosUsuario.correoComercial !== "") {

      // En caso de no ingresar correo comercial se envia vacío
      if (this.datosUsuario.correoComercial.correo === "") {
        this.datosUsuario.correoComercial.correo = " ";
      }
      objetoActualizarDatos.solicitud.correos.push(this.datosUsuario.correoComercial as never);
    }

    return objetoActualizarDatos;
  }

  /**
   * Genera datos de direccion para request de actualización

  * @param objetoActualizarDatos para llamada de servicio
   */
  generarObjetoDirecciones(objetoActualizarDatos: any): any {
    // Se crea objeto sin residencia según selección, en caso contrario se envían los datos ingresados
    if (!this.datosUsuario.opcionResidenciaChile) {
      this.direccionSeleccionada.id_ciudad = CONSTANTES_ACTUALIZAR_DATOS.ID_COD_SIN_CIUDAD;
      this.direccionSeleccionada.id_comuna = CONSTANTES_ACTUALIZAR_DATOS.ID_COD_SIN_COMUNA;
      this.direccionSeleccionada.id_pais = CONSTANTES_ACTUALIZAR_DATOS.ID_COD_PAIS_SIN_RECIDENCIA;
      this.direccionSeleccionada.id_region = CONSTANTES_ACTUALIZAR_DATOS.ID_COD_SIN_REGION;
      this.direccionSeleccionada.id_jerarquia = CONSTANTES_ACTUALIZAR_DATOS.ID_TIPO_DIRECCION_COM;
      this.direccionSeleccionada.id_prioridad = CONSTANTES_ACTUALIZAR_DATOS.ID_TIPO_DIRECCION_PART;
      this.direccionSeleccionada.nombre_comuna = "";
      this.direccionSeleccionada.nombre_region = "";
      this.direccionSeleccionada.nombre_ciudad = "";
      this.direccionSeleccionada.nombre_comuna = "";
      this.direccionSeleccionada.nombre_pais = "";

      // Se agrega dirección particular
      if (this.datosUsuario.direccionParticular && this.datosUsuario.direccionParticular !== "undefined") {
        this.direccionSeleccionada.id_mae_direccion = this.datosUsuario.direccionParticular.id_mae_direccion;
      }
    } else {
      // Se envía Chile en caso de seleccionar residencia
      this.direccionSeleccionada.nombre_pais = CONSTANTES_ACTUALIZAR_DATOS.GLOSA_CHILE;
      this.direccionSeleccionada.id_pais = CONSTANTES_ACTUALIZAR_DATOS.ID_COD_CHILE;
    }

    // Se agregan direcciones
    objetoActualizarDatos.solicitud.direcciones.push(this.direccionSeleccionada as never);

    // Se agrega dirección comercial
    if (this.datosUsuario.direccionComercial && this.datosUsuario.direccionComercial !== "undefined") {
      objetoActualizarDatos.solicitud.direcciones.push(this.datosUsuario.direccionComercial as never);
    }

    return objetoActualizarDatos;
  }
}
