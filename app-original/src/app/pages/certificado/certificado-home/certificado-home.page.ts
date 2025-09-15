import { Component, OnInit } from '@angular/core';
import { CONSTANTES_CERTIFICADOS, TRAZAS_CARTOLAS, CONSTANTES_TRAZAS_CERTIFICADOS } from 'src/app/pages/certificado/util/constantes.certificados';
import { NavController} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ClienteDatos, ClienteCuentasDatos, UtilService, TrazabilidadService } from 'src/app/services'; 
import { Certificado } from 'src/app/services/api/data/certificado'; 
import { NavigationExtras } from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { CONSTANTES_TRAZA_GENERAL } from '../../planes-de-ahorro/util/constantes.planes'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { DatosModal } from 'src/app/interfaces/datos-modal.interface';

@Component({
    selector: 'app-certificado-home',
    templateUrl: './certificado-home.page.html',
    styleUrls: ['./certificado-home.page.scss'],
})
export class CertificadoHomePage implements OnInit {
    readonly CONSTANTES = CONSTANTES_CERTIFICADOS;
    modalData = {} as DatosModal;
    verModalCertificado = false;
    readonly CONSTANTES_TRAZA = TRAZAS_CARTOLAS;
    readonly CONSTANTES_TRAZA_GENERAL = CONSTANTES_TRAZA_GENERAL;

    rut: number;
    dv: string;
    email: string;
    pdfBytesArray: string;
    tipoCertificado: any = {tipo: null, codigoTipoCertificado: null};
    listaTipoCertificado: any[] = [];
    listaTipoCuenta: any[] = [];
    fechaMaximaActual: string;
    uuid: string;
    esPensionado = false;

    constructor(
        private navCtrl: NavController,
        private clienteDatos: ClienteDatos,
        private datePipe: DatePipe,
        private clienteCuentasDatos: ClienteCuentasDatos,
        private utilService: UtilService,
        private trazabilidadService: TrazabilidadService,
        private contextoAPP: ContextoAPP,
    ) {
        this.fechaMaximaActual = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    }

    async ngOnInit() {
        const loading = await this.contextoAPP.mostrarLoading();
        this.asignarCertificados();
        this.clienteCuentasDatos.productosCliente.subscribe(productos => {
            this.cargarCuentasSelector(productos);
        });
        this.clienteDatos.rut.subscribe(rut => {
            this.rut = rut;
        });
        this.clienteDatos.dv.subscribe(dv => {
            this.dv = dv;
        });
        this.clienteDatos.email.subscribe(email => {
            this.email = email;
        });
        this.clienteDatos.esPensionado.subscribe(esPensionado => {
            this.esPensionado = esPensionado;
        });
        this.contextoAPP.ocultarLoading(loading);
    }

