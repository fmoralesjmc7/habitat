import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { UtilCA } from 'src/app/util/ca-util';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { SimulatorPage } from './simulator.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { TrazabilidadService } from 'src/app/services';
import { of, throwError } from 'rxjs';
import { DataIndivideo } from 'src/app/interfaces/dataIndivideo';
import { SendMailService } from 'src/app/services/api/restful/centro_asesoria/send-mail/send-mail.service';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('SimulatorPage', () => {
  let component: SimulatorPage;
  let fixture: ComponentFixture<SimulatorPage>;
  let contextoApp: ContextoAPP;

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of())
  }

  const SendMailServiceMock = {
    sendMail: jest.fn(() => Promise.reject({})),
    registerSimulation: jest.fn()
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn(),
    reemplazarTildesTexto: jest.fn()
  }

  const routerSpy =  jest.fn();
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ SimulatorPage ],
      providers: [
        ModalController,
        AngularDelegate,
        HttpClient,
        HttpHandler,
        AES256,
        FileOpener,
        UrlSerializer,
        HttpClientUtil,
        UtilCA,
        FormBuilder,
        ScreenOrientation,
        {
          provide: NavController,
          useClass: NavMock,
        },
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: SendMailService,
          useValue: SendMailServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: Router, useValue: routerSpy
        },
        AppAvailability
      ]
    })
    .compileComponents();

    contextoApp = TestBed.inject(ContextoAPP);
  });

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

    fixture = TestBed.createComponent(SimulatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test callService', async () => {   
    await component.callService()

    expect(component.headerElements.iconRight).toBe('btn-icon icon-menu-hamb');
  });

  it('test pantalla de error generico', async() => {
    const spyTraza = jest.spyOn(component, 'registrarTrazabilidad');
    component.videoData = {
      edad: 60,
      sexo: 'f',
      ingresoBrutoMensual: 1000000,
      saldoActualEnAhorro: 100000000,
      densidad: 1,
      pensionEstimada: 1,
      pensionEstimada12Meses: 120000,
      pensionEstimada12MesesAnosExtra: 12000,
      mejorarPension: true,
      metaPension: 1,
      pensionMaximaSolidaria: 1,
      idCliente12Meses: 1,
      idCliente12MesesAnosExtra: 1,
      ahorroMaximaAPV: 1,
      programmedRetirement: true,
      retirementFactor: 1,
      email: 'test@test.cl'
    } as DataIndivideo;

    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateForward');

    await component.sendEmail();

    expect(spyTraza).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29645;
    parametroTraza.datos =  "Simulador Step 2";
    parametroTraza.exito = 0
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion, parametroTraza.datos);
    expect(spyTraza).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}
