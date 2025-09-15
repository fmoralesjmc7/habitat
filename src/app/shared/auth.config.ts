import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: environment.urlServiciosLogin,
  redirectUri: window.location.origin + '/index.html',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  clientId: environment.oauthClientId,
  dummyClientSecret: environment.oauthClientSecret,
  scope: 'openid profile offline_access refresh_token roles ws_front',
  showDebugInformation: environment.oauthShowDebugInformation,
  oidc: false,
  requireHttps: environment.oauthHttps,
  responseType: 'token id_token code',
  sessionChecksEnabled: true,
  clearHashAfterLogin: false,
  nonceStateSeparator: 'semicolon',
  disableAtHashCheck: true
};

