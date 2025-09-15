import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SucursalService {

    /**
     * Variable con dominio para ambiente Kong.
     */
    private dominio: string = ENV.base_url;

    constructor(private http: HttpClient) {
    }

    /**
     * Servicio encargado de obtener los datos de las sucursales en regiones.
     */
    obtenerSucursales(): Observable<any> {
        const url = this.dominio + '/api/v1/parametros/sucursales?per_page=100';
        return this.http.get(url);
    }

    /**
     * Servicio encargado de obtener los servicios disponibles en las sucursales de Habitat.
     */
    obtenerServicios(): Observable<any> {
        const url = this.dominio + '/api/v1/parametros/servicios?per_page=100';
        return this.http.get(url);
    }
}
