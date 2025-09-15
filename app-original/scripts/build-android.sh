#!/bin/bash
ionic capacitor build android --prod --no-open --no-build
cd android && ./gradlew assembleDebug