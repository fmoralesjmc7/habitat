import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { IonicModule, NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ComponentsModule } from 'src/app/components/components.module';
import { UtilService } from 'src/app/services';
import { ClaveUnicaService } from 'src/app/services/api/restful/clave-unica/clave-unica.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { environment } from 'src/environments/environment';
import { ClaveUnicaComponent } from './clave-unica.component';

describe('ClaveUnicaComponent', () => {
  let component: ClaveUnicaComponent;
  let fixture: ComponentFixture<ClaveUnicaComponent>;
  
  const ContextoAPPMock = {
    mostrarLoading: jest.fn(),
    ocultarLoading: jest.fn()
  }

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  const ClaveUnicaServiceMock = {
    obtenerTokenToc: jest.fn(()=>of({access_token: '123'})),
    validarTokenUAF: jest.fn(()=>of({result: 'true'}))
  }

  const UtilServiceMock = {
    openWithSystemBrowser: jest.fn(),
    generarNavegacionExtra: jest.fn(),
    generarUuidRandom: jest.fn(),
  }

  const routerSpy =  jest.fn();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaveUnicaComponent ],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        AppAvailability,
        {
          provide: ActivatedRoute,
          
          useValue: {
            queryParams: of({tokenUAF: '1'})
          },
        },
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
        },
        {
          provide: ClaveUnicaService,
          useValue: ClaveUnicaServiceMock
        },
        {
          provide: UtilService,
          useValue: UtilServiceMock
        },
        {
          provide: Router, useValue: routerSpy
        }
      ],
      imports: [IonicModule.forRoot(), ComponentsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaveUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('cargar componente con tokenUAF (parametro de ActivatedRoute)', () => {
    const spy = jest.spyOn(component, 'validarTokenUAF');
    const spyNav = jest.spyOn(NavMock, 'navigateRoot');

    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spyNav).toHaveBeenCalledWith('actualizar-datos-home');
  });

  it('desplegar login clave unica', async() => {
    const spy = jest.spyOn(UtilServiceMock, 'openWithSystemBrowser');

    await component.desplegarLoginClaveUnica();

    expect(spy).toHaveBeenCalledWith(environment.urlClaveUnicaToc + 123);
  });

  it('error obtener access token', async() => {
    const spy = jest.spyOn(NavMock, 'navigateRoot');

    ClaveUnicaServiceMock.obtenerTokenToc.mockReturnValue(throwError({ status: 500, error: {}}))

    await component.desplegarLoginClaveUnica();

    expect(spy).toHaveBeenCalled();
  });

  it('error validar tokenUAF', async () => {
    jest.resetAllMocks()

    ClaveUnicaServiceMock.validarTokenUAF.mockReturnValue(of({result: 'false'}));
    await component.validarTokenUAF('123');

    expect(component.modalError).toEqual(true);
  });

  it('error servicio validar tokenUAF', async () => {
    jest.resetAllMocks()
    const spyNav = jest.spyOn(NavMock, 'navigateRoot');

    ClaveUnicaServiceMock.validarTokenUAF.mockReturnValue(throwError({ status: 500, error: {}}))
    await component.validarTokenUAF('123');

    expect(spyNav).toHaveBeenCalled();
  });

  it('abrir sitio clave unica', () => {
    jest.resetAllMocks()
    const spy = jest.spyOn(UtilServiceMock, 'openWithSystemBrowser');

    component.abrirClaveUnica();

    expect(spy).toHaveBeenCalled();
  });
});