    /**
     * Se crean certificados que se muestran para todos los usuarios
     */
    asignarCertificados() {
        let cotizaciones = new Certificado();
        cotizaciones.tipo = this.CONSTANTES.CERTIFICADO_COTIZACIONES.tipo;
        cotizaciones.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_COTIZACIONES.codigoTipoCertificado;
        cotizaciones.que_es = this.CONSTANTES.CERTIFICADO_COTIZACIONES.que_es;
        cotizaciones.para_que_sirve = this.CONSTANTES.CERTIFICADO_COTIZACIONES.para_que_sirve;
        cotizaciones.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_COTIZACIONES.codigoCategoriaCertificado;
        cotizaciones.categoriaAcordion = this.CONSTANTES.CERTIFICADO_COTIZACIONES.categoriaAcordion;
        cotizaciones.descripcionAcordion = this.CONSTANTES.CERTIFICADO_COTIZACIONES.descripcionAcordion;
        cotizaciones.descripcionTitulo = this.CONSTANTES.CERTIFICADO_COTIZACIONES.descripcionTitulo;
        this.listaTipoCertificado.push(cotizaciones);

        let movimientos = new Certificado();
        movimientos.tipo = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.tipo;
        movimientos.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado;
        movimientos.que_es = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.que_es;
        movimientos.para_que_sirve = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.para_que_sirve;
        movimientos.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoCategoriaCertificado;
        movimientos.categoriaAcordion = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.categoriaAcordion;
        movimientos.descripcionAcordion = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.descripcionAcordion;
        movimientos.descripcionTitulo = this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.descripcionTitulo;
        this.listaTipoCertificado.push(movimientos);

        let saldos = new Certificado();
        saldos.tipo = this.CONSTANTES.CERTIFICADO_SALDOS.tipo;
        saldos.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_SALDOS.codigoTipoCertificado;
        saldos.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_SALDOS.codigoCategoriaCertificado;
        saldos.categoriaAcordion = this.CONSTANTES.CERTIFICADO_SALDOS.categoriaAcordion;
        saldos.descripcionAcordion = this.CONSTANTES.CERTIFICADO_SALDOS.descripcionAcordion;
        saldos.descripcionTitulo = this.CONSTANTES.CERTIFICADO_SALDOS.descripcionTitulo;
        saldos.descripcionModal = this.CONSTANTES.CERTIFICADO_SALDOS.descripcionModal;
        this.listaTipoCertificado.push(saldos);

        const pensionado = new Certificado();
        pensionado.tipo = this.CONSTANTES.CERTIFICADO_PENSIONADO.tipo;
        pensionado.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_PENSIONADO.codigoTipoCertificado;
        pensionado.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_PENSIONADO.codigoCategoriaCertificado;
        pensionado.categoriaAcordion = this.CONSTANTES.CERTIFICADO_PENSIONADO.categoriaAcordion;
        pensionado.descripcionAcordion = this.CONSTANTES.CERTIFICADO_PENSIONADO.descripcionAcordion;
        pensionado.descripcionTitulo = this.CONSTANTES.CERTIFICADO_PENSIONADO.descripcionTitulo;
        pensionado.descripcionModal = this.CONSTANTES.CERTIFICADO_PENSIONADO.descripcionModal;
        this.listaTipoCertificado.push(pensionado);
    }

