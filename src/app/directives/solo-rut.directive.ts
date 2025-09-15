import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[solo-rut]', standalone: false })
export class SoloRutDirective {
  @HostListener('input', ['$event'])
  onInput(e: any) {
    const el = e.target as HTMLInputElement;
    const cleaned = el.value.replace(/[^0-9kK]/g, '').toUpperCase();
    el.value = cleaned;
  }
}
