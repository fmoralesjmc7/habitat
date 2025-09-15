import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OtrasSuscripcionesPage } from "./otras-suscripciones.page";
import { ActivatedRoute, Routes } from "@angular/router";
import { of, throwError } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ComponentsModule } from "src/app/components/components.module";
import { IonicModule, NavController, LoadingController } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { SuscripcionPrudentialPageModule } from "./suscripcion-prudential/suscripcion-prudential.module";
import { DesuscripcionPrudentialPage } from "./desuscripcion-prudential/desuscripcion-prudential.page";
import { ExitoDesuscripcionPage } from "./desuscripcion-prudential/exito-desuscripcion/exito-desuscripcion.page";
import { PipesModule } from "src/app/pipes/pipes.module";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { ContextoAPP } from "src/app/util/contexto-app";
import { UtilService } from "src/app/services";
import { LlamadaSaldosConsolidados } from "src/app/util/llamada-saldos-consolidados";

describe("OtrasSuscripcionesPage", () => {
  let component: OtrasSuscripcionesPage;
  let fixture: ComponentFixture<OtrasSuscripcionesPage>;

  const LlamadaSaldosConsolidadosMock = {
    obtenerDatosPrudential: jest.fn(() => of({})),
    validarClientePrudential: jest.fn(() => Promise.resolve({ estadoConsolidacion: "ACEPTADO" })),
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
    generarUuid: jest.fn(() => "test")
  };

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  };

  const LoadingControllerMock = {
    create: jest.fn(() => {
      const loadingMock: Partial<HTMLIonLoadingElement> = {
        present: jest.fn(),
        dismiss: jest.fn(),
        animated: true,
        backdropDismiss: true,
        duration: 3000,
        keyboardClose: true,
        message: "",
        spinner: "crescent",
        cssClass: "",
        showBackdrop: true,
        translucent: true,
      };
      return Promise.resolve(loadingMock as HTMLIonLoadingElement);
    })
  };

  const routes: Routes = [
    {
      path: '',
      component: OtrasSuscripcionesPage
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OtrasSuscripcionesPage,
        DesuscripcionPrudentialPage,
        ExitoDesuscripcionPage,
      ],
      imports: [
        CommonModule,
        IonicModule,
        ComponentsModule,
        SuscripcionPrudentialPageModule,
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        PipesModule,
      ],
      providers: [
        HttpClient,
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
        {
          provide: LoadingController,
          useValue: LoadingControllerMock,
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrasSuscripcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("error Cargar Datos Consolidacion", async () => {
    const spyMock = jest.spyOn(NavMock, 'navigateRoot');
    LlamadaSaldosConsolidadosMock.validarClientePrudential.mockImplementationOnce(() => Promise.reject(new Error("Error en la carga de datos")));
    const loading = await LoadingControllerMock.create();
    const mockNavigationExtras = { someKey: 'someValue' };
    UtilServiceMock.generarNavegacionExtra.mockReturnValueOnce(mockNavigationExtras);
    await component.cargarDatosConsolidacion(loading);
  });

  it("should handle successful consolidation data loading", async () => {
    LlamadaSaldosConsolidadosMock.validarClientePrudential.mockImplementationOnce(() => Promise.resolve({estadoConsolidacion: "C" }));
    const loading = await LoadingControllerMock.create();
    await component.cargarDatosConsolidacion(loading);
    expect(component.mostrarDesuscripcionPrudential).toBe(false);
    expect(component.mostrarSuscribirPrudential).toBe(false);
    expect(component.mostrarNoHabilitada).toBe(true);
    expect(ContextoAPPMock.ocultarLoading).toHaveBeenCalledWith(loading);
  });
});
