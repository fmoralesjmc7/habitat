/**
   * Constantes utilizadas por las pantallas del módulo planes de ahorro
 */

export const CONSTANTES_PLANES_STEP_1 = {
  CODIGO_PRODUCTO_CUENTA_2: 'CAV',
  CODIGO_PRODUCTO_CUENTA_APV: 'CCICV',
  NOMBRE_PRODUCTO_CUENTA_2 : "Cuenta2",
  NOMBRE_PRODUCTO_APV : "APV",
  ID_PRODUCTO_CUENTA_OBLIGATORIA : 1,
  ID_PRODUCTO_CUENTA_2 : 2,
  ID_PRODUCTO_APV : 4,
  ID_PRODUCTO_CCIAV : 6,
  FORMULARIO_PRODUCTO_CUENTA_2 : "Datos de tu nueva Cuenta 2",
  FORMULARIO_PRODUCTO_APV : "Datos de tu nueva Cuenta APV",
  FORMULARIO_2: "Datos de tu trabajo",
  FORMULARIO_3: "Datos de tu empleador actual",
  FORMULARIO_CUENTAS: 0,
  FORMULARIO_TRABAJO: 1,
  FORMULARIO_EMPLEADOR: 2,

  DECIMAL_SEPARATOR : ",",
  GROUP_SEPARATOR : ".",

  TIPO_MONEDA_PESO: 3,

  MAXIMO_CARACTERES_RUT: 13,

  NOMBRE_CUENTA2 : 'Cuenta 2',
  NOMBRE_CAV: 'CAV',
  NOMBRE_APV : 'APV',

  ACCESO_FORMATEADOR_MONTO_SELECCIONADO: 'montoSeleccionado',
  ACCESO_FORMATEADOR_MONTO_RENTA: 'rentaImponible',
  ACCESO_FORMATEADOR_MONTO_NUMERO: 'numero',
  ACCESO_FORMATEADOR_MONTO_OFICINA: 'oficina',

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
    }
  ],

  TITULO_MODAL_INICIAL_CUENTA2 : "¿Qué es la Cuenta 2?",
  TEXTO1_MODAL_INICIAL_CUENTA2 : "La Cuenta 2 o Cuenta de Ahorro Voluntario es la mejor forma de ahorrar y cumplir tus objetivos de corto, mediano y largo plazo, como la educación de tus hijos, vacaciones, tu futura casa, seguridad para tu familia, estudios de postgrado o lo que tú quieras, porque accedes a rentabilidades mayores a las que ofrece el mercado financiero a un menor costo.",
  TEXTO2_MODAL_INICIAL_CUENTA2 : "Esta cuenta de ahorro la puedes contratar en AFP Habitat de forma voluntaria y te permite disponer rápidamente de tus ahorros si los necesitas.",

  TITULO_MODAL_INICIAL_APV : "¿Qué es el APV?",
  TEXTO1_MODAL_INICIAL_APV : "El APV o Ahorro Previsional Voluntario, es una extraordinaria forma de ahorrar para mejorar tu pensión. Puedes ahorrar lo que tú desees en forma mensual o a través de depósitos directos, pero es importante que lo realices cuanto antes para que te ayude a construir la pensión que tú esperas. Además cuenta con atractivos beneficios tributarios del Estado.",

  TITULO_MODAL_EMPLEADOR : "Ingreso empleador",
  TEXTO1_MODAL_EMPLEADOR_CUENTA2 : "Para contratar una Cuenta de Ahorro Voluntario (Cuenta 2) se necesitan los datos de tu empleador, para que pueda realizar las cotizaciones correspondientes.",
  TEXTO1_MODAL_EMPLEADOR_APV : "Para contratar una Cuenta de Ahorro Previsional Voluntario (APV) se necesitan los datos de tu empleador, para que pueda realizar las cotizaciones correspondientes.",
  TEXTO2_MODAL_EMPLEADOR : "Ingresa el RUT de tu actual empleador para buscarlo en nuestros registros.",

  TEXTO_ERROR_CUENTA_OBLIGATORIA: "No puedes suscribir un Plan de Ahorro en Cuenta 2, debido a que no posees Cuenta Obligatoria o Cuenta de Afiliado Voluntario.", //aun no se valida este texto
  TEXTO_ERROR_MENOR_DE_EDAD: "Debe ser mayor de edad para esta solicitud", // aun no se valida este texto


  TEXTO_ERROR_CUENTA2: "Importante: Debes tener una Cuenta 2 abierta en AFP Habitat. Crea tu Cuenta 2 aqui.",

  TEXTO_ERROR_MONTO_BAJO_PESO: "El monto ingresado debe ser superior a $1.500.",
  TEXTO_ERROR_MONTO_ALTO_PESO: "El monto ingresado no debe superar $9.999.999.",
  TEXTO_ERROR_PORCENTAJE: "El porcentaje ingresado debe ser de 1% a 100%.",
  TEXTO_ERROR_UF: "El monto en UF ingresado debe ser de 1 a 999.",

  TEXTO_ERROR_FECHA_TERMINO: "Fecha de término no válida",

  TEXTO_ERROR_RENTA_MINIMA: "Tu renta imponible debe ser mayor o igual a ",
  TEXTO_SIGNO_PESO: "$",
  TEXTO_ERROR_RENTA_MAXIMA: "Tu renta imponible debe ser menor o igual a ",

  TEXTO_CAMPOS_SIN_COMPLETAR: "Completa los datos obligatorios",
  TEXTO_FORMATO_CORREO: "El Email es inválido",

  TEXTO_ERROR_AUTORIZACION: "El RUT empleador no está dentro de nuestro registros o es erróneo. Por favor Contáctate con AFP Habitat",
  TEXTO_ERROR_RUT_USADO_ACTIVA: "Ya posees una solicitud activa con este empleador.",
  TEXTO_ERROR_RUT_USADO_EN_PROCESO: "Ya posees una solicitud en proceso con este empleador.",
  TEXTO_NO_EXISTE_EMPLEADOR: "El RUT empleador no está dentro de nuestros registros o es erróneo. Por favor Contáctate con AFP Habitat.",
  TEXTO_RUT_IGUALES: 'El rut empleador no puede ser el mismo rut del cliente',
  TEXTO_AUTORIZACION: "Autorizo a mi empleador a descontar de mi remuneración imponible mensual la cantidad de porcentaje que se indica para enterarla en mi Cuenta de Ahorro Voluntario, dentro de los primeros 10 días de cada mes.",

  PRIORIDAD_1_DIRECCIONES: "COM",
  PRIORIDAD_2_DIRECCIONES: "EMPL",
  PRIORIDAD_3_DIRECCIONES: "PART",

  ID_FORMULARIO_DATOS: 0,
  ID_FORMULARIO_TRABAJO: 1,
  ID_FORMULARIO_EMPLEADOR: 2,

  MODAL_INFORMATIVO_STEP1: 1,
  MODAL_EMPLEADOR: 2,
  MODAL_STEP2: 3,

  URL_CUENTA2: 'https://www.afphabitat.cl/ahorro-voluntario/cuenta-2/que-es/',
  URL_APV: 'https://www.afphabitat.cl/ahorro-voluntario/apv/que-es/',
  URL_APERTURA_CUENTA2: 'https://www.afphabitat.cl/portalPrivado_FIXWeb/commons/goAliasMenu.htm?alias=APERTURACAV',

  MESES : [{
    id: 0,
    nombre: "Enero"
  }, {
    id: 1,
    nombre: "Febrero"
  }, {
    id: 2,
    nombre: "Marzo"
  }, {
    id: 3,
    nombre: "Abril"
  }, {
    id: 4,
    nombre: "Mayo"
  }, {
    id: 5,
    nombre: "Junio"
  }, {
    id: 6,
    nombre: "Julio"
  }, {
    id: 7,
    nombre: "Agosto"
  }, {
    id: 8,
    nombre: "Septiembre"
  }, {
    id: 9,
    nombre: "Octubre"
  }, {
    id: 10,
    nombre: "Noviembre"
  }, {
    id: 11,
    nombre: "Diciembre"
  }],

  ID_TIPO_UF: 1,
  ID_TIPO_PORCENTAJE: 6,
  ID_TIPO_PESOS: 3,
  MONTO_MINIMO_UF: 1,
  MONTO_MAXIMO_UF: 999,
  MONTO_MINIMO_PORCENTAJE: 1,
  MONTO_MAXIMO_PORCENTAJE: 100,
  MONTO_MINIMO_PESO: 1500,
  MONTO_MAXIMO_PESO: 9999999,
  INGRESO_CALLE: 'calle',
  INGRESO_NUMERO: 'numero',
  INGRESO_OFICINA: 'oficina',
  INGRESO_CORREO: 'correo',
  APV_MODIFICADA: 'APV Modificada',
  APV_INGRESADA: 'APV Ingresada',
  APV_INGRESADA_ERROR: 'APV Ingresada Error"',
  APV_APROBADA: 'APV Aprobada',
  APV_APROBADA_ERROR: 'APV Aprobada Error',
  CUENTA2_ACTIVADA: 'Cuenta2 Activada',
  CUENTA2_SUSCRIPCION: 'Cuenta2 Suscripción',
  CUENTA2_MODIFICADA: 'Cuenta2 Modificada',
  VERDADERO_CUENTA2_ACTIVA: '2',
  VERDADERO_CUENTA2_SUSCRIPCION: '1',
  MONEDA_PESO: '6',
  MONEDA_PORCENTAJE: '3',
  MAYORIA_DE_EDAD: 18,
  ESTADO_ACTIVA: 'Activa',
  ESTADO_EN_PROCESO: 'En Proceso',
  ACCESO_MENU: 'menu',
  VALOR_ID_REG_GENERAL: 2
};

