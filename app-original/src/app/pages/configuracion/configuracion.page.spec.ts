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

import { ConfiguracionComponent } from './configuracion.page';
import { CONSTANTES_ACTIVACION_BIOMETRIA } from './util/configuracion.constantes';

describe('ConfiguracionPage', () => {
  let component: ConfiguracionComponent;
  let fixture: ComponentFixture<ConfiguracionComponent>;

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    setStorageData: jest.fn(),
    obtenerPWDSS: jest.fn(()=>Promise.resolve('')),
    getStorageData: jest.fn(()=>Promise.resolve())
  }

  const NavMock = {
    navigateBack: jest.fn(()=>of()),
    navigateForward: jest.fn(()=>of()),
    navigateRoot: jest.fn(()=>of()),
    pop: jest.fn()
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionComponent ],
      providers: [
        FingerprintAIO,
        AES256, 
        FileOpener, 
        UrlSerializer, 
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
    fixture = TestBed.createComponent(ConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('procesar bimoetria', () => {
    component.procesarBiometria('finger');

    expect(component.textoTipoBiometria).toBe(CONSTANTES_ACTIVACION_BIOMETRIA.finger);
  });

  it('boton volver', () => {
    let spy = jest.spyOn(NavMock, 'pop');
    
    component.backButton();

    expect(spy).toHaveBeenCalled();
  });

  it('mostrar Mensaje Activacion Huella', () => {
    let spy = jest.spyOn(component, 'mostrarAlert');
    
    component.mostrarMensajeActivacionHuella();

    expect(spy).toHaveBeenCalled();
  });

  it('mostrar Mensaje Activacion Huella', () => {
    let spy = jest.spyOn(component, 'mostrarAlert');
    
    component.mostrarMensajeActivacionHuella();

    expect(spy).toHaveBeenCalled();
  });

  it('cambiar Switch Aceptar', () => {
    let spy = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    component.cambiarSwitchAceptar();

    expect(component.huellaEstaActiva).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('cambiar Switch Cancelar', () => {
    let spy = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    component.cambiarSwitchCancelar();

    expect(component.huellaEstaActiva).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('switch On - huella inactiva', () => {
    let spy = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    component.switchOn();

    expect(component.huellaEstaActiva).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('switch On - huella activa', () => {
    let spy = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    component.huellaEstaActiva = true;
    component.switchOn();

    expect(spy).toHaveBeenCalled();
  });

  it('switch On - huella activa en si', () => {
    let spy = jest.spyOn(UtilServiceMock, 'setStorageData');
    
    component.huellaEstaActiva = true;
    component.switchOn();

    expect(spy).toHaveBeenCalled();
  });
});
