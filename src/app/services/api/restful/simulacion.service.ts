import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SimulacionService {
  private dominio: string = ENV.base_url;

  constructor(private readonly http: HttpClient) {}

  lightSinAPV(edad: number, sexo: string, rentaImponible: number, saldoObligatorio: number): Observable<any> {
    const url = `${this.dominio}/api/v1/simulacion/pension`;
    const parametros = {
      edad,
      sexo,
      rentaImponible,
      saldoObligatorio,
    };
    return this.http.post(url, JSON.stringify(parametros));
  }

  lightConAPV(edad: number, clienteId: any, ahorroPactado: number, sexo: string): Observable<any> {
    const url = `${this.dominio}/api/v1/simulacion/pension-apv`;
    const parametros = {
      edad,
      clienteId: parseInt(clienteId, 10),
      ahorroPactado,
      sexo,
    };
    return this.http.post(url, JSON.stringify(parametros));
  }
}
