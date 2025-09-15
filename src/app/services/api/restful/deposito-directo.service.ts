import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import {
  BanksResponse,
  Deposito,
  PaymentsRequest,
  PaymentsResponse,
} from 'src/app/interfaces/khipu.interface';

@Injectable({
  providedIn: 'root',
})
export class DepositoDirectoService {
  /**
   * Variable con dominio para ambiente Kong.
   */
  private dominio: string = ENV.base_url;
  /**
   * Variable con dominio para ambiente aws.
   */
  private dominioAws: string = ENV.base_url_aws;

  constructor(private http: HttpClient) {}

  /**
   * Servicio que obtiene parametros como Origenes de fondos y lista de Paises.
   * @param parametroKey {string}
   */
  obtenerParametros(parametroKey: string): Observable<any> {
    const url = this.dominio + '/api/v1/deposito-directo/parametro';
    const parametros = {
      key: parametroKey,
    };
    return this.http.post(url, JSON.stringify(parametros));
  }

  /**
   * Servicio que obtiene los datos para origenes de fondos.
   */
  obtenerPropositos(): Observable<any> {
    const url =
      this.dominioAws +
      '/depositodirectoback/api2/v1/cuentas/deposito-directo/propositos';
    return this.http.get(url);
  }

  /**
   * Servicio que obtiene el valor mínimo a depositar
   */
  obtenerValorMinimo(): Observable<any> {
    const url =
      this.dominioAws +
      '/depositodirectoback/api2/v1/cuentas/deposito-directo/monto_minimo_deposito';
    return this.http.get(url);
  }

  /**
   * Servicio que obtiene key para llamada a bancos Khipu.
   * @param subject {string}
   * @param monto {number}
   * @param transaction_id {number}
   */
  obtenerKeyBanks(): Observable<any> {
    const url = this.dominio + '/api/v1/khipu/credencial';
    const parametros = {
      metodo: 'GET',
      url: 'https://khipu.com/api/2.0/banks',
    };
    return this.http.post(url, JSON.stringify(parametros));
  }

  obtenerPagoKhipu(
    subject: string,
    deposito: Deposito,
    transaction_id: number,
    name: string,
    rut: number,
    dv: string
  ): Observable<PaymentsResponse> {
    const url = this.dominio + `/api/v3/khipu/crear-pago/${rut}-${dv}`;

    const body: PaymentsRequest = {
      subject: subject,
      amount: deposito.montoSinFormato,
      currency: 'CLP',
      notify_api_version: '1.3',
      transaction_id: transaction_id.toString(),
      bank_id: deposito.medioPago,
      payer_name: name,
      payer_email: deposito.email,
    };
    return this.http.post<PaymentsResponse>(url, body);
  }

  /**
   * Servicio que crea la transaccion en khipu asociada a un cliente valido.
   * @param transaccion {any}
   * @param rut {number}
   * @param dv {string}
   */
  generarTransaccion(
    transaccion: any,
    rut: number,
    dv: string
  ): Observable<any> {
    const url =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/deposito-directo/transaccion';
    return this.http.post(url, JSON.stringify(transaccion));
  }

  /**
   * Servicio que crea la transaccion en khipu asociada a un cliente valido.
   * @param transaccion {any}
   */
  generarTransaccionNew(transaccion: any): Observable<any> {
    const url =
      this.dominioAws +
      '/depositodirectoback/api2/v1/cuentas/deposito-directo/confirmacion-app';
    return this.http.post<any>(url, transaccion);
  }

  /**
   * Servicio que obtiene una transaccion de pago khipu segun id y rut cliente.
   * @param idTransaccion {number}
   * @param rut {number}
   * @param dv {string}
   */
  obtenerTransaccion(
    idTransaccion: number,
    rut: number,
    dv: string
  ): Observable<any> {
    const url =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/deposito-directo/transaccion/' +
      idTransaccion;
    return this.http.get(url);
  }

  /**
   * Servicio utilizado para cambiar y actualizar el estado de la transaccion de pago asociada a khipu.
   * @param transaccion {any}
   * @param rut {number}
   * @param dv {string}
   */
  actualizarTransaccion(
    transaccion: any,
    rut: number,
    dv: string
  ): Observable<any> {
    const url =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/deposito-directo/transaccion';
    return this.http.put(url, JSON.stringify(transaccion));
  }

  /**
   * Servicio que obtiene el comprobante de pago, este es entregado Base64.
   * @param nroFolio {number}
   * @param rut {number}
   * @param dv {string}
   */
  obtenerComprobante(
    nroFolio: number,
    rut: number,
    dv: string
  ): Observable<any> {
    const url =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/deposito-directo/comprobante/' +
      nroFolio;
    return this.http.get(url);
  }

  /**
   * Servicio que obtiene la lista de bancos disponibles para realizar un pago mediante khipu.
   * @param rut {number}
   * @param dv {string}
   */
  obtenerListaBancos(key: any): Observable<any> {
    const url = this.dominio + '/api/v1/khipu/obtener-bancos';
    const parametros = {
      autorizacion: key,
    };
    return this.http.post(url, JSON.stringify(parametros));
  }

  /**
   * Servicio que obtiene la lista de bancos disponibles para realizar un pago mediante khipu.
   */
  obtenerBancos(rut: number, dv: string): Observable<BanksResponse> {
    const url = this.dominio + `/api/v3/khipu/obtener-bancos/${rut}-${dv}`;

    return this.http.get<BanksResponse>(url);
  }
}
