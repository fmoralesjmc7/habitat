import { QuestionSlideText } from "src/app/interfaces/question-slide-text"; 
import { SlidesConstants } from "src/app/interfaces/slide-constants"; 
import { ErrorButtons } from "src/app/interfaces/error-elements"; 

export const benchmarkConstants: SlidesConstants = {
  questionSlideTexts: {
    amount: {
      question: 'El monto a comparar es',
      formControlName: 'amount',
      typeInput: 'money',
      classIllustration: 'illus-user-comparing',
      slideNumber: 1,
      explanatory: 'Ingresa un monto determinado para comparar la rentabilidad entre AFPs.',
      link: 'Certificado de Saldos.',
      explanatory2 :'También puedes sumar otros ahorros que tengas destinados para tu pensión.',
    } as QuestionSlideText,
    pensionFund: {
      question: '¿Qué multifondo quieres evaluar?',
      typeInput: 'picker',
      textButton: 'Simular',
      classIllustration: 'illus-funds',
      slideNumber: 2,
    } as QuestionSlideText,
  },
  questionsOrder: ['amount', 'pensionFund'],
  eventPrefix: 'benchmark_',
  pickerOptions: {
    options: [
      { value: 'A', text: 'Fondo A' },
      { value: 'B', text: 'Fondo B' },
      { value: 'C', text: 'Fondo C' },
      { value: 'D', text: 'Fondo D' },
      { value: 'E', text: 'Fondo E' }
    ],
    placeholder: 'Elige un fondo'
  },
  textLoading: ['Calculando tu rentabilidad...'],
  headerElements: {
    title: 'Rentabilidad entre AFP',
    iconLeft: 'icon-back'
  },
  slideOpts: {
    pagination: {
      el: '#slides',
      type: 'progressbar',
    }
  },
  funds: ['A', 'B', 'C', 'D', 'E'],
  periods: [1, 3, 5, 15],
  differenceValue: {
    number: 0,
    sign: ''
  },
  errorButtons: {
    firstButton: 'Reintentar',
    secondButton: 'Volver al home'
  } as ErrorButtons,

};
