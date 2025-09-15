import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { LiquidacionDePensionesComponent } from './liquidacion-de-pensiones.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionDePensionesComponent
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
  declarations: [LiquidacionDePensionesComponent]
})
export class LiquidacionDePensionesComponentModule {}
