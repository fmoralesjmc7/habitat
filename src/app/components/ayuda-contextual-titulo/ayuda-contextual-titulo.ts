import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ayuda-contextual-titulo',
  templateUrl: 'ayuda-contextual-titulo.html',
  styleUrls: ['./ayuda-contextual-titulo.scss'],
})
export class AyudaContextualTituloComponent {
  @Input() text!: string;
  @Input() textDos!: string;
  @Input() textTres!: string;
  @Input() isOpen = false;
  @Output() bgClick: EventEmitter<void> = new EventEmitter();

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
