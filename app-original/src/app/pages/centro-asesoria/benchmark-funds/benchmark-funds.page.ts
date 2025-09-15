import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController, NavController, Platform} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ProfitabilityService } from 'src/app/services/api/restful/centro_asesoria/profitability/profitability.service'; 
import { ProfitabilityServiceFunds } from 'src/app/interfaces/profitability-service-data'; 
import { benchmarkFundsConstants } from './benchmark-funds.constant'; 
import { SlidesClass } from 'src/app/classes/slides/slides.class'; 
import { ModalFilterComponentCA } from 'src/app/components/ca-modal-filter/modal-filter.component';
import { DataCheckbox, DataRatio } from 'src/app/interfaces/data-modal-filter'; 
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component'; 
import { CONSTANTE_TEXTO_LEGALES } from 'src/app/constants/constantes-centro-asesoria'; 
import { legalText } from 'src/app/constants/legal-text';
import { TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { ChartOptions } from 'src/app/components/ca-chartist/chartist.component';
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
    selector: 'app-benchmark-funds',
    templateUrl: './benchmark-funds.page.html',
    styleUrls: ['./benchmark-funds.page.scss'],
})
export class BenchmarkFundsPage extends SlidesClass implements AfterViewInit {
    @ViewChild(IonSlides) public slides: IonSlides;

    readonly CONSTANTES = CONSTANTE_TEXTO_LEGALES;
    public lastValues;
    public currentPeriod = 15;
    public filters: string[] = [];
    public differenceValue = benchmarkFundsConstants.differenceValue;
    public showSpinner = false;
    public simulationResult;
    public pickerOptions = benchmarkFundsConstants.pickerOptions;
    public dataChart = benchmarkFundsConstants.dataChart;
    public optionsChart = benchmarkFundsConstants.optionsChart as ChartOptions;
    public fundsChecked = benchmarkFundsConstants.fundsChecked;
    public rut: number;
    public dv: string;
    uuid: string;

    constructor(private modalController: ModalController,
                private navCtrl: NavController,
                private profitabilityService: ProfitabilityService,
                public platform: Platform,
                private trazabilidadProvider: TrazabilidadService,
                public contextoAPP: ContextoAPP,
                public utilService: UtilService
    ) {
        super(benchmarkFundsConstants, platform, utilService);
        this.form = new FormGroup({
            amount: new FormControl('', [Validators.required, Validators.min(1)]),
            firstFund: new FormControl('', [Validators.required]),
            secondFund: new FormControl('', [Validators.required]),
            period: new FormControl(15, [Validators.required])
        });

        this.rut = this.contextoAPP.datosCliente.rut;
        this.dv = this.contextoAPP.datosCliente.dv;

    }

