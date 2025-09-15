import { Injectable } from '@angular/core';
import { ContextoAPP } from './contexto-app';

@Injectable({
  providedIn: 'root'
})

/**
 * Clase utilizada para heredar los metodos del ciclo de vida de IONIC 
 * utilizados para agregar y quitar la clase que realiza el resize de 
 * los nuevos rediseños de la app
 */
export class ResizeClass {

  constructor(public readonly contextoAPP: ContextoAPP) {}

  /**
   * funcion del ciclo de vida que remueve la clase resize en html
   */
  ionViewWillLeave() {
    const documento = this.contextoAPP.obtenerElementoDOM();
    documento?.querySelector('html')!.classList.remove('resize');
  }

  /**
   * funcion del ciclo de vida que agrega la clase resize en html
   */
  ionViewWillEnter() {
    const documento = this.contextoAPP.obtenerElementoDOM();
    documento?.querySelector('html')!.classList.add('resize');
  }
}
