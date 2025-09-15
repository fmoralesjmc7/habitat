import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ResizeTecladoClass } from '../../../util/resize-teclado.class';
import { DatosActualizarUsuario } from '../../../pages/actualizar-datos/util/datos.actualizar.usuario';
import { UtilService } from '../../../services';
import { ActualizarDatosService } from '../../../services/api/restful/actualizar-datos.service';
import { ContextoAPP } from '../../../util/contexto-app';
import { CONSTANTES_ACTUALIZAR_DATOS, CONSTANTES_TRAZAS_DATOS } from '../../../pages/actualizar-datos/util/datos.constantes';
import { ValidadorActualizarDatos } from '../util/validador';
import { CommonActualizarDatosClass } from '../util/common-actualizar-datos.class';

@Component({
  selector: 'app-formulario-edicion-laborales',
  templateUrl: './formulario-edicion-laborales.component.html',
  styleUrls: ['./formulario-edicion-laborales.component.scss']
})
export class FormularioEdicionLaboralesComponent extends CommonActualizarDatosClass implements OnInit {

  /**
   * Listado conbo regiones 
   */
  @Input() listadoRegiones: any[] = [];

  /**
   * Listado Rangos de renta
   */
  @Input() listadoRangosRenta: any[] = [];

  /**
   * Listado de cargos
   */
  @Input() listadoCargos: any[] = [];

  /**
   * Listado profesiones
   */
  @Input() listadoProfesiones: any[] = [];

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
   * Constantes de la aplicación
   */
  readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;

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
        "modificaDatosLaborales": true,
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

  /**
   * Rango renta seleccionado
   */
  rangoRentaSeleccionada: number;

  /**
   * Profesion seleccionada
   */
  profesionSeleccionada: number;

  /**
   * Cargo seleccionado
   */
  cargoSeleccionado: number;

  constructor(public readonly actualizarDatosService: ActualizarDatosService,
    private readonly navCtrl: NavController,
    public readonly contextoAPP: ContextoAPP,
    private readonly utilService: UtilService,
    public readonly cdr: ChangeDetectorRef,
    private readonly resizeTeclado: ResizeTecladoClass
  ) {

    super(actualizarDatosService, contextoAPP, cdr);
  }

  async ngOnInit(): Promise<void> {
    this.uuid = await this.utilService.getStorageUuid();

    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;

    // Laborales
    this.rangoRentaSeleccionada = this.datosUsuario.idRenta;
    this.profesionSeleccionada = this.datosUsuario.idProfesion;
    this.cargoSeleccionado = this.datosUsuario.idCargo;

    this.resizeTeclado.agregarBoton(this.boton);
  }

  /**
   * Encargado de limpiar validadores visuales ( bordes rojos )
   */
  reiniciarValidadores(): void {
    this.validadorCalle = false;
    this.validadorCiudad = false;
    this.validadorComuna = false;
    this.validadorRegion = false;
    this.validadorNumero = false;
    this.cantidadErrores = 0;
    this.ultimoError = '';
  }

  /**
   * Encargado de validar datos obligatorios dependiendo del tipo de modal.
   */
  esformularioConErrores(): boolean {
    this.reiniciarValidadores();

    const validador = new ValidadorActualizarDatos(this.datosUsuario, this.utilService);

    this.validadorCalle = validador.validarCalle(this.direccionSeleccionada);
    this.validadorNumero = validador.validarNumero(this.direccionSeleccionada);
    this.validadorRegion = validador.validarRegion(this.direccionSeleccionada, this.listadoRegiones);
    this.validadorCiudad = validador.validarCiudad(this.direccionSeleccionada, this.listadoCiudades);
    this.validadorComuna = validador.validarComuna(this.direccionSeleccionada, this.listadoComunas);

    this.validarCantidadErrores();

    return this.cantidadErrores > 0;
  }

