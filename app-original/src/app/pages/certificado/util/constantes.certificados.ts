/**
 * Constantes utilizadas por las pantallas del módulo Certificados y Cartolas
 */

export const CONSTANTES_CERTIFICADOS = {

    TITULO_HEADER_CERTIFICADOS: 'Certificados y Cartolas',
    CODIGO_CERTIFICADO_COTIZACIONES: 'TCR-CTZE',
    CODIGO_CERTIFICADO_SALDOS: 'TCR-SLCT',
    CODIGO_CERTIFICADO_AFILIACION: 'TCR-AFLC',
    CODIGO_CERTIFICADO_ANTECEDENTES: 'TCR-ANPR',
    CODIGO_CERTIFICADO_VACACIONES: 'TCR-VCPR',
    CODIGO_CERTIFICADO_PENSIONADO: 'TCR-PENS',
    CODIGO_CERTIFICADO_MOVIMIENTOS: 'TCR-CMCR',
    CODIGO_CERTIFICADO_MOVIMIENTOS2: 'TCR-CMVC',
    CODIGO_CERTIFICADO_MOVIMIENTOS_RESUMIDOS: 'TCR-CMCR',
    CODIGO_CERTIFICADO_MOVIMIENTOS_DETALLADOS: 'TCR-CMVC',


    ULTIMOS_12_MESES: 'Últimos 12 meses',
    ULTIMOS_24_MESES: 'Últimos 24 meses',
    ULTIMOS_36_MESES: 'Últimos 36 meses',
    RANGO_FECHAS_ABIERTO: 'Elige Fechas',

    ID_PRODUCTO_CUENTA_OBLIGATORIA : 1,
    ID_PRODUCTO_CCIAV : 6,

    CERTIFICADO_COTIZACIONES: {
        tipo: 'Cotizaciones con RUT Empleador',
        codigoTipoCertificado: 'TCR-CTZE',
        que_es: 'El presente certificado dispone del registro de todas las cotizaciones pagadas por tu empleador identificado con RUT y acreditadas en tus cuentas vigentes.',
        para_que_sirve: 'Este certificado sirve para ser presentado en entidades comerciales, bancarias, Fonasa muestra continuidad de cotizaciones canceladas, remuneración imponible y empleador que paga la cotización.',
        codigoCategoriaCertificado : 'AFILIADO',
        categoriaAcordion: 'COTI',
        descripcionAcordion: 'Muestra las cotizaciones, remuneración imponible y el empleador que la paga.',
        descripcionTitulo: 'Selecciona el Tipo de Cuenta y Período'
    },

    CERTIFICADO_MOVIMIENTOS: {
        tipo: 'Movimientos',
        codigoTipoCertificado: 'TCR-CMCR',
        codigoTipoCertificado2: 'TCR-CMVC',
        que_es: 'Es el certificado que refleja todos los ingresos y egresos realizados a tu cuenta.',
        para_que_sirve: 'Este certificado sirve para confirmar el movimiento de la cuenta con sus abonos y egresos.',
        codigoCategoriaCertificado : 'AFILIADO',
        categoriaAcordion: 'SALDOS',
        descripcionAcordion: 'Muestra todos los movimientos de ingresos y egresos realizados en tus cuentas.',
        descripcionTitulo: 'Selecciona el Tipo de Cuenta y Período'
    },

    CERTIFICADO_SALDOS: {
        tipo: 'Saldos',
        codigoTipoCertificado: 'TCR-SLCT',
        codigoCategoriaCertificado : 'AFILIADO',
        categoriaAcordion: 'SALDOS',
        descripcionAcordion: 'Muestra los montos vigentes, acreditando tu patrimonio total acumulado en la AFP.',
        descripcionTitulo: 'Solicita tu Certificado de Saldos',
        descripcionModal: 'Este certificado permite verificar montos en cuotas y pesos que registra en cada una de las cuentas vigentes en AFP Habitat.'
    },

    CERTIFICADO_AFILIACION: {
        tipo: 'Afiliación',
        codigoTipoCertificado: 'TCR-AFLC',
        codigoCategoriaCertificado : 'AFILIADO',
        categoriaAcordion: 'GENERAL',
        descripcionAcordion: 'Muestra fecha de ingreso al sistema previsional y la de incorporación a AFP Habitat.',
        descripcionTitulo: 'Solicita tu Certificado de Afiliación',
        descripcionModal: 'Este certificado acredita la fecha en que ingresaste al sistema previsional y la fecha en la que te incorporaste a nuestra administradora.'
    },

    CERTIFICADO_ANTECEDENTES: {
        tipo: 'Antecedentes Previsionales',
        codigoTipoCertificado: 'TCR-ANPR',
        codigoCategoriaCertificado : 'AFILIADO',
        categoriaAcordion: 'GENERAL',
        descripcionAcordion: 'Muestra datos personales, laborales, de afiliación y cuentas vigentes en la AFP.',
        descripcionTitulo: 'Solicita tu Certificado de Antecedentes Previsionales',
        descripcionModal: 'Este certificado muestras los principales antecedentes personales, laborales, estado de afiliación y cuentas vigentes en la AFP.'
    },

    CERTIFICADO_VACACIONES: {
        tipo: 'Vacaciones Progresivas',
        codigoTipoCertificado: 'TCR-VCPR',
        codigoCategoriaCertificado : 'AFILIADO',
        categoriaAcordion: 'GENERAL',
        descripcionAcordion: 'Registra meses cotizados que te dan derecho a un día de Vacaciones Progresivas.',
        descripcionTitulo: 'Solicita tu Certificado de Vacaciones Progresivas',
        descripcionModal: 'Este certificado registra los meses cotizados en tu Cuenta Obligatoria y sirve para ser presentado a tu empleador para solicitar los días adicionales de vacaciones.'
    },

    CERTIFICADO_PENSIONADO: {
        tipo: 'Pensionado',
        codigoTipoCertificado: 'TCR-PENS',
        codigoCategoriaCertificado : 'PENSIONADO',
        categoriaAcordion: 'PENSIONADO',
        descripcionAcordion: 'Muestra el tipo y modalidad, monto bruto actual y fecha de inicio de pensión.',
        descripcionTitulo: 'Solicita tu Certificado de Pensionado',
        descripcionModal: 'Este certificado muestra el tipo y modalidad de Pensión en que te encuentras. Si tienes Retiro Programado, además, se informa tu monto bruto de Pensión mensual y la fecha de inicio de Pensión.'
    },

    CARTOLA_CUATRIMESTRAL: {
        tipo: 'Cartola Cuatrimestral',
        codigoTipoCertificado: 'CUATRIMESTRAL',
        que_es: `Es un documento detallado que la AFP envía cada cuatro meses al afiliado que se encuentra cotizando, donde se le informa específicamente
        todos los movimientos que se han registrado en sus cuentas.` ,
        para_que_sirve: `Las Cartolas Cuatrimestrales son emitidas tres veces al año (Febrero, Junio y Octubre) 
        para aquellos clientes cotizantes. Se encuentran disponibles de forma inmediata los tres últimos períodos.`,
        categoriaAcordion: 'CARTOLAS',
        descripcionAcordion: 'Todos los movimientos registrados en sus cuentas cada 4 meses.',
        descripcionTitulo: 'Selecciona el Período'  
    },

    CARTOLA_MENSUAL: {
        tipo: 'Estados de Cuenta Mensual',
        codigoTipoCertificado: 'CARTOLA',
        categoriaAcordion: 'CARTOLAS',
        descripcionAcordion: 'Es el detalle de tus cuentas de ahorro y el monto proyectado de tu futura pensión.',
        que_es: 'Es el documento mensual donde te informamos el detalle de tus cuentas de ahorro y el monto proyectado de tu futura pensión.',
        para_que_sirve: 'Acá puedes revisar tus Estados de Cuentas de los últimos 6 meses en PDF.',
        descripcionTitulo: 'Selecciona el Período de tiempo'  
    },

    MESES: [{
        id: 1,
        nombre: "Enero"
    }, {
        id: 2,
        nombre: "Febrero"
    }, {
        id: 3,
        nombre: "Marzo"
    }, {
        id: 4,
        nombre: "Abril"
    }, {
        id: 5,
        nombre: "Mayo"
    }, {
        id: 6,
        nombre: "Junio"
    }, {
        id: 7,
        nombre: "Julio"
    }, {
        id: 8,
        nombre: "Agosto"
    }, {
        id: 9,
        nombre: "Septiembre"
    }, {
        id: 10,
        nombre: "Octubre"
    }, {
        id: 11,
        nombre: "Noviembre"
    }, {
        id: 12,
        nombre: "Diciembre"
    }],

    ES_CERTIFICADOS: 'Certificados',
    ES_CARTOLAS: 'Cartolas',
    ES_CUATRIMESTRAL: 'Cartola Cuatrimestral',

    TITULO_EXITO_CERTIFICADOS: '¡Tu solicitud de Certificado ha sido realizada con éxito!',
    TEXTO_UNO_CERTIFICADOS: 'Recuerda que este Certificado tiene una validez de 30 días desde la fecha de emisión.',
    TEXTO_DOS_CERTIFICADOS: 'Hemos enviado el certificado a tu Email',

    TITULO_EXITO_CARTOLAS: '¡Tu solicitud de Cartola ha sido realizada con éxito!',
    TEXTO_UNO_CARTOLAS: 'Recuerda que esta Cartola tiene una validez de 30 días desde la fecha de emisión.',
    TEXTO_DOS_CARTOLAS: 'Hemos enviado la cartola a tu Email',

    TITULO_CORREO: 'Comprobante Estado de Cuenta Mensual',
    NOMBRE_PDF: 'Estado De Cuenta Personal.pdf',
    FECHA_TEXTO_LIBRE_CORREO: "$fechaActual",
    TEXTO_LIBRE_CORREO: "<p>Te informamos que se ha ingresado de forma exitosa tu consulta de Estado de Cuenta Mensual, realizada en nuestra APP el $fechaActual</p> <p> Adjuntamos el informe requerido, en el cual se informa el detalle de tus cuentas de ahorro en AFP Habitat al cierre del mes seleccionado. </p> <p> Ante cualquier consulta, no dudes en utilizar nuestros canales de atenci&oacute;n disponibles.</p>",
    TIPO_OPERACION_CORREO: "Solicitud de Estado de Cuenta Mensual",

    ERROR_PDF_NULO: 'Según nuestros registros no cuentas con Estado de Cuenta para el periodo seleccionado.',

    TITULO_CORREO_CUATRIMESTRAL: 'Comprobante Cartola Cuatrimestral',
    NOMBRE_PDF_CUATRIMESTRAL: 'Cartola Cuatrimestral.pdf',
    TIPO_OPERACION_CORREO_CUATRIMESTRAL: "Solicitud de Cartola Cuatrimestral",
    TEXTO_LIBRE_CORREO_CUATRIMESTRAL: "<p>Te informamos que se ha ingresado de forma exitosa tu solicitud de Cartola Cuatrimestral, realizada en nuestra APP el $fechaActual</p> <p> Adjuntamos el informe requerido, en el cual se te informa de todos los movimientos y saldos que han registrado tus cuentas en el cuatrimestre seleccionado. </p> <p> Ante cualquier consulta, no dudes en utilizar nuestros canales de atenci&oacute;n disponibles.</p>",

};

