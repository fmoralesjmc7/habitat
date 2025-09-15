import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ayuda-contextual',
  templateUrl: 'ayuda-contextual.html',
  styleUrls: ['./ayuda-contextual.scss'],
  standalone: false
})
export class AyudaContextualComponent {
  @Input() text!: string;
  @Input() isOpen!: boolean;
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
