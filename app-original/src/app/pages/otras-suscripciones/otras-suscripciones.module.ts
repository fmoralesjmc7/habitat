import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtrasSuscripcionesPage } from './otras-suscripciones.page';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';
import { DesuscripcionPrudentialPage } from './desuscripcion-prudential/desuscripcion-prudential.page';
import {FormsModule} from "@angular/forms";
import {PipesModule} from "../../pipes/pipes.module";
import { ExitoDesuscripcionPage } from './desuscripcion-prudential/exito-desuscripcion/exito-desuscripcion.page';
import { SuscripcionPrudentialPageModule } from './suscripcion-prudential/suscripcion-prudential.module';

const routes: Routes = [
  {
    path: '',
    component: OtrasSuscripcionesPage
  }
];

@NgModule({
  declarations: [
    OtrasSuscripcionesPage,
    DesuscripcionPrudentialPage,
    ExitoDesuscripcionPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SuscripcionPrudentialPageModule,
    PipesModule,
  ]
})
export class OtrasSuscripcionesPageModule { }
