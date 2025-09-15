import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ENV } from 'src/environments/environment';
import { TokenTocResponse, ValidacionTokenResponse } from '../../data/clave-unica/clave-unica.response';

import { LiquidacionesService } from './liquidaciones.service';

describe('LiquidacionesService', () => {
  let service: LiquidacionesService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(LiquidacionesService);
    injector = getTestBed();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Creación componente disponibles', () => {
    expect(service).toBeTruthy();
  }); 

  it('Ejecuta metodo obtener liquidaciones', (done) => {

    service.consultarPeriodos('02-10-2021','25-10-2021',54019335, '5').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });
    const request = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/54019335-5/CertificadoLiquidacionPension/ObtenerPeriodos`);
    expect(request.request.method).toBe("POST");
    request.flush('');
  }); 

  it('Ejecuta metodo obtener liquidaciones', (done) => {

    service.solicitarLiquidacion(54019335,'5','02-10-2021','25-10-2021').subscribe(response => {
      expect(response).toBeDefined();
      done();
    });
    const request = httpMock.expectOne(`${ENV.base_url}/api/v1/clientes/54019335-5/CertificadoLiquidacionPension/ObtenerPDF`);
    expect(request.request.method).toBe("POST");
    request.flush('');
  }); 
 
});
