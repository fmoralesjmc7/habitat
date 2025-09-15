import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { HomeInvitadoPage } from './home-invitado.page';
import { ComponentsModule } from '../../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: HomeInvitadoPage
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeInvitadoPage]
})
export class HomeInvitadoPageModule {}