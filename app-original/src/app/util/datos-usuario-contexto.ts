/**
 * Objeto que almacena datos de usuario.
 * Se utiliza desde el contexto de la app.
 */
export class DatosUsuario {
    public nombre: string;
    public segundoNombre: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public esCliente: boolean;
    public email: string;
    public rut: number;
    public dv: string;
    public sexo: string;
    public fechaAfiliacion: string;
    public fechaIncorporacion: string;
    public idMaePersona: number;
    public edad: number;
    public esPensionado: boolean;
    public poseeConsultor: string;
    public huellaActiva: boolean;
    public loginHibrido: boolean;
    public telefonoCelular: string;

    // Nuevos parámetros para precarga info simuladores c.a
    public saldoSimulacion: string;
    public rentaImponible: string;

    constructor(cliente: any) {
        this.nombre = cliente.primerNombre;
        this.segundoNombre =  cliente.segundoNombre ?  cliente.segundoNombre: '';
        this.apellidoPaterno = cliente.apellidoPaterno;
        this.apellidoMaterno = cliente.apellidoMaterno;
        this.esCliente = true;
        this.email = cliente.correoElectronico;
        this.rut = cliente.rut;
        this.dv = cliente.digitoVerificadorRut;
        this.sexo = cliente.sexo;
        this.fechaAfiliacion = cliente.fechaAfiliacion;
        this.fechaIncorporacion = cliente.fechaIncorporacion;
        this.idMaePersona = cliente.idMaePersona;
        this.edad = cliente.edad;
        this.esPensionado = cliente.esPensionado;
        this.telefonoCelular = cliente.telefonoCelular;
        this.saldoSimulacion = cliente.saldoSimulacion;
        this.rentaImponible = cliente.rentaImponible;
    }
}