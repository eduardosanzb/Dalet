# Dalet
## **Concentrador de datos estadisitcos de proveedores bibliotecarios**
--------------------------

### *Dalet. Sistema estadístico de alta calidad, que entrega resultados en tiempo y forma de una manera atractiva y sencilla.*
----------------------------------------

Proyecto Universitario de la materia de **Administracion de Equipos de desarrollo de Software**
de la [UPAEP](www.upaep.mx)
-----------------------------------

# Información del proyecto
## Datos
Responsables | <ul><li>[Edna]()</li><li>[Ricardo](https://github.com/ricardo-sosa-alvarado)</li><li>[José Carlo](https://github.com/jcguha)</li><li>[Julián Baruc]()</li><li>[Eduardo @me](https://github.com/eduardosanzb)</li></ul>
----- | ------
Fecha de preparación | 2016/08/24 18:07

## Problema o necesidad detectada
La biblioteca UPAEP, necesita automatizar el proceso de la obtención de estadísticas de los recursos electrónicos/físicos con los que cuenta.

Estas estadísticas necesitan ser consultadas con múltiples propósitos:
* Control por parte de la Alta Dirección
* Preparación de datos para evaluaciones institucionales
* Toma de decisiones

-------------------------------
# Configuración del proyecto *(Técnico)*
El proyecto esta desarrollado esta separado de esta manera:
.
├── README.md
├── backend
└── frontend

Donde `backend` contiene el servidor express que correra la app en el cloud-server.
`frontend` tiene una app angular.

### Prerequisitos
Para poder correr la app debes de tener instalado:
* node && npm
* gulp gobalmente
* mongo en tu variabla de entorno
 Una vez clonado el repositorio debes de instalar los modulos de npm por cada uno de los proyectos.
`cd backend && npm install`
`cd frontend && npm install`

Ahora ya tienes los modulos, es momento de arrancar la app.
1. Arrancar el server `cd backend && gulp serve`
    1.1 Esperar a que webpack finalice
2. Arrancar el app angular `cd frontend && gulp serve`

App | Puerto
--- | ---
Backend | 5000
frontend | 3000
