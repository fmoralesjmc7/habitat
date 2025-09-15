import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { FormatoPesoChilenoPipe } from 'src/app/pipes/formato-peso-chileno.pipe';
import { SimulacionService } from 'src/app/services';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { HomeInvitadoStepDosPage } from './home-invitado-step-dos.page';

describe('HomeInvitadoStepDosPage', () => {
  let component: HomeInvitadoStepDosPage;
  let fixture: ComponentFixture<HomeInvitadoStepDosPage>;

  const SimulacionServiceMock = {
    lightConAPV: jest.fn(()=>of())
  }
  
  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn()
  }

  const routerSpy =  jest.fn();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeInvitadoStepDosPage, FormatoPesoChilenoPipe ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({data: 123})
          },
        },
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
    fixture = TestBed.createComponent(HomeInvitadoStepDosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('error indicadores', async() => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');

    await component.ngOnInit();
    expect(navCtrl.navigateRoot).toHaveBeenCalled();
  });

  it('error cambio ahorro', async() => {
    let navCtrl = fixture.debugElement.injector.get(NavController);
    jest.spyOn(navCtrl, 'navigateRoot');
    SimulacionServiceMock.lightConAPV.mockReturnValue(throwError({ status: 500, error: {}}));

    await component.cambioAhorro();
    expect(navCtrl.navigateRoot).toHaveBeenCalled();
  });
});

export class NavMock {
  public navigateBack: Function = (url: string | any[], options: any) => {};
  public navigateForward: Function = (url: string | any[], options: any) => {};
  public navigateRoot: Function = (url: string | any[], options: any) => {};
}
