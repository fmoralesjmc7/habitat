#!/bin/bash
export LANG=en_US.UTF-8
ionic capacitor build ios --prod --no-open --no-build
echo "unlock-keychain"
security unlock-keychain -p ${UNLOCK} ${PATH_KEYCHAIN}
cd ios && xcodebuild -workspace App/App.xcworkspace -scheme App -sdk iphoneos -configuration Release clean
xcodebuild archive -workspace App/App.xcworkspace -scheme App -sdk iphoneos -configuration Release -archivePath build/App.xcarchive -allowProvisioningUpdates "OTHER_CODE_SIGN_FLAGS=--keychain '${PATH_KEYCHAIN=}'"
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportOptionsPlist ./build/App.xcarchive/Info.plist -exportPath "build" "OTHER_CODE_SIGN_FLAGS=--keychain '${PATH_KEYCHAIN=}'"
