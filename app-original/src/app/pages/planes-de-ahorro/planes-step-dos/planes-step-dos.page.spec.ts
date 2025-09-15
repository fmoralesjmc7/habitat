import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { FormatoCapitalize } from 'src/app/pipes/formato-capitalize.pipe';
import { PlanesService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { PlanesStepDosPage } from './planes-step-dos.page';

describe('PlanesStepDosPage', () => {
  let component: PlanesStepDosPage;
  let fixture: ComponentFixture<PlanesStepDosPage>;
  let contextoApp: ContextoAPP;

  const PlanesServiceMock ={
    ejecutarSolicitud: jest.fn(()=>of(
      {
        exito: false
      }
    ))
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of())
  }

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(()=>Promise.resolve('test')),
    generarNavegacionExtra: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanesStepDosPage, FormatoCapitalize ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({data: '{"cuentaSeleccionada":4,"objetoSolicitud":{"_id_tipo_fondo":0,"_nombre_tipo_fondo":"","_id_regimen":0,"_nombre_regimen":"","_id_tipo_moneda":0,"_nombre_tipo_moneda":"","_montoSeleccionado":"1.111.111","_fondoSeleccionado":{"id_tipo_fondo":1,"nombre_tipo_fondo":"A"},"_regimenSeleccionado":{"id_regimen":4,"nombre_regimen":"REGIMEN%20A"},"_tipoSeleccionado":{"id_tipo_moneda":3,"nombre_tipo_moneda":"$"},"_fechaIndefinida":true,"_mesSeleccionado":0,"_anioSeleccionado":0,"_autorizacionEmpleador":false,"_id_cargo":0,"_nombre_cargo":"","_cargoSeleccionado":{"id_cargo":2,"nombre_cargo":"INDEPENDIENTE"},"_id_mae_empleador":0,"_razon_social":"","_empleadorSeleccionado":{"id_mae_empleador":13608924,"razon_social":"SERVICIOS%20EQUIFAX%20CHILE%20LIMITADA"},"_id_region":0,"_nombre_region":"","_id_comuna":0,"_nombre_comuna":"","_id_ciudad":"","_nombre_ciudad":"","_regionSeleccionada":{"id_region":13,"nombre_region":"METROPOLITANA"},"_comunaSeleccionada":{"id_comuna":279,"nombre_comuna":"Santiago"},"_ciudadSeleccionada":{"id_ciudad":"265","nombre_ciudad":"SANTIAGO"},"_aceptaMandato":true,"_declaraMandato":false,"_rentaImponible":"$1.111.111","_primerDescuento":"2022-10-07T19:06:39.028Z","_calle":"ISIDORA%20GOYENECHEA%20","_numero":"2800","_oficina":"","_correo":"CERTDEVHABITAT@GMAIL.COM","_codigoPostal":"0","_rutEmpleador":"85896100","_dvEmpleador":"9"}}'})
          },
        },
        {
          provide: PlanesService,
          useValue: PlanesServiceMock
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

    fixture = TestBed.createComponent(PlanesStepDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error ejecutar solicitud', async() => {
    await component.continuarStep3();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error ejecutar solicitud', async() => {
    PlanesServiceMock.ejecutarSolicitud.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.continuarStep3();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza', async () => {
    const spy = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID');

    const parametros = new ParametroTraza();

    await component.registrarTrazabilidad(12644);
    
    expect(spy).toHaveBeenCalled();
  });
});
