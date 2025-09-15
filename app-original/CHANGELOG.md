# CHANGELOG - Ionic - APP Base

Todo cambio importante será documentado en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y el esquema de versionamiento de este proyecto se adhiere al
[Versionamiento semántico](https://semver.org/spec/v2.0.0.html).

## Added

[comment]: <> (Incluir acá funcionalidades nuevas)

## Changed

[comment]: <> (Incluir acá funcionalidades modificadas)

## Removed

[comment]: <> (Incluir acá funcionalidades eliminadas)

## [Version 4.4.17] - 12/08/2025

Jira: <https://afphabitat-cl.atlassian.net/browse/APPMOB24-36>

Build 246:

- Cambio de texto.
- Fix pruebas unitarias

Build 245:

- Cambio de nombre de cuentas a nombre personalizado.

Build 244:

- Correción diseño apra pantallas pequeñas.
- Cambio de nombre de cuentas a su nombre completo.

### Changed

Build 243:

- Se agrega módulo de saldos diarios.


## [Version 4.4.16] - 31/07/2025

Jira: <https://afphabitat-cl.atlassian.net/browse/DIG2025-15>

### Changed

Build 240:

- Fix request solicitud giro.

Build 238:

- Se agrega botón que redirige a Whatsapp desde el módulo de login (Android / IOS)
- Se reduce deuda técnica y correcciones de bugs de sonar.

## [Version 4.4.15] - 24/06/2025

Jira: <https://afphabitat-cl.atlassian.net/browse/APPMOBCL-70>

### Changed

Build 236:

- Se cambia la versión de la dependencia de Khipu a la 7.7.0 ya que es la última compatible.

Build 235:

- Se cambia deja fija la versión de la dependencia de Khipu a la 7.8.1 ya que es la última que funciona con el SDK 34 de android.

Build 234:

- Se cambia teléfono de contacto a 600 220 2000.
- Correcciones sonar.

Build 229:

- Corrección para renderizado de mapas de Google en IOS, para utilizar solo Metal en vez de OpenGL.

## [Version 4.4.14] - 10/04/2025

Jira: <https://afphabitat-cl.atlassian.net/browse/APPMOB24-141>

### Changed

Build 227:

- Corrección posición botones Cartola mensual.
- Corrección acordeón.
- Corrección color botón descarga y horario contact center.
- Corrección tamaño título Certificados y Cartolas.
- Se quita redirección para Certificado de Pensionado a certificado-detalle.
- Se agrega tilde a todas las palabras "Período".

Build 226:

- Actualización número telefónico Contact Center.

Build 225:

- Rediseño flujo Certificados y Cartolas
- Cambio imagen de login
- Rediseño Contact Center - Cambio logo twitter(X)
- Corrección problema pdf adjunto vacío en correo (MDATICL-157006) 11/04/2025

Build 224:

- Correción para guardado de idTransacción

Build 223:

- Se agrega integración con servicio para obtener valor mínimo de depósito
- Se agrega integración con servicio nuevo para la confirmación de la transacción

Build 222:

- Se agregan campos para deposito directo cuenta 2.
- Cambios en giro para que se muestre el email correctamente

## [Version 4.4.13] - 14/01/2024

Jira: <https://afphabitat-cl.atlassian.net/browse/APPMOBCL-49>

Build 217:

### Changed

- Se genera token en caso de biometría.

## [Version 4.4.12] - 08/11/2024

### Added

Build 212:

- Se agregan modulos de campaña prudential.
- Consolidación de saldos en menú
- Integración con token aws.
- error en saldos prudential
- texto depositos convenidos

[comment]: <> (Incluir acá funcionalidades eliminadas)

## [Version 4.4.11] - 30/|10/2024

Jira: <https://afphabitat-cl.atlassian.net/browse/APPMOBCL-38>

### Changed

Build 204:

- Cambios por vulnerabilidades H-APP-02 y H-APP-05

## [Version 4.4.10] - 25/10/2024

### Added

Build 203:

- Se quita linea duplicada de "com.google.android.gms.permission.AD_ID"

Build 202:

- Actualizacion texto vale vista.
- fix logo habitat notificaciones.

Build 201:

- Se cambian textos normativos (giros, depósito directo y vale vista).
- Se agrega toast con mensaje para rut de fallecido.

## [Version 4.4.9] - 11/10/2024

### Added

- Se integra SDK de Marketing cloud para notificaciones en salesforce

## [Version 4.4.8] - 02/09/2024

Jira: <https://afphabitat-cl.atlassian.net/browse/APPMOB24-7>

### Changed

Build 194:

- Cambio de notify_url por notify_api_version

Build 193:

- Se actualiza logo header afp
- Se actualiza versión Khipu

# Version 4.4.7

### Changed

Build 190:

- Se ignora el permiso para anuncios com.google.android.gms.permission.AD_ID

### Changed

Build 189:

- Actualiza a SDK Android API 34

# Version 4.4.6

<https://afphabitat-cl.atlassian.net/browse/APPMOBCL-23>

Build 188:

- Actualiza keys de firebase produccion
- Mejora manejo listener de notificaciones push
- Actualiza capacitor por error de notificaciones en dispositivos push android 13
- Agrega menu politicas de privacidad

# Version 4.4.5

<https://afphabitat-cl.atlassian.net/browse/WEBPRCL-145>

Build 184:

- actualiza build

Build 183:

- Se agrega logica para validar con token sms giro apv y cuenta2

# Version 4.4.4

<https://jira.afphabitat.net/browse/WEBPR-WEBPR-26074>

---

Build 181:

- Se agrega servicio para obtener obtener cuenta apv con bonificacion fiscal descontada al intentar hacer giro

# Version 4.4.3

<https://jira.afphabitat.net/browse/WEBPR-24626>

Build 176:

- Cambio de SDK de Android a la version 33
- Actualizar Video último Estado de Cuenta Mensual
- Resuelve problema de linea roja en el home cuando se visitaban las paginas de centro asesoria
  Build 177:
- Se agrega codigoCategoriaCertificado a todos los certificados para solucionar error al llamar al servicio de generar certificados.
- Compilación para QA
  Build 178:
- Compilación para producción.
  Build 179:
- Fix seleccion y descarga de certificados para android 13
- Compilación para QA
  Build 180:
- Compilacion para Producción

# Version 4.4.2

### Changed

- Build 175:
  - Fix Mes de inicio en cert. liq. de pension

# Version 4.4.1

### Changed

- Build 162:

  - Fix texto pantalla de descarga liquidación de pensión

- Build 164:
  - cambio numero de version

# Version 4.4.0

### Changed

- Build 134:
  - Rediseño Home Tus Datos
- Build 135:
  - Rediseño Visualizar Datos Contacto
- Build 135:
  - Rediseño Editar Datos Contacto, SMS y comprobante
- Build 137:
  - Liquidación de pensiones
- Build 138:
  - Implementación modal landing
  - Rediseño modal tus datos
  - Implementación mensaje residencia
  - Manejo error rentabilidad
- Build 139:
  - Rediseño Visualizar Datos Contactos v2
- Build 140:
  - Rediseño Visualizar Datos Laborales
  - Re diseño clave única,
  - Validaciónes browser
  - Menu hamb dinámico
- Build 141:
  - Fix clave única
  - Re diseño SMS clave dinámica
  - re Diseño comprobante éxito
  - Rediseño editar datos laborales
- Build 142:
  - Integración liquidacion de pensionados
- Build 143:
  - Se agrega filtro deeplink para evitar conflictos con otras navegaciones fuera de clave unica
- Build 144:

  - Cambios login:
    - Imagen principal
    - Logo
    - Actualización forzosa android

- Build 145:

  - Cambios login:
    - Imagen Biometría y Bievenida
    - Estilo botónes

- Build 146:

  - Modificación mensaje centro de asesoría
  - Modificación largo input simulador

- Build 147:

  - Fix slide home
  - Fix tamaños botónes login

- Build 148:

  - Fix colores slide bienvenida

- Build 152:

  - Fix padding login híbrido

- Build 153:
  - Fix Deeplink android 12
  - Se agrega firma automaticamente

# Version 4.3.0

### Changed

- Build 125:
  - Rediseño login sin biometría
- Build 126:
  - Se agrega certificado para Pensionados
  - Rediseño login con biometría
- Build 127:
  - Corrección issue ios en login hibrido
- Build 128:
  - Upgrade capacitor
  - Cambio orden iconos home
  - Cambio para mapa en sucursales
- Build 129:
  - Fix cambio icon
- Build 130:
  - Rediseño activar huella
  - Corrección iconos login hibrido
- Build 131:
  - Cambios trazas Login
  - Cambios trazas Home
  - Cambios trazas Giro de ahorro
  - Rediseño configuraciones
- Build 132:
  - Cambios trazas deposito directo
- Build 133:
  - Integración clave única y deeplink
  - Corrección trazas Khipu
  - Trazas para certificados
  - Plan de ahorro
  - Cambio de fondo
  - Cambio splash
  - Trazas para centro de asesoría
  - Trazas para notificaciones
  - Trazas para actualizar datos
  - Fix Trazas duplicadas login y cartolas

---

# Version 4.2.0

### Changed

- Build 119:

  - Se realiza cambio para filtrar los bancos que deberías mostrarse en Giro de Ahorro
  - Rediseño pantalla de error

- Build 120:

  - Implementación pantalla error centro de asesoría
  - Corrección issues

- Build 121:
  - Implementación pantalla error:
    - Cambio de fondos
    - Giro de ahorro
    - Plan de ahorro
    - Clave sacu
  - Trazabilidad
    - Pensión
    - Beneficio tributario
- Build 122:
  - Implementación pantalla error actualizar datos y saldos discordantes home
  - Implementación pagina de error deposito directo
  - Implementación pantalla de error certificados
- Build 123:
  - Trazabilidad planes de ahorro
  - Trazabilidad CDF
  - Trazabilidad Rentabilidad
  - Trazabilidad Publicaciones
  - Trazabilidad Certificados
  - Trazabilidad Depósito Directo
- Build 124:
  - Trazabilidad Depósito Directo Fix

---

# Version 4.1.0

### Added

- Se agrega icono nuevo de menu hamburguesa
- Se agrega icono en home "valores Cuota"
- Se agrega icono para cerrar el menu desplegable.

- Build 111:
  - Implementación servicio obtención barra informativa
  - Implementación Despliegue barra informativa
- Build 112:
  - Se agrega 1.6vh al home para mantener proporcionalidad en los elementos.
  - Se agrega diseño de cuentas con carrusel de nombres de cuentas y microinteracciones.
- Build 113:
  - Se cambio el diseño del menu desplegable
- Build 114:
  - Corrección issue menú
- Build 115:
  - Rediseño detalle de cuentas home
- Build 116:
  - Corrección caché barra informativa
  - Corrección issues detalle de cuentas
- Build 117:
  - Se agrega volver atrás desde titulo del producto en detalle de cuentas
- Build 118:
  - Se integra uuid dinamico en notificaciones

### Changed

- Se cambia diseño header
- Se realiza cambio visual a cuentas home
- Se realiza cambio visual a enunciado en home
- Corrección de estilos
- Fix minors (solo uuid)
- Corrección icono hamburguesa
- Se cambia el numero telefonico en actualiar datos sms ej: +569 871 578 51 => +569 XXX XXX 51
- Se agrega opción de menú Tus Datos
- Se libera funcionalidad oculta Tus Datos
- Se agrega lógica para glosa por ambiente en el login
- Corrección menú iphone 7
- Se agrega uuid dinamico:
  - Home
  - Actualizar datos
  - Actualizar datos SMS (lo conserva desde actualizar datos)
- Corrección trazas repetidas en home
- Se cambian los siguientes inputs en editar datos labores:
  -numero: alfanumerico, largo 10
  -Depto: alfanumerico, largo 6
  -Block: alfanumerico, largo 100
  -Villa / Poblacion: alfanumerico, largo 50
- Se agrega mejora manejo de errores en el formulario datos de contacto
- Se agrega marca obligatorio a campo telefono datos de contacto
- Se agrega link a Sucursales en caso de no tener telefono para editar datos
- Correciones visuales datos contacto
- Corrección volver atrás pantalla editar con botón nativo
- Corrección validación email
- Correcciones sonar
- Corrección espacio al abrir el teclado
- Se agrega link sucursales en modal informativo página sms
- Se cambia diseño botones home: valores cuota, tus certificados, centro de asesoria
- Se cambia diseño botones home: Cambio de Fondo,Giro de Ahorro,Fecha pago de pensiones,Plan de Ahorro,Contáctanos,Depósito Directo
- Se cambia color de texto para botones home: valores cuota, tus certificados, centro de asesoria,Cambio de Fondo,Giro de Ahorro,Fecha pago de pensiones,Plan de Ahorro,Contáctanos,Depósito Directo
- Cambio texto de Fecha pago de pensiones a Fecha Pago Pensión

---

# Version 4.0.8

### Changed

- Se cambia input "Numero de cuenta" para que no se ingresen ceros delanteros, textos y que cada numero seleccionado aparezca con un solo toque.
- Implementación modal cuentas bipersonales y digitales en paso 1 de giro de ahorro
- Implementación validación cuentas digitales en paso 2 de giro de ahorro
- Implementación check vale vista para cuentas ditigales
- Implementación servicio blacklist de cuentas

Build 108:

- Corrección issue paso 1 en android, teclado tapa input de montos
- Corrección issue check vale vista en ios
- Implementación trazas con uuid dinamico en giro
- Corrección de textos

Build 109:

- Corrección espacio teclado input de cuentas paso 2

---

# Version 4.0.7

### Changed

- Se cambia el numero telefonico en giro ej: +569 871 578 51 => +569 XXX XXX 51
- Corrección issues:
  - Ajusté de contorno celeste en input
  - Chevron Legal al expandirlo en resultado de simulación está al revés

---

# Version 4.0.6

### Changed

- Se agrega soporte ipad

# Version 4.0.5

### Changed

- Se agrega validación de Google Mobile Services para dispositivos Huawei, esto corrige el crash de la aplicación al ingresar a sucursales
- Se pasa google key maps a environment
- Se agrega logica para redireccion a store de huawei en caso de ser android sin gGoogle Mobile Services
- Se cambia url de cambiate a habitat en home invitado
- Se elimina librería cordova-res utilizada solo para desarrollo (corrección seguridad)
- Se agrega propiedad android:allowBackup="false" a AndroidManifest.xml (corrección seguridad)
- Modificación de imágenes background y logo Habitat.

# Version 4.0.4

### Changed

- Corrección issues Khipu:
  - Fondo transparente khipu pantalla éxito
  - Header transparente khipu
  - Modal contextual khipu

# Version 4.0.3

### Changed

- Corrección issues sucursales
- Corrección issues centro asesoría

# Version 4.0.2

### Changed

- Migración componente expandable desde ionic 4
- Fix errores de compilación para uat y producción
- Corrección build-ios.sh, se quitan development_team y bundle por defecto para que utilice el configurado en package.json
- Corrección issue al ocultar splash, se mostraba pantalla negra antes de cargar el DOM
- Fix visuales ionic 6 contacto - ejecutivo.
- Migración componente sucursales
- Integración librerías:
  - @capacitor-community/capacitor-googlemaps-native
  - @capacitor/geolocation
- Corrección issue menú invitado

# Version 4.0.1

### Changed

- Migración ionic 6 contacto + consultor.
- Fix migración login.

# Version 4.0.0

### Changed

- Cambio a Ionic 6 funcionalidades bienvenida , login , home , cdf , giros , planes de ahorro , deposito directo , centro de asesoria , certificados y cartolas,
  contacto , configuraciones.

# Version 3.6.1 | 15/06/2020

### Added

Se agrega valor de 100% en el paso 2 de Cambio de Fondo.

### Changed

Fix issue: Se ordena las cuentas que llegan a CDF.
Fix issue: Se corrige corrimiento de datos en modelo S8 Android.
Corrección problema altura toast en dispositivos Android.

# Version 3.4.0 | 06/01/2020

### Added

Planes de ahorro CAV & APV.
Rediseño certificados.
Cartola mensual + video.

# Version 3.3.1 | IOS 09/12/2019 - Android 05/12/2019

### Added

Giros APV.

### Changed

Fix deposito directo.
Fix >= CDF.

# Version 3.2.3 | 23/09/2019

### Changed

Fix teclado android.
Fix issues centro de asesoría.

# Version 3.2.0 | 10/09/2019

### Added

Centro de asesoría.

### Changed

Cambio a Ionic 4.

# Version 2.2.5 | 12/08/2019

### Added

Giros CAV ( Ionic 3 )
