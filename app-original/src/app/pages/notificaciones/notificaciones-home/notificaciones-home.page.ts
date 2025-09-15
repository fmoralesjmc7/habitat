import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationExtras} from '@angular/router';
import {NavController} from '@ionic/angular';
import {NotificacionService} from '../../../services/api/restful/notificacion.service';
import {ContextoAPP} from '../../../util/contexto-app';
import {IonInfiniteScroll} from '@ionic/angular';
import {
    CONSTANTES_NOTIFICACIONES_HOME,
    TRAZAS_NOTIFICACIONES,
    CONSTANTES_TRAZA_GENERAL,
    CONSTANTES_TRAZAS_NOTIFICACIONES
} from '../../../pages/notificaciones/util/constantes.notificaciones';
import {ParametroTraza} from '../../../util/parametroTraza';
import {TrazabilidadService} from '../../../services/api/restful/trazabilidad.service';
import { UtilService } from 'src/app/services';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-notificaciones-home',
    templateUrl: './notificaciones-home.page.html',
    styleUrls: ['./notificaciones-home.page.scss'],
})
export class NotificacionesHomePage implements OnInit {

    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    // Referencia a constantes para notificaciones, utilizada directamente en la vista.
    readonly CONSTANTES = CONSTANTES_NOTIFICACIONES_HOME;
    // Referencia a constantes para trazas de notificaciones.
    readonly CONSTANTES_TRAZA = TRAZAS_NOTIFICACIONES;
    // Referencia a constantes generales para trazas
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;
    //Variable para almacenar rut
    rut: number;
    //Variable para almacenar dv
    dv: string;
    //Si existen o no notificaciones sin leeer
    notifSinLeer: boolean = false;
    //Si el usuario tiene notificaciones o no
    tieneNotificaciones: boolean = true;
    //Variable para saber si la notificación es del dia actual
    hoy = new Date();
    //Notificaciones dummy para pruebas visuales
    notificaciones: any[] = [];
    //Almacena notificaciones leídas guardadas en memoria
    notificacionesLeidas;
    //UUID para trazas del flujo
    uuid: string;

    constructor(
        private readonly navCtrl: NavController,
        private readonly utilService: UtilService,
        private readonly notificacionService: NotificacionService,
        private readonly contextoApp: ContextoAPP,
        private readonly trazabilidadService: TrazabilidadService,
    ) {}

    async ngOnInit() {
        this.uuid = this.utilService.generarUuid();
        this.rut = this.contextoApp.datosCliente.rut;
        this.dv = this.contextoApp.datosCliente.dv;
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.COD_NOTIFICACIONES_INICIO.CODIGO_OPERACION)

