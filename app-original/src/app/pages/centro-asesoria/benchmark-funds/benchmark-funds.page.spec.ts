import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController, NavParams } from '@ionic/angular';
import { of } from 'rxjs';
import { ProfitabilityServiceData } from 'src/app/interfaces/profitability-service-data';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { ProfitabilityService } from 'src/app/services/api/restful/centro_asesoria/profitability/profitability.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { BenchmarkFundsPage } from './benchmark-funds.page';
import { TrazabilidadService } from 'src/app/services';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('BenchmarkFundsPage', () => {
  let component: BenchmarkFundsPage;
  let fixture: ComponentFixture<BenchmarkFundsPage>;
  let contextoApp: ContextoAPP;

  const dataSimulacion: ProfitabilityServiceData = {
    amount: 11111,
    pensionFund: '',
    period: 11,
  }

  const ProfitabilityServiceMock = {
    fundsHabitat: jest.fn(() => Promise.resolve({ dataSimulacion }))
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule, RouterTestingModule.withRoutes([])],
      declarations: [ BenchmarkFundsPage ],
      providers: [
        ModalController,
        AngularDelegate,
        HttpClient,
        HttpHandler,
        AES256,
        FileOpener,
        UrlSerializer,
        HttpClientUtil,
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {provide: ProfitabilityService, useValue: ProfitabilityServiceMock},
        AppAvailability,
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

    fixture = TestBed.createComponent(BenchmarkFundsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test callService', async() => {
    const spyCallService = jest.spyOn(ProfitabilityServiceMock, 'fundsHabitat');
    
    await component.callService();

    expect(spyCallService).toHaveBeenCalled();
    expect(component.headerElements.iconRight).toBe('btn-icon icon-menu-hamb');
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29761;
    parametroTraza.datos =  "Rentabilidad Paso 1 Inicio Ingreso Monto";
    parametroTraza.exito = 0
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion);
    expect(spyTraza).toHaveBeenCalled();
  });
});