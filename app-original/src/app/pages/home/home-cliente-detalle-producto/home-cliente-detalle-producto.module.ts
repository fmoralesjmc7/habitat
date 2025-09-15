import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeClienteDetalleProductoPage } from './home-cliente-detalle-producto.page';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: HomeClienteDetalleProductoPage
  }
];

@NgModule({
  declarations: [
    HomeClienteDetalleProductoPage
  ],
  imports: [
    ComponentsModule,
    PipesModule,
    IonicModule,
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class HomeClienteDetalleProductoPageModule { }
