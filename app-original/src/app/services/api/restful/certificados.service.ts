import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CertificadosService {
    /**
     * Variable con dominio para ambiente Kong.
     */
    private dominio: string = ENV.base_url;

    constructor(private http: HttpClient) {
    }

    /**
     * Llamada para obtener periodos disponibles para seleccionar desde cartola
     * @param producto
     * @param rut
     * @param dv
     */
    obtenerPeriodosCartolas(rut: number, dv: string, anio: string, mes: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/cartolaMensual/ObtenerPeriodos';
        const parametros = {
            "anio_periodo": anio,
            "mes_periodo": mes
        };
        return this.http.post(url, JSON.stringify(parametros));
    }

    obtenerPeriodosCartolaCuatrimestral(rut: number, dv: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/cartolaCuatrimestral/ObtenerPeriodos';
        return this.http.get(url);
    }

    obtenerPDFCartolas(rut: number, dv: string, anio: string, mes: string): Observable<any> {
        const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/cartolaMensual/ObtenerPDF';
        const parametros = {
            "anio_cartola": anio,
            "mes_cartola": mes,
            "rut_cartola": String(rut)
        };
        return this.http.post(url, JSON.stringify(parametros));
    }

    /**
     * Obtienes pdf para cartola cuatrimestral
     * @param rut
     * @param dv
     * @param periodo
     * @param anio
     * @param tipo
     */
    obtenerPDFCartolaCuatrimestral(rut: number, dv: string, periodo: string, anio: string, tipo: string): Observable<any> {
        const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/cartolaCuatrimestral/ObtenerPDF';
        const parametros = {
                "periodo": periodo,
                "anio": anio,
                "rut": rut,
                "tipo": tipo

        };
        let httpHeaders = new HttpHeaders({ 'codigoEntidad': '1005' });
        return this.http.post(url, JSON.stringify(parametros));
    }


    /**
     * Servicio encargado de enviar correo al finalizar la solicitud de planes
     * @param paramentrosGiro
     */
    enviarCorreoSolicitud(parametrosCorreo){
        const url: string = this.dominio + '/api/v1/clientes/' + parametrosCorreo.rut + '-' + parametrosCorreo.dv + '/cartolaMensual/CorreoComprobante';
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
                "rut": parametrosCorreo.rut,
                "textoLibre": parametrosCorreo.textoLibre,
                "tipoOperacion": parametrosCorreo.tipoOperacion,
                "titulo": parametrosCorreo.titulo,
                "to": parametrosCorreo.correoEnviar, // usar "certdevhabitat@gmail.com" para pruebas
            }
        };
        return this.http.post(url, JSON.stringify(parametros));
    }
}
