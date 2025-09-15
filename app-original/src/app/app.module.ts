import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { missingTranslationHandler, translatePartialLoader } from './config/translation.config';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { HttpRequestInterceptor } from './util/http-request-interceptor';
import { ClienteCuentasDatos, ClienteDatos, ClienteService, DepositoDirectoService, IndicadorService, SeguridadService, SimulacionService, TrazabilidadService, UtilService } from './services';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { PipesModule } from './pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import locale from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientUtil } from './providers/http-client/http-client';
import { UtilCA } from './util/ca-util';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgxsModule } from '@ngxs/store';
import { LoginState } from './state/login.state';

@NgModule({
    declarations: [AppComponent],
    imports: [
        PipesModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxsModule.forRoot([
            LoginState
        ],),
        ComponentsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        OAuthModule.forRoot()  ,// Importa el módulo OAuth2
        IonicModule.forRoot({
            menuType: 'overlay',
            backButtonText: ''
        }),
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: translatePartialLoader,
                deps: [HttpClient],
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useFactory: missingTranslationHandler,
            },
        })
    ],
    providers: [
        AppAvailability,
        AES256,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'es' },
        SimulacionService,
        SeguridadService,
        ClienteService,
        UtilService,
        ClienteDatos,
        ClienteCuentasDatos,
        IndicadorService,
        DepositoDirectoService,
        TrazabilidadService,
        ScreenOrientation,
        FingerprintAIO,
        DatePipe,
        HttpClientUtil,
        UtilCA
        
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
    constructor() {
        registerLocaleData(locale);
    }
}