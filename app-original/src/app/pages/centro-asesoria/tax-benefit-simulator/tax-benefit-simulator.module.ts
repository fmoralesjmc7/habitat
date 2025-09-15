import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

import { TaxBenefitSimulatorPage } from './tax-benefit-simulator.page';
import { ComponentsModule } from 'src/app/components/components.module'; 
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component'; 

const routes: Routes = [
  {
    path: '',
    component: TaxBenefitSimulatorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [ TaxBenefitSimulatorPage ],
  entryComponents: [ ModalInfoComponentCA ]
})
export class TaxBenefitSimulatorPageModule {}
