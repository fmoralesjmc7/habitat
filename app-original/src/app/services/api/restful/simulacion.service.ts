import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SimulacionService {

    /**
     * Variable con dominio para ambiente Kong.
     */
    private dominio: string = ENV.base_url;

    constructor(private http: HttpClient) {
    }

    /**
     * Servicio encargado de realizar simulacion de pension para NO Clientes.
     * @param edad {number}
     * @param sexo {string}
     * @param rentaImponible {number}
     * @param saldoObligatorio {number}
     */
    lightSinAPV(edad: number, sexo: string, rentaImponible: number, saldoObligatorio: number): Observable<any> {
        const url = this.dominio + '/api/v1/simulacion/pension';
        const parametros = {
            'edad': edad,
            'sexo': sexo,
            'rentaImponible': rentaImponible,
            'saldoObligatorio': saldoObligatorio
        };
        return this.http.post(url, JSON.stringify(parametros));
    }

    /**
     * Servicio encargado de realizar simulacion de pension para NO Clientes con APV.
     * @param edad {number}
     * @param clienteId {any}
     * @param ahorroPactado {number}
     * @param sexo {string}
     */
    lightConAPV(edad: number, clienteId: any, ahorroPactado: number, sexo: string): Observable<any> {
        const url = this.dominio + '/api/v1/simulacion/pension-apv';
        const parametros = {
            'edad': edad,
            'clienteId': parseInt(clienteId),
            'ahorroPactado': ahorroPactado,
            'sexo': sexo
        };
        return this.http.post(url, JSON.stringify(parametros));
    }
}