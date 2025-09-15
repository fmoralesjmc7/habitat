import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '../../../../environments/environment';
import { CONSTANTES_ACTUALIZAR_DATOS } from 'src/app/pages/actualizar-datos/util/datos.constantes';

@Injectable({
  providedIn: 'root'
})
export class ActualizarDatosService {
  /**
    * Variable con dominio para ambiente Kong.
    */
  private dominio: string = ENV.base_url;
  // Referencia a constantes modulo 
  readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;

  constructor(private http: HttpClient) {
  }

  /**
   * Encargado de obtener datos usuario
   * 
   * @param rut 
   * @param dv 
   */
  obtenerDatosUsuario(rut: number, dv: string): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ObtenerDatosUsuario';
    return this.http.get(url);
  }

  /**
   * Encargado de obtener listado de nacionalidad ( paises )
   * 
   * @param rut 
   * @param dv 
   */
  obtenerNacionalidad(rut: number, dv: string): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ObtenerPaises';
    return this.http.get(url);
  }

  /**
   * Encargado de obtener listado de codigos de area
   * 
   * @param rut 
   * @param dv 
   */
  obtenerCodigosArea(rut: number, dv: string): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ObtenerCodigosArea';
    return this.http.get(url);
  }

  /**
   * Encargado de obtener listado de rangos renta
   * 
   * @param rut 
   * @param dv 
   */
  obtenerRangosRenta(rut: number, dv: string): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ObtenerRangosRenta';
    return this.http.get(url);
  }

  /**
   * Encargado de obtener listado de ciudades
   * 
   * @param rut 
   * @param dv 
   */
  obtenerCiudades(rut: number, dv: string): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ObtenerCiudades';
    return this.http.get(url);
  }

  /**
 * LLamada a servicios que obtiene cargos que el usuario puede tener
 * @param rut
 * @param dv
 */
  obtenerCargos(rut: number, dv: string): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/planesAhorro/ObtenerCargos';
    return this.http.get(url);
  }

 /**
 * LLamada a servicios que obtiene cargos que el usuario puede tener
 * @param rut
 * @param dv
 */
ObtenerProfesiones(rut: number, dv: string): Observable<any> {
  const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ObtenerProfesiones';
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
  solicitudCodigoDinamicoSMS(rut: number, dv: string, nombre: string, apellido: string, telefono: number): Observable<any> {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/giro/sms/solicitud';
    let parametros = {
      "SolicitaSMS": {
        "nombre": nombre,
        "apellido": apellido,
        "contacto": telefono,
        "aplicacion": this.CONSTANTES.SMS_APLICACION
      }
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  validarCodigoDinamicoSMS(rut: number, dv: string, codigoSMS: number) {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/giro/sms/validacion';
    let parametros = {
      "consultaCodigo": {
        "codigo": codigoSMS,
        "aplicacion": this.CONSTANTES.SMS_APLICACION
      }
    };

    return this.http.post(url, JSON.stringify(parametros));
  }

  enviarSolicitud(rut: number, dv: string, solicitud: any) {
    const url: string = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/ActualizacionDeDatos/ActualizarDatos';

    return this.http.post(url, JSON.stringify(solicitud));
  }

  /**
   * Servicio encargado de registrar trazabilidad con UUID.
   * Esta se visualiza en data warehouse.
   * @param parametros {any}
   * @param rut {number}
   * @param dv {string}
   */
  registraTrazaUUID(parametros: any, rut: number, dv: string): Observable<any> {
    const url = this.dominio + '/api/v1/clientes/' + rut + '-' + dv + '/uuidtraza';
    return this.http.post(url, JSON.stringify(parametros));
  }
}
