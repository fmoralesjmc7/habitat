import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

export const translationNotFoundMessage = 'translation-not-found';

/**
 * Archivo de configuración para directiva translate, carga archivos con textos para hacer traducciones
 */
export class MissingTranslationHandlerImpl implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    const key = params.key;
    return `${translationNotFoundMessage}[${key}]`;
  }
}

/**
 * Carga archivos con textos asociados a idioma seleccionado
 * @param http Ruta del proyecto
 * @returns Carga de listado de archivos seleccionados
 */
export function translatePartialLoader(http: HttpClient): TranslateLoader {
  // Agregar archivos de traducción para cada componente
  return new MultiTranslateHttpLoader(http, []);
}

export function missingTranslationHandler(): MissingTranslationHandler {
  return new MissingTranslationHandlerImpl();
}
