import { DatePipe } from '@angular/common';
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
import { CertificadoHomePage } from './certificado-home.page';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { Certificado } from 'src/app/services/api/data/certificado'; 
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('CertificadoHomePage', () => {
  let component: CertificadoHomePage;
  let fixture: ComponentFixture<CertificadoHomePage>;
  let contextoApp: ContextoAPP;
  const listadoCeriticados= [{}];
  const routerSpy =  jest.fn();

  const CertificadosServiceMock = {
    obtenerPDFCartolas: jest.fn(()=>of()),
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    reemplazarTildesTexto: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const ClienteServiceMock = {
    solicitarCertificado: jest.fn(() => of(undefined))
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoHomePage ],
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
            queryParams: of({listaTipoCuenta : ['{"nombreCortoProducto" : "123", "producto": ""}'], certificado: '{}'})
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
    fixture = TestBed.createComponent(CertificadoHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('volver al home', async () => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    component.volverAlHome();
    
    expect(spyMock).toHaveBeenCalled();
  });
  
  it('registrar traza  - exito', async () => {

    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    
    await component.registrarTrazabilidad('INI', component.CONSTANTES.CERTIFICADO_VACACIONES);

    expect(spyTraza).toHaveBeenCalled();

  });

  it('registrar traza neutro', async () => {
    const spy = jest.spyOn(component, 'registrarTrazabilidadCartolas');

    await component.registrarTrazabilidadCartolas(25150);
    
    expect(spy).toHaveBeenCalled();
  });

  it('asignar certificados', async () => {
    let certificados: Certificado = new Certificado();
    component.asignarCertificados();

    expect(component.listaTipoCertificado.length).toBe(10);
  });

  it('asigna valores generales', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();

    await component.asignarValoresTraza('INI', parametroTraza);
  });

  it('asigna valores generales', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(ContextoAPPMock, 'generarObjetoTraza')
    await component.asignarValoresTraza('INI', parametroTraza);

    expect(spyTraza).toHaveBeenCalled();
  });
});
