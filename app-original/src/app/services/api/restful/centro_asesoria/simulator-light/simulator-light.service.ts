import { Injectable } from '@angular/core';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { environment, ENV } from 'src/environments/environment';
import { SimulationData, SimulationDataAPV, SimulationResult } from 'src/app/interfaces/simulation-light';

@Injectable({
  providedIn: 'root'
})
export class SimulatorLightService {
  public baseURL: string;
  public indicatorURL: string;

  constructor(private readonly http: HttpClientUtil) {
    this.baseURL = ENV.base_url;
    this.indicatorURL = environment.indicatorURL;
  }
  public resultSimulation(data: SimulationData): Promise<SimulationResult> {
    const { age, gender, taxableIncome, balance } = data;
    const dataToService = {
      'edad': age,
      'sexo': gender,
      'rentaImponible': taxableIncome,
      'saldoObligatorio': balance
    };
    return this.http.post(`${this.baseURL}/api/v1/simulacion/pension`, dataToService)
    .toPromise()
    .then((response) => {
      return {
        programmedRetirement: Math.trunc(response.RetiroProgramado),
        clientId: response.clienteID,
        lifelongIncome: Math.trunc(response.RentaVitalicia)
      };
    }).catch(async (error) => {
      return null;
    }) as Promise<SimulationResult>;
  }

  public simulationAPV(data: SimulationDataAPV): Promise<SimulationResult> {
    const { age, gender, clientId, apvAmount } = data;
    const dataToService = {
      'edad': age,
      'sexo': gender,
      'clienteId': clientId,
      'ahorroPactado': apvAmount
    };
    return this.http.post(`${this.baseURL}/api/v1/simulacion/pension-apv`, dataToService)
        .toPromise()
        .then((response) => {
          return {
            programmedRetirement: Math.trunc(response.RetiroProgramado),
            clientId: response.clienteID,
            lifelongIncome: Math.trunc(response.RentaVitalicia)
          };
        });
  }

  public getUF(): Promise<any> {
    return this.http.get(`${this.indicatorURL}/uf`, null)
        .toPromise()
        .then((response) => {
          return response.serie[0].valor;
        });
  }
}
