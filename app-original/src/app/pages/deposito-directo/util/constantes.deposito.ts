/**
 * Trazas para DEPOSITO DIRECTO
 */
 export const CONSTANTES_TRAZAS_DEPOSITO = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 102,
  INGRESO_DATOS: {
    CODIGO_OPERACION: 23200,
    DATOS: 'Ingreso a deposito directo',
    EXITO : 0,
    MODULO: 'ABONO WEB'
  },
  SELECCIONAR_CUENTA_CAV: {
    CODIGO_OPERACION: 23225,
    DATOS: 'Dep Directo C2 Step 1A',
    EXITO : 0,
    MODULO: 'ABONO WEB'
  },
  SELECCIONAR_CUENTA_APV: {
    CODIGO_OPERACION: 23231,
    DATOS: 'Dep Directo APV Step 1A',
    EXITO : 0,
    MODULO: 'ABONO WEB'
  },
  CANCELAR_APV: {
    CODIGO_OPERACION: 23234,
    DATOS: 'Dep Directo C2 Step 2B Sin finalizar(Cancelar)',
    EXITO : 5,
    MODULO: 'ABONO WEB'
  },
  CANCELAR_CAV: {
    CODIGO_OPERACION: 23228,
    DATOS: 'Dep Directo C2 Step 2B Sin finalizar(Cancelar)',
    EXITO : 5,
    MODULO: 'ABONO WEB'
  },
  EXITO_KIPHU_APV: {
    CODIGO_OPERACION: 23214,
    DATOS: 'Dep Directo APV Step 3 Éxito B',
    EXITO : 1,
    MODULO: 'ABONO WEB'
  },
  EXITO_KIPHU_CAV: {
    CODIGO_OPERACION: 23215,
    DATOS: 'Dep Directo C2 Step 3 Éxito B',
    EXITO : 1,
    MODULO: 'ABONO WEB'
  },
  ERROR_KIPHU_APV: {
    CODIGO_OPERACION: 23236,
    DATOS: 'Dep Directo APV Step 3 ERROR',
    EXITO : 5,
    MODULO: 'ABONO WEB'
  },
  ERROR_KIPHU_CAV: {
    CODIGO_OPERACION: 23223,
    DATOS: 'Dep Directo C2 Step 3 Error',
    EXITO : 5,
    MODULO: 'ABONO WEB'
  },
  ERROR_LLAMADA_CAV: {
    CODIGO_OPERACION: 23223,
    DATOS: 'Dep Directo C2 Step 3 Error',
    EXITO : 5,
    MODULO: 'ABONO WEB'
  },
  ERROR_LLAMADA_APV: {
    CODIGO_OPERACION: 23232,
    DATOS: 'Dep Directo APV Step 1A-1F',
    EXITO : 5,
    MODULO: 'ABONO WEB'
  },
}


