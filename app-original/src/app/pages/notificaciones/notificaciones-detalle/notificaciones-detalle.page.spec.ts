import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { TrazabilidadService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { TRAZAS_NOTIFICACIONES } from '../util/constantes.notificaciones';
import { NotificacionesDetallePage } from './notificaciones-detalle.page';

describe('NotificacionesDetallePage', () => {
  let component: NotificacionesDetallePage;
  let fixture: ComponentFixture<NotificacionesDetallePage>;
  let contextoApp: ContextoAPP;

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn()
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesDetallePage ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
        FingerprintAIO,
        {
            provide: TrazabilidadService,
            useValue: TrazabilidadServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                paramMap: {
                    get: jest.fn()
                }
                }
            }
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

    contextoApp = TestBed.inject(ContextoAPP);
  }));

  beforeEach(() => {
    const cliente = {
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoElectronico:  '',
        rut: 0,
        digitoVerificadorRut:  '',
        sexo:  '',
        fechaAfiliacion:  '',
        fechaIncorporacion:  '',
        idMaePersona:  '',
        edad:  '',
        esPensionado:  '',
        telefonoCelular:  '',
        saldoSimulacion:  '',
        rentaImponible:  ''
    }
    contextoApp.datosCliente = new DatosUsuario(cliente);

    fixture = TestBed.createComponent(NotificacionesDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza', () => {
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    component.registrarTrazabilidad(30400);

    expect(spyTraza).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}