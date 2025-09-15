import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { SimulacionService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';

import { HomeInvitadoPage } from './home-invitado.page';

describe('HomeInvitadoPage', () => {
  let component: HomeInvitadoPage;
  let fixture: ComponentFixture<HomeInvitadoPage>;

  const SimulacionServiceMock = {
    lightSinAPV: jest.fn(()=>of())
  }
  
  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn()
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeInvitadoPage ],
      providers: [ FormBuilder, HttpClient, HttpHandler, UrlSerializer, AES256, FileOpener,
        {
          provide: SimulacionService,
          useValue: SimulacionServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: NavController,
          useClass: NavMock,
        },
        AppAvailability,
        {
          provide: Router, useValue: routerSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeInvitadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('error simulacion Ligth', async() => {
    component.renta = '100000';
    component.saldo = '100000';
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');
    SimulacionServiceMock.lightSinAPV.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.simulacionLigth();
    expect(navCtrl.navigateRoot).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}
