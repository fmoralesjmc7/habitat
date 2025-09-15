import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ContextoAPP } from '../../../../../src/app/util/contexto-app';
import { ResizeClass } from '../../../../../src/app/util/resize.class';

@Component({
  selector: 'app-actualizar-datos-exito',
  templateUrl: './actualizar-datos-exito.page.html',
  styleUrls: ['./actualizar-datos-exito.page.scss'],
})
export class ActualizarDatosExitoPage extends ResizeClass implements OnInit {

  validadorEnvioCorreo: boolean = true;

  constructor(private readonly navCtrl: NavController,
    public readonly contextoAPP: ContextoAPP) {
    super(contextoAPP);
  }

  ngOnInit() {
    // Inicialización futura planificada
  }

  /**
  * Regresa al usuario al home de la app.
  */
  volverAlHome() {
    this.navCtrl.navigateRoot('HomeClientePage');
  }

}
