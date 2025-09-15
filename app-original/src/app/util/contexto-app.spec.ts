import { TestBed, getTestBed } from '@angular/core/testing';

import { HttpTestingController } from '@angular/common/http/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { UrlSerializer } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ContextoAPP } from './contexto-app';
import { BarraInformativaService } from '../services/api/restful/barra-informativa.service';
import { of, throwError } from 'rxjs';
import { ParametroTraza } from 'src/app/util/parametroTraza';

describe('ContextoAPP', () => {
  let service: ContextoAPP;
  let injector: TestBed;

  const datosBarraInformativa = {
    app: 'cambio-fondos',
    encendido: true,
    subtitulo: 'test',
    titulo: 'test',
    titulo_boton: 'test',
    url: 'http://www.google.cl'
  };

  const BarraInformativaServiceMock = {
    obtenerDatosBarraInformativa: jest.fn(() => of(datosBarraInformativa))
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        {
          provide: BarraInformativaService,
          useValue: BarraInformativaServiceMock
        }
      ]
    });

    service = TestBed.inject(ContextoAPP);
    injector = getTestBed();
  });
  
  /**
   * Creación del componente
   */
  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

  it('obtencion datos barra informativa', () => {
    const spyService  = jest.spyOn(BarraInformativaServiceMock, 'obtenerDatosBarraInformativa');
    service.obtenerBarraInformativa();

    expect(spyService).toHaveBeenCalled();
  });

  it('error obtencion datos barra informativa', () => {
    const spyService  = jest.spyOn(BarraInformativaServiceMock, 'obtenerDatosBarraInformativa');
    BarraInformativaServiceMock.obtenerDatosBarraInformativa.mockReturnValue(throwError({ status: 500, error: {}}));

    service.obtenerBarraInformativa();

    expect(spyService).toHaveBeenCalled();
  });

  it('obtencion document dom', () => {
    const document = service.obtenerElementoDOM();

    expect(document).toBeDefined();
  });

  it('generar objeto para trazas', async () => {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza : parametroTraza,
      uuid : '',
      rut: '',
      dv: '',
    }

    expect(service.generarObjetoTraza(datosGenerales, parametroTraza)).toBeDefined();
  });
});
