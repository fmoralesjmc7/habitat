import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '../../../directives/directives.module';
import { NotificacionService } from '../../../services';
import { PipesModule } from '../../../pipes/pipes.module';
import { SigninPage } from './signin';

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: SigninPage }]),
    DirectivesModule,
    PipesModule
  ],
  providers: [
    NotificacionService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SigninPageModule { }
