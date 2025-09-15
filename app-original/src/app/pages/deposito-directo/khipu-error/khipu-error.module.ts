import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { KhipuErrorPage } from './khipu-error.page';

@NgModule({
  declarations: [
    KhipuErrorPage,
  ],
  imports: [
    RouterModule.forChild([{ path: '', component: KhipuErrorPage }]),
    IonicModule,
    CommonModule,
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class KhipuErrorPageModule {}
