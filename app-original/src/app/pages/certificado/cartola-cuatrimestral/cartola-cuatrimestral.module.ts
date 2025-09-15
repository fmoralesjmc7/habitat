import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { CartolaCuatrimestralPage } from './cartola-cuatrimestral.page';

const routes: Routes = [
  {
    path: '',
    component: CartolaCuatrimestralPage
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
  declarations: [CartolaCuatrimestralPage]
})
export class CartolaCuatrimestralPageModule {}
