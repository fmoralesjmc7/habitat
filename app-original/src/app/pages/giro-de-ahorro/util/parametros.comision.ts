export class ParametrosComisionGiro {
    public rut: string;
    public dv: string;
    public fechaRetiro: string;
    public idEntidadMulti: string = "1"; // Valor constante
    public idMaeCuenta: string;
    public idTipRegTribu: string;
    public idTipoFondo: string;
    public idTipoProducto: string;
    public montoRetiro: string;
    public tipoProcesamiento: string = "C";
    public user: string = "APPMOBILE";

    constructor(
        rut: string,
        dv: string,
        fechaRetiro: string,
        idMaeCuenta: string,
        idTipRegTribu: string,
        idTipoFondo: string,
        idTipoProducto: string,
        montoRetiro: string
        ){
            this.rut = rut,
            this.dv = dv,
            this.fechaRetiro = fechaRetiro;
            this.idMaeCuenta = idMaeCuenta;
            this.idTipRegTribu = idTipRegTribu;
            this.idTipoFondo = idTipoFondo;
            this.idTipoProducto = idTipoProducto;
            this.montoRetiro = montoRetiro;
    }
}