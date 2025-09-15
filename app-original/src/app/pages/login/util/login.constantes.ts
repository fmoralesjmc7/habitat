/**
 * Contantes para toast del login
 */
 export const CONSTANTES_TOAST_LOGIN = {
    TEXTO_CLAVE_BLOQUEADA: 'Importante: Tu clave de acceso se encuentra bloqueada. Para desbloquearla en línea ingresa aquí.',
    TEXTO_CLAVE_MODIFICADA: 'Importante: Hemos detectado que modificaste tu clave de acceso. Por favor vuelve a ingresar tu RUT y nueva clave.',
    TEXTO_INGRESA_CLAVE: 'Importante: Ingresa nuevamente con tu clave de acceso.',
    TEXTO_ERROR_SERVICIO: 'Importante: Nuestro servicio presenta problemas en este momento. Por favor vuelve a intentar más tarde.',
    TEXTO_DATOS_INDALIDOS: 'Importante: Tu RUT y/o clave de acceso ingresados no son válidos.',
    TEXTO_CLIENTE_FALLECIDO: 'Importante: Este RUT se encuentra con estado fallecido.'
}

/**
 * Constantes para login
 */
export const CONSTANTES_LOGIN = {
    LOGEADO: 'S',
    NO_LOGEADO: 'N',
    BLOQUEADO: 'B',
    TITULO_HUELLA: 'Habitat Login Biométrico',
    SUBTITULO_HUELLA: 'Usa tu Huella Digital para iniciar sesión en tu Habitat App',
    BOTON_HUELLA: 'Cancelar',
    TIPO_BIOMETRIA_FACE: 'face',
    ERROR_BIOMETRIA: '10'
}

/**
 * Trazas para login
 */
 const LOGIN_DATOS = 'Login EXITO';
 const LOGIN_MODULO = 'ACCESO AL SITIO PRIVADO'
 
 export const CONSTANTES_TRAZAS_LOGIN = {
    CANAL: 'APPMOBILE',
    USUARIO: 'INTERNET',
    SUCURSAL: 98,
    CODIGO_SISTEMA : 10,
    LOGIN_EXITO: {
        CODIGO_OPERACION: 19400,
        DATOS: LOGIN_DATOS,
        EXITO : 1,
        MODULO: LOGIN_MODULO,
    },
}

export const CONSTANTES_TRAZAS_LOGIN_BIOMETRIA = {
    CANAL: 'APPMOBILE',
    USUARIO: 'INTERNET',
    SUCURSAL: 98,
    CODIGO_SISTEMA : 100,
    LOGIN_BIOMETRIA_HUELLA: {
        DATOS: LOGIN_DATOS,
        EXITO : 1,
        MODULO: LOGIN_MODULO,
        CODIGO_OPERACION: 28270
    },
    LOGIN_BIOMETRIA_REGISTRAR_HUELLA: {
        DATOS: LOGIN_DATOS,
        EXITO : 1,
        MODULO: LOGIN_MODULO,
        CODIGO_OPERACION: 28289
    },
    LOGIN_BIOMETRIA_ERROR: {
        CODIGO_OPERACION: 28288,
        DATOS: 'Login Biometrico ERROR',
        EXITO : 5,
        MODULO: LOGIN_MODULO,
    },
}

export const CONSTANTES_ACTIVACION_BIOMETRIA = {
    finger: 'Huella',
    face: 'FaceID',
    biometric: ' Biometría'
}

export const CONSTANTES_WHATSAPP = {
    WHATSAPP_NUMERO: '56959821111',
    WHATSAPP_MENSAJE: '¡Hola!',
    TEXTO_WHATSAPP_NO_INSTALADO: 'No tienes WhatsApp instalado en tu dispositivo. Por favor, instálalo para contactarnos.',
}