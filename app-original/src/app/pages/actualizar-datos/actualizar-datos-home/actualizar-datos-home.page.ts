import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { CONSTANTES_ACTUALIZAR_DATOS, CONSTANTES_TRAZAS_DATOS } from '../util/datos.constantes';
import { ActualizarDatosService } from '../../../../../src/app/services/api/restful/actualizar-datos.service';
import { UtilService } from '../../../../../src/app/services'; 
import { DatosActualizarUsuario } from '../util/datos.actualizar.usuario';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ResizeClass } from '../../../../../src/app/util/resize.class';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-actualizar-datos-home',
  templateUrl: './actualizar-datos-home.page.html',
  styleUrls: ['./actualizar-datos-home.page.scss'],
})
export class ActualizarDatosHomeComponent extends ResizeClass implements OnInit {

  // Flag para mostrar formulario de edicion
  mostrarVerFormulario: boolean;
  // Referencia a constantes modulo 
  readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;
  // Referencia al rut
  rut: number;
  // Referencia al digito verificador.
  dv: string;
  // Referencia datos usuario servicio
  datosUsuario: DatosActualizarUsuario;
  // Listado conbo regiones 
  listadoRegiones = [];
  // Listado combo comunas
  listadoComunas = [];
  // Listado combo ciudades
  listadoCiudades = [];
  // Listado combo area
  listadoCodigosArea = [];
  // Listado combo nacionalidad
  listadoNacionalidad = [];
  // nacionalidad usuario
  nacionalidad: string;
  listadoRangosRenta:any [] = [];
  // Listado combo cargos
  listadoCargos:any [] = [];
  // Listado combo profesiones
  listadoProfesiones:any [] = [];

  /**
   * Flag modal informativo
   */
  mostrarModalDatos:boolean;

  // Se asigna el uuid desde la pantalla anterior (actualizar datos)
  uuid: string;

  /**
   * Flag de activación para edición de datos secundarios.
   */
  activarSecundarios = false;

  /**
   * Respuesta datos cliente.
   */
  respuestaDatosCliente: any;

  constructor(
    private readonly modalController: ModalController,
    private readonly navCtrl: NavController,
    private readonly actualizarDatosService: ActualizarDatosService,
    public readonly contextoAPP: ContextoAPP,
    private readonly utilService: UtilService) {
    
      super(contextoAPP);
  }

  /**
   * Metodo de carga del componente
   */
  async ngOnInit(): Promise<void> {
    this.uuid = this.utilService.generarUuid();

    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    
    this.datosUsuario = new DatosActualizarUsuario();
    this.datosUsuario.nombres = this.contextoAPP.datosCliente.nombre;
    this.datosUsuario.apellidoMaterno = this.contextoAPP.datosCliente.apellidoMaterno;
    this.datosUsuario.apellidoPaterno = this.contextoAPP.datosCliente.apellidoPaterno;
    this.datosUsuario.rut = this.rut;
    this.datosUsuario.dv  = this.dv;
  }
  
  /**
   * Carga la info del usuario cuando entran al componente.
   */
  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.cargarInformacionUsuario(loading);
  }

  /**
   * Metodo encargado de cargar información del cliente
   * @param loading de la app
   */
  cargarInformacionUsuario(loading: any): void {
    this.actualizarDatosService.obtenerDatosUsuario(this.rut, this.dv).subscribe((respuestaDatosUsuario: any) => {
      this.datosUsuario.iniciarDatos(respuestaDatosUsuario,this.rut,this.dv);
      this.respuestaDatosCliente = respuestaDatosUsuario;

      //SI no tiene suscripcion se debe validar si tiene correo, en ese caso se asigna la suscripcion
      if (!this.datosUsuario.esSuscripcionCorreoComercial && !this.datosUsuario.esSuscripcionCorreoParticular){
        if (this.datosUsuario.correoParticular?.correo !== ""){
          this.datosUsuario.esSuscripcionCorreoParticular = true;
        }
      }

      if (this.datosUsuario.correoParticular?.correo === ""){
        this.datosUsuario.esSuscripcionCorreoParticular = false;
      }

      if (this.datosUsuario.correoComercial?.correo === ""){
        this.datosUsuario.esSuscripcionCorreoComercial = false;
      }

      this.contextoAPP.ocultarLoading(loading);
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
    const datosGenerales = {
        traza : CONSTANTES_TRAZAS_DATOS,
        uuid : this.uuid,
        rut: this.rut,
        dv: this.dv,
    }

    const parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_DATOS.HOME.CODIDO_TRAZA_EXITO_ERROR);
    this.actualizarDatosService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();

    this.contextoAPP.ocultarLoading(loading);
    this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.actualizarDatos));
  }

  /**
   * Metodo encargado de presentar modal de despliegue de edición de datos
   * 
   * @param opcionFormulario a desplegar
   * @returns presentación del modal
   */
  async eventoMostrarFormulario(opcionFormulario: string): Promise<any> {
    this.mostrarVerFormulario = true;
    const esModalDatosLaborales = opcionFormulario === this.CONSTANTES.OPCION_LABORALES;

    const navigationExtras: NavigationExtras = {
        queryParams: {
          datosUsuario:  JSON.stringify(this.respuestaDatosCliente)
        }
    };

    if (esModalDatosLaborales) {
      this.navCtrl.navigateRoot('actualizar-datos-laborales', navigationExtras);
    } else {
      this.navCtrl.navigateRoot('actualizar-datos-contacto', navigationExtras);
    }
  }

  /**
   * Encargada de realizar acción de llamar a contact center.
  */
  llamarContactCenter(): void {
    this.mostrarModalDatos = false;
    window.open(`tel: ${this.CONSTANTES.TELEFONO_CONTACT}`, '_system');
  }
  
  /**
   * Redirige a pantalla sucursales
   */
  irSucursales(): void {
    this.mostrarModalDatos = false;
    this.navCtrl.navigateForward('SucursalesPage');
  }

  /**
   * Metodo encargado de volver al home
   */
  volverAlHome(): void {
    this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.actualizarDatos);
  }
}
