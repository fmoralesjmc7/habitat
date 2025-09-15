export interface Notificacion {
  id: number;
  rutCliente: string;
  codigoGrupo: any;
  estado: string;
  glosaEstado: string;
  cantidadEnvios: number;
  fechaCreacion: Date;
  fechaEnvio: Date;
  titulo: string;
  mensaje: string;
  link: string;
  autor: string;
}
