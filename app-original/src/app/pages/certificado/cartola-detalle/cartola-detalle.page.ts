import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';
import {ActivatedRoute, NavigationExtras} from "@angular/router";
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import {NavController} from '@ionic/angular';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { CertificadosService } from 'src/app/services/api/restful/certificados.service';
import { CONSTANTES_CERTIFICADOS, TRAZAS_CARTOLAS, CONSTANTES_TRAZAS_CERTIFICADOS } from '../util/constantes.certificados';  
import { CONSTANTES_TRAZA_GENERAL } from '../../planes-de-ahorro/util/constantes.planes'; 
import { ParametroTraza } from 'src/app/util/parametroTraza'; 
import { ClienteService, ClienteCuentasDatos, UtilService, TrazabilidadService } from 'src/app/services'; 
import {AppComponent} from "../../../app.component";
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-cartola-detalle',
    templateUrl: './cartola-detalle.page.html',
    styleUrls: ['./cartola-detalle.page.scss'],
})
export class CartolaDetallePage implements OnInit {
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
    // URL Video cartola mensual
    urlVideoCartola: SafeResourceUrl;
    periodoSeleccionado = {};
    mostrarVideo: boolean = true;

    periodoOptions: any = {
        header: 'Período de Tiempo'
    };
    //Aviso de que el video ya comenzo a reproducirse
    primeraReproduccion: boolean = false;

    @Output() iframeClick = new EventEmitter<ElementRef>();
    constructor(
        private clienteService: ClienteService,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private contextoAPP: ContextoAPP,
        private certificadosService: CertificadosService,
        private sanitizer: DomSanitizer,
        private clienteCuentasDatos: ClienteCuentasDatos,
        private utilService: UtilService,
        private trazabilidadService: TrazabilidadService,
        private renderer: Renderer2
    ) {
    }

    async ngOnInit() {
        this.renderer.listen(window, 'blur', () => this.reproducirVideoTraza());
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
        this.email = this.contextoAPP.datosCliente.email;

        this.maeCliente = this.contextoAPP.datosCliente.idMaePersona.toString();
        let cuentasUsuario = this.clienteCuentasDatos.productosCliente.value;
        this.route.queryParams.subscribe(async params => {
            let data = params.certificado;
            this.cartola = JSON.parse(data);

            /**
             * Si el usuario tiene tanto Cuenta Obligatoria como cuenta CCIAV no se debe mostrar el video (regla de negocios)
             */
            let tieneCuentaObligatoria = cuentasUsuario.find((cuenta: any) => cuenta.idProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_OBLIGATORIA);
            let tieneCuentaCCIAV = cuentasUsuario.find((cuenta: any) => cuenta.idProducto === this.CONSTANTES.ID_PRODUCTO_CCIAV);
            if(tieneCuentaObligatoria && tieneCuentaCCIAV){
                this.mostrarVideo = false;
            }else{
                await this.obtenerURLVideoCartola();
            }
            await this.obtenerPeriodo();
        });
    }

