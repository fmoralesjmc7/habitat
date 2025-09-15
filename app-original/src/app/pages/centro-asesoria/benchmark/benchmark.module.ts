import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BenchmarkPage } from './benchmark.page';
import { ComponentsModule } from 'src/app/components/components.module'; 
import { ModalInfoComponentCA } from 'src/app/components/ca-modal-info/modal-info.component'; 
import { ModalFilterComponentCA } from 'src/app/components/ca-modal-filter/modal-filter.component'; 
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: BenchmarkPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [ BenchmarkPage ],
  entryComponents: [
    ModalInfoComponentCA,
    ModalFilterComponentCA
  ]
})
export class BenchmarkPageModule {}
