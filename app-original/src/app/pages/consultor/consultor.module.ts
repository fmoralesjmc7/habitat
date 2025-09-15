import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from './../../components/components.module';
import { IonicModule } from '@ionic/angular';
import { ConsultorPage } from './consultor.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultorPage
  }
];

@NgModule({
  imports: [
    PipesModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsultorPage]
})
export class ConsultorPageModule {}
