import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuscripcionPrudentialPage } from './suscripcion-prudential.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    SuscripcionPrudentialPage
  ],
  imports: [
    CommonModule,
    ComponentsModule
  ],
  exports: [
    SuscripcionPrudentialPage
  ]
})
export class SuscripcionPrudentialPageModule { }
