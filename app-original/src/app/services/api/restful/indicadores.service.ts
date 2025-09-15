import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IndicadorService {

    /**
     * Variable con dominio para ambiente Kong.
     */
    private dominio: string = ENV.base_url;

    constructor(private http: HttpClient) {
    }

    /**
     * metodo encargado de obtener valor cuota actual de Habitat.
     */
    obtenerValorCuotaActual(): Observable<any> {
        const url = this.dominio + '/api/v1/indicador/valor-cuota';
        return this.http.get(url);
    }

    /**
     * metodo encargado de obtener indicadores economicos como UTM, UF, Dolar y Euro
     */
    obtenerIndicadoresEconomicos(): Observable<any> {
        const url = this.dominio + '/api/v1/indicador/tipo-moneda/fecha';
        return this.http.get(url);
    }

    /**
     * Metodo encargado de obtener la rentabilidad de Habitat en 12 y 60 meses.
     */
    obtenerRentabilidad(): Observable<any> {
        const url = this.dominio + '/api/v1/parametros/fondos?per_page=1&orderby=id&order=desc';
        return this.http.get(url);
    }

}