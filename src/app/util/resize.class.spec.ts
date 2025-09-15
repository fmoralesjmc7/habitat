import { TestBed, getTestBed } from '@angular/core/testing';

import { UrlSerializer } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ResizeClass } from './resize.class';

describe('ResizeClass', () => {
  let service: ResizeClass;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlSerializer, HttpClient, HttpHandler],
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
    document.body.innerHTML = '<html></html>';
    const spy = jest.spyOn(document, 'querySelector');
    service.ionViewWillEnter();

    const selectorHTML = document.querySelector('html');
    console.log(selectorHTML);

    expect(spy).toHaveBeenCalledWith('html');
    expect(selectorHTML?.classList.contains('resize')).toBeTruthy();
  });

  it('Valida ejecución del querySelector para obtención del tag html sin la clase home', () => {
    document.body.innerHTML = '<html></html>';
    const spy = jest.spyOn(document, 'querySelector');
    service.ionViewWillLeave();

    const selectorHTML = document.querySelector('html');

    expect(spy).toHaveBeenCalledWith('html');
    expect(selectorHTML?.classList.contains('resize')).toBeFalsy();
  });
});
