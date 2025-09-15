import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, Subscription, throwError } from 'rxjs';
import { FormatoCapitalize } from 'src/app/pipes/formato-capitalize.pipe';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';
import { UtilService, TrazabilidadService } from 'src/app/services';
import { BarraInformativaInterface } from 'src/app/services/api/data/barra-informativa.interface'; 
import { BarraInformativaService } from 'src/app/services/api/restful/barra-informativa.service'; 
import { ContextoAPP } from 'src/app/util/contexto-app';
import { HomeClientePage } from './home-cliente.page';
import { ParametroTraza } from 'src/app/util/parametroTraza';

describe('HomeClientePage', () => {
  let component: HomeClientePage;
  let fixture: ComponentFixture<HomeClientePage>;

  let datosBarraInformativa: BarraInformativaInterface = {
    app: null!,
    encendido: true,
    subtitulo: null!,
    titulo: null!,
    titulo_boton: null!,
    url: null!
  }

  const UtilServiceMock = {
    openWithSystemBrowser: jest.fn(),
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarUuid: jest.fn(),
    getStorageData: jest.fn(()=>Promise.resolve('face')),
    mostrarToastIcono: jest.fn(),
    setStorageData: jest.fn()
  }

  const BarraInformativaServiceMock = {
    obtenerDatosBarraInformativa: jest.fn(() => of(datosBarraInformativa))
  }

  const NavMock = {
    navigateBack: jest.fn(()=>of()),
    navigateForward: jest.fn(()=>of()),
    navigateRoot: jest.fn(()=>of()),
  }

  const GiroMock ={
    validarGiro: jest.fn(()=>of())
  }

  const barraInformativa: BarraInformativaInterface = {
    app: 'cambio-fondos',
    encendido: true,
    subtitulo:'test',
    titulo: 'test',
    titulo_boton: 'test',
    url:'test'
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    obtenerBarraInformativa: jest.fn(()=>Promise.resolve(barraInformativa)),
    generarObjetoTraza: jest.fn(()=>parametroTraza)
  }

  let parametroTraza: ParametroTraza = new ParametroTraza();

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeClientePage, FormatoCapitalize, FormatoPesoChilenoPipe],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: BarraInformativaService,
          useValue: BarraInformativaServiceMock
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock
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
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('eliminación suscripción uuid', () => {
    component.suscripcionDatosCliente = new Subscription();
    const spySuscribe = jest.spyOn(component.suscripcionDatosCliente, 'unsubscribe')

    component.ionViewDidLeave();
    expect(spySuscribe).toHaveBeenCalled();
  });

  it('barra informativa sin datos - no se debe desplegar', () => {
    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeFalsy();
  });

  it('barra informativa con datos - se debe desplegar', () => {

    datosBarraInformativa.app = 'cambio-fondos';
    datosBarraInformativa.subtitulo = 'test';
    datosBarraInformativa.titulo = 'test';
    datosBarraInformativa.titulo_boton = 'test';

    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeTruthy();
  });

  it('barra informativa sin titulo - no se debe desplegar', () => {

    datosBarraInformativa.app = 'cambio-fondos';
    datosBarraInformativa.subtitulo = 'test';
    datosBarraInformativa.titulo = undefined!;
    datosBarraInformativa.titulo_boton = 'test';

    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeFalsy();
  });

  it('barra informativa sin subtitulo - no se debe desplegar', () => {

    datosBarraInformativa.app = 'cambio-fondos';
    datosBarraInformativa.subtitulo = undefined!;
    datosBarraInformativa.titulo = 'test'!;
    datosBarraInformativa.titulo_boton = 'test';

    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeFalsy();
  });

  it('barra informativa sin titulo boton - no se debe desplegar', () => {

    datosBarraInformativa.app = 'cambio-fondos';
    datosBarraInformativa.subtitulo = 'test';
    datosBarraInformativa.titulo = 'test'!;
    datosBarraInformativa.titulo_boton = undefined!;

    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeFalsy();
  });

  it('barra informativa opcion app invalida - no se debe desplegar', () => {

    datosBarraInformativa.app = 'tracking';
    datosBarraInformativa.subtitulo = 'test';
    datosBarraInformativa.titulo = 'test'!;
    datosBarraInformativa.titulo_boton = 'test';

    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeFalsy();
  });

  it('barra informativa opcion app invalida y url valida - se debe desplegar', () => {

    datosBarraInformativa.app = 'tracking';
    datosBarraInformativa.url = 'http://www.google.cl';
    datosBarraInformativa.subtitulo = 'test';
    datosBarraInformativa.titulo = 'test'!;
    datosBarraInformativa.titulo_boton = 'test';

    expect(component.validarDesliegueBarra(datosBarraInformativa)).toBeTruthy();
  });

  it('obtener datos barra informativa', async () => {
    await component.obtenerBarraInformativa();

    expect(component.datosBarraInformativa).toBeDefined();
  });

  it('obtener datos barra informativa sin datos', () => {
    datosBarraInformativa = undefined!;
    component.datosBarraInformativa = undefined!;
    component.obtenerBarraInformativa();

    expect(component.datosBarraInformativa).toBeUndefined();
  });

  it('validar texto nulo', () => {
    const texto:string = undefined!;
    expect(component.validarTexto(texto)).toBeFalsy();
  });

  it('validar texto vacio', () => {
    const texto:string = '';
    expect(component.validarTexto(texto)).toBeFalsy();
  });


  it('redireccionar barra con url', () => {
    const spyBrowser = jest.spyOn(UtilServiceMock, 'openWithSystemBrowser');

    datosBarraInformativa = {
      app: 'tracking',
      encendido: true,
      subtitulo: 'test',
      titulo: 'test',
      titulo_boton: 'test',
      url: 'http://www.google.cl'
    };

    component.datosBarraInformativa = datosBarraInformativa;
    component.redireccionarBarra();

    expect(spyBrowser).toHaveBeenCalled();
  });

  it('redireccionar barra con app', () => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateForward');

    datosBarraInformativa = {
      app: 'cambio-fondos',
      encendido: true,
      subtitulo: 'test',
      titulo: 'test',
      titulo_boton: 'test',
      url: 'http://www.google.cl'
    };

    component.datosBarraInformativa = datosBarraInformativa;
    component.redireccionarBarra();

    expect(navCtrl.navigateForward).toHaveBeenCalled();
  });

  it('Formatear texto Cuenta Obligatorio', () => {
    const nombreCuenta = component.formatearNombreProducto('Cuenta Obligatoria', 'CCICO');
    
    expect(nombreCuenta).toBe('Cuenta</br>Obligatoria')
  });

  it('Formatear texto Cuenta con texto "de"', () => {
    const nombreCuenta = component.formatearNombreProducto('Cuenta de APV', 'APV');
    
    expect(nombreCuenta).toBe('Cuenta de</br>APV')
  });

  it('Formatear texto Cuenta 2', () => {
    const nombreCuenta = component.formatearNombreProducto('Cuenta 2', 'CAV');
    
    expect(nombreCuenta).toBe('Cuenta 2')
  });

  it('Error saldos discordantes', () => {
    GiroMock.validarGiro.mockReturnValue(throwError({ status: 500, error: {}}));

    component.validarSaldoDiscordanteTipoCuenta('1');

    expect(ContextoAPPMock.ocultarLoading).toHaveBeenCalled();
  });

  it('mostrar toast biometria', () => {
    const spyToast = jest.spyOn(UtilServiceMock, 'mostrarToastIcono');
    const spyToastSetStorage = jest.spyOn(UtilServiceMock, 'setStorageData');    
    const spyToastGetStorage = jest.spyOn(UtilServiceMock, 'setStorageData');    

    component.ngOnInit();

    expect(spyToast).toHaveBeenCalled();
    expect(spyToastSetStorage).toHaveBeenCalled();
    expect(spyToastGetStorage).toHaveBeenCalled();
  });

  it('registrar traza  - exito', async () => {

    let parametroTraza: ParametroTraza = new ParametroTraza();
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    
    await component.registrarTrazabilidad();
    expect(spyTraza).toHaveBeenCalled();

  });
});