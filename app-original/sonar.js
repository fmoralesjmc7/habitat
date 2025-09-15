const scanner = require('sonarqube-scanner');
const DotJson = require('dot-json');
const branchName = require('current-git-branch');
const packageJSON = new DotJson('package.json');

scanner(
  {
    serverUrl : process.env.URL_SONAR,
    token :process.env.TOKEN_SONAR,
    options: {
      'sonar.projectName': packageJSON.get('name'),
      'sonar.projectKey' : packageJSON.get('author')+"-"+packageJSON.get('name'),
      'sonar.branch.name': branchName(),
      'sonar.sources':'src',
      'sonar.exclusions':'**/node_modules/**,src/assets/**/*.*,**/*.module.ts,src/environments/*.*,src/test.ts,src/main.ts,src/app/shared/services/keycloak/keycloak.service.ts,src/app/store/hydration/*,**/*.mock.ts,**/mocks/*.ts',
      'sonar.tests':'src',
      'sonar.test.inclusions':'**/*.spec.ts',
      'sonar.javascript.lcov.reportPaths':'coverage/lcov.info',
      'sonar.sourceEncoding':'UTF-8'
    }
  },
  () => process.exit()
)