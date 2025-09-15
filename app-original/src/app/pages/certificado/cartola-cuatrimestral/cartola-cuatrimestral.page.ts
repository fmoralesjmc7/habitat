import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras} from "@angular/router";
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import {NavController} from '@ionic/angular';
import { CertificadosService } from 'src/app/services/api/restful/certificados.service'; 
import { CONSTANTES_CERTIFICADOS, TRAZAS_CARTOLAS, CONSTANTES_TRAZAS_CERTIFICADOS } from '../util/constantes.certificados'; 
import { CONSTANTES_TRAZA_GENERAL } from '../../planes-de-ahorro/util/constantes.planes';
import { ParametroTraza } from 'src/app/util/parametroTraza'; 
import { ClienteService,ClienteCuentasDatos,UtilService,TrazabilidadService } from 'src/app/services'; 
import {AppComponent} from "../../../app.component";
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-cartola-cuatrimestral',
    templateUrl: './cartola-cuatrimestral.page.html',
    styleUrls: ['./cartola-cuatrimestral.page.scss'],
})
export class CartolaCuatrimestralPage implements OnInit {

    readonly CONSTANTES = CONSTANTES_CERTIFICADOS;
    readonly CONSTANTES_TRAZA = TRAZAS_CARTOLAS;
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;
    cartola = {};
    periodos: any[] = [];
    // Referencia al rut
    rut: number;
    // Referencia al digito verificador.
    dv: string;
    // Referencia al correo
    email: string;
    // Referencia al rut
    maeCliente: string;
    periodoSeleccionado = {};

    periodoOptions: any = {
        header: 'Período de Tiempo'
    };
    //Muestra u oculta modal afiliados
    mostrarModalAfiliados: boolean = false;

    constructor(
        private clienteService: ClienteService,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private contextoAPP: ContextoAPP,
        private certificadosService: CertificadosService,
        private clienteCuentasDatos: ClienteCuentasDatos,
        private utilService: UtilService,
        private trazabilidadService: TrazabilidadService
    ) {
    }

    async ngOnInit() {
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
        this.email = this.contextoAPP.datosCliente.email;
        this.maeCliente = this.contextoAPP.datosCliente.idMaePersona.toString();
        await this.obtenerPeriodo();
    }

