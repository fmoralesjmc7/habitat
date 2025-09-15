import { QuestionSlideText } from "src/app/interfaces/question-slide-text"; 
import { SlidesConstants } from "src/app/interfaces/slide-constants"; 
import { ErrorButtons } from "src/app/interfaces/error-elements";

export const simulatorConstants: SlidesConstants = {
  questionSlideTexts: {
    taxableIncome: {
      question: '¿Cuál es tu ingreso bruto?',
      formControlName: 'taxableIncome',
      typeInput: 'money',
      explanatory: 'El ingreso bruto es tu renta mensual antes de pagar impuestos, leyes sociales, salud y previsión.',
      slideNumber: 1,
      maxlength: 12
    } as QuestionSlideText,
    balance: {
      question: '¿Cuánto tienes ahorrado para tu pensión?',
      formControlName: 'balance',
      typeInput: 'money',
      explanatory: 'Tus ahorros destinados para pensión corresponden a la suma de todas tus cuentas en AFP Habitat a excepción de la Cuenta 2. Puedes complementar este saldo sumando los ahorros que tengas en Cuenta 2 o en otras instituciones.',
      link: 'Certificado de Saldos.',
      explanatory2 :'También puedes sumar otros ahorros que tengas destinados para tu pensión.',
      slideNumber: 2,
      classIllustration: 'illus-report',
      maxlength: 12
    } as QuestionSlideText,
    density: {
      question: '¿Cuántos meses al año tienes pensado cotizar hasta tu edad legal de jubilación?',
      textButton: 'Simular',
      typeInput: 'picker',
      explanatory: 'Para estimar mejor la cantidad de tus futuras cotizaciones anuales, revisa tu ',
      link: 'Certificado de Cotizaciones.',
      slideNumber: 3,
      classIllustration: 'illus-fatherhood'
    } as QuestionSlideText
  },
  questionsOrder: ['taxableIncome', 'balance', 'density'],
  eventPrefix: 'simulator_',
  pickerOptions: {
    options: [
      { value: 12, text: '12 meses' },
      { value: 11, text: '11 meses' },
      { value: 10, text: '10 meses' },
      { value: 9, text: '9 meses' },
      { value: 8, text: '8 meses' },
      { value: 7, text: '7 meses' },
      { value: 6, text: '6 meses' },
      { value: 5, text: '5 meses' },
      { value: 4, text: '4 meses' },
      { value: 3, text: '3 meses' },
      { value: 2, text: '2 meses' },
      { value: 1, text: '1 mes' },
      { value: 0, text: '0 meses' }
    ],
    placeholder: 'Selecciona una opción'
  },
  textLoading: [
    'Sacando la calculadora...',
    'Procesando tu información...',
    'Calculando tu futura pensión...'
  ],
  headerElements: {
    iconLeft: 'btn-icon icon-back',
    title: ''
  },
  slideOpts: {
  },
  configParametersDefault : {
    factorTaxableIncome: 0,
    maxAgeMen: 0,
    maxAgeWomen: 0,
    minAgeMen: 0,
    minAgeWomen: 0,
    minimumIncome: 0,
    liquidIncome: 0,
    simulatorResultProgrammedRetirement: true
  },
  errorButtons: {
    firstButton: 'Reintentar',
    secondButton: 'Volver al home'
  } as ErrorButtons
};
