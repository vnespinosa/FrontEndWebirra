var boton_login = document.getElementById("botonjugar");

boton_login.addEventListener("click", revisar);

const enviaValores = datos =>{

    return fetch("https://protected-scrubland-81841.herokuapp.com/login",
         { method:"POST", body:JSON.stringify(datos), headers:{"Content-type":"application/json"} })
        .then(responde =>{ return responde.json() })
}

async function revisar(){

    var mail = document.getElementById('mail');
    var pw = document.getElementById('password');

    if(mail.value.length == 0){
        alert('Porfavor ingrese un usuario');
    }
    if(pw.value.length == 0){
        alert('Porfavor ingrese una contraseña');
    }

    else{
      var valorAEnviar = { mail: mail.value, password: pw.value }
      var respuesta = await enviaValores(valorAEnviar)
      if (respuesta["status"] === "error"){
        alert(`${respuesta["msg"]}`);
      }
      else{
        await createCookie('token', respuesta['token'], 1)
        await createCookie('id_usuario', respuesta['id'], 1)
        console.log("----------------")
        await console.log(getCookie('token'))
        console.log(getCookie('id_usuario'))
        alert(`A jugar!`);
        window.location = 'my_turn.html'
      }
    }

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
