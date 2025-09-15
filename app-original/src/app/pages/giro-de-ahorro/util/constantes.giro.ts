/**
   * Constantes utilizadas por las pantallas de giro
 */
export const CONSTANTES_GIRO = {
  NOMBRE_PRODUCTO_CUENTA_2 : "Cuenta2",
  NOMBRE_PRODUCTO_APV : "APV",
  ID_REGIMEN_COVID : "999",
  MENSAJE_24_GIROS_COVID : "Solo puedes girar desde tu Saldo de Retiro 10%, ya que registras más de 24 giros realizados.",
  TIPO_CUENTA_VALE_VISTA_COVID : "-1"
}

export const CONSTANTES_GIRO_STEP_1 = {
  ERROR_SINSALDOCDF: 'No puedes realizar el retiro de ahorro, debido a que tu cuenta se encuentra sin saldos disponibles.',
  ERROR_CDF_ENCURSO: 'No puedes realizar el retiro de ahorro, debido a que tu cuenta se encuentra con un Cambio o Distribución de Fondos en proceso. ',
  ERROR_SINSALDOCDF_TITULO: 'Cuenta no disponible para retiros. ',
  ERROR_CDF_ENCURSO_TITULO: 'Cuenta no disponible para retiros. ',
  CODIGO_PRODUCTO_CUENTA_2: 'CAV',
  CODIGO_PRODUCTO_CUENTA_APV: 'CCICV',
  NOMBRE_PRODUCTO_CUENTA_2 : "Cuenta2",
  NOMBRE_PRODUCTO_APV : "APV",
  ID_PRODUCTO_CUENTA_2 : 2,
  ID_PRODUCTO_APV : 4,
  CODIGO_ERROR_CLIENTE_SIN_CUENTA_2: "001",
  CODIGO_ERROR_SUPERA_24_GIROS: "002",
  CODIGO_ERROR_SALDOS_DISCORDANTES: "004",
  CODIGO_VALIDACION_OK_GIRO: "200",
  MENSAJE_CTA_2_APERTURADA: 'No tienes una Cuenta 2 vigente. Puedes suscribir tu Cuenta 2 aquí.',
  MENSAJE_CTA_APV_APERTURADA: 'No tienes un APV vigente. Puedes suscribir tu APV aquí.',
  MENSAJE_VALIDACION_APV_NOVENTA : 'El monto ingresado no es válido, pues excede el 90% del saldo permitido para girar',
  TELEFONO_CONTACT: '223406900',
  URL_APERTURA_CUENTA_2: 'https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=APERTURACAV',
  URL_APERTURA_CUENTA_APV: 'https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=TU_APV',
  URL_BENEFICIOS_CAV: 'https://www.afphabitat.cl/ahorro-voluntario/cuenta-2/beneficios-tributarios-cuenta-2/',
  URL_BENEFICIOS_APV: 'https://www.afphabitat.cl/ahorro-voluntario/apv/beneficios-tributarios-apv/',
  TOAST_APV_NO_DISPONIBLE: "¡Pronto! Estamos trabajando en mejoras para darte un mejor servicio. Pronto podrás realizar tus giros de APV desde tu APP.",
  tipoRegimenGeneral: 'RG',
  tipoRegimen57Bis: 'R57',
  tipoRegimen54Bis: 'R54',
  TITULO_DETALLE_GIRO_AGREGAR: 'Giro de Ahorro',
  TITULO_DETALLE_GIRO_EDITAR: 'Edición de Datos',
  VALIDACION_MONTO_MAX : 'El monto ingresado no es válido, pues excede el 100% del saldo permitido para girar.',
  VALIDACION_MONTO_MIN : 'El monto a girar no es válido, pues es menor al mínimo permitido (0,01 cuotas).',
  TEXTO_VALIDACION_MAX : 'El monto ingresado no es válido, pues excede los $100.000.000 permitidos para girar.',
  TEXTO_VALIDACION_MAX_SUMA : 'La suma de de los valores confirmados, no puede exceder los $100.000.000 permitidos para girar.',
  TEXTO_VALIDACION_SALDOS_COMPROMETIDOS : 'No tienes monto disponible para realizar giro, ya que el saldo se encuentra comprometido para tu pensión.',
  CONSTANTE_MONTO_MIN : 0.01,
  CONSTANTE_MONTO_MAX : 100000000,
  DECIMAL_SEPARATOR : ",",
  GROUP_SEPARATOR : ".",
  ID_REGIMEN_ANTIGUO : 3 ,
  ID_REGIMEN_B_APV: '5',
  FACTOR_NOVENTA_PORCIENTO : 0.9,
  FACTOR_QUINCE_PORCIENTO : 0.15,
  SLIDES_INFO_PRODUCTOS : [
    {
      titulo: 'Giro Cuenta 2',
      parrafo: 'El ahorro de Cuenta 2 es especial para aquellos proyectos de corto, mediano y largo plazo, por lo mismo tienes toda la flexibilidad y liquidez que requieres al momento de retirar. Ten en cuenta:',
      textoUno: 'Puedes retirar el 100% del saldo disponible en tus fondos con un tope de $100.000.000 por transacción.',
      link: 'https://www.afphabitat.cl/ahorro-voluntario/cuenta-2/beneficios-tributarios-cuenta-2/',
    },
    {
      titulo: 'Giro APV',
      parrafo: 'Los ahorros en tu cuenta de APV puedes retirarlos cuando desees, sin embargo es importante que consideres que los beneficios tributarios solo aplican en caso que los destines para pensión. Ten en cuenta:',
      textoUno: 'Puedes retirar el 90% del saldo disponible en tus fondos con un tope de $100.000.000 por transacción.',
      link: 'https://www.afphabitat.cl/ahorro-voluntario/apv/beneficios-tributarios-apv/'
    }
  ],
  SLIDES_REGIMENES_APV : [
    {
      titulo : 'Régimen A',
      textoTitulo : 'Este Régimen es por el cual el trabajador, al momento de ahorrar, paga los impuestos correspondientes. De esta forma, al momento de retirar el ahorro, el cliente no tributa por este, solo lo hace por la rentabilidad real obtenida.',
      subtitulo1 : '¿Cuál es el beneficio?',
      informativo1: null,
      texto1 : 'El beneficios es una Bonificación Fiscal del 15% de lo ahorrado en el año con un tope de 6 UTM (UTM a febrero 2019, $48.305).',
      subtitulo2 : '¿Necesitas realizar un giro de tu APV?',
      informativo2: 'Revisa si pagas impuestos:',
      texto2 : 'Los giros de tu APV con Régimen A no tienen retención de impuestos. Solo se descuenta de la Bonificación Fiscal anual el 15% de la rentabilidad del monto girado.'
    },
    {
      titulo : 'Régimen B',
      textoTitulo : 'Este Régimen es por el cual no se paga impuesto al gestionar el ahorro, dado que los aportes se rebajan de la base imponible del impuesto único de segunda categoría.',
      subtitulo1 : '¿Cuál es el beneficio?',
      informativo1: 'Paga menos impuesto a la renta',
      texto1 : 'Si eres afiliado dependiente y ahorras en APV con descuento mensual a través de tu empleador, rebajas tu base imponible mensual, pagas menos impuesto a la renta y aumentas tu sueldo. Tope mensual del beneficio 50 UF. Si el ahorro voluntario lo realizas por Depósito Directo, rebajas tu base imponible anual, y obtienes una mayor devolución de impuestos en la operación renta. Tope anual del beneficio 600 UF. Si eres afiliado independiente y ahorras para este tipo de producto, rebajas tu base imponible anual, con un tope anual de 600 UFs. Importante: a contar del 1° de enero de 2015, se elimina el factor equivalente a 8,33 UF por el número total de unidades de fomento que representa la cotización obligatoria que efectuase el trabajador en el año respectivo.',
      subtitulo2 : '¿Necesitas realizar un giro desde tu APV?',
      informativo2: 'Revisa si pagas impuestos.',
      texto2 : 'Los giros de tu APV con Régimen B tienen una retención del 15% del monto girado, el que se abonará al SII para pagar el impuesto único al que están afectos en tu declaración anual.'
    }
  ],
  SLIDES_REGIMENES_CUENTA_2 : [
    {
      titulo : 'Régimen General',
      subtitulo1 : '¿Cuál es el beneficio?',
      texto1 : 'Si la rentabilidad anual de tus retiros es inferior a 30 UTM*, puedes hacer giros exentos del impuesto Global Complementario. Si la rentabilidad de tus retiros es superior, pagas impuesto por el total (sin descontar el monto exento), de acuerdo a tu tramo en la tabla del Impuesto Global Complementario. Adicionalmente, si destinas tus ahorros voluntarios a anticipar o mejorar tu pensión, el capital ahorrado también estará exento de impuestos.',
      listadoInformativos1: [{ titulo : 'Giros de tu Cuenta 2 libre de impuestos.'}],
      subtitulo2 : '¿Cuándo elegir este Régimen Tributario?',
      listadoInformativos2: [{ titulo : 'Si buscas un ahorro con flexibilidad para realizar giros.'},{ titulo : 'Si buscas un ahorro a corto plazo, es decir, menor a 4 años.' }],
      texto2 : 'Es importante señalar, que los retiros que realices del Régimen General, también tributan por la ganancia, con la diferencia que, este régimen, te permite girar -libre de impuestos- hasta 30 UTM* por año.',
      texto3: '*UTM a febrero 2019; $48.305.'
    },
    {
      titulo : 'Régimen 57 Bis Transitorio',
      subtitulo1 : '¿Cuál es el beneficio?',
      texto1 : 'Si durante el año calendario la diferencia entre depósitos y giros (Saldo de Ahorro Neto, SAN) que realizaste es positiva podrás:',
      listadoInformativos1: [{ titulo : 'Rebajar tu declaración de renta del año siguiente: obteniendo un crédito fiscal anual del 15% sobre este Saldo Positivo.'},{ titulo : 'Girar anualmente hasta 10 UTA libre de impuestos: si cumples 4 años consecutivos de SAN positivo.'}],
      subtitulo2 : '¿Cuándo elegir este Régimen Tributario?',
      listadoInformativos2: null,
      texto2 : 'A partir del 2017 este régimen tributario no se encuentra vigente. Si tienes saldos en tu Cuenta 2 con el Régimen 57 Bis Transitorio, mantendrás los beneficios hasta que tu saldo se agote. Para cumplir el requisito se considerará el SAN positivo si no realizas giros a partir del 1 de enero de 2017.',
      texto3 : 'Si ingresas nuevos aportes, podrás elegir solo Régimen General o Régimen 54 bis.'
    },
    {
      titulo : 'Régimen 54 Bis',
      subtitulo1 : '¿Cuál es el beneficio?',
      texto1 : 'Es un ahorro que permite postergar la tributación por la rentabilidad obtenida, hasta que ésta sea retirada. El tope de aportes para acceder al beneficio es de 100 UTA anual.',
      listadoInformativos1: null,
      subtitulo2 : '¿Cuándo pagas impuestos con este Régimen Tributario?',
      listadoInformativos2: [{ titulo : 'Si superas las 100 UTA anuales, la rentabilidad de este exceso estará afecta a impuestos, aunque no sea retirado.'},{ titulo : 'Cuando realizas giros. Sin importar el monto que éste tenga.' }],
      texto2 : null
    }
  ],
  NUMERO_CALL_CENTER_GIROS : "600 220 2000"
}

