export interface TransaccionRequest {
  banco: BancoTransaccion;
  canal: {
    idCanal: number;
    nombre: string;
  },
  codNacionalidad: number;
  cuentaCorriente: number;
  datosPersonales: DatosPersonales;
  deposito: string;
  envio: {
      fechaHoraEnvio: string;
      fechaHoraRespuesta: string;
      idEnvio: number;
  },
  estado: {
      descripcion: string;
      idEstado: number;
  },
  fechaTransaccion: string;
  folio: number;
  folioPlanilla: number;
  nroTransaccion: number;
  origenFondo: {
      codigo: string;
      nombreOrigenFondo: string;
  },
  regimenTributario: string;
  tipoCuenta: string;
  transaccionDetalle: DetalleTransaccion;
}

interface DetalleTransaccion {
  detalle: string;
  idBanco: number;
  idCarga: number;
  idTransaccionDetalle: number;
  nroTransaccion: number;
}

interface BancoTransaccion {
  activo: string;
  ctaCteHabitat: number;
  horaFinActivacion: string;
  horaInicioActivacion: string;
  idBanco: number;
  nombre: string;
  numConvenio: number;
}

interface DatosPersonales {
  apellidoMaterno: string;
  apellidoPaterno: string;
  calle: string;
  ciudad: string;
  codCiudad: string;
  codComuna: string;
  codFonoCelular: string;
  codFonoParticular: string;
  codNacionalidad: string;
  codRegion: string;
  comuna: string;
  dv: string;
  email: string;
  fechaNacimiento: string;
  fonoCelular: string;
  fonoParticular: string;
  idDatosPersonales: number;
  nacionalidad?: string;
  nombres: string;
  numero: string;
  region: string;
  rut: number;
  sexo: string;
  tipoTrabajador: string;
}

export interface TransaccionResponse {
  estado: string;
  mensaje: string;
  nroTransaccion: string;
}

export interface GeneraTransaccion {
  transaccion: { 
    banco: {
      activo: string;
      ctaCteHabitat: number;
      horaFinActivacion: string;
      horaInicioActivacion: string;
      idBanco: number;
      nombreBanco: string;
      numConvenio: number;
    },
    canal: {
      idCanal: string;
      nombreCanal: string;
    },
    codNacionalidad: string;
    cuentaCorriente: string;
    datosPersonales: {
      rut: number;
      dv: string;
    },
    deposito: number;
    envio: {
      fechaHoraEnvio: string;
      fechaHoraRespuesta: string;
      idEnvio: string;
    },
    estado: {
      descripcion: string;
      idEstado: string;
    },
    fechaTransaccion: string;
    folio: string;
    folioPlanilla: string;
    nroTransaccion: string;
    origenFondo: {
      codigo: string;
      nombreOrigenFondo: string;
    },
    regimenTributario: string;
    tipoCuenta: string;
    transaccionDetalle: DetalleTransaccion;
  }
}