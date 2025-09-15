// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --cert` replaces `environment.ts` with `environment.cert.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  oauthClientSecret: 'NImTpQcj2aLDDSqr-tRifnJJiZ0L7fZhDpnMUp06dwh5iqZTJEPf3vGEk2TXIIh5jMeFcUaBwVvOtNQEz6oRdw',
  oauthHttps: true,
  oauthClientId: 'sitio-nuevaweb',
  oauthShowDebugInformation: false,
  individeoEnv: 'uat',
  individeoSrc: 'https://s3.amazonaws.com/individeo.bluerush.ca/individeo/prod/v18/js/smartEmbed.js',
  individeoCode: 'hnLbnuSRqsBKMLcBHRSA-212',
  indicatorURL: 'https://mindicador.cl/api',
  mockHttpCalls: false,
  mockedResponseDelay: 0,
  mockedResponseSuccessRate: 1,
  baseURL: 'https://cert-wsfront.afphabitat.cl',
  urlHabitat: 'https://www.afphabitat.cl',
  keyGoogleMap: 'AIzaSyCtvs6v8ME50lWh0ScAu0THikx8oS2AMeY',
  urlClaveUnicaToc: 'https://claveunica.7oc.cl/auth?access_token=',
  urlClaveUnica: 'https://claveunica.gob.cl',
  urlServiciosLogin: 'https://apiv2.qa.afphabitat.cl/oauth2/',
  dominioAws: 'apiv2.qa.afphabitat.cl',
  dominioSaldos: 'https://apiv2.qa.afphabitat.cl'
};

// Habilitar para certificacion.
export const ENV = {
  base_url: 'https://cert-wsfront.afphabitat.cl',
  base_url_aws: 'https://apiv2.qa.afphabitat.cl',
  base_url_habitat: 'https://wwwcert.afphabitat.cl',
  prudential_back: 'https://apiv2.qa.afphabitat.cl/prudentialback/api2/v1/prudential/prudentialback/'
};
