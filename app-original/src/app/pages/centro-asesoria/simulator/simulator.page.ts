import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { SimulationData, SimulationResult } from 'src/app/interfaces/simulation-light'; 
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SimulatorLightService } from 'src/app/services/api/restful/centro_asesoria/simulator-light/simulator-light.service'; 
import { IndiVideoComponent } from 'src/app/vendor/indi-video/indi-video.component'; 
import { IndiVideoEvent, IndiVideoEventNameEnum } from 'src/app/vendor/indi-video/indi-video.event'; 
import { SlidesClass } from 'src/app/classes/slides/slides.class';
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component';
import { HeaderElements } from 'src/app/interfaces/header-elements';
import { environment } from 'src/environments/environment';
import { legalText } from 'src/app/constants/legal-text'; 
import { simulatorConstants } from './simulator.constant'; 
import { DataIndivideo } from 'src/app/interfaces/dataIndivideo';
import { SendMailService } from 'src/app/services/api/restful/centro_asesoria/send-mail/send-mail.service'; 
import { UtilCA } from 'src/app/util/ca-util'; 
import { CONSTANTES_INDIVIDUO, CONSTANTES_CONFIGURACION } from 'src/app/constants/constantes-centro-asesoria'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { QuestionSlideComponentCA } from 'src/app/components/ca-question-slide/question-slide.component';
import { TrazabilidadService, UtilService } from 'src/app/services';
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.page.html',
  styleUrls: ['./simulator.page.scss'],
})
export class SimulatorPage extends SlidesClass implements OnInit, AfterViewInit {
  @ViewChild('myIndiVideo') myIndiVideo: IndiVideoComponent;
  
  @ViewChild('slideIngresoBruto') slideIngresoBruto: QuestionSlideComponentCA;
  @ViewChild('slideTotalAhorrado') slideTotalAhorrado: QuestionSlideComponentCA;
  @ViewChild('slideSeleccionMeses') slideSeleccionMeses: QuestionSlideComponentCA;

  @ViewChild(IonSlides) public slides: IonSlides;

  readonly CONSTANTES_IND = CONSTANTES_INDIVIDUO;
  readonly CONSTANTES_CONF = CONSTANTES_CONFIGURACION;
  public simulationResult: SimulationResult;
  public simulation12Months: SimulationResult;
  public simulationExtraYears: SimulationResult;
  public simulation12MonthsWithApv: SimulationResult;
  public simulationExtraYearsWithApv: SimulationResult;
  public taxableIncomeError = false;
  public goalError = false;
  public valueResult: number;
  public amount: number;
  public questionImprovePension = true;
  public responseImprovePension = false;
  public individeoSrc: string = environment.individeoSrc;
  public individeoEnv: string = environment.individeoEnv;
  public individeoCode: string = environment.individeoCode;
  public pickerOptions = simulatorConstants.pickerOptions;
  public loadingIndividio = true;
  public sendEmailEvent = false;
  public finishedVideo = false;
  public showVideoGoal = false;
  public individioEnabled: boolean;
  public videoFullScreen = false;
  public valueUf = 27000;
  public videoData: DataIndivideo;
  public maxtaxableIncomeInService = 2190000;

  public womenCNU = 0.9437893178615495;
  public menCNU = 0.954069197942932;

  public gender: string;
  public age: number;
  public rut: number;
  public dv: string;

  public showAmount: number;

  public SEPARADOR_FECHA_HORA: string = "T";
  public SEPARADOR_FECHA_GUION: string = "-";
  public SEPARADOR_FECHA_SLASH: string = "/";
  public SEPARADOR_HORA: string = ":";
  public VALOR_POR_DEFECTO_MESES: any = { value: 12, text: '12 meses' };
  public MESES_DENSIDAD: number = 12;
  uuid: string;

