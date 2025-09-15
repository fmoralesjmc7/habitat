import { QuestionSlideText } from "src/app/interfaces/question-slide-text";
import { SlidesConstants } from "src/app/interfaces/slide-constants"; 
import { HeaderElements } from "src/app/interfaces/header-elements";
import { ErrorButtons } from "src/app/interfaces/error-elements"; 

export const taxBenefitSimulatorConstats: SlidesConstants = {
  questionSlideTexts: {
    liquidIncome: {
      question: '¿Cuál es tu ingreso líquido mensual?',
      formControlName: 'liquidIncome',
      typeInput: 'money',
      slideNumber: 1,
      explanatory: 'Tu ingreso líquido mensual es tu renta mensual después de pagar impuestos, leyes sociales, salud y previsión.',
      classIllustration: 'illus-user-comparing'
    } as QuestionSlideText,
    apvAmount: {
      question: '¿Cuánto podrías ahorrar mensualmente de tu ingreso líquido?',
      formControlName: 'apvAmount',
      typeInput: 'money',
      slideNumber: 2,
      classIllustration: 'illus-wallet'
    } as QuestionSlideText
  },
  questionsOrder: ['liquidIncome', 'apvAmount'],
  eventPrefix: 'taxBenefitSimulator_',
  textLoading: ['Calculando los beneficios de tu APV...'],
  headerElements: {
    iconLeft: 'btn-icon icon-back',
    title: ''
  } as HeaderElements,
  slideOpts: {
    pagination: {
      el: '#slides',
      type: 'progressbar',
    }
  },
  errorButtons: {
    firstButton: 'Reintentar',
    secondButton: 'Volver al home'
  } as ErrorButtons
};
