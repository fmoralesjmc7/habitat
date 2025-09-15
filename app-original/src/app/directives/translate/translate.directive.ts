import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { translationNotFoundMessage } from '../../config/translation.config';

/**
 * Directiva para traducción de textos, obtiene valores desde json según idioma definido y seleccionado
 */
@Directive({
  selector: '[appTranslate]'
})
export class TranslateDirective implements OnChanges, OnInit, OnDestroy {

  @Input() appTranslate!: string;
  @Input() translateValues?: { [key: string]: unknown };

  /**
   * Almacena error translate
   */
  error: string;
  
  private readonly directiveDestroyed = new Subject<never>();
  
  constructor(private el: ElementRef, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.directiveDestroyed)).subscribe(() => {
      this.getTranslation();
    });
  }

  ngOnChanges(): void {
    this.getTranslation();
  }

  ngOnDestroy(): void {
    this.directiveDestroyed.next();
    this.directiveDestroyed.complete();
  }

  /**
   * Función que realizar traducción del texto solicitado
   */
  private getTranslation(): void {
    this.translateService
      .get(this.appTranslate, this.translateValues)
      .pipe(takeUntil(this.directiveDestroyed))
      .subscribe(
        value => {
          this.el.nativeElement.innerHTML = value;
        },
        () => {
          this.error = `${translationNotFoundMessage}[${this.appTranslate}]`;
        }
      );
  }

}
