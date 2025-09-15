#!/bin/bash
export LANG=en_US.UTF-8
security unlock-keychain -p ${UNLOCK} ${PATH_KEYCHAIN}
cd ios && xcrun altool --upload-app -f build/App.ipa -u luis.basso@tinet.cl -p $(security find-generic-password -w ${PATH_KEYCHAIN} -s AppleStore)