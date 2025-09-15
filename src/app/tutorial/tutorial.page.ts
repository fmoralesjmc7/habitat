import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { register } from 'swiper/element/bundle';
register();

export interface Slide {
  title: string;
  description: string;
  showButton: boolean;
  icon: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  standalone: false
})

export class TutorialPage {

  slides: Slide[] = [
    { title: '¡Bienvenido!', description: 'A tu nueva app de AFP Habitat', showButton: false, icon: 'icon-slide-1' },
    { title: 'Revisa tus Saldos', description: 'Toma el control de tus ahorros y realiza tu proyección de pensión', showButton: false, icon: 'icon-slide-2' },
    { title: 'Administra tus Fondos', description: 'Cámbiate de fondo rápido y fácil, en el lugar donde estés', showButton: false, icon: 'icon-slide-3' },
    { title: 'Recibe Notificaciones', description: 'Mantente siempre informado con notificaciones y alertas', showButton: false, icon: 'icon-slide-5' },
    { title: '¡Comienza ahora!', description: 'Conoce tus saldos, gestiona tus fondos y mantente informado', showButton: true, icon: 'icon-slide-6' }
  ];

  showBtn = false;

  constructor(private nav: NavController) {}

  ionViewWillEnter(): void {
    // placeholder for analytics if needed
  }

  async continuar(): Promise<void> {
    await Preferences.set({ key: 'muestra-tutorial', value: 'no' });
    this.nav.navigateRoot('/signin');
  }

  onSlideChange(event: Event): void {
    const target = event.target as any;
    const isEnd = target?.swiper?.isEnd ?? false;
    this.showBtn = !!isEnd;
  }
}
