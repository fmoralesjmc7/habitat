import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  /**
   * Arreglo que almacena el listado de URL que requieren token JWT de seguridad.
   */
  URIS_SEGURAS: RegExp[] = [
    /\/api\/v3\/cliente\/\d+-[\dkK]/,
    /\/api\/v3\/cliente\/\d+-[\dkK]\/.*/,

    /\/api\/v1\/cliente\/\d+-[\dkK]/,
    /\/api\/v1\/cliente\/\d+-[\dkK]\/.*/,
    /\/api\/v1\/clientes\/\d+-[\dkK]\/.*/,
    /\/api\/v2\/clientes\/\d+-[\dkK]\/.*/,
    /\/api\/v1\/clientes\/certificados\/\d+-[\dkK]\/.*/,
    /\/api\/v1\/deposito-directo\/parametro/,
    /\/api\/v1\/khipu\/credencial/,
    /\/api\/v1\/khipu\/crear-pago/,
    /\/api\/dispositivos\/registrar\/\d+-[\dkK]/,
    /\/api\/v1\/util\/merge-pdf/,
    /\/api\/v1\/clientes\/giro\/lista-negra\/\d+-[\dkK]/,
    /\/api\/v4\/cliente\/\d+-[\dkK]/,
    /\/api\/v3\/khipu\/obtener-bancos\/\d+-[\dkK]/,
    /\/api\/v3\/khipu\/crear-pago\/\d+-[\dkK]/,
  ];
  /**
   * Variable con dominio para ambiente Kong.
   */
  private dominio: string = ENV.base_url;
  /**
   * Variable encargada de almacenar JWT asociado a sesion del cliente en la App.
   */
  private _emitter: EventEmitter<string>;

  constructor(private http: HttpClient) {
    this._emitter = new EventEmitter();
  }

  /**
   * API RESTFul para validar ingreso del cliente en la aplicacion.
   * 
   * @param rut {number}
   * @param dv {string}
   * @param clave {number}
   */
  signIn(rut: number, dv: string, clave: string): Observable<any> {
    const url = this.dominio + '/api/v1/seguridad/login';
    const parametros = {
      'rut': rut,
      'digito': dv,
      'clave': clave
    };

    let httpHeaders = new HttpHeaders();
    let httpOptions = {
      headers: httpHeaders
    };
    return this.http.post(url, JSON.stringify(parametros), httpOptions)
        .pipe(
            tap((response: any) => {
              this.emitter.emit(response.token);
            })
    );
  }

  /**
   * Metodo encargado de entregar JWT asociado a sesion del cliente en la App.
   */
  public get emitter(): EventEmitter<string> {
    return this._emitter;
  }

  /**
   * Servicio encargado de obtener cual es la version actual en produccion para Android e iOS.
   */
  upgradeApplication(): Observable<any> {
    const url = this.dominio + '/api/v1/application/current-version?per_page=1&orderby=id&order=desc';
    return this.http.get(url);
  }
}