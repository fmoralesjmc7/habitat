import { Component, OnInit } from '@angular/core';
import { ModalComponentCA } from '../../components/ca-modal/modal.component';
import { HeaderElements } from '../../interfaces/header-elements';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponentCA extends ModalComponentCA implements OnInit {
  public body: string[];
  public headerElements: HeaderElements;

  ngOnInit() {
    this.body = this.navParams.get('body');
    this.headerElements = this.navParams.get('headerElements');
    this.headerElements.iconRight = 'icon-cerrar icon_close';
  }
}