  /**
   * Metodo encargado de validar la cantidad de errores y la glosa a desplegar
   */
  validarCantidadErrores(): void {
    const listadoErrores = new Map<string, boolean>();

    listadoErrores.set('region', this.validadorRegion);
    listadoErrores.set('ciudad', this.validadorCiudad);
    listadoErrores.set('comuna', this.validadorComuna);
    listadoErrores.set('numero', this.validadorNumero);
    listadoErrores.set('calle', this.validadorCalle);

    // Se obtiene cantidad de errores y se registra el último item con error
    listadoErrores.forEach((value) => {
      if (value) {
        this.cantidadErrores++;
        this.ultimoError = 'datoObligatorio';
      }
    });
  }

  /**
   * Metodo que gatilla el guardado de los datos del cliente
   * 
   * @returns en caso de haber un error
   */
  guardarDatosPersonales(): void {
    try {
      if (this.esformularioConErrores()) {
        this.utilService.mostrarToastIcono(this.CONSTANTES.MENSAJE_VALIDACION);
        return;
      } else {
        const objetoActualizarDatos = this.generarObjetoSolicitud();

        const parametros: NavigationExtras = {
          queryParams: {
            option: JSON.stringify(objetoActualizarDatos)
          }
        };

        this.navCtrl.navigateForward('actualizar-datos-sms', parametros);
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_LABORAL_EXITO.CODIGO_OPERACION);
      }
    } catch (e) {
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_LABORAL_ERROR.CODIGO_OPERACION);
    }
  }

  /**
   * Encargado de generar objeto solicitud actualización de datos
   * @returns objetoActualizarDatos
   */
  generarObjetoSolicitud(): any {
    let objetoActualizarDatos = this.REQUEST_GUARDAR_SOLICITUD_LABORAL_CONTACTO;
    objetoActualizarDatos.solicitud.modificaDatosLaborales = true;
    objetoActualizarDatos.solicitud.id_renta = this.rangoRentaSeleccionada;
    objetoActualizarDatos.solicitud.id_profesion = this.profesionSeleccionada;
    objetoActualizarDatos.solicitud.id_cargo = this.cargoSeleccionado;

    // Se mantiene el campo de nacionalidad desde los datos del usuario
    objetoActualizarDatos.solicitud.id_nacionalidad = this.datosUsuario.idNacionalidadParticular;

    objetoActualizarDatos = this.generarObjetoDirecciones(objetoActualizarDatos);

    return objetoActualizarDatos;
  }

  /**
   * Genera datos de direccion para request de actualización
 
  * @param objetoActualizarDatos para llamada de servicio
   */
  generarObjetoDirecciones(objetoActualizarDatos: any): any {
    if (!this.datosUsuario.direccionComercial) {
      this.datosUsuario.direccionComercial = this.CONSTANTES.OBJETO_DIRECCION_VACIO;
      this.datosUsuario.direccionComercial.id_pais = this.CONSTANTES.ID_COD_CHILE;
      this.datosUsuario.direccionComercial.id_region = this.direccionSeleccionada.id_region;
      this.datosUsuario.direccionComercial.id_ciudad = this.direccionSeleccionada.id_ciudad;
      this.datosUsuario.direccionComercial.id_comuna = this.direccionSeleccionada.id_comuna;
      this.datosUsuario.direccionComercial.calle = this.direccionSeleccionada.calle ? this.direccionSeleccionada.calle : "";
      this.datosUsuario.direccionComercial.numero = this.direccionSeleccionada.numero ? this.direccionSeleccionada.numero : "";
      this.datosUsuario.direccionComercial.departamento = this.direccionSeleccionada.departamento ? this.direccionSeleccionada.departamento : "";
      this.datosUsuario.direccionComercial.block = this.direccionSeleccionada.block ? this.direccionSeleccionada.block : "";
      this.datosUsuario.direccionComercial.villa = this.direccionSeleccionada.villa ? this.direccionSeleccionada.villa : "";

      this.datosUsuario.direccionComercial.id_prioridad = this.CONSTANTES.ID_PRIORIDAD;
      this.datosUsuario.direccionComercial.id_jerarquia = this.CONSTANTES.ID_JERARQUIA;
      this.datosUsuario.direccionComercial.id_mae_direccion = 0;

      objetoActualizarDatos.solicitud.direcciones.push(this.datosUsuario.direccionComercial as never);
    } else {
      objetoActualizarDatos.solicitud.direcciones.push(this.direccionSeleccionada as never);
    }

    return objetoActualizarDatos;
  }
}
