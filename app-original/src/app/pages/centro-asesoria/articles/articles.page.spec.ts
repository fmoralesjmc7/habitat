import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ArticlesPage } from './articles.page';
import { TrazabilidadService } from 'src/app/services';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { of } from 'rxjs';
import { ArticlesService } from 'src/app/services/api/restful/centro_asesoria/articles/articles.service';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';


describe('ArticlesPage', () => {
  let component: ArticlesPage;
  let fixture: ComponentFixture<ArticlesPage>;
  let contextoApp: ContextoAPP;
  
  const TrazabilidadServiceMock = {
    registraTrazaUUID: jest.fn(() => of({}))
  }

  const ArticlesServiceMock = {
    getArticles: jest.fn(() => Promise.resolve())
  }

  const ContextoAPPMock = {
    generarObjetoTraza: jest.fn()
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer,
        HttpClientUtil,
        HttpClient,
        HttpHandler,
        ContextoAPP,
        {
          provide: TrazabilidadService,
          useValue: TrazabilidadServiceMock
        },
        {
          provide: ArticlesService,
          useValue: ArticlesServiceMock
        },
        {
          provide: ContextoAPP,
          useValue: ContextoAPPMock
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

    fixture = TestBed.createComponent(ArticlesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registrar traza  - exito', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    parametroTraza.codigoOperacion = 29839;
    parametroTraza.datos =  "Exito Home Publicaciones";
    parametroTraza.exito = 1
    const spyTraza = jest.spyOn(TrazabilidadServiceMock, 'registraTrazaUUID')
    await component.registrarTrazabilidad(parametroTraza.codigoOperacion);
    expect(spyTraza).toHaveBeenCalled();
  });
});
