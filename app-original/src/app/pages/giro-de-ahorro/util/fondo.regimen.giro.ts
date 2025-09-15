export class FondoRegimenGiro {
    public idFondo: string;
    public nombreFondo: string;
    public saldoActual: number; // Saldo actual del fondo , en el regimen en especifico.
    public cuotasActual: number; // Valor cuotas actual. 
    public montoGirarConfirmado: string; // Monto a girar por el usuario , confirmado!
    public montoGirar: string; // Monto a girar por el usuario ( bruto )
    public impuestos: number = 0; // Impuesto aplicado solo producto APV solo en fondo B 
    public comision: number = 0; // calculado desde servicio buscar-comision
    public montoLiquido: number = 0;
    public montoBruto: number; // Monto bruto = (monto a girar - impuesto)-comision;
    public saldoPostGiro: number = 500000; // calcular
    public cuotasPostGiro: number; // calcular
    public totalCuotasGirar: string; // total en cuotas
    public totalCuotasGirarFormat: string; // mostrado en step 2

    public valorCuotaActual: number; // utilizado en logica solicitud de giro.
    public idCuentaMae: string; // utilizado en logica solicitud de giro.
    public mostrarDetalleGiroFondo: boolean = false;
    public confirmadoParaGirar: boolean = false;
    public botonConfirmadoDesactivado: boolean = false;
    public esGiroEnCuotas: boolean = false; // si el usuario gira más del 90% de su saldo , el giro se realiza en cuotas (solo cuenta 2). 

    public totalCuotas: string;
}