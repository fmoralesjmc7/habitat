import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataCheckbox } from 'src/app/interfaces/data-modal-filter'; 

@Component({
  selector: 'app-select-checkbox',
  templateUrl: './select-checkbox.component.html',
  styleUrls: ['./select-checkbox.component.scss']
})
export class SelectCheckboxComponentCA implements OnInit {
  @Input() public data: DataCheckbox;
  @Output() changeValues = new EventEmitter();

  public isCheckboxDisabled;
  private maxChecked;
  public options;
  constructor() {
     //requerido
   }

  ngOnInit() {
    this.options = this.data.list;
    this.maxChecked = this.data.maxChecked;
    this.disableCheckbox();
  }

  public emitChange() {
    this.disableCheckbox();
    if (this.isCheckboxDisabled) { this.changeValues.emit(this.options); }
  }

  public disableCheckbox() {
    const checkedOptions = this.options.filter(option => option.checked);
    this.isCheckboxDisabled = checkedOptions.length === this.maxChecked;
  }

}
