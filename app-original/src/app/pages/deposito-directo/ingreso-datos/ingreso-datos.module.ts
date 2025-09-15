import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IngresoDatosPage } from './ingreso-datos.page';
import { TextMaskModule } from 'angular2-text-mask';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    IngresoDatosPage,
  ],
  imports: [
    RouterModule.forChild([{ path: '', component: IngresoDatosPage }]),
    IonicModule,
    TextMaskModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    FormsModule,
    CommonModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IngresoDatosPageModule {}




