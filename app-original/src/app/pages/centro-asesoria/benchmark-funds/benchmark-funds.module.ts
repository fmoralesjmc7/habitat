import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BenchmarkFundsPage } from './benchmark-funds.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ModalFilterComponentCA } from 'src/app/components/ca-modal-filter/modal-filter.component';
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: BenchmarkFundsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [ BenchmarkFundsPage ],
  entryComponents: [ ModalInfoComponentCA, ModalFilterComponentCA ]
})
export class BenchmarkFundsPageModule {}