export const CONSTANTES_PLANES_STEP_2 = {
  ID_PRODUCTO_CUENTA_2 : 2,
  ID_PRODUCTO_APV : 4,
  MODAL_INFORMATIVO_STEP2: 3,
  TIPO_MONEDA_UF: 1,
  TIPO_MONEDA_PORCENTAJE: 6,
  TIPO_MONEDA_PESO: 3,
  TITULO_MODAL_MANDATO : "Mandato de suscripción a Cuenta de Ahorro Voluntario (Cuenta 2)",
  TEXTO1_MODAL_MANDATO : "Por el presente instrumento, confiero Mandato a la Administradora de fondo de pensiones HABITAT S.A., para el cobro judicial y extrajudicial de los depósitos de ahorro referidos en el artículo 21 del decreto Ley 3.500 de 1980, modificado por la ley 18.545 y sus Reajustes e intereses, así como los costos que se causen con motivo de dicha cobranza.",
  TEXTO2_MODAL_MANDATO : "Al efecto faculto expresamente a la mencionada Administradora para cobrar, percibir y otorgar recibos y cancelaciones, así; como para representarme ante los tribunales de justicia, pudiendo entablar ante ellos demandas, acciones y toda clase de recursos, con las facultades del mandato judicial que se establecen en los incisos primero y segundo del articulo 7° del código de procedimiento Civil, que se dan expresamente reproducidos, pudiendo asimismo designar abogados patrocinadores y conferir poderes judiciales.",
  ACEPTA_MANDATO: 'acepta',
  RECHAZA_MANDATO: 'rechaza',

  TEXTO_SIGNO_PESO: "$",

  REGION_1: 1,
  REGION_2: 2,
  REGION_3: 3,
  REGION_4: 4,
  REGION_5: 5,
  REGION_6: 6,
  REGION_7: 7,
  REGION_8: 8,
  REGION_9: 9,
  REGION_10: 10,
  REGION_11: 11,
  REGION_12: 12,
  REGION_13: 13,
  REGION_14: 14,
  REGION_15: 15,
  REGION_16: 16,

  ACCESO_PAGINA2: 'Step2'
};

