import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CambioFondoService {

  /**
   * Variable con dominio para ambiente Kong.
  */
  private dominio: string = ENV.base_url;

  constructor(private http: HttpClient) {

  }

  /**
   * Servicio encargado de determinar si se muestra o no un aviso de rentabilidad al momento de solicitar un cambio o distribucion de fondos.
   * @param rut {number}
   * @param dv {string}
   */
  avisoDeRentabilidadCDF(rut: number, dv: string): Observable<any> {
      const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/cambio-fondo/rentabilidad/aviso';
      return this.http.get(url);
  }

  /**
   * Servicio encargado de determinar si se muestra o no un aviso de rentabilidad al momento de solicitar un cambio o distribucion de fondos.
   * @param rut {number}
   * @param dv {string}
   */
  isCuentaHabilitada(rut: number, dv: string, numeroCuenta:string, idFondo:string, nombreProducto:string): Observable<any> {
    const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/CDF/CuentaHabilitada';
    let parametros = {
      "numero_cuenta": numeroCuenta.toString(),
      "id_fondo": idFondo.toString(),
      "nombre_producto": nombreProducto,
      "rut": rut.toString(),
      "dv": dv
    };
    return this.http.post(url, JSON.stringify(parametros));
  }

  /**
   * Servicio encargado de ejecutar la solicitud de cambio o distribucion de fondos.
   * @param solicitudCDF {any}
   * @param rut {number}
   * @param dv {string}
   */
  solicitudCDF(solicitudCDF: any, rut: number, dv: string): Observable<any> {
    const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/CDF/solicitud';
    return this.http.post(url, JSON.stringify(solicitudCDF));
  }
}
