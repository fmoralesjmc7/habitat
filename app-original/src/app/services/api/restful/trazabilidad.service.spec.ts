import { TestBed, getTestBed } from '@angular/core/testing';

import { TrazabilidadService } from './trazabilidad.service'; 
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RequestValidacionCuenta, ResponseValidacionCuenta } from 'src/app/pages/giro-de-ahorro/util/validacion-cuenta';
import { ENV, environment } from 'src/environments/environment';

describe('TrazabilidadService', () => {
  let service: TrazabilidadService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(TrazabilidadService);
    injector = getTestBed();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  
  /**
   * Creación del componente
   */
  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

  it('Ejecuta metodo registrar traza', (done) => {

    let parametros = {
      "codigoSistema": 14,
      "codigoOperacion": '',
      "usuario": "INTERNET",
      "rut": 1,
      "dvRut": 9,
      "sucursal": 98,
      "canal": "APPMOBILE",
      "modulo": '',
      "datos": 'datos',
      "url": "",
      "exito": 'exito',
      'uuid': 'uuid'
    };

    service.registraTrazaUUID(parametros, 1, '9').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });

    /**
     * Mock de request que se ejecuta en el método.
     * Retorna dummy de datos que se captura dentro del subscribe.
     */
    const req = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/1-9/uuidtraza`);
    expect(req.request.method).toBe("POST");
    req.flush('');
  });
});
