export class ParametrosCorreoGiro {
    public rut: string;
    public dv: string;

    public archivo: string;
    public nombreArchivo: string;
    public correoCopia: string = "";
    public fecha: string;
    public nombreCompleto: string;
    public numeroSolicitud: string;
    public textoLibre: string;
    public tipoOperacion: string;
    public titulo: string;
    public correoEnviar: string;

    constructor(
        rut: string,
        dv: string,
        archivo: string,
        nombreArchivo: string,
        fecha: string,
        nombreCompleto: string,
        numeroSolicitud: string,
        textoLibre: string,
        tipoOperacion: string,
        titulo: string,
        correoEnviar: string
        ){
            this.rut = rut,
            this.dv = dv,
            this.archivo = archivo;
            this.nombreArchivo = nombreArchivo;
            this.fecha = fecha;
            this.nombreCompleto = nombreCompleto;
            this.numeroSolicitud = numeroSolicitud;
            this.textoLibre = textoLibre;
            this.tipoOperacion = tipoOperacion;
            this.titulo = titulo;
            this.correoEnviar = correoEnviar;
    }
}