import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SimulatorPage } from './simulator.page'; 
import { ComponentsModule } from 'src/app/components/components.module'; 
import { IndiVideoModule } from 'src/app/vendor/indi-video/indi-video.module'; 
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SimulatorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IndiVideoModule,
    IonicModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SimulatorPage],
  entryComponents: [ ModalInfoComponentCA ]
})
export class SimulatorPageModule {}
