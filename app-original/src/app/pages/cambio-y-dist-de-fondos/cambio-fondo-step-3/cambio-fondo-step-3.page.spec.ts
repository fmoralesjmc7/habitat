import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { of } from 'rxjs';
import { TrazabilidadService } from 'src/app/services';
import { CambioFondoStep3Page } from './cambio-fondo-step-3.page';

describe('CambioFondoStep3Page', () => {
  let component: CambioFondoStep3Page;
  let fixture: ComponentFixture<CambioFondoStep3Page>;

  const trazabilidadMock = {
    registraTrazaUUID: jest.fn(() => of(false))
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioFondoStep3Page ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler, 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ idSolicitud: 123, productos: '[{ "id": "123" }]', correoExitoso: true, numeroFolio: 123 })
          },
        },
        {
          provide: TrazabilidadService,
          useValue: trazabilidadMock
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
    fixture = TestBed.createComponent(CambioFondoStep3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar trazabilidad', async () => {
    const spy = jest.spyOn(trazabilidadMock, 'registraTrazaUUID');

    await component.registrarTrazabilidad();
    
    expect(component.uuid).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });
});
