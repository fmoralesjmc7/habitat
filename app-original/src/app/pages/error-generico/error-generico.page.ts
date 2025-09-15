import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ClienteDatos, UtilService } from '../../../../src/app/services';
import { CONSTANTES_ERROR_GENERICO } from '../../../../src/app/util/error-generico.constantes';
import { ContextoAPP } from '../../../../src/app/util/contexto-app';
import { ResizeClass } from '../../../../src/app/util/resize.class';

@Component({
  selector: 'ErrorGenericoPage',
  templateUrl: './error-generico.page.html',
  styleUrls: ['./error-generico.page.scss'],
})
export class ErrorGenericoPage extends ResizeClass implements OnInit {

  esCliente: boolean;

  /**
   * Funcionalidad de origen 
   */
  origenDeIngreso: string;

  /**
   * Codigo para reactivación del gif
   */
  uuidGif: string;

  constructor(
    private readonly navCtrl: NavController,
    private readonly clienteDatos: ClienteDatos,
    private readonly route: ActivatedRoute,
    private readonly utilService: UtilService,
    public readonly contextoAPP: ContextoAPP
  ) {
    super(contextoAPP);
    this.esCliente = false;
  }

  ngOnInit() {
    this.clienteDatos.esCliente.subscribe(esCliente => {
      this.esCliente = esCliente;
    });

    this.route.queryParams.subscribe(params => {
      this.origenDeIngreso = params.data;
      this.uuidGif = params.timestamp;
    });
  }

  /**
   * Metodo encargado de volver atrás
   */
  volverAtras() {
    if (!this.origenDeIngreso || this.origenDeIngreso === CONSTANTES_ERROR_GENERICO.home) {
      this.volverAlHome();
    } else {
      this.navCtrl.navigateRoot(this.origenDeIngreso);
    }
  }

  /**
   * Metodo encargado de volver al home
   */
  volverAlHome() {
    if (this.esCliente) {
      this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeCliente);
    } else {
      this.navCtrl.navigateRoot(CONSTANTES_ERROR_GENERICO.homeInvitado);
    }
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
