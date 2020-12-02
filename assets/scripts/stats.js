const getStats = datos =>{

    return fetch("https://protected-scrubland-81841.herokuapp.com/estadisticas",
         { method:"GET", headers:{"Content-type":"application/json"} })
        .then(responde =>{ return responde.json() })
}

async function cargarStats() {

    const listaStats = await getStats('')
    traspasarTablas(listaStats)
    return listaStats
}

cargarStats()

function traspasarTablas(lista) {
    for (let i = 0; i < lista["partidas"].length; i++){
        if (i < 5) { /* Para mostrar solo el top 5 */
            crearLi("partidas", lista["partidas"][i][0], lista["partidas"][i][1])
        }
    }

    for (let i = 0; i < lista["victorias"].length; i++){
        if (i < 5) {
            crearLi("victorias", lista["victorias"][i][0], lista["victorias"][i][1])
        }
    }

    for (let i = 0; i < lista["tropas_perdidas"].length; i++){
        if (i < 5) {
            crearLi("tropas_perdidas", lista["tropas_perdidas"][i][0], lista["tropas_perdidas"][i][1])
        }
    }

    for (let i = 0; i < lista["ataques_totales"].length; i++){
        if (i < 5) {
            crearLi("ataques_totales", lista["ataques_totales"][i][0], lista["ataques_totales"][i][1])
        }
    }

    for (let i = 0; i < lista["ataques_exitosos"].length; i++){
        if (i < 5) {
            crearLi("ataques_exitosos", lista["ataques_exitosos"][i][0], lista["ataques_exitosos"][i][1])
        }
    }

    for (let i = 0; i < lista["ataques_fallidos"].length; i++){
        if (i < 5) {
            crearLi("ataques_fallidos", lista["ataques_fallidos"][i][0], lista["ataques_fallidos"][i][1])
        }
    }
}

function crearLi(idPadre, nombre, cantidad) {
    let padre = document.getElementById(idPadre)
    let tabla = padre.children[0]
    let nombres = tabla.children[1]
    let cantidades = tabla.children[2]

    let Li1 = document.createElement("li")
    Li1.appendChild(document.createTextNode(nombre))
    nombres.appendChild(Li1)

    let Li2 = document.createElement("li")
    Li2.appendChild(document.createTextNode(cantidad))
    cantidades.appendChild(Li2)
}

