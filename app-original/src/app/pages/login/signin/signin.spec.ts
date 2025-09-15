import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NavController } from '@ionic/angular';
import { of, Subject, throwError } from 'rxjs';
import { ClienteService, SeguridadService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { CONSTANTES_TOAST_LOGIN, CONSTANTES_WHATSAPP } from '../util/login.constantes';
import { SigninPage } from './signin';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider } from 'angular-oauth2-oidc';
import { Store } from '@ngxs/store';
import { AppLauncher } from '@capacitor/app-launcher';

jest.mock('@capacitor/app-launcher', () => ({
  AppLauncher: {
    canOpenUrl: jest.fn(),
    openUrl: jest.fn(),
  },
}));

describe('SigninPage', () => {
  let component: SigninPage;
  let fixture: ComponentFixture<SigninPage>;
  let renderer2: Renderer2;



  const mockStore = {
    select: () => of({}),
    dispatch: () => of({})
  };

  const mockOAuthService = {
    configure: jest.fn(),
    loadDiscoveryDocumentAndTryLogin: jest.fn().mockResolvedValue(true),
    fetchTokenUsingPasswordFlowAndLoadUserProfile: jest.fn().mockResolvedValue({}), // Simula una respuesta exitosa
    getAccessToken: jest.fn().mockReturnValue('fake-access-token'),
    getAccessTokenExpiration: jest.fn().mockReturnValue(Date.now() + 3600 * 1000),
    events: new Subject(),
    tokenEndpoint: 'https://apiv2.dev.afphabitat.cl/oauth2/',
  };

  const clienteMock = {
    cliente : {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      email: '',
      rut: '',
      dv: '',
      apodo: '',
      sexo: '',
      fechaAfiliacion: '',
      fechaIncorporacion: '',
      idPersona: '',
      edad: '',
      esPensionado: '',
      telefonoCelular: '',
      totalBonosReconocimiento: 0
    }
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(()=>Promise.resolve({})),
    ocultarLoading: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    obtenerPWDSS: jest.fn(()=>Promise.resolve()),
    mostrarToastIconoConLink: jest.fn(),
    mostrarToastIcono: jest.fn(),
    getStorageData: jest.fn(() => Promise.resolve('si')),
    setStorageData: jest.fn(),
    resetPWDSS: jest.fn(() => Promise.resolve('si')),
    generarModeloDatosCliente: jest.fn(()=> clienteMock.cliente),
    registrarPWDSS: jest.fn(() => Promise.resolve('test'))
  }

  const FingerprintAIOMock = {
    show: jest.fn(()=>Promise.resolve({})),
    isAvailable: jest.fn(()=>Promise.resolve('face'))
  }

  const SeguridadServiceMock = {
    signIn: jest.fn(()=>of({codigo: 'S'})),
    upgradeApplication: jest.fn(()=>of({}))
  }

  const ClienteServiceMock = {
    obtenerDatosCliente: jest.fn(()=>of(clienteMock))
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({})),
    registraTraza: jest.fn(() => of({})),
  }

  const NavMock = {
    navigateBack: jest.fn(()=>of()),
    navigateForward: jest.fn(()=>of()),
    navigateRoot: jest.fn(()=>of()),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ SigninPage ],
      providers: [
        AES256,
        FileOpener,
        UrlSerializer,
        HttpClient,
        HttpHandler,
        FormBuilder,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        {
          provide: UtilService,
          useValue: UtilServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: FingerprintAIO,
          useValue: FingerprintAIOMock
        },
        {
          provide: SeguridadService,
          useValue: SeguridadServiceMock
        },
        {
          provide: ClienteService,
          useValue: ClienteServiceMock
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
          provide: Store,
          useValue: mockStore
        },
        {
          provide: OAuthService,
          useValue: mockOAuthService
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validar glosa ambiente', () => {
    expect(component.glosaAmbiente).toBe('(Dev)');
  });

  it('boton mostrar password', () => {
    component.togglePasswordMode();

    expect(component.tipoInput).toBe('text');
  });

  it('boton mostrar password', () => {
    component.tipoInput = 'text';
    component.togglePasswordMode();

    expect(component.tipoInput).toBe('password');
  });

  it('validar rut ok', () => {
    component.rutInput = '179771640';

    component.validarRut();

    expect(component.errorRut).toBeFalsy()
  });

  it('validar rut ok', () => {
    component.rutInput = '179771641';

    component.validarRut();

    expect(component.errorRut).toBeTruthy()
  });

  it('procesar error biometria', () => {
    component.procesarErrorBiometria('error');

    expect(component.huellaActiva).toBeFalsy();
    expect(component.loginHibrido).toBeTruthy();
    expect(component.ingresoClave).toBeFalsy();
  });

  it('procesar error biometria - error: retry limit exceeded', () => {
    component.procesarErrorBiometria('retry limit exceeded');

    expect(component.huellaActiva).toBeFalsy();
    expect(component.loginHibrido).toBeTruthy();
    expect(component.ingresoClave).toBeFalsy();
    expect(component.modalHuellaAppError).toBeTruthy();
  });

  it('procesar error biometria - error: locked out', () => {
    component.procesarErrorBiometria('locked out');

    expect(component.huellaActiva).toBeFalsy();
    expect(component.loginHibrido).toBeTruthy();
    expect(component.ingresoClave).toBeFalsy();
    expect(component.modalHuellaAppError).toBeFalsy();
  });

  it('registrar cliente huella', async() => {
    const spy = jest.spyOn(component, 'cambiarPagina');
    await component.registrarClienteHuella(clienteMock, undefined!);

    expect(spy).toHaveBeenCalled();
  });

  it('registrar cliente huella', () => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');
    const cliente = {cliente: null}

    component.registrarClienteHuella(cliente, undefined!);

    expect(spy).toHaveBeenCalled();
  });

  it('registrar cliente - login hibrido', async() => {
    const spy = jest.spyOn(component, 'cambiarPagina');

    component.loginHibrido = true;
    await component.registrarCliente(clienteMock, undefined!, 'si');

    expect(spy).toHaveBeenCalledWith('HomeClientePage');
  });

  it('registrar cliente - login no hibrido - activar huella', async() => {
    const spy = jest.spyOn(component, 'cambiarPagina');

    component.loginHibrido = false;
    await component.registrarCliente(clienteMock, undefined!, 'si');

    expect(spy).toHaveBeenLastCalledWith('ActivacionHuellaPage');
  });

  it('registrar cliente - login no hibrido - no activar huella', async() => {
    const spy = jest.spyOn(component, 'cambiarPagina');

    component.loginHibrido = false;
    await component.registrarCliente(clienteMock, undefined!, 'no');

    expect(spy).toHaveBeenLastCalledWith('HomeClientePage');
  });

  it('registrar cliente - login no hibrido - sin huella activada', async() => {
    const spy = jest.spyOn(ContextoAPPMock, 'ocultarLoading');

    FingerprintAIOMock.isAvailable.mockReturnValue(Promise.reject());
    component.loginHibrido = false;
    await component.registrarCliente(clienteMock, undefined!, 'no');

    expect(spy).toHaveBeenCalled();
  });

  it('modal mostrar huella - cliente logeado ok', async() => {
    const spy = jest.spyOn(NavMock, 'navigateRoot');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));

    await component.mostrarModalHuella('si', false);

    expect(spy).toHaveBeenCalledWith('HomeClientePage');
  });

  it('modal mostrar huella - cliente logeado ok', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(throwError({}));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));

    await component.mostrarModalHuella('si', false);

    expect(spy).toHaveBeenCalledWith(CONSTANTES_TOAST_LOGIN.TEXTO_ERROR_SERVICIO);
  });

  it('modal mostrar huella - cliente logeado ok - clave modificada', async() => {
    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));
    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'N'}));

    await component.mostrarModalHuella('si', false);

    expect(component.huellaActiva).toBeFalsy();
    expect(component.loginHibrido).toBeFalsy();
  });

  it('modal mostrar huella - cliente logeado ok - usuario bloqueado', async() => {
    const spy = jest.spyOn(ContextoAPPMock, 'ocultarLoading');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));
    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'B'}));

    await component.mostrarModalHuella('si', false);

    expect(spy).toHaveBeenCalled();
  });

  it('modal mostrar huella - cliente logeado ok - error no registrado', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));
    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'C'}));

    await component.mostrarModalHuella('si', false);

    expect(spy).toHaveBeenCalled();
  });

  it('modal mostrar huella - error servicio cliente', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));
    SeguridadServiceMock.signIn.mockReturnValue(throwError({}));

    await component.mostrarModalHuella('si', false);

    expect(spy).toHaveBeenCalled();
  });

  it('modal mostrar huella - error obtener datos', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.resolve({}));
    UtilServiceMock.obtenerPWDSS.mockReturnValue(Promise.reject());

    await component.mostrarModalHuella('si', false);

    expect(spy).toHaveBeenCalled();
  });

  it('modal mostrar huella - error huella', async() => {
    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    FingerprintAIOMock.show.mockReturnValue(Promise.reject({}));
    UtilServiceMock.obtenerPWDSS.mockReturnValue(Promise.reject());

    await component.mostrarModalHuella('si', false);

    expect(component.huellaActiva).toBeFalsy();
  });

  it('iniciar sesion - huella activada', async() => {
    const spy = jest.spyOn(component, 'mostrarModalHuella')
    component.ingresoClave = true;
    component.loginHibrido = false;
    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled()
  });

  it('iniciar sesion - login hibrido - error login', async() => {
    const spy = jest.spyOn(component, 'mostrarToastErrorServicioLogin')
    component.ingresoClave = true;
    component.loginHibrido = true;
    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled()
  });

  it('iniciar sesion - login hibrido - error login', async() => {
    const spy = jest.spyOn(ClienteServiceMock, 'obtenerDatosCliente');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(of(clienteMock));
    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'S'}));

    component.ingresoClave = true;
    component.loginHibrido = true;

    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled();
  });

  it('iniciar sesion - login hibrido - cliente bloqueado', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIconoConLink');

    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'B'}));

    component.ingresoClave = true;
    component.loginHibrido = true;

    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled();
  });

  it('iniciar sesion - login hibrido - cliente clave modificada', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');

    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'N'}));

    component.ingresoClave = true;
    component.loginHibrido = true;

    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled();
  });

  it('iniciar sesion - login hibrido - cliente error no identificado', async() => {
    const spy = jest.spyOn(component, 'mostrarToastErrorServicioLogin');

    SeguridadServiceMock.signIn.mockReturnValue(of({codigo: 'W'}));

    component.ingresoClave = true;
    component.loginHibrido = true;

    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled();
  });

  it('iniciar sesion - login hibrido - error datos cliente', async () => {
    const spy = jest.spyOn(component, 'mostrarToastErrorServicioLogin');

    ClienteServiceMock.obtenerDatosCliente.mockReturnValue(throwError({}));
    SeguridadServiceMock.signIn.mockReturnValue(throwError({}));
    mockOAuthService.fetchTokenUsingPasswordFlowAndLoadUserProfile.mockResolvedValue({});

    component.ingresoClave = true;
    component.loginHibrido = true;

    await component.iniciarSesion();

    expect(spy).toHaveBeenCalled();
  });

  it('input password focus', async() => {
    const spyRenderer = jest.spyOn(renderer2, 'addClass');

    component.focusElement();

    expect(spyRenderer).toHaveBeenCalled();
  });

  it('input password blur', async() => {
    const spyRenderer = jest.spyOn(renderer2, 'removeClass');

    component.blurElement();

    expect(component.margenTecladoLogin).toBeFalsy();
    expect(spyRenderer).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTraza')
    await component.registrarTrazabilidad(parametroTraza, 19400);

    expect(spyTraza).toHaveBeenCalled();
  });

  describe('Link traspaso whataspp:', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('Debe abrir WhatsApp si está instalado', async () => {
      (AppLauncher.openUrl as jest.Mock).mockResolvedValue(true);
  
      await component.abrirWhatsApp();
  
      expect(AppLauncher.openUrl).toHaveBeenCalledWith({
        url: expect.stringContaining(`https://wa.me/${CONSTANTES_WHATSAPP.WHATSAPP_NUMERO}`),
      });
      expect(UtilServiceMock.mostrarToastIcono).not.toHaveBeenCalled();
    });
  
    it('Al llamar a método abrirWhatsApp y falle, debe mostrar toast con mensaje de error', async () => {
      (AppLauncher.openUrl as jest.Mock).mockRejectedValue(new Error('Falla'));
  
      await component.abrirWhatsApp();
  
      expect(UtilServiceMock.mostrarToastIcono).toHaveBeenCalledWith('Ocurrió un error al abrir WhatsApp.');
    });
  });
});