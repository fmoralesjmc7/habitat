import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GiroStepUnoPage } from './giro-step-1.page';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ComponentsModule } from '../../../components/components.module';
const routes: Routes = [
  {
    path: '',
    component: GiroStepUnoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TextMaskModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule
  ],
  declarations: [GiroStepUnoPage]
})
export class GiroStepUnoPageModule {}
