import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { of } from 'rxjs';
import { ChileanCurrencyPipe } from 'src/app/pipes/chilean-currency.pipe';

import { HomeClienteDetalleSimplePage } from './home-cliente-detalle-simple.page';

describe('HomeClienteDetalleSimplePage', () => {
  let component: HomeClienteDetalleSimplePage;
  let fixture: ComponentFixture<HomeClienteDetalleSimplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeClienteDetalleSimplePage, ChileanCurrencyPipe ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler, 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({producto : ['{"nombreCortoProducto" : "123", "producto": ""}']})
          },
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeClienteDetalleSimplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
