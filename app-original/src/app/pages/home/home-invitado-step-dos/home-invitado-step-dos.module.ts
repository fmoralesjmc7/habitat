import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../../components/components.module';
import { IonicModule } from '@ionic/angular';

import { HomeInvitadoStepDosPage } from './home-invitado-step-dos.page';

const routes: Routes = [
  {
    path: '',
    component: HomeInvitadoStepDosPage
  }
];

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeInvitadoStepDosPage]
})
export class HomeInvitadoStepDosPageModule {}
