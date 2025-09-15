import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import {
    CONSTANTES_PLANES_STEP_3, CONSTANTES_TRAZA_GENERAL,
    TRAZAS_PLANES, CONSTANTES_TRAZAS_PLAN
} from "src/app/pages/planes-de-ahorro/util/constantes.planes";
import {ActivatedRoute} from "@angular/router";
import { ParametroTraza } from 'src/app/util/parametroTraza'; 
import { UtilService, PlanesService, TrazabilidadService } from 'src/app/services';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-planes-step-tres',
    templateUrl: './planes-step-tres.page.html',
    styleUrls: ['./planes-step-tres.page.scss'],
})
export class PlanesStepTresPage implements OnInit {

    readonly CONSTANTES = CONSTANTES_PLANES_STEP_3;
    readonly CONSTANTES_TRAZA = TRAZAS_PLANES;
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;

    email: string;
    cuentaSeleccionada: number;
    pdfBytesArraySolicitud: string;
    
    /**
     * UUID utilizado en las trazas del flujo
     */
    uuid: string;

    constructor(
        private nav: NavController,
        private contextoAPP: ContextoAPP,
        private route: ActivatedRoute,
        private utilService: UtilService,
        private planesService: PlanesService,
        private trazabilidadService: TrazabilidadService
    ) {
    }

    async ngOnInit() {
        this.uuid = await this.utilService.getStorageUuid();

        this.email = this.contextoAPP.datosCliente.email;
        this.pdfBytesArraySolicitud = AppComponent.descargaPDF;
        this.route.queryParams.subscribe(async params => {
            const loading = await this.contextoAPP.mostrarLoading();
            let cuenta = params.cuenta;
            this.cuentaSeleccionada = JSON.parse(cuenta);
            this.contextoAPP.ocultarLoading(loading);
        });
    }

    /**
     * Metodo para volver al home del cliente.
     */
    volverAlHome() {
        AppComponent.descargaPDF = undefined!;
         this.nav.navigateRoot('HomeClientePage');
    }

    descargarPdf() {
        this.utilService.generarPdf(this.pdfBytesArraySolicitud);

        if(this.cuentaSeleccionada == this.CONSTANTES.ID_PRODUCTO_CUENTA_2){
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP3.COD_C2_STEP_3_DESCARGA.CODIGO_OPERACION)
        }else{
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_PLAN.STEP3.COD_APV_STEP_3_DESCARGA.CODIGO_OPERACION)
        }
    }

    /**
     * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
     * @param codigoOperacion
     */
     async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_PLAN,
            uuid : this.uuid,
            rut: this.contextoAPP.datosCliente.rut,
            dv: this.contextoAPP.datosCliente.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_PLAN.STEP3.COD_C2_STEP_3_DESCARGA.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP3.COD_C2_STEP_3_DESCARGA);
              break;
            case CONSTANTES_TRAZAS_PLAN.STEP3.COD_APV_STEP_3_DESCARGA.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_PLAN.STEP3.COD_APV_STEP_3_DESCARGA);
              break;
          }
        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
    }
}
