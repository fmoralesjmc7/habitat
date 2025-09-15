
import { Injectable } from '@angular/core';

@Injectable()
export class UtilCA {

  public unformatAmount(value) {
    const num = value.replace(/[$.]/g, '');
    return Number(num);
  }

  public modifyAmount(amount) {
    return this.unformatAmount(amount.detail.value);
  }

}

