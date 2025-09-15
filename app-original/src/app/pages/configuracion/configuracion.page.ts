import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import { ClienteDatos, UtilService } from 'src/app/services'; 
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import { CONSTANTES_ACTIVACION_BIOMETRIA } from './util/configuracion.constantes'; 

@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.page.html',
    styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionComponent implements OnInit {

    /**
     * Flag huella activa
     */
    huellaEstaActiva = false;

    /**
     * Flag estado switch
     */
    estadoSwitch = false;

    /**
     * Flag login hibrido
     */
    loginHibrido = false;

    constantes = CONSTANTES_ACTIVACION_BIOMETRIA;

    /**
     * Tipo de biometria a desplegar
     */
    textoTipoBiometria =  this.constantes['biometric'];

    constructor(
        private clienteDatos: ClienteDatos,
        private faio: FingerprintAIO,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private utilService: UtilService
    ) {
        this.subscribeCacheDatosCliente();
    }

    /**
     * Metodo encargado de obtener estado huella de datos cliente.
     */
    subscribeCacheDatosCliente(): void {
        this.clienteDatos.huellaActiva.subscribe(huellaActiva => {
            this.huellaEstaActiva = huellaActiva;
        });
        this.clienteDatos.loginHibrido.subscribe(loginHibrido => {
            this.loginHibrido = loginHibrido;
        });
    }

    /**
     * metodo inicial del componente
     */
    ngOnInit(): void {
        this.faio.isAvailable()
            .then((responseHuella: string) => {
                this.procesarBiometria(responseHuella);
            }).catch(() => {
                this.utilService.getStorageData(this.constantes.estadoHuella, false).then((responseStorageHuella: string) => {
                const res: boolean = (responseStorageHuella === this.constantes.glosaHuella);
                this.estadoSwitch = !res;
                this.huellaEstaActiva = res;
            }).catch(() => {
                this.estadoSwitch = true;
            });
        });
    }

    /**
     * Metodo encargado de procesar el switch de biometria 
     * 
     * @param responseHuella del pluggin de biometria
     */
    procesarBiometria(responseHuella: string): void {
        this.textoTipoBiometria = CONSTANTES_ACTIVACION_BIOMETRIA[responseHuella];

        this.utilService.getStorageData(this.constantes.parametroHuella, false).then((responseStorage: string) => {
            this.estadoSwitch = false;
            const res: boolean = (responseStorage === this.constantes.huellaActiva);
            this.huellaEstaActiva = res;
            this.clienteDatos.setHuellaActiva(res);
        });

        this.estadoSwitch = false;
    }

    /**
     * Metodo que enciende el login con biometria
     */
    switchOn(): void {
        this.utilService.getStorageData(this.constantes.parametroHuella, false).then((responseStorage: string) => {
            if (this.huellaEstaActiva) {
                if (responseStorage === this.constantes.huellaActiva) {
                    this.clienteDatos.setHuellaActiva(true);
                } else {
                    this.utilService.setStorageData(this.constantes.parametroHuella, this.constantes.huellaNoActiva, false);
                    this.mostrarMensajeActivacionHuella();
                }
            } else {
                this.huellaEstaActiva = false;
                this.clienteDatos.setHuellaActiva(false);
                this.utilService.setStorageData(this.constantes.parametroHuella, this.constantes.huellaNoActiva, false);
            }
        }).catch(() => {
            this.clienteDatos.setHuellaActiva(false);
        });
    }

    /**
     * Metodo aceptar activación biometria
     */
    cambiarSwitchAceptar(): void {
        this.huellaEstaActiva = true;
        this.utilService.setStorageData(this.constantes.parametroHuella, '', false);
    }

    /**
     * Metodo cancelar activación biometria
     */
    cambiarSwitchCancelar(): void {
        this.huellaEstaActiva = false;
        this.clienteDatos.setHuellaActiva(false);
        this.utilService.setStorageData(this.constantes.parametroHuella, this.constantes.huellaNoActiva, false);
    }

    /**
     * Metodo encargado de levantar popup de activación de biometria
     */
    mostrarMensajeActivacionHuella(): void {
        const titulo = `${this.constantes.tituloActivacion} ${this.textoTipoBiometria}`;
        const mensaje = this.constantes.mensajeActivacion;
        const botones: any[] = [
            {
                text: this.constantes.botonCancelar,
                handler: () => {
                    this.cambiarSwitchCancelar();
                }
            },
            {
                text: this.constantes.botonAceptar,
                handler: () => {
                    this.cambiarSwitchAceptar();
                }
            },
        ];
        this.mostrarAlert(titulo, mensaje, botones);
    }

    /**
     * Boton volver atrás
     */
    backButton(): void {
        this.navCtrl.pop();
    }

    /**
     * Muestra alert con datos ingresados
     * @param titulo
     * @param mensaje
     * @param botones
     */
    async mostrarAlert(titulo: string, mensaje: string, botones: any[]): Promise<void> {
        const alert = await this.alertCtrl.create({
            header: titulo,
            message: mensaje,
            buttons: botones
        });
        await alert.present();
    }
}
