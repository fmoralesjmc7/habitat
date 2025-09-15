import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ClienteService, TrazabilidadService } from 'src/app/services';
import { CertificadosService } from 'src/app/services/api/restful/certificados.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { CartolaDetallePage } from './cartola-detalle.page';
import { DatePipe } from "@angular/common";
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('CartolaDetallePage', () => {
  let component: CartolaDetallePage;
  let fixture: ComponentFixture<CartolaDetallePage>;
  let contextoApp: ContextoAPP;

  const CertificadosServiceMock = {
    obtenerPDFCartolas: jest.fn(()=>of()),
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    reemplazarTildesTexto: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const trazabilidadMock = {
    registraTrazaUUID: jest.fn(() => of(false))
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const ClienteServiceMock = {
    obtenerURLVideoCartolaMensual: jest.fn(() => of(undefined))
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartolaDetallePage ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
        DatePipe,
        {
          provider: CertificadosService,
          useValue: CertificadosServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({certificado : ['{"nombreCortoProducto" : "123", "producto": ""}']})
          },
        },
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: NavController,
          useValue: NavMock
        },
        {
          provide: ClienteService,
          useValue: ClienteServiceMock
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
    fixture = TestBed.createComponent(CartolaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error obtener pdf', async() => {
    const spyError = jest.spyOn(component, 'registrarTrazabilidad')
    CertificadosServiceMock.obtenerPDFCartolas.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.obtenerPDF();
    expect(spyError).toHaveBeenCalled();
  });

  it('error obtener video', async() => {
    ClienteServiceMock.obtenerURLVideoCartolaMensual.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.obtenerURLVideoCartola();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza  - registrar', async () => {
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');
    await component.registrarTrazabilidad(25167);

    expect(spyTraza).toHaveBeenCalled();
  });
});
