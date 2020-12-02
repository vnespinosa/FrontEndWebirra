var mensaje_servidor = ""

/*
Cargar partida
*/

/*
function cargarPartida() {
    let t1 = document.getElementsByClassName("list_territorios1")[0]
    let t2 = document.getElementsByClassName("list_territorios2")[0]
    let t3 = document.getElementsByClassName("list_territorios3")[0]
    while (t1.firstChild) {
        t1.removeChild(t1.lastChild)
    }
    while (t2.firstChild) {
        t2.removeChild(t2.lastChild)
    }
    while (t3.firstChild) {
        t3.removeChild(t3.lastChild)
    }
    mensaje_servidor = mensaje_servidor2

    cargarMapa()
    actualizarMision()
    partida_nueva_cargada = true
}
*/
partida_nueva_cargada = false

let boton_turno = document.getElementById("turno")
boton_turno.addEventListener('click', pasarTurno, false)

const getTurno = datos =>{

    return fetch("https://protected-scrubland-81841.herokuapp.com/jugada",
         { method:"GET", headers:{"Content-type":"application/json", "Authorization":`Bearer ${getCookie('token')}`} })
        .then(responde =>{ return responde.json() })
}

async function pasarTurno() {

    const listadoRecibido = await getTurno('')

    if (listadoRecibido["status"] == "error"){
      alert("Aún no se puede pasar el turno")
    }
    else{
      alert("Se pasó el turno. Actualiza la página para ver el nuevo estado.")
    }
    return listadoRecibido
}

/*
Cargar territorios desde servidor
*/

var mis_territorios = []

function cargarMapa(mensaje_servidor){
    mis_territorios = []
    territorios_atacables = []
    let ids_jugadores = []
    for (let i = 0; i < 20; i++){
        if ( !ids_jugadores.includes(mensaje_servidor[i]["id_jugador"]) ){
            ids_jugadores.push(mensaje_servidor[i]["id_jugador"])
        }
    }

    let id_rojo = Math.min(ids_jugadores[0], ids_jugadores[1], ids_jugadores[2])
    let index = ids_jugadores.indexOf(id_rojo);
    ids_jugadores.splice(index, 1);
    let id_morado = Math.min(ids_jugadores[0], ids_jugadores[1])
    let index2 = ids_jugadores.indexOf(id_morado);
    ids_jugadores.splice(index2, 1);
    let id_azul = ids_jugadores[0]

    for (let i = 0; i < 20; i++){
        let Li = document.createElement("li")
        Li.setAttribute('class', "lista")
        Li.setAttribute('id', i)
        Li.appendChild(document.createTextNode(nombres_territorios[i]))
        if (mensaje_servidor[i]["id_jugador"] == id_rojo){
            let parent = document.getElementsByClassName("list_territorios1")[0]
            parent.appendChild(Li)
        }
        else if (mensaje_servidor[i]["id_jugador"] == id_morado){
            let parent = document.getElementsByClassName("list_territorios2")[0]
            parent.appendChild(Li)
        }
        else if (mensaje_servidor[i]["id_jugador"] == id_azul){
            let parent = document.getElementsByClassName("list_territorios3")[0]
            parent.appendChild(Li)
        }
    }
    for (let i = 0; i < 20; i++){
        if (mensaje_servidor[i]["id_jugador"] == getCookie('id_juego')){
            mis_territorios.push(clases_territorios[i])
        }
    }
    console.log('mis territorios: ' + mis_territorios)
    for (let i = 0; i < mis_territorios.length; i++){
      console.log('adyacencias:' + adyacencias[mis_territorios[i]])
      for(let j = 0; j < adyacencias[mis_territorios[i]].length; j++){
        if (!territorios_atacables.includes(adyacencias[mis_territorios[i]][j])){
          territorios_atacables.push(adyacencias[mis_territorios[i]][j])
        }
      }
    }
    pintarTerritorios()

    let territorios_lista = document.getElementsByClassName("lista");

    for (var i = 0 ; i < polygons.length; i++) {
        polygons[i].addEventListener('mouseover', Over_polygon, false);
        polygons[i].addEventListener('mouseout', Out_polygon, false);
    }

    for (let i = 0 ; i < territorios_lista.length; i++) { /* Pa recorrer todos los elementos */
        territorios_lista[i].addEventListener('mouseover', Over_text, false);
        territorios_lista[i].addEventListener('mouseout', Out_text, false);
    }
}