  constructor(private simulatorLightService: SimulatorLightService,
    private navCtrl: NavController,
    private changeDetector: ChangeDetectorRef,
    private sendMailService: SendMailService,
    private util: UtilCA,
    public modalController: ModalController,
    public screenOrientation: ScreenOrientation,
    public platform: Platform,
    public toastController: ToastController,
    public contextoAPP: ContextoAPP,
    private trazabilidadProvider: TrazabilidadService,
    private contextoApp: ContextoAPP,
    private ref: ApplicationRef,
    public utilService: UtilService) {
    super(simulatorConstants, platform, utilService);
    this.form = new FormGroup({
      taxableIncome: new FormControl(''),
      balance: new FormControl('', [Validators.required, Validators.min(0)]),
      density: new FormControl('', [Validators.required, Validators.min(0), Validators.max(12)]),
      goal: new FormControl(),
      email: new FormControl('', [Validators.email])
    });
    this.gender = this.contextoAPP.datosCliente.sexo;
    this.age = this.contextoAPP.datosCliente.edad;
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
  }

  async ngOnInit() {
    this.uuid = await this.utilService.getStorageUuid();
    this.logSimulatorEvent('enter');
    this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.INIT.CODIGO_OPERACION);
    await this.setConfigParameters();
    this.setValidatorTaxableIncome();

    this.individioEnabled = this.CONSTANTES_IND.habilitado;
    this.maxtaxableIncomeInService = this.CONSTANTES_CONF.max_saldo_bruto_servicio;

