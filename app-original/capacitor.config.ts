import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.app.p8414JG.qa',
  appName: 'Habitat App',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      //Salesforce Marketing Cloud Engagement Config
      "com.salesforce.marketingcloud.app_id": "11169033-397f-462b-897c-032df1a876a5",
      "com.salesforce.marketingcloud.access_token": "zjWHJaNZdebzpzHwEtH33HxE",
      "com.salesforce.marketingcloud.tenant_specific_endpoint":"https://mchzs9cvzfbjdb5hb0fcgqn5tth0.device.marketingcloudapis.com/",
      "com.salesforce.marketingcloud.analytics": "true",
      "salesforce.marketingcloud.delay_registration_until_contact_key_is_set": "true",
      "com.salesforce.marketingcloud.notification_small_icon": "ic_launcher_foreground",
    },
  },
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
    cleartext: true
  }
};

export default config;