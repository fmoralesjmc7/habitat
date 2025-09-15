import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StartPageData } from 'src/app/interfaces/start-page-data'; 
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { taxBenefitSimulatorConstats } from '../tax-benefit-simulator/tax-benefit-simulator.constant'; 
import { TrazabilidadService, UtilService } from 'src/app/services'; 
import { ContextoAPP } from 'src/app/util/contexto-app';
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
  selector: 'app-tax-benefit-start',
  templateUrl: './tax-benefit-start.page.html',
  styleUrls: ['./tax-benefit-start.page.scss'],
})
export class TaxBenefitStartPage {
  public rut: number;
  public dv: string;

  public startPageData: StartPageData = {
    classIllustration: 'illus-home-benefits',
    title: 'Compara los beneficios de APV entre régimen A y B',
    textDrop: 'Al ahorrar en APV régimen A o B obtienes, dependiendo de tu elección, bonificación fiscal o beneficio tributario.\n' +
      '¡Conoce aquí qué régimen te conviene más!',
    textPrimaryButton: 'Simular'
  };

  public headerElements: HeaderElements = {
    iconLeft: 'btn-icon icon-back'
  };
  uuid: string;

  constructor(
    private navCtrl: NavController,
    public contextoAPP:ContextoAPP,
    private trazabilidadProvider: TrazabilidadService,
    private utilService:UtilService) { }

  async ngOnInit() {
    this.uuid = await this.utilService.getStorageUuid();
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.TAX_BENCHMARK_START.INIT.CODIGO_OPERACION);
  }

  public ionViewWillEnter() {
    this.utilService.setLogEvent(taxBenefitSimulatorConstats.eventPrefix + 'start', {});
  }

  public goTo(url: string) {
    if (url === 'home') {
       return this.navCtrl.pop();
    }
    this.navCtrl.navigateForward(url);
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
    parametroTraza.uuid = '';
    parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.TAX_BENCHMARK_START.INIT);

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe((response) => {});
  }
}
