export interface BanksResponse {
  banks: Bank[];
}

export interface Bank {
  bank_id: string;
  message: string;
  min_amount: string;
  name: string;
  parent: string;
  type: string;
}

export interface PaymentsRequest {
  amount: number;
  currency: string;
  subject: string;
  notify_url?: string;
  notify_api_version?: string;
  transaction_id?: string;
  bank_id?: string;
  payer_name?: string;
  payer_email?: string;
}

export interface PaymentsResponse {
  app_url: string;
  payment_id: string;
  payment_url: string;
  ready_for_terminal: boolean;
  simplified_transfer_url: string;
  transfer_url: string;
}
export interface Transaccion {
  rutCliente: string;
  dvCliente: string;
  nroTransaccion: string;
}

export interface Deposito {
  montoSinFormato: any;
  medioPago: any;
  email: string;
}
