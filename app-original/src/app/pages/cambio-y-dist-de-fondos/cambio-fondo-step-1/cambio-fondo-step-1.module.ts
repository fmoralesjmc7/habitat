import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../../../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { CambioFondoStep1Page } from './cambio-fondo-step-1.page';

const routes: Routes = [
  {
    path: '',
    component: CambioFondoStep1Page
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
  declarations: [CambioFondoStep1Page]
})
export class CambioFondoStep1PageModule {}
