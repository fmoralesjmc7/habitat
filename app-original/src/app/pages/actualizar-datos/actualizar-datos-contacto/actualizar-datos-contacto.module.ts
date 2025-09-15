import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module'; 
import { PipesModule } from 'src/app/pipes/pipes.module'; 
import { ActualizarDatosContactoComponent } from './actualizar-datos-contacto.component';

const routes: Routes = [
  {
    path: '',
    component: ActualizarDatosContactoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ActualizarDatosContactoComponent]
})
export class ActualizarDatosContactoPageModule {}
