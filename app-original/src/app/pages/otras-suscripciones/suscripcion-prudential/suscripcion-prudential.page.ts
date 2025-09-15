import { Component, EventEmitter, Output } from '@angular/core';
import { DatosPrudential, SucripcionPrudentialRequest } from 'src/app/interfaces/prudential';
import { UtilService } from 'src/app/services';
import { PrudentialService } from 'src/app/services/api/restful/prudential.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { LlamadaSaldosConsolidados } from 'src/app/util/llamada-saldos-consolidados';
import { CONSTANTES_PRUDENTIAL } from 'src/app/util/producto.constantes';
import { CONSTANTES_TOAST_SALDOS_CONSOLIDADOS } from '../util/saldos-consolidados.constantes';

@Component({
  selector: 'page-suscripcion-prudential',
  templateUrl: './suscripcion-prudential.page.html',
  styleUrls: ['./suscripcion-prudential.page.scss']
})
export class SuscripcionPrudentialPage {

  /**
   * Emisor que confirma cambio en suscripcion. 
   */
  @Output() actualizarVentana: EventEmitter<void> = new EventEmitter();

  guardando: boolean = false;
  mostrarModalFelicitaciones: boolean = false;
  ventanaActual = CONSTANTES_PRUDENTIAL.MODAL_FELICITACIONES.CODIGO;

  constructor(
    private prudentialService: PrudentialService, 
    private llamadaSaldosConsolidados: LlamadaSaldosConsolidados,
    private utilService: UtilService,
    private contextoApp: ContextoAPP) { }

  onCerrarModalFelicitaciones(): void {
    this.mostrarModalFelicitaciones = false;
    this.actualizarVentana.emit();
  }

  async guardarSuscripcion(): Promise<void> { 
    const loading = await this.contextoApp.mostrarLoading();
    if (!this.guardando){
      this.guardando = true;
      const mandatoRequest = this.obtenerMandatoRequest();
      this.prudentialService.guardarSuscripcionPrudential(mandatoRequest).subscribe(async (response) => {
        this.guardando = false;
        if (response.body.O_MENSAJE === "OK") {
          const prudential = await this.llamadaSaldosConsolidados.obtenerDatosPrudential();
          this.registrarDatosPrudential(prudential);
          this.contextoApp.ocultarLoading(loading);
          this.mostrarModalFelicitaciones = true;
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

  /**
   * Metodo encargado de registrar los datos de prudential del cliente logeado
   * @param datos datos relacionados con prudential
   */
  registrarDatosPrudential(prudential: DatosPrudential): void {
    this.llamadaSaldosConsolidados.registrarDatosPrudential(prudential);
  }

  private obtenerMandatoRequest(): SucripcionPrudentialRequest {
    return {
      tipoMandato: CONSTANTES_PRUDENTIAL.TIPO_MANDATO_HAB.CONSOLIDACION_SALDOS,
      estado: CONSTANTES_PRUDENTIAL.ESTADO_MANDATO_HAB.ACEPTADO,
      creadoPor: CONSTANTES_PRUDENTIAL.USUARIO.INTERNET
    };
  }

}
