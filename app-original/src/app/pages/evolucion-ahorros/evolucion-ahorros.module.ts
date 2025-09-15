import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';
import { EvolucionAhorrosPage } from './evolucion-ahorros.page';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  {
    path: '',
    component: EvolucionAhorrosPage
  }
];

@NgModule({
  declarations: [EvolucionAhorrosPage],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ComponentsModule,
    IonicModule,
    ChartsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EvolucionAhorrosPageModule { }
