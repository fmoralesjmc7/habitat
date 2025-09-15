import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { DepositoDirectoService, TrazabilidadService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { KhipuSuccessPage } from './khipu-success.page';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('KhipuSuccessPage', () => {
  let component: KhipuSuccessPage;
  let fixture: ComponentFixture<KhipuSuccessPage>;
  let contextoApp: ContextoAPP;

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const DepositoDirectoServiceMock = {
    obtenerTransaccion: jest.fn(()=>of({
      estado: 'OK',
      transaccion: {
        folio: 11111
      }
    })),
    obtenerComprobante: jest.fn(()=>of({}))
  }

  const trazabilidadMock = {
    registraTrazaUUID: jest.fn(() => of(false))
  }

  const routerSpy =  jest.fn();
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KhipuSuccessPage ],
      providers: [UrlSerializer, HttpClient, HttpHandler, AES256, FileOpener, ContextoAPP,
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: DepositoDirectoService,
          useValue: DepositoDirectoServiceMock
        },
        {
          provide: TrazabilidadService,
          useValue: trazabilidadMock
        },
        {
          provide: Router, useValue: routerSpy
        },
        AppAvailability
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

    fixture = TestBed.createComponent(KhipuSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Error obteniendo comprobante', fakeAsync (async () => {
    DepositoDirectoServiceMock.obtenerComprobante.mockReturnValue(throwError({ status: 500, error: {}}));
    await component.descargarPdf();
    tick(7000);

    expect(NavMock.navigateForward).toHaveBeenCalled();
  }));

  it('registrar traza  - Kiphu', async () => {

    let parametroTraza: ParametroTraza = new ParametroTraza();
    component.CONSTANTES_TRAZA.COD_CAV_PASO_3_DESCARGA_PDF.codigo = 111;
    component.CONSTANTES_TRAZA.COD_CAV_PASO_3_DESCARGA_PDF.datos = "";
    const spy = jest.spyOn(ContextoAPPMock, 'registrarTrazabilidad')
    
    await component.registrarTrazaDescargaPDFExito();
    expect(spy).toHaveBeenCalled();

  });
});
