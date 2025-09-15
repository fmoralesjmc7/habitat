import { DatePipe } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ClienteService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_ERROR_GENERICO } from 'src/app/util/error-generico.constantes';

import { ClaveSacuPage } from './clave-sacu.page';

describe('ClaveSacuPage', () => {
  let component: ClaveSacuPage;
  let fixture: ComponentFixture<ClaveSacuPage>;
  
  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const ClienteServiceMock = {
    administrarClavePrevired: jest.fn(()=>of())
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaveSacuPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler, 
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({option: '1'})
          },
        },
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: ClienteService,
          useValue: ClienteServiceMock
        },
        {
          provide: Router, useValue: routerSpy
        },
        AppAvailability
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaveSacuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error validar sacu cdf', async () => {
    component.origenDeIngreso = 1;
    const spy = jest.spyOn(ContextoAPPMock, 'ocultarLoading');
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    ClienteServiceMock.administrarClavePrevired.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.validarEstadSacu();
    
    expect(spy).toHaveBeenCalled();
    expect(spyMock).toHaveBeenCalled();
  });

  it('error validar sacu giro', async () => {
    component.origenDeIngreso = 2;
    const spy = jest.spyOn(ContextoAPPMock, 'ocultarLoading');
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    ClienteServiceMock.administrarClavePrevired.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.validarEstadSacu();
    
    expect(spy).toHaveBeenCalled();
    expect(spyMock).toHaveBeenCalled();
  });

  it('error validar clave previred cdf', async () => {
    component.origenDeIngreso = 1;
    const spy = jest.spyOn(ContextoAPPMock, 'ocultarLoading');
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    ClienteServiceMock.administrarClavePrevired.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.validarClavePrevired();
    
    expect(spy).toHaveBeenCalled();
    expect(spyMock).toHaveBeenCalled();
  });

  it('error validar clave previred giro', async () => {
    component.origenDeIngreso = 2;
    const spy = jest.spyOn(ContextoAPPMock, 'ocultarLoading');
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    ClienteServiceMock.administrarClavePrevired.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.validarClavePrevired();
    
    expect(spy).toHaveBeenCalled();
    expect(spyMock).toHaveBeenCalled();
  });

  it('volver al home', async () => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    component.volverAlHome();
    
    expect(spyMock).toHaveBeenCalled();
  });
});