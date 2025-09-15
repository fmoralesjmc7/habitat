/**
 * Trazas para CAMBIO DE FONDO
 */
 export const CONSTANTES_CAMBIO_FONDO = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 11,
  STEP1: {
    PASO_INI: {
      CODIGO_OPERACION: 3400,
      DATOS: 'Cambio de fondo / Paso 1 INICIO',
      EXITO : 0,
      MODULO: 'CDF'
    },
    PASO_ERROR: {
      CODIGO_OPERACION: 3407,
      DATOS: 'Cambio de fondo / Paso 2 ERROR',
      EXITO : 5,
      MODULO: 'CDF'
    },
  },
  STEP2: {
    ERROR_SOLICITUD: {
      CODIGO_OPERACION: 3407,
      DATOS: 'Cambio de fondo / Paso 1 ERROR',
      EXITO : 5,
      MODULO: 'CDF'
    }
  },
  STEP3: {
    INICIO: {
      CODIGO_OPERACION: 3403,
      DATOS: 'Cambio de fondo / Paso 3 EXITO',
      EXITO : 1,
      MODULO: 'CDF'
    }
  },
}


