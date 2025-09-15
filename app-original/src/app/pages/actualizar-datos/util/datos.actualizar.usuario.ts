import { CONSTANTES_ACTUALIZAR_DATOS } from './datos.constantes';

export class DatosActualizarUsuario {
    // Datos personales
    public rut: number;
    public dv: string;
    public nombres: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public sexo: string;
    public nacionalidad: string;
    public estadoCivil: string;
    public fechaUltimaActualizacion: string;

    public esSuscripcionCorreoComercial: boolean;
    public esSuscripcionCorreoParticular: boolean;
    public opcionResidenciaChile: boolean;
    
    public idRenta: number;
    public nombreRenta:string;
    public idProfesion: number;
    public nombreProfesion:string;
    public idCargo: number;
    public nombreCargo:string;

    public datosEmpleador:any [] = [];

    idNacionalidadParticular: number;
    
    telefonoComercial: any;
    telefonoParticular: any;
    celularUsuario: any;
    correoParticular: any;
    correoComercial: any;

    direccionComercial: any;
    direccionParticular: any;

    // Referencia a constantes modulo 
    readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;

    constructor() {
      // Inicialización futura planificada
    }

    public iniciarDatos(datosUsuarioResponse: any,rut:number , dv:string) {
        this.rut = rut;
        this.dv = dv;
        this.nombres = datosUsuarioResponse.primer_nombre + " " + datosUsuarioResponse.segundo_nombre;
        this.apellidoPaterno = datosUsuarioResponse.apellido_paterno;
        this.apellidoMaterno = datosUsuarioResponse.apellido_materno;
        this.sexo = datosUsuarioResponse.sexo;
        this.idNacionalidadParticular = datosUsuarioResponse.id_nacionalidad;
        this.estadoCivil = datosUsuarioResponse.estado_civil;
        this.fechaUltimaActualizacion = datosUsuarioResponse.ultima_actualizacion;
        this.idRenta = datosUsuarioResponse.id_renta;
        this.idProfesion = datosUsuarioResponse.id_profesion;
        this.idCargo = datosUsuarioResponse.id_cargo;
        this.esSuscripcionCorreoParticular = datosUsuarioResponse.tipo_suscripcion_cartola === this.CONSTANTES.TIPO_SUSC_CORREO_PART ? true : false;
        this.esSuscripcionCorreoComercial = datosUsuarioResponse.tipo_suscripcion_cartola === this.CONSTANTES.TIPO_SUSC_CORREO_COM ? true : false;

        if(!this.esSuscripcionCorreoComercial && !this.esSuscripcionCorreoParticular) {
            this.esSuscripcionCorreoParticular = true;
        }
        this.obtenerCelularUsuario(datosUsuarioResponse.telefonos);
        this.obtenerTelefonoParticular(datosUsuarioResponse.telefonos);
        this.obtenerTelefonoComercial(datosUsuarioResponse.telefonos);

        this.limpiarProblemaEncodeNombres();
        this.obtenerDatosEmpleador(datosUsuarioResponse);
        this.obtenerCorreoParticular(datosUsuarioResponse.correos);
        this.obtenerCorreoComercial(datosUsuarioResponse.correos);
        this.obtenerTipoResidencia(datosUsuarioResponse.direcciones);
        this.obtenerDatosDireccion(datosUsuarioResponse.direcciones);
    }

    limpiarProblemaEncodeNombres() {
        this.nombres = this.nombres.split("?").join("Ñ").trim();
        this.apellidoMaterno = this.apellidoMaterno.split("?").join("Ñ").trim();
        this.apellidoPaterno = this.apellidoPaterno.split("?").join("Ñ").trim();
    }

    public calculoNacionalidadUsuario(listadoNacionalidad: any) {
        let nacionalidad = listadoNacionalidad.find((nacion: any) => nacion.id_nacionalidad === this.idNacionalidadParticular);
        if (nacionalidad) {
            this.nacionalidad = nacionalidad.nombre_nacionalidad;
        }
    }

    obtenerCelularUsuario(listadoTelefonos: any) {
        this.celularUsuario = listadoTelefonos.find((telefono: any) => telefono.id_tipo_telefono === this.CONSTANTES.ID_TELEFONO_CELULAR);
        if (this.celularUsuario === undefined) {
            this.celularUsuario = Object.assign({}, this.CONSTANTES.OBJETO_TELEFONO_VACIO);
            this.celularUsuario.id_tipo_telefono = this.CONSTANTES.ID_TELEFONO_CELULAR;
        }
    }

    obtenerTelefonoParticular(listadoTelefonos: any) {
        this.telefonoParticular = listadoTelefonos.find((telefono: any) => telefono.id_tipo_telefono === this.CONSTANTES.ID_TELEFONO_PART);
        if (this.telefonoParticular === undefined) {
            this.telefonoParticular = Object.assign({},this.CONSTANTES.OBJETO_TELEFONO_VACIO);
            this.telefonoParticular.id_tipo_telefono = this.CONSTANTES.ID_TELEFONO_PART;
        }
    }

