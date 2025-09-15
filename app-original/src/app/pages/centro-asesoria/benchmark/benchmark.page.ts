import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IonSlides, ModalController, NavController, Platform} from '@ionic/angular';
import { ProfitabilityServiceData } from 'src/app/interfaces/profitability-service-data'; 
import { ProfitabilityService } from 'src/app/services/api/restful/centro_asesoria/profitability/profitability.service'; 
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component';
import { ModalFilterComponentCA } from 'src/app/components/ca-modal-filter/modal-filter.component'; 
import { HeaderElements } from 'src/app/interfaces/header-elements';
import { legalText } from 'src/app/constants/legal-text';
import {benchmarkConstants} from './benchmark.constant';
import { SlidesClass } from 'src/app/classes/slides/slides.class'; 
import { DataRatio, DataCheckbox } from 'src/app/interfaces/data-modal-filter'; 
import { CONSTANTE_TEXTO_LEGALES } from 'src/app/constants/constantes-centro-asesoria'; 
import { QuestionSlideComponentCA } from 'src/app/components/ca-question-slide/question-slide.component'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { TrazabilidadService, UtilService } from 'src/app/services'; 
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
    selector: 'app-benchmark',
    templateUrl: './benchmark.page.html',
    styleUrls: ['./benchmark.page.scss'],
})
export class BenchmarkPage extends SlidesClass implements AfterViewInit {

    @ViewChild('slideMontoAhorrado') slideMontoAhorrado: QuestionSlideComponentCA;
    @ViewChild(IonSlides) public slides: IonSlides;

    readonly CONSTANTES = CONSTANTE_TEXTO_LEGALES;
    public showDifference = false;
    public showSpinner = false;
    public simulationResult;
    public filters: string[] = [];
    public pickerOptions = benchmarkConstants.pickerOptions;
    public lastValues = {};
    public afpCompare: string;
    public afps: any[] = [];
    public displayAfp: string[] = [];
    public funds: string[] = benchmarkConstants.funds!;
    public periods: number[] = benchmarkConstants.periods!;
    public lastSelectedAfp: string;
    public differenceValue = {
        number: 0,
        sign: ''
    };
    public currentValues = {
        fund: '',
        period: 0
    };

    public rut: number;
    public dv: string;
    uuid: string;

    constructor(private modalController: ModalController,
                private navCtrl: NavController,
                private profitabilityService: ProfitabilityService,
                public platform: Platform,
                private changeDetector: ChangeDetectorRef,
                private trazabilidadProvider: TrazabilidadService,
                public contextoAPP: ContextoAPP,
                public utilService: UtilService) {
        super(benchmarkConstants, platform, utilService);
        this.form = new FormGroup({
            amount: new FormControl('', [Validators.required, Validators.min(1)]),
            pensionFund: new FormControl('', [Validators.required]),
            period: new FormControl(15, [Validators.required])
        });

        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;
    }

