import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import { ParametrosCorreoGiro } from 'src/app/pages/giro-de-ahorro/util/parametros.correo';
import { ParametrosComisionGiro } from 'src/app/pages/giro-de-ahorro/util/parametros.comision';
import { SolicitudGiro } from 'src/app/pages/giro-de-ahorro/util/solicitud.giro';
import { CONSTANTES_GIRO_STEP_1 } from 'src/app/pages/giro-de-ahorro/util/constantes.giro';
import {
  RequestValidacionCuenta,
  ResponseValidacionCuenta,
} from 'src/app/pages/giro-de-ahorro/util/validacion-cuenta';

@Injectable({
  providedIn: 'root',
})
export class GiroService {
  /**
   * Variable con dominio para ambiente Kong.
   */
  private dominio: string = ENV.base_url;

  constructor(private http: HttpClient) {}

  /**
   * API encargada de validar si el cliente tiene habilitada un producto para realizar giros.
   *
   * @param producto solo acepta 'Cuenta2' o 'APV' como parametro.
   * @param rut
   * @param dv
   */
  validarGiro(producto: string, rut: number, dv: string): Observable<any> {
    const url: string =
      this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/giro/validacion';
    const parametros = {
      validarGiro: {
        producto: producto,
      },
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  obtenerListaTipoDeCuentas(rut: number, dv: string): Observable<any> {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/giro/tipo-cuentas';
    return this.http.get(url);
  }

  /**
   * Servicio que retorna listado general de bancos.
   * @param rut
   * @param dv
   */
  obtenerListaBancos(rut: number, dv: string): Observable<any> {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/giro/lista-bancos';
    return this.http.get(url);
  }

  /**
   * Servicio que retorna listado de bancos registrados a un usuario especifico.
   * @param rut
   * @param dv
   */
  obtenerBancosRegistrados(rut: number, dv: string) {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/giro/bancos-registrados';
    return this.http.get(url);
  }

  /**
   * Servicio encargado de generar un codigo dinamico que se envia por SMS.
   *
   * @param rut
   * @param dv
   * @param nombre
   * @param apellido
   * @param telefono debe estar en formato '56936807698'.
   * @param producto los unicoas valores que acepta son 'APV' o 'Cuenta2'.
   */
  solicitudCodigoDinamicoSMS(
    rut: number,
    dv: string,
    nombre: string,
    apellido: string,
    telefono: number,
    producto: string
  ): Observable<any> {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/giro/sms/solicitud';
    let parametros = {
      SolicitaSMS: {
        nombre: nombre,
        apellido: apellido,
        contacto: telefono,
        producto: producto,
        aplicacion: this.obtenerCodigoAplicacion(producto),
      },
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  validarCodigoDinamicoSMS(
    rut: number,
    dv: string,
    producto: string,
    codigoSMS: number
  ) {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      rut +
      '-' +
      dv +
      '/giro/sms/validacion';
    let parametros = {
      consultaCodigo: {
        producto: producto,
        codigo: codigoSMS,
        aplicacion: this.obtenerCodigoAplicacion(producto),
      },
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  realizarSolicitud(solicitudGiro: SolicitudGiro): Observable<any> {
    const urlCAV: string =
      this.dominio +
      '/api/v2/clientes/' +
      solicitudGiro.rut +
      '-' +
      solicitudGiro.dv +
      '/giro/solicitud';
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      solicitudGiro.rut +
      '-' +
      solicitudGiro.dv +
      '/giro/solicitud';
    const urlGiro =
      solicitudGiro.IdTipoProducto ==
      CONSTANTES_GIRO_STEP_1.ID_PRODUCTO_CUENTA_2.toString()
        ? urlCAV
        : url; // en el caso de giro covid , apuntamos a servicio giro covid  Esto se debe eliminar una vez se utilice solo la version 2 del servicio
    const parametros = {
      SolicitudGiro: {
        NroCtaCte: solicitudGiro.NroCtaCte,
        regimenesProducto: solicitudGiro.regimenesProducto,
        IdTipoCuenta: solicitudGiro.IdTipoCuenta,
        IdEntidadBanco: solicitudGiro.IdEntidadBanco,
        IdTipoProducto: solicitudGiro.IdTipoProducto,
        token: solicitudGiro.token,
      },
    };

    return this.http.post(urlGiro, parametros);
  }

  /**
   * Servicio encargado de obtener comision giro
   * @param paramentrosGiro
   */
  obtenerComisionGiro(paramentrosGiro: ParametrosComisionGiro) {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      paramentrosGiro.rut +
      '-' +
      paramentrosGiro.dv +
      '/giro/buscar-comision';
    let parametros = {
      FechaRetiro: paramentrosGiro.fechaRetiro,
      IdEntidadMulti: paramentrosGiro.idEntidadMulti,
      IdMaeCuenta: paramentrosGiro.idMaeCuenta,
      IdTipRegTribu: paramentrosGiro.idTipRegTribu,
      IdTipoFondo: paramentrosGiro.idTipoFondo,
      IdTipoProducto: paramentrosGiro.idTipoProducto,
      MontoRetiro: paramentrosGiro.montoRetiro,
      TipoProcesamiento: paramentrosGiro.tipoProcesamiento,
      User: paramentrosGiro.user,
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  /**
   * Servicio encargado de obtener comision giro
   * @param paramentrosGiro
   */
  enviarCorreoSolicitud(parametrosCorreo: ParametrosCorreoGiro) {
    const url: string =
      this.dominio +
      '/api/v1/clientes/' +
      parametrosCorreo.rut +
      '-' +
      parametrosCorreo.dv +
      '/mail/tipo/get';
    let parametros = {
      sendComprobanteTransaccion: {
        anexos: {
          archivo: parametrosCorreo.archivo,
          nombre: parametrosCorreo.nombreArchivo,
        },
        copia: parametrosCorreo.correoCopia,
        digito: parametrosCorreo.dv,
        fechaHora: parametrosCorreo.fecha,
        firma: {
          cargoPersona: 'AFP Habitat',
          nombrePersona: 'Servicio al Cliente',
        },
        keyFrom: 'serviciosinternet@afphabitat.cl',
        nombreCompleto: parametrosCorreo.nombreCompleto,
        numeroSolicitud: parametrosCorreo.numeroSolicitud,
        rut: parametrosCorreo.rut,
        textoLibre: parametrosCorreo.textoLibre,
        tipoOperacion: parametrosCorreo.tipoOperacion,
        titulo: parametrosCorreo.titulo,
        to: parametrosCorreo.correoEnviar,
      },
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  /**
   * Metodo encargado de entregar el codigo de aplicacion segun el producto que solicita el SMS.
   *
   * @param producto solo acepta codigo de producto 'APV' y 'Cuenta 2'.
   */
  private obtenerCodigoAplicacion(producto: string): string {
    let aplicacion: string = '';
    if (producto === 'APV') {
      aplicacion = 'estadoAction3';
    } else if (producto === 'Cuenta2' || producto === 'Cuenta 2') {
      aplicacion = 'estadoActionGiroCTA2';
    }
    return aplicacion;
  }

  /**
   *
   *
   * @param requestCuenta para realizar la validacion
   * @returns validacion de la cuenta
   */
  validarCuentaCliente(
    requestCuenta: RequestValidacionCuenta
  ): Observable<ResponseValidacionCuenta> {
    const url = `${this.dominio}/api/v1/clientes/giro/lista-negra/${requestCuenta.nrut_cuenta}`;

    return this.http.post<ResponseValidacionCuenta>(
      url,
      JSON.stringify(requestCuenta)
    );
  }
}
