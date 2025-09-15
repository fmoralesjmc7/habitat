import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController, NavParams } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TrazabilidadService, UtilService } from 'src/app/services';
import { ActualizarDatosService } from 'src/app/services/api/restful/actualizar-datos.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';

import { ActualizarDatosSmsPage } from './actualizar-datos-sms.page'

describe('ActualizarDatosSmsPage', () => {
  let component: ActualizarDatosSmsPage;
  let fixture: ComponentFixture<ActualizarDatosSmsPage>;
  let contextoApp: ContextoAPP;

  const ActualizarDatosServiceMock = {
    solicitudCodigoDinamicoSMS: jest.fn(()=>of({
      'respuestaEnvioSMS': undefined
    })),
    validarCodigoDinamicoSMS: jest.fn(()=>of({
      'consultaCodigoResponse': undefined
    })),
    enviarSolicitud: jest.fn(()=>of({
      'exito': false
    })),
    registraTrazaUUID: jest.fn(() => of())
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of())
  }

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule, RouterTestingModule],
      declarations: [ ActualizarDatosSmsPage ],
      providers: [
        ModalController,
        AngularDelegate,
        HttpClient,
        HttpHandler,
        AES256,
        FileOpener,
        UrlSerializer,
        {provide: NavParams, useClass: NavParamsMock},
        {
          provide: ActualizarDatosService,
          useValue: ActualizarDatosServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock
        },
        {
          provide: NavController,
          useValue: NavMock,
        }
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

    fixture = TestBed.createComponent(ActualizarDatosSmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cerrar modal al llamar ir a sucursales', () => {
    component.irSucursales();

    expect(component.modalIntentosSolicitudClave).toBeFalsy();
  });

  it('generar numero enmascarado', () => {
    component.telefonoCelular = '57703098'
    component.generarNumeroCelular();

    expect(component.numeroCelularFormateado).toBe('569 XXX XXX 98');
  });

  it('error controlado servicio obtener codigo sms', async() => {
    await component.solicitarSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error servicio obtener codigo sms', async() => {
    ActualizarDatosServiceMock.solicitudCodigoDinamicoSMS.mockReturnValue(throwError({ status: 500, error: {}}));
    
    await component.solicitarSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error controlado servicio validar codigo sms', async() => {
    await component.validarCodigoSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error servicio validar codigo sms', async() => {
    ActualizarDatosServiceMock.validarCodigoDinamicoSMS.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.validarCodigoSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error controlado Realizar Solicitud actualizacion', async() => {
    component.objetoActualizarDatos = '{"solicitud":{"modificaDatosLaborales":false}}';

    await component.realizarSolicitud();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error Realizar Solicitud actualizacion', async() => {
    ActualizarDatosServiceMock.enviarSolicitud.mockReturnValue(throwError({ status: 500, error: {}}));
    component.objetoActualizarDatos = '{"solicitud":{"modificaDatosLaborales":false}}';
    await component.realizarSolicitud();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID')
    component.registrarTrazabilidad(15370);
    expect(spyTraza).toHaveBeenCalled();
  });
});

export class NavParamsMock {
  static datosUsuario = {
    telefonoComercial: {
      numero_telefono: 123456
    },
    telefonoParticular: {
      numero_telefono: 123456
    },
    celularUsuario: {
      numero_telefono: 123456
    },
    correoParticular: {
      correo: ''
    },
    correoComercial: {
      correo: ''
    }
  };

  static listadoRegiones= [];
  static listadoComunas= [];
  static listadoCiudades= [];
  static listadoCodigosArea= [];
  static listadoNacionalidad= [];
  static listadoCargos= [];
  static listadoProfesiones= [];
  static listadoRangosRenta= [];
  static esModalDatosLaborales: true

  public get(key): any {
    if (NavParamsMock[key]) {
       return NavParamsMock[key]
    }
    return 'default';
  }
}