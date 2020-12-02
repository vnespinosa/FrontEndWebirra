# Grupo 21 "Webirra"
### PUC IIC2513 - Tecnologías y Aplicaciones Web - Repositorio de Proyecto de Curso
## Integrantes

| Nombre                | Email       | Usuario de Github |
|:--------------------- |:-------------|:-------------|
| José Baboun | jibaboun@uc.cl | [@josebaboun](https://www.github.com/josebaboun) |
| Vicente Espinosa | vnespinosa@uc.cl | [@vnespinosa](https://www.github.com/vnespinosa) |
| Gonzalo Vargas | gtvargas@uc.cl | [@gtvargas](https://www.github.com/gtvargas) |

## Descripción de la distribución del repositorio
El repositorio usa la distribución sugerida por el enunciado, esto es:
- El archivo *index.html* contiene el landing page de nuestra pagina
- La carpeta *views* contiene todas las vistas, es decir, todos los archivos *.html*
- La carpeta *assets* contiene las carpetas *styes*, *imgs* y *scripts*
- La carpeta *styles* contiene los estilos de nuestras vistas, los archivos *.css*
- La carpeta *imgs* contiene todos los archivos de imagen que usamos en las vistas
- La carpeta *scripts* contiene los archivos JavaScript *.js*

## Descripción del proyecto
Nuestro proyecto es una juego muy similar a otro llamado **Risk**, pero con cambios singificativos en el modo de juego, pues esta versión está adaptada para el juego estilo *"play by email"*, ya que los turnos no tienen un orden, y no se sabe que es lo que los demás jugadores hicieron hasta el siguiente turno.
Más infromación sobre el funcionamiento de el juego en la sección *Como jugar* de la pagina o en *Acerca de*.

## Tecnologías empleadas frontend
Se utiliza html para la estructura de la app, css para el estilo y colores, y JavaScript para todas las funcionalidades extra.

## Tecnologías empleadas backend
-El manejador de paquetes utilizado es *Yarn*.\
-El ORM para manejar la base de datos es *Sequelize*.\
-Para encriptar las claves se utiliza *bcrypt*.\
-Se utiliza el framework *Koa*, junto a *Koa-body*, *Koa-session*, *Koa router*.\
-La base de datos es de *Postgres*
-Se utiliza *Json Web Tokens* para manejar los tokens enviados desde cliente a servidor.


## ¿Cómo ejecutar la aplicación?

A continuación se detalla como ejecutar la aplicación de forma local, además de los pasos que se deben seguir para probar todas las funcionalidades del juego:\
Antes de levantar la aplicación, se debe asegurar de tener una variable de entorno llamada TOKEN_SECRET. A ella le puede dar cualquier valor.\
También se debe botar la base de datos si es que ya la tenía, para luego levantarla denuevo, ya que hubo cambios importantes en los modelos. (comandos de sequelize db:drop, db:create, db:migrate, db:seed:all)\
Para ejecutar la aplicación se debe correr el comando **yarn install** y **yarn start** en el directorio del *backend*, y además levantar un servidor http en el directorio del *frontend*.\
Al ingresar por el browser al puerto donde levantó el servidor del *frontend*, se encontrará con la aplicación. Para jugar, se debe registrar e iniciar sesión.\
Una partida del juego comenzará solo si hay 3 jugadores que hayan ingresado. De lo contrario se desplegará un mensaje explicitando el estado de la partida (si ya comenzó o no).\
Para simular que han entrado 3 jugadores, puede cerrar sesión y registrar e iniciar sesión con otros dos usuarios. Una vez que haya ingresado el último, se desplegará el mapa con los territorios que pertenecen a cada jugador, la misión correspondiente, y su porcentaje de avance. Toda esa información es enviada por el servidor y es repartida de manera aleatoria.\
Para jugar, puede hacer una jugada con cada jugador (de ataque y/o reordenamiento), y pulsar el botón *Enviar jugada*. Con ello el servidor recibirá la jugada realizada, y podrá dirimir el resultado de un turno. Para simular que los tres jugadores hicieron una jugada puede hacer lo mismo que hizo para iniciar sesión (cerrar sesión e iniciar con otro). Cuando haya realizado una jugada con cada uno, puede pulsar el botón *Pasar turno*, el cuál hará que reciba el estado de cómo quedó el uego luego de las jugadas realizadas. Cabe destacar que esta medida es temporal, ya que en el futuro se implementará que el turno se pase por tiempo. Por ahora, cualquier jugador puede apretar el botón de *Pasar turno* en cualquier momento, sin importar si los demás alcanzaron a enviar su jugada.\
El juego seguirá de esa misma forma hasta que haya un ganador. Una vez que haya un ganador (algún jugador completó su misión secreta), se desplegará un mensaje en la pantalla indicando al ganador y se redirigirá hacia la vista de Login. Si quiere jugar una partida nueva, podrá en ese momento repetir lo el proceso recién descrito. (Login denuevo con 3 jugadores, etc.)


## Otros

En los botones para hacer una jugada y enviarla se usaron íconos.

### Respecto a las reglas del juego

Se realizaron algunas modificaciones con respecto a la Tarea 1, las cuales se detallan a continuación:
- En la Tarea 1 se había presentado una vista de la interfaz del juego para cuando era el turno de jugar, y otra para cuando no lo era. Esto se cambió, ya que el juego al ser "play by email" no tiene turnos. Por lo tanto, solo hay una vista, ya que siempre les tocará jugar.
- Hubo cambios en la selección de algunos territorios, principalmente debido a la forma del mapa que finalmente escogimos. Específicamente, se eliminó la biblioteca (en el mapa no se distingue del edificio de Sociales) y la Capilla quedó como Centro Estratégico. También se eliminó Teología por su pequeño tamaño. Lo mismo ocurrió con el Casino, ya que no está en el mapa que escogimos (este corresponde al Campus en el año 2011).
- Se eliminaron los tipos de tropas que un jugador puede tener, debido a que lo consideramos de poca relevancia, ya que todas podían cumplir con las mismas funcionalidades (moverse para reordenar o atacar).

## Respecto a la tarea 5

### Correcciones de la T4

- Se arreglan las rutas y se modulariza la página de index.js
- Se arregla sincronía entre login y registro

## Respecto a las sesiones

- Se implementan koa-sessions junto a JSON web tokens. Estos se guardan en la bdd de datos como un atributo. El usuario lo guarda como una cookie y luego se envía como bearer token.

- Se establece que todas las consultas pasen por el middleware de autentificación menos las de registro y login (por razones obvias).

- En caso de estar logeado se sigue con el flujo normal de la consulta. En caso contrario se entrega un mensaje de error.

- Se implementa endpoint de cierre de sesión

## Cambios en el frontend

- Se establece conexión entre frontend y backend a través de request. Estas están implementadas a través una ejecución local.
- Se detecta cuando un jugador gana el juego, y al ocurrir esto se despliega un mensaje indicando al ganador, y redireccionando al jugador hacia login. (Si quiere jugar otra partida debe iniciar sesión denuevo).
- Se arregla todo lo que es el despliegue de información, según lo enviado por el servidor. Ahora en la tabla de territorios se despliegan los nombres reales de los jugadores, al igual que en la misión y su porcentaje de avance se despliega la infomación que corresponde al jugador y la partida que está jugando.

## Con respecto a la comunicación Cliente- Servidor

- Se establece la conexión de manera local. Para realizarla se debe seguir lo especificado en **Como ejecutar la aplicación**.
- Todos los mensajes, sus métodos, y el momento en que se envían están especificados en *documents/protocolos.md*.
- Una vez que el cliente inició sesión, todos los mensajes llevan un Token para verificar su identidad (middleware de autentificación). Este token es guardado en una *cookie* en el lado del cliente. También, cuando un jugador se une a una partida, guarda su id de juego en una cookie. (este difiere del id correspondiente al usuario en la base de datos, solo se usa para una partida en particular).
- Se encuentran implementados todos los Endpoints desde el registro de un usuario hasta que hay un ganador de una partida.


## Sobre el modelo de datos
La base de datos de la aplicación se basa en el modelo presente en el repositorio del frontend: https://github.com/PUCIIC2513/2020-2-G21-Webirra. El diagrama se encuentra especificamente en documents/diagrama_RISK.pdf.\
En la base de datos se crean los modelos de todas las clases del diagrama, junto con sus respectivas asociaciones.\
También, se ejecutan *seeders* de Territorios, Zonas y Misiones.\
A medida que se prueba la aplicación con lo descrito en la sección **Como ejecutar la aplicación**, también se van agregando datos a la base de datos, como nuevos estados del tablero, nuevas jugadas que envían los jugadores, o nuevos jugadores que realizaron login exitoso.


## El servidor
Es una aplicación de Node.js, que funcionará como el backend del juego Risk, cuya descripción se encuentra en
https://github.com/PUCIIC2513/2020-2-G21-Webirra.\

## Consideraciones para próxima entrega

- Se hará el deploy a heroku. Para esta entrega no se realizó debido a contratiempos con levantar nuevamente la base de datos.
- Mostrar las partidas anteriores de los jugadores.
