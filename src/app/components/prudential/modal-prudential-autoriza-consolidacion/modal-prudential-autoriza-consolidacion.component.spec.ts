import { IonicModule } from '@ionic/angular';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalPrudentialAutorizaConsolidacionComponent } from "./modal-prudential-autoriza-consolidacion.component";
import { ContextoAPP } from "src/app/util/contexto-app";
import { UtilService } from "src/app/services";
import { PrudentialService } from "src/app/services/api/restful/prudential.service";
import { LlamadaSaldosConsolidados } from "src/app/util/llamada-saldos-consolidados";
import { of } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"; // Si se usa para evitar errores de otros elementos desconocidos

// Mocks de los servicios
class PrudentialServiceMock {
  guardarSuscripcionPrudential = jest.fn().mockReturnValue(of({}));
}

class ContextoAppMock {
  mostrarLoading = jest.fn().mockReturnValue(Promise.resolve("loadingInstance"));
  ocultarLoading = jest.fn();
}

class UtilServiceMock {
  mostrarToastIcono = jest.fn();
}

class LlamadaSaldosConsolidadosMock {
  obtenerDatosPrudential = jest.fn().mockReturnValue(of({}));
  registrarDatosPrudential = jest.fn();
}

describe("ModalPrudentialAutorizaConsolidacionComponent", () => {
  let component: ModalPrudentialAutorizaConsolidacionComponent;
  let fixture: ComponentFixture<ModalPrudentialAutorizaConsolidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPrudentialAutorizaConsolidacionComponent],
      imports: [
        IonicModule.forRoot(),  // IMPORTANTE: Se agrega IonicModule para usar componentes de Ionic como <ion-icon>
      ],
      providers: [
        { provide: PrudentialService, useClass: PrudentialServiceMock },
        { provide: ContextoAPP, useClass: ContextoAppMock },
        { provide: UtilService, useClass: UtilServiceMock },
        { provide: LlamadaSaldosConsolidados, useClass: LlamadaSaldosConsolidadosMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Esto es opcional si no quieres que los errores por otros elementos desconocidos interrumpan tus pruebas
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrudentialAutorizaConsolidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
