import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { TrazabilidadService } from 'src/app/services';
import { CambioFondoService } from 'src/app/services/api/restful/cambioFondo.service';
import { ContextoAPP } from 'src/app/util/contexto-app';

import { CambioFondoStep2Page } from './cambio-fondo-step-2.page';

describe('CambioFondoStep2Page', () => {
  let component: CambioFondoStep2Page;
  let fixture: ComponentFixture<CambioFondoStep2Page>;

  const trazabilidadMock = {
    registraTrazaUUID: jest.fn(() => of(false))
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const CambioFondoServiceMock = {
    solicitudCDF: jest.fn(()=> of({
      estado_exito : false,
      pdf: ''
    }))
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioFondoStep2Page ],
      providers: [
        ModalController, 
        AngularDelegate, 
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
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: NavController,
          useClass: NavMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ productos: '[]', id: 123}),
            snapshot: {
              paramMap: {
                get: jest.fn()
              }
            }
          },
        },
        {
          provide: CambioFondoService,
          useValue: CambioFondoServiceMock
        },
        AppAvailability,
        {
          provide: Router, useValue: routerSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioFondoStep2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error solicitar cambio fondo', async() => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateForward');

    await component.generarSolicitudCDF();
    
    expect(navCtrl.navigateForward).toHaveBeenCalled();
  });

  it('error servicio solicitar cambio fondo', async () => {
    const spy = jest.spyOn(component, 'registrarTrazabilidad');
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateForward');

    CambioFondoServiceMock.solicitudCDF.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.generarSolicitudCDF();
    expect(spy).toHaveBeenCalled();
    expect(navCtrl.navigateForward).toHaveBeenCalled();
  });

  it('registrar trazabilidad', async () => {
    const spy = jest.spyOn(trazabilidadMock, 'registraTrazaUUID');

    await component.registrarTrazabilidad();
    
    expect(component.uuid).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}
