import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from './../../components/components.module';
import { IonicModule } from '@ionic/angular';

import { RentabilidadPage } from './rentabilidad.page';

const routes: Routes = [
  {
    path: '',
    component: RentabilidadPage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RentabilidadPage]
})
export class RentabilidadPageModule {}
