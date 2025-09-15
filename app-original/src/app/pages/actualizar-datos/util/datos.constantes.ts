/**
   * Constantes utilizadas por las pantallas de giro
 */
export const CONSTANTES_ACTUALIZAR_DATOS = {
    OPCION_LABORALES: "Datos Laborales",
    ID_TELEFONO_CELULAR: 4,
    ID_TELEFONO_PART: 1,
    ID_TELEFONO_COM: 2,
    ID_CORREO_PART: 1,
    ID_CORREO_COM: 2,
    ID_JERARQUIA: 2,
    ID_PRIORIDAD: 2,
    TIPO_SUSC_CORREO_PART: 1,
    TIPO_SUSC_CORREO_COM: 2,
    TIPO_SUSC_VACIA : -1,
    ID_COD_PAIS_SIN_RECIDENCIA: 190,
    ID_COD_SIN_CIUDAD: 303,
    ID_COD_SIN_COMUNA: 347,
    ID_COD_SIN_REGION: 99,
    ID_COD_CHILE: 36,
    GLOSA_CHILE: 'CHILE',
    ID_TIPO_DIRECCION_PART: 1,
    ID_TIPO_DIRECCION_COM: 2,
    MIN_NUMERO_TELEFONO : 6,
    MAX_NUMERO_TELEFONO : 9,
    DIGITOS_NUMERO_CELULAR : 8,
    MENSAJE_VALIDACION: "Debes completar los datos obligatorios.",
    SIN_TELEFONO_VALIDO: "Sin telefono valido",
    VALIDADOR_INPUT_NORMAL: "input normal",
    VALIDADOR_INPUT_ROJO: "input red",
    TEXTO_CAMPOS_SIN_COMPLETAR: "Completa los datos obligatorios",
    TEXTO_FORMATO_CORREO: "El Email es inválido",
    TELEFONO_CONTACT: '223406900',
    PREFIJO_NUMERO: "569",
    SMS_APLICACION: "doComprobanteContactoAction",
    TOAST_VALIDACION_NUMERO_SMS_PARAM: ":CANTIDAD_INTENTOS",
    TOAST_VALIDACION_NUMERO_SMS: "Intento :CANTIDAD_INTENTOS de 5. Te hemos enviado un SMS con tu clave dinámica. Por favor, espera unos segundos.",
    TOAST_ERROR_ENVIO_CORREO: "Se ha generado un problema al enviar Email con el comprobante. Para más información, comunícate a nuestro Contact Center al 600 220 2000.",
    CODIGO_ERROR_MAX_SMS: "005",
    CODIGO_VERDADERO_SMS: "true",
    CODIGO_ERROR_ERROR_CODIGO: "-1",
    CODIGO_ERROR_MAX_INTENTOS: "-2",
    INDEX_INICIAL_INPUT_VALIDAR: -1,
    MAX_INTENTOS_FALLIDOS: 3,
    ID_SIN_INFORMACION: -1,
    INDEX_INPUT_VALIDAR : 5 ,// VALIDADOR INPUT 5 , ENCARGADO DE LLAMAR A FUNCION VALIDAR.
    TIPO_PANTALLA_CONTACTO : 1,
    TIPO_PANTALLA_LABORALES : 2,
    SIN_FECHA_ULTIMA_COTIZACION : "S/I",
    OBJETO_TELEFONO_VACIO : {
      "codigo_area": "",
      "numero_telefono": "",
      "id_tipo_telefono": 0,
      "id_telefono_contacto": 0,
      "id_jerarquia": 2
    },
    OBJETO_CORREO_VACIO : {
      "correo": "",
      "id_tipo_correo": 0,
      "id_email_persona": 0,
      "id_tipo_jerarquia": 2
    },
    OBJETO_DIRECCION_VACIO : {
      "id_mae_direccion": 0,
      "id_pais": -1,
      "id_region": undefined,
      "id_ciudad": undefined,
      "id_comuna": undefined,
      "calle": "",
      "numero": "",
      "departamento": "",
      "block": "",
      "villa": "",
      "id_prioridad": 0,
      "id_jerarquia": 2
    },

    CODIDO_TRAZA_EXITO: 0,
    DATOS_TRAZA_ERROR: 5,
    CODIDO_TRAZA_FINAL: 1,
    CODIDO_TRAZA_EXITO_HOME: 15300,
    DATOS_TRAZA_EXITO_HOME: "Paso 1 Home Actualizacion Datos EXITO",
    CODIDO_TRAZA_EXITO_ERROR: 15370,
    DATOS_TRAZA_EXITO_ERROR: "Paso 1 Home Actualizacion Datos ERROR",

    CODIDO_TRAZA_INICIO_CONTACTO: 15310,
    DATOS_TRAZA_INICIO_CONTACTO: "Paso 2.1 Datos Contacto Inicio",
    CODIDO_TRAZA_GUARDAR_CONTACTO_EXITO: 15312,
    DATOS_TRAZA_GUARDAR_CONTACTO_EXITO: "Paso 2.1 Datos Contacto Guardar EXITO",
    CODIDO_TRAZA_GUARDAR_CONTACTO_ERROR: 15311,
    DATOS_TRAZA_GUARDAR_CONTACTO_ERROR: "Paso 2.1 Datos Contacto Guardar ERROR",

    CODIDO_TRAZA_INICIO_LABORAL: 15321,
    DATOS_TRAZA_INICIO_LABORAL: "Paso 2.2 Datos Laborales Inicio",
    CODIDO_TRAZA_GUARDAR_LABORAL_EXITO: 15323,
    DATOS_TRAZA_GUARDAR_LABORAL_EXITO: "Paso 2.2 Datos Laborales Guardar EXITO",
    CODIDO_TRAZA_GUARDAR_LABORAL_ERROR: 15322,
    DATOS_TRAZA_GUARDAR_LABORAL_ERROR: "Paso 2.2 Datos Laborales Guardar ERROR",

    CODIDO_TRAZA_SOLICITUD_SMS_EXITO: 15371,
    DATOS_TRAZA_SOLICITUD_SMS_EXITO: "Paso 3 Solicitud SMS EXITO",
    CODIDO_TRAZA_SOLICITUD_SMS_ERROR: 15372,
    DATOS_TRAZA_SOLICITUD_SMS_ERROR: "Paso 3 Solicitud SMS ERROR",
    CODIDO_TRAZA_ENVIO_SMS_EXITO: 15373,
    DATOS_TRAZA_ENVIO_SMS_EXITO: "Paso 4 Envío SMS EXITO",
    CODIDO_TRAZA_ENVIO_SMS_ERROR: 15374,
    DATOS_TRAZA_ENVIO_SMS_ERROR: "Paso 4 Envío SMS ERROR",

    CODIDO_TRAZA_FINAL_EXITO: 15599,
    DATOS_TRAZA_FINAL_EXITO: "Paso 4 Éxito final actualización de datos EXITO",
    CODIDO_TRAZA_FINAL_ERROR: 15591,
    DATOS_TRAZA_FINAL_ERROR: "Paso 4 Éxito final actualización de datos ERROR",

    MASCARA_NUMERO: "XXX XXX",
    LISTADO_ERRORES : {
      'datoObligatorio': 'El dato es obligatorio',
      'telefonoObligatorio': 'El teléfono es inválido',
      'emailObligatorio': 'El Email es inválido'
    },
    prioridadBackButton: 9999,
    animacionTeclado: 0,
    regexCorreo: /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}