    async ngOnInit(){
        this.uuid = await this.utilService.getStorageUuid();
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.INIT.CODIGO_OPERACION);
    }

    public goBack() {
        if ((this.slideNumber === 1) || this.existResult) {
            return this.goToBenchmarkStart();
        }
        this.prevSlide();
    }

    public async nextSlide() {
        await this.lockSlides(false);
        await this.slides.slideNext();
        this.setupCurrentPage();

        // Registro trasabilidad

        if (this.slideNumber == 1) {
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.NEXT_SLIDE.CODIGO_OPERACION);
        }
    }


    public changePensionFund(fundValue: string) {
        if (this.controls.pensionFund.value === fundValue) {
            return;
        }
        this.controls.pensionFund.setValue(fundValue);
    }

    public changePeriod(periodValue: number) {
        if (this.controls.period.value === periodValue) {
            return;
        }
        this.controls.period.setValue(periodValue);
    }

    public goToBenchmarkStart() {
        this.navCtrl.navigateBack('benchmark-start');
    }

    public goToHome() {
        this.navCtrl.navigateRoot('home-centro-asesoria');
    }

    public async callService() {
        const {amount, pensionFund, period} = this.form.value;
        this.currentValues = {fund: pensionFund, period};
        this.setFilters(pensionFund, period);
        const simulationData: ProfitabilityServiceData = {
            amount,
            pensionFund,
            period
        };


        this.profitabilityService.resultSimulation(simulationData)
            .then(async (resp) => {
                this.simulationResult = resp;
                if (this.simulationResult) {
                    this.setLastValues(this.simulationResult);
                    this.setAfps(this.simulationResult);
                    this.headerElements = {title: 'Resultados', iconLeft: 'btn-icon funnel', iconRight: 'btn-icon icon-menu-hamb'};
                    this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE.CODIGO_OPERACION);
                }else{
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE_ERROR.CODIGO_OPERACION);
                    this.headerElements = {};
                }
                this.showLoading = false;
                this.existResult = true;
            })
            .catch(async (error) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE_ERROR.CODIGO_OPERACION);
                this.headerElements = {};
                this.showLoading = false;
                this.existResult = true;
            });
    }

    public async goToFirstSlide() {
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.GO_TO.CODIGO_OPERACION);
        this.simulationResult = null;
        this.existResult = false;
        this.goToFirstPage();
    }

    private setLastValues(historicalData) {
        Object.keys(historicalData).forEach((key) => {
            const years = Object.keys(historicalData[key]);
            const positionLastYear = years.length - 1;
            const lastValue = years[positionLastYear];
            this.lastValues[key] = historicalData[key][lastValue];
        });
    }

    private setAfps(historicalData) {
        Object.keys(historicalData).forEach((key) => {
            this.afps.push({name: key, checked: true});
            if (key === 'habitat') {
                return this.displayAfp.unshift(key);
            }
            this.displayAfp.push(key);
        });
    }

    public changeDifference(afpName: string) {
        this.showDifference = true;
        this.afpCompare = afpName;
        const difference = this.lastValues['habitat'] - this.lastValues[this.afpCompare];
        this.differenceValue.number = Math.abs(difference);
        this.differenceValue.sign = difference === 0 ? '' : difference > 0 ? '+' : '-';
        this.lastSelectedAfp = afpName;
        this.changeDetector.detectChanges();
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CHANGE_DIFFERENCE.CODIGO_OPERACION);
    }

    public async showModalInfo() {
        const legalTextFirestore = this.CONSTANTES.simulador_rentabilidad_afp;
        // Fix firestoreService
        //await this.firestoreService.getDataFirestore('textos_legales', 'simulador_rentabilidad_afp');
        const modal = await this.modalController.create({
            component: ModalInfoComponentCA,
            componentProps: {
                body: legalTextFirestore !== null ? legalTextFirestore : legalText.benchmark,
                headerElements: {
                    title: 'Textos legales'
                } as HeaderElements
            }
        });
        return await modal.present();
    }

    public async showModalFilters() {
        const modal = await this.modalController.create({
            component: ModalFilterComponentCA,
            componentProps: {
                dataCheckbox: [
                    {
                        list: this.afps,
                        title: 'Selecciona una o varias AFP',
                        type: 'afps'
                    } as DataCheckbox
                ],
                dataRatio: [
                    {
                        list: this.funds,
                        title: 'Selecciona un fondo',
                        type: 'fund',
                        currentValue: this.controls.pensionFund.value
                    } as DataRatio,
                    {
                        list: this.periods,
                        title: 'Selecciona un período',
                        type: 'period',
                        currentValue: this.controls.period.value.toString()
                    } as DataRatio
                ],
                headerElements: {
                    title: 'Filtros',
                    iconRight: 'btn-icon icon-cerrar'
                } as HeaderElements
            }
        });

        modal.onDidDismiss()
            .then((filters) => {
                if (!filters.data) {
                    return;
                }
                this.doResimulation(filters.data);
            });

        return await modal.present();
    }

    public async simulateAgain(data) {
        const callToService = this.currentValues.period !== data.period || this.currentValues.fund !== data.fund;
        this.afps = data.afps;
        this.setDisplayAfp();
        this.setFilters(data.fund, data.period);
        if (!callToService) {
            return;
        }
        this.currentValues = {period: data.period, fund: data.fund};
        this.showSpinner = true;
        const simulationData: ProfitabilityServiceData = {
            amount: this.controls.amount.value,
            pensionFund: this.currentValues.fund,
            period: this.currentValues.period
        };
        this.profitabilityService.resultSimulation(simulationData)
            .then(async (resp) => {
                this.simulationResult = resp;
                if (this.simulationResult) {
                    this.setLastValues(this.simulationResult);
                    this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN.CODIGO_OPERACION);
                }else{
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN_ERROR.CODIGO_OPERACION);
                    this.headerElements = {};
                }

                if (this.lastSelectedAfp) {
                    this.changeDifference(this.lastSelectedAfp);
                }

                this.showSpinner = false;
            })
            .catch(async (error) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN_ERROR.CODIGO_OPERACION);
                this.showSpinner = false;
            });
    }

    public setDisplayAfp() {
        this.displayAfp = [];
        Object.keys(this.afps).forEach((key) => {
            if (this.afps[key].checked) {
                if (this.afps[key].name === 'habitat') {
                    return this.displayAfp.unshift(this.afps[key].name);
                }
                this.displayAfp.push(this.afps[key].name);
            }
        });
    }

    public setFilters(fund: string, period: number) {
        this.changePensionFund(fund);
        this.changePeriod(period);
        this.filters = [];
        if (this.displayAfp.length !== this.afps.length) {
            this.displayAfp.forEach((key) => {
                this.filters.push('AFP ' + key.charAt(0).toUpperCase() + key.slice(1));
            });
        }
        if (this.filters.length === 0) {
            this.filters.push('Todas las AFP');
        }
        this.filters.push(`Fondo ${fund}`);
        this.filters.push(period === 15 ? 'Histórico' : period === 1 ? '12 meses' : period + ' años');
    }

    public goTo(url: string) {
        if (this.headerElements.iconLeft == 'btn-icon funnel') {
            this.showModalFilters();
        } else if (this.slideNumber == 2) {
            this.goToFirstSlide();
        } else {
            return this.navCtrl.pop();
        }
    }

    public clickErrorButtons(button: 'first' | 'second') {
        button === 'first' ? this.doSimulation() : this.goToHome();
    }

     /**
    * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    */
      async registrarTrazabilidad(codigoOperacion: number) {
        let parametroTraza: ParametroTraza = new ParametroTraza();
        const datosGenerales = {
            traza : CONSTANTES_TRAZAS_CENTRO,
            uuid : this.uuid,
            rut: this.rut,
            dv: this.dv,
        }

        switch (codigoOperacion) {
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.INIT.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.INIT);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.NEXT_SLIDE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.NEXT_SLIDE);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CALL_SERVICE_ERROR);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.GO_TO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.GO_TO);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CHANGE_DIFFERENCE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.CHANGE_DIFFERENCE);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN);
            break;
              case CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK.SIMULATE_AGAIN_ERROR);
              break;
        }
        this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }
}
