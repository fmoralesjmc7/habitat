export class FondoRegimenGiro {
  public idFondo = '';
  public nombreFondo = '';
  public saldoActual = 0; // Saldo actual del fondo , en el regimen en especifico.
  public cuotasActual = 0; // Valor cuotas actual.
  public montoGirarConfirmado = ''; // Monto a girar por el usuario , confirmado!
  public montoGirar = ''; // Monto a girar por el usuario ( bruto )
  public impuestos = 0; // Impuesto aplicado solo producto APV solo en fondo B
  public comision = 0; // calculado desde servicio buscar-comision
  public montoLiquido = 0;
  public montoBruto = 0; // Monto bruto = (monto a girar - impuesto)-comision;
  public saldoPostGiro: number = 500000; // calcular
  public cuotasPostGiro = 0; // calcular
  public totalCuotasGirar = ''; // total en cuotas
  public totalCuotasGirarFormat = ''; // mostrado en step 2

  public valorCuotaActual = 0; // utilizado en logica solicitud de giro.
  public idCuentaMae = ''; // utilizado en logica solicitud de giro.
  public mostrarDetalleGiroFondo: boolean = false;
  public confirmadoParaGirar: boolean = false;
  public botonConfirmadoDesactivado: boolean = false;
  public esGiroEnCuotas: boolean = false; // si el usuario gira más del 90% de su saldo , el giro se realiza en cuotas (solo cuenta 2).

  public totalCuotas = '';
}
