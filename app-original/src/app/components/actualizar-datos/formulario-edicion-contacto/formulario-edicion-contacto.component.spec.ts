import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController, NavController, NavParams } from '@ionic/angular';
import { of } from 'rxjs';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { PlanesService, TrazabilidadService } from 'src/app/services';
import { ActualizarDatosService } from 'src/app/services/api/restful/actualizar-datos.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import locale from '@angular/common/locales/es';
import { FormularioEdicionContactoComponent } from './formulario-edicion-contacto.component';
import { CONSTANTES_TRAZAS_DATOS } from 'src/app/pages/actualizar-datos/util/datos.constantes';
import { DatosActualizarUsuario } from 'src/app/pages/actualizar-datos/util/datos.actualizar.usuario';
import { ValidadorActualizarDatos } from '../util/validador';
import { NavParamsMock } from 'src/app/pages/actualizar-datos/actualizar-datos-home/actualizar-datos-home.page.spec';

describe('FormularioEdicionContactoComponent', () => {
  let component: FormularioEdicionContactoComponent;
  let fixture: ComponentFixture<FormularioEdicionContactoComponent>;
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
    registraTrazaUUID: jest.fn(() => of())
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ValidadorActualizarDatosMock = {
    validadorCorreoParticular: jest.fn(),
    validadorCorreoComercial: jest.fn(),  
    validadorCodigoArea: jest.fn(),
    validadorTelefono: jest.fn(),  
    validadorCelular: jest.fn(),
    validarCalle: jest.fn(()=>true),
    validarNacionalidad: jest.fn(),  
    validarRegion: jest.fn(),
    validarCiudad: jest.fn(),  
    validarComuna: jest.fn(),
  }

  const datosUsuario = {"primer_nombre":"ttest","segundo_nombre":"","apellido_paterno":" test","apellido_materno":" test","sexo":"MASCULINO","id_nacionalidad":36,"estado_civil":"","ultima_actualizacion":"2022-07-26T17:45:31-04:00","renta":"1074036","id_renta":-1,"id_profesion":-1,"id_cargo":7,"tipo_suscripcion_cartola":-1,"telefonos":[{"codigo_area":"9","numero_telefono":"57703098","tipo_telefono":"CELULAR","id_tipo_telefono":4,"id_telefono_contacto":518936092,"id_jerarquia":7},{"codigo_area":"9","numero_telefono":"57703098","tipo_telefono":"CELULAR","id_tipo_telefono":4,"id_telefono_contacto":518936091,"id_jerarquia":7}],"correos":[{"correo":"CERTDEVHABITAT@GMAIL.COM","tipo_correo":"PART","id_tipo_correo":1,"id_email_persona":5010754484,"id_tipo_jerarquia":7}],"direcciones":[{"id_mae_direccion":716257590,"id_pais":36,"nombre_pais":"CHILE","id_region":13,"nombre_region":"METROPOLITANA","id_ciudad":265,"nombre_ciudad":"SANTIAGO","id_comuna":301,"nombre_comuna":"PROVIDENCIA","calle":"A","numero":"10","departamento":"","block":"","villa":"","prioridad":"COM","id_prioridad":2,"id_jerarquia":2,"fecha_creacion":"2020-09-03T09:56:01-04:00"},{"id_mae_direccion":718055457,"id_pais":-1,"nombre_pais":"","id_region":13,"nombre_region":"METROPOLITANA","id_ciudad":-1,"nombre_ciudad":"","id_comuna":-1,"nombre_comuna":"","calle":"ESMERALDA","numero":"1457","departamento":"","block":"","villa":"","prioridad":"PART","id_prioridad":1,"id_jerarquia":7,"fecha_creacion":"2022-07-26T17:45:31-04:00"}],"empleadores":[{"rut":"98000100","dv":"8","razon_social":"A.F.P. HABITAT S.A.","ultima_cotizacion":""}]};

  registerLocaleData(locale, 'es-CL');

  const routerSpy =  jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [ FormularioEdicionContactoComponent ],
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
        {
          provide: ValidadorActualizarDatos,
          useValue: ValidadorActualizarDatosMock
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

    fixture = TestBed.createComponent(FormularioEdicionContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza exito', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID')
    component.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_EXITO.CODIGO_OPERACION);
    expect(spyTraza).toHaveBeenCalled();
  });

  it('registrar traza error', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID')
    component.registrarTrazabilidad(CONSTANTES_TRAZAS_DATOS.MODAL.CODIDO_TRAZA_GUARDAR_CONTACTO_ERROR.CODIGO_OPERACION);
    expect(spyTraza).toHaveBeenCalled();
  });

  it('guardar datos personales', () => {
    const spy = jest.spyOn(NavMock, 'navigateForward')

    component.direccionSeleccionada = {};
    component.datosUsuario = new DatosActualizarUsuario();
    component.datosUsuario.iniciarDatos(datosUsuario, 16071760, '2');
    component.datosUsuario.opcionResidenciaChile = false;

    component.guardarDatosPersonales()
    
    expect(spy).toHaveBeenCalled();
  });
  
  it('cambiar region', () => {
    
    component.direccionSeleccionada = {
      id_comuna : 10,
      id_ciudad : 20
    };

    const ciudad = {
      nombre_ciudad: 'Valparaíso',
      id_region: 16,
    };

    const ciudadDos = {
      nombre_ciudad: 'Valparaíso',
      id_region: 17,
    };

    component.listadoCiudades.push(<never>ciudad);
    component.listadoCiudades.push(<never>ciudadDos);

    component.cambioRegion(16);

    expect(component.direccionSeleccionada.id_comuna).toBe(-1);
    expect(component.listadoCiudadesVisibles.length).toBe(1);
    expect(component.listadoComunasVisibles.length).toBe(1);
  });

  it('cambiar ciudad', () => {
    
    component.direccionSeleccionada = {
      id_comuna : 10,
      id_ciudad : 20
    };

    const comuna = {
      nombre_comuna: 'Valparaíso',
      id_ciudad: "16"
    };

    const comunaDos = {
      nombre_comuna: 'Viña del mar',
      id_ciudad: "17"
    };

    component.listadoComunas.push(<never>comuna);
    component.listadoComunas.push(<never>comunaDos);

    component.cambioCiudad(16);

    expect(component.listadoComunasVisibles.length).toBe(1);
  });

  it('validacion escritura email', () => {
    const spy = jest.spyOn(component, 'esCorreoValido');

    component.keyUpEmail('test@test.cl', 'particular');

    expect(spy).toHaveBeenCalled()
  });

  it('validacion correo particular undefined', () => {
    const spy = jest.spyOn(component, 'desplegarErrorEmail');

    component.keyUpEmail(undefined, 'particular');

    expect(spy).toHaveBeenCalled()
  });

  it('validacion correo particular formato incorrecto', () => {
    jest.resetAllMocks();
    const spy = jest.spyOn(component, 'desplegarErrorEmail');

    component.esCorreoValido('test', 'particular');

    expect(spy).toHaveBeenCalled()
  });

  it('validacion correo particular formato valido', () => {
    jest.resetAllMocks();
    const spy = jest.spyOn(component, 'desplegarErrorEmail');

    expect(component.esCorreoValido('test@tets.tl', 'particular')).toBeTruthy()
  });

  it('validacion correo comercial vacío', () => {
    jest.resetAllMocks();
    const spy = jest.spyOn(component, 'desplegarErrorEmail');

    expect(component.esCorreoValido(undefined, 'comercial')).toBeTruthy()
  });

  it('validacion correo comercial incorrecto', () => {
    jest.resetAllMocks();
    expect(component.esCorreoValido('test', 'comercial')).toBeFalsy()
  });

  it('validacion correo comercial correcto', () => {
    jest.resetAllMocks();
    expect(component.esCorreoValido('test@test.cl', 'comercial')).toBeTruthy()
  });

  it('reiniciar Validadores', () => {
    jest.resetAllMocks();

    component.reiniciarValidadores();

    expect(component.cantidadErrores).toBe(0);
  });

  it('validar formulario - con residencia', () => {
    jest.resetAllMocks();

    const spy = jest.spyOn(component, 'validarCantidadErrores');
    
    component.datosUsuario = new DatosActualizarUsuario();
    component.datosUsuario.iniciarDatos(datosUsuario, 16071760, '2');
    component.datosUsuario.opcionResidenciaChile = true;

    component.direccionSeleccionada = {
      calle: ''
    }
    
    component.esformularioConErrores();

    expect(spy).toHaveBeenCalled();
  });

  it('Validar mensaje toast formulario con dos errores', () => {

    component.reiniciarValidadores();

    component.validadorNacionalidad = true;
    component.validadorTelefonoComercial = true;
    component.validadorCorreoComercial = false;

    component.validarCantidadErrores();

    expect(component.ultimoError).toBe('telefonoObligatorio');
    expect(component.cantidadErrores).toBe(2);
  });

  it('Validar mensaje toast formulario con un error', () => {

    component.reiniciarValidadores();

    component.validadorNacionalidad = false;
    component.validadorTelefonoComercial = true;
    component.validadorCorreoComercial = false;

    component.validarCantidadErrores();

    expect(component.ultimoError).toBe('telefonoObligatorio');
    expect(component.cantidadErrores).toBe(1);
  });

  it('Validar mensaje toast formulario con un error correo', () => {

    component.reiniciarValidadores();

    component.validadorNacionalidad = false;
    component.validadorTelefonoComercial = false;
    component.validadorCorreoComercial = true;

    component.validarCantidadErrores();

    expect(component.ultimoError).toBe('emailObligatorio');
    expect(component.cantidadErrores).toBe(1);
  });

  it('Validar mensaje toast formulario sin errores', () => {

    component.reiniciarValidadores();

    component.validadorNacionalidad = false;
    component.validadorTelefonoComercial = false;
    component.validadorCorreoComercial = false;

    component.validarCantidadErrores();

    expect(component.ultimoError).toBe('');
    expect(component.cantidadErrores).toBe(0);
  });

  it('Validar listado de errores con coincidencia', () => {
    const camposObligatorios = ['nacionalidad', 'region', 'comuna', 'ciudad', 'numero', 'calle'];

    expect(component.validarListado(camposObligatorios, 'nacionalidad')).toBeTruthy();
  });

  it('Validar listado de errores sin coincidencia', () => {
    const camposObligatorios = ['nacionalidad', 'region', 'comuna', 'ciudad', 'numero', 'calle'];

    expect(component.validarListado(camposObligatorios, 'telefono')).toBeFalsy();
  });

  it('generar Objeto Solicitud', () => {
    component.direccionSeleccionada = {};
    component.datosUsuario = new DatosActualizarUsuario();
    component.datosUsuario.iniciarDatos(datosUsuario, 16071760, '2');
    component.datosUsuario.opcionResidenciaChile = true;

    expect(component.generarObjetoSolicitud()).toBeDefined();
  });

  it('generar Objeto Solicitud - sin residencia', () => {
    component.direccionSeleccionada = {};
    component.datosUsuario = new DatosActualizarUsuario();
    component.datosUsuario.iniciarDatos(datosUsuario, 16071760, '2');
    component.datosUsuario.opcionResidenciaChile = false;

    expect(component.generarObjetoSolicitud()).toBeDefined();
    expect(component.direccionSeleccionada.id_pais).toBe(190);
  });
});
