import { RegimenGiro } from './regimen.giro';

export class ParametrosGiro {
  // Referencia al rut
  public rut: number;
  // Referencia al digito verificador.
  public dv: string;
  // Referencia al correo usuario.
  public email: string;
  // Referencia a nombre usuario.
  public nombreUsuario: string;
  // Referencia a apellido usuario.
  public apellidoUsuario: string;
  // listado de regimenes a girar.
  public listadoRegimenesAGirar: RegimenGiro[] = [];
  // Tipo de producto seleccionado por el usuario , valores CAV (Cuenta 2) o CCICV (APV)
  public tipoProductoSeleccionado: string;
  // Tipo de producto seleccionado por el usuario , valores Cuenta 2 (2) o APV (4)
  public idTipoProducto: number;
  // hardcode!
  public telefonoCelular: string;
  // ID banco seleccionado , desde combo banco.
  public idBancoSeleccionado = '';
  // ID Tipo cuenta seleccionado , desde combo tipo cuenta banco
  public idTipoCuentaBancoSeleccionada = '';
  // Numero de cuenta ingresada por el usuario , para realizar el giro.
  public numeroCuenta = '';

  constructor(
    rut: number,
    dv: string,
    email: string,
    nombreUsuario: string,
    apellidoUsuario: string,
    telefonoCelular: string,
    listadoRegimenesAGirar: RegimenGiro[],
    idTipoProducto: number,
    tipoProductoSeleccionado: string
  ) {
    this.rut = rut;
    this.dv = dv;
    this.email = email;
    this.nombreUsuario = nombreUsuario;
    this.apellidoUsuario = apellidoUsuario;
    this.telefonoCelular = telefonoCelular;
    this.listadoRegimenesAGirar = listadoRegimenesAGirar;
    this.idTipoProducto = idTipoProducto;
    this.tipoProductoSeleccionado = tipoProductoSeleccionado;
  }
}
