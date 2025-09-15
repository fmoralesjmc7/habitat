import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoginStateModel, DatosUser, DatosAutenticacions } from '../shared/login.model';
import { ActualizarDatosAutenticacion, ActualizarDatosUsuario } from './login.actions';
import { Injectable } from '@angular/core';

@State<LoginStateModel>({
  name: 'login',
//   defaults: {
//     dato2: undefined,
//     dato1: undefined
//   }
})
@Injectable()
export class LoginState {

  /**
   * Obtiene desde el state los datos de usuario
   * @param state
   */
  @Selector()
  static getDatosUsuario(state: LoginStateModel): DatosUser {
     return state.dato1;
  }

  /**
   *
   * @param state
   */
  @Selector()
  static getDatosAutenticacion(state: LoginStateModel): DatosAutenticacions {
     return state.dato2;
  }

  /**
   * Encargado de actualizar datos autenticacion en el state.
   * @param ctx
   * @param action
   */
  @Action(ActualizarDatosAutenticacion)
  public actualizarDatosAutenticacion(ctx: StateContext<LoginStateModel>, action: ActualizarDatosAutenticacion): void {
    ctx.patchState({ dato2: action.datos });
  }

  /**
   * Encargado de actualizar datos usuario en el state.
   * @param ctx
   * @param action
   */
  @Action(ActualizarDatosUsuario)
  public actualizarDatosUsuario(ctx: StateContext<LoginStateModel>, action: ActualizarDatosUsuario): void {
     ctx.patchState({ dato1: action.datos });
  }

}
