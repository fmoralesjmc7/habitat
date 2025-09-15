import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { PlanesService, UtilService } from '../../../../../src/app/services';
import { ActualizarDatosService } from '../../../../../src/app/services/api/restful/actualizar-datos.service';
import { ResizeClass } from '../../../../../src/app/util/resize.class';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { DatosActualizarUsuario } from '../util/datos.actualizar.usuario';
import { CONSTANTES_ACTUALIZAR_DATOS, CONSTANTES_TRAZAS_DATOS } from '../util/datos.constantes';

@Injectable({
  providedIn: 'root'
})
export class UtilFormularioClass extends ResizeClass {

  /**
   * Referencia datos usuario servicio
   */
  datosUsuario: DatosActualizarUsuario;

  /**
   * Referencia al rut
   */
  rut: number;
  /**
   * Referencia al digito verificador.
   */
  dv: string;

  /**
   * Se asigna el uuid desde la pantalla anterior (actualizar datos)
   */
  uuid: string;

  /**
   * Dirección del usuario
   */
  direccionSeleccionada: any = {};

  /**
   * Flag modo edición
   */
  modoEdicion = false;

  /**
   * Utilizado para validar si puede realizar actualización de datos
   */
  telefonoCelular: string;

  /**
   * Flag para mostrar modal sin celular
   */
  modalSinCelularValido = false;

  /**
   * Constantes de la funcionaldiad
   */
  readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;

  /**
   * Objeto utilizado en la edición
   */
  datosUsuarioInput: DatosActualizarUsuario;

  /**
   * Objeto utilizado en la edición
   */
  direccionSeleccionadaInput: any;

  /**
   * Guarda datos obtenidos desde el servicio
   */
  datosUsuarioJson: any;

  /**
  * Listado conbo regiones 
  */
  listadoRegiones: any[] = [];

  /**
   * Listado combo comunas
   */
  listadoComunas = [];

  /**
   * Listado combo ciudades
   */
  listadoCiudades = [];

  /**
   * Listado combo area
   */
  listadoCodigosArea: any[] = [];

  /**
   * Listado combo nacionalidad
   */
  listadoNacionalidad: any[] = [];

  /**
   * Listado ciudades visibles
   */
  listadoCiudadesVisibles: any[] = [];

  /**
   * Listado comunas visibles
   */
  listadoComunasVisibles: any[] = [];

  /**
   * nacionalidad usuario
   */
  nacionalidad: string;

  /**
   * Id nacionalidad del usuario
   */
  nacionalidadSeleccionada: number;

  /**
   * Listado de rangos de renta vista laborales
   */
  listadoRangosRenta:any [] = [];

  /**
   * Listado de cargos
   */
  listadoCargos:any [] = [];

  /**
   * Listado de rangos de profesiones
   */
  listadoProfesiones:any [] = [];

  constructor(public readonly actualizarDatosService: ActualizarDatosService,
    public readonly planesService: PlanesService,
    public readonly navCtrl: NavController,
    public readonly contextoAPP: ContextoAPP,
    public readonly utilService: UtilService,
    public readonly route: ActivatedRoute,
    public readonly alertCtrl: AlertController) {
    super(contextoAPP)
  }

  /**
   * Incializa datos de usuario
   * 
   * @param actualizacionContacto flag
   */
  async inicializarVista(actualizacionContacto: boolean): Promise<void> {
    return new Promise(async (resolve) => {
      this.uuid = await this.utilService.getStorageUuid();
  
      this.route.queryParams.subscribe(params => {
        
        this.modoEdicion = false;

        this.datosUsuarioJson = Object.assign({}, JSON.parse(params.datosUsuario as string));
  
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
        this.telefonoCelular = this.contextoAPP.datosCliente.telefonoCelular;
        this.datosUsuario = new DatosActualizarUsuario();
        this.datosUsuario.iniciarDatos(JSON.parse(params.datosUsuario as string), this.rut, this.dv);
  
        if (actualizacionContacto) {
          this.direccionSeleccionada = this.datosUsuario.direccionParticular;
          this.nacionalidadSeleccionada = this.datosUsuario.idNacionalidadParticular;
        } else {
          this.direccionSeleccionada = this.datosUsuario.direccionComercial;

        }

        if (!this.direccionSeleccionada) {
          this.direccionSeleccionada = this.CONSTANTES.OBJETO_DIRECCION_VACIO;
        }

        resolve();
      });
    });

  }

  /**
   * Redirige a pantalla sucursales
   */
  irSucursales(): void {
    this.navCtrl.navigateForward('SucursalesPage');
  }

  /**
   * Encargada de realizar acción de llamar a contact center.
  */
  llamarContactCenter(): void {
    window.open(`tel: ${this.CONSTANTES.TELEFONO_CONTACT}`, '_system');
  }

