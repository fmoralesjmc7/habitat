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
import { SimulatorStartPage } from './simulator-start.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { of } from 'rxjs';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { TrazabilidadService } from 'src/app/services';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('SimulatorStartPage', () => {
  let component: SimulatorStartPage;
  let fixture: ComponentFixture<SimulatorStartPage>;
  let contextoApp: ContextoAPP;

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule, RouterTestingModule.withRoutes([])],
      declarations: [ SimulatorStartPage ],
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

    fixture = TestBed.createComponent(SimulatorStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29640;
    parametroTraza.datos =  "Simulador Step 0";
    parametroTraza.exito = 0
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion);
    expect(spyTraza).toHaveBeenCalled();
  });
});