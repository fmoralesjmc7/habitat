import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { KhipuSuccessPage } from './khipu-success.page';

@NgModule({
  declarations: [
    KhipuSuccessPage,
  ],
  imports: [
    RouterModule.forChild([{ path: '', component: KhipuSuccessPage }]),
    IonicModule,
    CommonModule,
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class KhipuSuccessPageModule {}
