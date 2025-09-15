import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesuscripcionPrudentialPage } from './desuscripcion-prudential.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { LlamadaSaldosConsolidados } from 'src/app/util/llamada-saldos-consolidados';
import { UtilService } from 'src/app/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';

describe('DesuscripcionPrudentialPage', () => {
  let component: DesuscripcionPrudentialPage;
  let fixture: ComponentFixture<DesuscripcionPrudentialPage>;

  const LlamadaSaldosConsolidadosMock = {
    obtenerDatosPrudential: jest.fn(() => of({})),
    validarClientePrudential: jest.fn(() => of({})),
    registrarDatosPrudential: jest.fn(() => of({}))
  };

  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn(),
    registrarTrazabilidad: jest.fn(),
    generarObjetoTraza: jest.fn()
  };

  const UtilServiceMock = {
    setLogEvent: jest.fn(),
    mostrarToast: jest.fn(),
    getStorageUuid: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    generarUuid: jest.fn(() => 'test')
  };

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesuscripcionPrudentialPage ],
      imports: [
        CommonModule,
        IonicModule,
        ComponentsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(),
          }
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
          useValue: LlamadaSaldosConsolidadosMock,
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesuscripcionPrudentialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
