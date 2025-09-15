import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ENV } from 'src/environments/environment';
import { BarraInformativaInterface } from '../data/barra-informativa.interface'; 
import { BarraInformativaService } from './barra-informativa.service';

describe('BarraInformativaService', () => {
  let service: BarraInformativaService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(BarraInformativaService);
    injector = getTestBed();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

    /**
   * Mock de request que se ejecuta en el método.
   * Retorna dummy de datos que se captura dentro del subscribe.
   */
  it('Ejecuta metodo obtener datos barra informativa', (done) => {
    const respuesta: BarraInformativaInterface = {
      app: 'cambio-fondos',
      encendido: true,
      subtitulo: 'test',
      titulo: 'test',
      titulo_boton: 'test',
      url: 'http://www.google.cl'
    };

    service.obtenerDatosBarraInformativa().subscribe(response => {
      expect(response).toBe(respuesta);
      done();
    });

    /**
     * Mock de request que se ejecuta en el método.
     * Retorna dummy de datos que se captura dentro del subscribe.
     */
    const req = httpMock.expectOne(`${ENV.base_url}/api/v1/application/barra-informativa-app`);
    expect(req.request.method).toBe("GET");
    req.flush(respuesta);
  });   
});
