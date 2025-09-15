import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrazabilidadService {

    /**
     * Variable con dominio para ambiente Kong.
     */
    private dominio: string = ENV.base_url;

    constructor(private http: HttpClient) {
    }

    /**
     * Servicio encargado de registrar trazabilidad con UUID.
     * Esta se visualiza en data warehouse.
     * @param parametros {any}
     * @param rut {number}
     * @param dv {string}
     */
    registraTrazaUUID(parametros: any, rut: number, dv: string): Observable<any> {
        const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/uuidtraza';
        return this.http.post(url, JSON.stringify(parametros));
    }

    /**
     * Servicio encargado de registrar trazabilidad Habitat.
     * Esta se visualiza en data warehouse
     * @param parametros {any}
     * @param rut {number}
     * @param dv {string}
     */
    registraTraza(parametros: any, rut: number, dv: string): Observable<any> {
        const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/traza';
        return this.http.post(url, JSON.stringify(parametros));
    }
}