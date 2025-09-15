import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../../../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module'
import { CambioFondoStep3Page } from './cambio-fondo-step-3.page';

const routes: Routes = [
  {
    path: '',
    component: CambioFondoStep3Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CambioFondoStep3Page]
})
export class CambioFondoStep3PageModule {}
