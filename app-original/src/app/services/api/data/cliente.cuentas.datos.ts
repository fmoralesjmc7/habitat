import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteCuentasDatos {

  public saldoTotalCuentas = new BehaviorSubject<number>(0);
  public saldoTotalBonosCliente = new BehaviorSubject<number>(0);
  public productosCliente = new BehaviorSubject<Array<any>>([]);

  constructor() {
    //requerido
  }

  public setSaldoTotalCuentas(saldoTotal: number) {
    this.saldoTotalCuentas.next(saldoTotal);
  }

  public setSaldoTotalBonosCliente(saldoTotalBonos: number) {
    this.saldoTotalBonosCliente.next(saldoTotalBonos);
  }

  public setProductosCliente(productos: any[]) {
    this.productosCliente.next(productos);
  }

  public limpiarDatos() {
    this.saldoTotalCuentas.next(0);
    this.saldoTotalBonosCliente.next(0);
    this.productosCliente.next([]);
  }

}