    /**
     * Se agregan certificados al arreglo si cumple con la condición de tener cuenta obligatoria
     * @param productos
     */
    cargarCuentasSelector(productos: any[]) {
        productos.forEach((element: any) => {
            const cuenta = {
                tipo: element.nombreCortoProducto,
                numeroCuenta: element.idProducto,
            };
            if (element.idProducto === this.CONSTANTES.ID_PRODUCTO_CUENTA_OBLIGATORIA) {

                let afiliacion = new Certificado();
                afiliacion.tipo = this.CONSTANTES.CERTIFICADO_AFILIACION.tipo;
                afiliacion.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_AFILIACION.codigoTipoCertificado;
                afiliacion.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_AFILIACION.codigoCategoriaCertificado;
                afiliacion.categoriaAcordion = this.CONSTANTES.CERTIFICADO_AFILIACION.categoriaAcordion;
                afiliacion.descripcionAcordion = this.CONSTANTES.CERTIFICADO_AFILIACION.descripcionAcordion;
                afiliacion.descripcionTitulo = this.CONSTANTES.CERTIFICADO_AFILIACION.descripcionTitulo;
                afiliacion.descripcionModal = this.CONSTANTES.CERTIFICADO_AFILIACION.descripcionModal;
                this.listaTipoCertificado.push(afiliacion);

                let antecedentes = new Certificado();
                antecedentes.tipo = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.tipo;
                antecedentes.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.codigoTipoCertificado;
                antecedentes.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.codigoCategoriaCertificado;
                antecedentes.categoriaAcordion = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.categoriaAcordion;
                antecedentes.descripcionAcordion = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.descripcionAcordion;
                antecedentes.descripcionTitulo = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.descripcionTitulo;
                antecedentes.descripcionModal = this.CONSTANTES.CERTIFICADO_ANTECEDENTES.descripcionModal;
                this.listaTipoCertificado.push(antecedentes);

                let vacaciones = new Certificado();
                vacaciones.tipo = this.CONSTANTES.CERTIFICADO_VACACIONES.tipo;
                vacaciones.codigoTipoCertificado = this.CONSTANTES.CERTIFICADO_VACACIONES.codigoTipoCertificado;
                vacaciones.codigoCategoriaCertificado = this.CONSTANTES.CERTIFICADO_VACACIONES.codigoCategoriaCertificado;
                vacaciones.categoriaAcordion = this.CONSTANTES.CERTIFICADO_VACACIONES.categoriaAcordion;
                vacaciones.descripcionAcordion = this.CONSTANTES.CERTIFICADO_VACACIONES.descripcionAcordion;
                vacaciones.descripcionTitulo = this.CONSTANTES.CERTIFICADO_VACACIONES.descripcionTitulo;
                vacaciones.descripcionModal = this.CONSTANTES.CERTIFICADO_VACACIONES.descripcionModal;
                this.listaTipoCertificado.push(vacaciones);
            }
            this.listaTipoCuenta.push(cuenta);
        });

        const cartola_cuatrimestral = new Certificado();
        cartola_cuatrimestral.tipo = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.tipo;
        cartola_cuatrimestral.codigoTipoCertificado = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.codigoTipoCertificado;
        cartola_cuatrimestral.que_es = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.que_es;
        cartola_cuatrimestral.para_que_sirve = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.para_que_sirve;
        cartola_cuatrimestral.categoriaAcordion = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.categoriaAcordion;
        cartola_cuatrimestral.descripcionAcordion = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.descripcionAcordion;
        cartola_cuatrimestral.descripcionTitulo = this.CONSTANTES.CARTOLA_CUATRIMESTRAL.descripcionTitulo;
        this.listaTipoCertificado.push(cartola_cuatrimestral);

        const cartola_mensual = new Certificado();
        cartola_mensual.tipo = this.CONSTANTES.CARTOLA_MENSUAL.tipo;
        cartola_mensual.codigoTipoCertificado = this.CONSTANTES.CARTOLA_MENSUAL.codigoTipoCertificado;  
        cartola_mensual.categoriaAcordion = this.CONSTANTES.CARTOLA_MENSUAL.categoriaAcordion;
        cartola_mensual.descripcionAcordion = this.CONSTANTES.CARTOLA_MENSUAL.descripcionAcordion;
        this.listaTipoCertificado.push(cartola_mensual);
    }

    /**
     * Evento descargar pdf generado a partir de servicio
     */
    descargarPdf() {
        this.utilService.generarPdf(this.pdfBytesArray);
    }

