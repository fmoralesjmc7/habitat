import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuController, NavController } from "@ionic/angular";
import { HeaderElements } from 'src/app/interfaces/header-elements'; 

@Component({
  selector: 'app-header-centro-asesoria',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponentCA implements OnInit {
  @Input() public headerElements: HeaderElements;
  @Output() public clickLeftButton = new EventEmitter();
  @Output() public clickRightButton = new EventEmitter();
  ocultarImagenHeader:boolean;

  constructor(
      private navCtrl: NavController,
      public menuCtrl: MenuController
  ) {
    if (!this.headerElements) {
      this.headerElements = {};
    }

  }

  ngOnInit() {
    //requerido
  }

  public clickButton(position: string) {
    if (position === 'left') { 
      this.clickLeftButton.emit(); 
    }
    if (position === 'right') {
      if (this.headerElements.iconRight === 'btn-icon icon-menu-hamb') { return this.menuCtrl.toggle(); }
      this.clickRightButton.emit();
    }
  }
}
