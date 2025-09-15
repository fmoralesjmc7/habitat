# V1. workaround problema khipu emulador mac m1
# Encargado de desactivar dependencia khipu con el fin de poder ejecutar app en emulador con mac m1.
# No aplica para dispositivos fisico o emulador con mac x86.
# Para poder correr el script, se debe ejecutar "sudo sh scripts/remove-khipu/remove.sh"
# Warning: No commitear cambios realizados por el script , el uso es solo para trabajo en local.

#!/bin/bash
npm remove cordova-khenshin
npm remove @capacitor-community/capacitor-googlemaps-native
npm remove @capacitor/geolocation
rm -rf node_modules/
npm install
cp scripts/remove-m1-dependencies/replace-khipu.ts src/app/pages/deposito-directo/ingreso-datos/ingreso-datos.page.ts
cp scripts/remove-m1-dependencies/replace-sucursales.ts src/app/pages/sucursales/sucursales.page.ts