#!/usr/bin/env bash
#title          : updateSonarProps.sh
#description    :
# This script parses the project's name and version from its package.json and automagically
# updates the version and package name in the SonarQube configuration properties file.
# It can be used as a pre step before running the sonar-scanner command
# It also creates a backup of the props file with suffix *.bak
#prerequisites  : NodeJS based project with package.json, sonar*.properties file in the cwd
#author         : Christian-André Giehl <christian@emailbrief.de>
#date           : 20180220
#version        : 1.0
#usage          : sh updateSonarProps.sh
#==============================================================================
echo "Updating the SonarQube properties..."

# Get the version from package.json
echo "Updating the SonarQube properties..."
if [ ${1} = "master" ] ; then
    AMBIENTE="PROD"
else
    AMBIENTE="UAT"
fi

echo "AMBIENTE: ${AMBIENTE}"

# Get the version from package.json
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted version: ${PACKAGE_VERSION}"

# Get the project name from package.json
PACKAGE_NAME=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted project: ${PACKAGE_NAME}"

# Get the build from package.json
PACKAGE_BUILD=$(cat package.json \
  | grep build \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted project: ${PACKAGE_BUILD}"

# Get the bundleId from package.json
BUNDLE_IOS_ID=$(cat package.json \
  | grep bundleId_${AMBIENTE} \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted bundle IOS id: ${BUNDLE_IOS_ID}"

BUNDLE_ANDROID_ID=$(cat package.json \
  | grep bundleId_${AMBIENTE} \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted bundle Android id: ${BUNDLE_ANDROID_ID}"

# Get the capacitor config from package.json
CAPACITOR_CONFIG_TS=$(cat package.json \
  | grep capacitorConfig_${AMBIENTE} \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted capacitorConfig: ${CAPACITOR_CONFIG_TS}"

# Get the google services config from package.json
GOOGLE_SERVICE_ANDROID_JSON=$(cat package.json \
  | grep googleService_ANDROID_${AMBIENTE} \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted googleService: ${GOOGLE_SERVICE_ANDROID_JSON}"

GOOGLE_SERVICE_IOS_JSON=$(cat package.json \
  | grep googleService_IOS_${AMBIENTE} \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted googleService: ${GOOGLE_SERVICE_IOS_JSON}"

APP_RELEASE_IOS_JSON=$(cat package.json \
  | grep appRelease_IOS_${AMBIENTE} \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "Extracted appRelease: ${APP_RELEASE_IOS_JSON}"

# Get the branch name
BRANCH_NAME=${1}
if [ -z "$BRANCH_NAME" ];
  then
    BRANCH_NAME=$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/' -e 's_\/_-_')
  else
    BRANCH_NAME=$(echo ${BRANCH_NAME} | sed -e 's/* \(.*\)/\1/' -e 's_\/_-_')
fi
echo "Extracted branch: ${BRANCH_NAME}"

#Change Capacitor Config
cp ${CAPACITOR_CONFIG_TS} capacitor.config.ts

########### SONAR ###########
# Get the Sonar properties file
SONAR_FILE=$(find ./ -iname sonar*.properties -type f)
echo "Sonar file found: ${SONAR_FILE}"

# Update the version
REPLACE='^sonar.projectVersion=.*$'
WITH="sonar.projectVersion=${PACKAGE_VERSION}"
sed -i.bak "s#${REPLACE}#${WITH}#g" ${SONAR_FILE}

# Update the project name
REPLACE='^sonar.projectName=.*$'
WITH="sonar.projectName=${PACKAGE_NAME}"
sed -i.bak "s#${REPLACE}#${WITH}#g" ${SONAR_FILE}

rm -rf "${SONAR_FILE}.bak"

########### ANDROID ###########
REPLACE='package_name.*'
WITH="package_name(\"${BUNDLE_ANDROID_ID}\") "
sed -i.bak "s#${REPLACE}#${WITH}#g" ${APPFILE_FILE}

REPLACE='version_name.*'
WITH="version_name_final(\"${PACKAGE_VERSION} (${PACKAGE_BUILD})\") "
sed -i.bak "s#${REPLACE}#${WITH}#g" ${APPFILE_FILE}
rm -rf "${APPFILE_FILE}.bak"

ANDROID_FILE=$(find ./android/app/ -iname build.gradle -type f)
echo "Android file found: ${ANDROID_FILE}"

cp ${GOOGLE_SERVICE_ANDROID_JSON} android/app/google-services.json

#Update versionCode
REPLACE='versionCode.*'
WITH="versionCode ${PACKAGE_BUILD}"
sed -i.bak "s#${REPLACE}#${WITH}#g" ${ANDROID_FILE}

#Update versionName
REPLACE='versionName.*'
WITH="versionName \"${PACKAGE_VERSION}\""
sed -i.bak "s#${REPLACE}#${WITH}#g" ${ANDROID_FILE}

#Update applicationId
REPLACE='applicationId.*'
WITH="applicationId \"${BUNDLE_ANDROID_ID}\""
sed -i.bak "s#${REPLACE}#${WITH}#g" ${ANDROID_FILE}

rm -rf "${ANDROID_FILE}.bak"

### JAVA FILE
ANDROID_MANIFEST_FILE=$(find ./android/app/src/main/ -iname AndroidManifest.xml -type f)
echo "Android Manifest found: ${ANDROID_MANIFEST_FILE}"

#Update package
REPLACE='package.*'
WITH="package=\"${BUNDLE_ANDROID_ID}\">"
sed -i.bak "s#${REPLACE}#${WITH}#g" ${ANDROID_MANIFEST_FILE}

rm -rf "${ANDROID_MANIFEST_FILE}.bak"

########### IOS ###########

IOS_FILE=$(find ./ios/App/App.xcodeproj/ -iname project.pbxproj -type f)
echo "IOS file found: ${IOS_FILE}"

cp ${GOOGLE_SERVICE_IOS_JSON} ios/App/App/GoogleService-Info.plist

cp ${APP_RELEASE_IOS_JSON} ios/App/App/AppRelease.entitlements

echo "Update bundleID Version"
REPLACE='PRODUCT_BUNDLE_IDENTIFIER.*'
WITH="PRODUCT_BUNDLE_IDENTIFIER = ${BUNDLE_IOS_ID};"
sed -i.bak "s#${REPLACE}#${WITH}#g" ${IOS_FILE}

echo "Update PROVISIONING_PROFILE_SPECIFIER Version"
REPLACE='PROVISIONING_PROFILE_SPECIFIER.*'
WITH="PROVISIONING_PROFILE_SPECIFIER = \"${PROVISING_PROFILE}\";"
sed -i.bak "s#${REPLACE}#${WITH}#g" ${IOS_FILE}

rm -rf "${IOS_FILE}.bak"
echo "Update IOS Version"
cd ios/App && agvtool new-marketing-version "$PACKAGE_VERSION" && agvtool new-version -all ${PACKAGE_BUILD}

echo "Done!"
