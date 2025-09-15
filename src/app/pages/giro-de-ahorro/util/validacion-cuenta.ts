/**
 * Clase que representa el request del servicio de blacklist
 */
export interface RequestValidacionCuenta {
  nrut_cuenta: string;
  codi_banco: string;
  nmro_cuenta: string;
  tipo_cuenta: string;
}

/**
 * Clase que representa el response del blacklist
 */
export interface ResponseValidacionCuenta {
  return: string;
}
