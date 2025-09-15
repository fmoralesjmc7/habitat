import { DatePipe } from '@angular/common';
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
import { ClienteService, TrazabilidadService } from 'src/app/services';
import { CertificadosService } from 'src/app/services/api/restful/certificados.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { CertificadoDetallePage } from './certificado-detalle.page';


describe('CertificadoDetallePage', () => {
  let component: CertificadoDetallePage;
  let fixture: ComponentFixture<CertificadoDetallePage>;
  let contextoApp: ContextoAPP;

  const CertificadosServiceMock = {
    obtenerPDFCartolas: jest.fn(() => of()),
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    reemplazarTildesTexto: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of(false))
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const ClienteServiceMock = {
    solicitarCertificadoIos: jest.fn(() => of(undefined)),
    solicitarCertificadoAndroid: jest.fn(() => of(undefined))
  }

  const routerSpy = jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CertificadoDetallePage],
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
            queryParams: of({ listaTipoCuenta: ['{"nombreCortoProducto" : "123", "producto": ""}'], certificado: '{}' })
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
      correoElectronico: '',
      rut: 0,
      digitoVerificadorRut: '',
      sexo: '',
      fechaAfiliacion: '',
      fechaIncorporacion: '',
      idMaePersona: '',
      edad: '',
      esPensionado: '',
      telefonoCelular: '',
      saldoSimulacion: '',
      rentaImponible: ''
    }
    contextoApp.datosCliente = new DatosUsuario(cliente);
    fixture = TestBed.createComponent(CertificadoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error obtener pdf Certificado IOS', async () => {
    ClienteServiceMock.solicitarCertificadoIos.mockReturnValue(throwError({ status: 500, error: {} }));

    await component.solicitarCertificado();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener pdf certificado Android', async () => {
    ClienteServiceMock.solicitarCertificadoAndroid.mockReturnValue(throwError({ status: 500, error: {} }));

    await component.solicitarCertificado();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {

    component.certificado['codigoTipoCertificado'] = 'TCR-SLCT'
    component.CONSTANTES.CERTIFICADO_SALDOS.codigoTipoCertificado = 'TCR-SLCT';
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');
    await component.registrarTrazabilidad('INI');
    expect(spyTraza).toHaveBeenCalled();

  });
});
