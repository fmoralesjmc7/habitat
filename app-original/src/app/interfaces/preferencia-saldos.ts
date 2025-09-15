export interface PreferenciaRequest {
    flag: string;
    creadoPor: string;
  }
  
  export interface PreferenciaResp {
    flag: "S" | "N";
  }

  export interface Preferencia {
    flag: boolean;
  }