const COD_APV_STEP_1_CANCELAR = 'Suscripcion Ahorro Step 1 A Paso 2';
export const CONSTANTES_PLANES_STEP_3 = {
  ID_PRODUCTO_CUENTA_2 : 2,
  ID_PRODUCTO_APV : 4,
  TITULO_CUENTA2 : "Tu contratación de Cuenta 2 ha sido realizada con éxito! ",
  TITULO_APV : "Tu contratación de APV ha sido realizada con éxito",
  TEXTO_CUENTA2 : "La contratación de tu nuevo plan Cuenta 2 ha sido realizada con éxito y el primer descuento se materializará a partir del próximo mes.",
  TEXTO_APV : "La contratación de tu nuevo plan de Ahorro Previsional Voluntario - APV ha sido realizada con éxito y el primer descuento se materializará a partir del próximo mes.",

  NOMBRE_ARCHIVO_CORREO_CUENTA_2 : "certificadoSolicitudCuenta2.pdf",
  NOMBRE_ARCHIVO_CORREO_APV : "certificadoSolicitudAPV.pdf",
  FECHA_TEXTO_LIBRE_CORREO : "$fechaActual",
  TIPO_OPERACION_CORREO_CUENTA_2 : "Suscripci&oacute;n Cuenta 2.",
  TIPO_OPERACION_CORREO_APV : "Suscripci&oacute;n APV.",
  TITULO_CORREO_CUENTA_2 : "Comprobante Suscripci&oacute;n Cuenta 2",
  TITULO_CORREO_APV : "Comprobante Suscripci&oacute;n APV",
  TEXTO_LIBRE_CORREO_CUENTA_2 : "<p>Te informamos que se ha ingresado de forma exitosa tu suscripci&oacute;n de la Cuenta de Ahorro Voluntario (Cuenta 2), realizada en nuestra APP el d&iacute;a $fechaActual.</p><p>Recuerda que la presente suscripci&oacute;n, se har&aacute; efectiva a partir del siguiente mes de realizada esta operaci&oacute;n.</p><p>Adjuntamos el detalle de esta solicitud, es importante que lo guardes, ya que es tu comprobante.</p><p>Ante cualquier consulta, no dudes en utilizar nuestros canales de atenci&oacute;n disponibles.</p>",
  TEXTO_LIBRE_CORREO_APV : "<p>Te informamos que se ha ingresado de forma exitosa tu suscripci&oacute;n de la Cuenta de Ahorro Previsional Voluntario (APV), realizada en nuestra APP el d&iacute;a $fechaActual.</p><p>Recuerda que la presente suscripci&oacute;n, se har&aacute; efectiva a partir del siguiente mes de realizada esta operaci&oacute;n.</p><p>Adjuntamos el detalle de esta solicitud, es importante que lo guardes, ya que es tu comprobante.</p><p>Ante cualquier consulta, no dudes en utilizar nuestros canales de atenci&oacute;n disponibles.</p>",

  TEXTO_EMAIL : "Hemos enviado el comprobante a tu Email"
};

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

