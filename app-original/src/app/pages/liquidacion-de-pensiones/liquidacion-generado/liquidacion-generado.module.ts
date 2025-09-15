import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { LiquidacionGeneradoComponent } from './liquidacion-generado.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionGeneradoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LiquidacionGeneradoComponent]
})
export class LiquidacionGeneradoComponentModule {}
