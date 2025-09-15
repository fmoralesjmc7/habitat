export interface AntiJailPlugin {
  validate(): Promise<{ status: boolean,detalle:string }>;
}
