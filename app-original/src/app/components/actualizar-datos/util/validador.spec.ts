import { TestBed, getTestBed } from '@angular/core/testing';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { UrlSerializer, Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ValidadorActualizarDatos } from './validador';
import { DatosActualizarUsuario } from 'src/app/pages/actualizar-datos/util/datos.actualizar.usuario';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';

describe('ValidadorActualizarDatos', () => {
  let service: ValidadorActualizarDatos;
  let injector: TestBed;

  const datosUsuario = { "primer_nombre": "ttest", "segundo_nombre": "", "apellido_paterno": " test", "apellido_materno": " test", "sexo": "MASCULINO", "id_nacionalidad": 36, "estado_civil": "", "ultima_actualizacion": "2022-07-26T17:45:31-04:00", "renta": "1074036", "id_renta": -1, "id_profesion": -1, "id_cargo": 7, "tipo_suscripcion_cartola": -1, "telefonos": [{ "codigo_area": "9", "numero_telefono": "57703098", "tipo_telefono": "CELULAR", "id_tipo_telefono": 4, "id_telefono_contacto": 518936092, "id_jerarquia": 7 }, { "codigo_area": "9", "numero_telefono": "57703098", "tipo_telefono": "CELULAR", "id_tipo_telefono": 4, "id_telefono_contacto": 518936091, "id_jerarquia": 7 }], "correos": [{ "correo": "CERTDEVHABITAT@GMAIL.COM", "tipo_correo": "PART", "id_tipo_correo": 1, "id_email_persona": 5010754484, "id_tipo_jerarquia": 7 }], "direcciones": [{ "id_mae_direccion": 716257590, "id_pais": 36, "nombre_pais": "CHILE", "id_region": 13, "nombre_region": "METROPOLITANA", "id_ciudad": 265, "nombre_ciudad": "SANTIAGO", "id_comuna": 301, "nombre_comuna": "PROVIDENCIA", "calle": "A", "numero": "10", "departamento": "", "block": "", "villa": "", "prioridad": "COM", "id_prioridad": 2, "id_jerarquia": 2, "fecha_creacion": "2020-09-03T09:56:01-04:00" }, { "id_mae_direccion": 718055457, "id_pais": -1, "nombre_pais": "", "id_region": 13, "nombre_region": "METROPOLITANA", "id_ciudad": -1, "nombre_ciudad": "", "id_comuna": -1, "nombre_comuna": "", "calle": "ESMERALDA", "numero": "1457", "departamento": "", "block": "", "villa": "", "prioridad": "PART", "id_prioridad": 1, "id_jerarquia": 7, "fecha_creacion": "2022-07-26T17:45:31-04:00" }], "empleadores": [{ "rut": "98000100", "dv": "8", "razon_social": "A.F.P. HABITAT S.A.", "ultima_cotizacion": "" }] };
  const routerSpy =  jest.fn();
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AES256,
        FileOpener,
        UrlSerializer,
        HttpClient,
        HttpHandler,
        DatosActualizarUsuario,
        AppAvailability,
        {
          provide: Router, useValue: routerSpy
        }
      ]
    });

    service = TestBed.inject(ValidadorActualizarDatos);
    injector = getTestBed();
  });

  /**
   * Creación del componente
   */
  it('Creación componente', () => {
    service.datosUsuario = new DatosActualizarUsuario();
    service.datosUsuario.iniciarDatos(datosUsuario, 16071760, '2');
    expect(service).toBeTruthy();
  });

  it('Validar Correo Comercial - Suscripción correo comercial sin correo', () => {
    service.datosUsuario.esSuscripcionCorreoComercial = true;
    service.datosUsuario.correoComercial = {
      correo: ''
    }

    expect(service.validadorCorreoComercial()).toBeTruthy();
  });

  it('Validar Correo Comercial - Suscripción correo comercial con correo invalido', () => {
    service.datosUsuario.esSuscripcionCorreoComercial = false;
    service.datosUsuario.correoComercial = {
      correo: 'test'
    }

    expect(service.validadorCorreoComercial()).toBeTruthy();
  });

  it('Validar Correo Comercial - Suscripción correo comercial con correo valido', () => {
    service.datosUsuario.esSuscripcionCorreoComercial = false;
    service.datosUsuario.correoComercial = {
      correo: 'test@test.cl'
    }

    expect(service.validadorCorreoComercial()).toBeFalsy();
  });

  it('Validar Correo Particular - Suscripción correo particular con correo valido', () => {
    service.datosUsuario.correoParticular = {
      correo: 'test@test.cl'
    }

    expect(service.validadorCorreoParticular()).toBeFalsy();
  });

  it('Validar Correo Particular - Suscripción correo particular con correo invalido', () => {
    service.datosUsuario.correoParticular = {
      correo: 'test@test'
    }

    expect(service.validadorCorreoParticular()).toBeTruthy();
  });

  it('Validar Correo Particular - Suscripción correo particular con correo vacío', () => {
    service.datosUsuario.correoParticular = {
      correo: ''
    }

    expect(service.validadorCorreoParticular()).toBeTruthy();
  });

  it('Validar codigo area - sin codigo de area seleccionado', () => {
    const telefono = {
      numero_telefono: 123,
      codigo_area: ''
    }

    const listadoCodigosArea = [{ codigo: 123 }, { codigo: 1234 }]

    expect(service.validadorCodigoArea(telefono, listadoCodigosArea)).toBeTruthy();
  });

  it('Validar codigo area - codigo de area seleccionado valido', () => {
    const telefono = {
      numero_telefono: 123,
      codigo_area: 123
    }

    const listadoCodigosArea = [{ codigo: 123 }, { codigo: 1234 }]

    expect(service.validadorCodigoArea(telefono, listadoCodigosArea)).toBeFalsy();
  });

  it('Validar codigo area - codigo de area seleccionado invalido', () => {
    const telefono = {
      numero_telefono: 123,
      codigo_area: 1235
    }

    const listadoCodigosArea = [{ codigo: 123 }, { codigo: 1234 }]

    expect(service.validadorCodigoArea(telefono, listadoCodigosArea)).toBeTruthy();
  });

  it('Validar telefono - valido', () => {
    const telefono = {
      numero_telefono: '12345678'
    }

    expect(service.validadorTelefono(telefono)).toBeFalsy();
  });

  it('Validar telefono - invalido menor a 6 digitos', () => {
    const telefono = {
      numero_telefono: '12345'
    }

    expect(service.validadorTelefono(telefono)).toBeTruthy();
  });

  it('Validar telefono - invalido mayor a 9 digitos', () => {
    const telefono = {
      numero_telefono: '1234567890'
    }

    expect(service.validadorTelefono(telefono)).toBeTruthy();
  });

  it('Validar telefono - invalido mayor a 9 digitos', () => {
    service.datosUsuario.celularUsuario = {
      numero_telefono: ''
    }

    expect(service.validadorCelular()).toBeTruthy();
  });

  it('Validar celular - invalido menor a 8 digitos', () => {
    service.datosUsuario.celularUsuario = {
      numero_telefono: '1234567'
    }

    expect(service.validadorCelular()).toBeTruthy();
  });

  it('Validar celular - invalido mayor a 8 digitos', () => {
    service.datosUsuario.celularUsuario = {
      numero_telefono: '123456789'
    }

    expect(service.validadorCelular()).toBeTruthy();
  });

  it('Validar celular - valido', () => {
    service.datosUsuario.celularUsuario = {
      numero_telefono: '12345678'
    }

    expect(service.validadorCelular()).toBeFalsy();
  });

  it('Validar calle vacía', () => {
    const direccion = {
      calle: ''
    }

    expect(service.validarCalle(direccion)).toBeTruthy();
  });

  it('Validar calle vacía', () => {
    const direccion = {
      calle: undefined
    }

    expect(service.validarCalle(direccion)).toBeTruthy();
  });

  it('Validar calle valida', () => {
    const direccion = {
      calle: '123'
    }

    expect(service.validarCalle(direccion)).toBeFalsy();
  });

  it('Validar numero calle vacía', () => {
    const direccion = {
      numero: undefined
    }

    expect(service.validarNumero(direccion)).toBeTruthy();
  });

  it('Validar numero calle valida', () => {
    const direccion = {
      numero: '123'
    }

    expect(service.validarNumero(direccion)).toBeFalsy();
  });

  it('Validar nacionalidad - nacionalidad invalida', () => {
    const listado = [
      {
        id_nacionalidad: 11
      }
    ]
    expect(service.validarNacionalidad(16, listado)).toBeTruthy();
  });

  it('Validar nacionalidad - nacionalidad vacia', () => {
    const listado = [
      {
        id_nacionalidad: 11
      }
    ]
    expect(service.validarNacionalidad('', listado)).toBeTruthy();
  });

  it('Validar nacionalidad - nacionalidad valida', () => {
    const listado = [
      {
        id_nacionalidad: 11
      }
    ]
    expect(service.validarNacionalidad(11, listado)).toBeFalsy();
  });



  it('Validar region - region invalida', () => {
    const listado = [
      {
        id_region: 11
      }
    ]

    const direccion = {
      id_region: 16
    }

    expect(service.validarRegion(direccion, listado)).toBeTruthy();
  });

  it('Validar region - region vacia', () => {
    const listado = [
      {
        id_region: 11
      }
    ]

    const direccion = {
      id_region: ''
    }

    expect(service.validarRegion(direccion, listado)).toBeTruthy();
  });

  it('Validar region - region valida', () => {
    const listado = [
      {
        id_region: 11
      }
    ]

    const direccion = {
      id_region: 11
    }

    expect(service.validarRegion(direccion, listado)).toBeFalsy();
  });

  it('Validar comuna - comuna invalida', () => {
    const listado = [
      {
        id_comuna: 11
      }
    ]

    const direccion = {
      id_comuna: 16
    }

    expect(service.validarComuna(direccion, listado)).toBeTruthy();
  });

  it('Validar comuna - comuna vacia', () => {
    const listado = [
      {
        id_comuna: 11
      }
    ]

    const direccion = {
      id_comuna: ''
    }

    expect(service.validarComuna(direccion, listado)).toBeTruthy();
  });

  it('Validar comuna - comuna valida', () => {
    const listado = [
      {
        id_comuna: 11
      }
    ]

    const direccion = {
      id_comuna: 11
    }

    expect(service.validarComuna(direccion, listado)).toBeFalsy();
  });

  it('Validar ciudada - ciudada invalida', () => { 
    const listado = [
      {
        id_ciudad: 11
      }
    ]

    const direccion = {
      id_ciudad: 16
    }

    expect(service.validarCiudad(direccion, listado)).toBeTruthy();
  });

  it('Validar ciudada - ciudada vacia', () => { 
    const listado = [
      {
        id_ciudad: 11
      }
    ]

    const direccion = {
      id_ciudad: ''
    }

    expect(service.validarCiudad(direccion, listado)).toBeTruthy();
  });

  it('Validar ciudada - ciudada valida', () => { 
    const listado = [
      {
        id_ciudad: 11
      }
    ]

    const direccion = {
      id_ciudad: 11
    }

    expect(service.validarCiudad(direccion, listado)).toBeFalsy();
  });
});
