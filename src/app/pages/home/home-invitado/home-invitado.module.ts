import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HomeInvitadoPage } from './home-invitado.page';
import { AyudaContextualComponent } from '../../../components/ayuda-contextual/ayuda-contextual';

const routes: Routes = [
  {
    path: '',
    component: HomeInvitadoPage,
  },
];

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    IonicModule, 
    RouterModule.forChild(routes),
    HomeInvitadoPage,
    AyudaContextualComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeInvitadoPageModule {}