export const TRAZAS_PLANES = {
  CODIGO_SISTEMA : 100,
  MODULO : "ABONO WEB",

  //MARCAS APV
  COD_APV_STEP_1_INICIO : {codigo: 11400, datos: 'Suscripcion Ahorro Step 1 A'},
  COD_APV_STEP_1_ERROR: {codigo: 11431, datos: 'Suscripcion Ahorro Step 1 A'},
  COD_APV_STEP_1_CANCELAR: {codigo: 11446, datos: COD_APV_STEP_1_CANCELAR},

  COD_APV_STEP_1_FORMULARIO_1_INICIO: {codigo: 11401, datos: 'Suscripcion Ahorro Step 1-1 B Datos'},
  COD_APV_STEP_1_FORMULARIO_1_ERROR: {codigo: 11431, datos: 'Suscripcion Ahorro Step 1-1 B Datos'},

  COD_APV_STEP_1_FORMULARIO_2_INICIO: {codigo: 11442, datos: 'Suscripcion Ahorro Step 1-2 A'},
  COD_APV_STEP_1_FORMULARIO_2_ERROR: {codigo: 11432, datos: 'Suscripcion Ahorro Step 1-2 A'},

  COD_APV_STEP_1_FORMULARIO_3_INICIO: {codigo: 11443, datos: 'Suscripcion Ahorro Step 1-3 A'},
  COD_APV_STEP_1_FORMULARIO_3_ERROR: {codigo: 11433, datos: 'Suscripcion Ahorro Step 1-3 A'},

  COD_APV_STEP_2_INICIO: {codigo: 11444, datos: 'Suscripcion Ahorro Step 2 A'},
  COD_APV_STEP_2_ERROR: {codigo: 11434, datos: 'Suscripcion Ahorro Step 2 A'},
  COD_APV_STEP_2_CANCELAR: {codigo: 11445, datos: 'Suscripcion Ahorro Step 2 A'},

  COD_APV_STEP_3_INICIO: {codigo: 11403, datos: 'Suscripcion Ahorro Step 3 B'},
  COD_APV_STEP_3_ERROR: {codigo: 12010, datos: 'Suscripcion Ahorro Step 3 B'},
  COD_APV_STEP_3_DESCARGA: {codigo: 11405, datos: 'Suscripcion Ahorro Step 3 B'},


  //MARCAS CUENTA 2 (CAV)
  COD_C2_STEP_1_INICIO : {codigo: 12603, datos: 'Suscripcion Ahorro Step 1 A'},
  COD_C2_STEP_1_ERROR: {codigo: 12650, datos: 'Suscripcion Ahorro Step 1 A'},
  COD_C2_STEP_1_CANCELAR: {codigo: 12649, datos: COD_APV_STEP_1_CANCELAR},

  COD_C2_STEP_1_FORMULARIO_1_INICIO: {codigo: 12641, datos: 'Suscripcion Ahorro Step 1-1 B Datos'},
  COD_C2_STEP_1_FORMULARIO_1_ERROR: {codigo: 12651, datos: 'Suscripcion Ahorro Step 1-1 B Datos'},

  COD_C2_STEP_1_FORMULARIO_2_INICIO: {codigo: 12642, datos: 'Suscripcion Ahorro Step 1-2 A'},
  COD_C2_STEP_1_FORMULARIO_2_ERROR: {codigo: 12652, datos: 'Suscripcion Ahorro Step 1-2 A'},

  COD_C2_STEP_1_FORMULARIO_3_INICIO: {codigo: 12643, datos: 'Suscripcion Ahorro Step 1-3 A'},
  COD_C2_STEP_1_FORMULARIO_3_ERROR: {codigo: 12653, datos: 'Suscripcion Ahorro Step 1-3 A'},

  COD_C2_STEP_2_INICIO: {codigo: 12644, datos: 'Suscripcion Ahorro Step 2 A'},
  COD_C2_STEP_2_ACEPTA_MANDATO: {codigo: 12629, datos: 'Suscripcion Ahorro Step 2 A Acepto Mandato'},
  COD_C2_STEP_2_NO_ACEPTA_MANDATO: {codigo: 12630, datos: 'Suscripcion Ahorro Step 2 A No Acepto Mandato'},
  COD_C2_STEP_2_ERROR: {codigo: 12654, datos: 'Suscripcion Ahorro Step 2 A'},
  COD_C2_STEP_2_CANCELAR: {codigo: 12655, datos: 'Suscripcion Ahorro Step 2 A'},

  COD_C2_STEP_3_INICIO: {codigo: 12622, datos: 'Suscripcion Ahorro Step 3 B'},
  COD_C2_STEP_3_ERROR: {codigo: 12628, datos: 'Suscripcion Ahorro Step 3 B'},
  COD_C2_STEP_3_DESCARGA: {codigo: 12609, datos: 'Suscripcion Ahorro Step 3 B'},
}

