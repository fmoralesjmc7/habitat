import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule,
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular';
import { AppComponent } from './app.component';
// import { TranslateModule } from '@ngx-translate/core'
// import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { UtilService } from './services';
import { ContextoAPP } from './util/contexto-app';
import { SucursalesService } from './services/sucursales/sucursal.service';
// import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx'
// import { FileOpener } from '@capacitor-community/file-opener'
import { provideRouter, UrlSerializer } from '@angular/router';
// import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx'
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Capacitor } from '@capacitor/core';
// import { AntiJail } from 'anti-jail';
import { of } from 'rxjs';

interface CordovaPlugins {
  iRoot: {
    isRooted(
      success: (isRooted: boolean) => void,
      error: (err: any) => void
    ): void;
  };
}

// Dummy standalone para la ruta
@Component({ standalone: true, template: '<p>Tutorial</p>' })
class TutorialPage {}

jest.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    requestPermissions: jest.fn().mockResolvedValue({ receive: 'granted' }),
    register: jest.fn().mockResolvedValue(undefined),
    checkPermissions: jest.fn().mockResolvedValue(undefined),
    addListener: jest.fn().mockResolvedValue({ remove: jest.fn() }),
    removeAllListeners: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => false, getPlatform: () => 'android' },
}));
jest.mock('@capacitor/text-zoom', () => ({
  TextZoom: { set: () => true },
}));
jest.mock('@capacitor/splash-screen', () => ({
  SplashScreen: { hide: jest.fn() },
}));
jest.mock('@capacitor/preferences', () => ({
  Preferences: { get: jest.fn() },
}));

jest.mock('@capacitor/device', () => ({
  Device: {
    getInfo: () => ({
      model: 'xiaomi',
      isVirtual: false,
    }),
  },
}));

jest.mock('@capacitor/screen-orientation', () => ({
  ScreenOrientation: {
    lock: jest.fn().mockResolvedValue(undefined),
    unlock: jest.fn().mockResolvedValue(undefined),
    addListener: jest.fn().mockResolvedValue({ remove: jest.fn() }),
    // opcional: expón un "state" si lo usas
    orientation: { type: 'portrait-primary' },
  },
  OrientationLockType: { PORTRAIT: 'portrait', LANDSCAPE: 'landscape' },
}));

jest.mock('@capacitor-firebase/analytics', () => ({
  FirebaseAnalytics: {
    setEnabled: jest.fn(),
    setConsent: jest.fn(),
  },
}));

// jest.mock('@ionic/angular', () => ({
//   Platform: {
//     is: jest.fn(),
//     ready: jest.fn().mockResolvedValue(true),
//     height: jest.fn().mockReturnValue(1000),
//   },
//   NavController: {
//     navigateForward: jest.fn(),
//     navigateBack: jest.fn(),
//     navigateRoot: jest.fn(),
//     // Agrega otros métodos según sea necesario
//   },
//   MenuController: {
//     toggle: jest.fn(),
//   },
//   IonicModule: {
//     forRoot: jest.fn(),
//   },
// }));

const mockPlatform = {
  is: jest.fn(),
  ready: jest.fn().mockResolvedValue(true),
  height: jest.fn().mockReturnValue(1000),
  pause: { subscribe: jest.fn().mockReturnValue(of(true)) },
};
const mockNavController = {
  navigateForward: jest.fn(),
  navigateBack: jest.fn(),
  navigateRoot: jest.fn(),
};
const mockMenuController = { toggle: jest.fn() };

jest.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setStyle: jest.fn(),
    setBackgroundColor: jest.fn(),
  },
}));
jest.mock('@capacitor/keyboard', () => ({
  Keyboard: { hide: jest.fn() },
}));

const mockUtilService = {
  getStorageData: jest.fn(),
  setStorageData: jest.fn(),
  setLogEvent: jest.fn(),
  openWithSystemBrowser: jest.fn(),
  onLangChange: { subscribe: jest.fn() },
};

const mockSucursalesService = {
  eventoEliminarMapa: jest.fn(),
};

jest.mock('@capacitor/app', () => ({
  App: { addListener: jest.fn() },
}));
jest.mock('@capacitor/browser', () => ({
  Browser: { open: jest.fn(), close: jest.fn() },
}));

const mockAES256 = {
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

const mockFileOpener = {
  open: jest.fn().mockResolvedValue(true),
};

const mockUrlSerializer = {
  parse: jest.fn(),
  stringify: jest.fn(),
};

const mockAppAvailability = {
  check: jest.fn(),
};

// Mock de IRoot y AntiJail
const mockIRoot = {
  isRooted: jest.fn(),
};

jest.mock('', () => ({}));
const mockAntiJail = {
  validate: jest.fn(),
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        IonicModule.forRoot(),
        // TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        TutorialPage,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TitleCasePipe,
        provideHttpClientTesting(),
        provideRouter([{ path: 'tutorial', component: TutorialPage }]),
        // {
        //   provide: TranslateModule,
        //   useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
        //   deps: [HttpClient]
        // },
        { provide: Platform, useValue: mockPlatform },
        { provide: NavController, useValue: mockNavController },
        { provide: MenuController, useValue: mockMenuController },
        { provide: UtilService, useValue: mockUtilService },
        { provide: ContextoAPP, useValue: {} },
        { provide: SucursalesService, useValue: mockSucursalesService },
        // { provide: AES256, useValue: mockAES256 },
        // { provide: FileOpener, useValue: mockFileOpener },
        { provide: UrlSerializer, useValue: mockUrlSerializer },
        // { provide: AppAvailability, useValue: mockAppAvailability },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should initialize language', () => {
  //   component.initTranslate(null)
  //   expect(component.language).toBe(component.CONSTANTES.LANGUAGE)
  // })
  it('should toggle', () => {
    component.toggleMenu();
    expect(mockMenuController.toggle).toHaveBeenCalled();
  });

  it('debería retornar true si el dispositivo está rooteado en Android', async () => {
    (globalThis as any).IRoot = {
      isRooted: jest.fn((successCallback) => {
        successCallback(true); // Devuelve true
      }),
    };

    component.platformDevice = 'android';
    fixture.detectChanges();

    const result = await component.isDeviceRoot();
    expect(result).toBe(true);
  });

  xit('debería retornar true si AntiJail.detecta que el dispositivo está rooteado en iOS', async () => {
    (globalThis as any).IRoot = {
      isRooted: jest.fn((successCallback) => {
        successCallback(false);
      }),
    };

    mockAntiJail.validate.mockResolvedValueOnce({ status: true });

    component.platformDevice = 'ios';
    fixture.detectChanges();

    const result = await component.isDeviceRoot();
    expect(result).toBe(true);
  });

  it('debería retornar true si el dispositivo está rooteado o si es un emulador en Android', async () => {
    jest.spyOn(component, 'isDeviceRoot').mockResolvedValueOnce(true);

    component.platformDevice = 'android';
    fixture.detectChanges();

    const result = await component.validaRootEmulador();

    expect(result).toBe(true);
  });
});
