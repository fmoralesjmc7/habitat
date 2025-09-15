import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { AngularDelegate, ModalController } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { UtilCA } from 'src/app/util/ca-util';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HeaderComponentCA } from './header.component';

describe('HeaderComponentCA', () => {
  let component: HeaderComponentCA;
  let fixture: ComponentFixture<HeaderComponentCA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [ HeaderComponentCA ],
      providers: [
        ModalController,
        AngularDelegate,
        HttpClient,
        HttpHandler,
        AES256,
        FileOpener,
        UrlSerializer,
        HttpClientUtil,
        UtilCA,
        ScreenOrientation
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponentCA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test clickBackButton menu', () => {
    component.headerElements.iconRight = 'btn-icon icon-menu-hamb';
    const spyToggle = jest.spyOn(component.menuCtrl, 'toggle');

    component.clickButton('right');
    expect(spyToggle).toHaveBeenCalled();
  });
});