import { DatePipe } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { of } from 'rxjs';
import { ValorCuotaPage } from './valor-cuota.page';

describe('ValorCuotaPage', () => {
  let component: ValorCuotaPage;
  let fixture: ComponentFixture<ValorCuotaPage>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValorCuotaPage ],
      providers: [
        UrlSerializer, 
        HttpClient, 
        HttpHandler, 
        AES256, 
        FileOpener, 
        DatePipe, 
        AppAvailability
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValorCuotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
