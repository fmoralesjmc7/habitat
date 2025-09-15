import { DatePipe } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, UrlSerializer, Router } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ClienteService, TrazabilidadService, ClienteDatos } from 'src/app/services';
import { CertificadosService } from 'src/app/services/api/restful/certificados.service';
import { ContextoAPP } from 'src/app/util/contexto-app';
import { DatosUsuario } from 'src/app/util/datos-usuario-contexto';
import { ListadoCertificadosComponent } from './listado-certificados.component';
import { ParametroTraza } from 'src/app/util/parametroTraza';
import { Certificado } from 'src/app/services/api/data/certificado'; 
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { EventEmitter } from '@angular/core';

jest.setTimeout(60000);

describe('ListadoCertificadosComponent', () => {
  let component: ListadoCertificadosComponent;
  let fixture: ComponentFixture<ListadoCertificadosComponent>;
  let contextoApp: ContextoAPP;
  let clienteDatosMock: any;
  let selectCertificadoSpy: jest.SpyInstance;
  
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  
  // Mock de datos para pruebas
  const mockCertificados = [
    { 
      _categoriaAcordion: 'GENERAL', 
      id: 1, 
      tipo: 'Certificado General 1',
      descripcion: 'Descripción del certificado general 1' 
    },
    { 
      categoriaAcordion: 'GENERAL', 
      id: 2, 
      tipo: 'Certificado General 2',
      descripcion: 'Descripción del certificado general 2' 
    },
    { 
      _categoriaAcordion: 'SALDOS', 
      id: 3, 
      tipo: 'Certificado de Saldo 1',
      descripcion: 'Descripción del certificado de saldo 1' 
    },
    { 
      categoriaAcordion: 'COTI', 
      id: 4, 
      tipo: 'Certificado de Cotización 1',
      descripcion: 'Descripción del certificado de cotización 1' 
    },
    { 
      _categoriaAcordion: 'PENSIONADO', 
      id: 5, 
      tipo: 'Certificado Pensionado 1',
      descripcion: 'Descripción del certificado de pensionado 1' 
    },
    { 
      categoriaAcordion: 'CARTOLAS', 
      id: 6, 
      tipo: 'Cartola 1',
      descripcion: 'Descripción de cartola 1' 
    }
  ];

  // Mocks HTML para probar setupAccordionListeners
  const mockAccordionHTML = `
    <ion-accordion-group>
      <ion-accordion value="general">Header General</ion-accordion>
      <ion-accordion value="saldos">Header Saldos</ion-accordion>
    </ion-accordion-group>
  `;

  // Configuración de pruebas
  beforeEach(async () => {
    // Mock del servicio ClienteDatos
    clienteDatosMock = {
      esPensionado: of(false)
    };

    await TestBed.configureTestingModule({
      declarations: [ListadoCertificadosComponent],
      providers: [
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler,
        FormBuilder,
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({listaTipoCuenta : ['{"nombreCortoProducto" : "123", "producto": ""}'], certificado: '{}'})
          },
        },
        {
          provide: Router, 
          useValue: { navigate: jest.fn() }
        },
        {
          provide: ClienteDatos,
          useValue: clienteDatosMock
        },
        AppAvailability
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
    
    contextoApp = TestBed.inject(ContextoAPP);
  });

  beforeEach(() => {
    const cliente = {
      primerNombre: 'Juan',
      segundoNombre: 'Pedro',
      apellidoPaterno: 'González',
      apellidoMaterno: 'López',
      correoElectronico: 'juan.gonzalez@example.com',
      rut: 12345678,
      digitoVerificadorRut: '9',
      sexo: 'M',
      fechaAfiliacion: '2020-01-01',
      fechaIncorporacion: '2020-01-01',
      idMaePersona: '123456',
      edad: '35',
      esPensionado: 'false',
      telefonoCelular: '912345678',
      saldoSimulacion: '10000000',
      rentaImponible: '1000000'
    };
    
    contextoApp.datosCliente = new DatosUsuario(cliente);
    fixture = TestBed.createComponent(ListadoCertificadosComponent);
    component = fixture.componentInstance;
    
    // Mock del EventEmitter para poder espiarlo
    selectCertificadoSpy = jest.spyOn(component.selectCertificado, 'emit');
    
    // Configurar los datos de prueba
    component.listaTipoCertificado = [...mockCertificados];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debe suscribirse al observable esPensionado', async () => {
      // Espiar el método buscarCertificados
      const buscarCertificadosSpy = jest.spyOn(component, 'buscarCertificados');
      
      // Llamar a ngOnInit manualmente
      await component.ngOnInit();
      
      // Verificar que esPensionado está actualizado
      expect(component.esPensionado).toBe(false);
      
      // Verificar que buscarCertificados fue llamado para cada categoría
      expect(buscarCertificadosSpy).toHaveBeenCalledWith('GENERAL');
      expect(buscarCertificadosSpy).toHaveBeenCalledWith('SALDOS');
      expect(buscarCertificadosSpy).toHaveBeenCalledWith('COTI');
      expect(buscarCertificadosSpy).toHaveBeenCalledWith('PENSIONADO');
      expect(buscarCertificadosSpy).toHaveBeenCalledWith('CARTOLAS');
    });

    it('debe llenar los arrays de certificados por categoría', async () => {
      // Reset de los arrays
      component.generales = [];
      component.saldos = [];
      component.cotizaciones = [];
      component.pensionados = [];
      component.cartolas = [];
      
      // Llamar a ngOnInit manualmente
      await component.ngOnInit();
      
      // Verificar que los arrays se han llenado correctamente
      expect(component.generales.length).toBe(2);
      expect(component.saldos.length).toBe(1);
      expect(component.cotizaciones.length).toBe(1);
      expect(component.pensionados.length).toBe(1);
      expect(component.cartolas.length).toBe(1);
    });
  });

  describe('buscarCertificados', () => {
    it('debe filtrar certificados por tipo correctamente', () => {
      const generales = component.buscarCertificados('GENERAL');
      expect(generales.length).toBe(2);
      expect(generales[0].id).toBe(1);
      expect(generales[1].id).toBe(2);
      
      const saldos = component.buscarCertificados('SALDOS');
      expect(saldos.length).toBe(1);
      expect(saldos[0].id).toBe(3);
    });

    it('debe manejar formatos diferentes de la propiedad categoría', () => {
      // Crear una lista que use ambos formatos
      component.listaTipoCertificado = [
        { _categoriaAcordion: 'TEST', id: 1 },
        { categoriaAcordion: 'TEST', id: 2 }
      ];
      
      const resultado = component.buscarCertificados('TEST');
      expect(resultado.length).toBe(2);
    });

    it('debe devolver un array vacío si no hay coincidencias', () => {
      const resultado = component.buscarCertificados('INEXISTENTE');
      expect(resultado).toEqual([]);
      expect(resultado.length).toBe(0);
    });

    it('debe devolver un array vacío si la lista de certificados está vacía', () => {
      component.listaTipoCertificado = [];
      const resultado = component.buscarCertificados('GENERAL');
      expect(resultado).toEqual([]);
    });

    it('debe devolver un array vacío si la lista de certificados es undefined', () => {
      component.listaTipoCertificado = undefined as unknown as any[];
      const resultado = component.buscarCertificados('GENERAL');
      expect(resultado).toEqual([]);
    });
  });

  describe('seleccionarCertificado', () => {
    it('debe emitir el certificado seleccionado', () => {
      const certificado = { id: 1, tipo: 'Test' };
      component.seleccionarCertificado(certificado);
      
      expect(selectCertificadoSpy).toHaveBeenCalledWith(certificado);
      expect(selectCertificadoSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupAccordionListeners', () => {
    it('debe configurar listeners para los acordeones', () => {
      // Mock más completo para el DOM
      const mockAccordionGroup = {
        addEventListener: jest.fn()
      };
      
      // Mock de document.querySelector para devolver nuestro objeto mock
      jest.spyOn(document, 'querySelector').mockReturnValue(mockAccordionGroup as any);
      
      // Llamar al método
      component.setupAccordionListeners();
      
      // Avanzar el tiempo para que se ejecute el setTimeout
      jest.advanceTimersByTime(500);
      
      // Verificaciones
      expect(document.querySelector).toHaveBeenCalledWith('ion-accordion-group');
      expect(mockAccordionGroup.addEventListener).toHaveBeenCalledWith('ionChange', expect.any(Function));
    });
  });
});