    /**
     * Registra traza al reproducir video por primera vez
     */
    reproducirVideoTraza() {
        if( this.primeraReproduccion === false){
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.VIDEO_EXITO.CODIGO_OPERACION)
        }
        this.primeraReproduccion = true;
    }

    /**
     * Llamada a servicios para generar pdf
     */
    async obtenerPDF() {
        const loading = await this.contextoAPP.mostrarLoading();
        this.certificadosService.obtenerPDFCartolas(this.rut, this.dv, this.periodoSeleccionado['anio'], String(this.periodoSeleccionado['id_mes'])).subscribe(async (retornoPdf: any) => {
            if(retornoPdf.pdf_cartola_mensual !== "" && retornoPdf.pdf_cartola_mensual !== null && retornoPdf.pdf_cartola_mensual !== undefined){
                AppComponent.descargaPDF = retornoPdf.pdf_cartola_mensual;
                if (this.email) {
                    this.contextoAPP.ocultarLoading(loading);
                    await this.enviarEmailCartolas(retornoPdf);
                }else{
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            folio: JSON.stringify(retornoPdf.folio),
                            tipo: this.CONSTANTES.ES_CARTOLAS
                        }
                    };
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_CARTOLA_EXITO.CODIGO_OPERACION)
                    this.contextoAPP.ocultarLoading(loading);
                    this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
                }
            }else{
                this.contextoAPP.ocultarLoading(loading);
                this.utilService.mostrarToast(this.CONSTANTES.ERROR_PDF_NULO);
            }
        }, async (error) => {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_CARTOLA_ERROR.CODIGO_OPERACION)
            this.contextoAPP.ocultarLoading(loading);
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
        });
    }

    /**
     * Envio de solicitud a email (solo en caso de tener email valido)
     */
    async enviarEmailCartolas(retornoPdf) {
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
            nombreArchivo: this.CONSTANTES.NOMBRE_PDF,
            titulo: this.CONSTANTES.TITULO_CORREO,
            textoLibre: this.crearTextoLibre(fechaSolicitud),
            fecha: fechaHora,
            tipoOperacion: this.crearTipoOperacion(),
            correoEnviar: this.contextoAPP.datosCliente.email,
            archivo: retornoPdf.pdf_cartola_mensual
        };

        this.certificadosService.enviarCorreoSolicitud(parametrosCorreo).subscribe(
            async (email) => {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        folio: JSON.stringify(retornoPdf.folio),
                        tipo: this.CONSTANTES.ES_CARTOLAS
                    }
                };
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_CARTOLA_EXITO.CODIGO_OPERACION)
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
            }, async (error) => {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        folio: JSON.stringify(retornoPdf.folio),
                        tipo: this.CONSTANTES.ES_CARTOLAS
                    }
                };
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateForward(['certificado-generado'], navigationExtras);
            });
    }

    /**
     * Redireccion a home app
     */
    cancelar() {
        this.navCtrl.navigateRoot('HomeClientePage');
    }

    /**
     * Encagarda de obtener url video cartola mensual
     */
    async obtenerURLVideoCartola() {
        const loading = await this.contextoAPP.mostrarLoading();
        this.clienteService.obtenerURLVideoCartolaMensual(String(this.rut), this.dv, this.maeCliente)
            .subscribe(async (response: any) => {
                this.contextoAPP.ocultarLoading(loading);
                if (!response) {
                    this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.certificados));
                } else {
                    this.mostrarVideo = true;
                    var codigoCliente = response.url_video
                    this.loadScript(codigoCliente);
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_VIDEO_EXITO.CODIGO_OPERACION);
                }
            }, async (error) => {
                this.contextoAPP.ocultarLoading(loading);
                this.mostrarVideo = false;
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_VIDEO_ERROR.CODIGO_OPERACION);

            });
    }

    /**
     * Obtiene periodos desde servicios que cumplan con las validaciones (valor_activo y envio_data distinto de cero)
     */
    async obtenerPeriodo() {
        const loading = await this.contextoAPP.mostrarLoading();
        let hoy = new Date();
        let annoActual: number = hoy.getFullYear();
        let mesActual: number = (hoy.getMonth() + 1);
        let VALOR_CERO = 0;
        let MES_DIC_NUM = 12;
        let MESES_6 = 6;
        let rangoMaximoBusqueda:number = 100;
        let contadorPeriodosAgregados:number = VALOR_CERO;
        let listadoPeriodos: any[] = [];
        while ( true ) {
            rangoMaximoBusqueda--;
            //   termino de busqueda , termino de cliclo, no se se encontraron todos los 6 periodos a mostrar
            if ( rangoMaximoBusqueda == VALOR_CERO){
                this.agregaPeriodos(listadoPeriodos);
                break;
            }

            let periodos: any = await this.obtenerPeriodoCartolaMensualService(annoActual,mesActual);
            if (periodos?.length > 0) {
                // Se filtran periodos no activados o sin data
                if ( periodos[0].valor_activo == VALOR_CERO ||
                    periodos[0].envio_data == VALOR_CERO ){
                        // este caso no requiere acción
                }
                else
                {
                    // ingresa a lista de periodos a mostrar en combo
                    listadoPeriodos.push(periodos[VALOR_CERO]);
                    contadorPeriodosAgregados++;
                }
            }

            if (contadorPeriodosAgregados == MESES_6){
                this.agregaPeriodos(listadoPeriodos);
                /* termino de cliclo, se encontraron los 6 periodos a mostrar */
                break;
            }

            /* busca otro mes */
            mesActual--;
            if (mesActual == VALOR_CERO){
                annoActual--;
                mesActual = MES_DIC_NUM;
            }
        }
        await this.contextoAPP.ocultarLoading(loading);
    }

    /**
     * Encargado de llamar servicio de periodo cartola mensual
     */
    async obtenerPeriodoCartolaMensualService(anio:number, mes:number) {
        return new Promise((resolve, reject) => {
            this.certificadosService.obtenerPeriodosCartolas(this.rut, this.dv, anio.toString(), mes.toString()).subscribe((periodos: any) => {
                resolve(periodos);
            }, (error) => {
                resolve(null);
            });
        });
    }

    /**
     * @returns URL Video Cartola mensual (SafeResourceUrl)
     */
    getURLVideo(): SafeResourceUrl {
        return this.urlVideoCartola;
    }

    /**
     * Agrega periodos encontrados a arreglo para mostrar en selector
     * @param listadoPeriodos
     */
    agregaPeriodos(listadoPeriodos){

        listadoPeriodos.forEach((periodo) => {
            let buscarMes = this.CONSTANTES.MESES.find((mes: any) => (mes.id === Number(periodo.mes_periodo)));
            this.periodos.push({
                nombre_mes: buscarMes?.nombre,
                id_mes: buscarMes?.id,
                anio: periodo.anio_periodo,
            })
        });
    }

    /**
     * Metodo que registra la trazabilidad de la app. Registrando data en los servicios de habitat
     * @param codigoOperacion
     */
    async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CERTIFICADOS,
            uuid : await this.utilService.getStorageUuid(),
            rut:this.contextoAPP.datosCliente.rut,
            dv: this.contextoAPP.datosCliente.dv,
        }
       
        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.VIDEO_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.VIDEO_EXITO);
              break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_CARTOLA_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_CARTOLA_EXITO);
              break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_CARTOLA_ERROR.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.OBTENER_PDF_CARTOLA_ERROR);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_CARTOLA_EXITO.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_CARTOLA_EXITO);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_VIDEO_EXITO.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_VIDEO_EXITO);
                break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_VIDEO_ERROR.CODIGO_OPERACION:
                parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.CARTOLA.SOLICITAR_VIDEO_ERROR);
                break;
        }

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe();
    }

    /**
     * El servicio se alimienta de hora con formato 2019-06-25 01:12:11 , se debe agregar un cero a la iz , cuando aplique.
     * @param valor
     */
    obtenerMesHoraConCero(valor){
        return String("00" + valor).slice(-2);
    }

    /**
     * Crea variable nombreCompleto con nombre y apellidos de cliente
     * @param datosCliente
     */
    crearNombreCompleto(datosCliente){

        let nombre = this.contextoAPP.reemplazarTildesTexto(datosCliente.nombre + " " + datosCliente.apellidoPaterno + " " + datosCliente.apellidoMaterno);
        return nombre;
    }

    /**
     * Crea variable para texto de correo segun tipo de cuenta seleccionada
     * @param fechaSolicitud
     */
    crearTextoLibre(fechaSolicitud){
        return this.CONSTANTES.TEXTO_LIBRE_CORREO.replace(this.CONSTANTES.FECHA_TEXTO_LIBRE_CORREO, fechaSolicitud);
    }

    /**
     * Crea variable para texto de tipo de operación segun tipo de cuenta seleccionada
     */
    crearTipoOperacion(){
        return this.CONSTANTES.TIPO_OPERACION_CORREO;
    }

    /**
     * Crea el script para obtener el video desde CDN
     * @param url url obtenida desde el servicio. 
     */
    loadScript(codigoCliente: string) {
        const node = document.createElement('script');
        node.src = 'https://cdn.individeo.com/individeo/prod/edge/js/smartEmbed.js';
        node.type = 'text/javascript';
        node.async = true;
        node.setAttribute('data-iv-attachment-code', 'pFXDVWQpafvjpLPutA-5363');
        node.setAttribute('data-iv-lang', 'es-CL');
        node.setAttribute('data-iv-recipient-code', codigoCliente);

        document.getElementById('scriptContainer')!.appendChild(node);
    }

}
