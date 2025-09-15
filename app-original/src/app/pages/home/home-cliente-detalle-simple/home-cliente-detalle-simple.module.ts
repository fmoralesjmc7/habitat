import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { HomeClienteDetalleSimplePage } from './home-cliente-detalle-simple.page';

const routes: Routes = [
  {
    path: '',
    component: HomeClienteDetalleSimplePage
  }
];

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomeClienteDetalleSimplePage]
})
export class HomeClienteDetalleSimplePageModule {}
