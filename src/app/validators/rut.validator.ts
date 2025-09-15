import { AbstractControl, ValidationErrors } from '@angular/forms';

export class RutValidator {
  static checkRut(control: AbstractControl): ValidationErrors | null {
    const value: string = (control.value || '').toString().replace(/\.|-/g, '').toUpperCase();
    if (!value) return null;
    if (!/^\d{7,8}[0-9K]$/.test(value)) return { rut: true };
    const body = value.slice(0, -1);
    const dv = value.slice(-1);
    let sum = 0, mul = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    const res = 11 - (sum % 11);
    const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
    return dv === dvCalc ? null : { rut: true };
  }
}

