import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IndicadorService, UtilService } from '../../services';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';

@Component({
  selector: 'page-indicadores',
  templateUrl: './indicadores.page.html',
  styleUrls: ['./indicadores.page.scss'],

})
export class IndicadoresPage {

  valores: any[] = [];

  constructor(
      private readonly indicadorProvider: IndicadorService,
      private readonly contextoAPP: ContextoAPP,
      private readonly navCtrl: NavController,
      private readonly utilService: UtilService
  ) {}

  backButton() {
    this.navCtrl.pop();
  }



  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
      this.valores = [];

      this.indicadorProvider.obtenerIndicadoresEconomicos().subscribe((response) => {
        response.tiposMoneda.forEach((registro: any) => {
          const indicador = { nombre: '', valor: 0 };
          if (registro.codigoMoneda === 'UF') {
            indicador.nombre = 'UF';
            indicador.valor = registro.valor;
            this.valores.push(indicador);
          } else if (registro.codigoMoneda === 'USD') {
            indicador.nombre = 'Dólar';
            indicador.valor = registro.valor;
            this.valores.push(indicador);
          } else if (registro.codigoMoneda === 'UTM') {
            indicador.nombre = 'UTM';
            indicador.valor = registro.valor;
            this.valores.push(indicador);
          }
        });
        this.contextoAPP.ocultarLoading(loading);
      }, (error) => {
        this.contextoAPP.ocultarLoading(loading);
        this.navCtrl.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.home));
      });
    }
}
