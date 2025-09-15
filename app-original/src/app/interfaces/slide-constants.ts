import { HeaderElements } from "./header-elements"; 
import { ChartOptions } from "../components/ca-chartist/chartist.component"; 
import { ItemCheckbox } from "./data-modal-filter";
import { ErrorButtons } from "./error-elements"; 

export interface SlidesConstants {
  questionSlideTexts: any;
  questionsOrder: string[];
  eventPrefix: string;
  pickerOptions?: any;
  textLoading: string[];
  headerElements: HeaderElements;
  slideOpts: any;
  configParametersDefault?: any;
  funds?: string[];
  periods?: number[];
  differenceValue?: any;
  dataChart?: any;
  optionsChart?: ChartOptions;
  fundsChecked?: ItemCheckbox[];
  errorButtons: ErrorButtons;
}
