import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-afp-bar-progress',
  templateUrl: './afp-bar-progress.component.html',
  styleUrls: ['./afp-bar-progress.component.scss']
})
export class AfpBarProgressComponentCA implements OnInit {

  @Input() public lastValues;
  @Input() public period: number;
  @Input() public afpNames: string[];
  @Output() public clickAfp = new EventEmitter();

  public percentages = {};
  public textDisclaimer: string;
  public afpSelected: string;
  constructor() {
     //requerido
   }

  ngOnInit() {
    const values: number[] = [];
    Object.keys(this.lastValues).forEach((key) => {
      if (this.lastValues[key] === 0) { return; }
      values.push(this.lastValues[key]);
    });
    this.setValuePercentage(Math.max.apply(null, values));
  }

  private setValuePercentage(maxValue: number) {
    const afpWithoutInfo: string[] = [];
    Object.keys(this.lastValues).forEach((key) => {
      if (this.lastValues[key] === 0) { return afpWithoutInfo.push(key); }
      this.percentages[key] = Math.trunc(this.lastValues[key] / maxValue * 100);
    });
    if (afpWithoutInfo.length > 0) {
      let afps = '';
      afpWithoutInfo.forEach((key, index) => {
        const connector = index < afpWithoutInfo.length - 2 ? ', ' : index === afpWithoutInfo.length - 2 ? ' y ' : '';
        afps = afps + key.charAt(0).toUpperCase() + key.slice(1) + connector;
      });
      this.textDisclaimer = `No se muestra resultado de${ afpWithoutInfo.length === 1 ? '' : ' las' } AFP ${afps}, ` +
        `ya que no ${ afpWithoutInfo.length === 1 ? 'cuenta' : 'cuentan' } con la totalidad de la información en el período evaluado.`;
    }
  }

  public emitClick(afpName: string) {
    if (afpName === 'habitat') { return; }
    this.clickAfp.emit(afpName);
    this.afpSelected = afpName;
  }

  public get displayAfp() {
    const displayAfp: string[] = [];
    this.afpNames.forEach((key) => {
      if (this.lastValues[key] > 0) { displayAfp.push(key); }
    });
    return displayAfp;
  }

}

