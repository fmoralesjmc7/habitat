import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController, NavController, IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IndicadorService, SimulacionService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from 'src/app/util/error-generico.constantes';
import { FormatoPorcentajePipe } from 'src/app/pipes/formato-porcentaje.pipe';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';

@Component({
  selector: 'app-home-invitado-step-dos',
  templateUrl: './home-invitado-step-dos.page.html',
  styleUrls: ['./home-invitado-step-dos.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule, FormatoPorcentajePipe, FormatoPesoChilenoPipe]
})
export class HomeInvitadoStepDosPage implements OnInit {
  cantidadUF = 0;
  calculoPesos!: number;
  muestraTexto = false;
  nuevoRetiroProgramado: any;
  retiroProgramadoSinAPV: any;
  clienteID!: number;
  incrementoPension!: number;
  incrementoPorcentaje!: number;
  rangoMaximo!: number;

  edad!: number;
  truncarTexto = true;
  usuarioInvitado: any;
  readonly DECIMAL_SEPARATOR = ',' as string;
  readonly GROUP_SEPARATOR = '.' as string;

  constructor(
    private readonly menuCtrl: MenuController,
    private readonly navCtrl: NavController,
    private readonly simulacionProvider: SimulacionService,
    private readonly utilService: UtilService,
    private readonly indicadorProvider: IndicadorService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly contextoAPP: ContextoAPP
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params?.['data']) {
        this.usuarioInvitado = JSON.parse(params['data']);
        this.retiroProgramadoSinAPV = this.usuarioInvitado?.RetiroProgramado;
        this.clienteID = this.usuarioInvitado?.clienteID;
        this.edad = this.usuarioInvitado?.edad;
        this.nuevoRetiroProgramado = this.retiroProgramadoSinAPV;
      }
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  backButton() {
    this.navCtrl.pop();
  }

  async ngOnInit() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.menuCtrl.enable(true);
    this.indicadorProvider.obtenerIndicadoresEconomicos().subscribe({
      next: (response) => {
        response?.tiposMoneda?.forEach((registro: any) => {
          if (registro?.codigoMoneda === 'UF') {
            this.rangoMaximo = registro.valor * 50;
          }
        });
        this.contextoAPP.ocultarLoading(loading);
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

  async cambioAhorro() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.calculoPesos = this.cantidadUF;
    this.simulacionProvider.lightConAPV(this.edad, this.clienteID, this.calculoPesos, 'M').subscribe({
      next: (response: any) => {
        this.incrementoPension = response.RetiroProgramado - this.retiroProgramadoSinAPV;
        this.nuevoRetiroProgramado = response.RetiroProgramado;
        this.nuevoRetiroProgramado = this.nuevoRetiroProgramado.toString().replace('$', '');
        const parts = this.unFormat(this.nuevoRetiroProgramado).split(this.DECIMAL_SEPARATOR);
        this.nuevoRetiroProgramado = new Intl.NumberFormat('es-CL').format(Number(parts[0])) +
          (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
        this.incrementoPorcentaje = (this.incrementoPension * 100) / this.retiroProgramadoSinAPV;
        this.muestraTexto = this.cantidadUF > 0;
        this.contextoAPP.ocultarLoading(loading);
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

  abrirContratarAPV() {
    this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=TU_APV');
  }

  abrirCambiateHabitat() {
    this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/solicitudTraspasoWeb/workflows/solicitudTraspasoNoAsistido.do');
  }

  moreMethod() {
    this.truncarTexto = !this.truncarTexto;
  }

  lessMethod() {
    this.truncarTexto = !this.truncarTexto;
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
}
