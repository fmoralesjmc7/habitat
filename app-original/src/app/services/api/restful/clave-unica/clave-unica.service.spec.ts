import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ENV } from 'src/environments/environment';
import { TokenTocResponse, ValidacionTokenResponse } from '../../data/clave-unica/clave-unica.response';

import { ClaveUnicaService } from './clave-unica.service';

describe('ClaveUnicaService', () => {
  let service: ClaveUnicaService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ClaveUnicaService);
    injector = getTestBed();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Creación componente', () => {
    expect(service).toBeTruthy();
  });

  it('Ejecuta metodo obtener token', (done) => {
    const respuesta: TokenTocResponse = {
      access_token: 'true'
    };

    service.obtenerTokenToc('test', '16071760-2').subscribe(response => {
      expect(response).toBe(respuesta);
      done();
    });

    /**
     * Mock de request que se ejecuta en el método.
     * Retorna dummy de datos que se captura dentro del subscribe.
     */
    const req = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/16071760-2/ClaveUnica/toc/obtener`);
    expect(req.request.method).toBe("POST");
    req.flush(respuesta);
  });  

  it('Ejecuta metodo validar token', (done) => {
    const respuesta: ValidacionTokenResponse = {
      result: 'true'
    };

    service.validarTokenUAF('test', '16071760-2').subscribe(response => {
      expect(response).toBe(respuesta);
      done();
    });

    /**
     * Mock de request que se ejecuta en el método.
     * Retorna dummy de datos que se captura dentro del subscribe.
     */
    const req = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/16071760-2/ClaveUnica/autenticacion/validar`);
    expect(req.request.method).toBe("POST");
    req.flush(respuesta);
  });  
});
