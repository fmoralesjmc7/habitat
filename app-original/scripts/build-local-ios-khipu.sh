#!/bin/bash
sh update-props.sh 'qa'
ionic capacitor build ios --no-open -c uat
cp util/KhenshinPlugin.m ios/capacitor-cordova-ios-plugins/sourcesstatic/CordovaKhenshin/KhenshinPlugin.m
ionic capacitor open ios