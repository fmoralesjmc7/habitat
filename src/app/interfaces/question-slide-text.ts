export interface QuestionSlideText {
  question: string;
  typeInput?: 'number' | 'money' | 'gender' | 'picker' | 'select-fund';
  textButton?: string;
  formControlName?: string;
  explanatory?: string;
  link?: string;
  explanatory2?: string;
  classIllustration?: string;
  placeholder?: string;
  slideNumber?: number;
  maxlength?: number;
}
