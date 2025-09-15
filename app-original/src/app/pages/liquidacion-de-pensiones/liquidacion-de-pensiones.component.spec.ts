import { DatePipe } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { LiquidacionesService } from '../../services/api/restful/liquidaciones/liquidaciones.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { LiquidacionDePensionesComponent } from './liquidacion-de-pensiones.component';
import { CONSTANTES_LIQUIDACION } from './util/constantes.liquidacion'; 

describe('LiquidacionDePensionesComponent', () => {
  let component: LiquidacionDePensionesComponent;
  let fixture: ComponentFixture<LiquidacionDePensionesComponent>;
  let contextoApp: ContextoAPP;

  const LiquidacionesServiceMock = {
    consultarPeriodos: jest.fn(()=>of()),
    solicitarLiquidacion: jest.fn(()=>of())
  }

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    reemplazarTildesTexto: jest.fn(),
    generarObjetoTraza: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionDePensionesComponent ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
        DatePipe,
        {
          provider: LiquidacionesService,
          useValue: LiquidacionesServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({listaTipoCuenta : ['{"nombreCortoProducto" : "123", "producto": ""}'], certificado: '{}'})
          },
        },
        {
          provide: NavController,
          useValue: NavMock
        },
        {
          provide: Router, useValue: routerSpy
        },
        AppAvailability
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
    fixture = TestBed.createComponent(LiquidacionDePensionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error obtener pdf', async() => {
    LiquidacionesServiceMock.solicitarLiquidacion.mockReturnValue(throwError({ status: 500, error: {}}));
    await component.solicitarLiquidacion();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('solicitar liquidacion', async() => {
    component.tipoPeriodo.tipo = CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO;
    component.fechaDesde = '2022-10-24T17:10:00-05:00';
    component.fechaHasta = '2022-10-24T17:10:00-05:00'
    await component.solicitarLiquidacion();

    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('restar fechas', async() => {
    expect(component.restaAnoSegunFechaActual(0)).toBeDefined();
  });

  it('cancelar', async() => {
    component.cancelar();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

  it('error cargar liquidaciones', () => {
    LiquidacionesServiceMock.consultarPeriodos.mockReturnValue(throwError({ status: 500, error: {}}));
    component.cargarLiquidacionesDisponibles();
  });

  it('verificar cantidades', () => {
    component.verificarCantidades();
  });

  it('seleccionar fechas hasta', () => {
    component.tipoPeriodo.tipo = CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO;
    component.fechaDesde = '2022-10-24T17:10:00-05:00';
    component.fechaHasta = '2022-10-24T17:10:00-05:00'
    component.seleccionFechaHasta();
  });

  it('calcular fecha hasta', () => {
    component.tipoPeriodo.tipo = CONSTANTES_LIQUIDACION.RANGO_FECHAS_ABIERTO;
    component.fechaDesde = '2022-10-24T17:10:00-05:00';
    component.fechaHasta = '2022-10-24T17:10:00-05:00'
    component.calcularFechaHasta();
  });

  it('camiar tipo periodo', () => {
    component.cambioTipoPeriodo();
  });

  it('restar años', () => {
    expect(component.restarAnios).toBeDefined();
  });
});