    this.controls.taxableIncome.valueChanges.subscribe((value) => {
      if (!value) { return; }
      const taxableIncomeCtrl = this.controls.taxableIncome;
      this.taxableIncomeError = taxableIncomeCtrl.errors && taxableIncomeCtrl.errors.min;
    });
    this.controls.goal.valueChanges.subscribe(() => {
      const goalCtrl = this.controls.goal;
      this.goalError = goalCtrl.errors && goalCtrl.errors.min;
    });
    this.valueUf = await this.simulatorLightService.getUF();
    this.showAmount = null!;
  }

  ionViewWillEnter(){
    this.asignarValoresPorDefecto();
  }
  /**
   * Encargado de asignar valores por defecto a steps 1,2,3
   * 
   */
  public asignarValoresPorDefecto() {
    let rentaImponible: number = +this.contextoAPP.datosCliente.rentaImponible;
    let saldoSimulacion: number = +this.contextoAPP.datosCliente.saldoSimulacion;
    // step 1
    if (rentaImponible) {
      this.slideIngresoBruto.modificarMontoPorDefecto(rentaImponible);
    }
    if (saldoSimulacion) {
      this.slideTotalAhorrado.modificarMontoPorDefecto(saldoSimulacion);
    }

    this.slideSeleccionMeses.changeOptionMeses(this.VALOR_POR_DEFECTO_MESES);
  }

  public async nextSlide() {
    this.lockSlides(false);
    await this.slides.slideNext();
    this.setupCurrentPage();

    // Registro trasabilidad step 2 & 3
    switch (this.slideNumber) {
      case 1: {
        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.NEXT_SLIDE1.CODIGO_OPERACION);
        break;
      }
      case 2: {
        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.NEXT_SLIDE2.CODIGO_OPERACION);
        break;
      }
    }
  }

  public async doSimulation() {
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.DO_SIMULATION.CODIGO_OPERACION);
    const { balance, density, taxableIncome } = this.form.value;

    // Fix problema form.isvalid 
    // Se valida que se ingresen correcctamente los valores del formulario.
    if (!balance && !density && !taxableIncome) {
      return;
    }

    this.logSimulatorEvent('simulate');
    this.existResult = false;
    this.showLoading = true;
    this.headerElements = {};
    this.callService();
  }

  public async goBack() {
    if (this.slideNumber === 1 || this.existResult) {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK1.CODIGO_OPERACION);
      return this.goToSimulationStart();
    }

    // Se registra trazabilidad al regresar al step 1
    if (this.slideNumber === 2) {
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK2.CODIGO_OPERACION);
    }

    // Se registra trazabilidad al regresar al step 2
    if (this.slideNumber === 3) {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK3.CODIGO_OPERACION);
    }
    this.prevSlide();
  }

  private setValidatorTaxableIncome() {
    const { taxableIncome } = this.controls;
    taxableIncome.setValidators([Validators.required, Validators.min(this.configParameters.minimumIncome)]);
    taxableIncome.updateValueAndValidity();
  }

  private setValidatorGoal() {
    const { goal } = this.controls;
    goal.reset();
    goal.enable();
    goal.setValidators(Validators.min(this.valueResult + 1));
    goal.updateValueAndValidity();
    this.amount = null!;
    this.showAmount = null!;
  }

  public sendEmail() {
    this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL.CODIGO_OPERACION);
    const { email } = this.form.value;
    this.videoData.email = email;
    this.sendMailService.registerSimulation(this.videoData);
    let nombreCompleto = this.contextoAPP.datosCliente.nombre + " " + this.contextoAPP.datosCliente.apellidoPaterno;
    nombreCompleto = this.contextoAPP.reemplazarTildesTexto(nombreCompleto);
    this.sendMailService.sendMail(this.videoData, this.configParameters.maxAgeMen, this.configParameters.maxAgeWomen, this.obtenerFechaHora(),nombreCompleto)
      .then(async () => {
        setTimeout(() => this.simulateAgain(), 3000);
        const toast = await this.toastController.create({
          message: 'Correo enviado con éxito.',
          duration: 4000
        });
        this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL_EXITO.CODIGO_OPERACION);
        toast.present();
      }, async (error) => {
        await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL_ERROR.CODIGO_OPERACION);
        this.navCtrl.navigateForward(['ErrorGenericoPage'], this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.centroAsesoria));
      });
  }

  /**
   * Obtiene fecha hora actual.  
   */
  obtenerFechaHora() {
    let fechaCorreo = new Date();
    let anioRetiro = fechaCorreo.getFullYear();
    let horas = this.obtenerMesHoraConCero(fechaCorreo.getHours());
    let minutos = this.obtenerMesHoraConCero(fechaCorreo.getMinutes());
    let segundos = this.obtenerMesHoraConCero(fechaCorreo.getSeconds());

    let diaRetiro = this.obtenerMesHoraConCero(fechaCorreo.getDate());
    let mesRetiro = fechaCorreo.getMonth() + 1; //Enero es 0!
    let mesRetiroString = this.obtenerMesHoraConCero(mesRetiro.toString());
    let horaSolicitud = horas + this.SEPARADOR_HORA + minutos + this.SEPARADOR_HORA + segundos;

    let fechaHora: string = anioRetiro + this.SEPARADOR_FECHA_GUION + mesRetiroString + this.SEPARADOR_FECHA_GUION + diaRetiro;
    fechaHora = fechaHora + this.SEPARADOR_FECHA_HORA + horaSolicitud;

    return fechaHora;
  }

  /**
   * El servicio se alimienta de hora con formato 2019-06-25 01:12:11 , se debe agregar un cero a la iz , cuando aplique.
   * @param valor 
  */
  obtenerMesHoraConCero(valor) {
    return String("00" + valor).slice(-2);
  }

  public changeDensity(densityValue: number) {
    if (this.controls.density.value === densityValue) {
      return;
    }
    this.controls.density.setValue(densityValue);
    this.changeDetector.detectChanges();
  }

  public simulateAgain() {
    this.headerElements = simulatorConstants.headerElements;
    this.simulationResult = null!;
    this.existResult = false;
    this.questionImprovePension = true;
    this.responseImprovePension = false;
    this.loadingIndividio = true;
    this.showVideoGoal = false;
    this.sendEmailEvent = false;
    this.finishedVideo = false;
    this.goToFirstPage();
    this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SIMULATE_AGAIN.CODIGO_OPERACION);
  }

  public async callService() {
    const { balance, density, taxableIncome } = this.form.value;
    const factorDensity = density / 12;
    const taxableIncomeToService = taxableIncome < this.maxtaxableIncomeInService ? taxableIncome : this.maxtaxableIncomeInService;
    const valueTaxableIncome = Math.trunc(taxableIncomeToService * factorDensity);
    const simulationData: SimulationData = {
      age: this.age,
      balance,
      taxableIncome: valueTaxableIncome,
      gender: this.gender
    };
    try {
      this.simulationResult = await this.simulatorLightService.resultSimulation(simulationData);
      await this.calculatePensionToVideo();
      this.setValueResult(this.simulationResult);
      this.setValidatorGoal();
    } catch (e) {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.CALL_SERVICE_ERROR.CODIGO_OPERACION);
      this.simulationResult = null!;
    }
    this.showLoading = false;
    this.existResult = true;
    this.headerElements = { title: 'Resultados', iconRight: 'btn-icon icon-menu-hamb' };
  }

  public async showModalLegal() {
    const modal = await this.modalController.create({
      component: ModalInfoComponentCA,
      componentProps: {
        body: legalText.simulator,
        headerElements: {
          title: 'Textos legales'
        } as HeaderElements
      }
    });
    return await modal.present();
  }

  private setValueResult(simulationResult: SimulationResult) {
    if (this.programmedRetirement) {
      return this.valueResult = simulationResult.programmedRetirement;
    }
    this.valueResult = simulationResult.lifelongIncome;
  }

  public goToSimulationStart() {
    this.navCtrl.pop();
    this.logSimulatorEvent('exit');
  }

  public goToHome() {
    this.navCtrl.navigateRoot('home-centro-asesoria');
  }

  public async improvePension(response: boolean) {
    this.questionImprovePension = false;
    this.responseImprovePension = response;
    if (response) {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.IMPROVE_PENSION.CODIGO_OPERACION);
    } else {
      const { taxableIncome, balance, density } = this.form.value;

      const dataString = {
        mejorarPension: this.responseImprovePension,
        glosaTraza: "Simulador Step 5 A"
      };

      let rentaImponible: number = +this.contextoAPP.datosCliente.rentaImponible;
      let saldoSimulacion: number = +this.contextoAPP.datosCliente.saldoSimulacion;

      if(rentaImponible != Number(taxableIncome)){
        dataString['ingresoBrutoMensual'] = Number(taxableIncome);
      }
      if(saldoSimulacion != Number(balance)){
        dataString['saldoActualEnAhorro'] = Number(balance);
      }
      if(density < this.MESES_DENSIDAD){
        dataString['densidad'] = density;
      }

      const data = JSON.stringify(dataString)

      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.IMPROVE_PENSION2.CODIGO_OPERACION, data,);
    }
  }

  public clickErrorButtons(button: 'first' | 'second') {
    button === 'first' ? this.doSimulation() : this.goToHome();
  }

  public async showVideo() {
    if(this.goalError || this.controls.goal.value === null) return;

    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SHOW_VIDEO.CODIGO_OPERACION);
    this.showVideoGoal = true;
  }

  public onEvent(params: IndiVideoEvent) {
    if (this.platform.is('cordova')) { this.changeDetector.detectChanges(); }
    if (params.name === IndiVideoEventNameEnum.ONFULLSCREENENTER) {
      const orientation = this.platform.is('android') ? 'LANDSCAPE_PRIMARY' : 'LANDSCAPE_SECONDARY';
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS[orientation]);
      this.videoFullScreen = true;
    }
    if (params.name === IndiVideoEventNameEnum.ONFULLSCREENEXIT) {
      this.screenOrientAfterCallAction();
    }
    // set personalized properties when indi-video as been inserted on the page
    if (params.name === IndiVideoEventNameEnum.ONREADY) {
      this.loadingIndividio = false;
      const { taxableIncome, balance, density, goal } = this.form.value;

      this.videoData = {
        edad: Number(this.age),
        sexo: this.gender.toLowerCase(),
        ingresoBrutoMensual: Number(taxableIncome),
        saldoActualEnAhorro: Number(balance),
        densidad: density,
        pensionEstimada: this.valueResult,
        pensionEstimada12Meses: this.getEstimatedPensionValue(this.simulation12Months),
        pensionEstimada12MesesAnosExtra: this.getEstimatedPensionValueExtraYears(this.simulationExtraYears),
        mejorarPension: this.responseImprovePension,
        metaPension: Number(goal) ? Number(goal) : this.valueResult,
        pensionMaximaSolidaria: this.configParameters.pmasValue,
        idCliente12Meses: Number(this.simulation12Months.clientId),
        idCliente12MesesAnosExtra: Number(this.simulationExtraYears.clientId),
        ahorroMaximaAPV: Math.trunc(this.valueUf * 50),
        programmedRetirement: this.programmedRetirement,
        retirementFactor: this.gender === 'M' ? this.menCNU : this.womenCNU
      } as DataIndivideo;

      this.myIndiVideo.initIndivideo(this.videoData);
    }

    if (params.name === IndiVideoEventNameEnum.ONMEDIACTASEND) {
      this.screenOrientAfterCallAction();
      this.sendEmailEvent = true;
    }

    if (params.name === IndiVideoEventNameEnum.ONMEDIACTASIMULATEAGAIN) {
      this.screenOrientAfterCallAction();
      this.finishedVideo = true;
      setTimeout(() => {
        this.simulateAgain();
        this.changeDetector.detectChanges();
      }, 500);
    }

    if (params.name === IndiVideoEventNameEnum.ONMEDIACTAEXECUTIVE) {
      this.screenOrientAfterCallAction();
      this.finishedVideo = true;
      setTimeout(() => {
        this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/contacto/');
        this.goToHome();
        this.changeDetector.detectChanges();
      }, 500);
    }

    if (params.name === IndiVideoEventNameEnum.ONMEDIACTAVALUEAPV) {
      this.videoData.valorApv = params.player.ctaValue ? params.player.ctaValue : 0;

      const { taxableIncome, balance, density } = this.form.value;

      const dataString = {
        mejorarPension: this.responseImprovePension,
        pensionEstimada: this.valueResult,
        metaPension: this.amount,
        ahorroMaximaAPV: params.player.ctaValue ? params.player.ctaValue : 0,
        glosaTraza: "Simulador Pension Video"
      };

      let rentaImponible: number = +this.contextoAPP.datosCliente.rentaImponible;
      let saldoSimulacion: number = +this.contextoAPP.datosCliente.saldoSimulacion;

      if(rentaImponible != Number(taxableIncome)){
        dataString['ingresoBrutoMensual'] = Number(taxableIncome);
      }

      if(saldoSimulacion != Number(balance)){
        dataString['saldoActualEnAhorro'] = Number(balance);
      }

      if(density < this.MESES_DENSIDAD){
        dataString['densidad'] = density;
      }

      const data = JSON.stringify(dataString)
      this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR.ON_EVENT.CODIGO_OPERACION, data);
    }

    if (params.name === IndiVideoEventNameEnum.ONMEDIAPENSION12MONTHS) {
      const simulation12MonthsWithApvResponse = JSON.parse(params.player.ctaValue);
      this.simulation12MonthsWithApv =  {
        lifelongIncome: simulation12MonthsWithApvResponse.RentaVitalicia,
        programmedRetirement:  simulation12MonthsWithApvResponse.RetiroProgramado,
        clientId: simulation12MonthsWithApvResponse.clienteID
      } as SimulationResult;
      this.videoData.pensionEstimada12MesesConApv = this.getEstimatedPensionValue(this.simulation12MonthsWithApv);
    }

    if (params.name === IndiVideoEventNameEnum.ONMEDIAPENSIONEXTRAYEARS) {
      const simulationExtraYearsWithApvResponse = JSON.parse(params.player.ctaValue);
      this.simulationExtraYearsWithApv = {
        lifelongIncome: simulationExtraYearsWithApvResponse.RentaVitalicia,
        programmedRetirement:  simulationExtraYearsWithApvResponse.RetiroProgramado,
        clientId: simulationExtraYearsWithApvResponse.clienteID
      } as SimulationResult;
      this.videoData.pensionEstimada12MesesAnosExtraConApv = this.getEstimatedPensionValue(this.simulationExtraYearsWithApv);
    }
  }

  public screenOrientAfterCallAction() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    this.videoFullScreen = false;
  }

  get programmedRetirement() {
    return this.configParameters.simulatorResultProgrammedRetirement;
  }

  public getEstimatedPensionValue(simulation: SimulationResult) {
    return this.programmedRetirement ? simulation.programmedRetirement : simulation.lifelongIncome;
  }

  public getEstimatedPensionValueExtraYears(simulation: SimulationResult) {
    let value = this.programmedRetirement ? simulation.programmedRetirement : simulation.lifelongIncome;
    value = value / (this.gender === 'M' ? this.menCNU : this.womenCNU);
    return value;
  }

  private async calculatePensionToVideo() {

    const {balance, density, taxableIncome} = this.form.value;
    const taxableIncomeToService = taxableIncome < this.maxtaxableIncomeInService ? taxableIncome : this.maxtaxableIncomeInService;
    const simulationData: SimulationData = {
      age: this.age,
      balance,
      taxableIncome: taxableIncomeToService,
      gender: this.gender
    };

    if (density === 12) {
      this.simulation12Months = this.simulationResult;
    } else {
      this.simulation12Months = await this.simulatorLightService.resultSimulation(simulationData);
    }
    simulationData.age = this.gender === 'M' ? this.age - 2 : this.age - 3;
    this.simulationExtraYears = await this.simulatorLightService.resultSimulation(simulationData);
  }

  public modifyAmount(amount) {
    if (!amount.detail) { return; }

    this.amount = this.util.modifyAmount(amount);
    this.showAmount = this.contextoApp.limpiaCaracteres(this.amount);
    this.controls.goal.setValue(this.showAmount);
    this.ref.tick();
  }

  public obtenerEstadoBoton(): boolean {
    return !this.isAmountQuestionValid || this.taxableIncomeError;
  }

  /**
   * Encargado de setear estado boton simular step 3
   */
  public obtenerEstadoBotonStep3(): boolean {
    const { density } = this.form.value;

    return !density;
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
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.INIT.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.INIT);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.NEXT_SLIDE1.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.NEXT_SLIDE1);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.NEXT_SLIDE2.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.NEXT_SLIDE2);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.DO_SIMULATION.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.DO_SIMULATION);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK1.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK1);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK2.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK2);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK3.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.GO_BACK3);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL_EXITO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL_EXITO);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SEND_MAIL_ERROR);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SIMULATE_AGAIN.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SIMULATE_AGAIN);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.CALL_SERVICE_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.CALL_SERVICE_ERROR);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.IMPROVE_PENSION.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.IMPROVE_PENSION);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.IMPROVE_PENSION2.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.IMPROVE_PENSION2);
        parametroTraza.datos = datos;
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SHOW_VIDEO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.SHOW_VIDEO);
        break;
      case CONSTANTES_TRAZAS_CENTRO.SIMULATOR.ON_EVENT.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR.ON_EVENT);
        parametroTraza.datos = datos;
        break;
        
    }
    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe((response) => {});
  }

  ionViewDidLeave() {
    this.videoFullScreen = false; // muestra el header
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  /**
   * Fix problema pantalla rotada , cuando sales desde el video. 
   */
  setearPantallaStep1() {
    this.videoFullScreen = false; // muestra el header
    this.goalError = false;
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.doResimulation();
  }

  /**
   * Se valida que el valor ingresado sea númerico en el primer intento
   */
  validateNumber() {
    if (Number.isNaN(Number(this.showAmount)) || !this.showAmount) {
      this.showAmount = 0;
    }
  }

}
