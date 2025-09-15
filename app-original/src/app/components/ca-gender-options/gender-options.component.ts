import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gender-options',
  templateUrl: './gender-options.component.html',
  styleUrls: ['./gender-options.component.scss']
})
export class GenderOptionsComponentCA {
  @Input() public selectGenderFemale: boolean;
  @Input() public selectGenderMale: boolean;
  @Output() public clickGender = new EventEmitter();
  constructor() {
     //requerido
   }

  public onClickGender(genderValue: string) {
    this.clickGender.emit(genderValue);
  }
}
