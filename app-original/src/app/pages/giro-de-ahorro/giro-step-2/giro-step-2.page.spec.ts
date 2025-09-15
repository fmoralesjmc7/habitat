import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { FormatoCapitalize } from 'src/app/pipes/formato-capitalize.pipe';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';
import { GiroService, TrazabilidadService, UtilService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ResponseValidacionCuenta } from '../util/validacion-cuenta';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { GiroStepDosPage } from './giro-step-2.page';

describe('GiroStepDosPage', () => {
  let component: GiroStepDosPage;
  let fixture: ComponentFixture<GiroStepDosPage>;
  let contextoApp: ContextoAPP;
  let renderer2: Renderer2;

  const responseMock: ResponseValidacionCuenta = {
    return: ''
  }

  const listadoBancosMock = {"ListaBancos":[{"IdEntidad":"3885","CodEntidad":"3885","NombreEntidad":"ATLAS","RazonSocial":"ATLAS","RutEntidad":"97004000","DvEntidad":"5","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3886","CodEntidad":"3886","NombreEntidad":"BANCO CONSORCIO","RazonSocial":"BANCO CONSORCIO","RutEntidad":"99500410","DvEntidad":"0","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3887","CodEntidad":"1","NombreEntidad":"BANCO DE CHILE","RazonSocial":"BANCO DE CHILE","RutEntidad":"97004000","DvEntidad":"5","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3888","CodEntidad":"43","NombreEntidad":"BANCO DE LA NACION ARGENTINA","RazonSocial":"BANCO DE LA NACION ARGENTINA","RutEntidad":"59002030","DvEntidad":"3","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3889","CodEntidad":"507","NombreEntidad":"BANCO DEL DESARROLLO","RazonSocial":"BANCO DEL DESARROLLO","RutEntidad":"97051000","DvEntidad":"1","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3890","CodEntidad":"12","NombreEntidad":"BANCO DEL ESTADO","RazonSocial":"BANCO DEL ESTADO","RutEntidad":"97030000","DvEntidad":"7","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3891","CodEntidad":"17","NombreEntidad":"BANCO DO BRASIL","RazonSocial":"BANCO DO BRASIL","RutEntidad":"97003000","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3892","CodEntidad":"51","NombreEntidad":"BANCO FALABELLA","RazonSocial":"BANCO FALABELLA","RutEntidad":"96509660","DvEntidad":"4","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3893","CodEntidad":"9","NombreEntidad":"BANCO INTERNACIONAL","RazonSocial":"BANCO INTERNACIONAL","RutEntidad":"97011000","DvEntidad":"3","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3894","CodEntidad":"39","NombreEntidad":"BANCO ITAU CHILE","RazonSocial":"BANCO ITAU CHILE","RutEntidad":"76645030","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3895","CodEntidad":"55","NombreEntidad":"BANCO MONEX","RazonSocial":"BANCO MONEX","RutEntidad":"99500410","DvEntidad":"0","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3896","CodEntidad":"57","NombreEntidad":"BANCO PARIS","RazonSocial":"BANCO PARIS","RutEntidad":"99565970","DvEntidad":"0","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3897","CodEntidad":"56","NombreEntidad":"BANCO PENTA","RazonSocial":"BANCO PENTA","RutEntidad":"97952000","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3898","CodEntidad":"53","NombreEntidad":"BANCO RIPLEY","RazonSocial":"BANCO RIPLEY","RutEntidad":"97947000","DvEntidad":"2","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3899","CodEntidad":"37","NombreEntidad":"BANCO SANTANDER SANTIAGO","RazonSocial":"BANCO SANTANDER SANTIAGO","RutEntidad":"97036000","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3900","CodEntidad":"14","NombreEntidad":"BANCO SCOTIABANK","RazonSocial":"BANCO SCOTIABANK","RutEntidad":"97018000","DvEntidad":"1","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3901","CodEntidad":"49","NombreEntidad":"BANCO SECURITY","RazonSocial":"BANCO SECURITY","RutEntidad":"97053000","DvEntidad":"2","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3902","CodEntidad":"3902","NombreEntidad":"BANEFE","RazonSocial":"BANEFE","RutEntidad":"97036000","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3905","CodEntidad":"16","NombreEntidad":"BCI","RazonSocial":"BANCO DE CREDITOS E INVERSIONES","RutEntidad":"97006000","DvEntidad":"6","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3906","CodEntidad":"28","NombreEntidad":"BICE","RazonSocial":"BANCO BICE","RutEntidad":"97080000","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3907","CodEntidad":"3907","NombreEntidad":"CITIBANK","RazonSocial":"CITIBANK","RutEntidad":"97004000","DvEntidad":"5","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3908","CodEntidad":"3908","NombreEntidad":"CONDELL","RazonSocial":"CONDELL","RutEntidad":"97023000","DvEntidad":"9","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3909","CodEntidad":"27","NombreEntidad":"CORPBANCA","RazonSocial":"CORPBANCA","RutEntidad":"97023000","DvEntidad":"9","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3910","CodEntidad":"3910","NombreEntidad":"CREDICHILE","RazonSocial":"CREDICHILE","RutEntidad":"97004000","DvEntidad":"5","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"2911","CodEntidad":"52","NombreEntidad":"DEUTSCHE BANK (CHILE)","RazonSocial":"DEUTSCHE BANK (CHILE)","RutEntidad":"96929050","DvEntidad":"2","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3912","CodEntidad":"58","NombreEntidad":"DNB NOR BANK ASA (AGENCIA EN CHILE)","RazonSocial":"DNB NOR BANK ASA (AGENCIA EN CHILE)","RutEntidad":"59141000","DvEntidad":"8","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3913","CodEntidad":"3913","NombreEntidad":"EDWARDS","RazonSocial":"EDWARDS","RutEntidad":"97004000","DvEntidad":"5","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3914","CodEntidad":"31","NombreEntidad":"HSBC","RazonSocial":"HSBC BANK CHILE","RutEntidad":"97951000","DvEntidad":"4","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3915","CodEntidad":"41","NombreEntidad":"JP MORGAN CHASE BANK","RazonSocial":"JP MORGAN CHASE BANK N.A.","RutEntidad":"97043000","DvEntidad":"8","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3916","CodEntidad":"3916","NombreEntidad":"NOVA","RazonSocial":"NOVA","RutEntidad":"97006000","DvEntidad":"6","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3917","CodEntidad":"54","NombreEntidad":"RABOBANK CHILE","RazonSocial":"RABOBANK CHILE","RutEntidad":"97949000","DvEntidad":"3","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3918","CodEntidad":"46","NombreEntidad":"RBS","RazonSocial":"THE ROYAL BANK OF SCOTLAND (CHILE)","RutEntidad":"97919000","DvEntidad":"K","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3919","CodEntidad":"67","NombreEntidad":"SECURITY FULL","RazonSocial":"SECURITY FULL","RutEntidad":"96929390","DvEntidad":"0","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3920","CodEntidad":"3920","NombreEntidad":"TBANC","RazonSocial":"TBANC","RutEntidad":"97006000","DvEntidad":"6","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""},{"IdEntidad":"3921","CodEntidad":"45","NombreEntidad":"THE BANK OF TOKYO","RazonSocial":"THE BANK OF TOKYO-MITSUBISHI LTD.","RutEntidad":"59002220","DvEntidad":"9","DesTipEntidad":"BANCOS GIROS","IdTipoEntidad":"39","IndEstado":"1","RelIdNumber":""}]};
  
  const girosMock = {
    validarCuentaCliente: jest.fn(() => of(responseMock)),
    obtenerListaBancos: jest.fn(() => of(listadoBancosMock)),
    obtenerBancosRegistrados: jest.fn(() => of()),
    obtenerListaTipoDeCuentas: jest.fn(() => of({
      'ListaTipoCuentas': undefined
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
      declarations: [ GiroStepDosPage, FormatoCapitalize, FormatoPesoChilenoPipe ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
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

    fixture = TestBed.createComponent(GiroStepDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('obtención uuid', () => {
    const spyTraza = jest.spyOn(UtilServiceMock, 'getStorageUuid');

    expect(spyTraza).toHaveBeenCalled();
  });

  it('cambio tamaño cuando se abre el teclado', () => {
    const spyRenderer = jest.spyOn(renderer2, 'setStyle');

    component.resizePantalla('100px');
    expect(spyRenderer).toHaveBeenCalled();
    expect(component.botoneraCuenta.nativeElement.style['margin-bottom']).toBe('100px');
  });
  
  it('formatNumeroCuenta', () => {
    let event = {which:9,preventDefault:jest.fn()}
    expect(component.formatNumeroCuenta(event)).toBeTruthy;
  });
  it('formatNumeroCuenta false', () => {
    let event = {keyCode:60,preventDefault:jest.fn()}
    expect(component.formatNumeroCuenta(event)).toBeTruthy;
  });
  it('formatNumeroCuenta pasa cero', () => {
    let event = {keyCode:48,preventDefault:jest.fn(), target:{value:1}}
    expect(component.formatNumeroCuenta(event)).toBeTruthy;
  });
  it('formatNumeroCuenta cero string', () => {
    let event = {keyCode:48,preventDefault:jest.fn(), key:{value:'0'}}
    const spyEvent = jest.spyOn(event,'preventDefault')
    expect(spyEvent).toHaveBeenCalled;
  });
  

  it('validar Cuenta Digital - cuenta digital con coincidencia de largo y prefijo', () => {
    component.numeroCuenta = 99912345678
    component.validarCuentaDigital(11,'999');

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy();
  });

  it('validar Cuenta Digital - cuenta digital sin coincidencia de largo y prefijo', () => {
    component.numeroCuenta = 999123456781
    component.validarCuentaDigital(11,'999');

    expect(component.tipoCuentaBloqueada).toBe(undefined);
    expect(component.cuentaBloqueada).toBeFalsy();
  });

  it('validar Cuenta Digital - cuenta bci digital', () => {
    component.idBancoSeleccionado = 3905;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 777012345678;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy();
  });

  it('validar Cuenta Digital - cuenta bci no digital', () => {
    component.idBancoSeleccionado = 3905;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 7770123456789;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('');
    expect(component.cuentaBloqueada).toBeFalsy();
  });

  it('validar Cuenta Digital - cuenta santander digital', () => {
    component.idBancoSeleccionado = 3899;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 71123456789;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy();
  });

  it('validar Cuenta Digital - cuenta santander no digital', () => {
    component.idBancoSeleccionado = 3899;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 711234567890;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('');
    expect(component.cuentaBloqueada).toBeFalsy();
  });

  it('validar Cuenta Digital - cuenta ripley digital con 10 digitos', () => {
    component.idBancoSeleccionado = 3898;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 9991234567;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy();
  });

  it('validar Cuenta Digital - cuenta ripley digital con 11 digitos', () => {
    component.idBancoSeleccionado = 3898;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 99912345678;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy();
  });

  it('validar Cuenta Digital - cuenta ripley no digital', () => {
    component.idBancoSeleccionado = 3898;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 999123456789;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('');
    expect(component.cuentaBloqueada).toBeFalsy();
  });

  it('validar Cuenta Digital - cuenta otro banco', () => {
    component.idBancoSeleccionado = 3885;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 999123456789;
    component.validarCuentasDigitales();

    expect(component.tipoCuentaBloqueada).toBe('');
    expect(component.cuentaBloqueada).toBeFalsy();
  });

  it('validar Cuenta Digital - evento enviar solicitud con cuenta no digital', async() => {
    component.idBancoSeleccionado = 3887;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 1231321321312;
    
    await component.eventoRealizarSolicitudGiro();

    expect(component.tipoCuentaBloqueada).toBe('');
    expect(component.cuentaBloqueada).toBeFalsy();
    expect(component.validadorModalCondicionesGiro).toBeTruthy();
  });

  it('validar Cuenta Digital - evento enviar solicitud con cuenta digital', async() => {
    component.idBancoSeleccionado = 3898;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 99987654321;

    await component.eventoRealizarSolicitudGiro();

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy();
    expect(component.validadorModalCondicionesGiro).toBeFalsy();
  });

  it('validar servicio blacklist', () => {
    component.idBancoSeleccionado = 3898;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 99912345678;

    responseMock.return = 'DIGITAL'

    girosMock.validarCuentaCliente.mockReturnValue(of(responseMock));

    component.validarBlacklist();

    expect(component.tipoCuentaBloqueada).toBe('DIGITAL');
    expect(component.cuentaBloqueada).toBeTruthy;
  });

  it('validar servicio blacklist con error', () => {
    component.idBancoSeleccionado = 3898;
    component.idTipoCuentaSeleccionada = 3;
    component.numeroCuenta = 99912345678;

    const spyLoading = jest.spyOn(ContextoAPPMock, 'ocultarLoading');

    girosMock.validarCuentaCliente.mockReturnValue(throwError({ status: 500, error: {}}));

    component.validarBlacklist();

    expect(spyLoading).toHaveBeenCalled();
  });

  it('validar servicio listadoBancos ', () => {
    listadoBancosMock.ListaBancos.push();
    girosMock.obtenerListaBancos.mockReturnValue(of(listadoBancosMock));
    component.cargarListadoBancoGeneral();
    expect(component.listadoBancosGeneral.length).toBe(11);
  });

  it('validar servicio listadoBancos  error', () => {
    const spyLoading = jest.spyOn(ContextoAPPMock, 'ocultarLoading');
    girosMock.obtenerListaBancos.mockReturnValue(throwError({ status: 500, error: {}}));
    component.cargarListadoBancoGeneral();
    expect(spyLoading).toHaveBeenCalled();
  });

  it('validar servicio banco guardados  error', async() => {
    girosMock.obtenerBancosRegistrados.mockReturnValue(throwError({ status: 500, error: {}}));
    await component.cargarListadoBancosGuardados();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('validar servicio banco guardados  error', async() => {
    await component.cargarListadoTipoCuenta();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('validar servicio banco guardados  error', async() => {
    girosMock.obtenerListaTipoDeCuentas.mockReturnValue(throwError({ status: 500, error: {}}));
    await component.cargarListadoTipoCuenta();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(2420);
    expect(spyTraza).toHaveBeenCalled();
  });
});