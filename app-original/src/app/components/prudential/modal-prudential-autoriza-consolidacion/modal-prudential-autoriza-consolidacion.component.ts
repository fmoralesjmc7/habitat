import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DatosPrudential, SucripcionPrudentialRequest } from "src/app/interfaces/prudential";
import { CONSTANTES_TOAST_SALDOS_CONSOLIDADOS } from "src/app/pages/otras-suscripciones/util/saldos-consolidados.constantes";
import { UtilService } from "src/app/services";
import { PrudentialService } from "src/app/services/api/restful/prudential.service";
import { ContextoAPP } from "src/app/util/contexto-app";
import { LlamadaSaldosConsolidados } from "src/app/util/llamada-saldos-consolidados";
import { CONSTANTES_PRUDENTIAL } from "src/app/util/producto.constantes";

@Component({
  selector: "app-modal-prudential-autoriza-consolidacion",
  templateUrl: "./modal-prudential-autoriza-consolidacion.component.html",
  styleUrls: ["./modal-prudential-autoriza-consolidacion.component.scss"]
})
export class ModalPrudentialAutorizaConsolidacionComponent implements OnInit {

  @Output() cerrarModal: EventEmitter<void> = new EventEmitter();
  @Output() finalizarConsolidacion: EventEmitter<void> = new EventEmitter();

  constructor(
    private prudentialService: PrudentialService,
    private contextoApp: ContextoAPP,
    private utilService: UtilService,
    private llamadaSaldosConsolidados: LlamadaSaldosConsolidados) {}

  ngOnInit(): void {
    //requerido
  }

  onCerrarModal(): void {
    this.cerrarModal.emit();
  }

  onFinalizarConsolidacion(): void {
    this.finalizarConsolidacion.emit();
  }

  /**
   * Metodo encargado de guardar la consolidacion de saldos
   */
  async guardarConsolidacion(): Promise<void> {
    const loading = await this.contextoApp.mostrarLoading();
    const suscripcion: SucripcionPrudentialRequest = {
      tipoMandato: CONSTANTES_PRUDENTIAL.TIPO_MANDATO_HAB.CONSOLIDACION_SALDOS,
      estado: CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.ACEPTADO,
      creadoPor: CONSTANTES_PRUDENTIAL.USUARIO.INTERNET
    };
    this.prudentialService.guardarSuscripcionPrudential(suscripcion).subscribe(async (response) => {
      const prudential = await this.llamadaSaldosConsolidados.obtenerDatosPrudential();
      this.registrarDatosPrudential(prudential);
      this.contextoApp.ocultarLoading(loading);
      this.onFinalizarConsolidacion();
    }, (error) => {
      this.contextoApp.ocultarLoading(loading);
      this.utilService.mostrarToastIcono(CONSTANTES_TOAST_SALDOS_CONSOLIDADOS.TEXTO_ERROR_SERVICIO);
      console.error(error);
    });
  }

  /**
   * Metodo encargado de registrar los datos de prudential del cliente logeado
   * @param datos datos relacionados con prudential
   */
  registrarDatosPrudential(prudential: DatosPrudential): void {
    this.llamadaSaldosConsolidados.registrarDatosPrudential(prudential);
  }
}
