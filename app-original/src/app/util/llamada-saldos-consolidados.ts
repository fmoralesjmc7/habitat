import { Injectable } from "@angular/core";
import { PrudentialService } from "../services/api/restful/prudential.service";
import { CONSTANTES_LISTA_PRODUCTOS, CONSTANTES_PRUDENTIAL } from "./producto.constantes";
import { DatosPrudential, DetalleSaldosConsolidadosResp } from "../interfaces/prudential";
import { PrudentialDatos } from "../services/api/data/prudential.datos";

@Injectable({
  providedIn: "root",
})
export class LlamadaSaldosConsolidados {

  constructor(private prudentialService: PrudentialService, private prudentialDatos: PrudentialDatos) {}

    /**
     * Funcion que obtiene y devuelve los datos iniciales de pruducto prudential
     */
    public obtenerDatosPrudential(): Promise<DatosPrudential> {
        return new Promise<any>(async (resolve, reject) => {
            const respuesta: DatosPrudential = {estadoConsolidacion: undefined, preferencia: undefined, productos: undefined, codigoProducto: undefined};
            try {

                respuesta.estadoConsolidacion = await this.obtenerEstadoConsolidacion();
                if (respuesta.estadoConsolidacion !== CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.ACEPTADO) {
                    resolve(respuesta);
                    return;
                }

                respuesta.preferencia = await this.obtenerPreferenciasSaldos();

                if (respuesta.preferencia) {
                    respuesta.productos = (await this.obtenerSaldosConsolidados()).detalleCuentas;
                }

                resolve(respuesta);
            
            } catch(error) {
                resolve(respuesta);
            }
        });
    }

    public validarClientePrudential(): Promise<DatosPrudential> {
        return new Promise<any>(async (resolve, reject) => {
            const respuesta: DatosPrudential = {estadoConsolidacion: undefined};
            try {
                respuesta.estadoConsolidacion = await this.obtenerEstadoConsolidacion();
                resolve(respuesta);
            } catch (error) {
                reject();
            }
        });
    }

   /**
   * Metodo encargado de registrar los datos de prudential del cliente logeado
   * 
   * @param datos del de producto prudential del cliente
   */
    registrarDatosPrudential(prudential: DatosPrudential): void {
        if (prudential?.estadoConsolidacion) {
            this.prudentialDatos.setEstadoConsolidacion(prudential.estadoConsolidacion);
            this.prudentialDatos.setPreferenciaVerSaldos(prudential.preferencia);
            const producto = this.prudentialDatos.obtenerProductoPrudential(prudential.productos, CONSTANTES_LISTA_PRODUCTOS.PRUDENTIAL); 
            this.prudentialDatos.setProductoPrudential(producto);
        }
    }

    /**
     * Funcion que devuelve una promesa con el estado del mandato prudential
     * @returns Estado del mandato prudential
     */
    private obtenerEstadoConsolidacion(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
        this.prudentialService.obtenerEstadoConsolidacion()
            .subscribe((response) => {
            resolve(response.body.O_ESTADO);
            }, (error) => {
                reject();
            });
        });
    }

    /**
     * Funcion que devuelve una promesa con la preferencia de visualizar saldos
     * @return flag con la preferencia
     */
    private obtenerPreferenciasSaldos(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        this.prudentialService.obtenerPreferenciasSaldos().subscribe((response) => {
            resolve(response.flag);
            }, (error) => {
                reject();
            });
        });
    }

    /**
     * Funcion que devuelve una promesa con los saldos del producto prudential
     * @returns Lista con detalle de producto prudential
     */
    private obtenerSaldosConsolidados(): Promise<DetalleSaldosConsolidadosResp> {
        return new Promise<DetalleSaldosConsolidadosResp>((resolve, reject) => {
            this.prudentialService.obtenerSaldosConsolidados().subscribe((response) => {
                resolve(response);
            }, (error) => {
                reject();
            });
        });
    }
}
