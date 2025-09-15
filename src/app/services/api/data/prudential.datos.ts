import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CuentaPrudential } from 'src/app/interfaces/prudential';
import { CONSTANTES_PRUDENTIAL } from 'src/app/util/producto.constantes';

@Injectable({
  providedIn: 'root',
})
export class PrudentialDatos {
  public estadoClientePrudential = new BehaviorSubject<string>('');
  public estadoConsolidacion = new BehaviorSubject<string>('');
  public estadoMandato = new BehaviorSubject<string>('');
  public preferenciaVerSaldos = new BehaviorSubject<boolean>(false);
  public productoPrudential = new BehaviorSubject<any>(null);

  constructor() {
    // Constructor intencionalmente vacío
  }

  public setEstadoConsolidacion(estadoConsolidacion: string = ''): void {
    this.estadoConsolidacion.next(estadoConsolidacion);
  }

  public setPreferenciaVerSaldos(preferencia: boolean = false): void {
    this.preferenciaVerSaldos.next(preferencia);
  }

  public setEstadoClientePrudential(estadoCliente: string = ''): void {
    this.estadoClientePrudential.next(estadoCliente);
  }

  public obtenerProductoPrudential(
    detalle: CuentaPrudential[] = [],
    objeto: any
  ): any {
    return {
      preferencia: this.preferenciaVerSaldos.getValue(),
      estadoConsolidacion: this.estadoConsolidacion.getValue(),
      detalle: detalle,
      totalMonto: this.calcularMontoTotal(detalle),
      nombreCortoProducto: objeto.NOMBRE_CORTO_CUENTA,
      nombreProducto: objeto.NOMBRE_PRODUCTO,
    };
  }

  public setProductoPrudential(producto: any): void {
    this.productoPrudential.next(producto);
  }

  private calcularMontoTotal(detalle: any[]): number {
    if (!detalle || detalle.length === 0) {
      return 0;
    }
    return detalle.reduce((total, item) => total + (item.valorCuenta || 0), 0);
  }

  public obtenerValorPreferencia(verSaldos: boolean): string {
    return verSaldos
      ? CONSTANTES_PRUDENTIAL.PREFERENCIAS.VER_SALDO_S
      : CONSTANTES_PRUDENTIAL.PREFERENCIAS.VER_SALDO_N;
  }

  public obtenerFlagPreferencia(preferencia: string): boolean {
    return preferencia === CONSTANTES_PRUDENTIAL.PREFERENCIAS.VER_SALDO_S
      ? true
      : false;
  }

  limpiarDatos() {
    this.estadoConsolidacion.next('');
    this.preferenciaVerSaldos.next(false);
    this.estadoClientePrudential.next('');
    this.productoPrudential.next(null);
  }
}