    /**
     * Llamada a servicios para generar pdf
     */
    async obtenerPDF() {
        const loading = await this.contextoAPP.mostrarLoading();
        let tipo_periodo = this.periodoSeleccionado['tipo_periodo'];
        let anio_periodo = String(this.periodoSeleccionado['anio_periodo']);
        let id_periodo = String(this.periodoSeleccionado['id_periodo']);
        this.certificadosService.obtenerPDFCartolaCuatrimestral(this.rut, this.dv, id_periodo, anio_periodo, tipo_periodo).subscribe(async (retornoPdf: any) => {
            AppComponent.descargaPDF = retornoPdf.pdf_cartola_cuatrimestral;
            if (this.email) {
                this.contextoAPP.ocultarLoading(loading);
                await this.enviarEmailCartolaCuatrimestral(retornoPdf);
            } else {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        folio: "",
                        tipo: this.CONSTANTES.ES_CUATRIMESTRAL
                    }
                };
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_EXITO.CODIGO_OPERACION);
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
            }
        }, async (error) => {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_ERROR.CODIGO_OPERACION);
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
        });
    }

    /**
     * Redireccion a home app
     */
    cancelar() {
        this.navCtrl.navigateRoot('HomeClientePage');
    }

    /**
     * Obtiene periodos desde servicios que cumplan con las validaciones (valor_activo y envio_data distinto de cero)
     */
    async obtenerPeriodo() {
        const loading = await this.contextoAPP.mostrarLoading();
        this.certificadosService.obtenerPeriodosCartolaCuatrimestral(this.rut, this.dv).subscribe(async (periodos: any) => {
            this.periodos = periodos;
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PERIODO_EXITO.CODIGO_OPERACION);
            await this.contextoAPP.ocultarLoading(loading);
        }, async (error) => {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PERIODO_ERROR.CODIGO_OPERACION);
            await this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
        });
    }

    /**
     * Encargado de abrir modal para regímenes
     */
    verModalFechasEnvio() {
        this.mostrarModalAfiliados = true;
    }

    /**
     * Encargado de cerrar modal para regímenes
     */
    ocultarModalFechasEnvio() {
        this.mostrarModalAfiliados = false;
    }

    /**
     * Envio de solicitud de cartola cuatrimestral a email (solo en caso de tener email valido)
     */
    async enviarEmailCartolaCuatrimestral(retornoPDF) {
        const loading = await this.contextoAPP.mostrarLoading();

        let fechaRetiroDate = new Date();
        let diaRetiro = this.obtenerMesHoraConCero(fechaRetiroDate.getDate());
        let mesRetiro = fechaRetiroDate.getMonth() + 1; //Enero es 0!
        let mesRetiroString = this.obtenerMesHoraConCero(mesRetiro.toString());
        let anioRetiro = fechaRetiroDate.getFullYear();
        let horas = this.obtenerMesHoraConCero(fechaRetiroDate.getHours());
        let minutos = this.obtenerMesHoraConCero(fechaRetiroDate.getMinutes());
        let segundos = this.obtenerMesHoraConCero(fechaRetiroDate.getSeconds());
        let horaSolicitud = horas + ":" + minutos + ":" + segundos;

        let fechaSolicitud: string = diaRetiro + "/" + mesRetiroString + "/" + anioRetiro;
        let fechaHora: string = anioRetiro + "-" + mesRetiroString + "-" + diaRetiro;
        fechaHora = fechaHora + "T" + horaSolicitud;
        let parametrosCorreo = {
            rut: String(this.contextoAPP.datosCliente.rut),
            dv: this.contextoAPP.datosCliente.dv,
            nombreCompleto: this.crearNombreCompleto(this.contextoAPP.datosCliente),
            nombreArchivo: this.CONSTANTES.NOMBRE_PDF_CUATRIMESTRAL,
            titulo: this.CONSTANTES.TITULO_CORREO_CUATRIMESTRAL,
            textoLibre: this.crearTextoLibre(fechaSolicitud),
            fecha: fechaHora,
            tipoOperacion: this.crearTipoOperacion(),
            correoEnviar: this.contextoAPP.datosCliente.email,
            archivo: retornoPDF.pdf_cartola_cuatrimestral
        };

        this.certificadosService.enviarCorreoSolicitud(parametrosCorreo).subscribe(
            async (email) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.CORREO_SOLICITUD_EXITO.CODIGO_OPERACION);
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        folio: "",
                        tipo: this.CONSTANTES.ES_CUATRIMESTRAL
                    }
                };
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
            }, async (error) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.CORREO_SOLICITUD_ERROR.CODIGO_OPERACION);
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
            });
    }

    /**
     * Metodo que registra la trazabilidad de la app. Registrando data en los servicios de habitat
     * @param parametroTraza
     */
    async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza = new ParametroTraza();
        let uuid:any;
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CERTIFICADOS,
            uuid : await this.utilService.getStorageUuid(),
            rut:this.contextoAPP.datosCliente.rut,
            dv: this.contextoAPP.datosCliente.dv,
        }
       
        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_EXITO.CODIGO_OPERACION:
                datosGenerales.uuid = await this.utilService.getStorageUuid();
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_EXITO);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_ERROR.CODIGO_OPERACION:
                datosGenerales.uuid = await this.utilService.getStorageUuid();
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_ERROR);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PERIODO_EXITO.CODIGO_OPERACION:
                uuid = this.utilService.generarUuid();
                datosGenerales.uuid = uuid;
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PERIODO_EXITO);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PERIODO_ERROR.CODIGO_OPERACION:
                datosGenerales.uuid = await this.utilService.getStorageUuid();
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PERIODO_ERROR);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.CORREO_SOLICITUD_EXITO.CODIGO_OPERACION:
                datosGenerales.uuid = await this.utilService.getStorageUuid();
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.CORREO_SOLICITUD_EXITO);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.CORREO_SOLICITUD_ERROR.CODIGO_OPERACION:
                datosGenerales.uuid = await this.utilService.getStorageUuid();
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.CORREO_SOLICITUD_ERROR);
                break;
        }

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
    }

    /**
     * El servicio se alimienta de hora con formato 2019-06-25 01:12:11 , se debe agregar un cero a la iz , cuando aplique.
     * @param valor
     */
    obtenerMesHoraConCero(valor) {
        return String("00" + valor).slice(-2);
    }

    /**
     * Crea variable nombreCompleto con nombre y apellidos de cliente
     * @param datosCliente
     */
    crearNombreCompleto(datosCliente) {
        let nombre = this.contextoAPP.reemplazarTildesTexto(datosCliente.nombre + " " + datosCliente.apellidoPaterno + " " + datosCliente.apellidoMaterno)
        return nombre;
    }

    /**
     * Crea variable para texto de correo segun tipo de cuenta seleccionada
     * @param fechaSolicitud
     */
    crearTextoLibre(fechaSolicitud) {
        return this.CONSTANTES.TEXTO_LIBRE_CORREO_CUATRIMESTRAL.replace(this.CONSTANTES.FECHA_TEXTO_LIBRE_CORREO, fechaSolicitud);
    }

    /**
     * Crea variable para texto de tipo de operación segun tipo de cuenta seleccionada
     */
    crearTipoOperacion() {
        return this.CONSTANTES.TIPO_OPERACION_CORREO_CUATRIMESTRAL;
    }

}
