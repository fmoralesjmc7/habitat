import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClient } from '@angular/common/http'
import { IonicModule, NavController } from '@ionic/angular'
import { AppComponent } from './app.component'
import { TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { Capacitor } from '@capacitor/core'
import { Platform } from '@ionic/angular'
import { UtilService } from './services'
import { StatusBar } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { TextZoom } from '@capacitor/text-zoom'
import { Keyboard } from '@capacitor/keyboard'
import { PushNotifications } from '@capacitor/push-notifications'
import { ContextoAPP } from './util/contexto-app'
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics'
import { SucursalesService } from './services/sucursales/sucursal.service'
import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx'
import { FileOpener } from '@capacitor-community/file-opener'
import { UrlSerializer } from '@angular/router'
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { TutorialPage } from './pages/tutorial/tutorial'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AntiJail } from 'anti-jail';


interface CordovaPlugins {
  iRoot: {
    isRooted(
      success: (isRooted: boolean) => void,
      error: (err: any) => void
    ): void;
  };
}

const mockScreenOrientation = {
  lock: jest.fn()
}

const mockCapacitor = {
  getPlatform: jest.fn(),
  isPluginAvailable: jest.fn(() => true)
}

const mockPlatform = {
  is: jest.fn(),
  ready: jest.fn().mockResolvedValue(true),
  height: jest.fn().mockReturnValue(1000)
}

const mockUtilService = {
  getStorageData: jest.fn(),
  setStorageData: jest.fn(),
  setLogEvent: jest.fn(),
  openWithSystemBrowser: jest.fn(),
  onLangChange: { subscribe: jest.fn() }
}

const mockStatusBar = {
  setStyle: jest.fn(),
  setBackgroundColor: jest.fn()
}

const mockSplashScreen = {
  hide: jest.fn()
}

const mockTextZoom = {
  set: jest.fn()
}

const mockKeyboard = {
  hide: jest.fn()
}

const mockPushNotifications = {
  checkPermissions: jest.fn(),
  requestPermissions: jest.fn(),
  register: jest.fn(),
  addListener: jest.fn()
}

const mockFirebaseAnalytics = {
  enable: jest.fn()
}

const mockSucursalesService = {
  eventoEliminarMapa: jest.fn()
}

const mockApp = {
  addListener: jest.fn()
}

const mockBrowser = {
  close: jest.fn()
}

const mockAES256 = {
  encrypt: jest.fn(),
  decrypt: jest.fn()
}

const mockFileOpener = {
  open: jest.fn().mockResolvedValue(true)
}

const mockUrlSerializer = {
  parse: jest.fn(),
  stringify: jest.fn()
}

const mockAppAvailability = {
  check: jest.fn()
}

const mockNavController = {
  navigateForward: jest.fn(),
  navigateBack: jest.fn(),
  navigateRoot: jest.fn(),
  // Agrega otros métodos según sea necesario
}

// Mock de IRoot y AntiJail
const mockIRoot = {
  isRooted: jest.fn(),
};

const mockAntiJail = {
  validate: jest.fn()
};

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([{ path: 'tutorial', component: TutorialPage }])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TranslateModule,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
          deps: [HttpClient]
        },
        { provide: ScreenOrientation, useValue: mockScreenOrientation },
        { provide: Capacitor, useValue: mockCapacitor },
        { provide: Platform, useValue: mockPlatform },
        { provide: UtilService, useValue: mockUtilService },
        { provide: StatusBar, useValue: mockStatusBar },
        { provide: SplashScreen, useValue: mockSplashScreen },
        { provide: TextZoom, useValue: mockTextZoom },
        { provide: Keyboard, useValue: mockKeyboard },
        { provide: PushNotifications, useValue: mockPushNotifications },
        { provide: ContextoAPP, useValue: {} },
        { provide: FirebaseAnalytics, useValue: mockFirebaseAnalytics },
        { provide: SucursalesService, useValue: mockSucursalesService },
        { provide: App, useValue: mockApp },
        { provide: Browser, useValue: mockBrowser },
        { provide: AES256, useValue: mockAES256 },
        { provide: FileOpener, useValue: mockFileOpener },
        { provide: UrlSerializer, useValue: mockUrlSerializer },
        { provide: AppAvailability, useValue: mockAppAvailability },
        { provide: NavController, useValue: mockNavController },
        { provide: AntiJail, useValue: mockAntiJail }
      ]
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    Capacitor.platform = 'android'
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('should initialize language', () => {
    component.initTranslate(null)
    expect(component.language).toBe(component.CONSTANTES.LANGUAGE)
  })
  it('should toggle', () => {
    component.toggleMenu()
    expect(component).toBeCalled
  })
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
  it('debería retornar true si AntiJail.detecta que el dispositivo está rooteado en iOS', async () => {
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

})
