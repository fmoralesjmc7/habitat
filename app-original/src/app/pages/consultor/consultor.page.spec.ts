import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;

import { ConsultorPage } from './consultor.page';

describe('ConsultorPage', () => {
  let component: ConsultorPage;
  let fixture: ComponentFixture<ConsultorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultorPage ],
      providers: [ AES256, FileOpener, UrlSerializer, HttpClient, HttpHandler ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
