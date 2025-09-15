import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { ValorCuotaPage } from './valor-cuota.page';

const routes: Routes = [
  {
    path: '',
    component: ValorCuotaPage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ValorCuotaPage]
})
export class ValorCuotaPageModule {}
