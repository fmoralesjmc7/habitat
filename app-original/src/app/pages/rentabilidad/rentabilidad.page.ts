import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IndicadorService, UtilService } from '../../services';
import { ENV } from '../../../environments/environment';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';

@Component({
  selector: 'page-rentabilidad',
  templateUrl: './rentabilidad.page.html',
  styleUrls: ['./rentabilidad.page.scss'],
})
export class RentabilidadPage {

  truncarTexto: boolean;
  truncarTextoDos: boolean;

  datoRecopilado12: any[] = [];
  posicion12: any[] = [];
  parrafo12: string;
  subtitulo12: string;

  datoRecopilado60: any[] = [];
  posicion60: any[] = [];
  parrafo60: string;
  subtitulo60: string;

  linkPaginaRentabilidad: string;
  dominio: string = ENV.base_url_habitat;

  constructor(
    private indicadorProvider: IndicadorService,
    private utilService: UtilService,
    private nav: NavController,
    private contextoAPP: ContextoAPP
  ) {
    this.truncarTexto = true;
    this.truncarTextoDos = true;
  }
  backButton() {
    this.nav.pop();
  }

  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.indicadorProvider.obtenerRentabilidad().subscribe((response) => {
      try {
        if (response.length > 0 && response[0].acf && response[0].acf.fondos && response[0].acf.fondos[0]) {
          const responseFondo = response[0].acf.fondos[0];

          this.linkPaginaRentabilidad = response[0].link;
          // 12 meses
          responseFondo.filas_tabla_rentabilidad_anual.forEach(registro => {
            this.datoRecopilado12.push(registro);
          });
          responseFondo.posicion_relativa_anual.forEach(registro => {
            this.posicion12.push(registro);
          });
          this.subtitulo12 = responseFondo.app_titulo_tabla_12_meses;
          this.parrafo12 = responseFondo.app_pie_tabla_12_meses;
          // 60 meses
          responseFondo.filas_tabla_rentabilidad_mensual.forEach(registro => {
            this.datoRecopilado60.push(registro);
          });
          responseFondo.posicion_relativa_mensual.forEach(registro => {
            this.posicion60.push(registro);
          });
          this.subtitulo60 = responseFondo.app_titulo_tabla_60_meses;
          this.parrafo60 = responseFondo.app_pie_tabla_60_meses;
          this.contextoAPP.ocultarLoading(loading);
        } else{
          this.contextoAPP.ocultarLoading(loading);
          this.nav.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.valorCuota));
        }
      } catch (e) {
        this.contextoAPP.ocultarLoading(loading);
        this.nav.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.valorCuota));
      }

    }, (error) => {
      this.contextoAPP.ocultarLoading(loading);
      this.nav.navigateRoot('ErrorGenericoPage', this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.valorCuota));
    });
  }

  abrirPaginaRentabilidad() {
    this.utilService.setLogEvent('event_habitat', { option: 'Acceso_Rentabilidad_periodos_anteriores' });
    this.utilService.openWithSystemBrowser(this.dominio + this.linkPaginaRentabilidad);
  }

  moreMethod() {
    this.truncarTexto = !this.truncarTexto;
  }
  lessMethod() {
    this.truncarTexto = !this.truncarTexto;
  }
  moreMethodDos() {
    this.truncarTextoDos = !this.truncarTextoDos;
  }
  lessMethodDos() {
    this.truncarTextoDos = !this.truncarTextoDos;
  }

}
