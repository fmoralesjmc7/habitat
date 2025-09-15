import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed, tick } from '@angular/core/testing';
import { ENV } from 'src/environments/environment';
import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let service: ClienteService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ClienteService);
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
  it('Ejecuta metodo obtener certificados IOS', (done) => {
    service.solicitarCertificadoIos(16071760, '2', 0, 'TCR-PENS', '', '', 'PENSIONADO').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });
    const request = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/16071760-2/certificado`);
    expect(request.request.method).toBe("POST");
    request.flush('');
  });

  it('Ejecuta metodo obtener certificados Android', async () => {
    const mockValue = { data: 'mocked data' };

    jest.spyOn(service, 'solicitarCertificadoAndroid').mockImplementation(() => Promise.resolve(mockValue));

    const data = await service.solicitarCertificadoAndroid(16071760, '2', 0, 'TCR-PENS', '', '', 'PENSIONADO');
    expect(data).toEqual(mockValue);

    jest.restoreAllMocks();
  });

});
