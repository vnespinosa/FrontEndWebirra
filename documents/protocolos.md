# Protocolo de comunicación para envío de información entre Cliente y Servidor

Para la comunicación entre cliente y servidor se enviará información utilizando el protocolo **JSON**.\
A continuación se detalla qué contendrá cada envío de información, y en qué momento se relizará.

Todas las rutas pasan por un middleware de autentificación, a excepción de */login*, */register*, */crear* y */estadisticas*.

En todas las rutas que aplica, el valor *estatus* especifica si todo funcionó correctamente o no. (ej: "success" o "error")

## Registro de Usuario (/register) [POST]

Cuando un usuario se registre en la aplicación, se enviará al servidor el siguiente objeto de JavaSript, convertido a JSON:

```json
INPUT:
{
    "username": "string",
    "password": "string",
    "mail": "string"
}
```
En caso de que el mail no sea usado, se crea exitosamente el nuevo usuario, y el servidor le asigna un id. Por el contrario, si el mail escogido ya existe, el servidor enviara un mensaje de error\

```json
OUTPUT:
{
    "status": "string",
    "msg": "string",     /* Usado solo en caso de error */
    "username": "string",
    "mail": "string",
    "password": "string",
    "token": "string"
}
Los ultimos 3 son en caso de que el registro sea exitoso.
```

## Inicio de sesión (/login) [POST]

Al iniciar sesión, se envía desde el Cliente el siguiente objeto:

```json
INPUT:
{
    "mail": "string",
    "password": "string"
}
```

Análogamente al registro de usuario, el servidor evaluará si el mail entregado coincide con la password entregada, y enviará el siguiente objeto:
```json
OUTPUT:
{
    "status": "string",
    "msg": "string",          Usado solamente en caso de error
    "id": "integer",
    "toke": "string"
}
```

## Cerrar sesión (/logout) [POST]

Esta ruta es para cerrar la sesión actualmente iniciada y se destruye el token guardado en las cookies,  recibe el siguiente objeto:

```json
INPUT:
{
    "token": "string"
}
```

```json
OUTPUT:
{
    "status": "string",
    "msg": "string"
}
```
El *msg* se muestra en la pantalla, con una notificación.

## Unirse a partida (/estado_partida) [POST]

Cuando un jugador que haya iniciado sesión intenta unirse a una partida, se le envía el siguiente objeto al servidor:

```json
INPUT:
{
    "id": "integer"
}
```
Si hay menos de tres jugadores en la partida el jugador se unirá a la partida, en caso contrario no podrá unirse. El objeto que envía el servidor para comunicar lo anterior es el siguiente:
```json
OUTPUT:
{
    "estado": "string",
    "id1": "integer",
    "id2": "integer",
    "id3": "integer",
    "estado_usuario": "string",
    "id_juego": "integer"            /* Solo se usa si puede entrar en la partida actual */
}
```
*estado* es el estado de la partida, que puede ser "creando", "jugando" o "terminada", *estado_usuario* entrega informacion respecto a si el juegador actual puede entrar a esta partida o no e *id_jeugo* es el id que se le entrega a un usuario temporalemte durante la partida, este va del 1 al 3.

## Estado del tablero (/estado_tablero) [GET]

Una vez estén los 3 jugadores en la partida, se da inicio a esta. Cada vez que alguien solicita ver el mapa, solicita la informacion a través de un GET:
La resouesta del servidor es la siguiente:
```json
OUTPUT:
{
    "territorios": "array",
    "numero_jugada": "integer",
    "nombre1": "string",
    "nombre2": "string",
    "nombre3": "string",
    "porcentaje_mision1": "integer",
    "porcentaje_mision2": "integer",
    "porcentaje_mision3": "integer",
}
```
Dentro del arreglo *territorios*, estará especificado a qué jugador pertence cada territorio, con un formato que se especifica más abajo y cuántas tropas hay en cada uno. "NombreX" y "porcentaje_misionX" son el nombre y mision del jugador con id_juego = X.

```json
territorios:
{
    "0": {"id_jugador": "integer", "tropas": "integer"},
    "1": {"id_jugador": "integer", "tropas": "integer"},
    "..."
    "19": {"id_jugador": "integer", "tropas": "integer"}
}
```

## Envío jugada por parte de cliente (/jugar) [POST]

Cuando el cliente termina su jugada y la envía, se envía el siguiente objeto JSON hacia el servidor:
```json
INPUT:
{
    "id_juego": "integer",
    "ataques": "array",
    "reordenamientos": "array",
    "turno": "integer",
    "partidaId": "integer"
}
```
En el arreglo **ataques** están específicados los territorios atacados, desde qué territorio fueron atacados, y con cuántas tropas, sigue el mismo formato de "territorios" en /estado_tablero
El arreglo **reordenamientos** será de la misma forma que "ataques", y las restricciones de si se puede atacar o mover tropas hacia un territorio será controlado desde el Cliente.

```json
OUTPUT:
{
    "estado": "string",
}
```

Este output no se utiliza realmente, es para propositos de testeo nada más. Luego de que se registra la jugada, esta es guardada en la tabla *jugadas* en la BDD, se registra en la columna que corresponda a partir de quien lo envió.

## Respuesta jugada desde servidor (/jugada) [GET]

Las jugadas de los usuarios se van almacenando en la tabla *jugadas*, cuando se utiliza el boton **Pasar Turno**, se hace una consulta a esta ruta tipo GET, y se porcesan las jugadas que esten registradas en la BDD, luego se actualiza el ultimo estado del mapa. Esto hace que la poxima vez que alguien intente cargar el mapa, le muetre esta nueva versión generada.
Esta ruta no tiene INPUTS ni OUTPUTS.


## Crear una nueva partida (/crear) [GET]

Esta ruta genera una nueva partida, en la cual aun no hay nadie insrito, y crea una nueva reparticion de territorios completamente aleatoria. Esto se activa al terminar una partida (alguien llegue al 100% de su misión). Tambien se puede ejecutar directamente desde Postman, ya que es la unica ruta qur no pide autentifación (Para facilitar la revisión), es ser tipo GET, no hay INPUTS, y tampoco hay OUTPUTS.

## Estadisticas de los usuarios (/estadisticas) [GET]

Esta ruta entrega las estadisticas de todos los usuarios registrados (aunque solo se usa el top 5) en distintas categorías. No necesita autentificación, por lo que se puede ver sin inicar sesión.

```json
OUTPUT:
{
    "partidas": "array",
    "victorias": "array",
    "tropas_perdidas": "array",
    "ataques_totales": "array",
    "ataques_exitosos": "array",
    "ataques_fallidos": "array"
}
```

La estructura de los array son siempre *[Nombre_usuario, cantidad]*.