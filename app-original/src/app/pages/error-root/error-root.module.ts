import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { ErrorRootPage } from './error-root.page';

@NgModule({
  declarations: [
    ErrorRootPage,
  ],
  imports: [
    RouterModule.forChild([{ path: '', component: ErrorRootPage }]),
    IonicModule,
    CommonModule,
    ComponentsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ErrorRootPageModule {}
