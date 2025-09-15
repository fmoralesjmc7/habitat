import { AuthConfig } from 'angular-oauth2-oidc';
/**
 * Constantes del proyecto.
 */
export const constantes = {
  // Idioma de proyecto
  LANGUAGE: 'es',



  //Tiempo de duración para toast de error en login
  TIME_HIDE_LOGIN_TOAST: 8000,
  //Nombre de campo input rut
  RUT_INPUT: 'rut',
  //Nombre de campo input clave
  CLAVE_INPUT: 'password',
    //Icono clave visible
    SHOW_PASS:"/assets/images/eye-fill.svg",
    //Icono clave oculta
    HIDE_PASS:"/assets/images/eye-slash-fill.svg",
    
  //Numero Contacto
  CONTACT_PHONE: '+56226636600',
  //URL Cliente
  CLIENT_LINK: 'https://tinet.cl/'
};

/**
 * Constantes de guardado de datos
 */
export const SAVE_DATA = {
  //Nombre de campo en storage para validar inicio de sesión
  USER_NAME: 'userName',
  WELCOME_OK: "WELCOME_OK"
};

// propiedades toast
export const TOAST = {
  DURATION: 8000,
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'danger',
  POSITION: 'top',
};

export const FIREBASE_RDB = {
    UPDATE_REQUIRED_IOS: "versionObligatoriaIOS",
    UPDATE_REQUIRED_ANDROID: "versionObligatoriaAndroid"
}

export const PLATFORM_DEVICE = {
  ANDROID: 'android',
  IOS: 'ios',
};

export const RUTAS ={
  LOGIN_ROUTE: "login",
  HOME_ROUTE: "home"
}

export const STORE_URL = {
  // Cambiar post definicion app
  ANDROID: "https://play.google.com/store/apps/details?id=com.spotify.music&hl=es",
  IOS: "https://apps.apple.com/us/app/spotify-new-music-and-podcasts/id324684580"
}

export const authConfig: AuthConfig = {
  // Url servidor de autenticacion
  issuer: 'https://apiv2.cert.afphabitat.cl/oauth2/',
  // URL para redirigir al usuario post login exitoso
  redirectUri: window.location.origin + '/HomeClientePage',
  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri:window.location.origin + '/HomeClientePage',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'sitio-nuevaweb',
  // Secret
  dummyClientSecret: 'NImTpQcj2aLDDSqr-tRifnJJiZ0L7fZhDpnMUp06dwh5iqZTJEPf3vGEk2TXIIh5jMeFcUaBwVvOtNQEz6oRdw',
  // Configuracion scope
  scope: 'openid profile offline_access refresh_token roles ws_front', // Mantén los mismos scopes
  showDebugInformation: true,
  // Seteado en falso , por el uso embebido de autorización
  oidc: false,
  // Indica si se implementa https
  requireHttps: false,
  responseType: 'token id_token code',
  sessionChecksEnabled: true,
  clearHashAfterLogin: false,
  nonceStateSeparator : 'semicolon',
  disableAtHashCheck: true
};
