import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { TrazabilidadService } from 'src/app/services';
import { CertificadosService } from 'src/app/services/api/restful/certificados.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { CartolaCuatrimestralPage } from './cartola-cuatrimestral.page';

describe('CartolaCuatrimestralPage', () => {
  let component: CartolaCuatrimestralPage;
  let fixture: ComponentFixture<CartolaCuatrimestralPage>;
  let contextoApp: ContextoAPP;

  const CertificadosServiceMock = {
    obtenerPeriodosCartolaCuatrimestral: jest.fn(()=>of()),
    obtenerPDF: jest.fn(()=>of()),
    enviarCorreoSolicitud: jest.fn(()=>of())
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

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartolaCuatrimestralPage ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
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
            queryParams: of({producto : ['{"nombreCortoProducto" : "123", "producto": ""}']})
          },
        },
        {
          provide: TrazabilidadService,
          useValue: trazabilidadMock
        },
        {
          provide: NavController,
          useValue: NavMock
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
    fixture = TestBed.createComponent(CartolaCuatrimestralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error obtener Periodo', async() => {
    CertificadosServiceMock.obtenerPeriodosCartolaCuatrimestral.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.obtenerPeriodo();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener PDF', async() => {
    CertificadosServiceMock.obtenerPDF.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.obtenerPDF();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error enviar correo', async() => {
    const retornoPDF = {
      pdf_cartola_cuatrimestral: undefined
    }

    CertificadosServiceMock.enviarCorreoSolicitud.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.enviarEmailCartolaCuatrimestral(retornoPDF);
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza neutro', async () => {
    const spyTraza = jest.spyOn(trazabilidadMock, 'registraTrazaUUID')

    await component.registrarTrazabilidad(8205);
    
    expect(spyTraza).toHaveBeenCalled();
  });
});