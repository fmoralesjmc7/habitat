import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StartPageData } from 'src/app/interfaces/start-page-data'; 
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { benchmarkConstants } from '../benchmark/benchmark.constant'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { TrazabilidadService, UtilService } from 'src/app/services'; 
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
  selector: 'app-benchmark-start',
  templateUrl: './benchmark-start.page.html',
  styleUrls: ['./benchmark-start.page.scss'],
})
export class BenchmarkStartPage {

  public rut: number;
  public dv: string;
  uuid: string;

  public startPageData: StartPageData = {
    classIllustration: 'illus-benchmark',
    title: 'Comparador de Rentabilidad: AFP y multifondos',
    textDrop: 'Conoce y compara las rentabilidades entre las AFP y multifondos por períodos.',
    textPrimaryButton: 'Rentabilidad entre AFP',
    textSecondaryButton: 'Rentabilidad entre multifondos'
  };

  public headerElements: HeaderElements = {
    iconLeft: 'icon-back'
  };


  constructor(
    private navCtrl: NavController,
    public contextoAPP: ContextoAPP,
    private trazabilidadProvider: TrazabilidadService,
    private readonly utilService: UtilService) {}

  async  ionViewWillEnter() {
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    this.uuid = await this.utilService.getStorageUuid();
    this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.BENCHMARK_START.INIT.CODIGO_OPERACION);
    this.utilService.setLogEvent(benchmarkConstants.eventPrefix + 'start', {});
  }

  public goTo(url: string) {
    if (url === 'home') {
      return this.navCtrl.pop();
    }
    this.navCtrl.navigateForward(url);
  }

  public goToBenchmark() {
    this.navCtrl.navigateForward('benchmark');
  }

  public goToBenchmarkFunds() {
    this.navCtrl.navigateForward('benchmark-funds');
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
    parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.BENCHMARK_START.INIT);

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
  }
}
