import { NgModule } from '@angular/core';
import { FormatoPesoChilenoPipe } from './formato-peso-chileno.pipe';
import { FormatoPorcentajePipe } from './formato-porcentaje.pipe';
import { FormatoCapitalize } from './formato-capitalize.pipe';
import { ChileanCurrencyPipe } from './chilean-currency.pipe';
import { MapValuesPipe } from './map-values.pipe';

@NgModule({
  declarations: [
    FormatoPesoChilenoPipe,
    FormatoPorcentajePipe,
    FormatoCapitalize,
    ChileanCurrencyPipe,
    MapValuesPipe
  ],
  imports: [],
  exports: [
    FormatoPesoChilenoPipe,
    FormatoPorcentajePipe,
    FormatoCapitalize,
    ChileanCurrencyPipe,
    MapValuesPipe
  ]
})
export class PipesModule {}