/**
 * Trazas para datos
 */
const modulo = 'Actualizacion de Datos';
 export const CONSTANTES_TRAZAS_DATOS = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 15,
  HOME: {
      CODIDO_TRAZA_EXITO_ERROR: {
          CODIGO_OPERACION: 15370,
          DATOS: 'Paso 1 Home Actualizacion Datos ERROR',
          EXITO : 5,
          MODULO: 'ActualizacionService'
      },
      CODIDO_TRAZA_EXITO_HOME: {
        CODIGO_OPERACION: 15300,
        DATOS: 'Paso 1 Home Actualizacion Datos EXITO',
        EXITO : 0,
        MODULO: 'ActualizacionService'
      },
  },
  SMS: {
      CODIDO_TRAZA_SOLICITUD_SMS_EXITO: {
          CODIGO_OPERACION: 15371,
          DATOS: 'Paso 3 Solicitud SMS EXITO',
          EXITO : 0,
          MODULO: 'ActualizacionService'
      },
      CODIDO_TRAZA_SOLICITUD_SMS_ERROR: {
        CODIGO_OPERACION: 15372,
        DATOS: 'Paso 3 Solicitud SMS ERROR',
        EXITO : 5,
        MODULO: 'ActualizacionService'
      },
      CODIDO_TRAZA_ENVIO_SMS_EXITO: {
        CODIGO_OPERACION: 15373,
        DATOS: 'Paso 4 Envío SMS EXITO',
        EXITO : 0,
        MODULO: 'ActualizacionService'
      },
      CODIDO_TRAZA_ENVIO_SMS_ERROR: {
        CODIGO_OPERACION: 15374,
        DATOS: 'Paso 4 Envío SMS ERROR',
        EXITO : 5,
        MODULO: 'ActualizacionService'
      },
      CODIDO_TRAZA_FINAL_EXITO: {
        CODIGO_OPERACION: 15599,
        DATOS: 'Paso 4 Éxito final actualización de datos EXITO',
        EXITO : 1,
        MODULO: 'ActualizacionService'
    },
    CODIDO_TRAZA_FINAL_ERROR: {
      CODIGO_OPERACION: 15591,
      DATOS: 'Paso 4 Éxito final actualización de datos ERROR',
      EXITO : 5,
      MODULO: 'ActualizacionService'
    },

      
     

    
  },
  MODAL: {
    CODIDO_TRAZA_INICIO_LABORAL: {
        CODIGO_OPERACION: 15321,
        DATOS: 'Paso 2.2 Datos Laborales Inicio',
        EXITO : 0,
        MODULO: modulo
    },
    CODIDO_TRAZA_INICIO_CONTACTO: {
      CODIGO_OPERACION: 15310,
      DATOS: 'Paso 2.1 Datos Contacto Inicio',
      EXITO : 0,
      MODULO: modulo
    },
    CODIDO_TRAZA_GUARDAR_LABORAL_EXITO: {
      CODIGO_OPERACION: 15323,
      DATOS: 'Paso 2.2 Datos Laborales Guardar EXITO',
      EXITO : 0,
      MODULO: modulo
    },
    CODIDO_TRAZA_GUARDAR_CONTACTO_EXITO: {
      CODIGO_OPERACION: 15312,
      DATOS: 'Paso 2.1 Datos Contacto Guardar EXITO',
      EXITO : 0,
      MODULO: modulo
    },
    CODIDO_TRAZA_GUARDAR_LABORAL_ERROR: {
      CODIGO_OPERACION: 15322,
      DATOS: 'Paso 2.2 Datos Laborales Guardar ERROR',
      EXITO : 5,
      MODULO: modulo
    },
    CODIDO_TRAZA_GUARDAR_CONTACTO_ERROR: {
      CODIGO_OPERACION: 15311,
      DATOS: 'Paso 2.1 Datos Contacto Guardar ERROR',
      EXITO : 5,
      MODULO: modulo
    },
  }
}




