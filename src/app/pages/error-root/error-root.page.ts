import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UtilService } from '../../../../src/app/services';
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';
import { App } from '@capacitor/app';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';

type RrssKey = keyof typeof CONSTANTES_ERROR_GENERICO;

@Component({
  selector: 'ErrorRootPage',
  templateUrl: 'error-root.page.html',
  styleUrls: [ './error-root.page.scss' ],
  standalone: true,
  imports: [IonicModule, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ErrorRootPage {

    /**
   * Codigo para reactivación del gif
   */
    uuidGif!: string;

  constructor(
    private readonly utilService: UtilService
  ) {
  }

/**
   * Metodo encargado de cerrar la App.
   */
  cerrar() {
    App.exitApp();
  }

  /**
   * Metodo encargado de desplegar las redes sociales en un browser
   *
   * @param rrss a desplegar
   */
  abrirPageRRSS(rrss: RrssKey) {
    if (CONSTANTES_ERROR_GENERICO[rrss]) {
      this.utilService.openWithSystemBrowser(CONSTANTES_ERROR_GENERICO[rrss]);
    }
  }
}