const COD_SELECCION_CARTOLA_EXITO = 'Paso 1 seleccion listado de certificados EXITO';
const COD_SELECCION_CARTOLA_ERROR = 'Paso 1 seleccion listado de certificados ERROR';
const COD_SOLICITAR_CARTOLA_EXITO = 'Paso 2 solicitar cartola con criterios EXITO';
const COD_DESCARGAR_CARTOLA_EXITO = 'Paso 3 Descargar cartola EXITO';
const COD_SOLICITAR_CARTOLA_CUATRIMESTRAL_ERROR = 'Paso 2 solicitar cartola cuatrimestral con criterios ERROR';
export const TRAZAS_CARTOLAS = {
    CODIGO_SISTEMA : 14,
    MODULO : "Genera PDF Estado Cuenta",

    //MARCAS
    COD_SELECCION_CARTOLA_EXITO : {codigo: 25150, datos: COD_SELECCION_CARTOLA_EXITO},
    COD_SELECCION_CARTOLA_ERROR : {codigo: 25155, datos: COD_SELECCION_CARTOLA_ERROR},

    COD_SOLICITAR_CARTOLA_EXITO : {codigo: 25160, datos: COD_SOLICITAR_CARTOLA_EXITO},
    COD_SOLICITAR_CARTOLA_ERROR : {codigo: 25162, datos: 'Paso 2 solicitar cartola con criterios ERROR'},

    COD_SOLICITAR_VIDEO_CARTOLA_EXITO : {codigo: 25166, datos: 'Solicitar video cartola mensual INICIO'},
    COD_REPRODUCIR_VIDEO_CARTOLA_EXITO : {codigo: 25167, datos: 'Reproducir video cartola mensual EXITO'},
    COD_REPRODUCIR_VIDEO_CARTOLA_ERROR : {codigo: 25168, datos: 'Reproducir video cartola mensual ERROR'},

    COD_DESCARGAR_CARTOLA_EXITO : {codigo: 25165, datos: COD_DESCARGAR_CARTOLA_EXITO},
    COD_DESCARGAR_CARTOLA_ERROR : {codigo: 25170, datos: 'Paso 3 Descargar cartola ERROR'},

    //CUATRIMESTRAL
    COD_SELECCION_CARTOLA_CUATRIMESTRAL_EXITO : {codigo: 8200, datos: COD_SELECCION_CARTOLA_EXITO},
    COD_SELECCION_CARTOLA_CUATRIMESTRAL_ERROR : {codigo: 8202, datos: COD_SELECCION_CARTOLA_ERROR},

    COD_SOLICITAR_CARTOLA_CUATRIMESTRAL_EXITO : {codigo: 8205, datos: 'Paso 2 solicitar cartola cuatrimestral con criterios EXITO'},
    COD_SOLICITAR_CARTOLA_CUATRIMESTRAL_ERROR : {codigo: 8206, datos: COD_SOLICITAR_CARTOLA_CUATRIMESTRAL_ERROR},

    COD_DESCARGAR_CARTOLA_CUATRIMESTRAL_EXITO : {codigo: 8210, datos: 'Paso 3 Descargar cartola cuatrimestral EXITO'},
    COD_DESCARGAR_CARTOLA_CUATRIMESTRAL_ERROR : {codigo: 8212, datos: 'Paso 3 Descargar cartola cuatrimestral ERROR'},

};

