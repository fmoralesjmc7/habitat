import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoPorcentaje',
})
export class FormatoPorcentajePipe implements PipeTransform {

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args: any[]) {
    console.log('typeof args', typeof args);

    const result = Math.round(value);
    return result.toLocaleString('es-CL');
  }
}
