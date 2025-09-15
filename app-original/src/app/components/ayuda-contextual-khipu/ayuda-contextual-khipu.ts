import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ayuda-contextual-khipu',
  templateUrl: 'ayuda-contextual-khipu.html',
  styleUrls: ['./ayuda-contextual-khipu.scss']
})
export class AyudaContextualKhipuComponent {
  @Input() text: string;
  @Input() isOpen: boolean;
  @Output() bgClick: EventEmitter<any> = new EventEmitter();

  constructor() {
     //requerido
   }

  bgWasClicked(): void {
    this.isOpen = false;
    this.bgClick.emit();
  }

  click() {
    this.isOpen = false;
    this.bgClick.emit();
  }
}
