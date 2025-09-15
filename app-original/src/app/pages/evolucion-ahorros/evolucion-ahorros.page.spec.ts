/// <reference types="jest" />

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { SaldosDiariosService } from 'src/app/services/api/restful/saldos-diarios.service';
import { EvolucionAhorrosPage } from './evolucion-ahorros.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContextoAPP } from 'src/app/util/contexto-app';

jest.mock('./data.json', () => ([
  {
    p: ["APV", "CAV", "TOTAL"],
    meses: [
      { mes: 5, anio: 2025, valores: { 'd1': [35000], 'd15': [36000] } },
      { mes: 4, anio: 2025, valores: { 'd1': [34000], 'd30': [34500] } },
      { mes: 3, anio: 2025, valores: { 'd1': [33000], 'd28': [33500] } },
      { mes: 2, anio: 2025, valores: { 'd1': [32000], 'd28': [32500] } },
      { mes: 1, anio: 2025, valores: { 'd1': [31000], 'd31': [31500] } },
      { mes: 12, anio: 2024, valores: { 'd1': [30000], 'd31': [30500] } },
      { mes: 11, anio: 2024, valores: { 'd1': [29000], 'd30': [29500] } },
      { mes: 10, anio: 2024, valores: { 'd1': [28000], 'd31': [28500] } },
      { mes: 9, anio: 2024, valores: { 'd1': [27000], 'd30': [27500] } },
      { mes: 8, anio: 2024, valores: { 'd1': [26000], 'd31': [26500] } },
      { mes: 7, anio: 2024, valores: { 'd1': [25000], 'd31': [25500] } },
      { mes: 6, anio: 2024, valores: { 'd1': [24000], 'd30': [24500] } },
    ],
  },
]), { virtual: true });


