import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HomeInvitadoStepDosPage } from './home-invitado-step-dos.page';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';
import { FormatoPorcentajePipe } from 'src/app/pipes/formato-porcentaje.pipe';

const routes: Routes = [
  {
    path: '',
    component: HomeInvitadoStepDosPage,
  },
];

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    RouterModule.forChild(routes), 
    FormatoPesoChilenoPipe,
    FormatoPorcentajePipe,
    HomeInvitadoStepDosPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeInvitadoStepDosPageModule {}
