import {Injectable} from '@angular/core';
import {forkJoin} from "rxjs";
import { PlanesService } from 'src/app/services'; 
import { CuentaPlanAhorro } from 'src/app/services/api/data/cliente.cuenta.planahorro';
import { CONSTANTES_PLANES_STEP_1 } from './constantes.planes'; 

@Injectable({
    providedIn: 'root'
})
export class ObtenerDataPlanesService {

    readonly CONSTANTES = CONSTANTES_PLANES_STEP_1;

    constructor(
        private planesService: PlanesService) {
    }

    /**
     * Funcion para obtener los empleadores de los planes asociados al usuario, debido a que cada tipo de plan
     * tiene una estructura diferente, para cada caso se deben realizar diferentes acciones, para cada tipo de plan
     * existe una promesa que finaliza cuando todas las llamadas se hallan realizado
     * @param rut
     * @param dv
     * @param respuestaSolicitudesApv
     * @param respuestaSolicitudesCav
     */
    traerEmpleadores(rut, dv, respuestaSolicitudesApv, respuestaSolicitudesCav, regimenes, fondos) {
        let contadorCuenta2 = 0; // Se utiliza como contador por cada cuenta de tipo Cuenta 2 que se agregue a la funcion, ese valor se guarda como id en el nuevo objeto
        let contadorAPV = 0; // Se utiliza como contador por cada cuenta de tipo APV que se agregue a la funcion, ese valor se guarda como id en el nuevo objeto
        let empleadores : any[] = []; //Arreglo de empleadores que seran enviados en return

        /**
         * Para solicitudes activas Cuenta 2, se obtienen los empleadores mediante una llamada a servicio
         * que retorna empleadores por cada uno de los elementos
         */
        const cargaDatosCavActiva = new Promise(async (resolve, reject) => {
            if (respuestaSolicitudesCav['solicitudes_activadas'].length == 0) {
                resolve(true);
            }
            for (let x = 0; x < respuestaSolicitudesCav['solicitudes_activadas'].length; x++) {
                let idMaeEmpleador = respuestaSolicitudesCav['solicitudes_activadas'][x].id_mae_empleador;
                let empleadorCAV: any = await this.obtenerEmpleadorCAVActivo(rut,dv,idMaeEmpleador);
                if(empleadorCAV == null) {
                    resolve(false);
                    break;
                } else {
                    respuestaSolicitudesCav['solicitudes_activadas'][x].rut_empleador = empleadorCAV.rut_empleador;
                    respuestaSolicitudesCav['solicitudes_activadas'][x].dv_empleador = empleadorCAV.dv_empleador;
                    contadorCuenta2++;
                    let nuevaSolicitud = this.armarObjetoSolicitud(contadorCuenta2, 'Activo', 'Cuenta 2', respuestaSolicitudesCav['solicitudes_activadas'][x], "Cuenta2 Activada", regimenes, fondos);

                    if (nuevaSolicitud.empleador.rut != undefined) {
                        let buscarEmpleador = empleadores.find((empleador: any) => (empleador.rut === nuevaSolicitud.empleador.rut.split("-", 1)[0] && empleador.cuenta == 'Cuenta 2'));
                        if (!buscarEmpleador) {
                            let rut = nuevaSolicitud.empleador.rut.split("-", 1)[0];
                            let dv = nuevaSolicitud.empleador.rut.split("-")[1];
                            empleadores.push({
                                rut: rut,
                                dv: dv,
                                cuenta: this.CONSTANTES.NOMBRE_CUENTA2,
                                estado: this.CONSTANTES.ESTADO_ACTIVA
                            })
                        }
                    }
                    resolve(true);
                }
            }
        });

        /**
         * Para solicitudes en subscripcion Cuenta 2, se obtienen los empleadores mediante una llamada a servicios
         * con el detalle de cada uno de los elementos
         */
        const cargaDatosCavSuscripcion = new Promise((resolve, reject) => {
            if (respuestaSolicitudesCav['solicitudes_suscripcion'].length > 0) {
                let detallesSolicitudes: any[] = [];
                for (let x = 0; x < respuestaSolicitudesCav['solicitudes_suscripcion'].length; x++) {
                    detallesSolicitudes.push(this.planesService.obtenerDetalleSolicitudCAV(rut, dv, respuestaSolicitudesCav['solicitudes_suscripcion'][x].id_mae_solicitud))
                }
                //Cuando finalizan las solicitudes se ejecuta la función forkJoin en donde se genera el arreglo empleadores
                forkJoin(detallesSolicitudes).subscribe(async results => {
                    let contadorRespuesta = 0;
                    results.forEach((resultado: any) => {
                        if (!resultado['error']) {
                            respuestaSolicitudesCav['solicitudes_suscripcion'][contadorRespuesta].detalles = resultado;
                            contadorCuenta2++;
                            let nuevaSolicitud = this.armarObjetoSolicitud(contadorCuenta2, 'En proceso de activación', 'Cuenta 2', respuestaSolicitudesCav['solicitudes_suscripcion'][contadorRespuesta], "Cuenta2 Suscripción", regimenes, fondos);
                            contadorRespuesta++;
                            if (nuevaSolicitud.empleador.rut != undefined) {
                                let buscarEmpleador = empleadores.find((empleador: any) => (empleador.rut === nuevaSolicitud.empleador.rut.split("-", 1)[0] && empleador.cuenta == 'Cuenta 2'));
                                if (!buscarEmpleador) {
                                    let rut = nuevaSolicitud.empleador.rut.split("-", 1)[0];
                                    let dv = nuevaSolicitud.empleador.rut.split("-")[1];
                                    empleadores.push({
                                        rut: rut,
                                        dv: dv,
                                        cuenta: this.CONSTANTES.NOMBRE_CUENTA2,
                                        estado: this.CONSTANTES.ESTADO_EN_PROCESO
                                    })
                                }
                            }
                        }
                    });
                    resolve(true);
                }, async (error) => {
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });

        /**
         * Para solicitudes Modificadas Cuenta 2, se obtienen los empleadores mediante una llamada a servicios
         * con el detalle de cada uno de los elementos
         */
        const cargaDatosApvModificada = new Promise((resolve, reject) => {
            if (respuestaSolicitudesCav['solicitudes_modificada'].length > 0) {
                let detallesSolicitudes: any[] = [];
                for (let x = 0; x < respuestaSolicitudesCav['solicitudes_modificada'].length; x++) {
                    detallesSolicitudes.push(this.planesService.obtenerDetalleSolicitudCAV(rut, dv, respuestaSolicitudesCav['solicitudes_modificada'][x].id_mae_solicitud))
                }

                //Cuando finalizan las solicitudes se ejecuta la función forkJoin en donde se genera el arreglo empleadores
                forkJoin(detallesSolicitudes).subscribe(async results => {
                    let contadorRespuesta = 0;
                    results.forEach((resultado: any) => {
                        if (!resultado['error']) {
                            respuestaSolicitudesCav['solicitudes_modificada'][contadorRespuesta].detalles = resultado;
                            contadorCuenta2++;
                            let nuevaSolicitud = this.armarObjetoSolicitud(contadorCuenta2, 'En proceso de activación', 'APV', respuestaSolicitudesCav['solicitudes_modificada'][contadorRespuesta], "APV Modificada", regimenes, fondos);
                            contadorRespuesta++;
                            if (nuevaSolicitud.empleador.rut != undefined) {
                                let buscarEmpleador = empleadores.find((empleador: any) => (empleador.rut === nuevaSolicitud.empleador.rut.split("-", 1)[0] && empleador.cuenta == 'Cuenta 2'));
                                if (!buscarEmpleador) {
                                    let rut = nuevaSolicitud.empleador.rut.split("-", 1)[0];
                                    let dv = nuevaSolicitud.empleador.rut.split("-")[1];
                                    empleadores.push({
                                        rut: rut,
                                        dv: dv,
                                        cuenta: this.CONSTANTES.NOMBRE_CUENTA2,
                                        estado: this.CONSTANTES.ESTADO_ACTIVA
                                    })

                                }
                            }
                        }
                    });
                    resolve(true);
                }, async (error) => {
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });

        /**
         * Para solicitudes Ingresadas APV, se obtienen los empleadores mediante una llamada a servicio
         * que retorna empleadores por cada uno de los elementos
         */
        const cargaDatosApvIngresada = new Promise((resolve, reject) => {
            if (respuestaSolicitudesApv['solicitudes_ingresadas'].length > 0) {
                for (let x = 0; x < respuestaSolicitudesApv['solicitudes_ingresadas'].length; x++) {
                    contadorAPV++;

                    let nuevaSolicitud = this.armarObjetoSolicitud(contadorAPV, 'En proceso de activación', 'APV', respuestaSolicitudesApv['solicitudes_ingresadas'][x], "APV Ingresada", regimenes, fondos);

                    if (nuevaSolicitud.empleador.rut != undefined) {
                        let buscarEmpleador = empleadores.find((empleador: any) => (empleador.rut === nuevaSolicitud.empleador.rut.split("-", 1)[0] && empleador.cuenta == 'Cuenta 2'));
                        if (!buscarEmpleador) {
                            let rut = nuevaSolicitud.empleador.rut.split("-", 1)[0];
                            let dv = nuevaSolicitud.empleador.rut.split("-")[1];
                            empleadores.push({
                                rut: rut,
                                dv: dv,
                                cuenta: this.CONSTANTES.NOMBRE_APV,
                                estado: this.CONSTANTES.ESTADO_EN_PROCESO
                            })
                        }
                    }
                }
                resolve(true);
            } else {
                resolve(true);
            }
        });

        /**
         * Para solicitudes Aprovadas APV, se obtienen los empleadores mediante una llamada a servicio
         * que retorna empleadores por cada uno de los elementos
         */
        const cargaDatosApvAprobada = new Promise((resolve, reject) => {
            if (respuestaSolicitudesApv['solicitudes_aprovadas'].length > 0) {
                for (let x = 0; x < respuestaSolicitudesApv['solicitudes_aprovadas'].length; x++) {
                    let nuevaSolicitud = this.armarObjetoSolicitud(contadorAPV, 'Activo', 'APV', respuestaSolicitudesApv['solicitudes_aprovadas'][x], "APV Aprobada", regimenes, fondos);
                    if (nuevaSolicitud.empleador.rut != undefined) {
                        let buscarEmpleador = empleadores.find((empleador: any) => (empleador.rut === nuevaSolicitud.empleador.rut.split("-", 1)[0] && empleador.cuenta == 'Cuenta 2'));
                        if (!buscarEmpleador) {
                            let rut = nuevaSolicitud.empleador.rut.split("-", 1)[0];
                            let dv = nuevaSolicitud.empleador.rut.split("-")[1];
                            empleadores.push({
                                rut: rut,
                                dv: dv,
                                cuenta: this.CONSTANTES.NOMBRE_APV,
                                estado: this.CONSTANTES.ESTADO_ACTIVA
                            })
                        }
                    }
                }
                resolve(true);
            } else {
                resolve(true);
            }
        });

        /**
         * Finalizadas todas las promesas se ejecuta el retorno con los empleadores encontrados
         */
        return Promise.all([cargaDatosCavActiva, cargaDatosCavSuscripcion, cargaDatosApvModificada, cargaDatosApvIngresada, cargaDatosApvAprobada]).then(function (retornos) {
            let buscarError = retornos.find((retorno: any) => retorno === false);
            if (buscarError === false) {
                return {
                    empleadores: empleadores,
                    error: true
                }
            } else {
                return {
                    empleadores: empleadores,
                    error: false
                }
            }
        });
    }


    /**
     * Se genera estrucutura de objeto Solicittud a partir de los datos recibidos por
     * servicios y el tipo de cuenta a crear, los valores para generar un objeto comun
     * para todos los tipos de cuenta, se obtienen de forma diferente por cada cuenta
     * @param id
     * @param nombre
     * @param tipo
     * @param objetoSolicitud
     * @param tipoCuenta
     */
    armarObjetoSolicitud(id, nombre, tipo, objetoSolicitud, tipoCuenta, regimenes, fondos) {
        let nuevaSolicitud = new CuentaPlanAhorro();
        nuevaSolicitud.id = id;
        nuevaSolicitud.nombre = nombre;
        nuevaSolicitud.tipo = tipo;
        nuevaSolicitud.tipo_moneda = this.obtenerTipoMoneda(tipoCuenta, objetoSolicitud);
        nuevaSolicitud.estado = objetoSolicitud.estado;
        nuevaSolicitud.indefinido = this.obtenerIndefinido(tipoCuenta, objetoSolicitud);
        nuevaSolicitud.ahorro = this.obtenerAhorro(tipoCuenta, objetoSolicitud);
        nuevaSolicitud = this.obtenerFechaYRegimen(tipoCuenta, objetoSolicitud, nuevaSolicitud, fondos, regimenes);
        nuevaSolicitud.empleador = this.obtenerEmpleador(tipoCuenta, objetoSolicitud);
        nuevaSolicitud.expandible = false;
        return nuevaSolicitud;
    }

    /**
     * Busca en arreglo de Fondos el id del fondo para la solicitud seleccionada
     * @param nombreFondo
     */
    obtenerIdFondo(nombreFondo, fondos) {
        nombreFondo = "Fondo " + nombreFondo;
        let buscarFondo = fondos.find((fondo: any) => fondo.nombre_tipo_fondo === nombreFondo);
        if (buscarFondo) {
            return String(buscarFondo.id_tipo_fondo);
        } else {
            return null;
        }
    }

    /**
     * Busca en arreglo de regimenes el id del regimen para la solicitud seleccionada
     * @param regimen
     */
    obtenerIdRegimen(regimen, regimenes) {
        let buscarRegimen = regimenes.find((fondo: any) => fondo.nombre_regimen === regimen);
        if (buscarRegimen) {
            return String(buscarRegimen.id_regimen);
        } else {
            return null;
        }
    }

    /**
     * Obtiene tipo de moneda segun tipo de cuenta
     * @param tipoCuenta
     * @param solicitud
     */
    obtenerTipoMoneda(tipoCuenta, solicitud) {
        let tipoMoneda;
        if (tipoCuenta === this.CONSTANTES.APV_MODIFICADA || tipoCuenta === this.CONSTANTES.APV_INGRESADA || tipoCuenta === this.CONSTANTES.APV_INGRESADA_ERROR || tipoCuenta === this.CONSTANTES.APV_APROBADA || tipoCuenta === this.CONSTANTES.APV_APROBADA_ERROR) {
            tipoMoneda = solicitud.id_tipo_valor;
        } else {
            tipoMoneda = solicitud.monto_solicitud ? this.CONSTANTES.MONEDA_PORCENTAJE : this.CONSTANTES.MONEDA_PESO;
        }
        return tipoMoneda;
    }

    /**
     * Obtiene si la solicitud tiene fecha indefinida o no segun tipo de cuenta
     * @param tipoCuenta
     * @param solicitud
     */
    obtenerIndefinido(tipoCuenta, solicitud) {
        let indefinido;
        if (tipoCuenta === this.CONSTANTES.CUENTA2_ACTIVADA) {
            indefinido = solicitud.indefinido == this.CONSTANTES.VERDADERO_CUENTA2_ACTIVA ? true : false;
        } else if (tipoCuenta === this.CONSTANTES.CUENTA2_SUSCRIPCION) {
            indefinido = solicitud.detalles.indefinido == this.CONSTANTES.VERDADERO_CUENTA2_SUSCRIPCION ? true : false;
        } else {
            indefinido = solicitud.indefinido == this.CONSTANTES.VERDADERO_CUENTA2_SUSCRIPCION ? true : false;
        }
        return indefinido;
    }


    /**
     * Obtiene ahorro segun tipo de cuenta
     * @param tipoCuenta
     * @param solicitud
     */
    obtenerAhorro(tipoCuenta, solicitud) {
        let ahorro;
        if (tipoCuenta === this.CONSTANTES.CUENTA2_SUSCRIPCION) {
            ahorro = solicitud.detalles.monto_solicitud ? solicitud.detalles.monto_solicitud : solicitud.detalles.porcentaje_solicitud;
        } else if (tipoCuenta === this.CONSTANTES.CUENTA2_ACTIVADA) {
            ahorro = solicitud.monto_solicitud ? solicitud.monto_solicitud : solicitud.porcentaje_solicitud;
        } else if (tipoCuenta === this.CONSTANTES.APV_APROBADA || this.CONSTANTES.APV_INGRESADA || tipoCuenta === this.CONSTANTES.APV_APROBADA_ERROR || tipoCuenta === this.CONSTANTES.APV_INGRESADA_ERROR) {
            ahorro = solicitud.monto_solicitud;
        } else {
            ahorro = solicitud.detalles.monto_solicitud;
        }
        return ahorro;
    }

    /**
     * Obtiene fechas y tipo de regimen segun tipo de Cuenta
     * @param tipoCuenta
     * @param solicitud
     * @param nuevaSolicitud
     * @param fondos
     * @param regimenes
     */
    obtenerFechaYRegimen(tipoCuenta, solicitud, nuevaSolicitud, fondos, regimenes) {
        if (tipoCuenta === this.CONSTANTES.CUENTA2_SUSCRIPCION || tipoCuenta === this.CONSTANTES.APV_MODIFICADA) {
            nuevaSolicitud.fechaInicio = solicitud.detalles.fecha_inicio;
            nuevaSolicitud.fechaTermino = solicitud.detalles.fecha_fin;
            nuevaSolicitud.fondoDestino = this.obtenerIdFondo(solicitud.detalles.fondo_destino, fondos);
            nuevaSolicitud.regimen = this.obtenerIdRegimen(solicitud.detalles.regimen, regimenes);
        } else {
            nuevaSolicitud.fechaInicio = solicitud.fecha_inicio;
            nuevaSolicitud.fechaTermino = solicitud.fecha_fin;
            nuevaSolicitud.fondoDestino = solicitud.id_fondo;
            nuevaSolicitud.regimen = solicitud.id_regimen;
        }
        return nuevaSolicitud;
    }

    /**
     * Obtiene empleadores segun tipo de Cuenta
     * @param tipoCuenta
     * @param solicitud
     */
    obtenerEmpleador(tipoCuenta, solicitud) {
        let empleador;
        if (tipoCuenta === this.CONSTANTES.CUENTA2_MODIFICADA || tipoCuenta === this.CONSTANTES.CUENTA2_ACTIVADA) {
            empleador = {
                rut: solicitud.rut_empleador + "-" + solicitud.dv_empleador
            };
        } else if (tipoCuenta === this.CONSTANTES.APV_APROBADA_ERROR || tipoCuenta === this.CONSTANTES.APV_INGRESADA_ERROR) {
            empleador = {
                rut: undefined
            };
        } else if (tipoCuenta === this.CONSTANTES.APV_APROBADA || tipoCuenta === this.CONSTANTES.APV_INGRESADA) {
            empleador = {
                rut: solicitud.rut_empleador + "-" + solicitud.dv_empleador
            };
        } else {
            empleador = {
                rut: solicitud.detalles.datos_empleador.rut_empleador + "-" + solicitud.detalles.datos_empleador.dv_empleador
            };
        }
        return empleador;
    }

      /**
     * Encargado de llamar servicio de periodo cartola mensual
     */
    async obtenerEmpleadorCAVActivo(rut,dv,idMaeEmpleador) {
        return new Promise((resolve, reject) => {
            this.planesService.obtenerEmpleadorCAVActiva(rut, dv, idMaeEmpleador).subscribe((empleador: any) => {
                resolve(empleador);
            }, (error) => {
                resolve(null);
            });
        });
    }
}
