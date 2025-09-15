import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, NavController } from '@ionic/angular';
import { UtilService, SimulacionService, IndicadorService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../../src/app/util/error-generico.constantes';

@Component({
  selector: 'app-home-invitado-step-dos',
  templateUrl: './home-invitado-step-dos.page.html',
  styleUrls: ['./home-invitado-step-dos.page.scss'],
})
export class HomeInvitadoStepDosPage implements OnInit {

  /**
   * variable utilizada para cantidad de UF seleccionable en la barra.
   */
  cantidadUF: number = 0;
  /**
   * Calculo a pesos segun cantidad de uf seleccionada en la barra y valor uf actual.
   */
  calculoPesos: number;
  /**
   * Define si se muestra o no el texto con calculo de APV.
   */
  muestraTexto: boolean = false;
  /**
   * Parametro recibido desde simulador light.
   */
  nuevoRetiroProgramado: any;
  /**
   * Parametro recibido desde simulador light.
   */
  retiroProgramadoSinAPV: any;
  /**
   * Parametro recibido desde simulador light.
   */
  clienteID: number;
  /**
   * variable utilizada para calcular el incremento en pesos de la pension al tener un APV.
   */
  incrementoPension: number;
  /**
   * variable utilizada para calcular el incremento en porcentaje de la pension al tener un APV.
   */
  incrementoPorcentaje: number;
  /**
  * variable utilizada para calcular el maximo valor de pin de range.
  */
  rangoMaximo: number;

  edad: number;
  truncarTexto: boolean = true;
  usuarioInvitado: any;
  DECIMAL_SEPARATOR = ",";
  GROUP_SEPARATOR = ".";

  constructor(
     private menuCtrl: MenuController,
     private menu: MenuController,
     private loading: LoadingController,
     private simulacionProvider: SimulacionService,
     private utilService: UtilService,
     private navCtrl: NavController,
     private indicadorProvider: IndicadorService,
     private activatedRoute: ActivatedRoute,
     private contextoAPP: ContextoAPP,

    ) {

      this.activatedRoute.queryParams.subscribe(params => {
        this.usuarioInvitado = JSON.parse(params.data);
        this.retiroProgramadoSinAPV = this.usuarioInvitado.RetiroProgramado;
        this.clienteID = this.usuarioInvitado.clienteID;
        this.edad = this.usuarioInvitado.edad;
        this.nuevoRetiroProgramado = this.retiroProgramadoSinAPV;
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
    this.indicadorProvider.obtenerIndicadoresEconomicos().subscribe((response) => {
      response.tiposMoneda.forEach((registro: any) => {
        if (registro.codigoMoneda === 'UF') {
          this.rangoMaximo = registro.valor * 50;
        }
      });
      this.contextoAPP.ocultarLoading(loading);
    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.homeInvitado));
    });
  }


  async cambioAhorro() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.calculoPesos = this.cantidadUF;
    this.simulacionProvider.lightConAPV(this.edad, this.clienteID, this.calculoPesos, 'M').subscribe(
      (response: any) => {
        this.incrementoPension = response.RetiroProgramado - this.retiroProgramadoSinAPV;
        this.nuevoRetiroProgramado = response.RetiroProgramado;
        this.nuevoRetiroProgramado =  this.nuevoRetiroProgramado.toString().replace("$", "");
        const parts = this.unFormat(this.nuevoRetiroProgramado).split(this.DECIMAL_SEPARATOR);
        this.nuevoRetiroProgramado = new Intl.NumberFormat('es-CL').format(parts[0]) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
        this.incrementoPorcentaje = (this.incrementoPension * 100) / this.retiroProgramadoSinAPV;
        if (this.cantidadUF > 0) {
          this.muestraTexto = true;
        } else {
          this.muestraTexto = false;
        }
        this.contextoAPP.ocultarLoading(loading);
      }, (error) => {
        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.homeInvitado));
      }
    );
  }

  abrirContratarAPV() {
    this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=TU_APV');
  }

  abrirCambiateHabitat() {
    this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/solicitudTraspasoWeb/workflows/solicitudTraspasoNoAsistido.do');
  }

  moreMethod() {
    if (this.truncarTexto == true) {
      this.truncarTexto = false;
    } else {
      this.truncarTexto = true;
    }
  }

  lessMethod() {
    if (this.truncarTexto == false) {
      this.truncarTexto = true;
    } else {
      this.truncarTexto = false;
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
}