/**
 * Trazas para Certificados
 */
const DATOS = 'Solicitud de certificado';   
const MODULO = 'Genera PDF Estado Cuenta';   
export const CONSTANTES_TRAZAS_CERTIFICADOS = {
    CANAL: 'APPMOBILE',
    USUARIO: 'INTERNET',
    SUCURSAL: 98,
    CODIGO_SISTEMA: 14,
    HOME: {
        CARTOLA_EXITO: {
            CODIGO_OPERACION: 25150,
            DATOS: COD_SELECCION_CARTOLA_EXITO,
            EXITO : 0,
            MODULO: MODULO
        },
        CARTOLA_ERROR: {
            CODIGO_OPERACION: 25150,
            DATOS: COD_SELECCION_CARTOLA_ERROR,
            EXITO : 5,
            MODULO: MODULO
        },
    },
    DETALLE:{
        SALDOS: {
            INI: {
                CODIGO_OPERACION: 10200,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoSaldoService'
            },
            ERROR: {
                CODIGO_OPERACION: 10211,
                DATOS: DATOS,
                EXITO : 5,
                MODULO: 'CertificadoSaldoService'
            },
            PREEND: {
                CODIGO_OPERACION: 10239,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoSaldoService'
            },
            END: {
                CODIGO_OPERACION: 10299,
                DATOS: DATOS,
                EXITO : 1,
                MODULO: 'CertificadoSaldoService'
            },
    
            
        },
        AFILIACION: {
            INI: {
                CODIGO_OPERACION: 9200,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoAntecedentesService'
            },
            ERROR: {
                CODIGO_OPERACION: 9211,
                DATOS: DATOS,
                EXITO : 5,
                MODULO: 'CertificadoAntecedentesService'
            },
            PREEND: {
                CODIGO_OPERACION: 9239,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoAntecedentesService'
            },
            END: {
                CODIGO_OPERACION: 9299,
                DATOS: DATOS,
                EXITO : 1,
                MODULO: 'CertificadoAntecedentesService'
            },
    
            
        },
        COTIZACIONES: {
            INI: {
                CODIGO_OPERACION: 30000,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoCotizacionesRutEmpleadorService'
            },
            ERROR: {
                CODIGO_OPERACION: 30011,
                DATOS: DATOS,
                EXITO : 5,
                MODULO: 'CertificadoCotizacionesRutEmpleadorService'
            },
            PREEND: {
                CODIGO_OPERACION: 30039,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoCotizacionesRutEmpleadorService'
            },
            END: {
                CODIGO_OPERACION: 30099,
                DATOS: DATOS,
                EXITO : 1,
                MODULO: 'CertificadoCotizacionesRutEmpleadorService'
            },
    
            
        },
        MOVIMIENTOS: {
            INI: {
                CODIGO_OPERACION: 10300,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoMovimientosService'
            },
            ERROR: {
                CODIGO_OPERACION: 10311,
                DATOS: DATOS,
                EXITO : 5,
                MODULO: 'CertificadoMovimientosService'
            },
            PREEND: {
                CODIGO_OPERACION: 10339,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoMovimientosService'
            },
            END: {
                CODIGO_OPERACION: 10399,
                DATOS: DATOS,
                EXITO : 1,
                MODULO: 'CertificadoMovimientosService'
            },
    
            
        },
        VACACIONES: {
            INI: {
                CODIGO_OPERACION: 9400,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoMovimientosService'
            },
            ERROR: {
                CODIGO_OPERACION: 9411,
                DATOS: DATOS,
                EXITO : 5,
                MODULO: 'CertificadoMovimientosService'
            },
            PREEND: {
                CODIGO_OPERACION: 9499,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoMovimientosService'
            },
            END: {
                CODIGO_OPERACION: 9499,
                DATOS: DATOS,
                EXITO : 1,
                MODULO: 'CertificadoMovimientosService'
            },
    
            
        },
        ANTECEDENTES: {
            INI: {
                CODIGO_OPERACION: 9300,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoMovimientosService'
            },
            ERROR: {
                CODIGO_OPERACION: 9311,
                DATOS: DATOS,
                EXITO : 5,
                MODULO: 'CertificadoMovimientosService'
            },
            PREEND: {
                CODIGO_OPERACION: 9399,
                DATOS: DATOS,
                EXITO : 0,
                MODULO: 'CertificadoMovimientosService'
            },
            END: {
                CODIGO_OPERACION: 9399,
                DATOS: DATOS,
                EXITO : 1,
                MODULO: 'CertificadoMovimientosService'
            },
    
            
        },
    },
    GENERADO: {
        DESCARGA_CARTOLA_EXITO: {
            CODIGO_OPERACION: 25165,
            DATOS: COD_DESCARGAR_CARTOLA_EXITO,
            EXITO : 1,
            MODULO: MODULO
        },
        DESCARGA_CARTOLA_CUATRI_EXITO: {
            CODIGO_OPERACION: 8210,
            DATOS: 'Paso 3 Descargar cartola cuatrimestral EXITO',
            EXITO : 1,
            MODULO: MODULO
        },
        DESCARGA_CARTOLA_ERROR: {
            CODIGO_OPERACION: 25170,
            DATOS: 'Paso 3 Descargar cartola ERROR',
            EXITO : 5,
            MODULO: MODULO
        },
        DESCARGA_CARTOLA_CUATRI_ERROR: {
            CODIGO_OPERACION: 8212,
            DATOS: 'Paso 3 Descargar cartola cuatrimestral ERROR',
            EXITO : 5,
            MODULO: MODULO
        },
        
    },
    CARTOLA: {
        OBTENER_PDF_EXITO: {
            CODIGO_OPERACION: 8205,
            DATOS: COD_DESCARGAR_CARTOLA_EXITO,
            EXITO : 0,
            MODULO: MODULO
        },
        OBTENER_PDF_ERROR: {
            CODIGO_OPERACION: 8206,
            DATOS: COD_SOLICITAR_CARTOLA_CUATRIMESTRAL_ERROR,
            EXITO : 5,
            MODULO: MODULO
        },
        OBTENER_PERIODO_EXITO: {
            CODIGO_OPERACION: 8200,
            DATOS: COD_SELECCION_CARTOLA_EXITO,
            EXITO : 0,
            MODULO: MODULO
        },
        OBTENER_PERIODO_ERROR: {
            CODIGO_OPERACION: 8202,
            DATOS: COD_SELECCION_CARTOLA_ERROR,
            EXITO : 5,
            MODULO: MODULO
        },
        CORREO_SOLICITUD_EXITO: {
            CODIGO_OPERACION: 8205,
            DATOS: 'Paso 2 solicitar cartola cuatrimestral con criterios EXITO',
            EXITO : 0,
            MODULO: MODULO
        },
        CORREO_SOLICITUD_ERROR: {
            CODIGO_OPERACION: 8206,
            DATOS: COD_SOLICITAR_CARTOLA_CUATRIMESTRAL_ERROR,
            EXITO : 5,
            MODULO: MODULO
        },
        VIDEO_EXITO: {
            CODIGO_OPERACION: 25167,
            DATOS: 'Reproducir video cartola mensual EXITO',
            EXITO : 0,
            MODULO: MODULO
        },
        OBTENER_PDF_CARTOLA_EXITO: {
            CODIGO_OPERACION: 25160,
            DATOS: COD_SOLICITAR_CARTOLA_EXITO,
            EXITO : 0,
            MODULO: MODULO
        },
        OBTENER_PDF_CARTOLA_ERROR: {
            CODIGO_OPERACION: 25162,
            DATOS: 'Paso 2 solicitar cartola con criterios ERROR',
            EXITO : 5,
            MODULO: MODULO
        },
        SOLICITAR_CARTOLA_EXITO: {
            CODIGO_OPERACION: 25160,
            DATOS: COD_SOLICITAR_CARTOLA_EXITO,
            EXITO : 0,
            MODULO: MODULO
        },
        SOLICITAR_VIDEO_EXITO: {
            CODIGO_OPERACION: 25166,
            DATOS: 'Solicitar video cartola mensual INICIO',
            EXITO : 0,
            MODULO: MODULO
        },
        SOLICITAR_VIDEO_ERROR: {
            CODIGO_OPERACION: 25168,
            DATOS: 'Reproducir video cartola mensual ERROR',
            EXITO : 5,
            MODULO: MODULO
        },
    },
}
