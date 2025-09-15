import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-radio',
  templateUrl: './select-radio.component.html',
  styleUrls: ['./select-radio.component.scss']
})
export class SelectRadioComponentCA implements OnInit {
  public value;
  @Input() public data;
  @Output() changeOption = new EventEmitter();
  constructor() {
     //requerido
   }

  ngOnInit() {
    this.value = this.data.currentValue;
    this.changeOption.emit(this.value);
  }

  public emitValue(value) {
    this.changeOption.emit(value);
  }
}
