import { NgModule } from '@angular/core';
import { DirectivesLibsModule } from './directives-libs.module';
import { MascaraPrecio } from './mascara-precio.directive';
import { SoloNumerosDirective } from './solo-numeros.directive';
import { SoloRutDirective } from './solo-rut.directive';
import { TranslateDirective } from './translate/translate.directive';

@NgModule({
  imports: [DirectivesLibsModule],
  declarations: [
    TranslateDirective,
    SoloNumerosDirective,
    SoloRutDirective,
    MascaraPrecio
  ],
  exports: [
    DirectivesLibsModule,
    TranslateDirective,
    SoloNumerosDirective,
    SoloRutDirective,
    MascaraPrecio
  ],
})
export class DirectivesModule {}
