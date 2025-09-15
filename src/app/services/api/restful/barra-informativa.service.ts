import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '../../../../../src/environments/environment';
import { BarraInformativaInterface } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BarraInformativaService {

  /**
   * Variable con dominio para ambiente Kong.
   */
  private readonly dominio: string = ENV.base_url;

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Metodo encargado de obtener información de la barra informativa.
   *
   * @returns observable con response del servicio
   */
  obtenerDatosBarraInformativa(): Observable<BarraInformativaInterface> {
      const url = `${this.dominio}/api/v1/application/barra-informativa-app`;

      return this.http.get<BarraInformativaInterface>(url);
  }
}