function actualizarMision(){
    let barra = document.getElementsByTagName("progress")[0]
    let numero = document.getElementsByTagName("porcentaje")[0]
    let mision = document.getElementsByClassName("mision")[0]
    let id_mio = getCookie('id_juego')
    var porcentaje_mision = 0
    var objetivo_mision = ''
    if (id_mio == 1){
      porcentaje_mision = mensaje_servidor["porcentaje_mision1"]
      objetivo_mision = mensaje_servidor["mision1"]
    }
    else if (id_mio == 2){
      porcentaje_mision = mensaje_servidor["porcentaje_mision2"]
      objetivo_mision = mensaje_servidor["mision2"]

    }
    else if (id_mio == 3){
      porcentaje_mision = mensaje_servidor["porcentaje_mision3"]
      objetivo_mision = mensaje_servidor["mision3"]

    }
    numero.textContent = porcentaje_mision
    barra.setAttribute("style", `padding-left: ${porcentaje_mision * 3}px`)
    mision.innerHTML = objetivo_mision + ' <a href="rules.html">(Revísala acá)</a>'
    //mision.innerHTML = '<h5>La partida aún no está iniciada</h5>';
    console.log(objetivo_mision)

}

/*
Actualizar Logs
*/

function cargarNombres(mensaje_servidor) {
    let nombre1 = document.getElementsByClassName("jugador1")[0]
    let li1 = document.createElement("li")
    li1.appendChild(document.createTextNode(mensaje_servidor["nombre1"]))
    nombre1.insertBefore(li1, nombre1.firstChild);

    let nombre2 = document.getElementsByClassName("jugador2")[0]
    let li2 = document.createElement("li")
    li2.appendChild(document.createTextNode(mensaje_servidor["nombre2"]))
    nombre2.insertBefore(li2, nombre2.firstChild);

    let nombre3 = document.getElementsByClassName("jugador3")[0]
    let li3 = document.createElement("li")
    li3.appendChild(document.createTextNode(mensaje_servidor["nombre3"]))
    nombre3.insertBefore(li3, nombre3.firstChild);
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function enviaRequest(verbo, url) {
  return fetch(url)
         .then(respuesta => { return respuesta.json() })
}

async function recibeListado() {

    const listadoRecibido = await enviaValoresGet('ola')
    console.log(getCookie('token'))
    mensaje_servidor = listadoRecibido
    console.log(mensaje_servidor)
    console.log(mensaje_servidor["territorios"])
     // this will log out the json object
    await cargarNombres(mensaje_servidor)
    await cargarMapa(mensaje_servidor["territorios"])
    await actualizarMision()
    respuesta_usuario["numero_jugada"] = mensaje_servidor["numero_jugada"] + 1
    respuesta_usuario["partidaId"] = mensaje_servidor["partidaId"]
    await revisar_ganador(mensaje_servidor)

    return listadoRecibido
}


async function revisar_ganador(mensaje_servidor){
  console.log('mision1: ' + mensaje_servidor["porcentaje_mision1"])
  console.log('mision2: ' + mensaje_servidor["porcentaje_mision2"])
  console.log('mision3: ' + mensaje_servidor["porcentaje_mision3"])
  console.log('mensaje servidor en funcion:' + mensaje_servidor)

  if (mensaje_servidor["porcentaje_mision1"] >= 100){
    alert(`Partida terminada! Ha ganado ${mensaje_servidor["nombre1"]}`)
    await creaNuevaPartida('').then(cerrar_sesion)
  }
  else if (mensaje_servidor["porcentaje_mision2"] >= 100){
    alert(`Partida terminada! Ha ganado ${mensaje_servidor["nombre2"]}`)
    await creaNuevaPartida('').then(cerrar_sesion)
  }
  else if (mensaje_servidor["porcentaje_mision3"] >= 100){
    alert(`Partida terminada! Ha ganado ${mensaje_servidor["nombre3"]}`)
    await creaNuevaPartida('')
    await cerrar_sesion()
  }
}

async function recibeEstado() {

    const msg = {"id": getCookie('id_usuario')}
    estadoRecibido = await enviaValoresPost(msg)
    if(estadoRecibido["estado_usuario"] == "Se unio"){
        doc = document.getElementById("logs");
        doc.innerHTML += '<h1>Te has inscrito a la partida, pero aún no está iniciada</h1>';
    }
    else if(estadoRecibido["estado_usuario"] == "Unido esperando"){
        doc = document.getElementById("logs");
        doc.innerHTML += '<h1>La partida aún no está iniciada</h1>';
    }
    else if(estadoRecibido["estado_usuario"] == "Lleno"){
        doc = document.getElementById("logs");
        doc.innerHTML += '<h1>La partida ya esta llena :(</h1>';
    }
    RevisarEstadoPartida(estadoRecibido)
    if(estadoRecibido['error']){
        window.location.replace("Login.html");
    }
    return estadoRecibido
}

async function enviaValoresPost(datos) {
    return await fetch("https://protected-scrubland-81841.herokuapp.com/estado_partida",
            { method:"POST", body:JSON.stringify(datos), headers:{"Content-type":"application/json", "Authorization":`Bearer ${getCookie('token')}`} })
        .then(response =>{ return response.json() })
}

const enviaValoresGet = datos =>{

    return fetch("https://protected-scrubland-81841.herokuapp.com/estado_tablero",
         { method:"GET", headers:{"Content-type":"application/json", "Authorization":`Bearer ${getCookie('token')}`} })
        .then(responde =>{ return responde.json() })
}

const creaNuevaPartida = datos =>{

    return fetch("https://protected-scrubland-81841.herokuapp.com/crear",
         { method:"GET", headers:{"Content-type":"application/json", "Authorization":`Bearer ${getCookie('token')}`} })
        .then(responde =>{ return responde.json() })
}
//REVISAR SI YA PUEDE JUGAR:

recibeEstado()

function RevisarEstadoPartida (estado_partida) {
    if (estado_partida["estado_usuario"] == "Listo") { // PARTIDA EMPEZADA Y PUEDE JUGAR
        recibeListado();
        console.log(estado_partida["estado_usuario"])
        createCookie('id_juego', estado_partida['id_juego'], 10)
    }
    else if (estado_partida["estado_usuario"] == "Se unio, listo") { //EMPEZO LA PARTIDA
        recibeListado();
        createCookie('id_juego', estado_partida["id_juego"], 99)
        console.log(estado_partida["estado_usuario"])
        createCookie('id_juego', estado_partida['id_juego'], 10)
    }
    else if (estado_partida["estado_usuario"] == "Se unio") { //AUN NO PUEDE JUGAR, FALTA GENTE, SE ACABA DE UNIR AL JUEGO
        createCookie('id_juego', estado_partida["id_juego"], 99)
        console.log(estado_partida["estado_usuario"])
        createCookie('id_juego', estado_partida['id_juego'], 10)
    }
    else if (estado_partida["estado_usuario"] == "Unido esperando") { //YA SE HABIA UNIDO, SIGUE ESPERANDO
        console.log(estado_partida["estado_usuario"])
        createCookie('id_juego', estado_partida['id_juego'], 10)
    }
    else if (estado_partida["estado_usuario"] == "Lleno") { //ESTA LLENO, Y NO ES PARTE DE LOS JUGADORES
        console.log(estado_partida["estado_usuario"])
    }
}

var boton_logout = document.getElementsByClassName("logout")[0]
boton_logout.addEventListener("click", cerrar_sesion)
async function cerrar_sesion(){

  respuesta = await fetch("https://protected-scrubland-81841.herokuapp.com/logout",
       { method:"POST", body:JSON.stringify({'token':`${getCookie('token')}`}), headers:{"Content-type":"application/json", "Authorization":`Bearer ${getCookie('token')}`} })
      .then(responde =>{ return responde.json() })
      .then(responde => console.log(responde['msg']))

  createCookie('token', '', -1)
  window.location = 'Login.html'

}

function nuevoLog(modo, tropas, entra){
    let log = document.getElementById("logs")
    let nuevo = document.createElement("div")
    if (modo == "atacando"){
        let li1 = document.createElement("li")
        li1.setAttribute("class", "ataqueLetra")
        li1.appendChild(document.createTextNode("Ataque"))
        let li2 = document.createElement("li")
        li2.appendChild(document.createTextNode(`${nombres_territorios[entra]}`))
        let li3 = document.createElement("li")
        li3.appendChild(document.createTextNode(`con ${tropas} tropa(s)`))
        nuevo.appendChild(li1)
        nuevo.appendChild(li2)
        nuevo.appendChild(li3)
        log.appendChild(nuevo)
    }
    else if (modo == "eligiendo_mover"){
        let li1 = document.createElement("li")
        li1.setAttribute("class", "movimientoLetra")
        li1.appendChild(document.createTextNode("Refuerzo"))
        let li2 = document.createElement("li")
        li2.appendChild(document.createTextNode(`${nombres_territorios[entra]}`))
        let li3 = document.createElement("li")
        li3.appendChild(document.createTextNode(`con ${tropas} tropa(s)`))
        nuevo.appendChild(li1)
        nuevo.appendChild(li2)
        nuevo.appendChild(li3)
        log.appendChild(nuevo)
    }

}



/*
HOVER TERRITORIOS CONQUISTADOS
*/


const clases_territorios = ["ingenieria", "const_civil", "enfermeria", "luksic", "educacion", "humanidades", "hall",
    "college", "salud", "mate", "fis_quim", "comercial", "capilla", "sociales", "agronomia", "magna", "futbol", "gimnasio", "cancha1", "cancha2"]
const nombres_territorios = ["Ingeniería", "Construcción Civil", "Enfermería", "Luksic", "Educación", "Hall", "Humanidades", "College",
    "Ciencias de la Salud", "Matemáticas", "Fisica y Quimica", "Comercial", "Teología", "Sociales", "Agronomía", "Aula Magna", "Cancha de fútbol",
    "Gimnasio", "Canchas de Basketball", "Canchas de Tenis"]
const mi_Id = getCookie('id_usuario')
console.log('este es mi id:' + mi_Id + getCookie('id_usuario'))

var territorios_atacados = []
var territorios_reforzados = []

var respuesta_usuario = {}
respuesta_usuario["ataques"] = []
respuesta_usuario["id_usuario"] = mi_Id
respuesta_usuario["id_juego"] = getCookie("id_juego")
respuesta_usuario["reordenamientos"] = []

/*
console.log(respuesta_usuario)
*/

    /*
    Adyacencias para ver si se pueden atacar o mandar tropas alli
    */

const adyacencias = {"ingenieria": ["const_civil", "enfermeria", "luksic", "college", "fis_quim"], "luksic": ["const_civil", "enfermeria", "ingenieria"],
      "const_civil": ["enfermeria", "ingenieria", "luksic", "educacion", "hall"], "enfermeria": ["ingenieria", "luksic", "educacion", "hall", "const_civil", "capilla", "fis_quim"],
      "educacion": ["const_civil", "enfermeria", "hall", "humanidades"], "hall": ["const_civil", "enfermeria", "educacion", "humanidades", "capilla", "comercial", "fis_quim"],
      "humanidades": ["educacion", "hall", "comercial", "capilla"], "comercial": ["humanidades", "hall", "capilla", "agronomia", "sociales"], "capilla": ["enfermeria", "hall", "humanidades",
      "comercial", "agronomia", "sociales", "fis_quim"], "fis_quim": ["college", "ingenieria", "enfermeria", "capilla", "sociales", "mate"], "college": ["salud", "mate", "fis_quim", "ingenieria"],
      "salud": ["cancha1", "mate", "college"], "mate": ["salud", "college", "fis_quim", "sociales", "cancha1"], "sociales": ["mate", "fis_quim", "capilla", "comercial", "agronomia", "magna", "cancha2"],
      "agronomia": ["magna", "sociales", "capilla", "comercial"], "magna": ["agronomia", "sociales", "cancha2", "gimnasio"], "cancha2": ["sociales", "magna", "gimnasio", "futbol", "cancha1"],
      "cancha1": ["cancha2", "futbol", "mate", "salud"], "futbol": ["gimnasio", "cancha1", "cancha2"], "gimnasio": ["magna", "cancha2", "futbol"]}


var modo = "inicial" ;
var id_seleccionado = "" ;

function Over_text( event ) {
    color_texto = window.getComputedStyle(event.target).getPropertyValue("color")
    let lugar = document.getElementsByClassName(clases_territorios[event.target.id])[0]
    visibility = window.getComputedStyle(lugar).getPropertyValue("visibility")
    fill = window.getComputedStyle(lugar).getPropertyValue("fill")
    fillopacity = window.getComputedStyle(lugar).getPropertyValue("fill-opacity")

    event.target.setAttribute("style", "color: white");
    lugar.setAttribute("style", "visibility: visible; fill: white; fill-opacity: 0.5;" )
}

function Out_text( event ) {

    event.target.setAttribute("style", `color: ${color_texto}`);
    let lugar = document.getElementsByClassName(clases_territorios[event.target.id])[0]
    lugar.setAttribute("style", `visibility: ${visibility}; fill: ${fill}; fill-opacity: ${fillopacity}` )
}




/*
Mostrar territoroios atacables
*/



var territorios_atacables = []

var boton_reordenar = document.getElementById("reordenar")
var boton_atacar = document.getElementById("atacar")
var boton_terminar = document.getElementById("terminar")

function MostrarMisTerritorios( event ) {
    borrarCuadro()
    for (let i = 0; i < clases_territorios.length; i++){
        if (!mis_territorios.includes(clases_territorios[i])){
            var territorio = document.getElementsByClassName(clases_territorios[i])[0]
            territorio.setAttribute("style", `visibility: hidden` )
        }
        else {
            var territorio = document.getElementsByClassName(clases_territorios[i])[0]
            territorio.setAttribute("style", `visibility: visible` )
        }
    }
    modo = "reordenamiento"
    doc2 = document.getElementById("modo");
    doc2.innerHTML = '<h2>Modo de juego: ' + modo + '</h2>' ;
}

/* Cambiar mis_territorios por algo en funcion del miId */

function MostrarTerritoriosAtacables( event ) {
    borrarCuadro()
    for (let i = 0; i < clases_territorios.length; i++){
        if (mis_territorios.includes(clases_territorios[i])){
            var territorio = document.getElementsByClassName(clases_territorios[i])[0]
            territorio.setAttribute("style", `visibility: hidden` )
        }
        else {
            var territorio = document.getElementsByClassName(clases_territorios[i])[0]
            territorio.setAttribute("style", `visibility: visible` )
        }
    }
    modo = "ataque"
    doc2 = document.getElementById("modo");
    doc2.innerHTML = '<h2>Modo de juego: ' + modo + '</h2>' ;
}

async function VolverEstadoInicial( event ){
    borrarCuadro()
    for (let i = 0; i < clases_territorios.length; i++){
        var territorio = document.getElementsByClassName(clases_territorios[i])[0]
        territorio.setAttribute("style", `visibility: visible` )
    }

    const enviaJugada = datos =>{

        return fetch("https://protected-scrubland-81841.herokuapp.com/jugar",
             { method:"POST", body:JSON.stringify(datos), headers:{"Content-type":"application/json" , "Authorization":`Bearer ${getCookie('token')}`} })
            .then(responde =>{ return responde.json() })
    }

    const respuesta_consulta = await enviaJugada(respuesta_usuario)
    await console.log('lo que recibo de la cnosulta: ' + JSON.stringify(respuesta_consulta))
      //Hacer post de la jugada
    //console.log("Respuesta servidor: " + JSON.parse(respuesta_consulta)["estado"])
    modo = "inicial"
    doc2 = document.getElementById("modo");
    doc2.innerHTML = '<h2>Modo de juego: Jugada enviada </h2>' ;
}

boton_reordenar.addEventListener('click', MostrarMisTerritorios, false);
boton_atacar.addEventListener('click', MostrarTerritoriosAtacables, false);
boton_terminar.addEventListener('click', VolverEstadoInicial, false);




/*
HOVER DE POLYGONS
*/

var polygons = document.getElementsByTagName("polygon")

function Over_polygon(event){
    if (event.target.style.visibility == "visible" && event.target.style.fill != "yellow"){
        visibility_polygon = window.getComputedStyle(event.target).getPropertyValue("visibility")
        fill_polygon = window.getComputedStyle(event.target).getPropertyValue("fill")
        fillopacity_polygon = window.getComputedStyle(event.target).getPropertyValue("fill-opacity")
        event.target.setAttribute("style", "visibility: visible; fill: white; fill-opacity: 0.5;")
    }
}

function Out_polygon(event){
    if (event.target.style.visibility == "visible" && event.target.style.fill != "yellow"){
        event.target.setAttribute("style", `visibility: ${visibility_polygon}; fill: ${fill_polygon}; fill-opacity: ${fillopacity_polygon}` )
    }
}





/*
Pintar Territorios
parentElement.className -> Sacar clase de div superior
*/

function pintarTerritorios(){

    let territorios_lista = document.getElementsByClassName("lista");

    for (let i = 0 ; i < territorios_lista.length; i++) {
        let cosa = document.getElementsByClassName(clases_territorios[territorios_lista[i].id])[0]
        if (territorios_lista[i].parentElement.className == "list_territorios1"){
            cosa.id = "territorio_rojo"
            cosa.setAttribute("style", "visibility: visible; fill: red; fill-opacity: 0.5")
        }
        else if (territorios_lista[i].parentElement.className == "list_territorios2"){
            cosa.id = "territorio_morado"
            cosa.setAttribute("style", "visibility: visible; fill: #8424a1; fill-opacity: 0.5")
        }
        else if (territorios_lista[i].parentElement.className == "list_territorios3"){
            cosa.id = "territorio_azul"
            cosa.setAttribute("style", "visibility: visible; fill: rgb(53, 55, 156); fill-opacity: 0.5")
        }
    }
}


/*
Click polygons
*/

function borrarCuadro(){
    let cuadro = document.getElementsByClassName('clickPolygon');

    if (cuadro[0]){
        cuadro[0].parentNode.removeChild(cuadro[0]);
    }
}

function click_mas(event){
    let span = document.getElementsByTagName("span2")[0]
    let tropas = mensaje_servidor["territorios"][id_seleccionado]["tropas"]
    let cantidad_a_enviar = parseInt(span.textContent)

    if (cantidad_a_enviar < tropas - 1){
        span.textContent = cantidad_a_enviar + 1
    }
}

function click_menos(event){
    let span = document.getElementsByTagName("span2")[0]
    if (parseInt(span.textContent) > 1){
        span.textContent = span.textContent - 1
    }
}

function enviarJugada(event){
    let span = document.getElementsByTagName("span2")[0]
    if (modo == "atacando"){
        let ataque = {}
        ataque["id_territorio_saliente"] = id_seleccionado
        ataque["id_territorio_atacado"] = clases_territorios.indexOf(clase_territorio_anterior)
        ataque["tropas"] = parseInt(span.textContent)
        respuesta_usuario["ataques"].push(ataque)
        territorios_atacados.push(clases_territorios.indexOf(clase_territorio_anterior))

        nuevoLog(modo, parseInt(span.textContent), clases_territorios.indexOf(clase_territorio_anterior))
        console.log(recibeListado)
        MostrarTerritoriosAtacables()
    }
    else if (modo == "eligiendo_mover"){
        let movimiento = {}
        movimiento["id_territorio_saliente"] = id_seleccionado

        movimiento["id_territorio_entrante"] = clases_territorios.indexOf(clase_territorio_anterior)
        movimiento["tropas"] = parseInt(span.textContent)
        respuesta_usuario["reordenamientos"].push(movimiento)
        territorios_reforzados.push(clases_territorios.indexOf(clase_territorio_anterior))

        nuevoLog(modo, parseInt(span.textContent), clases_territorios.indexOf(clase_territorio_anterior))
        MostrarMisTerritorios()
    }
    let tropas_anteriores = mensaje_servidor["territorios"][id_seleccionado]["tropas"]
    mensaje_servidor["territorios"][id_seleccionado]["tropas"] = parseInt(tropas_anteriores) - parseInt(span.textContent)
    borrarCuadro()
    console.log(respuesta_usuario)
}


function mostrarEstadisticas(event){
    if (event.target.style["visibility"] === "visible" && event.target.style["fill"] != "yellow"){
        borrarCuadro()

        var newDiv = document.createElement("div")
        newDiv.className = "clickPolygon"
        newDiv.setAttribute("style", `top:${event.pageY}px; left:${event.pageX}px`)

        id_seleccionado = clases_territorios.indexOf(event.target.getAttribute('class'))
        var Li1 = document.createElement("li")
        Li1.appendChild(document.createTextNode(`Nombre: ${nombres_territorios[id_seleccionado]}`))
        var Li3 = document.createElement("li")
        Li3.setAttribute('class', "cerrar")
        Li3.appendChild(document.createTextNode("Cerrar"))
        Li3.addEventListener('click', borrarCuadro, false)

        var Li4 = document.createElement("li")

        Li4.appendChild(document.createTextNode(`Tropas: ${mensaje_servidor["territorios"][id_seleccionado]["tropas"]}`))


        newDiv.appendChild(Li1)
        newDiv.appendChild(Li4)
        if (modo == "reordenamiento"){
            if (territorios_reforzados.includes(id_seleccionado)){
                let liFallo = document.createElement("li")
                liFallo.appendChild(document.createTextNode("Ya has enviado tropas acá"))
                liFallo.setAttribute('class', "fallo")
                newDiv.appendChild(liFallo)
            }
            else{
                let boton = document.createElement("button")
                boton.setAttribute('class', "reordenar_def")
                boton.appendChild(document.createTextNode("Enviar tropas"))
                newDiv.appendChild(boton)
                boton.addEventListener('click', MostrarTerritoriosAdyacentes, false)
            }
        }
        else if (modo == "eligiendo_mover"){
            if (mensaje_servidor["territorios"][id_seleccionado]["tropas"] != 1){
                let liTropas = document.createElement("li")
                liTropas.appendChild(document.createTextNode("Tropas a enviar:"))
                let boton_decrement = document.createElement("button")
                boton_decrement.setAttribute('class', "botonPlus")
                boton_decrement.appendChild(document.createTextNode("-"))
                let boton_increment = document.createElement("button")
                boton_increment.setAttribute('class', "botonPlus")
                boton_increment.appendChild(document.createTextNode("+"))
                let texto = document.createElement("span2")
                var cantidad = 1
                texto.appendChild(document.createTextNode(cantidad))

                let boton_enviar = document.createElement("button")
                boton_enviar.setAttribute('class', "botonEnviar")
                boton_enviar.appendChild(document.createTextNode("Enviar"))
                boton_enviar.addEventListener('click', enviarJugada, false)

                let otroDiv = document.createElement("div")
                otroDiv.appendChild(boton_decrement)
                otroDiv.appendChild(texto)
                otroDiv.appendChild(boton_increment)

                boton_increment.addEventListener('click', click_mas, false)
                boton_decrement.addEventListener('click', click_menos, false)

                newDiv.appendChild(liTropas)
                newDiv.appendChild(otroDiv)
                newDiv.appendChild(boton_enviar)
            }
            else {
                let liFallo = document.createElement("li")
                liFallo.appendChild(document.createTextNode("No tienes suficientes tropas"))
                liFallo.setAttribute('class', "fallo")
                newDiv.appendChild(liFallo)
            }
        }
        else if (modo == "ataque"){
            if (getCookie('id_juego') != mensaje_servidor["territorios"][id_seleccionado]["id_jugador"]){
                if (territorios_atacados.includes(id_seleccionado)){
                    let liFallo = document.createElement("li")
                    liFallo.appendChild(document.createTextNode("Ya atacaste acá"))
                    liFallo.setAttribute('class', "fallo")
                    newDiv.appendChild(liFallo)
                }
                else{
                    let boton = document.createElement("button")
                    boton.setAttribute('class', "atacar_def")
                    boton.appendChild(document.createTextNode("Atacar"))
                    newDiv.appendChild(boton)
                    boton.addEventListener('click', MostrarTerritoriosAdyacentes, false)
                }
            }
        }
        else if (modo == "atacando"){
            if (mensaje_servidor["territorios"][id_seleccionado]["tropas"] != 1){
                let liTropas = document.createElement("li")
                liTropas.appendChild(document.createTextNode("Tropas a enviar:"))
                let boton_decrement = document.createElement("button")
                boton_decrement.setAttribute('class', "botonPlus")
                boton_decrement.appendChild(document.createTextNode("-"))
                let boton_increment = document.createElement("button")
                boton_increment.setAttribute('class', "botonPlus")
                boton_increment.appendChild(document.createTextNode("+"))
                let texto = document.createElement("span2")
                var cantidad = 1
                texto.appendChild(document.createTextNode(cantidad))

                let boton_enviar = document.createElement("button")
                boton_enviar.setAttribute('class', "botonEnviar")
                boton_enviar.appendChild(document.createTextNode("Ataque"))
                boton_enviar.addEventListener('click', enviarJugada, false)

                let otroDiv = document.createElement("div")
                otroDiv.appendChild(boton_decrement)
                otroDiv.appendChild(texto)
                otroDiv.appendChild(boton_increment)

                boton_increment.addEventListener('click', click_mas, false)
                boton_decrement.addEventListener('click', click_menos, false)

                newDiv.appendChild(liTropas)
                newDiv.appendChild(otroDiv)
                newDiv.appendChild(boton_enviar)
            }
            else {
                let liFallo = document.createElement("li")
                liFallo.appendChild(document.createTextNode("No tienes suficientes tropas"))
                liFallo.setAttribute('class', "fallo")
                newDiv.appendChild(liFallo)
            }
        }
        newDiv.appendChild(Li3)

        let parent = document.getElementsByClassName("juego")[0]
        let bro = document.getElementsByClassName("mapa")[0]
        parent.insertBefore(newDiv, bro)
    }
}

function MostrarTerritoriosAdyacentes ( event ){

    territorios_lista = document.getElementsByClassName("lista");

    for (let i = 0 ; i < territorios_lista.length; i++) {
        let cosa = document.getElementsByClassName(clases_territorios[territorios_lista[i].id])[0]
        cosa.setAttribute("style", "visibility: hidden")
    }
    borrarCuadro()
    if (modo == "reordenamiento"){
        let territorio_seleccionado = clases_territorios[id_seleccionado]
        clase_territorio_anterior = clases_territorios[id_seleccionado]
        for (let i = 0; i < adyacencias[territorio_seleccionado].length; i++){
            let id_territorio_adyacente= clases_territorios.indexOf(adyacencias[territorio_seleccionado][i])
            if (mensaje_servidor["territorios"][id_territorio_adyacente]["id_jugador"] == getCookie('id_juego')){
                let poligono = document.getElementsByClassName(clases_territorios[id_territorio_adyacente])[0]
                poligono.setAttribute("style", "visibility: visible")
            }
        }
        let poligono = document.getElementsByClassName(clases_territorios[id_seleccionado])[0]
        poligono.setAttribute("style", "visibility: visible; fill: yellow")
        modo = "eligiendo_mover"
        doc2 = document.getElementById("modo");
        modo_ = 'Eligiendo mover'
        doc2.innerHTML= '<h2>Modo de juego: ' + modo_ + '</h2>' ;
    }
    else if (modo == "ataque"){
        let territorio_seleccionado = clases_territorios[id_seleccionado]
        clase_territorio_anterior = clases_territorios[id_seleccionado]
        for (let i = 0; i < adyacencias[territorio_seleccionado].length; i++){
            let id_territorio_adyacente= clases_territorios.indexOf(adyacencias[territorio_seleccionado][i])
            if (mensaje_servidor["territorios"][id_territorio_adyacente]["id_jugador"] == getCookie('id_juego')){
                let poligono = document.getElementsByClassName(clases_territorios[id_territorio_adyacente])[0]
                poligono.setAttribute("style", "visibility: visible")
            }
        }
        let poligono = document.getElementsByClassName(clases_territorios[id_seleccionado])[0]
        poligono.setAttribute("style", "visibility: visible; fill: yellow")
        modo = "atacando"
        doc2 = document.getElementById("modo");
        doc2.innerHTML = '<h2>Modo de juego: ' + modo + '</h2>' ;
    }
}



for (let i = 0 ; i < polygons.length; i++) {
    polygons[i].addEventListener('click', mostrarEstadisticas, false);
}

function save_json(jugada){
    var blob = new Blob([JSON.stringify(jugada)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "jugada_guardada.json");
    //writeFile(blob, "jugada_guardada.json");
}


/*
Ajustar tamaño pantalla
*/

function ajustarPantalla(){
    let ancho = window.screen.width
    let alto = window.screen.height

    let diferencia = Math.sqrt((ancho * ancho) + (alto * alto))/ Math.sqrt((1080*1080) + (1920 * 1920))
    let porcentaje = diferencia*100

    let juego = document.getElementsByClassName("juego")[0]
    juego.setAttribute("style", `zoom: ${porcentaje}%` )
}

ajustarPantalla()

window.addEventListener('resize', ajustarPantalla)
