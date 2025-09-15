import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[solo-numeros]', standalone: false })
export class SoloNumerosDirective {
  @HostListener('input', ['$event'])
  onInput(e: any) {
    const el = e.target as HTMLInputElement;
    const cleaned = el.value.replace(/[^0-9]/g, '');
    el.value = cleaned;
  }
}
