// Archivo de configuraciones oauth2

import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
  // Url servidor de autenticacion
  issuer: environment.urlServiciosLogin,

  // URL para redirigir al usuario post login exitoso
  redirectUri: window.location.origin + '/index.html',

  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: environment.oauthClientId,

  // Secret
  dummyClientSecret: environment.oauthClientSecret,

  // Configuracion scope
  scope : 'openid profile offline_access refresh_token roles ws_front',

  showDebugInformation: environment.oauthShowDebugInformation,

  // Seteado en falso , por el uso embebido de autorización
  oidc: false,

  // Indica si se implementa https
  requireHttps: environment.oauthHttps,

  responseType: 'token id_token code',

  sessionChecksEnabled: true,

  clearHashAfterLogin: false,

  nonceStateSeparator : 'semicolon',

  disableAtHashCheck: true
};
