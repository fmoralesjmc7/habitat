import {Component, OnInit} from '@angular/core';
import {AlertController,NavController} from '@ionic/angular';
import {ClienteService, ClienteDatos, TrazabilidadService, UtilService} from '../../../services/index';
import {ActivatedRoute, NavigationExtras} from "@angular/router";
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CambioFondoService } from 'src/app/services/api/restful/cambioFondo.service'; 
import {AppComponent} from "../../../app.component";
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { CONSTANTES_CAMBIO_FONDO } from '../util/constantes.cambio';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';

@Component({
    selector: 'app-cambio-fondo-step-2',
    templateUrl: './cambio-fondo-step-2.page.html',
    styleUrls: ['./cambio-fondo-step-2.page.scss'],
})
export class CambioFondoStep2Page implements OnInit {

    productosClientesModificados: any[];
    rut: number;
    dv: string;
    email: string;
    textInformativo: string = 'Según normativa de la Superintendencia de Pensiones, el plazo de materialización de  4 días hábiles puede variar en caso que el total de solicitudes de cambios de fondos supere el 5% del patrimonio del respectivo fondo. En esta circunstancia, las administradoras deben materializar dicho cambio, traspasando diariamente hasta el 5% del total del patrimonio vigente. De esta forma, se harán efectivas en primer lugar las solicitudes de cambios de fondos más antiguos (Fecha y Hora) hasta completar, en los días hábiles siguientes, el total de cambios suscritos por los afiliados.';
    truncarTexto: boolean = true;
    envioCambioDeFondo: boolean = false; //Validacion para asegurar que solo se enviará una solicitud de cambio o distribucion de fondos

    envioCorreoExito = 'OSB-PR-000'; //Respuesta exitosa para envio de correo

    /**
     * Almacena el texto del porcentaje 100%
     */
    porcentajeCien: string = '100%';

    /**
    * Uuid de trazas
    */
    uuid: string;

    constructor(
        private clienteService: ClienteService,
        private cambioFondoService: CambioFondoService,
        private clienteDatos: ClienteDatos,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private trazabilidadService: TrazabilidadService,
        private route: ActivatedRoute,
        private utilService: UtilService,
        private contextoApp: ContextoAPP
    ) {
        this.route.queryParams.subscribe(params => {
            this.productosClientesModificados = JSON.parse(params.productos);
        });
    }

    async ngOnInit() {
        this.clienteDatos.rut.subscribe(rut => {
            this.rut = rut;
        });
        this.clienteDatos.dv.subscribe(dv => {
            this.dv = dv;
        });
        this.clienteDatos.email.subscribe(email => {
            this.email = email;
        });
        this.utilService.mostrarToast('Importante: esta solicitud se materializará al cuarto día hábil siguiente a la fecha de suscripción.');

        this.uuid = await this.utilService.getStorageUuid();
    }

    generarBodyCDF() {
        let bodyCDF: any = {
            "canal": 16,
            "usuarioAuditoria": "APPMOBILE"
        };

        let productos: any[] = new Array();
        this.productosClientesModificados.forEach((producto: any) => {
            let objectProducto: any = {
                "nombreProducto": producto.codigoProducto,
                "esCambioFondo": producto.esCambioFondo ? true : false,
            };

            let fondosOrigen: any[] = new Array();
            producto.fondos.forEach((fondo: any) => {
                let origen: any = {
                    "idCuenta": fondo.idCuenta,
                    "idFondo": fondo.idFondo
                };
                fondosOrigen.push(origen);
            });

            let fondosDestino: any[] = new Array();

            if (producto.esCambioFondo) {
                let destino: any = {
                    "idFondo": producto.fondoRecaudador.id
                };
                fondosDestino.push(destino);
            } else if (producto.esDistribucionFondo) {
                producto.nuevaDistribucion.forEach((fondo: any) => {
                    let destino: any = {
                        "idFondo": fondo.idFondo,
                        "porcentajeDistribucion": parseInt(fondo.porcentaje),
                        "esRecaudador": (producto.fondoRecaudador.id === fondo.idFondo) ? true : false
                    };
                    fondosDestino.push(destino);
                });
            }

            objectProducto.origen = fondosOrigen;
            objectProducto.destino = fondosDestino;
            productos.push(objectProducto);
        });

        bodyCDF.productos = productos;
        bodyCDF.correoCliente = this.email != null ? this.email : "";
        
        return bodyCDF;
    }

    async generarSolicitudCDF() {
        const loading = await this.contextoApp.mostrarLoading();
        if (this.envioCambioDeFondo == true) {
            this.contextoApp.ocultarLoading(loading);
            return;
        }

        //Solo entra a llamada de servicios si es la primera petición
        this.envioCambioDeFondo = true;
        let bodyCDF = this.generarBodyCDF();
        let numerosFolio: string = '';
        let indiceFolios = -1;

        this.cambioFondoService.solicitudCDF(bodyCDF, this.rut, this.dv).subscribe((responseSolicitudCDF: any) => {
            let existeCorreo = this.email != null && this.email != undefined && this.email != '';
            if (responseSolicitudCDF.estado_exito === 'true' && responseSolicitudCDF.pdf !== '') {
                // Calculo de folios
                responseSolicitudCDF.numeros_folio.forEach((elemento: any) => {
                    if (indiceFolios == -1) {
                        numerosFolio = numerosFolio + elemento.numero_folio;
                    } else {
                        numerosFolio = numerosFolio + ', ' + elemento.numero_folio;
                    }
                    indiceFolios++;
                });

                AppComponent.descargaPDF = responseSolicitudCDF.pdf;
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        correoExitoso: existeCorreo,
                        productos: JSON.stringify(this.productosClientesModificados),
                        numeroFolio: numerosFolio
                    }
                };
                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateForward(['CambioFondoStep_3Page'], navigationExtras);
            } else {
                this.utilService.mostrarToast(responseSolicitudCDF.mensaje_error);
                this.contextoApp.ocultarLoading(loading);
                this.navCtrl.navigateForward(['ErrorGenericoPage'], this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.cambioFondos));
            }
        }, async (error) => {
            this.contextoApp.ocultarLoading(loading);
            await this.registrarTrazabilidad();
            this.utilService.setLogEvent('event_habitat', {option: 'Paso_2_ERROR_Solicitar_Cambio_Distribucion_Fondos'});
            this.navCtrl.navigateForward(['ErrorGenericoPage'], this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.cambioFondos));
        });
    }

    cancelarSolicitudCDF() {

        const confirm = this.alertCtrl.create({
            header: '¡Importante!',
            message: 'Al continuar, perderás los datos ya ingresados.',
            buttons: [
                {
                    text: 'CANCELAR',
                    handler: () => {}
                },
                {
                    text: 'CONTINUAR',
                    handler: () => {
                        this.navCtrl.navigateRoot(['HomeClientePage']);
                    }
                }
            ]
        }).then(confirmData => confirmData.present());

    }

    moreMethod() {
        if (this.truncarTexto == true) {
            this.truncarTexto = false;
        } else {
            this.truncarTexto = true;
        }
    }

    lessMethod() {
        if (this.truncarTexto == false) {
            this.truncarTexto = true;
        } else {
            this.truncarTexto = false;
        }
    }

    /**
     * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
     */
    async registrarTrazabilidad() {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        
        const datosGenerales = {
            traza : CONSTANTES_CAMBIO_FONDO,
            uuid : this.uuid,
            rut: this.rut,
            dv: this.dv,
        }
        parametroTraza.uuid = '';
        parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_CAMBIO_FONDO.STEP2.ERROR_SOLICITUD);

        this.trazabilidadService.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }
}