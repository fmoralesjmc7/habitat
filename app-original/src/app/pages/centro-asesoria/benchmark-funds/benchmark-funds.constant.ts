import { QuestionSlideText } from "src/app/interfaces/question-slide-text" 
import { ChartOptions } from "src/app/components/ca-chartist/chartist.component"
import { ItemCheckbox } from "src/app/interfaces/data-modal-filter"
import { SlidesConstants } from "src/app/interfaces/slide-constants"
import { ErrorButtons } from "src/app/interfaces/error-elements"

export const benchmarkFundsConstants: SlidesConstants = {
  questionSlideTexts: {
    amount: {
      question: 'Ingresa un monto a comparar',
      formControlName: 'amount',
      typeInput: 'money',
      classIllustration: 'illus-user-comparing',
      slideNumber: 1,
    } as QuestionSlideText,
    fund: {
      question: 'Selecciona los 2 multifondos que quieres comparar',
      typeInput: 'select-fund',
      classIllustration: 'illus-funds',
      slideNumber: 2,
    } as QuestionSlideText
  },
  questionsOrder: ['amount', 'fund'],
  eventPrefix: 'benchmarkFunds_',
  pickerOptions: {
    options: [
      { value: 'A', text: 'Fondo A' },
      { value: 'B', text: 'Fondo B' },
      { value: 'C', text: 'Fondo C' },
      { value: 'D', text: 'Fondo D' },
      { value: 'E', text: 'Fondo E' }
    ],
    placeholder: 'Fondo A'
  },
  textLoading: ['Calculando tu rentabilidad...'],
  headerElements: {
    title: 'Rentabilidad multifondos',
    iconLeft: 'icon-back'
  },
  slideOpts: {
    pagination: {
      el: '#slides',
      type: 'progressbar',
    }
  },
  differenceValue: {
    number: 0,
    sign: ''
  },
  dataChart: {
    labels: [],
    series: []
  },
  optionsChart: {
    axisY: {
      showGrid: true,
      labelInterpolationFnc: function (label) {
        const isBillion = Math.abs(Number(label)) >= 1.0e+9;
        const isMillion = Math.abs(Number(label)) >= 1.0e+6;
        const isThousand = Math.abs(Number(label)) >= 1.0e+3;
        return isBillion ? '$' + (Math.abs(Number(label)) / 1.0e+9).toLocaleString('es-CL') + 'B' :
          isMillion ? '$' + (Math.abs(Number(label)) / 1.0e+6).toLocaleString('es-CL') + 'MM' :
            isThousand ? '$' + (Math.abs(Number(label)) / 1.0e+3).toLocaleString('es-CL') + 'M' : Math.abs(Number(label));
      },
      position: 'start'
    },
    axisX: {
      showGrid: false,
      high: 35
    },
    width: '100%',
    height: '65%',
    fullWidth: true,
    showPoint: false,
    lineSmooth: true
  } as  ChartOptions,
  periods: [1, 3, 5, 15],
  fundsChecked: [
    { name: 'A', checked: false },
    { name: 'B', checked: false },
    { name: 'C', checked: false },
    { name: 'D', checked: false },
    { name: 'E', checked: false }
  ] as ItemCheckbox[],
  errorButtons: {
    firstButton: 'Reintentar',
    secondButton: 'Volver al home'
  } as ErrorButtons
};
