import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { of } from 'rxjs';

import { CambioFondoRentabilidadPage } from './cambio-fondo-rentabilidad.page';

describe('CambioFondoRentabilidadPage', () => {
  let component: CambioFondoRentabilidadPage;
  let fixture: ComponentFixture<CambioFondoRentabilidadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioFondoRentabilidadPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler, 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: '{"informacionRentabilidad": { "rentabilidadAfiliado": { "rentabilidadAfiliado": "" } }}', id: 123}),
            snapshot: {
              paramMap: {
                get: jest.fn()
              }
            }
          },
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioFondoRentabilidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
