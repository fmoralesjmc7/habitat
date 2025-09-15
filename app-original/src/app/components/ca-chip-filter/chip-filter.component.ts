import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip-filter',
  templateUrl: './chip-filter.component.html',
  styleUrls: ['./chip-filter.component.scss']
})
export class ChipFilterComponentCA {
  @Input() filters: string[] = [];

  public slideOpts = {
    slidesPerView: 2.5,
    slidesPerGroup: 1
  };
}
