# Ionic Sucursal Bancaria

Este proyecto fue realizado usando Ionic 5 con Angular io y haciendo uso de componentes de ionic component además de la integración de Google Maps Javascript Api.

# Features

```
Acceso a login
Mapa con Google Maps
Trazo de ruta por medio del DirectionsService de Google Maps
Consumo de API por medio de HTTP para obtener ubicaciones reales de atms y sucursales bancarias (Adicional)
Consumo de API de Google Maps (distance matrix) para calculo de tiempo de viaje real entre la persona y la sucursal bancaria seleccionada (Adicional)
```

## Como empezar

Las siguientes instrucciones son para la instalación en dispositivos Android, se ha probado la aplicación unicamente en Android 9 por ser un demo de prueba interno.

### Pre requisitos

Herramientas que necesitas tener instaladas en tu ordenador como instalar esta aplicación

```
Node
Npm
Cordova
Ionic cli
Android Sdk
```

### Instalación

Una vez clona el proyecto desde el repositorio se recomienda seguir las siguientes instrucciones

```
$ npm install
```
```
$ ionic cordova run android
```


Debes contar con un dispositivo Android conectado a tu computador, bien sea un equipo fisico o un emulador, este mismo debe ser capaz de ser detectado por tu entorno de Android, puedes comprobar el mismo haciendo uso del comando

```
$ adb devices
```

## Built With

* [Ionic Framework](https://ionicframework.com/) - Framework utilizado para desarrollo movil
* [Angular IO](https://angular.io/) - Framework de javascript

## Autores

* **Alfredo Rodriguez** - *Desarrollador*
