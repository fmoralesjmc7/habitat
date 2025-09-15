import { Component, OnInit } from '@angular/core';
import { ModalComponentCA } from '../ca-modal/modal.component'; 
import { HeaderElements } from 'src/app/interfaces/header-elements';
import { DataCheckbox, DataRatio } from 'src/app/interfaces/data-modal-filter'; 

@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss']
})
export class ModalFilterComponentCA extends ModalComponentCA implements OnInit {
  public dataCheckbox: DataCheckbox[];
  public dataRatio: DataRatio[];
  public headerElements: HeaderElements;
  public dataFilters = {};

  async ngOnInit() {
    this.dataCheckbox = this.navParams.get('dataCheckbox');
    this.dataRatio = this.navParams.get('dataRatio');
    this.headerElements = this.navParams.get('headerElements');

    if (this.dataCheckbox) {
      this.dataCheckbox.forEach((data) => {
        this.dataFilters[data.type] = data.list;
      });
    }
  }

  public changeValues(option: string, value) {
    this.dataFilters[option] = value;
  }

  public applyFilters() {
    this.modalController.dismiss(this.dataFilters);
  }

  /**
   * Se valida que en el filtro de fondos haya solo 2 fondos seleccionados (para comparador multifondo)
   */
  public validateFilter(){
    let selected = 0;
    let hasFunds = false;
    if (this.dataCheckbox.length > 0){
      this.dataCheckbox.forEach((check) => {
        if(check.type == "funds"){
          hasFunds = true;
          let withCheck = check.list.filter(function(fund) {
            return fund.checked == true;
          });
          selected = withCheck.length;
        }
      });
    }
    return ((selected == 2) || !hasFunds);
  }

}
