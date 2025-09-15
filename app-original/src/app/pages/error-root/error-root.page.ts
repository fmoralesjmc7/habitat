import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from '../../../../src/app/services';
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';

@Component({
  selector: 'ErrorRootPage',
  templateUrl: 'error-root.page.html',
  styleUrls: [ './error-root.page.scss' ]
})
export class ErrorRootPage {

    /**
   * Codigo para reactivación del gif
   */
    uuidGif: string;

  constructor(
    private navCtrl: NavController,
    private readonly utilService: UtilService
  ) {
  }

/**
   * Metodo encargado de cerrar la App.
   */
  cerrar() {
    navigator['app'].exitApp();
  }

  /**
   * Metodo encargado de desplegar las redes sociales en un browser
   * 
   * @param rrss a desplegar
   */
  abrirPageRRSS(rrss: string) {
    if (CONSTANTES_ERROR_GENERICO[rrss]) {
      this.utilService.openWithSystemBrowser(CONSTANTES_ERROR_GENERICO[rrss]);
    }
  }
}
