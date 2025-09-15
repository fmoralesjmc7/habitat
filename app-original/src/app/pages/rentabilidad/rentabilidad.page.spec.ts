import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { IndicadorService, NotificacionService, TrazabilidadService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';

import { RentabilidadPage } from './rentabilidad.page';

describe('RentabilidadPage', () => {
  let component: RentabilidadPage;
  let fixture: ComponentFixture<RentabilidadPage>;

  const IndicadorServiceMock = {
    obtenerRentabilidad: jest.fn(()=>of([]))
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const notificacionServiceMock = {
    obtenerNotificaciones: jest.fn(()=>of())
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn()
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentabilidadPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: IndicadorService,
          useValue: IndicadorServiceMock
        },
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provider: NotificacionService,
          useValue: notificacionServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: NavController,
          useClass: NavMock,
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
    fixture = TestBed.createComponent(RentabilidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('obtener rentabilidad sin datos', async () => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');

    await component.ionViewDidEnter();
    
    expect(navCtrl.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener rentabilidad', async () => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');

    IndicadorServiceMock.obtenerRentabilidad.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.ionViewDidEnter();
    
    expect(navCtrl.navigateRoot).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}