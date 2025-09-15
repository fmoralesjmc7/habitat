import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IonSlides, ModalController, NavController, Platform} from '@ionic/angular';
import { SlidesClass } from 'src/app/classes/slides/slides.class'; 
import { TaxBenefitSimulatorService } from 'src/app/services/api/restful/centro_asesoria/tax-benefit-simulator/tax-benefit-simulator.service'; 
import { DataTaxBenefitSimulation, TaxBenefitSimulation } from 'src/app/interfaces/tax-benefit-simulation';
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component'; 
import { HeaderElements } from 'src/app/interfaces/header-elements';
import { simulatorConstants } from '../simulator/simulator.constant';
import { legalText } from 'src/app/constants/legal-text';
import { taxBenefitSimulatorConstats } from './tax-benefit-simulator.constant'; 
import { CONSTANTE_TEXTO_LEGALES } from 'src/app/constants/constantes-centro-asesoria'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { TrazabilidadService, UtilService } from 'src/app/services'; 
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
    selector: 'app-tax-benefit-simulator',
    templateUrl: './tax-benefit-simulator.page.html',
    styleUrls: ['./tax-benefit-simulator.page.scss'],
})

export class TaxBenefitSimulatorPage extends SlidesClass implements OnInit {
    @ViewChild(IonSlides) public slides: IonSlides;

    readonly CONSTANTES = CONSTANTE_TEXTO_LEGALES;
    public liquidIncomeError = false;
    public apvAmountError = false;
    public ageError = false;
    public simulationResult: TaxBenefitSimulation;
    public regimeSelected: 'A' | 'B';

    public firstDisclaimerApvA: string;
    public firstDisclaimerApvB: string;
    public secondDisclaimerApvA: string;
    public secondDisclaimerApvB: string;

    public showBackButton: boolean = true;
    public showMenuButton: boolean = false;
    public tituloHeader: string;
    public gender: string;
    public age: number;
    public rut: number;
    public dv: string;
    uuid: string;

    constructor(private modalController: ModalController,
                private taxBenefitSimulatorService: TaxBenefitSimulatorService,
                private navCtrl: NavController,
                public platform: Platform,
                public contextoAPP: ContextoAPP,
                private trazabilidadProvider: TrazabilidadService,
                public utilService: UtilService) {
        super(taxBenefitSimulatorConstats, platform, utilService);
        this.form = new FormGroup({
            liquidIncome: new FormControl(null, [Validators.required]),
            apvAmount: new FormControl(null, [Validators.required]),
        });
        this.gender = this.contextoAPP.datosCliente.sexo;
        this.age = this.contextoAPP.datosCliente.edad;
        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
    }

    async ngOnInit() {
        this.uuid = await this.utilService.getStorageUuid();
        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.INIT.CODIGO_OPERACION);
        this.logSimulatorEvent('enter');
        await this.setConfigParameters();
        this.setValidatorLiquidIncome();
        await this.setDisclaimers();

        this.ageError = false;

        this.controls.age.valueChanges.subscribe(() => {
            const ageCtrl = this.controls.age;
            this.ageError = !ageCtrl.pristine && ageCtrl.errors && (ageCtrl.errors.min || ageCtrl.errors.max);
        });

