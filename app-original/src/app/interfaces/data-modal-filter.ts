export interface DataCheckbox {
  list: ItemCheckbox[];
  title: string;
  type: string;
  prefix?: string;
  maxChecked?: number;
}

export interface DataRatio {
  list: string[] | number[];
  title: string;
  type: string;
  currentValue: string;
}

export interface ItemCheckbox {
  name: string;
  checked: boolean;
}
