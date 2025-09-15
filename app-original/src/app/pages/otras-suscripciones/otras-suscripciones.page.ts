import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";
import { UtilService } from "src/app/services";
import { ContextoAPP } from "src/app/util/contexto-app";
import { CONSTANTES_ERROR_GENERICO } from "src/app/util/error-generico.constantes";
import { LlamadaSaldosConsolidados } from "src/app/util/llamada-saldos-consolidados";
import { CONSTANTES_PRUDENTIAL } from "src/app/util/producto.constantes";
import { CONSTANTES_SALDOS_CONSOLIDADOS } from "./util/saldos-consolidados.constantes";

@Component({
  selector: "page-otras-suscripciones",
  templateUrl: "./otras-suscripciones.page.html",
  styleUrls: ["./otras-suscripciones.page.scss"],
})
export class OtrasSuscripcionesPage {
  tituloHeader = "Consolidación de Saldos Prudential AGF";
  mostrarSuscribirPrudential: boolean = false;
  mostrarDesuscripcionPrudential: boolean = false;
  mostrarNoHabilitada: boolean = false;
  CONSTANTES = CONSTANTES_SALDOS_CONSOLIDADOS;

  constructor(
    private navCtrl: NavController,
    private contextoAPP: ContextoAPP,
    private utilService: UtilService,
    private llamadaSaldosConsolidados: LlamadaSaldosConsolidados
  ) {
  }

  async ionViewDidEnter() {
    const loading = await this.contextoAPP.mostrarLoading();
    this.cargarDatosConsolidacion(loading);
  }

  async cargarDatosConsolidacion(loading: HTMLIonLoadingElement): Promise<void> {
    try {
      const datosPrudential = await this.llamadaSaldosConsolidados.validarClientePrudential();

      if (datosPrudential.estadoConsolidacion === CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.CANCELADO) {
        this.mostrarNoHabilitada = true;
        this.contextoAPP.ocultarLoading(loading);
        return;
      }

      if (datosPrudential.estadoConsolidacion) {
        this.manejarEstadoConsolidacion(datosPrudential.estadoConsolidacion);
      } else {
        this.navCtrl.navigateRoot("ErrorGenericoPage",this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.home));
      }
      this.contextoAPP.ocultarLoading(loading);
    } catch (error) {
      this.contextoAPP.ocultarLoading(loading);
      this.navCtrl.navigateRoot("ErrorGenericoPage",this.utilService.generarNavegacionExtra(CONSTANTES_ERROR_GENERICO.home));
    }  
  }

  /**
   * Funcion que determina el componente a mostrar segun el estado de mandato prudential
   */
  private manejarEstadoConsolidacion(estado: string): void {
    switch (estado) {
      case CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.ACEPTADO:
        this.mostrarDesuscripcionPrudential = true;
        this.mostrarSuscribirPrudential = false;
        break;
      case CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.DESUSCRITO:
        this.mostrarDesuscripcionPrudential = false;
        this.mostrarSuscribirPrudential = true;
        break;
      case CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.NO_FIRMADO:
      case CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.RECHAZADO:
        this.mostrarNoHabilitada = true;
        this.mostrarDesuscripcionPrudential = false;
        this.mostrarSuscribirPrudential = false;
        break;
      default:
        this.mostrarDesuscripcionPrudential = false;
        this.mostrarSuscribirPrudential = false;
        break;
    }
  }

  public async onActualizarSuscripcion(): Promise<void> {  
    const loading = await this.contextoAPP.mostrarLoading();
    this.cargarDatosConsolidacion(loading);
  }

  backButton(): void {
    this.navCtrl.pop();
  }
}
