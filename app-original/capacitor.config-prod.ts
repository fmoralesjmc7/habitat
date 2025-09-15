import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.app.p8414JG',
  appName: 'Habitat App',
  webDir: 'www',
  cordova: {
    preferences: {
      //Salesforce Marketing Cloud Engagement Config
      "com.salesforce.marketingcloud.app_id": "3882fa5b-9824-40e0-a64e-11a3ce75287a",
      "com.salesforce.marketingcloud.access_token": "w3Ggwf0SPq34nw1RSiWd1Fvg",
      "com.salesforce.marketingcloud.tenant_specific_endpoint":"https://mchzs9cvzfbjdb5hb0fcgqn5tth0.device.marketingcloudapis.com/",
      "com.salesforce.marketingcloud.analytics": "true",
      "salesforce.marketingcloud.delay_registration_until_contact_key_is_set": "true",
      "com.salesforce.marketingcloud.notification_small_icon": "ic_launcher_foreground",
    },
  },
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      "launchAutoHide": true,
      "launchShowDuration": 4000
    },
    Keyboard: {
      resize: KeyboardResize.Ionic,
    }
  },
  server: {
    cleartext: false // utilizado para permitir llamadas http
  }
};

export default config;