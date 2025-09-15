import { Component, Input } from '@angular/core';
import { DatosActualizarUsuario } from 'src/app/pages/actualizar-datos/util/datos.actualizar.usuario'; 

@Component({
  selector: 'actualizar-datos-listado-empleadores',
  templateUrl: './listado-empleadores.component.html',
  styleUrls: ['./listado-empleadores.component.scss'],
})
export class ListadoEmpleadoresComponent {
  @Input() datosUsuario: DatosActualizarUsuario;

  constructor() {
    // construtor del componente
  }
}
