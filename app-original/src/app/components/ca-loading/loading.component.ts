import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponentCA {

  @Input() public showLoading: boolean;
  @Input() public textLoading: string[];
  constructor() {
     //requerido
   }

}
