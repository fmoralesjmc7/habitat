import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { QuestionSlideText } from 'src/app/interfaces/question-slide-text';
import { UtilCA } from 'src/app/util/ca-util'; 
import {NavController} from '@ionic/angular';
import { SelectPickerComponentCA } from '../select-picker/select-picker.component'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 

@Component({
    selector: 'app-question-slide',
    templateUrl: './question-slide.component.html',
    styleUrls: ['./question-slide.component.scss']
})
export class QuestionSlideComponentCA implements OnInit {

    @Input() public questionSlideText: QuestionSlideText;
    @Input() public currentSlide: number;
    @Input() public totalSlides: number;
    @Input() public disableButton: boolean;
    @Input() public formGroup: FormGroup;
    @Input() public errorCondition: boolean;
    @Input() public textError: string;
    @Input() public selectGenderFemale: boolean;
    @Input() public selectGenderMale: boolean;
    @Input() public pickerOptions;
    @Output() public clickButton = new EventEmitter();
    @Output() public genderChange = new EventEmitter();
    @Output() public pickerChange = new EventEmitter();
    @Output() public changeFunds = new EventEmitter();
    @ViewChild('componenteSeleccionMes') slideTotalAhorrado: SelectPickerComponentCA;

    public loadingFormGroup: boolean;
    public slideNumber: number;
    public amount: number;
    public showAmount: number;

    constructor(
        private navCtrl: NavController,
        private contextoApp: ContextoAPP,
        public util: UtilCA) {
    }

    ngOnInit() {
        this.slideNumber = this.questionSlideText?.slideNumber!;

        if (!this.questionSlideText.textButton) {
            this.questionSlideText.textButton = 'Continuar';
        }
        if (!this.questionSlideText.classIllustration) {
            this.questionSlideText.classIllustration = 'illus-form';
        }
        if (this.formGroup) {
            this.loadingFormGroup = true;
        }
        this.showAmount = null!;
    }

    public onClickButton() {
        if (this.disableButton) {
            return;
        }
        this.clickButton.emit();
    }

    public onClickCertificados() {
        this.navCtrl.navigateForward('CertificadoPage');
    }

    public emitGenderValue(genderValue: string) {
        this.genderChange.emit(genderValue);
    }

    public emitDensityValue(densityValue: number) {
        this.pickerChange.emit(densityValue);
    }

    public emitFunds(funds: string[]) {
        this.changeFunds.emit(funds);
    }

    public modifyAmount(amount) {
        this.showAmount = 0;
        if (!amount.detail) {
            return;
        }
        this.amount = this.util.modifyAmount(amount);
        this.showAmount = this.contextoApp.limpiaCaracteres(this.amount);
        if (this.questionSlideText.typeInput === 'money') {
            this.formGroup.controls[this.questionSlideText?.formControlName!].setValue(this.showAmount);
        }
    }

    /**
     * Encargado de setear opcion combo meses
     * @param selectedOption
     */
    public changeOptionMeses(selectedOption) {
        this.slideTotalAhorrado.changeOption(selectedOption);
    }

    /**
     * Encargado de setear valor por defecto.
     * @param amount
     */
    public modificarMontoPorDefecto(amount) {
        this.amount = amount;
        this.showAmount = this.amount;
        if (this.questionSlideText.typeInput === 'money') {
            this.formGroup.controls[this.questionSlideText.formControlName!].setValue(this.showAmount);
            this.disableButton = false;
        }
    }

    /**
     * Se valida que el valor ingresado sea númerico en el primer intento
     */
    validateNumber(){
        if(Number.isNaN(Number(this.showAmount)) || !this.showAmount){
            this.showAmount = 0;
        }
    }
}
