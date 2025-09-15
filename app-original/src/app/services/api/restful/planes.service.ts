import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlanesService {
    /**
     * Variable con dominio para ambiente Kong.
     */
    private dominio: string = ENV.base_url;

    constructor(private http: HttpClient) {
    }


    /**
     * Llamada a servicios que obtiene tipos de monedas
     * @param producto
     * @param rut
     * @param dv
     */
    obtenerMoneda(producto: string, rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerTipoMoneda';
        const parametros = {
            "tipoProducto": producto
        };

        return this.http.post(url, JSON.stringify(parametros));
    }

    /**
     * LLamada a servicio que obtiene regímenes para el tipo de cuenta (producto) seleccionado
     * @param producto
     * @param rut
     * @param dv
     */
    obtenerRegimenes(producto: string, rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerRegimenes';
        const parametros = {
            "tipoProducto": producto
        };

        return this.http.post(url, JSON.stringify(parametros));
    }

    obtenerFondos(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerFondos';

        return this.http.get(url);
    }

    /**
     * LLamada a servicios que obtiene cargos que el usuario puede tener
     * @param rut
     * @param dv
     */
    obtenerCargos(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerCargos';
        return this.http.get(url);
    }

    /**
     * LLamada a servicios que obtiene limites de montos para validaciones
     * @param rut
     * @param dv
     */
    obtenerTopesImponibles(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerTopesImponibles';
        return this.http.get(url);
    }

    /**
     * LLamada a servicios que obtiene regiones disponibles
     * @param rut
     * @param dv
     */
    obtenerRegiones(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerRegiones';
        return this.http.get(url);
    }

    /**
     * LLamada a servicios que obtiene comunas disponibles
     * @param rut
     * @param dv
     */
    obtenerComunas(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerComunas';
        return this.http.get(url);
    }

    /**
     * LLamada a servicios que obtiene empleador almacenados en el sistema
     * @param rut
     * @param dv
     */
    obtenerEmpleadores(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerEmpleadores';
        return this.http.get(url);
    }

    /**
     * LLamada a servicios que obtiene empleador que contenga el rut ingresado
     * @param rut
     * @param dv
     * @param rutEmpleador
     */
    obtenerEmpleadoresPorRut(rut: number, dv: string, rutEmpleador: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerEmpleadorPorRut';
        const parametros = {
            "rut_empleador": rutEmpleador
        };
        return this.http.post(url, JSON.stringify(parametros));
    }

    /**
     * Llamada a servicio que envia solicitud de plan
     * @param rut
     * @param dv
     * @param solicitud
     */
    ejecutarSolicitud(rut: number, dv: string, solicitud: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/EjecutarSolicitud';
        const parametros = solicitud;
        return this.http.post(url, parametros);
    }

    /**
     * Servicio encargado de enviar correo al finalizar la solicitud de planes
     * @param paramentrosGiro
     */
    enviarCorreoSolicitud(parametrosCorreo){
        const url: string = this.dominio + '/api/v1/clientes/' + parametrosCorreo.rut + '-' + parametrosCorreo.dv + '/mail/tipo/get';
        let parametros = {
            "sendComprobanteTransaccion": {
                "anexos": {
                    "archivo": parametrosCorreo.archivo,
                    "nombre": parametrosCorreo.nombreArchivo
                },
                "digito": parametrosCorreo.dv,
                "fechaHora": parametrosCorreo.fecha,
                "firma": {
                    "cargoPersona": "AFP Habitat",
                    "nombrePersona": "Servicio al Cliente"
                },
                "keyFrom": "serviciosinternet@afphabitat.cl",
                "nombreCompleto": parametrosCorreo.nombreCompleto,
                "numeroSolicitud": parametrosCorreo.numeroSolicitud,
                "rut": parametrosCorreo.rut,
                "textoLibre": parametrosCorreo.textoLibre,
                "tipoOperacion": parametrosCorreo.tipoOperacion,
                "titulo": parametrosCorreo.titulo,
                "to": parametrosCorreo.correoEnviar, //usar "certdevhabitat@gmail.com" para pruebas
            }
        };
        return this.http.post(url, JSON.stringify(parametros));
    }


    /**
     * Retorna solicitudes APV para rut de usuario
     * @param rut
     * @param dv
     */
    obtenerSolicitudesAPV(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerSolicitudesAPV';
        return this.http.get(url);
    }

    /**
     * Retorna solicitudes CAV para rut de usuario
     * @param rut
     * @param dv
     */
    obtenerSolicitudesCAV(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerSolicitudesCAV';
        return this.http.get(url);
    }


    /**
     * Encargado de obtener detalle solicitud cav
     * @param rut 
     * @param dv 
     * @param idMae 
     */
    obtenerDetalleSolicitudCAV(rut: number, dv: string, idMae: number): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerDetalleSolicitudCAV';
        let parametros = {
            "id_mae_solicitud": idMae

        };
        return this.http.post(url, JSON.stringify(parametros));
    }

      /**
     * LLamada a servicios que obtiene rut & dv empleador cav activa.
     * @param rut
     * @param dv
     * @param rutEmpleador
     */
    obtenerEmpleadorCAVActiva(rut: number, dv: string, idMaeEmpleador: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerEmpleadorCAVActiva';
        const parametros = {
            "id_mae_empleador": idMaeEmpleador
        };
        return this.http.post(url, JSON.stringify(parametros));
    }
}
