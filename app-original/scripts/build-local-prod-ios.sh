#!/bin/bash
sh update-props.sh 'master'
ionic capacitor build ios --no-open -c production
cp util/KhenshinPlugin.m ios/capacitor-cordova-ios-plugins/sourcesstatic/CordovaKhenshin/KhenshinPlugin.m
ionic capacitor open ios