import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoPesoChileno',
})
export class FormatoPesoChilenoPipe implements PipeTransform {

  /**
   * Función formateo de numeros.
   */
  transform(value: number, ...args) {
    const output = '$';
    if (value !== undefined && value !== null) {
      return output.concat(value.toLocaleString('es-CL').toString());
    } else {
      return '';
    }
  }
}
