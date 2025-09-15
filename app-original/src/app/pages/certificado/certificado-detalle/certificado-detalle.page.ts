import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras} from "@angular/router";
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import {DatePipe} from "@angular/common"; 
import {NavController} from "@ionic/angular";
import { Certificado } from 'src/app/services/api/data/certificado'; 
import { CONSTANTES_CERTIFICADOS, CONSTANTES_TRAZAS_CERTIFICADOS } from '../util/constantes.certificados'; 
import { ClienteService, UtilService,ClienteDatos,TrazabilidadService } from 'src/app/services';
import {AppComponent} from "../../../app.component";
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { Device } from '@capacitor/device';

@Component({
    selector: 'app-certificado-detalle',
    templateUrl: './certificado-detalle.page.html',
    styleUrls: ['./certificado-detalle.page.scss'],
})
export class CertificadoDetallePage implements OnInit {

    readonly CONSTANTES = CONSTANTES_CERTIFICADOS;
    certificado = {};
    listaTipoCuenta: any[] = [];

    rut: number;
    dv: string;
    email: string;

    pdfBytesArray: string;
    pdfFolio: string;

    mostrarResumidoDetallado: boolean = false;
    showSelectorTipoCuenta: boolean = false;
    showSelectorPeriodo: boolean = false;
    opcionResumidoActiva: boolean = null!;
    opcionDetalladoActiva: boolean = false;

    showFormDate: boolean = false;

    fechaDesde: string;
    fechaHasta: string;

    fechaInicioHabitat = '1981-05-01';
    fechaMaximaActual: string = (new Date()).toISOString();

    fechaMinimaCalculada: string;
    fechaMaximaCalculada: string;
    habilitaFechaHasta = true;

    tipoCuenta: any = {tipo: null, numeroCuenta: 0};
    tipoCuentaOptions: any = {
        header: 'Tipo de Cuenta'
    };

    tipoPerOptions: any = {
        header: 'Elegir Período'
    };

    tipoPeriodo: any = {tipo: null, desde: '', hasta: ''};
    listaTipoPeriodo: any[] = [
        {tipo: this.CONSTANTES.ULTIMOS_12_MESES, desde: '', hasta: ''},
        {tipo: this.CONSTANTES.ULTIMOS_24_MESES, desde: '', hasta: ''},
        {tipo: this.CONSTANTES.ULTIMOS_36_MESES, desde: '', hasta: ''},
        {tipo: this.CONSTANTES.RANGO_FECHAS_ABIERTO, desde: '', hasta: ''} // maximo 3 años
    ];

    labelDesde: string = 'mm/yyyy';
    labelHasta: string = 'mm/yyyy';
    uuid: string;

    devicePlatform: string;

    constructor(
        private route: ActivatedRoute,
        private contextoAPP: ContextoAPP,
        private datePipe: DatePipe,
        private clienteService: ClienteService,
        private clienteDatos: ClienteDatos,
        private contextoApp: ContextoAPP,
        private navCtrl: NavController,
        private trazabilidadService: TrazabilidadService,
        private utilService: UtilService
    ) {
    }

    async getDeviceInfo() {
        const info = await Device.getInfo();
        this.devicePlatform = info.platform;
    }

