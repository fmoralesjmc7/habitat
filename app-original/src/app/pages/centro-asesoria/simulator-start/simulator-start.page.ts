import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StartPageData } from 'src/app/interfaces/start-page-data'; 
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { simulatorConstants } from '../simulator/simulator.constant';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { TrazabilidadService, UtilService } from 'src/app/services';
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
  selector: 'app-simulator-start',
  templateUrl: './simulator-start.page.html',
  styleUrls: ['./simulator-start.page.scss'],
})
export class SimulatorStartPage {
  public rut: number;
  public dv: string;
  uuid: string;

  public startPageData: StartPageData = {
    classIllustration: 'illus-simulator',
    title: 'Simula tu pensión de forma interactiva',
    textDrop: 'Conoce cuál es tu proyección de pensión y las distintas alternativas para mejorarla.',
    textPrimaryButton: 'Simular'
  };

  public headerElements: HeaderElements = {
    iconLeft: 'btn-icon icon-back'
  };

  constructor(private navCtrl: NavController,
              public contextoAPP:ContextoAPP,
              private trazabilidadProvider: TrazabilidadService,
              private utilService: UtilService) { }

  async ngOnInit() {
    this.uuid = await this.utilService.getStorageUuid();
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.SIMULATOR_START.INIT.CODIGO_OPERACION);
  }

  ionViewDidEnter() {
    this.utilService.setLogEvent(simulatorConstants.eventPrefix + 'start', {});
  }

  public goToSimulator() {
    this.navCtrl.navigateForward('simulator');
  }

  public goToHome() {
    this.navCtrl.pop();
    this.navCtrl.navigateRoot('home-centro-asesoria');
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
      parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.SIMULATOR_START.INIT);

      this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
    }
}
