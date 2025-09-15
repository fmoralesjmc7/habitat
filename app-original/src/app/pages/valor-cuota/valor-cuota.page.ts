import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IndicadorService, UtilService } from '../../services';
import { DatePipe } from '@angular/common';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';

@Component({
  selector: 'page-valor-cuota',
  templateUrl: './valor-cuota.page.html',
  styleUrls: ['./valor-cuota.page.scss'],
})
export class ValorCuotaPage {

  valoresCuota: any;
  fechaActual: any;

  constructor(
    private navCtrl: NavController,
    private indicadorProvider: IndicadorService,
    private utilService: UtilService,
    private datePipe: DatePipe,
    private contextoAPP: ContextoAPP
  ) {}

  backButton() {
    this.navCtrl.pop();
  }


  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.indicadorProvider.obtenerValorCuotaActual().subscribe((response) => {
      this.valoresCuota = response.valoresCuota;
      this.fechaActual = (response.valoresCuota.length > 0) ?
                          response.valoresCuota[0].fecha : this.datePipe.transform(new Date(), 'dd-MM-yyyy');
                          this.contextoAPP.ocultarLoading(loading);
    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.home));
    });
  }

  visitarRentabilidad() {
    this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Rentabilidad_de_los_Fondos' });
    this.navCtrl.navigateForward('/rentabilidad');
  }

  verEvolucionvalorCuota() {
    this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Evolucion_Valor_Cuota' });
    this.utilService.openWithSystemBrowser('https://www.afphabitat.cl/herramientas-y-servicios/evolucion-valor-cuota/');
  }

  parseInt(valor){
    valor = parseInt(valor);
    return valor
  }
}
