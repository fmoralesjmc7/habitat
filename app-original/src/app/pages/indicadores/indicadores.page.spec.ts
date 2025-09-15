import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UrlSerializer, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { IndicadorService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';

import { IndicadoresPage } from './indicadores.page';

describe('IndicadoresPage', () => {
  let component: IndicadoresPage;
  let fixture: ComponentFixture<IndicadoresPage>;

  const IndicadorServiceMock = {
    obtenerIndicadoresEconomicos: jest.fn(()=>of())
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn()
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresPage ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
        {
          provider: IndicadorService,
          useValue: IndicadorServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        }, 
        AppAvailability
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error simulacion Ligth', async() => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');
    IndicadorServiceMock.obtenerIndicadoresEconomicos.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.ionViewDidEnter();
    expect(navCtrl.navigateRoot).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}

