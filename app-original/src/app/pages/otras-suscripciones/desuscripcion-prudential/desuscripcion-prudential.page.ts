import { Component, EventEmitter, Output } from "@angular/core";
import { DatosPrudential, SucripcionPrudentialRequest } from "src/app/interfaces/prudential";
import { PrudentialService } from "src/app/services/api/restful/prudential.service";
import { ContextoAPP } from "src/app/util/contexto-app";
import { CONSTANTES_PRUDENTIAL } from "src/app/util/producto.constantes";
import { CONSTANTES_TOAST_SALDOS_CONSOLIDADOS } from "../util/saldos-consolidados.constantes";
import { UtilService } from "src/app/services";
import { LlamadaSaldosConsolidados } from "src/app/util/llamada-saldos-consolidados";

@Component({
  selector: "page-desuscripcion-prudential",
  templateUrl: "./desuscripcion-prudential.page.html",
  styleUrls: ["./desuscripcion-prudential.page.scss"],
})
export class DesuscripcionPrudentialPage {
  /**
   * Emisor que confirma cambio en suscripcion.
   */
  @Output() actualizarVentana: EventEmitter<void> = new EventEmitter();

  /**
   * Variable que almacena estado del guardando.
   */
  guardando: boolean = false;

  /**
   * validador modal felicitaciones consolidacion prudential.
   */
  modalExitoDesuscripcion: boolean;
  
  /**
   * validador modal mostrar confirmacion de desuscribir.
   */
  mostrarConfirmarDesuscripcion: boolean = false;

  constructor(private prudentialService: PrudentialService,
              private llamadaSaldosConsolidados: LlamadaSaldosConsolidados,
              private contextoApp: ContextoAPP,
              private utilService: UtilService) {}

  async guardarSuscripcion(): Promise<void> {
    const loading = await this.contextoApp.mostrarLoading();
    if(!this.guardando){
      this.guardando = true;
      const mandatoRequest = this.obtenerSuscripcionRequest();
      this.prudentialService.guardarSuscripcionPrudential(mandatoRequest).subscribe(async (response) => {
        this.guardando = false;
        if (response.body.O_MENSAJE === "OK") {
          const prudential = await this.llamadaSaldosConsolidados.obtenerDatosPrudential();
          this.registrarDatosPrudential(prudential);
          this.contextoApp.ocultarLoading(loading);
          this.mostrarConfirmarDesuscripcion = false;
          this.modalExitoDesuscripcion = true;
        } else {
          this.contextoApp.ocultarLoading(loading);
          this.utilService.mostrarToastIcono(CONSTANTES_TOAST_SALDOS_CONSOLIDADOS.TEXTO_ERROR_SERVICIO);
        }
      }, (error) => {
        this.guardando = false;
        this.contextoApp.ocultarLoading(loading);
        this.utilService.mostrarToastIcono(CONSTANTES_TOAST_SALDOS_CONSOLIDADOS.TEXTO_ERROR_SERVICIO);
      });
    }
  }

  private obtenerSuscripcionRequest(): SucripcionPrudentialRequest {
    return {
      tipoMandato: CONSTANTES_PRUDENTIAL.TIPO_MANDATO_HAB.CONSOLIDACION_SALDOS,
      estado: CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.DESUSCRITO,
      creadoPor: CONSTANTES_PRUDENTIAL.USUARIO.INTERNET
    };
  }

  public onCerrarModalExito(): void {
    this.modalExitoDesuscripcion = false;
    this.actualizarVentana.emit();
  }

  /**
  * Metodo encargado de registrar los datos de prudential del cliente logeado
  * @param datos datos relacionados con prudential
  */
  registrarDatosPrudential(prudential: DatosPrudential): void {
    this.llamadaSaldosConsolidados.registrarDatosPrudential(prudential);
  }

}
