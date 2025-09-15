import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '../../../../../../src/environments/environment';
import { TokenTocResponse, ValidacionTokenResponse } from '../../data/clave-unica/clave-unica.response';

@Injectable({
  providedIn: 'root'
})
export class ClaveUnicaService {
  /**
   * Variable con dominio para ambiente Kong.
   */
  private readonly dominio: string = ENV.base_url;

  constructor(private readonly http: HttpClient) {}

  /**
  * Metodo encargado de obtener token para despliegue de toc.
  * 
  * @param uuidTransaccion para token uaf
  * @param rutCliente que realizará la transaccion
  * @returns observable con response del servicio
  */
  obtenerTokenToc(uuidTransaccion: string, rutCliente: string): Observable<TokenTocResponse> {
      const url = `${this.dominio}/api/v1/clientes/${rutCliente}/ClaveUnica/toc/obtener`;
      
      const parametros = {
        "tokenUAF": uuidTransaccion
      };

      return this.http.post<TokenTocResponse>(url, JSON.stringify(parametros));
  }

  /**
  * Metodo encargado de validar la autentitación en toc
  * 
  * @param tokenUAF de la transaccion
  * @param rutCliente que realizará la transaccion
  * @returns observable con response del servicio
  */
  validarTokenUAF(tokenUAF: string, rutCliente: string): Observable<ValidacionTokenResponse> {
    const url = `${this.dominio}/api/v1/clientes/${rutCliente}/ClaveUnica/autenticacion/validar`;
    
    const parametros = {
      tokenUAF
    };

    return this.http.post<ValidacionTokenResponse>(url, JSON.stringify(parametros));
  }
}
