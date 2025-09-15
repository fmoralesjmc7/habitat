import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { TaxBenefitSimulation, ApvTaxBenefitSimulation, DataTaxBenefitSimulation } from 'src/app/interfaces/tax-benefit-simulation';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';

@Injectable({
  providedIn: 'root'
})
export class TaxBenefitSimulatorService {
  public baseURL: string;

  constructor(private readonly http: HttpClientUtil) {
    this.baseURL = ENV.base_url;
  }

  public getTaxBenefitSimulation(data: DataTaxBenefitSimulation): Promise<TaxBenefitSimulation> {
    const params = {
      'renta_liquida': data.liquidIncome,
      'monto_apv': data.apvAmount,
      'sexo': data.gender,
      'edad_pension': data.pensionAge,
      'edad': data.age
    };
    return this.http.get(`${this.baseURL}/api/v1/simulador/beneficios`, params)
    .toPromise()
    .then((response) => {
      if (response.error) { return null; }
      return this.generateTaxBenefitSimulation(response);
    }) as Promise<TaxBenefitSimulation>;
  }

  private generateTaxBenefitSimulation(response: any): TaxBenefitSimulation {
    const aRegimeApv: ApvTaxBenefitSimulation = {
      realDeposit: response.apv.a.deposito_real,
      pensionSavings: response.apv.a.ahorro_pension,
      stateSavings: response.apv.a.ahorro_estado,
      monthlyStateSavings: response.apv.a.ahorro_estado_mensual,
      profitability: response.apv.a.rentabilidad,
    };
    const bRegimeApv: ApvTaxBenefitSimulation = {
      realDeposit: response.apv.b.deposito_real,
      pensionSavings: response.apv.b.ahorro_pension,
      profitability: response.apv.b.rentabilidad,
      taxBenefit: response.apv.b.beneficio_tributario,
      monthlyTaxBenefit: response.apv.b.beneficio_tributario_mensual,
      anualTaxBenefit: response.apv.b.beneficio_tributario_anual,
      incomeDecrease: response.apv.b.disminucion_renta,
    };
    return {
      liquidIncome: response.info.renta_liquida,
      factor: response.info.factor,
      reducedAmount: response.info.cantidad_rebajada,
      taxableIncome: response.info.renta_imponible,
      paidIncomeWithoutSavings: response.info.impuesto_pagado_sin_ahorro,
      taxBenefitSavings: response.info.ahorro_beneficio_tributario,
      liquidIncomeWithSavings: response.info.renta_liquida_con_ahorro,
      taxableIncomeWithSavings: response.info.renta_imponible_con_ahorro,
      paidIncomeWithSavings: response.info.impuesto_pagado_con_ahorro,
      taxBenefit: response.info.beneficio_tributario,
      aRegimeApv: aRegimeApv,
      bRegimeApv: bRegimeApv,
    } as TaxBenefitSimulation;
  }
}
