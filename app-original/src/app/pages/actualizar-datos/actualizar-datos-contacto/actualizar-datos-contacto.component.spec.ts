import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController, NavParams } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PlanesService, TrazabilidadService } from 'src/app/services';
import { ActualizarDatosService } from 'src/app/services/api/restful/actualizar-datos.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import locale from '@angular/common/locales/es';
import { ActualizarDatosContactoComponent } from './actualizar-datos-contacto.component';
import { CONSTANTES_TRAZAS_DATOS } from '../util/datos.constantes';
import { CONSTANTES_ERROR_GENERICO } from 'src/app/util/error-generico.constantes';

describe('ActualizarDatosContactoComponent', () => {
  let component: ActualizarDatosContactoComponent;
  let fixture: ComponentFixture<ActualizarDatosContactoComponent>;
  let contextoApp: ContextoAPP;

   const NavMock = {
    navigateBack: jest.fn(()=>of()),
    navigateForward: jest.fn(()=>of()),
    navigateRoot: jest.fn(()=>of()),
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    generarObjetoTraza: jest.fn(),
  }

  const PlanesServiceMock = {
    obtenerComunas: jest.fn(()=>of([{}])),
    obtenerRegiones: jest.fn(()=>of([{}])),  
  }

  const ActualizarDatosServiceMock = {
    obtenerDatosUsuario: jest.fn(()=>of(datosUsuario)),
    obtenerNacionalidad: jest.fn(()=>of([{}])),  
    obtenerCiudades: jest.fn(()=>of([{}])),
    obtenerCodigosArea: jest.fn(()=>of([{}])),  
    obtenerRangosRenta: jest.fn(()=>of([{}])),
    obtenerCargos: jest.fn(()=>of([{}])),  
    ObtenerProfesiones: jest.fn(()=>of([{}])),
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const datosUsuario = {"primer_nombre":"ttest","segundo_nombre":"","apellido_paterno":" test","apellido_materno":" test","sexo":"MASCULINO","id_nacionalidad":36,"estado_civil":"","ultima_actualizacion":"2022-07-26T17:45:31-04:00","renta":"1074036","id_renta":-1,"id_profesion":-1,"id_cargo":7,"tipo_suscripcion_cartola":-1,"telefonos":[{"codigo_area":"9","numero_telefono":"57703098","tipo_telefono":"CELULAR","id_tipo_telefono":4,"id_telefono_contacto":518936092,"id_jerarquia":7},{"codigo_area":"9","numero_telefono":"57703098","tipo_telefono":"CELULAR","id_tipo_telefono":4,"id_telefono_contacto":518936091,"id_jerarquia":7}],"correos":[{"correo":"CERTDEVHABITAT@GMAIL.COM","tipo_correo":"PART","id_tipo_correo":1,"id_email_persona":5010754484,"id_tipo_jerarquia":7}],"direcciones":[{"id_mae_direccion":716257590,"id_pais":36,"nombre_pais":"CHILE","id_region":13,"nombre_region":"METROPOLITANA","id_ciudad":265,"nombre_ciudad":"SANTIAGO","id_comuna":301,"nombre_comuna":"PROVIDENCIA","calle":"A","numero":"10","departamento":"","block":"","villa":"","prioridad":"COM","id_prioridad":2,"id_jerarquia":2,"fecha_creacion":"2020-09-03T09:56:01-04:00"},{"id_mae_direccion":718055457,"id_pais":-1,"nombre_pais":"","id_region":13,"nombre_region":"METROPOLITANA","id_ciudad":-1,"nombre_ciudad":"","id_comuna":-1,"nombre_comuna":"","calle":"ESMERALDA","numero":"1457","departamento":"","block":"","villa":"","prioridad":"PART","id_prioridad":1,"id_jerarquia":7,"fecha_creacion":"2022-07-26T17:45:31-04:00"}],"empleadores":[{"rut":"98000100","dv":"8","razon_social":"A.F.P. HABITAT S.A.","ultima_cotizacion":""}]};

  const routerSpy =  jest.fn();
  registerLocaleData(locale, 'es-CL');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [ ActualizarDatosContactoComponent ],
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
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: PlanesService,
          useValue: PlanesServiceMock
        },
        {
          provide: ActualizarDatosService,
          useValue: ActualizarDatosServiceMock
        },
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        { provide: LOCALE_ID, useValue: 'es-CL' },
        AppAvailability, 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ datosUsuario: JSON.stringify(datosUsuario) }),
            snapshot: {
              paramMap: {
                get: jest.fn()
              }
            }
          },
        },
        {
          provide: Router, useValue: routerSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

    fixture = TestBed.createComponent(ActualizarDatosContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID')
    component.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.HOME.CODIDO_TRAZA_EXITO_ERROR.CODIGO_OPERACION);
    expect(spyTraza).toHaveBeenCalled();
  });

  it('editar datos sin telefono', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID');

    component.telefonoCelular = undefined!;

    component.editarDatos();

    expect(component.modalSinCelularValido).toBeTruthy();
  });

  it('editar datos con telefono', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID');

    component.telefonoCelular = '123456789';
    component.modalSinCelularValido = false;

    component.editarDatos();

    expect(component.modalSinCelularValido).toBeFalsy();
    expect(component.datosUsuarioInput).toBeDefined();
    expect(component.modoEdicion).toBeTruthy();
  });

  it('ir a sucursales', () => {
    const spyTraza = jest.spyOn(NavMock, 'navigateForward');

    component.irSucursales();

    expect(spyTraza).toHaveBeenCalledWith('SucursalesPage');
  });

  it('ir a home', () => {
    const spyTraza = jest.spyOn(NavMock, 'navigateRoot');

    component.volverAlHome();

    expect(spyTraza).toHaveBeenCalledWith(CONSTANTES_ERROR_GENERICO.actualizarDatosHome);
  });

  it('procesar error', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID');

    component.procesarErrorDatos(undefined);

    expect(spyTraza).toHaveBeenCalled();
  });

  it('error cargar nacionalidades', () => {
    const spy = jest.spyOn(component, 'cargarRegionesComunas');

    component.cargarNacionalidades(undefined);

    expect(spy).toHaveBeenCalled();
  });

  it('error cargar nacionalidades', () => {
    ActualizarDatosServiceMock.obtenerNacionalidad.mockReturnValue(throwError({ status: 500, error: {}}));

    component.cargarNacionalidades(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error cargar comunas', () => {
    PlanesServiceMock.obtenerComunas.mockReturnValue(throwError({ status: 500, error: {}}));

    component.cargarRegionesComunas(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error cargar regiones', () => {
    PlanesServiceMock.obtenerRegiones.mockReturnValue(throwError({ status: 500, error: {}}));

    component.cargarRegionesComunas(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error cargar ciudades', () => {
    ActualizarDatosServiceMock.obtenerCiudades.mockReturnValue(throwError({ status: 500, error: {}}));

    component.cargarCiudades(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error cargar codigos de area', () => {
    ActualizarDatosServiceMock.obtenerCodigosArea.mockReturnValue(throwError({ status: 500, error: {}}));

    component.cargarCodigosArea(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error cargar codigos de area', () => {

    const regiones = [
      {
        nombre_region: 'Santiago'
      },
      {
        nombre_region: 'Antofagasta'
      },
      {
        nombre_region: 'Valparaíso'
      }
    ];

    component.listadoRegiones = regiones;
    component.ordenarRegiones();

    expect(component.listadoRegiones[0].nombre_region).toBe('Antofagasta');
    expect(component.listadoRegiones[1].nombre_region).toBe('Santiago');
    expect(component.listadoRegiones[2].nombre_region).toBe('Valparaíso');
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
