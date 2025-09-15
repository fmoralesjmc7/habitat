

import { TestBed, fakeAsync, getTestBed, tick } from '@angular/core/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { UrlSerializer, Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LlamadaKhipu } from './llamada-khipu';
import { DepositoDirectoService, TrazabilidadService, UtilService } from 'src/app/services';
import { of } from 'rxjs';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('LlamadaKhipu', () => {
  let service: LlamadaKhipu;
  let injector: TestBed;
  let contextoApp: ContextoAPP;

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const trazabilidadMock = {
    registraTrazaUUID: jest.fn()
  }

  const depositoDirectoMock = {
    generarTransaccion: jest.fn(),
    obtenerTransaccion: jest.fn(),
    obtenerPagoKhipu: jest.fn(),
    actualizarTransaccion: jest.fn(),
  }

  const utilServiceMock = {
    setLogEvent: jest.fn(),
    getStorageUuid: jest.fn()
  }


  const routerSpy =  jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: TrazabilidadService,
          useValue: trazabilidadMock
        },
        {
          provide: DepositoDirectoService,
          useValue: depositoDirectoMock
        },
        {
          provide: UtilService,
          useValue: utilServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: Router, useValue: routerSpy
        },
        AppAvailability
      ]
    });

    service = TestBed.inject(LlamadaKhipu);
    injector = getTestBed();
  });
  
  /**
   * Creación del componente
   */
  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

  it('preLlamadaKhipu ok', () => {
    const spyGenerarTransaccion = jest.spyOn(depositoDirectoMock, 'generarTransaccion').mockReturnValueOnce(of({
        estado: 'OK',
        nroTransaccion: '123456789' 
    }));

    const depDir = {};
    const transaccion = '';
    const name= 'test';
    const rut= 12323232;
    const dv ='1';
    const parametroTraza = '';
    service.preLlamadaKhipu(depDir, transaccion, name, rut, dv, parametroTraza);
    expect(spyGenerarTransaccion).toBeCalled();
  });


  it('preLlamadaKhipu debe resolver con respuesta satisfactoria cuando todo está OK', fakeAsync (() => {
    const depDir = {};
    const transaccion = {};
    const name = 'test';
    const rut = '12345678';
    const dv = '9';
    const parametroTraza = {};

    const mockData = { depDir: {}, subject: 'Abono Directo' };
    const mockTransaccion = { transaccion: {} };

    depositoDirectoMock.generarTransaccion.mockReturnValue(of({ estado: 'OK', nroTransaccion: '123' }));
    depositoDirectoMock.obtenerTransaccion.mockReturnValue(of({ estado: 'OK', transaccion: mockTransaccion }));
    depositoDirectoMock.obtenerPagoKhipu.mockReturnValue(of({}));
    depositoDirectoMock.actualizarTransaccion.mockReturnValue(of({ estado: 'OK' }));
    utilServiceMock.getStorageUuid.mockResolvedValue('uuid');
    ContextoAPPMock.generarObjetoTraza.mockReturnValue(parametroTraza);
    trazabilidadMock.registraTrazaUUID.mockReturnValue(of({}));
    tick();
    expect(service.preLlamadaKhipu(depDir, transaccion, name, rut, dv, parametroTraza)).resolves.toEqual({
      success: true,
      response: {},
      depositoDirecto: mockData.depDir,
      from: 'actualizarTransaccion',
    });
  }));

  it('Registrar traza  - Kiphu', fakeAsync (() => {
    const spy = jest.spyOn(trazabilidadMock, 'registraTrazaUUID');

    tick();
    service.registrarTrazabilidad('',1,11111111,'1');
    expect(spy).toHaveBeenCalled();

  }));
});