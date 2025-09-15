import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SucursalesService {

    private eliminarMapa = new Subject<SucursalPage>();

    eventoEliminarMapa(data: SucursalPage) {
      this.eliminarMapa.next(data);
    }

    suscribeEliminarMapa(): Subject<SucursalPage> {
      return this.eliminarMapa;
    }
}

export interface SucursalPage {
    eliminarMapa: boolean,
    sucursalCurrentPage: boolean
}