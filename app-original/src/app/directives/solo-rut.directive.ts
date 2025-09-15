import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[solo-rut]' // Attribute selector
})
export class SoloRutDirective {
  element: ElementRef;
  constructor(el: ElementRef) {
    this.element = el;
  }

  /**
   * Método que permite el ingreso de números, puntos y la letra K
   * @param $event Evento gatillado por el Usuario.
   */
  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    this.element.nativeElement.value = $event.target.value.replace(/[^0-9|k|K]/g,'');
  }
}
