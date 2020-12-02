var boton_registro = document.getElementsByClassName("botonregistro")[0];

boton_registro.addEventListener("click", guardar);


const enviaValores = datos =>{

    return fetch("https://protected-scrubland-81841.herokuapp.com/register",
         { method:"POST", body:JSON.stringify(datos), headers:{"Content-type":"application/json"} })
        .then(responde =>{ return responde.json() })
}


async function guardar(){

  var name = document.getElementById('name');
  var pw = document.getElementById('password');
  var mail = document.getElementById('mail');
  console.log('aca')


  if(name.value.length == 0){
      alert('Porfavor ingrese un usuario');
  }
  if(pw.value.length == 0){
      alert('Porfavor ingrese una contraseña');
  }

    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail.value)))
  {
    alert("Ingresa un email válido!")
  }
    else{
      var valorAEnviar = { username: name.value, password: pw.value, mail: mail.value }
      var respuesta = await enviaValores(valorAEnviar)
      console.log(respuesta)
      if (respuesta["status"] === "error"){
        alert(`Ya hay un usuario creado con ese mail`);
      }
      else{
        alert(`Felicitaciones ${name.value}! Su cuenta se ha creado exitosamente`);
        window.location = 'Login.html'
      }
    }
}
