import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { UtilService } from 'src/app/services';

import { ActivacionHuellaComponent } from './activacion-huella.page';

describe('ActivacionHuellaComponent', () => {
  let component: ActivacionHuellaComponent;
  let fixture: ComponentFixture<ActivacionHuellaComponent>;

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    setStorageData: jest.fn(),
    obtenerPWDSS: jest.fn(()=>Promise.resolve(''))
  }

  const NavMock = {
    navigateBack: jest.fn(()=>of()),
    navigateForward: jest.fn(()=>of()),
    navigateRoot: jest.fn(()=>of()),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivacionHuellaComponent ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FingerprintAIO,
        AppAvailability,
        {
          provide: UtilService,
          useValue: UtilServiceMock
        },
        {
          provide: NavController,
          useValue: NavMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivacionHuellaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('procesar Registro Biometria', async () => {
    const spyUtilSetLogEvent = jest.spyOn(UtilServiceMock, 'setLogEvent');
    const spyUtilObtenerPWDSS = jest.spyOn(UtilServiceMock, 'obtenerPWDSS');
    const spyNav = jest.spyOn(NavMock, 'navigateRoot');
    
    await component.procesarRegistroBiometria();

    expect(spyUtilSetLogEvent).toHaveBeenCalled();
    expect(spyUtilObtenerPWDSS).toHaveBeenCalled();
    expect(spyNav).toHaveBeenCalled();
  });

  it('procesar Error Biometria', async () => {
    jest.clearAllMocks();
    
    const spyUtilSetLogEvent = jest.spyOn(UtilServiceMock, 'setLogEvent');
    const spyUtilSetStorageData = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    await component.procesarErrorBiometria(-100);

    expect(spyUtilSetLogEvent).toHaveBeenCalled();
    expect(spyUtilSetStorageData).toHaveBeenCalled();
  });

  it('procesar Error Biometria', async () => {
    jest.clearAllMocks();
    
    const spyUtilSetLogEvent = jest.spyOn(UtilServiceMock, 'setLogEvent');
    const spyUtilSetStorageData = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    await component.procesarErrorBiometria(-100);

    expect(spyUtilSetLogEvent).toHaveBeenCalled();
    expect(spyUtilSetStorageData).toHaveBeenCalled();
  });

  it('cambiar pagina', async () => {
    jest.clearAllMocks();

    const spyNav = jest.spyOn(NavMock, 'navigateRoot');
    
    await component.cambiarPagina('test');

    expect(spyNav).toHaveBeenCalledWith('test');
  });

  it('cambiar pagina sin huella', async () => {
    jest.clearAllMocks();

    const spyNav = jest.spyOn(NavMock, 'navigateRoot');
    const spyUtil = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    await component.cambiarPaginaSinHuella();

    expect(spyNav).toHaveBeenCalledWith('HomeClientePage');
  });
});
