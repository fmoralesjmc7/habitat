import { DatosUser, DatosAutenticacions } from '../shared/login.model';

/**
 * Acción actualizar datos usuario en state
 */
export class ActualizarDatosUsuario {
  static readonly type = '[Login] ActualizarDatosUsuario';
  constructor( public datos?: DatosUser ) {}
}

/**
 * Acción actualizar datos autenticacion en state
 */
export class ActualizarDatosAutenticacion {
  static readonly type = '[Login] ActualizarDatosAutenticacion';
  constructor( public datos?: DatosAutenticacions ) {}
}
