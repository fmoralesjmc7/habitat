import {SimulacionService} from './../../../services/api/restful/simulacion.service';
import {Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {MenuController, LoadingController, NavController} from '@ionic/angular';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Content} from '@angular/compiler/src/render3/r3_ast';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {NavigationExtras} from '@angular/router';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { Keyboard } from '@capacitor/keyboard';
import { UtilService } from '../../../../../src/app/services';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
    selector: 'app-home-invitado',
    templateUrl: './home-invitado.page.html',
    styleUrls: ['./home-invitado.page.scss'],
})
export class HomeInvitadoPage implements OnInit {

    @ViewChildren('parentInput', {read: ElementRef}) parentInput: QueryList<ElementRef>
    @ViewChild('parentContent') parentContent: ElementRef;
    userInvitado: any;
    content: Content;
    edad: number;
    renta: string;
    saldo: string;
    sexo: string;
    esMujer: boolean;
    form: FormGroup;
    minHeight: boolean;
    infoRemIsOpen = false;
    infoSaldoIsOpen = false;


    showRemuneracionBruta: boolean;
    showSaldoDisponible: boolean;

    infoRem = 'Es la renta bruta imponible sobre la cual se calcula el monto a pagar por concepto de impuestos y/o leyes sociales como previsión y salud.';
    infoSaldo = 'Es el saldo acumulado en tu Cuenta Obligatoria hasta la fecha.';

    DECIMAL_SEPARATOR = ",";
    GROUP_SEPARATOR = ".";

    public numberMask = createNumberMask({
        thousandsSeparatorSymbol: '.'
    });

    constructor(
        private menuCtrl: MenuController,
        private fb: FormBuilder,
        private navCtrl: NavController,
        private menu: MenuController,
        private loading: LoadingController,
        private simulacionProvider: SimulacionService,
        private contextoAPP: ContextoAPP,
        private utilService: UtilService
    ) {
        this.edad = 18;
        this.esMujer = false;
        this.sexo = '';
        this.form = this.fb.group({
            age: new FormControl(18, {validators: [Validators.required]}),
            gender: new FormControl(''),
            salary: new FormControl('', {validators: [Validators.required]}),
            balance: new FormControl('', {validators: [Validators.required]})
        });
        this.minHeight = false;
        this.utilService.setLogEvent('event_habitat', {option: 'Acceso_como_Invitado'});
    }


    toggleMenu() {
        this.menuCtrl.toggle();
    }

    cambioRangoEdad() {
        this.showRemuneracionBruta = false;
        this.showSaldoDisponible = false;
        this.sexo = '';
        this.validForm();
    }

    cambioSexo(sexo: string) {
        this.sexo = sexo;
        this.showRemuneracionBruta = true;
    }

    ngOnInit() {
        this.menuCtrl.enable(true);
    }

    async simulacionLigth() {
        const loading = await this.contextoAPP.mostrarLoading();
        const rentaAPI = parseInt(this.renta.toString().replace(/\D/g, ''));
        const saldoAPI = parseInt(this.saldo.toString().replace(/\D/g, ''));

        this.simulacionProvider.lightSinAPV(this.edad, this.sexo, rentaAPI, saldoAPI).subscribe(
            (data) => {
                this.utilService.setLogEvent('event_habitat', {option: 'Calculo_Simulador_Publico'});
                this.contextoAPP.ocultarLoading(loading);
                this.userInvitado = data;
                this.userInvitado.edad = this.edad;
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        data: JSON.stringify(this.userInvitado)
                    }
                };
                this.navCtrl.navigateForward(['HomeInvitadoStep2Page'], navigationExtras);

            }, (error) => {
                this.contextoAPP.ocultarLoading(loading);
                this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.homeInvitado));
            }
        );
    }

    blurElementRenta(input: string) {
        if (input === 'remuneracion' && this.renta) {
            this.showSaldoDisponible = true;
        }
        if (this.minHeight) {
            this.minHeight = false;
        } else {
            this.minHeight = true;
        }
        this.renta = this.contextoAPP.limpiaCaracteres(this.renta).toString();

    }

    blurElementSaldo() {
        if (this.minHeight) {
            this.minHeight = false;
        } else {
            this.minHeight = true;
        }
        this.saldo = this.contextoAPP.limpiaCaracteres(this.saldo).toString();
    }

    focusElement() {
        if (this.minHeight) {
            this.minHeight = false;
        } else {
            this.minHeight = true;
        }
    }

    format(valString) {
        if (!valString) {
            return '';
        }
        valString = valString.toString().replace("$", "");
        const parts = this.unFormat(valString).split(this.DECIMAL_SEPARATOR);
        return '$' + new Intl.NumberFormat('es-CL').format(parts[0]) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
    }

    unFormat(val) {
        if (!val) {
            return '';
        }
        val = val.replace(/^0+/, '');

        if (this.GROUP_SEPARATOR === ',') {
            return val.replace(/,/g, '');
        } else {
            return val.replace(/\./g, '');
        }
    }

    validaSoloNumeros(event: any) {
        const key = Number(event.key);
        if (isNaN(key)) {
            return false;
        } else {
            return true;
        }
    }

    cambioFoco() {
        this.showSaldoDisponible = true;
        Keyboard.hide()
    }

    enviarForm() {
        this.simulacionLigth();
    }

    /**
     * Valida que el boton "Calcular", solo se active cuando
     * los campos han sido completados
     */
    validForm() {
        if (!this.renta || !this.saldo) {
            return false;
        } else {
            return true;
        }


    }
}
