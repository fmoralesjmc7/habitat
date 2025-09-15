module.exports = {
  testTimeout: 20000,
  preset: "jest-preset-angular",
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/src"],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'jest'],
  },
  modulePaths: ["<rootDir>"],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'html', 'json'],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  // Asegura resolución de subpath exports de Angular en Jest
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
  // Transforma TS/JS/MJS y templates
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      [
        '@angular',
        '@ionic',
        '@stencil',
        'ionicons',
        'swiper',
        'dom7',
        'ssr-window',
        'lit',
        '@lit',
        'lit-html',
        'lit-element',
        '@capacitor',
        '@ngx-translate',
        'angular-oauth2-oidc',
        'angular-oauth2-oidc-jwks',
        'jsrsasign',
        'capacitor-secure-storage-plugin',
        'ngx-extended-pdf-viewer',
        'uuid',
        'tslib',
      ].join('|') +
      ')/)',
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/src/test.ts",
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  //TODO: Definir como se abordaran las coberturas de PU en el proyecto
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
