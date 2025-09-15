import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services';

export interface Slide {
  title: string;
  description: string;
  showButton: boolean;
  icon: string;
}

/* eslint-disable */
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss']
})
export class TutorialPage {
/* eslint-enable */

  slides: Slide[];
  showBtn: boolean;

  constructor(
    private menu: MenuController,
    private nav: NavController,
    private utilService: UtilService
  ) {
    this.showBtn = false;
    this.slides = [
      {
        title: '¡Bienvenido!',
        description: 'A tu nueva app de AFP Habitat',
        showButton: false,
        icon: 'icon-slide-1'
      },
      {
        title: 'Revisa tus Saldos',
        description: 'Toma el control de tus ahorros y realiza tu proyección de pensión',
        showButton: false,
        icon: 'icon-slide-2'
      },
      {
        title: 'Administra tus Fondos',
        description: 'Cámbiate de fondo rápido y fácil, en el lugar donde estés',
        showButton: false,
        icon: 'icon-slide-3'
      },
      {
        title: 'Recibe Notificaciones',
        description: 'Mantente siempre informado con notificaciones y alertas',
        showButton: false,
        icon: 'icon-slide-5'
      },
      {
        title: '¡Comienza ahora!',
        description: 'Conoce tus saldos, gestiona tus fondos y mantente informado',
        showButton: true,
        icon: 'icon-slide-6'
      }
    ];
  }

  ionViewWillEnter(): void {
    this.utilService.setLogEvent('event_habitat', { option: 'tutorial_begin' });
  }

  continuarConLogin(): void {
    this.utilService.setStorageData('muestra-tutorial', 'no', false);
    this.utilService.setLogEvent('event_habitat', { option: 'tutorial_complete' });
    this.nav.navigateRoot('SigninPage');
  }

  onSlideChangeStart(event: any): void {
    event.target.isEnd().then(isEnd => {
      this.showBtn = isEnd;
    });
  }

}
