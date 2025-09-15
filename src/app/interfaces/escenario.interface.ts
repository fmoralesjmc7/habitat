/* -------------------- Escenarios -------------------- */
export type Etiqueta = 'BAJO_PMS' | 'ENTRE_PMS_Y_META' | 'SOBRE_META';

export interface Escenario {
  etiqueta: Etiqueta;
  densidad12: boolean;
  tieneApv: boolean;
}