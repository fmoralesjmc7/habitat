export interface DataTaxBenefitSimulation {
  liquidIncome: number;
  apvAmount: number;
  gender: number;
  age: number;
  pensionAge: number;
}

export interface TaxBenefitSimulation {
  liquidIncome: number;
  factor: number;
  reducedAmount: number;
  taxableIncome: number;
  paidIncomeWithoutSavings: number;
  taxBenefitSavings: number;
  liquidIncomeWithSavings: number;
  taxableIncomeWithSavings: number;
  paidIncomeWithSavings: number;
  taxBenefit: number;
  aRegimeApv: ApvTaxBenefitSimulation;
  bRegimeApv: ApvTaxBenefitSimulation;
}

export interface ApvTaxBenefitSimulation {
  realDeposit: number;
  pensionSavings: number;
  stateSavings?: number;
  profitability: number;
  taxBenefit?: number;
  monthlyTaxBenefit?: number;
  anualTaxBenefit?: number;
  monthlyStateSavings?: number;
  incomeDecrease?: number;
}
