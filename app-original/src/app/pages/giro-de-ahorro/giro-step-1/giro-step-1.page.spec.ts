import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ClienteService, GiroService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { FondoRegimenGiro } from '../util/fondo.regimen.giro';
import { GiroStepUnoPage } from './giro-step-1.page';
import { RegimenGiro } from '../util/regimen.giro';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { CONSTANTES_GIRO_STEP_1 } from '../util/constantes.giro';

describe('GiroStepUnoPage', () => {
  let component: GiroStepUnoPage;
  let fixture: ComponentFixture<GiroStepUnoPage>;
  let renderer2: Renderer2;
  let contextoApp: ContextoAPP;

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(()=> Promise.resolve()),
    ocultarLoading: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const ClienteServiceMock = {
    administrarClavePrevired: jest.fn(()=>of()),
    obtenerDatosClienteGiro: jest.fn(() => of({})),
  }
  const UtilServiceMock = {
    generarUuid: jest.fn(()=> of()),
    setLogEvent: jest.fn(()=> of()),
    generarModeloDatosCliente: jest.fn(()=> of()),
    generarNavegacionExtra: jest.fn(()=> of()),
    mostrarToast: jest.fn(()=> of()),
    mostrarToastConLink: jest.fn(()=> of()),
    openWithSystemBrowser: jest.fn(()=> of()),
  }

  const GiroServiceMock = {
    validarGiro: jest.fn(() => of()),
    obtenerComisionGiro: jest.fn(() => of({
      MontoPesos: null
    }))
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiroStepUnoPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({option: '1'})
          },
        },
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: ClienteService,
          useValue: ClienteServiceMock
        },
        {
          provide: GiroService,
          useValue: GiroServiceMock
        },
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock
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

    fixture = TestBed.createComponent(GiroStepUnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('obtención uuid', () => {
    expect(component.uuid).toBeDefined();
  });

  it('cambio tamaño cuando se abre el teclado', () => {
    const spyRenderer = jest.spyOn(renderer2, 'setStyle');

    const mockElementRef: any = {
      nativeElement: {
        style: {
          'margin-bottom': '100px'
        }
      }
    };

    component.btnRegimen = mockElementRef;
    component.resizeModalRegimen('200px');
    expect(spyRenderer).toHaveBeenCalled();
    expect(component.btnRegimen.nativeElement.style['margin-bottom']).toBe('200px');
  });

  it('obtención uuid', () => {
    expect(component.uuid).toBeDefined();
  });

  it('metodo error generico', async() => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    await component.desplegarErrorDatosClientes();
    
    expect(spyMock).toHaveBeenCalled();
  });

  it('metodo error generico', async() => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    await component.desplegarErrorDatosClientes();
    
    expect(spyMock).toHaveBeenCalled();
  });

  it('validar giro', async() => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');
    const spyLoading = jest.spyOn(ContextoAPPMock, 'ocultarLoading');

    await component.validarGiro('1', undefined);

    expect(spyMock).toHaveBeenCalled();
    expect(spyLoading).toHaveBeenCalled();
  });

  it('validar giro', async() => {
    GiroServiceMock.validarGiro.mockReturnValue(throwError({ status: 500, error: {}}));

    const spyMock = jest.spyOn(NavMock, 'navigateRoot');
    const spyLoading = jest.spyOn(ContextoAPPMock, 'ocultarLoading');

    await component.validarGiro('1', undefined);

    expect(spyMock).toHaveBeenCalled();
    expect(spyLoading).toHaveBeenCalled();
  });

  it('error obtener Comision Giro', async() => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    const fondo = new FondoRegimenGiro();
    fondo.montoGirar = '100';

    component.regimenSeleccionado = new RegimenGiro();
    component.regimenSeleccionado.idTipoRegimenTributario = '1';

    component.productoSeleccionado = {
      idProducto: 1
    };

    await component.calcularComisionGiro(fondo);

    expect(spyMock).toHaveBeenCalled();
  });

  it('error obtener Comision Giro', async() => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    const fondo = new FondoRegimenGiro();
    fondo.montoGirar = '100';

    component.regimenSeleccionado = new RegimenGiro();
    component.regimenSeleccionado.idTipoRegimenTributario = '1';

    component.productoSeleccionado = {
      idProducto: 1
    };

    GiroServiceMock.obtenerComisionGiro.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.calcularComisionGiro(fondo);

    expect(spyMock).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {

    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    
    await component.registrarTrazabilidad(2200);
    expect(spyTraza).toHaveBeenCalled();
  });

  it('debe procesar correctamente cliente APV sin errores', () => {
    const response = {
      cliente: { totalBonosReconocimiento: 1000 },
      cuentaCCICVErrorSaldoCDF: { nombreCortoErrorSaldoCdf: '0' },
      productos: [],
      ejecutivo: {}
    };
    ClienteServiceMock.obtenerDatosClienteGiro.mockReturnValue(of(response));

    const spyActualizarDatosCliente = jest.spyOn(component, 'actualizarDatosCliente');
    const spyCrearListadoRegimenes = jest.spyOn(component, 'crearListadoRegimenes');
    const spyValidarGiro = jest.spyOn(component, 'validarGiro');

    component.obtenerDatosCliente('APV', 'loading');

    expect(UtilServiceMock.generarModeloDatosCliente).toHaveBeenCalledWith(response.cliente);
    expect(spyActualizarDatosCliente).toHaveBeenCalled();
    expect(spyCrearListadoRegimenes).toHaveBeenCalled();
    expect(spyValidarGiro).toHaveBeenCalledWith('APV', 'loading');
  });

  it('debe mostrar modal de error si hay error -1011 en APV', () => {
    const spyMostrarModalError = jest.spyOn((component as any), 'mostrarModalError');
    const response = {
      cliente: {},
      cuentaCCICVErrorSaldoCDF: { nombreCortoErrorSaldoCdf: '-1011' }
    };
    ClienteServiceMock.obtenerDatosClienteGiro.mockReturnValue(of(response));

    component.obtenerDatosCliente('APV', 'loading');

    expect(spyMostrarModalError).toHaveBeenCalledWith('APV', '-1011');
  });

  it('debe procesar correctamente cliente Cuenta 2 sin errores', () => {
    const response = {
      cliente: { totalBonosReconocimiento: 1000 },
      cuentaCAVErrorSaldoCDF: { nombreCortoErrorSaldoCdf: '0' },
      productos: [],
      ejecutivo: {}
    };

    ClienteServiceMock.obtenerDatosClienteGiro.mockReturnValue(of(response));

    const spyActualizarDatosCliente = jest.spyOn(component, 'actualizarDatosCliente');
    const spyCrearListadoRegimenes = jest.spyOn(component, 'crearListadoRegimenes');
    const spyValidarGiro = jest.spyOn(component, 'validarGiro');

    component.obtenerDatosCliente('Cuenta2', 'loading');

    expect(ContextoAPPMock.ocultarLoading).toHaveBeenCalledWith('loading');
    expect(UtilServiceMock.generarModeloDatosCliente).toHaveBeenCalledWith(response.cliente);
    expect(spyActualizarDatosCliente).toHaveBeenCalled();
    expect(spyCrearListadoRegimenes).toHaveBeenCalled();
    expect(spyValidarGiro).toHaveBeenCalledWith('Cuenta2', 'loading');
  });

  it('debe mostrar modal de error si hay error -1005 en Cuenta 2', () => {
    const spyMostrarModalError = jest.spyOn((component as any), 'mostrarModalError');
    const response = {
      cliente: {},
      cuentaCAVErrorSaldoCDF: { nombreCortoErrorSaldoCdf: '-1005' }
    };

    ClienteServiceMock.obtenerDatosClienteGiro.mockReturnValue(of(response));

    component.obtenerDatosCliente('Cuenta2', 'loading');

    expect(spyMostrarModalError).toHaveBeenCalledWith('Cuenta2', '-1005');
  });

  it('debe desplegar error si cliente es null', () => {
    const spyDesplegarErrorDatosClientes = jest.spyOn((component as any), 'desplegarErrorDatosClientes');

    const response = {
      cliente: null
    };

    ClienteServiceMock.obtenerDatosClienteGiro.mockReturnValue(of(response));
    component.obtenerDatosCliente('APV', 'loading');

    expect(spyDesplegarErrorDatosClientes).toHaveBeenCalled();
  });

  it('debe desplegar error en caso de excepción', () => {
    const spyDesplegarErrorDatosClientes = jest.spyOn((component as any), 'desplegarErrorDatosClientes');
    ClienteServiceMock.obtenerDatosClienteGiro.mockReturnValue(throwError(() => new Error('error')));
    component.obtenerDatosCliente('Cuenta2', 'loading');

    expect(ContextoAPPMock.ocultarLoading).toHaveBeenCalledWith('loading');
    expect(spyDesplegarErrorDatosClientes).toHaveBeenCalled();
  });

  it('no debe hacer nada si tipoCuenta es inválido', () => {
    jest.clearAllMocks();
    const tipoInvalido = 'Invalido';

    component.obtenerDatosCliente(tipoInvalido, 'loading');
    expect(ClienteServiceMock.obtenerDatosClienteGiro).not.toHaveBeenCalled();
  });

  it('debe continuar con la validación si ValidacionGiros es OK', () => {
    const spyContinuarValidacionSinSaldoGiro = jest.spyOn(component as any, 'continuarValidacionSinSaldoGiro')
    const response = { 
      ValidacionGiros: { cod: '200' }, 
      'Context-Error': {
        cod: null
    }};
    GiroServiceMock.validarGiro.mockReturnValue(of(response));
  
    component.validarGiro('APV', 'loading');
  
    expect(spyContinuarValidacionSinSaldoGiro).toHaveBeenCalled();
  });

  it('debe mostrar modal de saldos discordantes si se recibe ese código', () => {
    const response = { 'Context-Error': { cod: '004' } };
    GiroServiceMock.validarGiro.mockReturnValue(of(response));
    const spyOcultarListadoRegimenes = jest.spyOn(component, 'ocultarListadoRegimenes');
    component.validarGiro('APV', 'loading');
  
    expect(spyOcultarListadoRegimenes).toHaveBeenCalled();
    expect(component.modalValidacionSaldoDiscordante).toBe(true);
  });

  it('debe mostrar toast de apertura de cuenta 2 si cliente no la tiene', () => {
    const response = { "Context-Error": { cod: '001' } };
    GiroServiceMock.validarGiro.mockReturnValue(of(response));
  
    component.validarGiro('Cuenta2', 'loading');
  
    expect(UtilServiceMock.mostrarToastConLink).toHaveBeenCalledWith(
      CONSTANTES_GIRO_STEP_1.MENSAJE_CTA_2_APERTURADA,
      CONSTANTES_GIRO_STEP_1.URL_APERTURA_CUENTA_2
    );
  });

  it('debe continuar validación si hay régimen COVID y supera 24 giros', () => {
    const spyContinuarValidacionSinSaldoGiro = jest.spyOn(component as any, 'continuarValidacionSinSaldoGiro');
    const response = { "Context-Error": { cod: '002' } };
    component.existeRegimenCOVID24Giros = jest.fn(() => true);
    GiroServiceMock.validarGiro.mockReturnValue(of(response));
  
    component.validarGiro('Cuenta2', 'loading');
  
    expect(spyContinuarValidacionSinSaldoGiro).toHaveBeenCalled();
  });


  it('debe redirigir a error genérico si hay un error en el observable', () => {
    jest.clearAllMocks();
    const spyOcultarListadoRegimenes = jest.spyOn((component as any).navCtrl, 'navigateRoot');
    GiroServiceMock.validarGiro.mockReturnValue(throwError(() => new Error('Falló')));
  
    component.validarGiro('Cuenta 2', 'loading');
  
    expect(spyOcultarListadoRegimenes).toHaveBeenCalled();
  });
  
  it('debe salir si productoSeleccionado es undefined', () => {
    jest.spyOn(component, 'obtenerJSONTipoProducto').mockReturnValue(undefined);

    component.crearListadoRegimenes();

    expect(component.listadoRegimenes).toEqual([]);
  });

  it('debe salir si productoSeleccionado no tiene fondos', () => {
    jest.spyOn(component, 'obtenerJSONTipoProducto').mockReturnValue({});

    component.crearListadoRegimenes();

    expect(component.listadoRegimenes).toEqual([]);
  });

  it('debe agregar un nuevo régimen si no existe y no es régimen antiguo', () => {
    const mockFondo = {
      idCuenta: 123,
      nombreFondo: 'Fondo Uno',
      valorCuota: 100,
      regimenes: [
        { idTipoRegimenTributario: '5' }
      ]
    };

    jest.spyOn(component, 'obtenerJSONTipoProducto').mockReturnValue({ fondos: [mockFondo] });
    jest.spyOn(component, 'obtenerRegimenExistente').mockReturnValue(null);
    const spyCrear = jest.spyOn(component, 'crearRegimenGiro');

    component.crearListadoRegimenes();

    expect(spyCrear).toHaveBeenCalledWith(mockFondo.regimenes[0], mockFondo);
  });

  it('debe agregar fondo a régimen existente si ya existe y no es régimen antiguo', () => {
    jest.clearAllMocks();
    const mockRegimen = new RegimenGiro();
    mockRegimen.sumarMontoSaldoTotal = jest.fn();

    const mockFondo = {
      idCuenta: 123,
      nombreFondo: 'Fondo Uno',
      valorCuota: 100,
      regimenes: [
        { idTipoRegimenTributario: '5' }
      ]
    };
    jest.spyOn(component, 'obtenerJSONTipoProducto').mockReturnValue({ fondos: [mockFondo] });
    jest.spyOn(component, 'obtenerRegimenExistente').mockReturnValue(mockRegimen);
    const spyAgregar = jest.spyOn(component, 'agregarFondoRegimenExistente');

    component.crearListadoRegimenes();

    expect(spyAgregar).toHaveBeenCalled();
  });

});