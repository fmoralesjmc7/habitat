/**
 * Clase que representa el request del servicio de blacklist
 */
export class RequestValidacionCuenta {
  public nrut_cuenta: string;
  public codi_banco: string;
  public nmro_cuenta: string;
  public tipo_cuenta: string;
}

/**
 * Clase que representa el response del blacklist
 */
export class ResponseValidacionCuenta {
  public return: string;
}
