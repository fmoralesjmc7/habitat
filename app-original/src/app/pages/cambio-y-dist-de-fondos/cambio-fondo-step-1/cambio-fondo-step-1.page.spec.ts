import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { TrazabilidadService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';

import { CambioFondoStep1Page } from './cambio-fondo-step-1.page';

describe('CambioFondoStep1Page', () => {
  let component: CambioFondoStep1Page;
  let fixture: ComponentFixture<CambioFondoStep1Page>;

  const trazabilidadMock = {
    registraTrazaUUID: jest.fn(() => of(false))
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioFondoStep1Page ],
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
    fixture = TestBed.createComponent(CambioFondoStep1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error validar cuenta', async () => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateForward');

    await component.validarCuentaHabilitada(1, 'k', '1', '1', 'test');
    
    expect(navCtrl.navigateForward).toHaveBeenCalled();
  });

  it('error validar cuenta', async () => {
    component.productosCliente = [
      {
          "descripcionProducto": "CUENTA DE CAPITALIZACION INDIVIDUAL DE COTIZACIONES OBLIGATORIAS",
          "estaDistribuida": true,
          "saldoTotal": 171655736,
          "idProducto": 1,
          "fondos": [
              {
                  "nombreFondo": "C",
                  "porcentajeDistribucion": 80,
                  "esRecaudadorActual": true,
                  "valorCuota": 57570.18,
                  "idFondo": 3,
                  "numeroCuotas": 2356.62,
                  "idCuenta": 6708580578,
                  "saldo": 135671038
              },
              {
                  "nombreFondo": "E",
                  "porcentajeDistribucion": 20,
                  "esRecaudadorActual": false,
                  "valorCuota": 48197.45,
                  "idFondo": 5,
                  "numeroCuotas": 746.61,
                  "idCuenta": 6708357580,
                  "saldo": 35984698
              }
          ],
          "nombreCortoProducto": "Cuenta Obligatoria",
          "codigoProducto": "CCICO",
          "esModificable": true,
          "fueModificado": true,
          "esCambioFondo": false,
          "esDistribucionFondo": false
      }
    ];
    
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateForward');

    await component.verificarSolicitudCDF();
    
    expect(navCtrl.navigateForward).toHaveBeenCalled();
  });

  it('registrar trazabilidad', async () => {
    const spy = jest.spyOn(trazabilidadMock, 'registraTrazaUUID');

    await component.registrarTrazabilidad('INI');
    
    expect(component.uuid).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });

  it('retorna objeto general de traza', () => {
    expect(component.datosGeneralasTrazas()).toBeDefined();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}
