import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { LiquidacionGeneradoComponent } from './liquidacion-generado.component';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import {DatePipe} from "@angular/common";
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('LiquidacionGeneradoComponent', () => {
  let component: LiquidacionGeneradoComponent;
  let fixture: ComponentFixture<LiquidacionGeneradoComponent>;
  let contextoApp: ContextoAPP;
  
  const NavMock = {
    navigateBack: jest.fn(),
    navigateForward: jest.fn(),
    navigateRoot: jest.fn(),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquidacionGeneradoComponent ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer,
        HttpClientUtil,
        HttpClient,
        HttpHandler,
        ContextoAPP,
        DatePipe,
        AppAvailability,
        {
          provide: NavController,
          useValue: NavMock
        },
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();

    contextoApp = TestBed.inject(ContextoAPP);
  }));

  beforeEach(() => {
    const cliente = {
      primerNombre: '',
      segundoNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      correoElectronico:  '',
      rut: 0,
      digitoVerificadorRut:  '',
      sexo:  '',
      fechaAfiliacion:  '',
      fechaIncorporacion:  '',
      idMaePersona:  '',
      edad:  '',
      esPensionado:  '',
      telefonoCelular:  '',
      saldoSimulacion:  '',
      rentaImponible:  ''
    }

    contextoApp.datosCliente = new DatosUsuario(cliente);

    fixture = TestBed.createComponent(LiquidacionGeneradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Error obteniendo comprobante', fakeAsync (async () => {
  
    await component.descargarPdfBase64();
    tick(7000);
  }));

  it('cancelar', async() => {
    component.volverHome();
    expect(NavMock.navigateRoot).toHaveBeenCalled();
  });

});
