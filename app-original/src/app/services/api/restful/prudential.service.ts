import { Injectable } from "@angular/core";
import { ENV } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PrudentialDatos } from "../data/prudential.datos";
import { Preferencia, PreferenciaRequest, PreferenciaResp } from "src/app/interfaces/preferencia-saldos";
import { DetalleSaldosConsolidadosResp, EstadoMandatoPrudential, EstadoMandatoResp, RespuestaRequest, SucripcionPrudentialRequest } from "src/app/interfaces/prudential";

@Injectable({
  providedIn: "root",
})
export class PrudentialService {
  private dominio: string = ENV.prudential_back;

  constructor(private prudentialDatos: PrudentialDatos, private http: HttpClient) {}

  obtenerEstadoMandato(): Observable<EstadoMandatoPrudential> {
    const url = this.dominio + 'prudential/mandato/consulta-mandato';
      return this.http.get<EstadoMandatoPrudential>(url);
  }

  obtenerEstadoConsolidacion(): Observable<EstadoMandatoResp> {
    const url = this.dominio + 'habitat/consulta-mandato';
      return this.http.get<EstadoMandatoResp>(url);
  }

  guardarPreferenciaSaldo(creadoPor: string, flag: boolean): Observable<RespuestaRequest> {
    const url = this.dominio + 'habitat/guardar-preferencia';
      const parametros: PreferenciaRequest = {
          creadoPor: creadoPor,
          flag: this.prudentialDatos.obtenerValorPreferencia(flag)
      };
      return this.http.post<any>(url, parametros);
  }

  obtenerPreferenciasSaldos(): Observable<Preferencia> {
    const url = this.dominio + 'habitat/consultar-preferencia';
      return this.http.get<PreferenciaResp>(url).pipe(map(item => {
          const preferencia: Preferencia = {
              flag: this.prudentialDatos.obtenerFlagPreferencia(item.flag)
          }
          return preferencia;
      }));
  }

  obtenerSaldosConsolidados(): Observable<DetalleSaldosConsolidadosResp> {
    const url = this.dominio  + 'prudential/saldos-consolidados';
      return this.http.get<DetalleSaldosConsolidadosResp>(url);
  }

  guardarSuscripcionPrudential(datos: SucripcionPrudentialRequest): Observable<RespuestaRequest> {
    const url = this.dominio + 'habitat/suscribir-mandato';
      return this.http.post<RespuestaRequest>(url, datos);
  }
}
