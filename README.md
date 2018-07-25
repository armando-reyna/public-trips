# Inteliviajes Mobile App
[![Travis Widget]][Travis]

[Travis]: https://travis-ci.com/dherby/mercurio_app
[Travis Widget]: https://travis-ci.com/dherby/mercurio_app.svg?token=1hNG2sk9A3bD7BqNsEp3&branch=master

## Tecnologías utilizadas

  - [Ionic 2](http://ionic.io/2)
  - [Angular 2](http://angular.io)
  - [HTML5](https://en.wikipedia.org/wiki/HTML5)
  - [Sass](http://sass-lang.com/)

## INFORMACIÓN IMPORTANTE

- Min SDK versión: 19 (4.4.1)
- Siempre arm-v7 no x86 (ya que solo estamos en móviles)
- En caso de que existan errores con algunos paquetes de NodeJS, eliminar por completo la carpeta de node_modules y volver a ejecutar el paso 3 y 4 de la preparación del proyecto
- Si genera un error como

  `
$ npm ERR! enoent ENOENT: no such file or directory, rename '/usr/local/lib/node_modules/.staging/ansi-392b32ed' -> '/usr/local/lib/node_modules/ionic/node_modules/cordova-lib/node_modules/ansi'
  `

  * La opción recomendada es emplear **nvm**
  * Otra opción es cambiar privilegios en la ruta donde se encuentran los paquetes:

    `
  $ sudo chown -R <mi_usuario>.<mi_usuario> /usr/local/lib/node_modules/
    `

  * La ultima opción es cambiar los comandos en el Makefile para que se ejecuten con privilegios de administrador.

## TABLA DE CONTENIDO

- [Instalación de dependencias](#instalation)
- [Descarga y preparación del proyecto](#download)
  - [Windows](#down-win)
- [Ejecución del proyecto](#exec)
- [Release de Android](#release-android)
- [Estructura del proyecto](#structure)

<a id="instalation"></a>
## Instalación de dependencias/paquetes necesarios
- Instalar NodeJS >= 6.X [http://nodejs.org/download](http://nodejs.org/download)
- Instalar dependencias de NodeJS:
  `npm install ionic@3.19.1 cordova@7.1.0 typescript typings http-server -g` (sudo para OSX)
- Descargar e instalar Android Studio [https://developer.android.com/studio/index.html](https://developer.android.com/studio/index.html)
    - Una vez descargado, ejecutar el SDK Manager y asegurarse de que los siguientes packages estén instalados:
      - `Android SDK Tools`
      - `Android SDK Platform-tools`
      - `Android SDK Build-Tools`
      - `Google Play Services`
      - `Google repository`
      - `Android Support repository`
      - `Google USB Driver` **windows only**
      - `Intel x86 Emulator Accelerator (HAMX)` **windows only**
      - `SDK Platform PI 23/24`
      - `Intel x86 system image API 23/24`
      - `Google APIs API 23/24`
- Instalar gradle [https://gradle.org/install/](https://gradle.org/install/)


- Para instalar HAXM en OSX se necesita realizar lo siguiente:
  - Ingresar al PATH `/Users/xxx/Library/Android/sdk/extras/intel/Hardware_Accelerated_Execution_Manager`
  - Ejecutar el IntelHAXM_X.X.X.dmg
  - Listo
- Asegurarse de tener $ANDROID_HOME en el $PATH
    - Linux
    ```
    $ export ANDROID_HOME=/<installation location>/android-sdk-linux
    $ export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
    ```
    - OSX
    ```
    $ export ANDROID_HOME=/<installation location>/android-sdk-linux
    $ export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
    ```
    - Windows
    ```
    $ ANDROID_HOME=C:\<installation location>\android-sdk-windows
    $ set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
    ```


<a id="download"></a>

## Descarga y preparación del proyecto

- Clonar el repositorio:

    `$ git clone git@github.com:dherby/mercurio_app.git`

- Ingresar al directorio:

    `$ cd mercurio_app`

- Instalar las dependencias locales:

    `$ npm install`

    `$ ionic cordova prepare android`

    `$ ionic cordova prepare ios`

<a name="down-win"></a>
#### Para Windows

- En caso de error en algún paso anterior relacionado con `npm`:
    - Descargar [Visual Studio 2015](https://www.visualstudio.com/vs/)
    - Crear un projecto en C++ e instalar las dependencias que necesite para el mismo, con ésto se instalará el compiler entre otras cosas
    - Volver a ejecutar

        `$ npm install`
    
<a id="exec"></a>
## Ejecución del proyecto

- Ingresar al directorio:
 
    `$ cd mercurio_app`
 
 - Android
	  - Iniciar en dispositivo:

		 `$ ionic cordova run android --device`

		 `$ ionic cordova run android --emulator`
- iOS
    - Instalar dependencias:
        
        `$ npm install -g ios-deploy`
    - En caso de error ejecutar:
        
        `$ sudo npm install -g ios-deploy --unsafe-perm=true --allow-root`
    - Iniciar en el dispositivo:
        
        `$ ionic cordova run ios --device`
        
        `$ ionic cordova run ios --emulator`
        
<a id="release-android"></a>
## Release del app

#### Android

Para generar el **APK** que se instalará en android se puede ejecutar para desarrollo (no firmado):

`$ ionic cordova build android`

o bien para generar un **APK** para la **Play Store** (firmado):

`$ make build-android`
#### iOS (Xcode necesario)

Para generar el proyecto de iOS es necesario ejecutar:

`$ make build-ios`

**Nota:** Es normal que se genere un error **(ARCHIVE FAILED)** al momento de archivar el paquete.

Después de generar el proyecto se debe abrir la aplicación en *Xcode* ubicado en:

`mercurio_app/platforms/ios/Inteliviajes.xcodeproj`

y activar las siguientes *Capabilities*:
* Push Notifications
* Associated Domains
* Background modes
  * Background fetch
  * Remote notifications
* Data Protection

<a id="structure"></a>

## Estructura del proyecto

- **hooks** `folder`: Representa scripts especiales que pueden ser agregados por la app para personalizar los comandos de cordova.
- **node_modules** `folder`: Contiene todos los packages necesarios que se ejecutan sobre NodeJS
- **platforms** `folder`: Archivos de configuración, paquetes y assets para las plataformas (Android y iOS)
- **plugins** `folder`: Plugins de cordova
- **resources** `folder`: Los recursos/assets que necesitan las plataformas para su instalación como el icono, splash, etc.
- **src** `folder`: Contiene todo el código de la aplicación escrita en Angular2 (assets, pages, providers, themes, etc.)
- **typings** `folder`: Contiene definiciones para typescript sobre ciertos módulos/packages/plugins dentro del proyecto.
- **www** `folder`: Contiene el build final del proyecto
- **.editorconfig** `file`: Es un archivo que tiene una colección declaraciones para el estilo de la programación.
- **.gitignore** `file`: Contiene los archivos que no se van a tomar en cuenta para el repositorio de Git
- **config.xml** `file`: Configuraciones globales que controla aspectos del comportamiento de la app en cordova
- **ionic.config.json** `file`: Configuraciones específicas para el proyecto
- **karma.conf.js** `file`: Archivo de configuración para las pruebas unitarias
- **package.json** `file`: Archivo de configuración de instalación de NodeJS así como los comandos específicos.
- **README.md** `file`
- **tsconfig.json** `file`: Especifica configuraciones root del proyecto para typescript
- **tslint.json** `file`: Reglas para el linter de typescript en CLI