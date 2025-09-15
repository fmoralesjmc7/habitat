import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-step-items',
  templateUrl: './step-items.component.html',
  styleUrls: ['./step-items.component.scss'],
})
export class StepItemsComponent implements OnInit {
  @Input() active: number;
  constructor() {
    //requerido
  }

  ngOnInit() {
    //requerido
  }

}
