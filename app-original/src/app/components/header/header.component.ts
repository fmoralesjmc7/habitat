import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuController, NavController } from "@ionic/angular";
import { SucursalesService, SucursalPage } from 'src/app/services/sucursales/sucursal.service';

/**
 * Para utilizar el componente header, se deben importar los componentes en la vista seleccionada en el archivo .module respectivo a la pagina de esta forma:

 import { ComponentsModule } from '../../components/components.module';
 imports: [
 …,
 ComponentsModule,
 …
 ]

 Desde el html se debe reemplazar el header completo por
 <app-header></app-header>
 */

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() showBackButton: boolean;
  @Input() titulo: string;
  @Input() showMenuHamb: boolean;
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

  ngOnInit() {
    //requerido
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
