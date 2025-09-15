import { TestBed, getTestBed } from '@angular/core/testing';

import { HttpTestingController } from '@angular/common/http/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { UrlSerializer } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ContextoAPP } from './contexto-app';
import { BarraInformativaService } from '../services/api/restful/barra-informativa.service';
import { of, throwError } from 'rxjs';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { ResizeClass } from './resize.class';

describe('ResizeClass', () => {
  let service: ResizeClass;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler
      ]
    });

    service = TestBed.inject(ResizeClass);
    injector = getTestBed();
  });
  
  /**
   * Creación del componente
   */
  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

  it('Valida ejecución del querySelector para obtención del tag html con clase home', () => {
    document.body.innerHTML ='<html></html>';
    const spy = jest.spyOn(document, 'querySelector');
    service.ionViewWillEnter();

    const selectorHTML = document.querySelector('html');
    console.log(selectorHTML)
    
    expect(spy).toHaveBeenCalledWith('html');
    expect(selectorHTML?.classList.contains('resize')).toBeTruthy();
  });

  it('Valida ejecución del querySelector para obtención del tag html sin la clase home', () => {
    document.body.innerHTML ='<html></html>';
    const spy = jest.spyOn(document, 'querySelector');
    service.ionViewWillLeave();

    const selectorHTML = document.querySelector('html');
    
    expect(spy).toHaveBeenCalledWith('html');
    expect(selectorHTML?.classList.contains('resize')).toBeFalsy();
  });
});
