import { FormControl } from '@angular/forms';
import { rutValidate } from 'rut-helpers';

/**
 * Validador de rut.
 */
export class RutValidator {

  /**
   * Valida un rut.
   * @param control Objecto que contiene los datos a validar.
   */
  static checkRut(control: FormControl): any {
    if (rutValidate(control.value)) {
      return null;
    } else {
      return {
        'invalidRut': true
      };
    }
  }

}
