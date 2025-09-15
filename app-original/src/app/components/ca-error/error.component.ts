import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorButtons } from 'src/app/interfaces/error-elements';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponentCA  implements OnInit {
  @Input() public buttons: ErrorButtons;
  @Output() public clickErrorButton = new EventEmitter();

  ngOnInit() {
    if (!this.buttons) { this.buttons = { firstButton: 'Reintentar' }; }
  }

  public clickButton(button: 'first' | 'second') {
    this.clickErrorButton.emit(button);
  }
}
