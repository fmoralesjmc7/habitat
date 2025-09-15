import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TutorialPage } from './tutorial';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: TutorialPage }])
  ],
  declarations: [ TutorialPage ],
  entryComponents: [ TutorialPage ],
})
export class TutorialPageModule {}