    /**
     * Trazabilidad de módulo segun certificado seleccionado
     * @param tipoPaso
     */
    registrarTrazabilidad(tipoPaso: string, certificado) {
        let parametrosTraza;

        switch (certificado.codigoTipoCertificado) {
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
            uuid : this.utilService.generarUuid(),
            rut: this.rut,
            dv: this.dv,
        }

        if (tipoPaso === 'INI') {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.INI);
        } else if (tipoPaso === 'ERROR') {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.ERROR);
        } else if (tipoPaso === 'PREEND') {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.PREEND);
        } else if (tipoPaso === 'END') {
            parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, traza.END);
        }
        return parametroTraza;
    }

    /**
     * Funcionalidad de retorno a vista anterior
     */
    backButton() {
        this.navCtrl.pop();
    }

    /**
     * Abre Modal Solicitud de Certificado, redirección a detalle de certificado o cartola según sea el caso
     * @param certificado
     */
    async seleccionaCertificado(certificado) {
        const certificadosModal = [
            this.CONSTANTES.CODIGO_CERTIFICADO_AFILIACION,
            this.CONSTANTES.CODIGO_CERTIFICADO_ANTECEDENTES,
            this.CONSTANTES.CODIGO_CERTIFICADO_SALDOS,
            this.CONSTANTES.CODIGO_CERTIFICADO_VACACIONES,
            this.CONSTANTES.CODIGO_CERTIFICADO_PENSIONADO
            // Agregar el codigo para liquidación de pensión
        ];
        
        if (certificadosModal.includes(certificado._codigoTipoCertificado)) {
            this.modalData = {
                titulo: certificado._tipo,
                texto: certificado._descripcionModal,
                certificado,
                botonPrimario: 'Solicitar',
                botonSecundario: 'Cancelar'
            };
            
            this.verModalCertificado = true;
        } 
        
        const navigationExtras: NavigationExtras = {
            queryParams: {
                certificado: JSON.stringify(certificado),
                listaTipoCuenta: JSON.stringify(this.listaTipoCuenta)
            }
        };

        if (certificado._codigoTipoCertificado === 'CARTOLA') {
            try {
                await this.registrarTrazabilidadCartolas(CONSTANTES_TRAZAS_CERTIFICADOS.HOME.CARTOLA_EXITO.CODIGO_OPERACION);
                this.navCtrl.navigateForward(['cartola-detalle'], navigationExtras);
            }
            catch(error) {
                await this.registrarTrazabilidadCartolas(CONSTANTES_TRAZAS_CERTIFICADOS.HOME.CARTOLA_ERROR.CODIGO_OPERACION);
            }
        } else if (certificado._codigoTipoCertificado === 'CUATRIMESTRAL') {
                this.navCtrl.navigateForward(['cartola-cuatrimestral']);
        } else {
            this.registrarTrazabilidad('INI', certificado);

            switch (certificado._codigoTipoCertificado) {
                case this.CONSTANTES.CERTIFICADO_MOVIMIENTOS.codigoTipoCertificado:
                    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Certificado_Movimientos' });
                    break;
                case this.CONSTANTES.CERTIFICADO_SALDOS.codigoTipoCertificado:
                    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Certificado_Saldos' });
                    return;
                case this.CONSTANTES.CERTIFICADO_AFILIACION.codigoTipoCertificado:
                    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Certificado_Afiliación' });
                    return;
                case this.CONSTANTES.CERTIFICADO_VACACIONES.codigoTipoCertificado:
                    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Certificado_Vacaciones' });
                    return;
                case this.CONSTANTES.CERTIFICADO_ANTECEDENTES.codigoTipoCertificado:
                    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Certificado_Antecedentes' });
                    return;
                case this.CONSTANTES.CERTIFICADO_COTIZACIONES.codigoTipoCertificado:
                    this.utilService.setLogEvent('event_habitat', { option: 'Inicio_Certificado_Cotizaciones_RUT_Empleador' });
                    break;
                default:
                    return;
            }

            this.navCtrl.navigateForward(['certificado-detalle'], navigationExtras);
        }
    }

    /**
     * Redireccion a home app
     */
    cancelar() {
        this.navCtrl.navigateRoot('HomeClientePage');
    }

    /**
     * Encargado de registrar trazabilidad
     */
    async registrarTrazabilidadCartolas(codigoOperacion: number) {
        let parametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CERTIFICADOS,
            uuid : this.utilService.generarUuid(),
            rut: this.rut,
            dv: this.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_CERTIFICADOS.HOME.CARTOLA_EXITO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.HOME.CARTOLA_EXITO);
              break;
            case CONSTANTES_TRAZAS_CERTIFICADOS.HOME.CARTOLA_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CERTIFICADOS.HOME.CARTOLA_ERROR);
              break;
        }

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.contextoAPP.datosCliente.rut, this.contextoAPP.datosCliente.dv).subscribe((response) => {});
    }

    /**
     * Metodo encargado de volver al home
     */
    volverAlHome() {
        this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
    }

    // Función para navegar a la ruta seleccionada
    navegarRutaNueva() {
    this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
    }

    cerrarModal() {
        this.verModalCertificado = false;
    }
}