    async ngOnInit() {
        this.uuid = await this.utilService.getStorageUuid();
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.INIT.CODIGO_OPERACION);
    }

    /**
     * Cuando se ingresa a la vista, se desmarcan los fondos seleccionados
     * para que no queden seleccionados al ingresar una nueva comparativa
     */
    ionViewDidEnter() {
        this.fundsChecked?.forEach((fondo: any) => {
            if (fondo) {
                fondo.checked = false;
            }
        });
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
            await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.NEXT_SLIDE.CODIGO_OPERACION);
        }
    }

    public goToBenchmarkStart() {
        this.navCtrl.navigateBack('benchmark-start');
    }

    public async callService() {
        const {amount, firstFund, secondFund, period} = this.form.value;
        const data: ProfitabilityServiceFunds = {
            amount,
            firstFund,
            secondFund,
            period
        };
        this.setFilters(firstFund, secondFund, period);

        this.fundsChecked?.forEach((item) => {
            if (item.name === firstFund || item.name === secondFund) {
                item.checked = true;
            }
        });
        this.profitabilityService.fundsHabitat(data)
            .then(async (resp) => {
                this.simulationResult = resp;
                if (this.simulationResult) {
                    this.setLastValues(this.simulationResult);
                    this.setDataChart(this.simulationResult);
                    this.headerElements = {title: 'Resultados', iconLeft: 'btn-icon funnel', iconRight: 'btn-icon icon-menu-hamb'};
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE.CODIGO_OPERACION);
                }else{
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE_ERROR.CODIGO_OPERACION);
                    this.headerElements = {};
                }
                this.showLoading = false;
                this.existResult = true;
            })
            .catch(async (error) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE_ERROR.CODIGO_OPERACION);
                this.headerElements = {};
                this.showLoading = false;
                this.existResult = true;
            });
    }

    public changePensionFunds(funds: string[]) {
        this.changeFund('firstFund', funds[0]);
        this.changeFund('secondFund', funds[1]);
    }

    private changeFund(fund: string, fundValue: string) {
        if (this.controls[fund].value === fundValue) {
            return;
        }
        this.controls[fund].setValue(fundValue);
    }

    public goToHome() {
        this.navCtrl.navigateRoot('home-centro-asesoria');
    }

    public get firstFund() {
        return this.controls.firstFund.value;
    }

    public get secondFund() {
        return this.controls.secondFund.value;
    }

    public setDataChart(historicalData) {
        const series: any[] = [];
        let labels: string[] = [];
        const funds = Object.keys(historicalData);
        funds.forEach((fund) => {
            labels = [];
            const serie: any[] = [];
            const years = Object.keys(historicalData[fund]);
            years.forEach((year, index) => {
                const lastPosition = years.length - 1;
                const label = index === 0 || index === lastPosition ? year : '';
                labels.push(label);
                serie.push(historicalData[fund][year]);
            });
            series.push(serie);
        });
        this.dataChart.series = series;
        this.dataChart.labels = labels;
    }

    private setLastValues(historicalData) {
        this.lastValues = {};
        Object.keys(historicalData).forEach((key) => {
            const years = Object.keys(historicalData[key]);
            const positionLastYear = years.length - 1;
            const lastValue = years[positionLastYear];
            this.lastValues[key] = historicalData[key][lastValue];
        });
        const difference = this.lastValues[this.firstFund] - this.lastValues[this.secondFund];
        this.differenceValue.number = Math.abs(difference);
        this.differenceValue.sign = difference === 0 ? '' : difference > 0 ? '+' : '-';
    }

    private setFilters(firstFund: string, secondFund: string, period: number) {
        this.filters = [];
        this.filters.push('Fondo ' + firstFund);
        this.filters.push('Fondo ' + secondFund);
        this.filters.push(period === 15 ? 'Histórico' : period === 1 ? '12 meses' : period + ' años');
        this.currentPeriod = period;
    }

    public async simulateAgain(data) {
        const funds = data.funds.filter(fund => fund.checked);
        const changeFunds = funds.length === 2 && (this.firstFund !== funds[0].name || this.secondFund !== funds[1].name);
        const changePeriod = this.controls.period.value !== data.period;
        const callToService = changeFunds || changePeriod;
        if (!callToService) {
            return;
        }
        this.showSpinner = true;
        if (changeFunds) {
            this.controls.firstFund.setValue(funds[0].name);
            this.controls.secondFund.setValue(funds[1].name);
        }
        if (changePeriod) {
            this.controls.period.setValue(data.period);
        }
        const {amount, firstFund, secondFund, period} = this.form.value;
        const dataService: ProfitabilityServiceFunds = {
            amount,
            firstFund,
            secondFund,
            period
        };
        this.setFilters(firstFund, secondFund, period);


        this.profitabilityService.fundsHabitat(dataService)
            .then(async (resp) => {
                this.simulationResult = resp;
                if (this.simulationResult) {
                    this.setLastValues(this.simulationResult);
                    this.setDataChart(this.simulationResult);
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN.CODIGO_OPERACION);
                }else{
                    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN_ERROR.CODIGO_OPERACION);
                }

                this.showSpinner = false;
                this.existResult = true;
            })
            .catch(async (error) => {
                await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN_ERROR.CODIGO_OPERACION);
                this.headerElements = {};
                this.showSpinner = false;
                this.existResult = true;
            });
    }

    public async showModalFilters() {
        const modal = await this.modalController.create({
            component: ModalFilterComponentCA,
            componentProps: {
                dataCheckbox: [
                    {
                        list: this.fundsChecked,
                        title: 'Selecciona dos fondos',
                        type: 'funds',
                        prefix: 'Fondo ',
                        maxChecked: 2
                    } as DataCheckbox
                ],
                dataRatio: [
                    {
                        list: benchmarkFundsConstants.periods,
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

    public clickErrorButtons(button: 'first' | 'second') {
        button === 'first' ? this.callService() : this.goToHome();
    }

    public async showModalInfo() {
        const legalTextFirestore = this.CONSTANTES.simulador_rentabilidad_afp;
        // Fix firestoreService
        //const legalTextFirestore = await this.firestoreService.getDataFirestore('textos_legales', 'simulador_rentabilidad_afp');
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

    public goTo(url: string) {
        if (this.headerElements.iconLeft == 'btn-icon funnel') {
            this.showModalFilters();
        } else if (this.slideNumber == 2) {
            this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.GO_TO.CODIGO_OPERACION);
            this.prevSlide();
        } else {
            return this.navCtrl.pop();
        }
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
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.INIT.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.INIT);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.NEXT_SLIDE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.NEXT_SLIDE);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.CALL_SERVICE_ERROR);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN_ERROR.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.SIMULATE_AGAIN_ERROR);
              break;
            case CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.GO_TO.CODIGO_OPERACION:
              parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_FUNDS.GO_TO);
              break;
        }

        this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }

}
