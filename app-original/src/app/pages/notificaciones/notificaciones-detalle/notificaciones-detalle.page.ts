import {Component, OnInit} from '@angular/core';
import {UtilService} from "../../../services/util/util.service";
import {ActivatedRoute} from "@angular/router";
import {ContextoAPP} from "../../../util/contexto-app";
import {ParametroTraza} from "../../../util/parametroTraza";
import {CONSTANTES_TRAZA_GENERAL, TRAZAS_NOTIFICACIONES,CONSTANTES_TRAZAS_NOTIFICACIONES} from "../../../pages/notificaciones/util/constantes.notificaciones";
import {NavController} from "@ionic/angular";
import {TrazabilidadService} from '../../../services/api/restful/trazabilidad.service';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-notificaciones-detalle',
    templateUrl: './notificaciones-detalle.page.html',
    styleUrls: ['./notificaciones-detalle.page.scss'],
})
export class NotificacionesDetallePage implements OnInit {

    // Referencia a constantes para trazas solo para módulo planes.
    readonly CONSTANTES_TRAZA = TRAZAS_NOTIFICACIONES;
    // Referencia a constantes generales para trazas
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;
    //Objeto de notificacion vacio, se carga con data enviada desde home
    notificacion = {
        id: 0,
        fechaEnvio: '',
        titulo: '',
        mensaje: '',
        link: ''
    };

    constructor(
        private readonly navCtrl: NavController,
        private readonly utilService: UtilService,
        private readonly route: ActivatedRoute,
        private readonly contextoApp: ContextoAPP,
        private readonly trazabilidadService: TrazabilidadService
    ) {
    }

    ngOnInit() {
        /**
         * Se recibe la data de la notificación desde parametros
         */
        try{
            this.route.queryParams.subscribe(async params => {
                const loading = await this.contextoApp.mostrarLoading();
                this.notificacion = JSON.parse(params.notificacion);
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_NOTIFICACIONES.DETALLE.VER_DETALLE_NOTIFICACION_EXITO.CODIGO_OPERACION)
                this.contextoApp.ocultarLoading(loading);
            });
        }catch (e) {
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_NOTIFICACIONES.DETALLE.VER_DETALLE_NOTIFICACION_ERROR.CODIGO_OPERACION)
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.home));
        }

    }

    /**
     * Redireccion a enlace web con link de notificación
     * @param link
     */
    abrirLink(link) {
        this.utilService.openWithSystemBrowser(link);
    }

    /**
    * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    */
     async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_NOTIFICACIONES,
            uuid : await this.utilService.getStorageUuid(),
            rut: this.contextoApp.datosCliente.rut,
            dv: this.contextoApp.datosCliente.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_NOTIFICACIONES.DETALLE.VER_DETALLE_NOTIFICACION_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_NOTIFICACIONES.DETALLE.VER_DETALLE_NOTIFICACION_EXITO);
              break;
            case CONSTANTES_TRAZAS_NOTIFICACIONES.DETALLE.VER_DETALLE_NOTIFICACION_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_NOTIFICACIONES.DETALLE.VER_DETALLE_NOTIFICACION_ERROR);
              break;
          }

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoApp.datosCliente.rut, this.contextoApp.datosCliente.dv).subscribe();
    }
}
