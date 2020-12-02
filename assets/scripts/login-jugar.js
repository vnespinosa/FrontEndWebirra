/* Ver si el boton dice login o jugar */

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


var boton = document.getElementsByClassName("active")[0]
console.log(boton)
if (getCookie("token") != "") {
    boton.textContent = "Jugar"
    boton.href = "my_turn.html"
}
else {
    boton.textContent = "Login"
}