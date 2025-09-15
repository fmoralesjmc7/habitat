import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActivacionHuellaComponent } from './activacion-huella.page';

const routes: Routes = [
  {
    path: '',
    component: ActivacionHuellaComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ActivacionHuellaComponent]
})
export class ActivacionHuellaPageModule {}
