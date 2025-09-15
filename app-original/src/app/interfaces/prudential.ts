export interface CuentaPrudential {
  codigoCuenta: string;
  valorCuenta: number;
  tituloCuenta: string;
  tipoSaldo: string;
}

export interface DetalleSaldosConsolidadosResp {
  detalleCuentas: Array<CuentaPrudential> 
  valorTasa?: number
}

export interface SucripcionPrudentialRequest {
  tipoMandato: number;
  estado: string;
  creadoPor: string;
}

export interface RespuestaRequest {
  body: { O_CODIGO: number; O_MENSAJE: string };
}

export interface EstadoMandatoResp {
  body: EstadoMandatoBody;
  return: RespuestaRequest;
}

export interface EstadoMandatoBody {
  O_ESTADO: string;
}

export interface EstadoMandatoPrudential {
  resp: string;
}

export interface DatosPrudential {
  estadoMandato?: string;
  estadoConsolidacion?: string;
  preferencia?: boolean;
  productos?: CuentaPrudential[];
  codigoProducto?: string;
}