        this.controls.liquidIncome.valueChanges.subscribe((value) => {
            this.setValidatorApvAmount(value);
            const liquidIncomeCtrl = this.controls.liquidIncome;
            this.liquidIncomeError = liquidIncomeCtrl.errors && liquidIncomeCtrl.errors.min;
        });
        this.controls.apvAmount.valueChanges.subscribe(() => {
            const apvAmountCtrl = this.controls.apvAmount;
            this.apvAmountError = apvAmountCtrl.errors && apvAmountCtrl.errors.max;
        });
    }

    public setValidatorLiquidIncome() {
        const {liquidIncome} = this.controls;
        liquidIncome.setValidators([Validators.required, Validators.min(this.configParameters.liquidIncome)]);
        liquidIncome.updateValueAndValidity();
    }

    public setValidatorApvAmount(amount: number) {
        const {apvAmount} = this.controls;
        apvAmount.setValidators([Validators.required, Validators.min(0), Validators.max(amount)]);
        apvAmount.updateValueAndValidity();
    }

    private async setDisclaimers() {
        this.firstDisclaimerApvA = legalText.taxBenefit.disclaimers.apvA_0;
        this.firstDisclaimerApvB = legalText.taxBenefit.disclaimers.apvB_0;
        this.secondDisclaimerApvA = legalText.taxBenefit.disclaimers.apvA_1;
        this.secondDisclaimerApvB = legalText.taxBenefit.disclaimers.apvB_1;
    }


    public async nextSlide() {
        await this.lockSlides(false);
        await this.slides.slideNext();
        this.setupCurrentPage();

        // Registro trasabilidad step 2
        if (this.slideNumber == 1) {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.NEXT_SLIDE.CODIGO_OPERACION);
        }
    }

    public async goBack() {
        // Registramos traza step 1 al volver.
        if (this.slideNumber === 2) {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.GO_BACK1.CODIGO_OPERACION);
        }
        if (this.slideNumber === 1 || this.existResult) {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.GO_BACK0.CODIGO_OPERACION);
            return this.goBackTo('tax-benefit-start');
        }
        this.prevSlide();
    }

    public goBackTo(url: string) {
        this.navCtrl.navigateBack(url);
    }

    public async callService() {
        const {liquidIncome, apvAmount} = this.form.value;
        const dataService: DataTaxBenefitSimulation = {
            liquidIncome,
            apvAmount,
            gender: this.gender === 'M' ? 1 : 2,
            age: this.age,
            pensionAge: this.gender === 'M' ? this.configParameters.maxAgeMen : this.configParameters.maxAgeWomen
        };

        this.taxBenefitSimulatorService.getTaxBenefitSimulation(dataService)
            .then(async (resp) => {
                this.simulationResult = resp;
                if (this.simulationResult) {
                    this.regimeSelected = 'A';
                    this.headerElements = {title: 'Resultados', iconRight: 'btn-icon icon-menu-hamb'};
                    this.showLoading = false;
                    this.existResult = true;
                    this.tituloHeader = "Resultados";
                    this.showBackButton = false;
                    this.showMenuButton = true;

                    const dataString = {
                        rentaLiquida: Number(liquidIncome),
                        ahorroMensual: Number(apvAmount),
                        glosaTraza: "Beneficios Step 3"
                    };

                    const data = JSON.stringify(dataString)
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE.CODIGO_OPERACION, data);
                }else{
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE_ERROR.CODIGO_OPERACION);
                    this.simulationResult = null!;
                    this.existResult = true;
                    this.showLoading = false;
                }
            })
            .catch(async (error) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE_ERROR.CODIGO_OPERACION);
                this.simulationResult = null!;
                this.existResult = true;
                this.showLoading = false;
            });
    }

    public async simulateAgain() {
        this.headerElements = simulatorConstants.headerElements;
        this.simulationResult = null!;
        this.existResult = false;
        this.showBackButton = true;
        this.showMenuButton = false;
        this.tituloHeader = "";
        this.goToFirstPage();
        // Registramos traza step 1
        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.SIMULATE_AGAIN.CODIGO_OPERACION);
    }

    public async showModalLegal() {
        const modal = await this.modalController.create({
            component: ModalInfoComponentCA,
            componentProps: {
                body: legalText.taxBenefit.bRegime,
                headerElements: {
                    title: 'Textos legales'
                } as HeaderElements
            }
        });
        return await modal.present();
    }

    public changeRegime(regime: 'A' | 'B') {
        this.regimeSelected = regime;

        const {liquidIncome, apvAmount} = this.form.value;
        const dataString = {
            rentaLiquida: Number(liquidIncome),
            ahorroMensual: Number(apvAmount),
            beneficio: this.regimeSelected,
            glosaTraza: "Comparador de benf APV"
        };

        const data = JSON.stringify(dataString)
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CHANGE_REGIME.CODIGO_OPERACION, data);

    }

    public clickErrorButtons(button: 'first' | 'second') {
        button === 'first' ? this.doSimulation() : this.goBack();
    }

    public scrollToBottom() {
        this.content.scrollToBottom(300);
    }

    public async doSimulation() {
        if (this.form.invalid) {
            return;
        }
        this.logSimulatorEvent('simulate');
        this.existResult = false;
        this.showLoading = true;
        this.headerElements = {};
        this.callService();
    }

    /**
    * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    * @param datos 
    */
    async registrarTrazabilidad(codigoOperacion: number, datos?: any) {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CENTRO,
            uuid : this.uuid,
            rut: this.rut,
            dv: this.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.INIT.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.INIT);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.NEXT_SLIDE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.NEXT_SLIDE);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.GO_BACK1.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.GO_BACK1);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.GO_BACK0.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.GO_BACK0);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE);
              parametroTraza.datos = datos;
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CALL_SERVICE_ERROR);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.SIMULATE_AGAIN.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.SIMULATE_AGAIN);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CHANGE_REGIME.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENEFIT_SIMULATOR.CHANGE_REGIME);
              parametroTraza.datos = datos;
              parametroTraza.codigoSistema = 13;
              break;
          }

        this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }
}
