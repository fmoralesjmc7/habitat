import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
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
import { ActualizarDatosHomeComponent } from './actualizar-datos-home.page'

describe('ActualizarDatosHomeComponent', () => {
  let component: ActualizarDatosHomeComponent;
  let fixture: ComponentFixture<ActualizarDatosHomeComponent>;
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

  const routerSpy =  jest.fn();

  const datosUsuario = {"primer_nombre":"ttest","segundo_nombre":"","apellido_paterno":" test","apellido_materno":" test","sexo":"MASCULINO","id_nacionalidad":36,"estado_civil":"","ultima_actualizacion":"2022-07-26T17:45:31-04:00","renta":"1074036","id_renta":-1,"id_profesion":-1,"id_cargo":7,"tipo_suscripcion_cartola":-1,"telefonos":[{"codigo_area":"9","numero_telefono":"57703098","tipo_telefono":"CELULAR","id_tipo_telefono":4,"id_telefono_contacto":518936092,"id_jerarquia":7},{"codigo_area":"9","numero_telefono":"57703098","tipo_telefono":"CELULAR","id_tipo_telefono":4,"id_telefono_contacto":518936091,"id_jerarquia":7}],"correos":[{"correo":"CERTDEVHABITAT@GMAIL.COM","tipo_correo":"PART","id_tipo_correo":1,"id_email_persona":5010754484,"id_tipo_jerarquia":7}],"direcciones":[{"id_mae_direccion":716257590,"id_pais":36,"nombre_pais":"CHILE","id_region":13,"nombre_region":"METROPOLITANA","id_ciudad":265,"nombre_ciudad":"SANTIAGO","id_comuna":301,"nombre_comuna":"PROVIDENCIA","calle":"A","numero":"10","departamento":"","block":"","villa":"","prioridad":"COM","id_prioridad":2,"id_jerarquia":2,"fecha_creacion":"2020-09-03T09:56:01-04:00"},{"id_mae_direccion":718055457,"id_pais":-1,"nombre_pais":"","id_region":13,"nombre_region":"METROPOLITANA","id_ciudad":-1,"nombre_ciudad":"","id_comuna":-1,"nombre_comuna":"","calle":"ESMERALDA","numero":"1457","departamento":"","block":"","villa":"","prioridad":"PART","id_prioridad":1,"id_jerarquia":7,"fecha_creacion":"2022-07-26T17:45:31-04:00"}],"empleadores":[{"rut":"98000100","dv":"8","razon_social":"A.F.P. HABITAT S.A.","ultima_cotizacion":""}]};

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

  registerLocaleData(locale, 'es-CL');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [ ActualizarDatosHomeComponent ],
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
          provide: Router, useValue: routerSpy
        },
        { provide: LOCALE_ID, useValue: 'es-CL' },
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

    fixture = TestBed.createComponent(ActualizarDatosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cerrar modal al llamar contact center', () => {
    component.llamarContactCenter();

    expect(component.mostrarModalDatos).toBeFalsy();
  });

  it('cerrar modal al ir a sucursales', () => {
    component.irSucursales();

    expect(component.mostrarModalDatos).toBeFalsy();
  });

  it('error cargar Informacion Usuario', async() => {
    ActualizarDatosServiceMock.obtenerDatosUsuario.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.cargarInformacionUsuario(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('volver al home', async () => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');

    component.volverAlHome();
    
    expect(spyMock).toHaveBeenCalled();
  });

  it('registrar traza', () => {
    const spyTraza = jest.spyOn(ActualizarDatosServiceMock, 'registraTrazaUUID')
    component.procesarErrorDatos(undefined);
    expect(spyTraza).toHaveBeenCalled();
  });

  it('modal edición', () => {
    component.eventoMostrarFormulario(component.CONSTANTES.OPCION_LABORALES);

    expect(component.mostrarVerFormulario).toBeTruthy();
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
