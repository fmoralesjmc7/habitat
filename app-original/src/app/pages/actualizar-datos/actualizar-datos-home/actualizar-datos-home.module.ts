import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActualizarDatosHomeComponent } from './actualizar-datos-home.page';
import { ComponentsModule } from 'src/app/components/components.module'; 
import { PipesModule } from 'src/app/pipes/pipes.module'; 
import { ListadoEmpleadoresComponent } from 'src/app/components/actualizar-datos/listado-empleadores/listado-empleadores.component'; 

const routes: Routes = [
  {
    path: '',
    component: ActualizarDatosHomeComponent
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
  declarations: [ActualizarDatosHomeComponent],
  entryComponents: [ListadoEmpleadoresComponent]
})
export class ActualizarDatosHomePageModule {}
