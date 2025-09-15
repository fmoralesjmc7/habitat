import { Component, OnInit } from '@angular/core'; 
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { CONSTANTES_CERTIFICADOS, TRAZAS_CARTOLAS, CONSTANTES_TRAZAS_CERTIFICADOS } from '../util/constantes.certificados'; 
import { CONSTANTES_TRAZA_GENERAL } from '../../planes-de-ahorro/util/constantes.planes'; 
import { UtilService, ClienteDatos, TrazabilidadService } from 'src/app/services'; 
import { ParametroTraza } from 'src/app/util/parametroTraza'; 
import { AppComponent } from '../../../app.component';

@Component({
    selector: 'app-certificado-generado',
    templateUrl: './certificado-generado.page.html',
    styleUrls: ['./certificado-generado.page.scss'],
})
export class CertificadoGeneradoPage implements OnInit {

    readonly CONSTANTES = CONSTANTES_CERTIFICADOS;
    readonly CONSTANTES_TRAZA = TRAZAS_CARTOLAS;
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;
    pdfBytesArray: string;
    pdfFolio: string;
    codigoTipoCertificado: string;
    showPdf: boolean = false;
    showFormEmail: boolean = false;
    rut: number;
    dv: string;
    email: string;
    desde: string;
    uuid: string;
    loading: any;

    constructor(
        private navCtrl: NavController,
        private utilService: UtilService,
        private route: ActivatedRoute,
        private contextoAPP: ContextoAPP,
        private clienteDatos: ClienteDatos,
        private trazabilidadService: TrazabilidadService
    ) {
    }

    async ngOnInit() {
        this.loading = await this.contextoAPP.mostrarLoading();
        this.clienteDatos.rut.subscribe(rut => {
            this.rut = rut;
        });
        this.clienteDatos.dv.subscribe(dv => {
            this.dv = dv;
        });
        this.clienteDatos.email.subscribe(email => {
            this.email = email;
        });

        this.route.queryParams.subscribe(async params => {
            this.desde = params.tipo;
            this.pdfBytesArray = AppComponent.descargaPDF;

            if (this.desde === this.CONSTANTES.ES_CERTIFICADOS) {
                let folio = params.folio;
                this.codigoTipoCertificado = params.codigoTipoCertificado;
                this.pdfFolio = JSON.parse(folio);
            }

            /**
             * Si el usuario tiene email, se muestra el campo correo
             */
            if (this.email) {
                this.showFormEmail = true;
            }
        });
    }

    isRendered(rendered: boolean) {
        if (rendered) this.contextoAPP.ocultarLoading(this.loading);
    }

    /**
     * Genera pdf con data desde servicios
     */
    async descargarPdf() {
        try {
            this.utilService.generarPdf(this.pdfBytesArray);
            if (this.desde === this.CONSTANTES.ES_CARTOLAS) {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_EXITO.CODIGO_OPERACION);
            }else if (this.desde === this.CONSTANTES.ES_CUATRIMESTRAL) {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_CUATRI_EXITO.CODIGO_OPERACION);
            }
        } catch (error) {
            if (this.desde === this.CONSTANTES.ES_CARTOLAS) {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_ERROR.CODIGO_OPERACION);
            }else if (this.desde === this.CONSTANTES.ES_CUATRIMESTRAL) {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_CUATRI_ERROR.CODIGO_OPERACION);
            }
        }
    }

    /**
     * Redireccion a home app
     */
    cancelar() {
        AppComponent.descargaPDF = '';
        this.navCtrl.navigateRoot('HomeClientePage');
    }

    /**
     * Encargado de registrar trazabilidad 
     * @param codigoOperacion
     */
    async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CERTIFICADOS,
            uuid : await this.utilService.getStorageUuid(),
            rut: this.rut,
            dv: this.dv,
        }
       
        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_EXITO);
              break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_CUATRI_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_CUATRI_EXITO);
              break;
              case CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_ERROR);
              break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_CUATRI_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.GENERADO.DESCARGA_CARTOLA_CUATRI_ERROR);
              break;
        }

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
    }

}