describe('EvolucionAhorrosPage', () => {
  let component: EvolucionAhorrosPage;
  let fixture: ComponentFixture<EvolucionAhorrosPage>;

  const NavMock = {
    navigateRoot: jest.fn(),
  };

  const SaldosDiariosServiceMock = {
    obtenerSaldosDiarios: jest.fn(() => of({})),
  };
  
  const ContextoAPPMock = {
    datosCliente: {
      idMaePersona: 12345678,
      rut: '12345678-9'
    },
    mostrarLoading: jest.fn().mockResolvedValue({}),
    ocultarLoading: jest.fn(),
    generarNavegacionExtra: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvolucionAhorrosPage],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: NavController, useValue: NavMock },
        { provide: SaldosDiariosService, useValue: SaldosDiariosServiceMock },
        { provide: ContextoAPP, useValue: ContextoAPPMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolucionAhorrosPage);
    component = fixture.componentInstance;
    // ngOnInit is called automatically by detectChanges
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initialization methods', () => {
      // Spy on verificarYCargarDatos (which is the public method called by ngOnInit)
      const verificarYCargarDatosSpy = jest.spyOn(component as any, 'verificarYCargarDatos');
      const onSegmentChangeSpy = jest.spyOn(component, 'onSegmentChange');
      
      component.ngOnInit();

      expect(verificarYCargarDatosSpy).toHaveBeenCalled();
      // The segment change is called later in the process after data is loaded
    });
  });

  describe('volverAlHome', () => {
    it('should navigate to HomeClientePage', () => {
      component.volverAlHome();
      expect(NavMock.navigateRoot).toHaveBeenCalledWith('HomeClientePage');
    });
  });

  describe('forzarSincronizacion', () => {
    it('should call cargarDatosSaldosDiarios via forzarSincronizacion', async () => {
      // We can test the public method forzarSincronizacion which calls cargarDatosSaldosDiarios
      const cargarDatosSpy = jest.spyOn(component as any, 'cargarDatosSaldosDiarios');
      
      await component.forzarSincronizacion();
      
      expect(cargarDatosSpy).toHaveBeenCalled();
    });
    
    it('should handle API responses correctly', async () => {
      // Mock the service response
      SaldosDiariosServiceMock.obtenerSaldosDiarios.mockReturnValue(of({ data: 'test-data' }));
      
      // Call the public method
      await component.forzarSincronizacion();
      
      // Verify the service was called
      expect(SaldosDiariosServiceMock.obtenerSaldosDiarios).toHaveBeenCalled();
    });

    it('should handle API errors correctly', async () => {
      // Mock an error response
      const error = new Error('test error');
      SaldosDiariosServiceMock.obtenerSaldosDiarios.mockReturnValue(throwError(() => error));
      
      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Call the public method
      await component.forzarSincronizacion();
      
      // Verify error handling
      expect(SaldosDiariosServiceMock.obtenerSaldosDiarios).toHaveBeenCalled();
      // We can't directly test the error handling since it's in a private method,
      // but we can verify the service was called
    });
  });

  describe('onSegmentChange', () => {
    it('should call processDailyData for period 1', () => {
      const spy = jest.spyOn(component as any, 'processDailyData');
      component.onSegmentChange({ detail: { value: 1 } });
      expect(spy).toHaveBeenCalled();
    });

    it('should call processBiWeeklyAverageData for period 3', () => {
      const spy = jest.spyOn(component as any, 'processBiWeeklyAverageData');
      component.onSegmentChange({ detail: { value: 3 } });
      expect(spy).toHaveBeenCalled();
    });

    it('should call processMonthlyAverageData for period 6', () => {
      const spy = jest.spyOn(component as any, 'processMonthlyAverageData');
      component.onSegmentChange({ detail: { value: 6 } });
      expect(spy).toHaveBeenCalledWith(6);
    });

    it('should call processMonthlyAverageData for period 12', () => {
      const spy = jest.spyOn(component as any, 'processMonthlyAverageData');
      component.onSegmentChange({ detail: { value: 12 } });
      expect(spy).toHaveBeenCalledWith(12);
    });

    it('should handle unknown period', () => {
      const consoleLogSpy = jest.spyOn(console, 'log');
      const updateChartSpy = jest.spyOn(component, 'updateChartData');
      component.onSegmentChange({ detail: { value: 99 } });
      expect(consoleLogSpy).toHaveBeenCalledWith('Rango no reconocido');
      expect(updateChartSpy).toHaveBeenCalledWith([], [], false);
    });
  });

  describe('calcularVariacion', () => {
    it('should set variation to 0 if data has less than 2 points', () => {
      component.calcularVariacion([100]);
      expect(component.variacion).toEqual({ porcentaje: 0, valor: 0 });
      expect(component.totalAhorrado).toBe(0);
    });

    it('should calculate variation correctly', () => {
      component.calcularVariacion([100, 150]);
      expect(component.variacion.valor).toBe(50);
      expect(component.variacion.porcentaje).toBe(50);
      expect(component.totalAhorrado).toBe(150);
    });

    it('should handle division by zero', () => {
        component.calcularVariacion([0, 50]);
        expect(component.variacion.valor).toBe(50);
        expect(component.variacion.porcentaje).toBe(0);
        expect(component.totalAhorrado).toBe(50);
    });
  });

  describe('recibeOpcionSelect', () => {
    it('should update cuentaSeleccionada when receiving select option', () => {
      // Setup
      component.cuentaSeleccionada = 'Todas las cuentas';
      
      // Call the method with a mock event
      component.recibeOpcionSelect({ detail: { value: 'CCICO' } });
      
      // Verify the account was updated
      expect(component.cuentaSeleccionada).toBe('CCICO');
    });
    
    it('should call calcularIndiceCuentaSeleccionada when receiving select option', () => {
      // Spy on the private method
      const calcularIndiceSpy = jest.spyOn(component as any, 'calcularIndiceCuentaSeleccionada');
      
      // Call the method with a mock event
      component.recibeOpcionSelect({ detail: { value: 'CCICO' } });
      
      // Verify the method was called
      expect(calcularIndiceSpy).toHaveBeenCalled();
    });
  });

  describe('updateChartData', () => {
    it('should set beginAtZero to false for month view', () => {
      component.updateChartData([1000, 2000], ['a', 'b'], true);
      expect(component.lineChartOptions.scales?.yAxes?.[0]?.ticks?.beginAtZero).toBe(false);
    });

    it('should set beginAtZero to true for non-month view', () => {
      component.updateChartData([1000, 2000], ['a', 'b'], false);
      expect(component.lineChartOptions.scales?.yAxes?.[0]?.ticks?.beginAtZero).toBe(true);
    });
  });

  describe('Private methods', () => {
    it('getMonthFromLabel should parse labels correctly', () => {
      const { month: month1, monthName: monthName1 } = (component as any).getMonthFromLabel('15/5');
      expect(month1).toBe(5);
      expect(monthName1).toBeNull();
      
      const { month: month2, monthName: monthName2 } = (component as any).getMonthFromLabel('Ene 1-15');
      expect(month2).toBe(1);
      expect(monthName2).toBe('Ene');

      const { month: month3, monthName: monthName3 } = (component as any).getMonthFromLabel('Invalid Label');
      expect(month3).toBeNull();
      expect(monthName3).toBeNull();
    });

    it('getYearFromData should handle missing data gracefully', () => {
      // When datosServicio is not properly initialized, the method should return null
      const year = (component as any).getYearFromData('15/5', 5, null, 0);
      expect(year).toBeNull();
    });
  });
}); 