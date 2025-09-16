import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndicadorService {
  private dominio: string = ENV.base_url;

  constructor(private readonly http: HttpClient) {}

  obtenerValorCuotaActual(): Observable<any> {
    const url = `${this.dominio}/api/v1/indicador/valor-cuota`;
    return this.http.get(url);
  }

  obtenerIndicadoresEconomicos(): Observable<any> {
    const url = `${this.dominio}/api/v1/indicador/tipo-moneda/fecha`;
    return this.http.get(url);
  }

  obtenerRentabilidad(): Observable<any> {
    const url = `${this.dominio}/api/v1/parametros/fondos?per_page=1&orderby=id&order=desc`;
    return this.http.get(url);
  }
}
