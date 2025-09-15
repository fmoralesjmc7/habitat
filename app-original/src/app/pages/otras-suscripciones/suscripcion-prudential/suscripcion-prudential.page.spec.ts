import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuscripcionPrudentialPage } from './suscripcion-prudential.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { UtilService } from 'src/app/services';
import { LlamadaSaldosConsolidados } from 'src/app/util/llamada-saldos-consolidados';

describe('SuscripcionPrudentialPage', () => {
  let component: SuscripcionPrudentialPage;
  let fixture: ComponentFixture<SuscripcionPrudentialPage>;

  // Mocks para los servicios
  const LlamadaSaldosConsolidadosMock = {
    obtenerDatosPrudential: jest.fn(() => of({})),
    validarClientePrudential: jest.fn(() => of({})),
    registrarDatosPrudential: jest.fn(() => of({})),
  };

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn(),
    generarObjetoTraza: jest.fn(),
  };

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    generarUuid: jest.fn(() => 'test'),
  };

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuscripcionPrudentialPage],  // Componente que se está probando
      imports: [
        CommonModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of() },
        },
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock,
        },
        {
          provide: LlamadaSaldosConsolidados,
          useValue: LlamadaSaldosConsolidadosMock,  // Mock de LlamadaSaldosConsolidados
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuscripcionPrudentialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
