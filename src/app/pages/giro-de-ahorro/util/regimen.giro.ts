import { FondoRegimenGiro } from './fondo.regimen.giro';

export class RegimenGiro {
  idTipoRegimenTributario = '';
  saldoTotal: number;
  nombreRegimen = '';
  montoTotalGirar = '';
  listadoFondos: FondoRegimenGiro[];
  confirmado = false;
  // Validador encargado de mostrar toast de 24 giros covid , solo aplica para cuenta 2
  estado24GirosCOVID = false;

  constructor() {
    this.listadoFondos = [];
    this.saldoTotal = 0;
  }

  /**
   * Función encargada de sumar montos de fondo al total del regimen
   * @param montoASumar monto del fondo a sumar al total.
   */
  public sumarMontoSaldoTotal(montoASumar: number) {
    this.saldoTotal += montoASumar;
  }

  /**
   * Función que resetea estado boton confirmar
   */
  public resetearConfirmacionFondos() {
    for (let fondo of this.listadoFondos) {
      fondo.montoGirar = fondo.montoGirarConfirmado;
      fondo.botonConfirmadoDesactivado = false;
    }
  }
}
