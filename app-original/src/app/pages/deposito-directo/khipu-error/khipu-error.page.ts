import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-khipu-error',
  templateUrl: 'khipu-error.page.html',
  styleUrls: [ './khipu-error.page.scss' ]
})
export class KhipuErrorPage {

  constructor(
    private navCtrl: NavController
  ) {
  }

  volverAlHome() {
    this.navCtrl.navigateRoot('HomeClientePage');
  }

}
