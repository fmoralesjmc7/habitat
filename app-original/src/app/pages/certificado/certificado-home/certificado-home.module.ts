import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { CertificadoHomePage } from './certificado-home.page';
import { ListadoCertificadosComponent } from 'src/app/components/certificados/listado-certificados/listado-certificados.component';

const routes: Routes = [
  {
    path: '',
    component: CertificadoHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CertificadoHomePage],
  entryComponents: [ListadoCertificadosComponent]
})
export class CertificadoHomePageModule {}
