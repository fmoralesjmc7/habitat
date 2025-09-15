/**
   * Constantes utilizadas por las pantallas del módulo planes de ahorro
 */

export const CONSTANTES_NOTIFICACIONES_HOME = {

  TITULO_MODULO: 'Notificaciones',
  INGRESO_DESDE_INICIO: 'inicio',
  INGRESO_DESDE_REFRESH: 'refresh',
  NOTIFICACIONES_EN_SERVICIO: 20,

  SIN_NOTIFICACIONES: 'No tienes notificaciones',
  TEXTO_BOTON_VOLVER: 'Volver al Home',

  NOMBRE_NOTIFICACIONES_MEMORIA: 'notificaciones-leidas',
  ESTADO_NO_LEIDAS_MEMORIA: 'tiene-no-leidos'

};

const datos = 'Paso 2 Ver detalle mensaje';
export const TRAZAS_NOTIFICACIONES = {
  CODIGO_SISTEMA : 100,
  MODULO : "CENTRO DE NOTIFICACIONES",

  //MARCAS APV
  COD_NOTIFICACIONES_INICIO : {codigo: 30400, datos: 'Paso 0 INICIO'},
  SELECCION_LISTADO_NOTIFICACIONES_EXITO: {codigo: 30419, datos: 'Paso 1 seleccion listado de Notificaciones EXITO'},
  SELECCION_LISTADO_NOTIFICACIONES_ERROR: {codigo: 30414, datos: 'Paso 1 seleccion listado de Notificaciones ERROR'},

  VER_DETALLE_NOTIFICACION_EXITO: {codigo: 30410, datos: datos},
  VER_DETALLE_NOTIFICACION_ERROR: {codigo: 30405, datos: datos},

  TEXTO_EXITO: ' EXITO',
  TEXTO_ERROR: ' ERROR'
}

export const CONSTANTES_TRAZA_GENERAL = {
  SUCURSAL : 98,
  CANAL : "APPMOBILE",
  URL : "",
  UUID : "f8d12f01-ac09-4b72-8bcc-1a865dbac836",
  USUARIO : "INTERNET",
  ESTADO_EXITO: 1,
  ESTADO_FAIL: 5,
  ESTADO_NEUTRO: 0
}

/**
 * Trazas para Notificaciones
 */
const modulo = 'CENTRO DE NOTIFICACIONES';
 export const CONSTANTES_TRAZAS_NOTIFICACIONES = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 37,
  HOME: {
      COD_NOTIFICACIONES_INICIO: {
          CODIGO_OPERACION: 30400,
          DATOS: 'Paso 0 INICIO',
          EXITO : 0,
          MODULO: modulo
      },
      SELECCION_LISTADO_NOTIFICACIONES_EXITO: {
        CODIGO_OPERACION: 30419,
        DATOS: 'Paso 1 seleccion listado de Notificaciones EXITO',
        EXITO : 1,
        MODULO: modulo
      },
      SELECCION_LISTADO_NOTIFICACIONES_ERROR: {
        CODIGO_OPERACION: 30414,
        DATOS: 'Paso 1 seleccion listado de Notificaciones ERROR',
        EXITO : 5,
        MODULO: modulo
      }
    },
    DETALLE: {
      VER_DETALLE_NOTIFICACION_EXITO: {
          CODIGO_OPERACION: 30410,
          DATOS: datos,
          EXITO : 1,
          MODULO: modulo
      },
      VER_DETALLE_NOTIFICACION_ERROR: {
        CODIGO_OPERACION: 30405,
        DATOS: datos,
        EXITO : 5,
        MODULO: modulo
    },
    }
  }

