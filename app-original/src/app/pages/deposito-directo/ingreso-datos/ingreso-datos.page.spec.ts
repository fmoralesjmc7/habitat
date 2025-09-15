import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import {
  DepositoDirectoService,
  TrazabilidadService,
  UtilService
} from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { IngresoDatosPage } from './ingreso-datos.page';
import { CONSTANTES_TRAZAS_DEPOSITO } from '../util/constantes.deposito';

describe('IngresoDatosPage', () => {
  let component: IngresoDatosPage;
  let fixture: ComponentFixture<IngresoDatosPage>;
  let contextoApp: ContextoAPP;

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn(),
    generarObjetoTraza: jest.fn(() => parametroTraza)
  };

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  };

  const routerSpy = jest.fn();

  let parametroTraza: ParametroTraza = new ParametroTraza();

  const DepositoDirectoServiceMock = {
    obtenerParametros: jest.fn(() =>
      of({
        parametros: [
          {
            idParametro: 48,
            key: 'CMB_BOX_PAIS_ORIGEN',
            value: '01;Ingreso proveniente de mi(s) actividad(es)',
          }
        ]
      })
    ),
    obtenerBancos: jest.fn(() =>
      of({
        banks: [
          {
            bank_id: 'Bawdf',
            name: 'DemoBank',
            message:
              'Este es un banco de pruebas. Las transacciones no son reales.',
            min_amount: '200.0000',
            type: 'Persona',
            parent: ''
          },
        ],
      })
    )
  };

  const UtilServiceMock = {
    mostrarToastConLink: jest.fn(() => of({})),
    mostrarToast: jest.fn(() => of({})),
    setStorageData: jest.fn(() => of({})),
    generarUuid: jest.fn(() => of('1q2w3e'))
  };

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IngresoDatosPage],
      providers: [
        UrlSerializer,
        HttpClient,
        HttpHandler,
        AES256,
        FileOpener,
        ContextoAPP,
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: DepositoDirectoService,
          useValue: DepositoDirectoServiceMock
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
          provide: Router,
          useValue: routerSpy
        },
        AppAvailability
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

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
    };

    contextoApp.datosCliente = new DatosUsuario(cliente);

    fixture = TestBed.createComponent(IngresoDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debería definir variable depDir con email de contextoAPP', () => {
    const email = 'test@afp.cl';
    contextoApp.datosCliente.email = email;
    component.ngOnInit();

    expect(component.depDir.email).toBe(email);
  });

  it('debería navegar a la página de error si carga de datos falla', fakeAsync(() => {
    jest.spyOn(component, 'loadListaBancos').mockResolvedValue(false);

    component.ionViewDidEnter();
    tick();
  }));

  it('Debería cargar la lista de bancos correctamente', fakeAsync(() => {
    const result = component.loadListaBancos();
    tick();

    expect(result).resolves.toEqual(true);
    expect(component.listaBancos.length).toBe(1);
    expect(component.listaBancos[0].name).toBe('DemoBank');
  }));

  it('Debería definir ctaSeleted a APV y llamar a método registraTrazaUUID con los datos de deposito APV', fakeAsync(() => {
    component.rut = 12323232;
    component.dv = '1';
    const paramsRegistraTraza = {
      canal: 'APPMOBILE',
      codigoOperacion: 23231,
      codigoSistema: 102,
      datos: 'Dep Directo APV Step 1A',
      dvRut: '1',
      exito: 0,
      modulo: 'ABONO WEB',
      rut: 12323232,
      sucursal: 98,
      url: '',
      usuario: 'INTERNET',
      uuid: '1q2w3e',
    };

    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');

    jest.spyOn(contextoApp, 'generarObjetoTraza').mockReturnValue({
      usuario: CONSTANTES_TRAZAS_DEPOSITO.USUARIO,
      rut: 12323232,
      dvRut: '1',
      sucursal: CONSTANTES_TRAZAS_DEPOSITO.SUCURSAL,
      canal: CONSTANTES_TRAZAS_DEPOSITO.CANAL,
      codigoSistema: CONSTANTES_TRAZAS_DEPOSITO.CODIGO_SISTEMA,
      uuid: '1q2w3e',
      url: '',
      codigoOperacion:
        CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_APV.CODIGO_OPERACION,
      exito: CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_APV.EXITO,
      modulo: CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_APV.MODULO,
      datos: CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_APV.DATOS,
    });

    component.seleccionCta('APV');
    tick();

    expect(component.ctaSeleted).toBe('APV');
    expect(spyTraza).toHaveBeenCalledWith(paramsRegistraTraza, 12323232, '1');
  }));

  it('Selecciona cuenta CAV sin aperturar, debe mostrar toast con mensaje sin apertura cuenta 2 y llamar a método registraTrazaUUID con los datos de deposito CAV', fakeAsync(() => {
    component.rut = 12323232;
    component.dv = '1';

    const paramsRegistraTraza = {
      canal: 'APPMOBILE',
      codigoOperacion: 23225,
      codigoSistema: 102,
      datos: 'Dep Directo C2 Step 1A',
      dvRut: '1',
      exito: 0,
      modulo: 'ABONO WEB',
      rut: 12323232,
      sucursal: 98,
      url: '',
      usuario: 'INTERNET',
      uuid: '1q2w3e',
    };

    const spyUtil = jest.spyOn(UtilServiceMock, 'mostrarToastConLink');
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');
    jest.spyOn(contextoApp, 'generarObjetoTraza').mockReturnValue({
      usuario: CONSTANTES_TRAZAS_DEPOSITO.USUARIO,
      rut: 12323232,
      dvRut: '1',
      sucursal: CONSTANTES_TRAZAS_DEPOSITO.SUCURSAL,
      canal: CONSTANTES_TRAZAS_DEPOSITO.CANAL,
      codigoSistema: CONSTANTES_TRAZAS_DEPOSITO.CODIGO_SISTEMA,
      uuid: '1q2w3e',
      url: '',
      codigoOperacion:
        CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_CAV.CODIGO_OPERACION,
      exito: CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_CAV.EXITO,
      modulo: CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_CAV.MODULO,
      datos: CONSTANTES_TRAZAS_DEPOSITO.SELECCIONAR_CUENTA_CAV.DATOS,
    });

    component.seleccionCta('CAV');
    tick();

    expect(spyUtil).toHaveBeenCalledWith(
      component.msgCta2NoAperturada,
      component.urlAperturaCAV
    );
    expect(spyTraza).toHaveBeenCalledWith(paramsRegistraTraza, 12323232, '1');
  }));

  it('Debería definir ctaSeleted a CAV', fakeAsync(() => {
    component.rut = 12323232;
    component.dv = '1';
    component.productosCliente = [
      { codigoProducto: 'CAV' },
      { codigoProducto: 'APV' },
    ];

    component.seleccionCta('CAV');
    tick();

    expect(component.ctaSeleted).toBe('CAV');
  }));

  it('volver al home', () => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    component.volverAlHome();

    expect(spyMock).toHaveBeenCalled();
  });

  it('registrar traza  - exito', fakeAsync(() => {
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');

    component.registrarTrazabilidad();
    tick();
    expect(spyTraza).toHaveBeenCalled();
  }));

  it('registrar traza  - Kiphu', fakeAsync(() => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spy = jest.spyOn(ContextoAPPMock, 'registrarTrazabilidad');
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');

    component.registrarTrazabilidadExitoKiphu();
    ContextoAPPMock.registrarTrazabilidad(parametroTraza);
    tick();

    expect(spyTraza).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  }));

  it('registrar traza  - Kiphu error', fakeAsync(() => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.datos = '';
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');

    component.registrarTrazabilidadErrorKiphu('500');
    ContextoAPPMock.registrarTrazabilidad(parametroTraza);
    tick();

    expect(spyTraza).toHaveBeenCalled();
  }));

  it('retorna objeto general de traza', () => {
    expect(component.datosGeneralasTrazas()).toBeDefined();
  });
});
