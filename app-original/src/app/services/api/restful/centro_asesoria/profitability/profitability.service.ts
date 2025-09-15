import { Injectable } from '@angular/core';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { ENV } from 'src/environments/environment';
import { ProfitabilityServiceData, ProfitabilityServiceFunds } from 'src/app/interfaces/profitability-service-data';

@Injectable({
  providedIn: 'root'
})
export class ProfitabilityService {
  public baseURL: string;

  constructor(private readonly http: HttpClientUtil) {
    this.baseURL = ENV.base_url;
  }
  public resultSimulation(data: ProfitabilityServiceData) {
    const { amount, pensionFund, period } = data;
    const params = {
      'monto': amount,
      'fondo': pensionFund,
      'plazo': period
    };
    return this.http.get(`${this.baseURL}/api/v1/rentabilidad/compara`, params)
      .toPromise()
      .then((response) => {
        if (response.error) { return null; }
        return this.processResponse(response.data);
      });
  }

  public fundsHabitat(data: ProfitabilityServiceFunds) {
    const { amount, firstFund, secondFund, period} = data;
    const params = {
      'monto': amount,
      'fondo1': firstFund,
      'fondo2': secondFund,
      'plazo': period
    };
    return this.http.get(`${this.baseURL}/api/v1/rentabilidad/fondoshabitat`, params)
      .toPromise()
      .then((response) => {
        if (response.error) { return null; }
        return this.processResponse(response.data.fondo);
      });
  }

  private processResponse(response) {
    const processResponse = {};
    Object.keys(response).forEach((key) => {
      processResponse[key] = {};
      Object.keys(response[key]).forEach((numberData) => {
        const period = response[key][numberData].periodo;
        processResponse[key][period] = response[key][numberData].valor;
      });
    });
    return processResponse;
  }
}
