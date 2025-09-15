import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { of } from 'rxjs';
import { ChileanCurrencyPipe } from 'src/app/pipes/chilean-currency.pipe';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent, ChileanCurrencyPipe],
      providers: [
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
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('limpiar variable titulo al volver atrás', () => {
      component.backButton();

      expect(component.titulo).toBeUndefined();
  });
});
