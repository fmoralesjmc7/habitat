module.exports = {
    testTimeout: 20000,
    preset: "jest-preset-angular",
    modulePaths: ["<rootDir>"],
    transformIgnorePatterns: [
      'node_modules/(?!(@angular|@ngx-translate|capacitor-secure-storage-plugin|angular-oauth2-oidc-jwks|jsrsasign|angular-oauth2-oidc|ngx-extended-pdf-viewer))'
    ],
    roots: [
      "<rootDir>/src"
    ],
    setupFilesAfterEnv: [
      "<rootDir>/setupJest.ts"
    ],
    testPathIgnorePatterns: [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/",
      "<rootDir>/src/test.ts"
    ],
    globals: {
      'ts-jest': {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.html$"
      }
    },
    //TODO: Definir como se abordaran las coberturas de PU en el proyecto
    
    coverageThreshold: {
      global: {
        branches: 15,
        functions: 20,
        lines: 20,
        statements: 20
      }
    }
  }