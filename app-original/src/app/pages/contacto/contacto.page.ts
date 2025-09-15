import { Component } from '@angular/core';
import { UtilService } from '../../services/index';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage {
  telefonoContactanos: string;

  constructor(
      private utilService: UtilService,
      private navCtrl: NavController
  ) {
    this.telefonoContactanos = '6002202000';
  }

  abrirPageRRSS(rrss: string) {
    let url: string;
    switch (rrss) {
      case 'instagram':
        url = 'https://www.instagram.com/afp_habitat/';
        break;
      case 'twitter-ayuda':
        url = 'https://twitter.com/Habitat_Ayuda';
        break;
      case 'twitter':
        url = 'https://twitter.com/afphabitat';
        break;
      case 'facebook':
        url = 'https://www.facebook.com/afphabitat';
        break;
      case 'linkedin':
        url = 'https://cl.linkedin.com/company/afp-habitat';
        break;
      case 'youTube':
        url = 'https://www.youtube.com/user/AfpHabitatOficial';
        break;
      default:
        url = 'https://www.afphabitat.cl';
        break;
    }
    this.utilService.openWithSystemBrowser(url);
  }

  backButton() {
    this.navCtrl.pop();
  }

  llamarContactanos() {
    window.open('tel:' + this.telefonoContactanos, '_system');
  }

}