/**
 * Trazas para Plan
 */
 export const CONSTANTES_TRAZAS_PLAN = {
  CANAL: 'APPMOBILE',
  USUARIO: 'INTERNET',
  SUCURSAL: 98,
  CODIGO_SISTEMA: 12,
  STEP1: {
      COD_C2_STEP_1_INICIO: {
          CODIGO_OPERACION: 12603,
          DATOS: 'Suscripcion Ahorro Step 1 A',
          EXITO : 0,
          MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_INICIO: {
          CODIGO_OPERACION: 11400,
          DATOS: 'Suscripcion Ahorro Step 1 A',
          EXITO : 0,
          MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_ERROR: {
        CODIGO_OPERACION: 12650,
        DATOS: 'Suscripcion Ahorro Step 1 A',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_ERROR: {
        CODIGO_OPERACION: 11431,
        DATOS: 'Suscripcion Ahorro Step 1 A',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_FORMULARIO_3_INICIO: {
        CODIGO_OPERACION: 12643,
        DATOS: 'Suscripcion Ahorro Step 1-3 A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_FORMULARIO_3_INICIO: {
        CODIGO_OPERACION: 11443,
        DATOS: 'Suscripcion Ahorro Step 1-3 A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_FORMULARIO_2_ERROR: {
        CODIGO_OPERACION: 12652,
        DATOS: 'Suscripcion Ahorro Step 1-2 A',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_FORMULARIO_3_ERROR: {
        CODIGO_OPERACION: 11433,
        DATOS: 'Suscripcion Ahorro Step 1-3 A',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_FORMULARIO_3_ERROR: {
        CODIGO_OPERACION: 12653,
        DATOS: 'Suscripcion Ahorro Step 1-3 A',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_FORMULARIO_2_INICIO: {
        CODIGO_OPERACION: 12642,
        DATOS: 'Suscripcion Ahorro Step 1-2 A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_FORMULARIO_2_INICIO: {
        CODIGO_OPERACION: 11442,
        DATOS: 'Suscripcion Ahorro Step 1-2 A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_FORMULARIO_2_ERROR: {
        CODIGO_OPERACION: 11432,
        DATOS: 'Suscripcion Ahorro Step 1-2 A',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_FORMULARIO_1_ERROR: {
        CODIGO_OPERACION: 12651,
        DATOS: 'Suscripcion Ahorro Step 1-1 B Datos',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_FORMULARIO_1_ERROR: {
        CODIGO_OPERACION: 11431,
        DATOS: 'Suscripcion Ahorro Step 1-1 B Datos',
        EXITO : 5,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_FORMULARIO_1_INICIO: {
        CODIGO_OPERACION: 12641,
        DATOS: 'Suscripcion Ahorro Step 1-2 A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_FORMULARIO_1_INICIO: {
        CODIGO_OPERACION: 11401,
        DATOS: 'Suscripcion Ahorro Step 1-1 B Datos',
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_C2_STEP_1_CANCELAR: {
        CODIGO_OPERACION: 12649,
        DATOS: COD_APV_STEP_1_CANCELAR,
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      COD_APV_STEP_1_CANCELAR: {
        CODIGO_OPERACION: 11446,
        DATOS: COD_APV_STEP_1_CANCELAR,
        EXITO : 0,
        MODULO: 'ABONO WEB'
      },
      

  },
  STEP2: {
    COD_C2_STEP_2_INICIO: {
        CODIGO_OPERACION: 12644,
        DATOS: 'Suscripcion Ahorro Step 2 A',
        EXITO : 0,
        MODULO: 'ABONO WEB'
    },
    COD_APV_STEP_2_INICIO: {
      CODIGO_OPERACION: 11444,
      DATOS: 'Suscripcion Ahorro Step 2 A',
      EXITO : 0,
      MODULO: 'ABONO WEB'
    },
    COD_C2_STEP_2_ACEPTA_MANDATO: {
      CODIGO_OPERACION: 12629,
      DATOS: 'Suscripcion Ahorro Step 2 A Acepto Mandato',
      EXITO : 0,
      MODULO: 'ABONO WEB'
    },
    COD_C2_STEP_2_NO_ACEPTA_MANDATO: {
      CODIGO_OPERACION: 12630,
      DATOS: 'Suscripcion Ahorro Step 2 A No Acepto Mandato',
      EXITO : 0,
      MODULO: 'ABONO WEB'
    },
    COD_C2_STEP_3_INICIO: {
      CODIGO_OPERACION: 12622,
      DATOS: 'Suscripcion Ahorro Step 3 B',
      EXITO : 1,
      MODULO: 'ABONO WEB'
    },
    COD_APV_STEP_3_INICIO: {
      CODIGO_OPERACION: 11403,
      DATOS: 'Suscripcion Ahorro Step 3',
      EXITO : 1,
      MODULO: 'ABONO WEB'
    },
    COD_C2_STEP_2_ERROR: {
      CODIGO_OPERACION: 12654,
      DATOS: 'Suscripcion Ahorro Step 2 A',
      EXITO : 5,
      MODULO: 'ABONO WEB'
    },
    COD_APV_STEP_2_ERROR: {
      CODIGO_OPERACION: 11434,
      DATOS: 'Suscripcion Ahorro Step 2 A',
      EXITO : 5,
      MODULO: 'ABONO WEB'
    },
    COD_C2_STEP_3_ERROR: {
      CODIGO_OPERACION: 12628,
      DATOS: 'Suscripcion Ahorro Step 3 B',
      EXITO : 5,
      MODULO: 'ABONO WEB'
    },
    COD_APV_STEP_3_ERROR: {
      CODIGO_OPERACION: 12010,
      DATOS: 'Suscripcion Ahorro Step 3 B',
      EXITO : 5,
      MODULO: 'ABONO WEB'
    },
    COD_C2_STEP_2_CANCELAR: {
      CODIGO_OPERACION: 12655,
      DATOS: 'Suscripcion Ahorro Step 2 A',
      EXITO : 0,
      MODULO: 'ABONO WEB'
    },
    COD_APV_STEP_2_CANCELAR: {
      CODIGO_OPERACION: 11445,
      DATOS: 'Suscripcion Ahorro Step 2 A',
      EXITO : 0,
      MODULO: 'ABONO WEB'
    }
  },
  STEP3: {
    COD_C2_STEP_3_DESCARGA: {
        CODIGO_OPERACION: 12609,
        DATOS: 'Suscripcion Ahorro Step 3 B',
        EXITO : 0,
        MODULO: 'ABONO WEB'
    },
    COD_APV_STEP_3_DESCARGA: {
      CODIGO_OPERACION: 11405,
      DATOS: 'Suscripcion Ahorro Step 3 B',
      EXITO : 0,
      MODULO: 'ABONO WEB'
  },
  }
}