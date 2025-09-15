import { Component, OnInit } from '@angular/core';
import { UtilService, ClienteDatos } from '../../../services';
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { ContextoAPP } from '../../../util/contexto-app';
import { CONSTANTES_LIQUIDACION } from '../util/constantes.liquidacion';
import { AppComponent } from "../../../app.component";

@Component({
    selector: 'app-liquidacion-generado',
    templateUrl: './liquidacion-generado.component.html',
    styleUrls: ['./liquidacion-generado.component.scss'],
})
export class LiquidacionGeneradoComponent implements OnInit {

    //Constantes Liquidacion de pensiones
    readonly CONSTANTES = CONSTANTES_LIQUIDACION;
    //Referencia para pdf en base64
    pdfBytesArray: string;
    //Referencia para mostrar texto email
    showFormEmail = false;
    // Referencia al rut
    rut: number;
    // Referencia al digito verificador.
    dv: string;
    //Referencia email
    email: string;
    //Numero de Liquidaciones disponibles
    totalLiquidaciones: number;

    constructor(
        private readonly navCtrl: NavController,
        private readonly utilService: UtilService,
        private readonly route: ActivatedRoute,
        private readonly contextoAPP: ContextoAPP,
        private readonly clienteDatos: ClienteDatos,
    ) {
    }

    async ngOnInit() {
        const loading = await this.contextoAPP.mostrarLoading();
        this.clienteDatos.email.subscribe(email => {
            this.email = email;
        });

        this.contextoAPP.ocultarLoading(loading);
        this.route.queryParams.subscribe(async params => {
            const loading = await this.contextoAPP.mostrarLoading();
            this.pdfBytesArray = AppComponent.descargaPDF;
            /**
             * Si el usuario tiene email, se muestra el campo correo
             */
            if (this.email) {
                this.showFormEmail = true;
            }
            this.totalLiquidaciones = parseInt(JSON.parse(params.liquidacionesDisponibles), 10);
            this.contextoAPP.ocultarLoading(loading);
        });
    }

    /**
     * Genera pdf para descarga
     */
    async descargarPdfBase64() {
        this.utilService.generarPdf(this.pdfBytesArray);
    }

    /**
     * Redireccion a home app
     */
    volverHome() {
        AppComponent.descargaPDF = '';
        this.navCtrl.navigateRoot('HomeClientePage');
    }
}
