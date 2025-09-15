import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndiVideoComponent } from './indi-video.component';

@NgModule({
  declarations: [IndiVideoComponent],
  exports: [IndiVideoComponent],
  imports: [
    CommonModule
  ]
})
export class IndiVideoModule { }
