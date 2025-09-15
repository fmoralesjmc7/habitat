import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [FormsModule, CommonModule, ReactiveFormsModule, TranslateModule],
})
export class DirectivesLibsModule {}
