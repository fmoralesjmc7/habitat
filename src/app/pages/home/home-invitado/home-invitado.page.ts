import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController, NavController, IonicModule } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { CommonModule } from '@angular/common';

import { SimulacionService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from 'src/app/util/error-generico.constantes';
import { AyudaContextualComponent } from '../../../components/ayuda-contextual/ayuda-contextual';

@Component({
  selector: 'app-home-invitado',
  templateUrl: './home-invitado.page.html',
  styleUrls: ['./home-invitado.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, AyudaContextualComponent]
})
export class HomeInvitadoPage implements OnInit {
  userInvitado: any;
  edad = 18;
  renta = '';
  saldo = '';
  sexo = '';
  form: FormGroup;
  minHeight = false;
  infoRemIsOpen = false;
  infoSaldoIsOpen = false;

  showRemuneracionBruta = false;
  showSaldoDisponible = false;

  readonly infoRem =
    'Es la renta bruta imponible sobre la cual se calcula el monto a pagar por concepto de impuestos y/o leyes sociales como previsión y salud.';
  readonly infoSaldo =
    'Es el saldo acumulado en tu Cuenta Obligatoria hasta la fecha.';

  readonly DECIMAL_SEPARATOR = ',' as string;
  readonly GROUP_SEPARATOR = '.' as string;

  constructor(
    private readonly menuCtrl: MenuController,
    private readonly fb: FormBuilder,
    private readonly navCtrl: NavController,
    private readonly simulacionProvider: SimulacionService,
    private readonly contextoAPP: ContextoAPP,
    private readonly utilService: UtilService
  ) {
    this.form = this.fb.group({
      age: new FormControl(18, { validators: [Validators.required] }),
      gender: new FormControl(''),
      salary: new FormControl('', { validators: [Validators.required] }),
      balance: new FormControl('', { validators: [Validators.required] }),
    });

    this.utilService.setLogEvent('event_habitat', { option: 'Acceso_como_Invitado' });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  cambioRangoEdad() {
    this.showRemuneracionBruta = false;
    this.showSaldoDisponible = false;
    this.sexo = '';
    this.form.get('gender')?.setValue('');
  }

  cambioSexo(sexo: string) {
    this.sexo = sexo;
    this.showRemuneracionBruta = true;
    this.form.get('gender')?.setValue(sexo);
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
  }

  async simulacionLigth() {
    if (this.form.invalid || !this.validForm()) {
      return;
    }

    const loading = await this.contextoAPP.mostrarLoading();
    const rentaAPI = parseInt(this.renta.toString().replace(/\D/g, ''), 10);
    const saldoAPI = parseInt(this.saldo.toString().replace(/\D/g, ''), 10);

    this.simulacionProvider.lightSinAPV(this.edad, this.sexo, rentaAPI, saldoAPI).subscribe({
      next: (data) => {
        this.utilService.setLogEvent('event_habitat', { option: 'Calculo_Simulador_Publico' });
        this.contextoAPP.ocultarLoading(loading);
        this.userInvitado = data;
        this.userInvitado.edad = this.edad;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            data: JSON.stringify(this.userInvitado),
          },
        };
        this.navCtrl.navigateForward(['HomeInvitadoStep2Page'], navigationExtras);
      },
      error: () => {
        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot(
          'ErrorGenericoPage',
          this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.homeInvitado)
        );
      },
    });
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
    // Aplicar formato al salir del input
    if (this.renta) {
      this.renta = this.format(this.renta);
    }
  }

  blurElementSaldo() {
    if (this.minHeight) {
      this.minHeight = false;
    } else {
      this.minHeight = true;
    }
    this.saldo = this.contextoAPP.limpiaCaracteres(this.saldo).toString();
    // Aplicar formato al salir del input
    if (this.saldo) {
      this.saldo = this.format(this.saldo);
    }
  }

  focusElement() {
    if (this.minHeight) {
      this.minHeight = false;
    } else {
      this.minHeight = true;
    }
  }

  format(valString: string) {
    if (!valString) {
      return '';
    }
    const value = valString.toString().replace('$', '');
    const parts = this.unFormat(value).split(this.DECIMAL_SEPARATOR);
    return '$' + new Intl.NumberFormat('es-CL').format(Number(parts[0])) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
  }

  unFormat(val: string) {
    if (!val) {
      return '';
    }
    let value = val.replace(/^0+/, '');

    if (this.GROUP_SEPARATOR === ',') {
      value = value.replace(/,/g, '');
    } else if (this.GROUP_SEPARATOR === '.') {
      value = value.replace(/\./g, '');
    }

    return value;
  }

  validaSoloNumeros(event: KeyboardEvent) {
    // Permitir teclas de navegación y control
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || 
        event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
        event.key === 'Home' || event.key === 'End') {
      return true;
    }
    
    const key = Number(event.key);
    if (Number.isNaN(key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  cambioFoco() {
    this.showSaldoDisponible = true;
    Keyboard.hide();
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
    }
    return true;
  }
}
