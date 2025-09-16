import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'ayuda-contextual, app-ayuda-contextual',
  templateUrl: 'ayuda-contextual.html',
  styleUrls: ['./ayuda-contextual.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
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
