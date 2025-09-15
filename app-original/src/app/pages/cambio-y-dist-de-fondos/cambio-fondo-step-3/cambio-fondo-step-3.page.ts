import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { ClienteDatos, UtilService, TrazabilidadService } from '../../../services/index';
import {ActivatedRoute} from "@angular/router";
import {AppComponent} from "../../../app.component";
import { CONSTANTES_CAMBIO_FONDO } from '../util/constantes.cambio';
import { ParametroTraza } from '../../../../../src/app/util/parametroTraza';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';


@Component({
  selector: 'app-cambio-fondo-step-3',
  templateUrl: './cambio-fondo-step-3.page.html',
  styleUrls: ['./cambio-fondo-step-3.page.scss'],
})
export class CambioFondoStep3Page implements OnInit {

  email: string;
  rut: number;
  dv: string;
  idSolicitud: number;
  pdfBytesArray: string;
  envioDeCorreoExitoso: boolean;
  productosClientesModificados: any[];
  numeroFolio: number;

  /**
  * Uuid de trazas
  */
  uuid: string;

  constructor(
      private clienteDatos: ClienteDatos,
      private utilService: UtilService,
      private toast: ToastController,
      private trazabilidadProvider: TrazabilidadService,
      private route: ActivatedRoute,
      private readonly navCtrl: NavController,
      private readonly contextoApp: ContextoAPP
  ) {

    this.pdfBytesArray = AppComponent.descargaPDF;

    this.route.queryParams.subscribe(params => {
      this.idSolicitud = params.idSolicitud;
      this.envioDeCorreoExitoso = params.correoExitoso;
      this.productosClientesModificados = JSON.parse(params.productos);
      this.numeroFolio = params.numeroFolio;
    });
  }

  async ngOnInit() {
    this.utilService.setLogEvent('event_habitat', { option:'Paso_3_Fin_Cambio_Distribución_Fondo' });
    this.clienteDatos.rut.subscribe(rut => {
      this.rut = rut;
    });
    this.clienteDatos.dv.subscribe(dv => {
      this.dv = dv;
    });
    this.clienteDatos.email.subscribe(email => {
      this.email = email;
    });

    this.uuid = await this.utilService.getStorageUuid();

    await this.registrarTrazabilidad();
  }

  volverAlHome() {
    AppComponent.descargaPDF = undefined!;
    this.navCtrl.navigateRoot(['HomeClientePage']);
  }

  descargarPdf() {
    this.utilService.generarPdf(this.pdfBytesArray);
  }

  /**
   * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
   * @param parametroTraza
   */
  async registrarTrazabilidad() {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const datosGenerales = {
        traza : CONSTANTES_CAMBIO_FONDO,
        uuid : this.uuid,
        rut: this.rut,
        dv: this.dv,
    }
    parametroTraza.uuid = '';
    parametroTraza = this.contextoApp.generarObjetoTraza(datosGenerales, CONSTANTES_CAMBIO_FONDO.STEP3.INICIO);

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
  }

}
