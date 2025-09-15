import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StartPageData } from 'src/app/interfaces/start-page-data'; 

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponentCA {

  @Input() public startPageData: StartPageData;
  @Output() public clickPrimaryButton = new EventEmitter();
  @Output() public clickSecondaryButton = new EventEmitter();
  constructor() {
     //requerido
   }

  public emitPrimaryButton() {
    this.clickPrimaryButton.emit();
  }

  public emitSecondaryButton() {
    this.clickSecondaryButton.emit();
  }

}
