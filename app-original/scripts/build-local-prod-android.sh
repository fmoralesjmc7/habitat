#!/bin/bash
npx jetify
sh update-props.sh 'master'
cp util/khenshin.gradle node_modules/cordova-khenshin/src/android/khenshin.gradle
ionic capacitor build android  --no-open -c production
cd android && chmod +x gradlew && ./gradlew assembleRelease