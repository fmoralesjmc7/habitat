import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { GiroService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { GiroStepTresPage } from './giro-step-3.page';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { SolicitudGiro } from '../util/solicitud.giro';
import { FondoRegimenGiro } from '../util/fondo.regimen.giro';
import { RegimenGiro } from '../util/regimen.giro';

describe('GiroStepTresPage', () => {
  let component: GiroStepTresPage;
  let fixture: ComponentFixture<GiroStepTresPage>;

  const girosMock = {
    solicitudCodigoDinamicoSMS: jest.fn(()=>of({
      'respuestaEnvioSMS': undefined
    })),
    validarCodigoDinamicoSMS: jest.fn(()=>of({
      'consultaCodigoResponse': undefined
    }))
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiroStepTresPage ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({
                      "option": "{\"listadoRegimenesAGirar\":[{\"listadoFondos\":[{\"impuestos\":0,\"comision\":0,\"montoLiquido\":5000,\"saldoPostGiro\":1146,\"mostrarDetalleGiroFondo\":false,\"confirmadoParaGirar\":true,\"botonConfirmadoDesactivado\":false,\"esGiroEnCuotas\":false,\"idFondo\":1,\"nombreFondo\":\"A\",\"idCuentaMae\":\"6709833535\",\"valorCuotaActual\":61458.57,\"saldoActual\":6146,\"montoGirar\":\"$5.000\",\"montoBruto\":5000,\"totalCuotasGirar\":\"0.08\",\"totalCuotasGirarFormat\":\"0,08\",\"cuotasPostGiro\":0.01864670785538941,\"montoGirarConfirmado\":\"$5.000\"}],\"saldoTotal\":6146,\"idTipoRegimenTributario\":4,\"nombreRegimen\":\"RÉGIMEN A\",\"confirmado\":true}],\"rut\":16071760,\"dv\":\"2\",\"email\":\"CERTDEVHABITAT@GMAIL.COM\",\"nombreUsuario\":\"FRANCISCO JAVIER ALBERTO\",\"apellidoUsuario\":\"HERMOSILLA\",\"telefonoCelular\":\"57703098\",\"idTipoProducto\":4,\"tipoProductoSeleccionado\":\"APV\",\"idBancoSeleccionado\":\"3887\",\"idTipoCuentaBancoSeleccionada\":\"3\",\"numeroCuenta\":\"111111\"}"
                    })
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ option: '{"listadoRegimenesAGirar":[{"listadoFondos":[{"impuestos":0,"comision":0,"montoLiquido":2000,"saldoPostGiro":4111,"mostrarDetalleGiroFondo":false,"confirmadoParaGirar":true,"botonConfirmadoDesactivado":false,"esGiroEnCuotas":false,"idFondo":1,"nombreFondo":"A","idCuentaMae":"6709833535","valorCuotaActual":61109.52,"saldoActual":6111,"montoGirar":"$2.000","montoBruto":2000,"totalCuotasGirar":"0.03","totalCuotasGirarFormat":"0,03","cuotasPostGiro":0.06727266062636394,"montoGirarConfirmado":"$2.000"}],"saldoTotal":6111,"idTipoRegimenTributario":4,"nombreRegimen":"RÉGIMEN A","confirmado":true}],"rut":16071760,"dv":"2","email":"CERTDEVHABITAT@GMAIL.COM","nombreUsuario":"FRANCISCO JAVIER ALBERTO","apellidoUsuario":"HERMOSILLA","telefonoCelular":"57703098","idTipoProducto":4,"tipoProductoSeleccionado":"APV"}'})
          },
        },
        {
          provide: GiroService,
          useValue: girosMock
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiroStepTresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('obtención uuid', () => {
    expect(component).toBeDefined();
  });
  
  it('generar numero enmascarado', () => {
    component.generarNumeroCelular();

    expect(component.numeroCelularFormateado).toBe('569 XXX XXX 98');
  });

  it('error controlado servicio obtener codigo sms', async() => {
    await component.solicitarSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error servicio obtener codigo sms', async() => {
    girosMock.solicitudCodigoDinamicoSMS.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.solicitarSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error controlado servicio validar codigo sms', async() => {
    await component.validarCodigoSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error servicio validar codigo sms', async() => {
    girosMock.validarCodigoDinamicoSMS.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.validarCodigoSMS();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

    it('debería asignar un NroFolio único si viene para APV', () => {
    const response = {
      SolicitudRetiroResponse: [{
        NroFolio: '123456',
        NroFolios: undefined
      }]
    };

    component.validarNumerosFolioSolicitud(response);

    expect(component.listadoNumeroFoliosSolicitud).toBe('123456');
    expect(component.validadorListaSolicitudes).toBe(false);
  });

  it('debería concatenar múltiples NroFolios para APV', () => {
    const response = {
      SolicitudRetiroResponse: [{
        NroFolio: undefined,
        NroFolios: [
          { nroFolio: '111' },
          { nroFolio: '222' },
          { nroFolio: '333' }
        ]
      }]
    };

    component.validarNumerosFolioSolicitud(response);

    expect(component.listadoNumeroFoliosSolicitud).toBe('111, 222, 333');
    expect(component.validadorListaSolicitudes).toBe(true);
  });

  it('debería asignar único folio para Cuenta 2', () => {
    component.parametrosGiro.idTipoProducto = 2; // ID distinto a APV
    const response = {
      SolicitudRetiroResponse: [{
        NroFolios: [{ nroFolio: '999' }]
      }]
    };

    component.validarNumerosFolioSolicitud(response);

    expect(component.listadoNumeroFoliosSolicitud).toBe('999');
    expect(component.validadorListaSolicitudes).toBe(false);
  });

  it('debería concatenar múltiples folios para Cuenta 2', () => {
    component.parametrosGiro.idTipoProducto = 2; // Cuenta 2
    const response = {
      SolicitudRetiroResponse: [{
        NroFolios: [
          { nroFolio: '444' },
          { nroFolio: '555' }
        ]
      }]
    };

    component.validarNumerosFolioSolicitud(response);

    expect(component.listadoNumeroFoliosSolicitud).toBe('444, 555');
    expect(component.validadorListaSolicitudes).toBe(true);
  });

  it('debería generar un objeto SolicitudGiro correctamente', () => {
    let fondoRegimenGiro = new FondoRegimenGiro();
    fondoRegimenGiro = {
      ...fondoRegimenGiro,
      idFondo: '101',
      idCuentaMae: '202',
      comision: 1000,
      valorCuotaActual: 500,
      montoBruto: 30000,
      totalCuotasGirar: '10',
      esGiroEnCuotas: false,
      impuestos: 200,
      nombreFondo: 'Fondo 1',
      totalCuotas: '10',
    }
    let regimenGiro = new RegimenGiro();
    regimenGiro = {
      ...regimenGiro,
      idTipoRegimenTributario: '10',
      listadoFondos: [fondoRegimenGiro],
      sumarMontoSaldoTotal: jest.fn(),
      resetearConfirmacionFondos: jest.fn(),
    }
  
    component.parametrosGiro = {
      ...component.parametrosGiro,
      rut: 12345678,
      dv: '9',
      idBancoSeleccionado: '1',
      idTipoCuentaBancoSeleccionada: '2',
      numeroCuenta: '123456789',
      idTipoProducto: 3,
      listadoRegimenesAGirar: [regimenGiro]
    };

    const resultado: SolicitudGiro = component.generarObjetoSolicitudGiro();

    expect(resultado).toBeInstanceOf(SolicitudGiro);
    expect(resultado.rut).toBe('12345678');
    expect(resultado.dv).toBe('9');
    expect(resultado.IdEntidadBanco).toBe('1');
    expect(resultado.IdTipoCuenta).toBe('2');
    expect(resultado.NroCtaCte).toBe('123456789');
    expect(resultado.IdTipoProducto).toBe('3');

    const resLimpio = resultado.regimenesProducto.replace(/\s+/g, '');
    expect(resLimpio).toContain('"IdTipRegTribu":"10"');
    expect(resLimpio).toContain('"IdTipoFondo":"101"');
    expect(resLimpio).toContain('"ComisionMantCuotas":"2"');
  });

  it('debe retornar la concatenación de los valores válidos', () => {
    component.codigo = ['1', '2', '3', '4', '5', '6'];
    expect(component.obtenerClaveIngresada()).toBe('123456');
  });

  it('debe ignorar undefined y strings vacíos', () => {
    component.codigo = ['1', '', undefined!, '4'];
    expect(component.obtenerClaveIngresada()).toBe('14');
  });

  it('debe retornar string vacío si todos son inválidos', () => {
    component.codigo = ['', undefined!, ''];
    expect(component.obtenerClaveIngresada()).toBe('');
  });

  it('error Realizar Solicitud Giro', async() => {
    await component.errorEnRealizarSolicitudGiro(undefined);

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(2420);

    expect(spyTraza).toHaveBeenCalled();
  });
});
