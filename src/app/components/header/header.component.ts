import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IonicModule, MenuController, NavController } from "@ionic/angular";
import { SucursalesService, SucursalPage } from 'src/app/services/sucursales/sucursal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class HeaderComponent {

  @Input() showBackButton = false;
  @Input() titulo!: string;
  @Input() showMenuHamb!: boolean;
  @Output() public clickBackButton = new EventEmitter();

  constructor(
      private navCtrl: NavController,
      public menuCtrl: MenuController,
      private sucursalesService: SucursalesService
  ) {
    if (this.showBackButton == undefined) {
      this.showBackButton = true;
    }
  }

  backButton() {
    this.titulo = undefined!;
    this.navCtrl.pop();
    this.clickBackButton.emit();
  }

  toggleMenu() {
    let sucursalPage: SucursalPage = {
      eliminarMapa: true,
      sucursalCurrentPage: undefined!
    }

    this.sucursalesService.eventoEliminarMapa(sucursalPage);
    this.menuCtrl.toggle();
  }

}
