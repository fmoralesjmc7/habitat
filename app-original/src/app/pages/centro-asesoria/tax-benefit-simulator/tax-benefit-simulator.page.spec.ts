import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { UtilCA } from 'src/app/util/ca-util';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { TaxBenefitSimulatorPage } from './tax-benefit-simulator.page';
import { TaxBenefitSimulatorService } from 'src/app/services/api/restful/centro_asesoria/tax-benefit-simulator/tax-benefit-simulator.service';
import { DataTaxBenefitSimulation } from 'src/app/interfaces/tax-benefit-simulation';
import { of } from 'rxjs';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { TrazabilidadService } from 'src/app/services';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('TaxBenefitSimulatorPage', () => {
  let component: TaxBenefitSimulatorPage;
  let fixture: ComponentFixture<TaxBenefitSimulatorPage>;
  let contextoApp: ContextoAPP;

  const dataSimulacion: DataTaxBenefitSimulation = {
    liquidIncome: 1,
    apvAmount: 1,
    gender: 1,
    age: 1,
    pensionAge: 1,
  }

  const TaxBenefitSimulatorServiceMock = {
    getTaxBenefitSimulation: jest.fn(() => Promise.resolve({ dataSimulacion }))
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
      declarations: [ TaxBenefitSimulatorPage ],
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
        ScreenOrientation,
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        { provide: TaxBenefitSimulatorService, useValue: TaxBenefitSimulatorServiceMock},
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

    fixture = TestBed.createComponent(TaxBenefitSimulatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test callService', async() => {   
    await component.callService();

    expect(component.headerElements.iconRight).toBe('btn-icon icon-menu-hamb');
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29695;
    parametroTraza.datos =  "Beneficios Step 1";
    parametroTraza.exito = 0
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion, parametroTraza.datos);
    expect(spyTraza).toHaveBeenCalled();
  });
});