import { TestBed, getTestBed } from '@angular/core/testing';
import { UtilService } from './util.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { UrlSerializer, Router, provideRouter } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ToastController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('UtilService', () => {
  let service: UtilService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  const AppMock = {
    check: jest.fn(),
  };

  const toastElMock = {
    present: jest.fn(),
    onDidDismiss: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn().mockResolvedValue(true),
  };
  const ToastControllerMock = {
    create: jest.fn().mockResolvedValue(toastElMock),
  };

  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  };

  const routerSpy = {
    nav: jest.fn(() => of({})),
  };

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlSerializer,
        HttpClient,
        HttpHandler,
        {
          provide: ToastController,
          useValue: ToastControllerMock,
        },
        {
          provide: NavController,
          useValue: NavMock,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        provideRouter([])
      ],
    });

    service = TestBed.inject(UtilService);
    injector = getTestBed();
    router = TestBed.inject(Router);
  });

  /**
   * Creación del componente
   */
  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

  it('Generación uuid ', () => {
    expect(service.generarUuid()).toBeDefined();
  });

  it('Generación uuid ', () => {
    const spyStorage = jest.spyOn(service, 'getStorageData');
    service.getStorageUuid();

    expect(spyStorage).toHaveBeenCalled();
  });

  it('generar Navegacion Extra', () => {
    expect(service.generarNavegacionExtra('test')).toBeDefined();
  });

  it('mostrar toast', () => {
    const contenido = {
      message: 'test',
      position: 'top',
      cssClass: 'custom-toast',
      duration: 8000,
    };

    const spy = jest.spyOn(ToastControllerMock, 'create');
    service.mostrarToast('test');

    expect(spy).toHaveBeenLastCalledWith(contenido);
  });

  it('mostrar toast con icono', () => {
    const contenido = {
      message: 'test',
      position: 'top',
      cssClass: 'custom-toast icono-toast',
      duration: 5000,
      icon: 'alert-circle-outline',
    };

    const spy = jest.spyOn(ToastControllerMock, 'create');
    service.mostrarToastIcono('test');

    expect(spy).toHaveBeenLastCalledWith(contenido);
  });

  it('mostrar toast con icono y link', () => {
    const contenido = {
      message: 'test',
      position: 'top',
      cssClass: 'custom-toast icono-toast',
      duration: 5000,
      icon: 'alert-circle-outline',
    };

    const spy = jest.spyOn(ToastControllerMock, 'create');
    service.mostrarToastIconoConLink('test', 'test');

    expect(spy).toHaveBeenLastCalledWith(contenido);
  });

  xit('Valida Store ', () => {
    const spyApp = jest.spyOn(AppMock, 'check');
    // TODO: Validar esta prueba
    // service.validarStore();
    AppMock.check.mockReturnValue(true);
    expect(spyApp).toHaveBeenCalled();
  });
});
