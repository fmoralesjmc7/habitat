import { benchmarkFundsConstants } from "src/app/pages/centro-asesoria/benchmark-funds/benchmark-funds.constant"; 
import { DataCheckbox, DataRatio } from "src/app/interfaces/data-modal-filter"; 
import { HeaderElements } from "src/app/interfaces/header-elements"; 

export const modalFilterConstants = {
  componentProps : {
    dataCheckbox: [
      { list: benchmarkFundsConstants.fundsChecked,
        title: 'Selecciona dos fondos',
        type: 'funds',
        prefix: 'Fondo ',
        maxChecked: 2
      } as DataCheckbox
    ],
    dataRatio: [
      {
        list: benchmarkFundsConstants.periods,
        title: 'Selecciona una período',
        type: 'period',
        currentValue:  '15'
      } as DataRatio
    ],
    headerElements: { title: 'Filtros' } as HeaderElements
  }
};
