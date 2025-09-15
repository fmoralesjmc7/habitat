import { TestBed, getTestBed } from '@angular/core/testing';

import { GiroService } from './giro.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RequestValidacionCuenta, ResponseValidacionCuenta } from 'src/app/pages/giro-de-ahorro/util/validacion-cuenta';
import { ENV, environment } from 'src/environments/environment';

describe('GiroService', () => {
  let service: GiroService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // TODO: Actualizar
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(GiroService);
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

  /**
   * Mock de request que se ejecuta en el método.
   * Retorna dummy de datos que se captura dentro del subscribe.
   */
  it('Ejecuta metodo traza descarga PDF', (done) => {

    const respuesta: ResponseValidacionCuenta = {
        return: ''
    };

    const request: RequestValidacionCuenta = {
        codi_banco: '51',
        nmro_cuenta: '123456',
        nrut_cuenta: '17977164-0',
        tipo_cuenta: undefined!
    };

    service.validarCuentaCliente(request).subscribe(response => {
      expect(response).toBe(respuesta);
      done();
    });

    /**
     * Mock de request que se ejecuta en el método.
     * Retorna dummy de datos que se captura dentro del subscribe.
     */
    const req = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/giro/lista-negra/${request.nrut_cuenta}`);
    expect(req.request.method).toBe("POST");
    req.flush(respuesta);
  });
});
