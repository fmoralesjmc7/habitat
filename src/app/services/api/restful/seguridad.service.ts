import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class  SeguridadService {
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

  private dominio: string = ENV.base_url;
  private _emitter: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {}

  signIn(rut: number, dv: string, clave: string): Observable<any> {
    const url = this.dominio + '/api/v1/seguridad/login';
    const parametros = { rut, digito: dv, clave };
    const httpOptions = { headers: new HttpHeaders() };
    return this.http.post(url, JSON.stringify(parametros), httpOptions)
      .pipe(tap((response: any) => { this._emitter.emit(response.token); }));
  }

  get emitter(): EventEmitter<string> { return this._emitter; }
}

