import { FondoRegimenGiro } from "./fondo.regimen.giro";

export class RegimenGiro {
    public idTipoRegimenTributario: string;
    public saldoTotal: number;
    public nombreRegimen: string;
    public montoTotalGirar: string;
    public listadoFondos: FondoRegimenGiro[];
    public confirmado: boolean;
    // Validador encargado de mostrar toast de 24 giros covid , solo aplica para cuenta 2
    public estado24GirosCOVID:boolean;

    constructor() {
        this.listadoFondos = [];
        this.saldoTotal = 0;
    }

    /**
     * Función encargada de sumar montos de fondo al total del regimen 
     * @param montoASumar monto del fondo a sumar al total.
     */
    public sumarMontoSaldoTotal(montoASumar: number){
        this.saldoTotal += montoASumar;
    }

    /**
     * Función que resetea estado boton confirmar
     */
    public resetearConfirmacionFondos() {
        for(let fondo of this.listadoFondos) {
            fondo.montoGirar = fondo.montoGirarConfirmado;
            fondo.botonConfirmadoDesactivado = false;
        }
    }
}