    async ngOnInit() {
        this.getDeviceInfo();
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
            const loading = await this.contextoAPP.mostrarLoading();
            const paramsCertificado = JSON.parse(params.certificado);
            let tiposCuentas = params.listaTipoCuenta;
            this.certificado = new Certificado();
            this.certificado['tipo'] = paramsCertificado._tipo;
            this.certificado['codigoTipoCertificado'] = paramsCertificado._codigoTipoCertificado;
            this.certificado['que_es'] = paramsCertificado._que_es;
            this.certificado['para_que_sirve'] = paramsCertificado._para_que_sirve;
            this.certificado['codigoCategoriaCertificado'] = paramsCertificado._codigoCategoriaCertificado;

            this.listaTipoCuenta = JSON.parse(tiposCuentas);

            if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_COTIZACIONES) {// Cotizaciones con RUT Empleador
                this.mostrarResumidoDetallado = false;
                this.showSelectorTipoCuenta = true;
                this.showSelectorPeriodo = false;
            } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS) { //Movimientos
                this.mostrarResumidoDetallado = true;
                this.showSelectorTipoCuenta = false;
                this.showSelectorPeriodo = false;
            } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_SALDOS || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_AFILIACION || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_ANTECEDENTES || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_VACACIONES) {
                this.mostrarResumidoDetallado = false;
                this.showSelectorTipoCuenta = false;
                this.showSelectorPeriodo = false;
            }

            this.contextoAPP.ocultarLoading(loading);
        });
        this.uuid = await this.utilService.getStorageUuid();
    }

    /**
     * Habilida selector de periodos tras seleccionar cuenta
     */
    cambioTipoCuenta() {
        this.showSelectorPeriodo = true;
    }

    /**
     * Marca opción seleccionada resumido para generar certificado
     */
    async seleccionOpcionResumido() {
        this.opcionDetalladoActiva = false;
        this.opcionResumidoActiva = true;
        this.showSelectorTipoCuenta = true;
        this.certificado['codigoTipoCertificado'] = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado;
    }

    /**
     * Marca opción seleccionada Detallado para generar certificado
     */
    async seleccionOpcionDetallado() {
        this.opcionResumidoActiva = false;
        this.opcionDetalladoActiva = true;
        this.showSelectorTipoCuenta = true;
        this.certificado['codigoTipoCertificado'] = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado2;
    }

    /**
     * Seleccion de periodo de tiempo, en caso de seleccionar Elegir fechas, se activa
     * selector de fechas manual
     */
    cambioTipoPeriodo() {

        if (this.tipoPeriodo === undefined || this.tipoPeriodo === null) {
            this.showFormDate = false;
        } else {
            this.habilitaFechaHasta = true;
            this.fechaHasta = null!;
            this.fechaDesde = null!;

            if ((this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS2) && this.tipoPeriodo.tipo === this.CONSTANTES.RANGO_FECHAS_ABIERTO) {
                this.showFormDate = true;
            } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_COTIZACIONES && this.tipoPeriodo.tipo === this.CONSTANTES.RANGO_FECHAS_ABIERTO) {
                this.showFormDate = true;
            } else if (
                this.tipoPeriodo.tipo === this.CONSTANTES.ULTIMOS_12_MESES ||
                this.tipoPeriodo.tipo === this.CONSTANTES.ULTIMOS_24_MESES ||
                this.tipoPeriodo.tipo === this.CONSTANTES.ULTIMOS_36_MESES
            ) {
                this.showFormDate = false;
            } else if (this.tipoPeriodo.tipo !== this.CONSTANTES.RANGO_FECHAS_ABIERTO) {
                this.showFormDate = false;
            }
        }
    }

    /**
     * Genera fecha maxima posible de acuerdo a fecha inicial seleccionada
     */
    calcularFechaHasta() {
        this.fechaMinimaCalculada = this.fechaDesde;
        const dateNow = new Date();
        const anoActual: number = dateNow.getFullYear();
        const mesActual: number = dateNow.getMonth();
        const anoFechaDesde: number = parseInt(this.fechaDesde.substring(0, 4));
        const mesFechaDesde: number = parseInt(this.fechaDesde.substring(5, 7)) - 1;
        let mesCalculado: number = mesFechaDesde;
        let anoCalculado: number = anoFechaDesde + 3;

        if (anoCalculado > anoActual) {
            anoCalculado = anoActual;
            mesCalculado = mesActual;
        }

        const fechaMaxima = (new Date(anoCalculado, mesCalculado, 1)).toString();
        this.fechaMaximaCalculada = this.datePipe.transform(fechaMaxima, 'yyyy-MM')!;
        this.habilitaFechaHasta = false;

        this.labelDesde = this.datePipe.transform(this.fechaDesde, 'MM-yyyy')!;

        /**
         * En caso de que ya existe fecha de término, se debe validar
         * que cumpla con una diferencia máxima de tres años con
         * respecto a la fecha de inicio, si no se cumple este caso,
         * la fecha de término pasa a ser nula y el boton se bloquea.
         */
        if (this.fechaHasta != null && this.fechaHasta != undefined) {
            const endDate = new Date(this.fechaHasta);
            const maxDate = new Date(this.fechaMaximaCalculada);
            const minDate = new Date(this.fechaDesde);

            if (endDate.getTime() > maxDate.getTime() || endDate.getTime() < minDate.getTime()) {
                this.fechaHasta = '';
            }
        }
    }

    seleccionFechaHasta() {
        this.labelHasta = this.datePipe.transform(this.fechaHasta, 'MM-yyyy')!;
    }

    descargarCertificadoIOS(loading: any) {
        this.clienteService.solicitarCertificadoIos(
            this.rut, 
            this.dv, 
            this.tipoCuenta.numeroCuenta, 
            this.certificado['codigoTipoCertificado'], 
            this.tipoPeriodo.desde, 
            this.tipoPeriodo.hasta, 
            this.certificado['codigoCategoriaCertificado'])
            .subscribe(async (certificado) => {
                AppComponent.descargaPDF = certificado.pdfBytesArray;

                /**
                 * Si el certificado es de tipo movimientos, antecedentes o vacaciones, no se envía traza intermedia
                 */
                let codigoCertificado = this.certificado['codigoTipoCertificado'];
                if(codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS && codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS2 && codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_ANTECEDENTES && codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_VACACIONES){
                    await this.registrarTrazabilidad('PREEND');
                }

                if (this.email) {
                    this.contextoApp.ocultarLoading(loading);
                    await this.enviarEmailCertificados(certificado);
                }else{
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            folio: JSON.stringify(certificado.folio),
                            codigoTipoCertificado: JSON.stringify(this.certificado['codigoTipoCertificado']),
                            tipo: this.CONSTANTES.ES_CERTIFICADOS
                        }
                    };
                    await this.registrarTrazabilidad('END');
                    this.contextoApp.ocultarLoading(loading);
                    this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
                }

            }, async (error) => {
                await this.registrarTrazabilidad('ERROR');
                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
            });
    }

    descargarCertificadoAndroid(loading: any) {
        this.clienteService.solicitarCertificadoAndroid(
            this.rut, 
            this.dv, 
            this.tipoCuenta.numeroCuenta, 
            this.certificado['codigoTipoCertificado'], 
            this.tipoPeriodo.desde, 
            this.tipoPeriodo.hasta, 
            this.certificado['codigoCategoriaCertificado'])
            .then(async (respuesta) => {
                const certificado = respuesta.data
                AppComponent.descargaPDF = certificado.pdfBytesArray;

                /**
                 * Si el certificado es de tipo movimientos, antecedentes o vacaciones, no se envía traza intermedia
                 */
                let codigoCertificado = this.certificado['codigoTipoCertificado'];
                if(codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS && codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS2 && codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_ANTECEDENTES && codigoCertificado != this.CONSTANTES.CODIGO_CERTIFICADO_VACACIONES){
                    await this.registrarTrazabilidad('PREEND');
                }

                if (this.email) {
                    this.contextoApp.ocultarLoading(loading);
                    await this.enviarEmailCertificados(certificado);
                }else{
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            folio: JSON.stringify(certificado.folio),
                            codigoTipoCertificado: JSON.stringify(this.certificado['codigoTipoCertificado']),
                            tipo: this.CONSTANTES.ES_CERTIFICADOS
                        }
                    };
                    await this.registrarTrazabilidad('END');
                    this.contextoApp.ocultarLoading(loading);
                    this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
                }

            }, async (error) => {
                await this.registrarTrazabilidad('ERROR');
                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
            });
    }

    /**
     * Función que trae certificado seleccionado, de acuerdo al tipo y las opciones seleccionadas, se agregan
     * datos correspondientes para solicitud a servicio
     */
    async solicitarCertificado() {
        const loading = await this.contextoApp.mostrarLoading();

        if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_SALDOS.codigoTipoCertificado) {
            this.utilService.setLogEvent('event_habitat', {option: 'Solicitud_Certificado_Saldos'});
        } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_AFILIACION.codigoTipoCertificado) {
            this.utilService.setLogEvent('event_habitat', {option: 'Solicitud_Certificado_Afiliación'});
        } else if ((this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado2)) {
            this.utilService.setLogEvent('event_habitat', {option: 'Solicitud_Certificado_Movimientos'});
        } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_COTIZACIONES.codigoTipoCertificado) {
            this.utilService.setLogEvent('event_habitat', {option: 'Solicitud_Certificado_Cotizaciones_RUT_Empleador'});
        } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_VACACIONES.codigoTipoCertificado) {
            this.utilService.setLogEvent('event_habitat', {option: 'Solicitud_Certificado_Vacaciones'});
        } else if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CERTIFICADO_ANTECEDENTES.codigoTipoCertificado) {
            this.utilService.setLogEvent('event_habitat', {option: 'Solicitud_Certificado_Antecedentes'});
        }

        if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_COTIZACIONES || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS2) {
            if (this.tipoPeriodo.tipo === this.CONSTANTES.RANGO_FECHAS_ABIERTO) {
                this.tipoPeriodo.desde = this.formartearFecha(this.fechaDesde);
                this.tipoPeriodo.hasta = this.formartearFecha(this.fechaHasta);
            } else if (this.tipoPeriodo.tipo === this.CONSTANTES.ULTIMOS_12_MESES) {
                this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(1);
                this.tipoPeriodo.hasta = this.formartearFecha(new Date());
            } else if (this.tipoPeriodo.tipo === this.CONSTANTES.ULTIMOS_24_MESES) {
                this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(2);
                this.tipoPeriodo.hasta = this.formartearFecha(new Date());
            } else if (this.tipoPeriodo.tipo === this.CONSTANTES.ULTIMOS_36_MESES) {
                this.tipoPeriodo.desde = this.restaAnoSegunFechaActual(3);
                this.tipoPeriodo.hasta = this.formartearFecha(new Date());
            }
        }
        if (this.devicePlatform === 'android') {
            this.descargarCertificadoAndroid(loading);}
        else {
            this.descargarCertificadoIOS(loading);
        }
    }

    /**
     * Envio de solicitud a email (solo en caso de tener email valido)
     */
    async enviarEmailCertificados(certificado) {
        const loading = await this.contextoApp.mostrarLoading();
        this.clienteService.enviarCertificadoPorEmail(this.rut, this.dv, this.certificado['codigoTipoCertificado'], certificado.folio).subscribe(
            async (email) => {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        folio: JSON.stringify(certificado.folio),
                        codigoTipoCertificado: JSON.stringify(this.certificado['codigoTipoCertificado']),
                        tipo: this.CONSTANTES.ES_CERTIFICADOS
                    }
                };
                await this.registrarTrazabilidad('END');
                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
                return true;
            }, async (error) => {
                await this.registrarTrazabilidad('END');

                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        folio: JSON.stringify(certificado.folio),
                        codigoTipoCertificado: JSON.stringify(this.certificado['codigoTipoCertificado']),
                        tipo: this.CONSTANTES.ES_CERTIFICADOS
                    }
                };

                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
                return false;
            });
    }

    /**
     * Valida que todos los campos se hayan completado (segun tipo de cuenta)
     * para habilitar boton solicitar
     */
    validarCampos() {
        let esValido = true;
        if (this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_COTIZACIONES) {
            if (this.tipoCuenta.tipo === null || this.tipoPeriodo.tipo === null) {
                esValido = false;
            }
            if (this.tipoPeriodo.tipo === this.CONSTANTES.RANGO_FECHAS_ABIERTO && (this.fechaDesde === undefined || this.fechaDesde === null || this.fechaHasta === undefined || this.fechaHasta === null)) {
                esValido = false;
            }
        } else if ((this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS || this.certificado['codigoTipoCertificado'] === this.CONSTANTES.CODIGO_CERTIFICADO_MOVIMIENTOS2)) {
            if (this.tipoCuenta.tipo === null || this.tipoPeriodo.tipo === null) {
                esValido = false;
            }
            if (this.tipoPeriodo.tipo === this.CONSTANTES.RANGO_FECHAS_ABIERTO && (this.fechaDesde === undefined || this.fechaDesde === null || this.fechaHasta === undefined || this.fechaHasta === null)) {
                esValido = false;
            }
            if (this.opcionResumidoActiva === false && this.opcionDetalladoActiva === false) {
                esValido = false;
            }
        }
        return esValido;
    }

    /**
     * Transforma fecha a formato dd-MM-yyyy
     * @param fecha
     */
    formartearFecha(fecha: any): string {
        if (fecha.length === 7) {
            return this.datePipe.transform(fecha + '-01', 'dd-MM-yyyy')!;
        } else {
            return this.datePipe.transform(fecha, 'dd-MM-yyyy')!;
        }
    }

    /**
     * Resta años a fecha para generar rango de tiempo seleccionado
     * @param restar
     */
    restaAnoSegunFechaActual(restar: number): string {
        const fechaActual = new Date();
        const ano: string = (fechaActual.getFullYear() - restar).toString();
        const mes: string = (fechaActual.getMonth() + 1).toString();
        const dia: string = (fechaActual.getDay()).toString();
        return (
            ((dia.length === 1) ? '0' + dia : dia) + '-' +
            ((mes.length === 1) ? '0' + mes : mes) + '-' +
            ano
        );
    }

    /**
     * Redireccion a home app
     */
    cancelar() {
        this.navCtrl.navigateRoot('HomeClientePage');
    }

    /**
     * Trazabilidad de módulo segun certificado seleccionado
     * @param tipoPaso
     */
    registrarTrazabilidad(tipoPaso: string) {
        let parametrosTraza;
            
        switch (this.certificado['codigoTipoCertificado']) {
           
            case this.CONSTANTES.CERTIFICADO_SALDOS.codigoTipoCertificado: // Saldos
                 parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.SALDOS);
                break;
            case this.CONSTANTES.CERTIFICADO_AFILIACION.codigoTipoCertificado: // Afiliación
                parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.AFILIACION);
                break;
            case this.CONSTANTES.CERTIFICADO_COTIZACIONES.codigoTipoCertificado: // Cotizaciones con RUT Empleador
                parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.COTIZACIONES);
                break;
            case this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado: //Movimientos
                parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.MOVIMIENTOS);
                break;
            case this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado2: //Movimientos
                parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.MOVIMIENTOS);
                break;
            case this.CONSTANTES.CERTIFICADO_VACACIONES.codigoTipoCertificado: // Vacaciones
                parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.VACACIONES);
                break;
            case this.CONSTANTES.CERTIFICADO_ANTECEDENTES.codigoTipoCertificado: // Antecedentes
                parametrosTraza = this.asignarValoresTraza(tipoPaso, CONSTANTES_TRAZAS_CERTIFICADOS.DETALLE.ANTECEDENTES);
                break;
        }

        this.trazabilidadService.registraTrazaUUID(parametrosTraza, this.rut, this.dv).subscribe();
    }

    /**
     * Metodo quea signa valores a las trazas dependiendo de su tipo
     * @param tipoPaso
     * @param traza
    */
    asignarValoresTraza(tipoPaso: string, traza: any){
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CERTIFICADOS,
            uuid : this.uuid,
            rut: this.rut,
            dv: this.dv,
        }

        if (tipoPaso === 'INI') {
            parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, traza.INI);
        } else if (tipoPaso === 'ERROR') {
            parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, traza.ERROR);
        } else if (tipoPaso === 'PREEND') {
            parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, traza.PREEND);
        } else if (tipoPaso === 'END') {
            parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, traza.END);
        }
        return parametroTraza;
    }
}