  /**
   * Metodo encargado de volver al home
   */
  volverAlHome(): void {
    if (this.modoEdicion) {
      this.volverVisualizar();
    } else {
      this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.actualizarDatosHome);
    }
  }

  /**
   * Ejecuta edición.
   */
  editarDatos(): void {
    // Validamos si el usuario cuenta con celular registrado , de lo contrario no puede editar
    if (!this.telefonoCelular || this.telefonoCelular === this.CONSTANTES.SIN_TELEFONO_VALIDO) {
      this.modalSinCelularValido = true;
    } else {
      this.datosUsuarioInput = new DatosActualizarUsuario();
      this.datosUsuarioInput.iniciarDatos(this.datosUsuarioJson, this.rut, this.dv);
      this.direccionSeleccionadaInput = Object.assign({}, this.direccionSeleccionada);

      this.modoEdicion = !this.modoEdicion;
    }
  }

  /**
   * Gatilla validación cerrar edición
   */
  volverVisualizar(): void {
    const titulo = 'Importante';
    const mensaje = 'Al continuar, perderás los datos ya ingresados.';
    const botones: any[] = [
      {
        text: 'CANCELAR'
      },
      {
        text: 'CONTINUAR',
        handler: () => {
          this.modoEdicion = !this.modoEdicion;
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
  * Metodo encargado de cargar nacionalidades
  * @param loading de la aplicación
  */
  cargarNacionalidades(loading: any): void {
    this.actualizarDatosService.obtenerNacionalidad(this.rut, this.dv).subscribe((respuestaNacionalidad: any) => {
      this.listadoNacionalidad = respuestaNacionalidad;
      this.datosUsuario.calculoNacionalidadUsuario(this.listadoNacionalidad);
      this.cargarRegionesComunas(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }

  /**
  * Metodo encargado de cargar regiones
  * @param loading de la aplicación
  */
  cargarRegionesComunas(loading: any): void {
    this.planesService.obtenerRegiones(this.rut, this.dv).subscribe((respuestaRegiones: any) => {

      this.listadoRegiones = respuestaRegiones;
      this.ordenarRegiones();
      this.cargarComunas(loading);

    }, () => {
      this.procesarErrorDatos(loading);
    });
  }

  /**
   * Metodo encargado de cargar comunas
   * @param loading de la aplicación
   */
  cargarComunas(loading: any): void {
    this.planesService.obtenerComunas(this.rut, this.dv).subscribe((respuestaComunas: any) => {
      this.listadoComunas = respuestaComunas;
      this.listadoComunasVisibles = this.listadoComunas.filter((comuna: any) => +comuna.id_ciudad === this.direccionSeleccionada.id_ciudad);
      this.cargarCiudades(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }

  /**
  * Metodo encargado de ordenar regiones
  */
  ordenarRegiones(): void {
    this.listadoRegiones.sort(function (a: any, b: any) { //Regiones ordenadas alfabeticamente
      if (a.nombre_region < b.nombre_region) {
        return -1;
      }

      if (a.nombre_region > b.nombre_region) {
        return 1;
      }

      return 0;
    });
  }

  /**
  * Metodo encargado de cargar ciudades
  * @param loading de la aplicación
  */
  cargarCiudades(loading: any): void {
    this.actualizarDatosService.obtenerCiudades(this.rut, this.dv).subscribe((respuestaCiudades: any) => {
      this.listadoCiudades = respuestaCiudades;
      this.listadoCiudadesVisibles = this.listadoCiudades.filter((ciudad: any) => ciudad.id_region === this.direccionSeleccionada.id_region);
      this.cargarCodigosArea(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }

  /**
  * Metodo encargado de cargar codigos de area
  * @param loading de la aplicación
  */
  cargarCodigosArea(loading: any): void {
    this.actualizarDatosService.obtenerCodigosArea(this.rut, this.dv).subscribe((respuestaCodigosArea: any) => {
      this.listadoCodigosArea = respuestaCodigosArea;
      this.contextoAPP.ocultarLoading(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }

  /**
  * Metodo encargado de cargar rangos de renta
  * @param loading de la aplicación
  */
  cargarRangosRenta(loading: any) {
    this.actualizarDatosService.obtenerRangosRenta(this.rut, this.dv).subscribe(async (respuestaRangosRenta: any) => {
      this.listadoRangosRenta = respuestaRangosRenta;
      this.datosUsuario.obtenerDatosRenta(this.listadoRangosRenta);
      this.cargarCargos(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }

  /**
  * Metodo encargado de cargar cargos
  * @param loading de la aplicación
  */
  cargarCargos(loading: any) {
    this.actualizarDatosService.obtenerCargos(this.rut, this.dv).subscribe(async (respuestaCargos: any) => {
      this.listadoCargos = respuestaCargos;
      this.datosUsuario.obtenerDatosCargo(this.listadoCargos);
      this.cargarProfesiones(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }  

  /**
  * Metodo encargado de cargar profesiones
  * @param loading de la aplicación
  */
  cargarProfesiones(loading: any){
    this.actualizarDatosService.ObtenerProfesiones(this.rut, this.dv).subscribe(async (respuestaProfesiones: any) => {
      this.listadoProfesiones = respuestaProfesiones;
      this.datosUsuario.obtenerDatosProfesion(this.listadoProfesiones);
      this.cargarCiudades(loading);
    }, () => {
      this.procesarErrorDatos(loading);
    });
  }


  /**
  * Procesa error de carga de datos.
  * 
  * @param loading de la aplicación
  */
  procesarErrorDatos(loading: any): void {
    this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.HOME.CODIDO_TRAZA_EXITO_ERROR.CODIGO_OPERACION);
    this.contextoAPP.ocultarLoading(loading);
    this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
  }

  /**
 * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
 * @param codigoOperacion 
 */
  registrarTrazabilidad(codigoOperacion: number): void {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza: CONSTANTES_TRAZAS_DATOS,
      uuid: this.uuid,
      rut: this.rut,
      dv: this.dv,
    }

    switch (codigoOperacion) {
      case CONSTANTES_TRAZAS_DATOS.HOME.CODIDO_TRAZA_EXITO_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.HOME.CODIDO_TRAZA_EXITO_ERROR);
        break;
      case CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_INICIO_CONTACTO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_INICIO_CONTACTO);
        break;
      case CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_INICIO_LABORAL.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_INICIO_LABORAL);
        break;
    }

    this.actualizarDatosService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
  }
}