        await this.cargarNotificaciones(this.CONSTANTES.INGRESO_DESDE_INICIO);
    }

    /**
     * Se obtienen las notificaciones asociadas al usuario desde servicio
     */
    async cargarNotificaciones(desde) {

        let loading;
        if (desde === this.CONSTANTES.INGRESO_DESDE_INICIO) { //Si es carga inicial muestra loading
            loading = await this.contextoApp.mostrarLoading();
        }
        this.notificacionService.obtenerNotificaciones(this.rut, this.dv, this.CONSTANTES.NOTIFICACIONES_EN_SERVICIO).subscribe(async (respuestaNotificaciones: any) => {
            if (!respuestaNotificaciones || respuestaNotificaciones.length <= 0) {
                //Validacion en caso de que las notificaciones llegen vacias
                this.tieneNotificaciones = false;
                this.utilService.setStorageData(this.CONSTANTES.ESTADO_NO_LEIDAS_MEMORIA, 'false',false);
                if (desde === this.CONSTANTES.INGRESO_DESDE_INICIO) {
                    this.contextoApp.ocultarLoading(loading);
                }
            } else {
                //Se asigna la respuesta al arreglo de notificaciones
                this.notificaciones = respuestaNotificaciones;
                this.notificaciones = this.notificaciones.filter(obj => obj['mensaje']); //Se filtran las notificaciones que contengan mensaje
                await this.cambioEstadoNotificaciones();
                this.tieneNotificaciones = true;
                if (desde === this.CONSTANTES.INGRESO_DESDE_INICIO) {
                    this.contextoApp.ocultarLoading(loading);
                }
            }
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.SELECCION_LISTADO_NOTIFICACIONES_EXITO.CODIGO_OPERACION)
        }, async (error) => {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.SELECCION_LISTADO_NOTIFICACIONES_ERROR.CODIGO_OPERACION)

            if (desde === this.CONSTANTES.INGRESO_DESDE_INICIO) {
                this.contextoApp.ocultarLoading(loading);
            }
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.home));
        });
    }

    /**
     * Ingreso a detalle de notificación seleccionada, si es primera vez que se accede a esa
     * notificación, se debe agrega al arreglo de leidas y guardar en memoria
     * @param notificacion
     */
    verDetalle(notificacion) {
        notificacion.leido = true;
        let buscarNotificacion = null;
        if (this.notificacionesLeidas && this.notificacionesLeidas.length > 0) {
            buscarNotificacion = this.notificacionesLeidas.find((notif: any) => (notificacion.id === notif.id));
        }

        if (!buscarNotificacion) {
            this.notificacionesLeidas.push({id: notificacion.id})
            this.utilService.setStorageData(this.CONSTANTES.NOMBRE_NOTIFICACIONES_MEMORIA, JSON.stringify(this.notificacionesLeidas),false);
        }

        /**
         * Si el usuario tiene notificaciones sin leer, se cambia el estado. Luego se guarda en memoria
         */
        let notificacionNoLeida = this.notificaciones.find((notif: any) => (notif.leido == false));
        if (notificacionNoLeida) {
            this.notifSinLeer = true;
        } else {
            this.notifSinLeer = false;
        }
        this.utilService.setStorageData(this.CONSTANTES.ESTADO_NO_LEIDAS_MEMORIA, JSON.stringify(this.notifSinLeer),false);

        /**
         * Despues de actualizar memoria, se accede al detalle y se envía la data por parametros
         */
        const navigationExtras: NavigationExtras = {
            queryParams: {
                notificacion: JSON.stringify(notificacion)
            }
        };
        this.navCtrl.navigateForward(['notificaciones-detalle'], navigationExtras);
    }

    /**
     * Redireccion a home app
     */
    volverAlHome() {
        this.navCtrl.navigateRoot('HomeClientePage');
    }

    /**
     * Se ejecuta cuando se utiliza la carga mediante scroll
     * @param infiniteScroll
     */
    async cargaSiguientePagina(infiniteScroll) {
        await this.cargarNotificaciones(this.CONSTANTES.INGRESO_DESDE_REFRESH);

        setTimeout(() => {
            //Se agrega un segundo adicional de loading para que se pueda visualizar
            infiniteScroll.target.complete();
        }, 1000);
    }

    /**
     * Se actualizan estados y fechas en arreglo de notificaciones
     */
    cambioEstadoNotificaciones() {
        /**
         * Se cambia el formato de fecha a tipo Date y se deja en no leido (Estado por defecto) por cada elemento
         */
        this.notificaciones.forEach((not: any) => {
            not.fechaEnvio = new Date(not.fechaEnvio);
            not.leido = false;
        });

        /**
         * Buscamos en memoria si existen notificaciones leidas, en caso de existir,
         * se busca esa notificacion en el arreglo a mostrar y se cambia el valor a leida
         */
        this.notificacionesLeidas = [];
        this.utilService.getStorageData(this.CONSTANTES.NOMBRE_NOTIFICACIONES_MEMORIA,false).then((notificacionesLeidas) => {
            if (notificacionesLeidas && notificacionesLeidas.trim() !== '') {
                this.notificacionesLeidas = JSON.parse(notificacionesLeidas);
            } else {
                this.notificacionesLeidas = [];
            }

            if (this.notificacionesLeidas && this.notificacionesLeidas.length > 0) {
                this.notificaciones.forEach((notificacion: any) => {
                    let buscarNotificacion = this.notificacionesLeidas.find((notif: any) => (notificacion.id === notif.id));
                    if (buscarNotificacion) {
                        notificacion.leido = true;
                    }
                });

                /**
                 * Si el usuario tiene notificaciones sin leer se cambia el estado, luego se guarda en memoria
                 */
                let notificacionNoLeida = this.notificaciones.find((notif: any) => (notif.leido == false));
                if (notificacionNoLeida) {
                    this.notifSinLeer = true;
                } else {
                    this.notifSinLeer = false;
                }
                this.utilService.setStorageData(this.CONSTANTES.ESTADO_NO_LEIDAS_MEMORIA, JSON.stringify(this.notifSinLeer),false);
            } else {
                this.notificacionesLeidas = [];
            }
        });
    }

    /**
    * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    */
    async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_NOTIFICACIONES,
            uuid : this.uuid,
            rut: this.contextoApp.datosCliente.rut,
            dv: this.contextoApp.datosCliente.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.COD_NOTIFICACIONES_INICIO.CODIGO_OPERACION:
              parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.COD_NOTIFICACIONES_INICIO);
              break;
            case CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.SELECCION_LISTADO_NOTIFICACIONES_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.SELECCION_LISTADO_NOTIFICACIONES_EXITO);
              break;
            case CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.SELECCION_LISTADO_NOTIFICACIONES_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_NOTIFICACIONES.HOME.SELECCION_LISTADO_NOTIFICACIONES_ERROR);
              break;
          }

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoApp.datosCliente.rut, this.contextoApp.datosCliente.dv).subscribe();
    }
}
