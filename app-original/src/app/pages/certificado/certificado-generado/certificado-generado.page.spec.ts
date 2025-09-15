import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { CertificadoGeneradoPage } from './certificado-generado.page';
import { TrazabilidadService } from 'src/app/services';
import { of } from 'rxjs';
import {DatePipe} from "@angular/common";
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('CertificadoGeneradoPage', () => {
  let component: CertificadoGeneradoPage;
  let fixture: ComponentFixture<CertificadoGeneradoPage>;
  let contextoApp: ContextoAPP;
  
  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadoGeneradoPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer,
        HttpClientUtil,
        HttpClient,
        HttpHandler,
        ContextoAPP,
        DatePipe,
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        }, 
        AppAvailability
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

    fixture = TestBed.createComponent(CertificadoGeneradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza  - exito', async () => {

    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    component.codigoTipoCertificado = 'TCR-VCPR' ;
    await component.registrarTrazabilidad(8210);
    expect(spyTraza).toHaveBeenCalled();

  });

});
