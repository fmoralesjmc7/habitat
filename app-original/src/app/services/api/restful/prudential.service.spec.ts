import { getTestBed, TestBed } from '@angular/core/testing';
import { PrudentialService } from './prudential.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DetalleSaldosConsolidadosResp, EstadoMandatoPrudential, EstadoMandatoResp, RespuestaRequest, SucripcionPrudentialRequest } from 'src/app/interfaces/prudential';
import { Preferencia, PreferenciaResp } from 'src/app/interfaces/preferencia-saldos';
import { ENV } from 'src/environments/environment';

describe('PrudentialService', () => {
  let service: PrudentialService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let dominio: string = ENV.prudential_back;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(PrudentialService);
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

  it('Ejecuta metodo obtenerEstadoMandato', (done) => {
    const mockEstadoMandatoPrudential: EstadoMandatoPrudential = {resp: "4"};
    service.obtenerEstadoMandato().subscribe(respuesta => {
      expect(respuesta).toBe(mockEstadoMandatoPrudential);
      done()
    });

    const req = httpMock.expectOne(dominio + 'prudential/mandato/consulta-mandato');
    expect(req.request.method).toBe("GET");
    req.flush(mockEstadoMandatoPrudential);
  });

  it('Ejecuta metodo obtenerEstadoConsolidacion', (done) => {
    const mockEstadoMandatoResp: EstadoMandatoResp = {
      body: { O_ESTADO: "3" },
      return: { body: { O_CODIGO: 200, O_MENSAJE: "OK" } },
    };
    service.obtenerEstadoConsolidacion().subscribe(respuesta => {
      expect(respuesta).toBe(mockEstadoMandatoResp);
      done();
    });

    const req = httpMock.expectOne(dominio + 'habitat/consulta-mandato');
    expect(req.request.method).toBe("GET");
    req.flush(mockEstadoMandatoResp);
  });

  it('Ejecuta metodo guardarPreferenciasSaldo', (done) => {
    const mockCreadoPor = "Web";
    const mockFlag = true;
    const respuestaMock  = {
      "body": {
        "O_CODIGO": 0,
        "O_MENSAJE": "OK"
      }
    }
    service.guardarPreferenciaSaldo(mockCreadoPor, mockFlag).subscribe(response => {
      expect(response).toBe(respuestaMock);
      done();
    });

    const req = httpMock.expectOne(dominio + 'habitat/guardar-preferencia');
    expect(req.request.method).toBe("POST");
    req.flush(respuestaMock);
  });

  it('Ejecuta metodo obtenerPreferenciasSaldos', (done) => {
    const mockPreferenciaResp: PreferenciaResp = { flag: 'S' };
    const mockPreferencia: Preferencia = { flag: true };
    service.obtenerPreferenciasSaldos().subscribe(respuesta => {
      expect(respuesta).toEqual(mockPreferencia);
      done();
    });
    const req = httpMock.expectOne(dominio + 'habitat/consultar-preferencia');
    expect(req.request.method).toBe('GET');
    req.flush(mockPreferenciaResp);
  });


  it('Ejecuta metodo obtenerSaldosConsolidados', (done) => {
    const mockDetalleSaldosConsolidados: DetalleSaldosConsolidadosResp = {
      detalleCuentas: [{
        codigoCuenta: '3',
        tipoSaldo: 'CLP',
        tituloCuenta: 'Nombre de cuenta mock',
        valorCuenta: 28000
      }],
      valorTasa: 3.3
    };

    service.obtenerSaldosConsolidados().subscribe(respuesta => {
      expect(respuesta).toBe(mockDetalleSaldosConsolidados);
      done()
    });

    const req = httpMock.expectOne(dominio  + 'prudential/saldos-consolidados');
    expect(req.request.method).toBe("GET");
    req.flush(mockDetalleSaldosConsolidados);
  });

  it('Ejecuta metodo guardarSuscripcionPrudential', (done) => {
    const mockSucripcionPrudentialRequest: SucripcionPrudentialRequest = {
      creadoPor: 'APPMOBILE',
      estado: 'A',
      tipoMandato: 2
    };
    const mockRespuestaRequest: RespuestaRequest = {body: {O_CODIGO: 200, O_MENSAJE: 'OK'}}
    service.guardarSuscripcionPrudential(mockSucripcionPrudentialRequest).subscribe(respuesta => {
      expect(respuesta).toBe(mockRespuestaRequest);
      done()
    });

    const req = httpMock.expectOne(dominio + 'habitat/suscribir-mandato');
    expect(req.request.method).toBe("POST");
    req.flush(mockRespuestaRequest);
  });

});
