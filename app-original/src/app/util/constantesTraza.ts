export const TRAZAS_DEP_DIRECTO = {
    CODIGO_SISTEMA : 100,
    MODULO : "ABONO WEB",
    COD_CAV_PASO_1_INICIO : {codigo: 23225, datos: 'Dep Directo C2 Step 1A'},
    COD_CAV_PASO_1_ERROR: {codigo: 23226, datos: 'Dep Directo C2 Step 1A-1F'},
    COD_CAV_PASO_1_ERROR_CARGA_INICIAL: {codigo: 23226, datos: 'Dep Directo ERROR CARGA INICIAL DATOS'},
    COD_CAV_PASO_2_INICIO: {codigo: 23227, datos: 'Dep Directo C2 Step 2'},
    COD_CAV_PASO_2_SIN_FINALIZAR: {codigo: 23228, datos: 'Dep Directo C2 Step 2B Sin finalizar(Cancelar)'},
    COD_CAV_PASO_2_INICIO_KIPHU : {codigo: 23229, datos: 'Dep Directo C2 Step 2 Inicio KIPHU'},
    COD_CAV_PASO_3_ERROR: {codigo: 23223, datos: 'Dep Directo C2 Step 3 Error'},
    COD_CAV_PASO_3_ERROR_PDF: {codigo: 23223, datos: 'Dep Directo C2 Step 3 Error PDF'},
    COD_CAV_PASO_3_EXITO_MAIL: {codigo: 23215, datos: 'Dep Directo C2 Step 3 Éxito A'},
    COD_CAV_PASO_3_EXITO: {codigo: 23215, datos: 'Dep Directo C2 Step 3 Éxito B'},
    COD_CAV_PASO_3_DESCARGA_PDF: {codigo: 23230, datos: 'Dep Directo C3 Step 3 Descarga'},

    COD_APV_PASO_1_INICIO : {codigo: 23231, datos: 'Dep Directo APV Step 1A'},
    COD_APV_PASO_1_ERROR: {codigo: 23232, datos: 'Dep Directo APV Step 1A-1F'},
    COD_APV_PASO_2_INICIO: {codigo: 23233, datos: 'Dep Directo APV Step 2A'},
    COD_APV_PASO_2_SIN_FINALIZAR: {codigo: 23234, datos: 'Dep Directo C2 Step 2B Sin finalizar(Cancelar)'},
    COD_APV_PASO_2_INICIO_KIPHU : {codigo: 23235, datos: 'Dep Directo APV Step 2 Inicio KIPHU'},
    COD_APV_PASO_3_ERROR: {codigo: 23236, datos: 'Dep Directo APV Step 3 ERROR'},
    COD_APV_PASO_3_ERROR_PDF: {codigo: 23236, datos: 'Dep Directo APV Step 3 ERROR PDF'},
    COD_APV_PASO_3_EXITO_MAIL: {codigo: 23214, datos: 'Dep Directo APV Step 3 Éxito A'},
    COD_APV_PASO_3_EXITO: {codigo: 23214, datos: 'Dep Directo APV Step 3 Éxito B'},
    COD_APV_PASO_3_DESCARGA_PDF: {codigo: 23237, datos: 'Dep Directo APV Step 3 Descarga'}
}

export const CONST_GENERALES_TRAZA = {
    SUCURSAL : 98,
    CANAL : "APPMOBILE",
    URL : "",
    UUID : "f8d12f01-ac09-4b72-8bcc-1a865dbac836",
    USUARIO : "INTERNET",
    ESTADO_EXITO: 1,
    ESTADO_FAIL: 5,
    ESTADO_NEUTRO: 0
}

export const CONST_TRAZA_KHIPU = {
    CANAL: 'APPMOBILE',
    USUARIO: 'INTERNET',
    SUCURSAL: 98,
    CODIGO_SISTEMA: 102,
    COD_APV_PASO_2_INICIO:{
        CODIGO_OPERACION: 23233,
        DATOS: 'Dep Directo APV Step 2A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
    },
    COD_APV_PASO_2_INICIO_KIPHU:{
        CODIGO_OPERACION: 23235,
        DATOS: 'Dep Directo APV Step 2 Inicio KIPHU',
        EXITO : 0,
        MODULO: 'ABONO WEB'
    },
    COD_CAV_PASO_2_INICIO:{
        CODIGO_OPERACION: 23227,
        DATOS: 'Dep Directo C2 Step 2',
        EXITO : 0,
        MODULO: 'ABONO WEB'
    },
    COD_CAV_PASO_2_INICIO_KIPHU:{
        CODIGO_OPERACION: 23229,
        DATOS: 'Dep Directo C2 Step 2 Inicio KIPHU',
        EXITO : 0,
        MODULO: 'ABONO WEB'
    },
}

