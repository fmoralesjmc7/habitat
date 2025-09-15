import { IonContent, IonSlides, Platform } from '@ionic/angular';
import { AfterViewInit, Inject, Injectable, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SlidesConstants } from 'src/app/interfaces/slide-constants'; 
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { CONSTANTES_CONFIGURACION } from 'src/app/constants/constantes-centro-asesoria';
import { simulatorConstants } from 'src/app/pages/centro-asesoria/simulator/simulator.constant';
import { ErrorButtons } from 'src/app/interfaces/error-elements'; 
import { UtilService } from 'src/app/services';

const SUBSCRIPTION_PRIORITY = 999999;

@Injectable()
export class SlidesClass implements AfterViewInit {
  readonly CONSTANTES_CA = CONSTANTES_CONFIGURACION;
  @ViewChild(IonSlides) public slides: IonSlides;
  @ViewChild(IonContent) public content: IonContent;
  public questionsOrder: string[];
  public slideNumber = 1;
  public totalSlides: number;
  public form: FormGroup;
  public subscription: Subscription;
  public headerElements: HeaderElements;
  public showLoading = false;
  public existResult = false;
  public textLoading: string[];
  public slideOpts;
  public questionSlideTexts;
  public selectGenderFemale = false;
  public selectGenderMale = false;
  public ageErrorText: string;
  public errorButtons: ErrorButtons;
  public configParameters = simulatorConstants.configParametersDefault;
  constructor(
    @Inject(Object) public constants: SlidesConstants,
    public platform: Platform,
    public utilService: UtilService) {
    this.questionsOrder = constants.questionsOrder;
    this.headerElements = constants.headerElements;
    this.textLoading = constants.textLoading;
    this.slideOpts = constants.slideOpts;
    this.questionSlideTexts = constants.questionSlideTexts;
    this.errorButtons = constants.errorButtons;
  }

  public ionViewWillEnter() {
    this.setBackButtonBehavior();
  }

  public ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public async ngAfterViewInit() {
    this.totalSlides = await this.slides.length();
    this.setupCurrentPage();
  }

  public async prevSlide() {
    this.lockSlides(false);
    await this.slides.slidePrev();
    this.setupCurrentPage();
  }

  public lockSlides(lock: boolean) {
    this.slides.lockSwipes(lock);
  }

  public async nextSlide() {
    this.lockSlides(false);
    await this.slides.slideNext();
    this.setupCurrentPage();
  }

  public async setupCurrentPage() {
    this.lockSlides(true);
    this.slideNumber = await this.slides.getActiveIndex() + 1;
    this.logSimulatorEvent(this.constants.questionsOrder[this.slideNumber - 1]);
  }

  public doSimulation() {
    if (this.form.invalid) { return; }
    this.logSimulatorEvent('simulate');
    this.existResult = false;
    this.showLoading = true;
    this.headerElements = {};
    this.callService();
  }

  public doResimulation(data?) {
    this.logSimulatorEvent('simulate_again');
    this.simulateAgain(data);
  }

  public async goToFirstPage() {
    this.lockSlides(false);
    await this.slides.slideTo(0, 0);
    this.setupCurrentPage();
  }

  public get controls() { return this.form.controls; }

  public get activeFormControl() {
    return this.controls[this.questionsOrder[this.slideNumber - 1]];
  }

  public get isCurrentQuestionValid() {
    if (this.activeFormControl !== undefined) {
      return !this.activeFormControl.pristine && this.activeFormControl.valid;
    }
  }

  public get isGenderQuestionValid() {
    if (this.activeFormControl !== undefined && this.activeFormControl === this.controls.gender) {
      return this.activeFormControl.valid;
    }
  }

  public get isAmountQuestionValid() {
    if (this.activeFormControl !== undefined) {
      return this.activeFormControl.valid;
    }
  }

  public changeGender(genderValue: string) {
    if (this.controls.gender.value === genderValue) { return; }
    this.selectGenderFemale = genderValue === 'F';
    this.selectGenderMale = !this.selectGenderFemale;
    this.controls.gender.setValue(genderValue);
    this.setValidatorsAge(genderValue);
  }

  private setValidatorsAge(gender: string) {
    const maxAge: number = gender === 'F' ? this.CONSTANTES_CA.maxAgeWomen : this.CONSTANTES_CA.maxAgeMen;
    const minAge: number = gender === 'F' ? this.CONSTANTES_CA.minAgeWomen : this.CONSTANTES_CA.minAgeMen;
    const { age } = this.controls;
    this.ageErrorText = 'Tu edad debe ser mayor a ' + minAge + ' y menor a ' + maxAge;
    age.reset();
    age.enable();
    age.setValidators([Validators.required, Validators.min(minAge), Validators.max(maxAge), Validators.pattern('^[0-9]+$')]);
    age.updateValueAndValidity();
  }

  public async setConfigParameters() {

    this.configParameters.factorTaxableIncome = this.CONSTANTES_CA.factorTaxableIncome;
    this.configParameters.maxAgeMen =  this.CONSTANTES_CA.maxAgeMen;
    this.configParameters.minAgeMen =  this.CONSTANTES_CA.minAgeMen;
    this.configParameters.maxAgeWomen = this.CONSTANTES_CA.maxAgeWomen;
    this.configParameters.minAgeWomen = this.CONSTANTES_CA.minAgeWomen;
    this.configParameters.minimumIncome = this.CONSTANTES_CA.minimumIncome;
    this.configParameters.liquidIncome = this.CONSTANTES_CA.liquidIncome;
    this.configParameters.simulatorResultProgrammedRetirement =  this.CONSTANTES_CA.simulatorResultProgrammedRetirement;
    this.configParameters.pmasValue =  this.CONSTANTES_CA.pmasValue;
  }

  public setBackButtonBehavior() {
    if (this.platform.is('android')) {
      this.subscription =
        this.platform.backButton.subscribeWithPriority(SUBSCRIPTION_PRIORITY, () => {
          this.goBack();
        }
      );
    }
  }

  public goBack() {
    throw new Error('goBack() function is not implemented');
  }

  public callService() {
    throw new Error('callService() function is not implemented');
  }

  public simulateAgain(data) {
    throw new Error('simulateAgain() function is not implemented');
  }

  public logSimulatorEvent(eventName: string) {
    return this.utilService.setLogEvent(this.constants.eventPrefix + eventName, {});
  }

}
