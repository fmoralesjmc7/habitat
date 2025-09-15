import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { HomePage } from './home.page';
import { of } from 'rxjs';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { TrazabilidadService } from 'src/app/services';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { ContextoAPP } from 'src/app/util/contexto-app';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePage ],
      providers: [ 
        HttpClient, 
        HttpHandler, 
        UrlSerializer,
        AES256,
        FileOpener,
        HttpClientUtil,
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
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29790;
    parametroTraza.datos =  "HOME CDA";
    parametroTraza.exito = 0
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion);
    expect(spyTraza).toHaveBeenCalled();
  });
});
