import {Component, OnInit} from '@angular/core';

import {NavController} from '@ionic/angular';
import {ClienteDatos, ClienteService, UtilService} from '../../services/index';
import {DatePipe} from '@angular/common';

import {ActivatedRoute} from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { Keyboard } from '@capacitor/keyboard';
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-clave-sacu',
    templateUrl: './clave-sacu.page.html',
    styleUrls: ['./clave-sacu.page.scss'],
})
export class ClaveSacuPage implements OnInit {

    /**
     * Constantes utilizadas para codigo html.
     */
    TITLE_GIRO = 'Giro de Ahorro';
    TITLE_CDF = 'Cambio y Distribución de Fondos';
    TEXT_GIRO = 'Antes de comenzar con tu Giro de Ahorro, debes ingresar tu';
    TEXT_CDF = 'Antes de comenzar con tu Cambio y Distribución de Fondos, debes ingresar tu';
    COMMENT = 'Clave de Seguridad';
    QUESTION_LABEL = 'Ingresa tu Clave de Seguridad';
    QUESTION_FORGET = '¿Olvidaste tu clave?';
    BTN_NEXT = 'Continuar';
    INFO_TXT_CLAVE_SEG = 'Es tu clave alfanumérica de 6 a 10 caracteres.';

    /**
     * Constantes utilizadas para mensajes toast.
     */
    MSJ_CLIENTE_SIN_CLAVE = 'Según nuestros registros, no tienes Clave de Seguridad. Solicítala ahora.';
    MSJ_CLIENTE_CLAVE_BLOQUEDA = 'Importante: Según nuestros registros tu Clave de Seguridad está bloqueada. Recupérala aquí.';
    MSJ_CLIENTE_CLAVE_INACTIVA = 'Importante: Según nuestros registros tu Clave de Seguridad no está activada. Solicítala ahora.';
    MSJ_CLIENTE_CLAVE_ERRONEA_PARTE_1 = 'Intento ';
    MSJ_CLIENTE_CLAVE_ERRONEA_PARTE_2 = ' de ';
    MSJ_CLIENTE_CLAVE_ERRONEA_PARTE_3 = ' La Clave de Seguridad ha sido ingresada de manera incorrecta. Vuelve a intentarlo.';

    TIPO_PANTALLA_CDF: string = "CambioFondoStep_1Page";
    TIPO_PANTALLA_GIRO: string = "GiroStepUnoPage";

    /**
     * Variables utilizadas para comportamiento de clave SACU.
     */
    title: string;
    text: string;
    contador = 0;
    rut: number;
    dv: string;
    intentosMaximos = 4;
    clave: string;
    clavePreviredBloqueada = true;
    ingresoClaveSACU = true;
    infoClaveSegIsOpen = false;
    minHeight = false;
    btnAlign = false;
    urlSACU = 'https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=ADMSACU';
    origenDeIngreso: number;
    paginaDeDestino: string;
    validarClaveTraspaso: boolean;

    keyCod = 13;//Constante boton ir

    constructor(
        private navCtrl: NavController,
        private clienteDatos: ClienteDatos,
        private clienteProvider: ClienteService,
        private utilService: UtilService,
        private contextoApp: ContextoAPP,
        private datePipe: DatePipe,
        private route: ActivatedRoute) {

        /**
         * Recibe datos de usuario al inicializar vista mediante ruta
         */
        this.route.queryParams.subscribe(params => {
            this.origenDeIngreso = JSON.parse(params.option);
            if (this.origenDeIngreso === 1) {
                this.title = this.TITLE_CDF;
                this.text = this.TEXT_CDF;
                this.paginaDeDestino = this.TIPO_PANTALLA_CDF;
            } else if (this.origenDeIngreso === 2) {
                this.title = this.TITLE_GIRO;
                this.text = this.TEXT_GIRO;
                this.paginaDeDestino = this.TIPO_PANTALLA_GIRO;
            }
        });

        window.addEventListener('keyboardDidHide', () => {
            this.keyboardOff();
        });
    }

