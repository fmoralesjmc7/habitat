import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { PlanesService, UtilService } from '../../../../../src/app/services';
import { ActualizarDatosService } from '../../../../../src/app/services/api/restful/actualizar-datos.service';
import { UtilFormularioClass } from '../util/util-formularios.class';
import { CONSTANTES_TRAZAS_DATOS } from '../util/datos.constantes';

@Component({
  selector: 'app-actualizar-datos-laborales',
  templateUrl: './actualizar-datos-laborales.component.html',
  styleUrls: ['./actualizar-datos-laborales.component.scss']
})
export class ActualizarDatosLaboralesComponent extends UtilFormularioClass implements OnInit {

  constructor(public readonly actualizarDatosService: ActualizarDatosService,
    public readonly planesService: PlanesService,
    public readonly navCtrl: NavController,
    public readonly contextoAPP: ContextoAPP,
    public readonly utilService: UtilService,
    public readonly route: ActivatedRoute,
    public readonly alertCtrl: AlertController) {
    super(actualizarDatosService, planesService, navCtrl, contextoAPP, utilService, route, alertCtrl);
  }

  /**
   * Metodo que inicializa la vista
   */
  async ngOnInit(): Promise<void> {

    await this.inicializarVista(false);

    this.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_INICIO_LABORAL.CODIGO_OPERACION);

    const loading = await this.contextoAPP.mostrarLoading();
    this.cargarRegionesComunas(loading);
    this.cargarRangosRenta(loading);
  }
}
