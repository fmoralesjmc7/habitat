import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  /**
   * Variable con dominio para ambiente Kong.
   */
  private dominio: string = ENV.base_url;

  /**
   * Token de sesion usuario.
   */
  private token: string = '';

  constructor(private http: HttpClient, service: SeguridadService) {
    service.emitter.subscribe((data: string) => { this.token = 'Bearer ' + data; });
  }

  /**
   * Servicio encargado de obtener los datos completos del cliente y sus productos asociados.
   * @param rut {number}
   * @param dv {string}
   */
  obtenerDatosCliente(rut: number, dv: string): Observable<any> {
    const url = this.dominio + '/api/v3/cliente/' + rut + '-' + dv;
    const httpHeaders = new HttpHeaders({ codigoAFP: '1005' });
    return this.http.get(url, { headers: httpHeaders });
  }

   /**
   * Servicio encargado de obtener los datos completos del cliente y sus productos asociados.
   * @param rut {number}
   * @param dv {string}
   */
  obtenerDatosClienteGiro(rut: number, dv: string): Observable<any> {

    const url = this.dominio + '/api/v4/cliente/' + rut + '-' + dv;
   const httpHeaders = new HttpHeaders({ codigoAFP: '1005' });
    return this.http.get(url, {});
  }

  /**
   * Servicio para IOS encargado de obtener diferentes certificados del cliente en formato pdf,
   * este retorna un Base64.
   * @param rut {number}
   * @param dv {string}
   * @param tipoCuenta {number}
   * @param codigoTipoCertificado {string}
   * @param fechaInicio {string}
   * @param fechaFin {string}
   */
  solicitarCertificadoIos(
    rut: number,
    dv: string,
    tipoCuenta: number,
    codigoTipoCertificado: string,
    fechaInicio: string,
    fechaFin: string,
    codigoCategoriaCertificado: string): Observable<any> {
    const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/certificado';
    const parametros = {
      'codigoCanal': 'WEB',
      'codigoCategoriaCertificado': codigoCategoriaCertificado,
      'codigoTipoCertificado': codigoTipoCertificado,
      'fechaInicio': fechaInicio,
      'fechaFin': fechaFin,
      'tipoCuenta': tipoCuenta.toString()
    };
    const httpHeaders = new HttpHeaders({
      codigoEntidad: '1005',
      codigoUsuario: 'APP',
      codigoSucursal: '97'
    });
    return this.http.post(url, JSON.stringify(parametros), { headers: httpHeaders });
  }

  /**
   * Servicio para android encargado de obtener diferentes certificados del cliente en formato pdf,
   * este retorna un Base64.
   *
   * @param rut {number}
   * @param dv {string}
   * @param tipoCuenta {number}
   * @param codigoTipoCertificado {string}
   * @param fechaInicio {string}
   * @param fechaFin {string}
   * @param codigoCategoriaCertificado {string}
   * @returns certificado base64
   */
  async solicitarCertificadoAndroid(
    rut: number,
    dv: string,
    tipoCuenta: number,
    codigoTipoCertificado: string,
    fechaInicio: string,
    fechaFin: string,
    codigoCategoriaCertificado: string
  ): Promise<any> {
    const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/certificado';
    const options = {
      'url': url,
      'method': 'POST',
      'data': `{"codigoCanal":"WEB","codigoCategoriaCertificado":"${codigoCategoriaCertificado}","codigoTipoCertificado":"${codigoTipoCertificado}","fechaInicio":"${fechaInicio}","fechaFin":"${fechaFin}","tipoCuenta":"${tipoCuenta}"}`,
      headers: {
        'codigoEntidad': '1005',
        'codigoUsuario': 'APP',
        'codigoSucursal': '97',
        Authorization: this.token,
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'text/plain'
      },
    };
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response;
  }

  /**
   * Servicio encargado de enviar por email el certificado solicitado por el cliente.
   * @param rut {number}
   * @param dv {string}
   * @param tipoCertificado {string}
   * @param folioCertificado {string}
   */
  enviarCertificadoPorEmail(rut: number, dv: string, tipoCertificado: string, folioCertificado: string): Observable<any> {
    const url = this.dominio + '/api/v1/clientes/certificados/' + rut + '-' + dv + '/folio/correo';
    const parametros = {
      'rutCliente': {
        'numero': rut,
        'digito': dv
      },
      'tipoCertificado': tipoCertificado,
      'folioCertificado': folioCertificado
    };
    const httpHeaders = new HttpHeaders({ 'codigoEntidad': '1005' });
    return this.http.post(url, JSON.stringify(parametros), { headers: httpHeaders });
  }

  /**
   * Servicio encargado de validar el estado de la clave previred para un cliente.
   * @param rut {number}
   * @param dv {string}
   * @param clave {string}
   * @param transaccion {string}
   */
  administrarClavePrevired(rut: number, dv: string, clave: string, transaccion: string): Observable<any> {
    const url = this.dominio + '/api/v1/cliente/' + rut + '-' + dv + '/previred';
    const parametros = {
      'trx_cod': transaccion,
      'clave': clave,
      'ip': '000.000.000.000'
    };
    const httpHeaders = new HttpHeaders({ 'codigoAFP': '1005', 'codigoUsuario': 'APP' });
    return this.http.post(url, JSON.stringify(parametros), { headers: httpHeaders });
  }
}
