import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BenchmarkStartPage } from './benchmark-start.page';
import { TrazabilidadService } from 'src/app/services';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { ContextoAPP } from 'src/app/util/contexto-app';

describe('BenchmarkStartPage', () => {
  let component: BenchmarkStartPage;
  let fixture: ComponentFixture<BenchmarkStartPage>;
  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn()
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchmarkStartPage ],
      providers: [ 
        HttpClient, 
        HttpHandler, 
        UrlSerializer,
        AES256,
        FileOpener,
        {
            provide: TrazabilidadService,
            useValue: TrazabilidadServiceMock
        }, 
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        AppAvailability
     ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([]),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29740;
    parametroTraza.datos =  "Rentabilidad Paso 0";
    parametroTraza.exito = 0
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion);
    expect(spyTraza).toHaveBeenCalled();
  });
});
