# Estructura de directorios proyecto Angular

Este documento comienza a definir el estándar que se utilizará en Tinet para estructurar a nivel de directorios los diferentes elementos y recursos de un proyecto Angular.

Este documento es una versión inicial y mejorable, al ir realizando ajustes y mejoras a este documento se dejará un registro en el último punto de este documento en la sección de versionamiento (`punto 5`).


## 1. Estructura base

A continuación se detalla la estructura de directorios que debe tener un proyecto angular:

- **/src** :Directorio base del proyecto que contendrá todos los elementos y recursos que contiene la aplicación.
  - **/app** : Directorio que contendrá los elementos de la aplicación. En el `punto 2` se detalla la estructura interna de este directorio para mejor explicación.
  - **/assets** : Directorio que contendrá cualquier recursos disponibles para que utilice los elementos de la aplicación (fonts, imagenes, favicons, etc).
    - **/images** : Contendrá los recursos de imágenes disponibles.
    - **/fonts** : Contendrá los archivos de estilo de texto disponibles.
    - **/icons** : Contendrá el favicon de la aplicación y para el caso de aplicaciones PWA[1] contendrá los iconos para los diferentes sistemas operativos (Android, iOS Apps, etc).
    - **/styles** : Contendrá los archivos .scss de uso común que son importados en los distintos _components_ de la aplicación.
    - **/locale** o **/i18n** : Contendrá los archivos correspondientes a los _labels_ y mensajes que despliega la aplicación en caso de tener configurada la internacionalización[2].
    - **/enviroments** : Directorio que contendrá los archivos de constantes que se utilizarán según el perfil de compilación utilizado y previamente configurado en el archivo _angular.json_ de la aplicación.


## 2. Estructura directorio /App

El directorio App contiene toda la aplicación a nivel programático por lo que se debe tener una estructura lo más ordenada en nivel de conceptos. A continuación se detalla la estructura que contiene el directorio App en su interior:

- **/modules** : Directorio que contendrá los sub módulos que pueden existir en la aplicación que dentro debe seguir el patrón de directorios que se detallan en el directorio principal App.
- **/components** : Directorio que contendrá los componentes de vistas de la aplicación (ej. home, menu, login, etc.), En el `punto 3` se detalla la estructura interna de este directorio para mejor explicación..
- **/services** : Directorio que contendrá los service que se utilizarán en la aplicación.
- **/model** : Directorio que contendrán las clases TO que se utilizarán en la aplicación.
- **/shared** : Directorio que contendrá elementos de uso compartido por toda la aplicación ya sean componentes genéricos (como input, loading, etc) o funcionalidades que se consideran en el punto de excepciones (`Punto 4`).
- **/utils** : Directorio que contendrá clases y funciones que pueden ser utilizadas por cualquier elemento de la aplicación se detallan como ejemplo algunas a continuación.
  - **/validatos** : Validadores de _reactive forms_.
  - **/pipes** : Pipes de uso común.
  - **/helpers** : Clases auxiliares.
  - **/directives** : Directivas para uso en el DOM.
  - **/constants** : Fuentes de constantes.
  - **/enum** : Fuentes de enums.


## 3. Estructura directorio /components

El directorio de components contienen los componentes que controlan las vistas de nuestra aplicación por lo que se recomienda tener una estructura lo más parecida posible a cómo se navega y se despliegan en nuestra aplicación.

Para detallar esta estructura utilizaremos como ejemplo un sitio que contiene un login y luego un home que tiene un menú y la aplicación también contiene un wizard que se compone por tres pasos. Para este ejemplo se debería construir una estructura de la siguiente forma:

- **/components**
  - **/login**
    - [Fuentes componente login]
  - **/home**
    - [fuentes componente home]
    - **/menu**
      - [Fuentes componente menu]
  - **/wizard**
    - [Fuentes componente wizard]
    - **/step1**
      - [Fuentes componete step1]
    - **/step2**
      - [Fuentes componente step2]
    - **/step3**
      - [Fuentes componente step3]


## 4. Excepciones

Como se detalla en los puntos anteriores la estructura del proyecto se basa en el tipo de elemento al que pertenece _components_, _services_, _utils_, etc. Pero también se pueden aceptar ciertas excepciones y estas se deben evaluar caso a caso. Un motivo para hacer una excepción es cuando se trata de una funcionalidad o concepto de uso genérico que se compone de varios elementos.

Como ejemplo para un caso de una estructura compuesta utilizaremos la funcionalidad generica del modal de carga (LoadingModal). Para la construcción del modal de carga de este ejemplo utilizaremos dos elementos un _component_ que contendrá la vista del modal de carga y un _service_ que nos permitirá desplegar y ocultar el modal de carga desde cualquier otro componente que inyecte el _service_. Todos estos elementos los cuales ubicamos en la siguiente estructura de directorios:

- **/apps** o directorio-módulo
  - **/shared**
    - **/loading-modal**
      - **/component**
        - [Fuentes componente loading]
      - **/service**
        - [Fuentes service loading]

Detallaremos otro ejemplo de cuando un componente o vista utiliza otros elementos como pueden ser enums, clases TO, etc que pertenecen únicamente a ese componente. Para este ejemplo utilizaremos un componente Input el cual despliega un input y al cual se le entregan parámetros a través de una clase TO como un input del componente. Para este caso de pueden dejar todos los fuentes dentro del directorio del componente pero manteniendo la estructura de elementos como se detalla a continuación:

- **/input**
  - [Fuentes componente input]
  - **/enum**
    - **input.enum.ts**: Enum que contiene los tipos de input permitidos (text, numbers, date, etc.).
  - **/model**
    - **input.to.ts**: Clase TO que contiene los parametros utilizados para construir el componente input.


## 5. Versionamiento

Registro de evoluciones realizadas en el documento:

| Versión | Autor | Detalle cambios |
| --- | --- | --- |
| 0.1 | Claudio López | Se define la versión inicial de estructura de un proyecto Angular según experiencias en proyectos de clientes WOM y LarraínVial. |
| 0.2 | Claudio López | Se aplica descripción directorio `/shared` en la sección 1.

## 6. Glosario
[1] **PWA** : Acrónimo de Progressive Web Apps, son aplicaciones web que funcionan desde un browser siendo agnósticos al sistema operativo al que se ejecutan y estas pueden o no depender de que el dispositivo se encuentre conectado a internet para más información ingresar al siguiente [link](https://web.dev/progressive-web-apps/).

[2] **Internacionalización** : Existen diferentes formas de realizar internacionalizaciones siendo la más estandarizada la i18n (Puedes encontrar cómo aplicarla en un proyecto angular en el siguiente [link](https://angular.io/guide/i18n)). Otra forma también de aplicar la internacionalización es utilizando ngx-translate (Puedes encontrar cómo aplicarla en un proyecto angular en el siguiente [link](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular-app-with-ngx-translate)).
