import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ComponentsModule } from '../../../components/components.module';
import { PlanesStepUnoPage } from './planes-step-uno.page';

const routes: Routes = [
  {
    path: '',
    component: PlanesStepUnoPage
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
  declarations: [PlanesStepUnoPage]
})
export class PlanesStepUnoPageModule {}
