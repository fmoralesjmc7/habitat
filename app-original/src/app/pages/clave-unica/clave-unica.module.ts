import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaveUnicaComponent } from './clave-unica.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: ClaveUnicaComponent
  }
];

@NgModule({
  declarations: [ClaveUnicaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    IonicModule
  ]
})
export class ClaveUnicaModule { }
