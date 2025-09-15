import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[solo-numeros]' // Attribute selector
})
export class SoloNumerosDirective {
  element: ElementRef;
  constructor(el: ElementRef) {
    this.element = el;
  }

  /**
   * Método que permite el ingreso de números
   * @param $event Evento gatillado por el Usuario.
   */
  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    this.element.nativeElement.value = $event.target.value.replace(/\D/g, '');
  }
}
