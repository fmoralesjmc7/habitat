import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionesService {
  /**
   * Variable con dominio para ambiente Kong.
   */
  private readonly dominio: string = ENV.base_url;

  constructor(private readonly http: HttpClient) {}

  /**
  * Metodo encargado de oconsultar las liquidaciones disponibles.
  * @param fechaDesde {string}
  * @param fechaHasta {string}
  * @param rut que realizará la transaccion
  * @param dv que realizará la transaccion
  */
  consultarPeriodos(fechaDesde: string, fechaHasta: string, rut: number, dv: string): Observable<any> { 
    const url = `${this.dominio}/api/v1/clientes/${rut}-${dv}/CertificadoLiquidacionPension/ObtenerPeriodos`;
    const parametros = {
        "fechaDesde": fechaDesde,
        "fechaHasta": fechaHasta
    };
    return this.http.post(url, JSON.stringify(parametros));
  }
  /**
   * Servicio encargado de obtener las loquidaciones del cliente en formato pdf, este retorna un Base64.
   * @param rut {number}
   * @param dv {string}
   * @param fechaDesde {string}
   * @param fechaHasta {string}
  */
  solicitarLiquidacion(rut: number, dv: string, fechaDesde: string, fechaHasta: string): Observable<any> {
    const url: string = `${this.dominio}/api/v1/clientes/${rut}-${dv}/CertificadoLiquidacionPension/ObtenerPDF`;
    const parametros = {
      "fechaDesde" : fechaDesde,
      "fechaHasta" : fechaHasta,
      "folio": new Date().getTime()
    };

  return this.http.post(url, JSON.stringify(parametros));
  }
}
