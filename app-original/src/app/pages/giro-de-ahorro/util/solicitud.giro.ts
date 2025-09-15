export class SolicitudGiro {
    public rut: string;
    public dv: string;
    public regimenesProducto: string = "[{LISTADO_REGIMENES}]";
    
    public IdEntidadBanco: string;
    public IdTipoCuenta: string;
    public NroCtaCte: string;
    public IdTipoProducto: string;
    public token: string;
}