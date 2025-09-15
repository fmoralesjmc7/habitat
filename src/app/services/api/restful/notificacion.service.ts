import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Notificacion } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  /**
   * Variable con dominio para ambiente Kong.
   */
  private dominio: string = ENV.base_url;

  constructor(private http: HttpClient) {}

  /**
   * Servicio encargado de registrar el dispositivo en sistema de contactabilidad.
   * @param os {string}
   * @param rut {string}
   * @param token {string}
   */
  registrarDispositivo(os: string, rut: string, token: string) {
    const url = this.dominio + '/api/dispositivos/registrar/' + rut;
    const parametros = {
      os: os,
      token: token,
    };
    return this.http.post(url, parametros);
  }

  obtenerNotificaciones(
    rut: number,
    dv: string,
    cantidad: number
  ): Observable<Notificacion[]> {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/notificaciones/historial?size=' +
      cantidad +
      '&page=&rutCliente=' +
      rut +
      '-' +
      dv +
      '&sort=id,desc';
    return this.http.get<Notificacion[]>(url);
  }
}
