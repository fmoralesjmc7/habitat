#!/bin/bash
mvn install:install-file -Dfile=./util/volley-1.1.1.aar -DgroupId=com.android.volley -DartifactId=volley -Dversion=1.1.1 -Dpackaging=aar -DgeneratePom=true
npx jetify
sh update-props.sh 'qa'
cp util/khenshin.gradle node_modules/cordova-khenshin/src/android/khenshin.gradle
ionic capacitor build android --no-open -c uat
cd android && chmod +x gradlew && ./gradlew assembleDebug