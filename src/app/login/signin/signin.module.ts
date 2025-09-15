import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SigninPageRoutingModule } from './signin-routing.module';
import { SigninPage } from './signin.page';
import { SoloRutDirective } from '../../directives/solo-rut.directive';
import { SoloNumerosDirective } from '../../directives/solo-numeros.directive';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, SigninPageRoutingModule],
  declarations: [SigninPage, SoloRutDirective, SoloNumerosDirective]
})
export class SigninPageModule {}