    async ngOnInit() {
        this.infoClaveSegIsOpen = false;
        this.contadorReintentosPorDia();
        this.clienteDatos.rut.subscribe(rut => {
            this.rut = rut;
        });
        this.clienteDatos.dv.subscribe(dv => {
            this.dv = dv;
        });

        if(this.paginaDeDestino === this.TIPO_PANTALLA_CDF){
            //26-10-2020
            //AArce no se valida estados inicial sacu para cdf / fix por ff
            this.clavePreviredBloqueada = false;
        }else {
            this.validarEstadSacu();
        }
    }

    /**
     * Encargado de validar clave sacu.
     */
    async validarEstadSacu(): Promise<void>{
        const loading = await this.contextoApp.mostrarLoading();
        
        // codigo 20 para validar estado clave sacu
        this.clienteProvider.administrarClavePrevired(this.rut, this.dv, '', '20').subscribe((response20) => {
            if (response20.estado_actual === '03') {
                const fechaActual: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy')!;
                /**
                 * Se agrega reseteo de contador en el caso de que ya se hayan utilizado los intentos posibles
                    y al ingresar al modulo el servicio retorne que la clave ya no se encuentra bloqueada
                */
                if (this.contador >= this.intentosMaximos) {
                    this.contador = 0;
                    this.utilService.setStorageData('fecha-reintento-sacu', fechaActual, false);
                    this.utilService.setStorageData('contador-reintento-sacu', this.contador.toString(), false);
                }
                //validar clave de traspaso / codigo 41
                this.clienteProvider.administrarClavePrevired(this.rut, this.dv, '', '41').subscribe((response41) => {
                    if (response41.estado_actual === '22') {
                        // codigo 42 , actualizar clave de traspaso
                        this.validarClaveTraspaso = true;
                    } else {
                        this.contextoApp.ocultarLoading(loading);
                    }
                }, (error) => {
                    this.contextoApp.ocultarLoading(loading);
                });
                this.clavePreviredBloqueada = false;
            } else if (response20.estado_actual === '00') {
                this.utilService.mostrarToastConLink(this.MSJ_CLIENTE_SIN_CLAVE, this.urlSACU);
                this.clavePreviredBloqueada = true;
                this.contextoApp.ocultarLoading(loading);
            } else if (
                response20.estado_actual === '04' || response20.estado_actual === '05' ||
                response20.estado_actual === '06' || response20.estado_actual === '08'
            ) {
                this.utilService.mostrarToastConLink(this.MSJ_CLIENTE_CLAVE_BLOQUEDA, this.urlSACU);
                this.clavePreviredBloqueada = true;
                this.contextoApp.ocultarLoading(loading);
            } else {
                this.utilService.mostrarToastConLink(this.MSJ_CLIENTE_CLAVE_INACTIVA, this.urlSACU);
                this.clavePreviredBloqueada = true;
                this.contextoApp.ocultarLoading(loading);
            }
        }, (error) => {
            const redireccion = this.origenDeIngreso === 1 ? CONSTANTES_ERROR_GENERICO.cambioFondos: CONSTANTES_ERROR_GENERICO.giroAhorro;
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(redireccion));
            this.contextoApp.ocultarLoading(loading);
        });
    }

    /**
     * Encargado de actualizar clave de traspaso al momento de autenticar
     */
    async actualizarClaveTraspaso(){
        if(!this.validarClaveTraspaso){
            return;
        }

        const loading = await this.contextoApp.mostrarLoading();
        this.clienteProvider.administrarClavePrevired(this.rut, this.dv, '', '42').subscribe((response42) => {
            this.contextoApp.ocultarLoading(loading);
        }, (error) => {
            this.contextoApp.ocultarLoading(loading);
        });
    }

    contadorReintentosPorDia() {
        const fechaActual: string = this.datePipe.transform(new Date(), 'dd-MM-yyyy')!;
        this.utilService.getStorageData('fecha-reintento-sacu', false).then((fecha) => {
            if (fecha === fechaActual) {
                this.utilService.getStorageData('contador-reintento-sacu', false).then((count) => {
                    this.contador = +count * 1;
                });
            } else {
                this.contador = 0;
                this.utilService.setStorageData('fecha-reintento-sacu', fechaActual, false);
                this.utilService.setStorageData('contador-reintento-sacu', this.contador.toString(), false);
            }
        });
    }

    /**
     * Aumenta contador de intentos sacu
     */
    incrementoContador() {
        this.contador = this.contador + 1;
        this.utilService.setStorageData('contador-reintento-sacu', this.contador.toString(), false);
    }

    /**
     * Encargado de validar clave sacu y redirigir a siguiente pantalla (cdf,giros)
     */
    validarClavePrevired() {
        this.incrementoContador();
        this.actualizarClaveTraspaso();

        let codigoTransaccion = '04';
        if (this.contador >= this.intentosMaximos) {
            codigoTransaccion = '10';
            this.clavePreviredBloqueada = true;
        }
        this.clienteProvider.administrarClavePrevired(this.rut, this.dv, this.clave, codigoTransaccion).subscribe((response: any) => {
            if (response.codigo_control === '9050' && response.estado_actual === '03') {
                this.utilService.setStorageData('contador-reintento-sacu', '0', false);
                this.contador = 0;
                this.utilService.setLogEvent('event_habitat', {option: 'Acceso_Clave_de_Seguridad'});
                this.navCtrl.navigateForward([this.paginaDeDestino]);
            } else if (response.codigo_control === '9500' || response.codigo_control === '9530') {
                this.utilService.setLogEvent('event_habitat', {option: 'Acceso_Clave_Seguridad_Incorrecta'});
                this.muestraMensajeSegunContador(this.contador);
            } else if (response.codigo_control === '9050' && response.estado_actual === '08') {
                this.utilService.setLogEvent('event_habitat', {option: 'Acceso_Clave_Seguridad_Bloqueada'});
                this.utilService.mostrarToastConLink(this.MSJ_CLIENTE_CLAVE_BLOQUEDA, this.urlSACU);
            } else {
                this.utilService.setLogEvent('event_habitat', {option: 'Acceso_Clave_Seguridad_No_Controlado'});
                this.utilService.mostrarToast(this.MSJ_CLIENTE_CLAVE_INACTIVA);
            }
        }, (error) => {
            const redireccion = this.origenDeIngreso === 1 ? CONSTANTES_ERROR_GENERICO.cambioFondos: CONSTANTES_ERROR_GENERICO.giroAhorro;
            this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(redireccion));
        });
    }

    muestraMensajeSegunContador(count: number) {
        if (count < this.intentosMaximos) {
            this.utilService.mostrarToast(this.MSJ_CLIENTE_CLAVE_ERRONEA_PARTE_1 + count + this.MSJ_CLIENTE_CLAVE_ERRONEA_PARTE_2 + (this.intentosMaximos - 1) + this.MSJ_CLIENTE_CLAVE_ERRONEA_PARTE_3);
        } else {
            this.utilService.mostrarToastConLink(this.MSJ_CLIENTE_CLAVE_BLOQUEDA, this.urlSACU);
        }
    }

    detectaClaveSACU() {
        if (this.clave !== null && this.clave.length > 5) {
            this.ingresoClaveSACU = false;
        } else {
            this.ingresoClaveSACU = true;
        }
    }

    detectaBotonIr(keyCode: number) {
        if (keyCode === this.keyCod) {
            if (!this.clavePreviredBloqueada || !this.ingresoClaveSACU) {
                Keyboard.hide();
                this.validarClavePrevired();
            } else {
                Keyboard.hide();
            }
        }
    }

    abrirPaginaSACU() {
        this.utilService.openWithSystemBrowser(this.urlSACU);
    }

    openHelp() {
        this.infoClaveSegIsOpen = true;
    }

    backButton() {
        this.navCtrl.pop();
    }

    keyboardOn() {
        this.btnAlign = true;
    }

    keyboardOff() {
        this.btnAlign = false;
    }

    /**
     * Metodo encargado de volver al home
     */
    volverAlHome() {
        this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
    }

}
