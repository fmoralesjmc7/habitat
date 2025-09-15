import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController, NavParams } from '@ionic/angular';
import { of } from 'rxjs';
import { UtilService } from 'src/app/services';
import { CONSTANTES_ERROR_GENERICO } from 'src/app/util/error-generico.constantes';

import { ErrorGenericoPage } from './error-generico.page';

describe('ErrorGenericoPage', () => {
  let component: ErrorGenericoPage;
  let fixture: ComponentFixture<ErrorGenericoPage>;

  const UtilServiceMock = {
    openWithSystemBrowser: jest.fn()
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorGenericoPage ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ option: 'Home', timestamp: 21221221})
          }
        },
        {
          provide: NavController,
          useClass: NavMock,
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorGenericoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sin origen establecido', () => {
    const spy = jest.spyOn(component, 'volverAlHome')
    component.origenDeIngreso = undefined!;

    component.volverAtras();
    expect(spy).toHaveBeenCalled();
  });

  it('origen establecido home', () => {
    const spy = jest.spyOn(component, 'volverAlHome')
    component.origenDeIngreso = 'Home';

    component.volverAtras();
    expect(spy).toHaveBeenCalled();
  });

  it('origen establecido home', () => {
    component.origenDeIngreso = 'Indicadores';

    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');

    component.volverAtras();
    expect(navCtrl.navigateRoot).toHaveBeenCalledWith('Indicadores');
  });

  it('volver home', () => {
    component.esCliente = true;

    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');

    component.volverAlHome();
    expect(navCtrl.navigateRoot).toHaveBeenCalledWith('HomeClientePage');
  });

  it('volver home invitado', () => {
    component.esCliente = false;

    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');

    component.volverAlHome();
    expect(navCtrl.navigateRoot).toHaveBeenCalledWith('HomeInvitadoPage');
  });

  it('abrir red social invalida', () => {
    const spy = jest.spyOn(UtilServiceMock, 'openWithSystemBrowser');
    component.abrirPageRRSS('youtube');
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('abrir red social valida', () => {
    const spy = jest.spyOn(UtilServiceMock, 'openWithSystemBrowser');
    component.abrirPageRRSS('facebook');
    
    expect(spy).toHaveBeenCalledWith(CONSTANTES_ERROR_GENERICO.facebook);
  });

  it('abrir red social valida', () => {
    component.ionViewWillLeave();

    expect(component.uuidGif).toBeDefined();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}
