import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select-fund',
  templateUrl: './select-fund.component.html',
  styleUrls: ['./select-fund.component.scss']
})
export class SelectFundComponentCA {
  @Output() public changeFunds = new EventEmitter();
  private isCheckboxDisabled = false;
  public funds: any[] = [
    { value: 'A', checked: false },
    { value: 'B', checked: false },
    { value: 'C', checked: false },
    { value: 'D', checked: false },
    { value: 'E', checked: false }
    ];

  public checked(option) {
    const optionPosition = this.funds.indexOf(option);
    if (!this.isCheckboxDisabled || this.funds[optionPosition].checked) {
      this.funds[optionPosition].checked = !this.funds[optionPosition].checked;
    }
    const checkedFunds = this.funds.filter(fund => fund.checked);
    this.isCheckboxDisabled = checkedFunds.length === 2;
    const selectedFunds: any[] = [null, null];
    checkedFunds.forEach((fund, index) => {
      selectedFunds[index] = fund.value;
    });
    this.emitFunds(selectedFunds.sort());
  }

  public emitFunds(funds: string[]) {
    this.changeFunds.emit(funds);
  }


}
