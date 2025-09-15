import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeClienteDetalleProductoPage } from './home-cliente-detalle-producto.page';
import { ChileanCurrencyPipe } from 'src/app/pipes/chilean-currency.pipe';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeClienteDetalleProductoPage', () => {
  let component: HomeClienteDetalleProductoPage;
  let fixture: ComponentFixture<HomeClienteDetalleProductoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeClienteDetalleProductoPage, FormatoPesoChilenoPipe, ChileanCurrencyPipe],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ producto: ['{"nombreCortoProducto" : "123", "producto": ""}'] })
          },
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeClienteDetalleProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
