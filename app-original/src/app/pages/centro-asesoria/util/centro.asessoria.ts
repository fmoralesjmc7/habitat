/**
 * Trazas para Centro asesoría
 */
const modulo = 'Publicaciones CDA'
const moduloTrip = 'Ben Trib APV';
const moduloRent = 'Comp Rent MF';
const datosRent = 'Rentabilidad Error Paso 3';
const datosVideo = 'Sim Pension Video';
const moduloComp = 'Comp Rent AFP';
 export const CONSTANTES_TRAZAS_CENTRO = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 37,
  HOME: {
    INIT: {
      CODIGO_OPERACION: 29790,
      DATOS: 'HOME CDA',
      EXITO : 0,
      MODULO: 'Home CDA'
    },
    ERROR: {
      CODIGO_OPERACION: 29795,
      DATOS: 'Home Error - Publicaciones',
      EXITO : 1,
      MODULO: 'Home CDA'
    },
    EXITO: {
      CODIGO_OPERACION: 29799,
      DATOS: 'Home Exito',
      EXITO : 1,
      MODULO: 'Home CDA'
    },
  },
  ARTICLES: {
    INIT_EXITO: {
      CODIGO_OPERACION: 29839,
      DATOS: 'Exito Home Publicaciones',
      EXITO : 1,
      MODULO: modulo
    },
    INIT_HOME: {
      CODIGO_OPERACION: 29800,
      DATOS: 'Home Publicacion',
      EXITO : 0,
      MODULO: modulo
    },
    CALL_SERVICE_ERROR: {
      CODIGO_OPERACION: 29805,
      DATOS: 'Error Home Publicaciones',
      EXITO : 5,
      MODULO: modulo
    },
  },
  BENEFIT_SIMULATOR: {
    INIT: {
      CODIGO_OPERACION: 29695,
      DATOS: 'Beneficios Step 1',
      EXITO : 0,
      MODULO: moduloTrip
    },
    NEXT_SLIDE: {
      CODIGO_OPERACION: 29700,
      DATOS: 'Beneficios Step 2',
      EXITO : 0,
      MODULO: moduloTrip
    },
    GO_BACK1: {
      CODIGO_OPERACION: 29695,
      DATOS: 'Beneficios Step 1 (volver)',
      EXITO : 0,
      MODULO: moduloTrip
    },
    GO_BACK0: {
      CODIGO_OPERACION: 29690,
      DATOS: 'Beneficios Step 0 (volver)',
      EXITO : 0,
      MODULO: moduloTrip
    },
    CALL_SERVICE: {
      CODIGO_OPERACION: 29739,
      DATOS: '',
      EXITO : 1,
      MODULO: moduloTrip
    },
    CALL_SERVICE_ERROR: {
      CODIGO_OPERACION: 29730,
      DATOS: 'Error',
      EXITO : 5,
      MODULO: moduloTrip
    },
    SIMULATE_AGAIN: {
      CODIGO_OPERACION: 29695,
      DATOS: 'Beneficios Step 1 (volver a simular)',
      EXITO : 0,
      MODULO: moduloTrip
    },
    CHANGE_REGIME: {
      CODIGO_OPERACION: 26697,
      DATOS: '',
      EXITO : 0,
      MODULO: moduloTrip
    },
    
  },
  BENCHMARK_FUNDS: {
    INIT: {
      CODIGO_OPERACION: 29761,
      DATOS: 'Rentabilidad Paso 1 Inicio Ingreso Monto',
      EXITO : 0,
      MODULO: moduloRent
    },
    NEXT_SLIDE: {
      CODIGO_OPERACION: 29765,
      DATOS: 'Rentabilidad Paso 2 Seleccion de Fondos',
      EXITO : 0,
      MODULO: moduloRent
    },
    CALL_SERVICE: {
      CODIGO_OPERACION: 29769,
      DATOS: 'Rentabilidad Paso 3 Simulación',
      EXITO : 1,
      MODULO: moduloRent
    },
    CALL_SERVICE_ERROR: {
      CODIGO_OPERACION: 29767,
      DATOS: datosRent,
      EXITO : 5,
      MODULO: moduloRent
    },
    SIMULATE_AGAIN: {
      CODIGO_OPERACION: 29769,
      DATOS: 'Rentabilidad Paso 3 Simulación',
      EXITO : 1,
      MODULO: moduloRent
    },
    SIMULATE_AGAIN_ERROR: {
      CODIGO_OPERACION: 29767,
      DATOS: datosRent,
      EXITO : 5,
      MODULO: moduloRent
    },
    GO_TO: {
      CODIGO_OPERACION: 29761,
      DATOS: 'Rentabilidad Paso 1 Inicio Ingreso Monto (volver)',
      EXITO : 0,
      MODULO: moduloRent
    },
  },
  TAX_BENCHMARK_START: {
    INIT: {
      CODIGO_OPERACION: 29690,
      DATOS: 'Beneficios Step 0',
      EXITO : 0,
      MODULO: 'Ben Trib APV'
    },
  },
  SIMULATOR_START: {
    INIT: {
      CODIGO_OPERACION: 29640,
      DATOS: 'Simulador Step 0',
      EXITO : 0,
      MODULO: datosVideo
    },
  },
  BENCHMARK_START: {
    INIT: {
      CODIGO_OPERACION: 29740,
      DATOS: 'Rentabilidad Paso 0',
      EXITO : 0,
      MODULO: moduloComp
    },
  },
  BENCHMARK: {
    INIT: {
      CODIGO_OPERACION: 29741,
      DATOS: 'Rentabilidad Paso 1 Inicio Ingreso Ahorro',
      EXITO : 0,
      MODULO: moduloComp
    },
    NEXT_SLIDE: {
      CODIGO_OPERACION: 29745,
      DATOS: 'Rentabilidad Paso 2 Seleccion Fondo',
      EXITO : 0,
      MODULO: moduloComp
    },
    CALL_SERVICE: {
      CODIGO_OPERACION: 29759,
      DATOS: 'Rentabilidad Paso 3 Simulacion',
      EXITO : 1,
      MODULO: moduloComp
    },
    CALL_SERVICE_ERROR: {
      CODIGO_OPERACION: 29750,
      DATOS: datosRent,
      EXITO : 5,
      MODULO: moduloComp
    },
    GO_TO: {
      CODIGO_OPERACION: 29741,
      DATOS: 'Rentabilidad Paso 1 Inicio Ingreso Ahorro (volver)',
      EXITO : 0,
      MODULO: moduloComp
    },
    CHANGE_DIFFERENCE: {
      CODIGO_OPERACION: 29755,
      DATOS: 'Rentabilidad Habitat vs x',
      EXITO : 0,
      MODULO: moduloComp
    },
    SIMULATE_AGAIN: {
      CODIGO_OPERACION: 29759,
      DATOS: 'Rentabilidad Paso 3 Simulacion',
      EXITO : 1,
      MODULO: moduloComp
    },
    SIMULATE_AGAIN_ERROR: {
      CODIGO_OPERACION: 29750,
      DATOS: datosRent,
      EXITO : 5,
      MODULO: moduloComp
    },
  },
  SIMULATOR: {
    INIT: {
      CODIGO_OPERACION: 29641,
      DATOS: 'Simulador Step 1',
      EXITO : 0,
      MODULO: datosVideo
    },
    NEXT_SLIDE1: {
      CODIGO_OPERACION: 29645,
      DATOS: 'Simulador Step 2',
      EXITO : 0,
      MODULO: datosVideo
    },
    NEXT_SLIDE2: {
      CODIGO_OPERACION: 29650,
      DATOS: 'Simulador Step 3',
      EXITO : 0,
      MODULO: datosVideo
    },
    DO_SIMULATION: {
      CODIGO_OPERACION: 29689,
      DATOS: 'Simulacion Step 3 (boton simular)',
      EXITO : 1,
      MODULO: datosVideo
    },
    GO_BACK1: {
      CODIGO_OPERACION: 29640,
      DATOS: 'Simulador Step 0 (volver)',
      EXITO : 0,
      MODULO: datosVideo
    },
    GO_BACK2: {
      CODIGO_OPERACION: 29641,
      DATOS: 'Simulador Step 1 (volver)',
      EXITO : 0,
      MODULO: datosVideo
    },
    GO_BACK3: {
      CODIGO_OPERACION: 29645,
      DATOS: 'Simulador Step 2 (volver)',
      EXITO : 0,
      MODULO: datosVideo
    },
    SEND_MAIL: {
      CODIGO_OPERACION: 29670,
      DATOS: 'enviar correo',
      EXITO : 0,
      MODULO: datosVideo
    },
    SEND_MAIL_EXITO: {
      CODIGO_OPERACION: 29671,
      DATOS: 'exito correo',
      EXITO : 1,
      MODULO: datosVideo
    },
    SEND_MAIL_ERROR: {
      CODIGO_OPERACION: 29672,
      DATOS: 'correo error',
      EXITO : 5,
      MODULO: datosVideo
    },
    SIMULATE_AGAIN: {
      CODIGO_OPERACION: 29641,
      DATOS: 'Simulador Step 1 (volver a simular)',
      EXITO : 0,
      MODULO: datosVideo
    },
    CALL_SERVICE_ERROR: {
      CODIGO_OPERACION: 29685,
      DATOS: 'Error',
      EXITO : 5,
      MODULO: datosVideo
    },
    IMPROVE_PENSION: {
      CODIGO_OPERACION: 29663,
      DATOS: 'Simulador Step 5 B',
      EXITO : 0,
      MODULO: datosVideo
    },
    IMPROVE_PENSION2: {
      CODIGO_OPERACION: 29660,
      DATOS: '',
      EXITO : 0,
      MODULO: datosVideo
    },
    SHOW_VIDEO: {
      CODIGO_OPERACION: 29665,
      DATOS: 'Simulador Step 5 B',
      EXITO : 1,
      MODULO: datosVideo
    },
    ON_EVENT: {
      CODIGO_OPERACION: 29666,
      DATOS: '',
      EXITO : 0,
      MODULO: datosVideo
    },
  },

}