export const CONSTANTES_GIRO_STEP_2 = {
    TEXTO_COMBO_BANCO : "Banco a Depositar",
    TEXTO_COMBO_TIPO_CUENTA : "Tipo de Cuenta",
    TOAST_STEP_2_GIRO : "El giro se efectuará en forma diferida (con plazo de 5 días hábiles). Si deseas continuar, completa los siguientes datos.",
    TEXTO_INFORMATIVO_STEP_2_GIRO : "El monto en pesos del giro, puede variar debido a la fluctuación del valor cuota, desde la fecha de la solicitud, hasta la materialización de éste.",
    TITULO_MODAL_BANCO_STEP_2_GIRO : "Banco a Depositar",
    TEXTO_1_MODAL_BANCO_STEP_2_GIRO : "El depósito se realizará en un plazo de cinco días hábiles siguientes a la fecha de la solicitud.",
    TITULO_MODAL_NUMERO_CUENTA : "Número de cuenta",
    TEXTO_MODAL_NUMERO_CUENTA : "Es el número de tu cuenta bancaria, el que debe tener un mínimo de 6 números y un máximo de 18. Recuerda no anteponer los ceros.",
    TEXTO_2_MODAL_BANCO_STEP_2_GIRO : "La cuenta bancaria debe ser unipersonal y estar a nombre del titular.",
    CANTIDAD_MIN_INPUT_NUMERO_CUENTA : 6,
    TEXTO_TITULO_MODAL_CONDICIONES : "Condiciones del Giro ",
    TEXTO_1_MODAL_CONCIONES : "Como medida de seguridad, tu solicitud deberá ser confirmada a través de una clave dinámica que enviaremos al celular que tenemos en nuestros registros.",
    TEXTO_2_MODAL_CONCIONES : "Puedes leer las condiciones", 
    TEXTO_3_MODAL_CONCIONES : "haciendo click aquí.", 
    URL_MODAL_CONCIONES : "",
    ID_BANCO_ESTADO: 3890,
    ID_TIPO_CUENTA_VISTA : 3,
    LINK_CONDICIONES_CUENTA_2 : 'https://www.afphabitat.cl/condiciones-giro-cuenta-2/',
    LINK_CONDICIONES_APV : 'https://www.afphabitat.cl/condiciones-giro-apv/',
    ID_BANCO_ACTIVO : 1,
    ID_PRODUCTO_APV : 4,
    CARACTER_0 : 48,
    CARACTER_9 : 57,
    ID_BANCOS_HABILITADOS: [3886,1,12,51,9,39,53,37,14,19,16,28]
  };

  export const CONSTANTES_GIRO_STEP_3 = {
    MAX_INTENTOS_FALLIDOS : 3,
    CANTIDAD_CODIGOS_CORRECTA : 6,
    INDEX_INPUT_VALIDAR : 5, // VALIDADOR INPUT 5 , ENCARGADO DE LLAMAR A FUNCION VALIDAR.
    INDEX_INICIAL_INPUT_VALIDAR : -1,
    TOAST_VALIDACION_NUMERO_SMS_PARAM: ":CANTIDAD_INTENTOS",
    TOAST_VALIDACION_NUMERO_SMS : "Intento :CANTIDAD_INTENTOS de 5. Te hemos enviado un SMS con tu clave dinámica. Por favor, espera unos segundos.",
    TOAST_ERROR_ENVIO_CORREO : "Se ha generado un problema al enviar Email con el comprobante. Para más información, comunícate a nuestro Contact Center al 600 220 2000.", 
    CODIGO_ERROR_MAX_SMS : "005",
    CODIGO_VERDADERO_SMS : "true",
    CODIGO_ERROR_ERROR_CODIGO: "-1",
    CODIGO_ERROR_MAX_INTENTOS: "-2",
    TIPO_PRODUCTO_SMS_CUENTA_2 : "Cuenta 2",
    OBJETO_REGIMEN_SOLICITUD : '"regimen":{"IdTipRegTribu":"ID_REGIMEN",TIPOS_FONDO}',
    OBJETO_TIPO_FONDO_SOLICITUD : '"tipoFondo":{"IdTipoFondo":"ID_TIPO_FONDO","IdMaeCuenta":"ID_MAE_CUENTA","valorCuota":"VALOR_CUOTA","ComisionMantPesos" : "COMISION_PESOS","ComisionMantCuotas": "COMISION_CUOTAS","MontoRetiroPesos":"MONTO_PESOS","MontoRetiroCuotas" : "MONTO_CUOTAS", "esGiroEnCuotas" : "ES_EN_CUOTAS", "impuestoPesos" : "IMPUESTO_PESOS"}',
    PREFIJO_NUMERO : "569",
    NOMBRE_ARCHIVO_CORREO_CUENTA_2 : "certificadoGiroCuenta2.pdf",
    NOMBRE_ARCHIVO_CORREO_APV : "certificadoGiroAPV.pdf",
    FECHA_TEXTO_LIBRE_CORREO : "$fechaActual",
    FECHA_CUOTA_TEXTO_LIBRE_CORREO : "$fechaCuota",
    TIPO_OPERACION_CORREO_CUENTA_2 : "Giro Cuenta 2.",
    TIPO_OPERACION_CORREO_APV : "Giro APV.",
    TITULO_CORREO_CUENTA_2 : "Comprobante Giro Cuenta 2",
    TITULO_CORREO_APV : "Comprobante Giro APV",
    TEXTO_LIBRE_CORREO_CUENTA_2 : "<p>Te informamos que se ha ingresado de forma exitosa tu solicitud de Giro en la Cuenta de Ahorro Voluntario (Cuenta 2), realizada en nuestra APP el d&iacute;a $fechaActual.</p><p>Recuerda que la disponibilidad de este retiro ser&aacute; al quinto d&iacute;a h&aacute;bil siguiente de la fecha de realizada esta solicitud y se aplicar&aacute; con el valor cuota correspondiente al d&iacute;a $fechaCuota.</p><p>Adjuntamos el detalle de esta transacci&oacute;n, es importante que lo guardes, ya que es tu comprobante.</p><p>Ante cualquier consulta, no dudes en utilizar nuestros canales de atenci&oacute;n disponibles.</p><p>Si no realizaste esta transacci&oacute;n, por favor cont&aacute;ctate con nosotros al 600 220 2000.</p><strong>Recuerda: Tus claves son personales, nunca debes dar a conocer tu clave de acceso ni tu clave de Seguridad a terceros</strong></p>",
    TEXTO_LIBRE_CORREO_APV : "<p>Te informamos que se ha ingresado de forma exitosa tu solicitud de Giro en la Cuenta de Ahorro Previsional Voluntario (APV), realizada en nuestra APP el d&iacute;a $fechaActual.</p><p>Recuerda que la disponibilidad de este retiro ser&aacute; al quinto d&iacute;a h&aacute;bil siguiente de la fecha de realizada esta solicitud y se aplicar&aacute; con el valor cuota correspondiente al d&iacute;a $fechaCuota.</p><p>Adjuntamos el detalle de esta transacci&oacute;n, es importante que lo guardes, ya que es tu comprobante.</p><p>Ante cualquier consulta, no dudes en utilizar nuestros canales de atenci&oacute;n disponibles.</p><p>Si no realizaste esta transacci&oacute;n, por favor cont&aacute;ctate con nosotros al 600 220 2000.</p><strong>Recuerda: Tus claves son personales, nunca debes dar a conocer tu clave de acceso ni tu clave de Seguridad a terceros</strong></p>",
    SEPARADOR_FECHA_HORA: "T",
    SEPARADOR_FECHA_GUION : "-",
    SEPARADOR_FECHA_SLASH : "/",
    SEPARADOR_HORA: ":",
    MASCARA_NUMERO: "XXX XXX"
  }

  export const CONSTANTES_CUENTA_DIGITAL = {
    TIPO_CUENTA_VISTA: 3,
    BANCO_BCI: 3905,
    PREFIJO_BCI: '7770',
    BANCO_RIPLEY: 3898,
    PREFIJO_RIPLEY: '999',
    BANCO_SANTANDER: 3899,
    PREFIJO_SANTANDER: '71',
    LARGO_CUENTA_10: 10,
    LARGO_CUENTA_11: 11,
    LARGO_CUENTA_12: 12,
    TIPO_DIGITAL: 'DIGITAL'
  };

  /**
 * Trazas para GIRO
 */
 export const CONSTANTES_TRAZAS_GIRO = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 11,
  STEP1: {
      INICIO_GIROS_APV: {
        CODIGO_OPERACION: 2200,
        DATOS: 'Giro Ahorro Step 1A / Paso 1 INICIO',
        EXITO : 0,
        MODULO: 'GIRO APV'
      },
      INICIO_GIROS_CAV: {
        CODIGO_OPERACION: 2500,
        DATOS: 'Giro Ahorro Step 1A / Paso 1 INICIO',
        EXITO : 0,
        MODULO: 'GIRO CAV'
      },
      INICIO_GIROS_ERROR_APV: {
        CODIGO_OPERACION: 2400,
        DATOS: 'Giro Ahorro Step 1A / Paso 1 ERROR',
        EXITO : 5,
        MODULO: 'GIRO APV'
      },
      INICIO_GIROS_ERROR_CAV: {
        CODIGO_OPERACION: 2700,
        DATOS: 'Giro Ahorro Step 1A / Paso 1 ERROR',
        EXITO : 5,
        MODULO: 'GIRO CAV'
      }
     
  },
  STEP2: {
      INICIO_GIROS_APV: {
        CODIGO_OPERACION: 2420,
        DATOS: 'Giro Ahorro Step 2A / Paso 2 INICIO',
        EXITO : 0,
       MODULO: 'GIRO APV'
      },
      INICIO_GIROS_CAV: {
        CODIGO_OPERACION: 2720,
        DATOS: 'Giro Ahorro Step 2A / Paso 2 INICIO',
        EXITO : 0,
       MODULO: 'GIRO CAV'
      },
      INICIO_BANCO_GIROS_APV: {
        CODIGO_OPERACION: 2421,
        DATOS: 'Giro Ahorro Step 2 Selector A /	Paso 2 INICIO BANCO',
        EXITO : 0,
       MODULO: 'GIRO APV'
      },
      INICIO_BANCO_GIROS_CAV: {
        CODIGO_OPERACION: 2721,
        DATOS: 'Giro Ahorro Step 2 Selector A /	Paso 2 INICIO BANCO',
        EXITO : 0,
       MODULO: 'GIRO CAV'
      },
      INICIO_FIN_BANCO_GIROS_APV: {
        CODIGO_OPERACION: 2422,
        DATOS: 'Giro Ahorro Step 2D / Paso 2 FIN BANCO',
        EXITO : 0,
       MODULO: 'GIRO APV'
      },
      INICIO_FIN_BANCO_GIROS_CAV: {
        CODIGO_OPERACION: 2722,
        DATOS: 'Giro Ahorro Step 2D / Paso 2 FIN BANCO',
        EXITO : 0,
       MODULO: 'GIRO CAV'
      },
      INICIO_SIN_BANCO_GIROS_APV: {
        CODIGO_OPERACION: 2423,
        DATOS: 'Giro Ahorro Step 2D / Paso 2 SIN FINALIZAR (Volver o Cancelar)',
        EXITO : 0,
       MODULO: 'GIRO APV'
      },
      INICIO_SIN_BANCO_GIROS_CAV: {
        CODIGO_OPERACION: 2723,
        DATOS: 'Giro Ahorro Step 2D / Paso 2 SIN FINALIZAR (Volver o Cancelar)',
        EXITO : 0,
       MODULO: 'GIRO CAV'
      },
  },
  STEP3: {
      DESCARGA_PDF_GIRO_APV: {
        CODIGO_OPERACION: 2428,
        DATOS: 'Giro Ahorro Step 3F DESCARGAR / Paso 3 Descarga',
        EXITO : 0,
        MODULO: 'GIRO APV'
      },
      DESCARGA_PDF_GIRO_CAV: {
        CODIGO_OPERACION: 2728,
        DATOS: 'Giro Ahorro Step 3F DESCARGAR / Paso 3 Descarga',
        EXITO : 0,
        MODULO: 'GIRO CAV'
      },
      ERROR_GIRO_APV: {
        CODIGO_OPERACION: 2406,
        DATOS: 'Giro Ahorro Step 3F ERROR / Paso 3 ERROR',
        EXITO : 5,
        MODULO: 'GIRO APV'
      },
      ERROR_GIRO_CAV: {
        CODIGO_OPERACION: 2706,
        DATOS: 'Giro Ahorro Step 3F ERROR / Paso 3 ERROR',
        EXITO : 5,
        MODULO: 'GIRO CAV'
      },
      EXITO_GIRO_APV: {
        CODIGO_OPERACION: 2499,
        DATOS: 'Giro Ahorro Step 3F / Paso 3 EXITO',
        EXITO : 1,
        MODULO: 'GIRO APV'
      },
      EXITO_GIRO_CAV: {
        CODIGO_OPERACION: 2799,
        DATOS: 'Giro Ahorro Step 3F / Paso 3 EXITO',
        EXITO : 1,
        MODULO: 'GIRO CAV'
      },
      ERROR_CODIGO_GIRO_APV: {
        CODIGO_OPERACION: 2427,
        DATOS: 'Giro Ahorro Step 3D / Paso 3 ERROR CODIGO',
        EXITO : 0,
        MODULO: 'GIRO APV'
      },
      ERROR_CODIGO_GIRO_CAV: {
        CODIGO_OPERACION: 2727,
        DATOS: 'Giro Ahorro Step 3D / Paso 3 ERROR CODIGO',
        EXITO : 0,
        MODULO: 'GIRO CAV'
      },
      FIN_CODIGO_GIRO_APV: {
        CODIGO_OPERACION: 2426,
        DATOS: 'Giro Ahorro Step 3D / Paso 3 FIN CODIGO (ingresar codigo)',
        EXITO : 0,
        MODULO: 'GIRO APV'
      },
      FIN_CODIGO_GIRO_CAV: {
        CODIGO_OPERACION: 2726,
        DATOS: 'Giro Ahorro Step 3D / Paso 3 FIN CODIGO (ingresar codigo)',
        EXITO : 0,
        MODULO: 'GIRO CAV'
      },
      FINALIZAR_GIRO_APV: {
        CODIGO_OPERACION: 2425,
        DATOS: 'Giro Ahorro Step 3A / Paso 3 SIN FINALIZAR CODIGO (Volver)',
        EXITO : 0,
        MODULO: 'GIRO APV'
      },
      FINALIZAR_GIRO_CAV: {
        CODIGO_OPERACION: 2725,
        DATOS: 'Giro Ahorro Step 3A / Paso 3 SIN FINALIZAR CODIGO (Volver)',
        EXITO : 0,
        MODULO: 'GIRO CAV'
      },
      INICIO_GIRO_APV: {
        CODIGO_OPERACION: 2424,
        DATOS: 'Giro Ahorro Step 3A / Paso 3 INICIO CODIGO',
        EXITO : 0,
        MODULO: 'GIRO APV'
      },
      INICIO_GIRO_CAV: {
        CODIGO_OPERACION: 2724,
        DATOS: 'Giro Ahorro Step 3A / Paso 3 INICIO CODIGO',
        EXITO : 0,
        MODULO: 'GIRO CAV'
      },
  }
}


  