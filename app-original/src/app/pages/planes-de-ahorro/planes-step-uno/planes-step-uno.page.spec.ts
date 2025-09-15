import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { FormatoCapitalize } from 'src/app/pipes/formato-capitalize.pipe';
import { ClienteCuentasDatos, PlanesService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { PlanesStepUnoPage } from './planes-step-uno.page';
import { CONSTANTES_PLANES_STEP_1, CONSTANTES_TRAZAS_PLAN } from '../util/constantes.planes';

describe('PlanesStepUnoPage', () => {
  let component: PlanesStepUnoPage;
  let fixture: ComponentFixture<PlanesStepUnoPage>;
  let contextoApp: ContextoAPP;

  const PlanesServiceMock ={
    obtenerRegiones: jest.fn(()=>of([])),
    obtenerComunas: jest.fn(()=>of([])),
    obtenerEmpleadores: jest.fn(()=>of([])),
    obtenerSolicitudesAPV: jest.fn(()=>of({solicitudes_activadas: {}})),
    obtenerSolicitudesCAV: jest.fn(()=>of({solicitudes_activadas: {}})),
    obtenerTopesImponibles: jest.fn(()=>of()),
    obtenerCargos: jest.fn(()=>of([])),
    obtenerFondos: jest.fn(()=>of()),
    obtenerRegimenes: jest.fn(()=>of([])),
    obtenerMoneda: jest.fn(()=>of([]))
  }
  const ClienteCuentasDatosMock = {
    productosCliente: {
      value: []
    }
  };

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const mockRegistrarTrazabilidad = jest.fn();

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of())
  }

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    generarUuid: jest.fn(()=>'test')
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanesStepUnoPage, FormatoCapitalize ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: PlanesService,
          useValue: PlanesServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: ClienteCuentasDatos,
          useValue: ClienteCuentasDatosMock
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

    fixture = TestBed.createComponent(PlanesStepUnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validarTipoCuenta de tipo Cuenta2', () => {    
    it('Debe llamar a método mostrarToast si el usuario no tiene cuentas', async () => {
      component.idTipoProducto = 1;
      await component.validarTipoCuenta('Cuenta2');
      expect(UtilServiceMock.mostrarToast).toHaveBeenCalledWith(CONSTANTES_PLANES_STEP_1.TEXTO_ERROR_CUENTA_OBLIGATORIA);
      expect(component.productoAnterior).toBe(1);
      expect(component.idTipoProducto).toBe(1);
    });
  
    it('Debe registrar traza si NO tiene Cuenta2', async () => {
      const spyRegistrarTrazabilidad = jest.spyOn(component, 'registrarTrazabilidad');
      (component as any).clienteCuentasDatos = {
        productosCliente: {
          value: [
            { idProducto: CONSTANTES_PLANES_STEP_1.ID_PRODUCTO_CUENTA_OBLIGATORIA }
          ]
        }
      };

      await component.validarTipoCuenta('Cuenta2');
      expect(spyRegistrarTrazabilidad).toHaveBeenCalledWith(CONSTANTES_TRAZAS_PLAN.STEP1.COD_C2_STEP_1_INICIO.CODIGO_OPERACION);
    });
  
    it('Debe llamar a método mostrarToast si TIENE cuenta2 y NO tiene cuenta obligatoria NI CCIAV', async () => {
      // Cuentas
      (component as any).clienteCuentasDatos = {
        productosCliente: {
          value: [
            { idProducto: CONSTANTES_PLANES_STEP_1.ID_PRODUCTO_CUENTA_2, fondos: [] }          ]
        }
      };

      await component.validarTipoCuenta('Cuenta2');
      expect(UtilServiceMock.mostrarToast).toHaveBeenCalledWith(CONSTANTES_PLANES_STEP_1.TEXTO_ERROR_CUENTA_OBLIGATORIA);
    });
  
    it('Debe llamar a método asignarFondo si tiene Cuenta2, cuenta Obligatoria y fondo recaudador', async () => {
      const spyAsignarFondo = jest.spyOn(component as any, 'asignarFondo');
      // Cuentas
      (component as any).clienteCuentasDatos = {
        productosCliente: {
          value: [
            {
              idProducto: CONSTANTES_PLANES_STEP_1.ID_PRODUCTO_CUENTA_2,
              fondos: [{ esRecaudadorActual: true, idFondo: '123', nombreFondo: 'Fondo A' }]
            },
            { idProducto: CONSTANTES_PLANES_STEP_1.ID_PRODUCTO_CUENTA_OBLIGATORIA }        
          ]
        }
      };

      await component.validarTipoCuenta('Cuenta2');
      expect(spyAsignarFondo).toHaveBeenCalledWith(expect.objectContaining({ esRecaudadorActual: true }));
    });
  });

  describe('validarTipoCuenta de tipo APV', () => {
    it('Debe llamar a método mostrarToast si el usuario es MENOR de edad', async () => {
      component.idTipoProducto = 2;
      component.edad = 15;
      await component.validarTipoCuenta('APV');

      expect(UtilServiceMock.mostrarToast).toHaveBeenCalledWith(CONSTANTES_PLANES_STEP_1.TEXTO_ERROR_MENOR_DE_EDAD);
      expect(component.productoAnterior).toBe(2);
      expect(component.idTipoProducto).toBe(2);
    });
  
    it('Debe registrar traza si usuario cumple con edad y tiene APV', async () => {
      component.edad = 18;
      const spyAsignarFondo = jest.spyOn(component as any, 'asignarFondo');
      const spyRegistrarTrazabilidad = jest.spyOn(component, 'registrarTrazabilidad');
      // Cuentas
      (component as any).clienteCuentasDatos = {
        productosCliente: {
          value: [
            {
              idProducto: CONSTANTES_PLANES_STEP_1.ID_PRODUCTO_APV,
              fondos: [{ esRecaudadorActual: true, idFondo: 'APV1', nombreFondo: 'Fondo APV' }]
            }    
          ]
        }
      };

      await component.validarTipoCuenta('APV');

      expect(spyRegistrarTrazabilidad).toHaveBeenCalledWith(CONSTANTES_TRAZAS_PLAN.STEP1.COD_APV_STEP_1_INICIO.CODIGO_OPERACION);
      expect(spyAsignarFondo).toHaveBeenCalledTimes(1);
    });
  
    it('Debe registrar traza si usuario tiene edad pero no APV', async () => {
      const spyAsignarFondo = jest.spyOn(component as any, 'asignarFondo');
      await component.validarTipoCuenta('APV');

      expect(spyAsignarFondo).not.toHaveBeenCalled();
    });
  });

  it('error obtener empleadores', async() => {
    PlanesServiceMock.obtenerEmpleadores.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioEmpleador(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener comunas', async() => {
    PlanesServiceMock.obtenerComunas.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioEmpleador(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener regiones', async() => {
    PlanesServiceMock.obtenerRegiones.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioEmpleador(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener topes imponibles', async() => {
    PlanesServiceMock.obtenerTopesImponibles.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioTrabajo(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener cargos', async() => {
    PlanesServiceMock.obtenerCargos.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioTrabajo(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener fondos', async() => {
    PlanesServiceMock.obtenerFondos.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioCuentas(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener regimenes', async() => {
    PlanesServiceMock.obtenerRegimenes.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioCuentas(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener moneda', async() => {
    PlanesServiceMock.obtenerMoneda.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.mostrarFormularioCuentas(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener solicitudes cav', async() => {
    PlanesServiceMock.obtenerSolicitudesCAV.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.cargarEmpleadores();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error obtener solicitudes apv', async() => {
    PlanesServiceMock.obtenerSolicitudesAPV.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.cargarEmpleadores();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('volver al home', async () => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    component.volverAlHome();
    
    expect(spyMock).toHaveBeenCalled();
  });

  it('registrar traza', async () => {
    const spy = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');

    const parametros = new ParametroTraza();

    await component.registrarTrazabilidad(12603);
    
    expect(spy).toHaveBeenCalled();
  });
});
