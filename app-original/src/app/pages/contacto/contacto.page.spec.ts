import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { ContactoPage } from './contacto.page';

describe('ContactoPage', () => {
  let component: ContactoPage;
  let fixture: ComponentFixture<ContactoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactoPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
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
    fixture = TestBed.createComponent(ContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