    obtenerTelefonoComercial(listadoTelefonos: any) {
        this.telefonoComercial = listadoTelefonos.find((telefono: any) => telefono.id_tipo_telefono === this.CONSTANTES.ID_TELEFONO_COM);
        if (this.telefonoComercial === undefined) {
            this.telefonoComercial = Object.assign({},this.CONSTANTES.OBJETO_TELEFONO_VACIO);
            this.telefonoComercial.id_tipo_telefono = this.CONSTANTES.ID_TELEFONO_COM;
        }
    }

    obtenerCorreoParticular(listadoCorreos: any) {
        this.correoParticular = listadoCorreos.find((correo: any) => correo.id_tipo_correo === this.CONSTANTES.ID_CORREO_PART);
        if (this.correoParticular === undefined) {
            this.correoParticular = Object.assign({},this.CONSTANTES.OBJETO_CORREO_VACIO);
            this.correoParticular.id_tipo_correo = this.CONSTANTES.ID_CORREO_PART;
        }
    }

    obtenerCorreoComercial(listadoCorreos: any) {
        this.correoComercial = listadoCorreos.find((correo: any) => correo.id_tipo_correo === this.CONSTANTES.ID_CORREO_COM);
        if (this.correoComercial === undefined) {
            this.correoComercial = Object.assign({},this.CONSTANTES.OBJETO_CORREO_VACIO);
            this.correoComercial.id_tipo_correo = this.CONSTANTES.ID_CORREO_COM;
        }
    }

    obtenerTipoResidencia(listadoDirecciones: any) {
        let direccionNoResidente = listadoDirecciones.find((direccion: any) => direccion.id_prioridad === this.CONSTANTES.ID_TIPO_DIRECCION_PART && direccion.id_pais === this.CONSTANTES.ID_COD_PAIS_SIN_RECIDENCIA);
        this.opcionResidenciaChile = direccionNoResidente ? false : true ;
    }

    obtenerDatosDireccion(listadoDirecciones: any){
        this.direccionParticular = listadoDirecciones.find((direccion: any) => direccion.id_prioridad === this.CONSTANTES.ID_TIPO_DIRECCION_PART);
        this.direccionComercial = listadoDirecciones.find((direccion: any) => direccion.id_prioridad === this.CONSTANTES.ID_TIPO_DIRECCION_COM);
        
        if(this.direccionParticular === undefined) {
            this.direccionParticular = Object.assign({},this.CONSTANTES.OBJETO_DIRECCION_VACIO);
            this.direccionParticular.id_prioridad = this.CONSTANTES.ID_TIPO_DIRECCION_PART;
        }

        if(!this.direccionComercial === undefined) {
            this.direccionComercial = Object.assign({},this.CONSTANTES.OBJETO_DIRECCION_VACIO);
            this.direccionComercial.id_prioridad = this.CONSTANTES.ID_TIPO_DIRECCION_COM;
        }
    }

    public obtenerDatosCargo(listadoCargos: any){
        if(this.idCargo == -1) { // sin cargo seleccionada
            return;
        }
        
        let cargoSeleccionado = listadoCargos.find((cargo: any) => cargo.id_cargo === this.idCargo);
        this.nombreCargo = cargoSeleccionado ? cargoSeleccionado.nombre_cargo : "";
    }

    public obtenerDatosRenta(listadoRentas: any){
        if(this.idRenta == -1) { // sin renta seleccionada
            return;
        }
        
        let rentaSeleccionada = listadoRentas.find((renta: any) => renta.id === this.idRenta);
        this.nombreRenta = rentaSeleccionada ? rentaSeleccionada.rango : "";
    }

    public obtenerDatosProfesion(listadoProfesiones: any){
        if(this.idProfesion == -1) { // sin profesion seleccionada
            return;
        }
        
        let profesionSeleccionada = listadoProfesiones.find((prefesion: any) => prefesion.id_profesion === this.idProfesion);
        this.nombreProfesion = profesionSeleccionada ? profesionSeleccionada.nombre_profesion : "";
    }

    obtenerDatosEmpleador(datosUsuarioResponse: any) {
        datosUsuarioResponse.empleadores.forEach((empleador: any) => {
            let empleadorGuardar = empleador;
            empleadorGuardar.expandible = false;
            empleadorGuardar.ultima_cotizacion = empleadorGuardar.ultima_cotizacion === "" ? this.CONSTANTES.SIN_FECHA_ULTIMA_COTIZACION : empleador.ultima_cotizacion 
            this.datosEmpleador.push(empleadorGuardar);
        });

        if(this.datosEmpleador.length > 0) {
            let elementoInicial = this.datosEmpleador[0];
            elementoInicial.expandible = true;
        }
    }

}
