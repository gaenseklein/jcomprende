// Variables
const miWebSocket = new WebSocket("ws://192.168.122.117:6500");
const nombre = document.getElementById("nombre");
const partidoNumero = document.getElementById("partidoNumero");
const miNuevoMensaje = document.getElementById("nuevoMensaje");
const misRespuestas = document.getElementById("respuestas");
const telon = document.getElementById("telon");
const espera = document.getElementById("espera");
const nombreIncorrecto = document.getElementById("nombreIncorrecto");
const divButton = document.getElementById("botonDebotones");

// Eventos de WebSocket
miWebSocket.addEventListener("open", function() { // Abre conexión
    console.log("linea 12 scriptwebs.js - WebSocket abierto");
    });

miWebSocket.addEventListener("message", async function (message) {
    // Se recibe un mensaje
    console.log("linea 17 scriptwebs.js - WebSocket ha recibido un mensaje", message.data);

      let datos={};
      try {
        datos = JSON.parse(message.data);
      }catch(e){
        console.log(e);
        console.log("malformed message - no JSON");
        return;
      }
      if(datos.action===undefined){
        console.error("action not defined");
        return; //close connection of ws directly in future
      }
      if(datos.action==='nombre'){
        const tituloJugador1 = document.getElementById("nombre1");
        const tituloJugador2 = document.getElementById("nombre2");
        tituloJugador1.innerText = datos.nombre1;
        tituloJugador2.innerText = datos.nombre2;
        partidoNumero.innerText=datos.partido;
        juegoUr.init();
        telon.style.display = "none";
        return;
      }
      if(datos.action==='revoloteaDado'){
        juegoUr.juegaDadosElOtro(datos);
        return;
      }
      if(datos.action==='mueveLaPieza'){
        juegoUr.piezaClickWs(datos);
        return;
      }
      if(datos.action==='perdioTurnoPor0'){
        juegoUr.cartelPierdeTurnoPor0Ws(datos);
        return;
      }
      if(datos.action==='perdioTurnoPorNoMovimiento'){
        juegoUr.cartelPierdeTurnoPorNoMovimientoWs(datos);
        return;
      }
      if(datos.action==='terminaJuego'){
        juegoUr.terminaJuegoWs(datos);
        return;
      }
      if(datos.action==='meDesconecto'){
        juegoUr.meDesconectoWs(datos);
        return;
      }
      if(datos.action==='juegoDeNuevo'){
        juegoUr.jugarDeNuevoWs(datos);
        return;
      }
      if(datos.action==='mensaje'){
        chatAnterior = misRespuestas.innerHTML
        misRespuestas.innerHTML = chatAnterior + '<br>' + datos.nombre +": "+ datos.texto;
        return;
      }
  });

miWebSocket.addEventListener("error", function (evento) {// Ha ocurrido un error
    console.error("linea 76 scriptwebs.js - WebSocket ha observado un error: ", evento);
});

miWebSocket.addEventListener("close", function close () {// Cierra la conexión
    console.log("linea 80 scriptwebs.js - WebSocket cerrado.");
});

//REVISAR
nombre.addEventListener("keypress", async function definirMiNombre(evento) {
    if (evento.code === "Enter") {
        try {
            await enviarNombreAlServidor(nombre.value);
        } catch (error) {
            console.error('Error al recibir respuesta del servidor');
        }
    }
});

// funciones pra que el cliente envie ws al servidor
async function enviarNombreAlServidor (nombreJugador) {
        let miNombre = JSON.stringify({
          action:"nombre",
          nombre:nombreJugador
        });
              // Creamos una promesa
        return new Promise((resolve, reject) => {
            // Definimos una función para manejar los mensajes entrantes
            const manejarMensaje = (mensaje) => {
                // Convertimos el mensaje a objeto
                let respuesta = JSON.parse(mensaje.data);
                console.log('linea 107 scriptwebs');
                // Si el mensaje indica "true", resolvemos la promesa con true
                if (respuesta.action === 'nombreDisponible') {
                    nombre.style.display = "none";
                    espera.style.display = "block";
                    nombreIncorrecto.style.display = "none";
                      console.log('linea 112 scriptwebs');
                    resolve(true);
                }else if (respuesta.action === 'nombreNoDisponible') {
                    nombre.value="";
                    nombreIncorrecto.style.display = "block";
                      console.log('linea 117 scriptwebs');
                    resolve(false);
                } else {
                    // Si no, rechazamos la promesa
                    reject(new Error('Respuesta inesperada del servidor'));
                      console.log('linea 122 scriptwebs');
                    console.error('Error al recibir respuesta del servidor');
                }
                // Nos desuscribimos del evento 'message' para evitar múltiples respuestas
                miWebSocket.removeEventListener('message', manejarMensaje);
                  console.log('linea 127 scriptwebs');
            };
            // Nos suscribimos al evento 'message' para manejar la respuesta del servidor
            miWebSocket.addEventListener('message', manejarMensaje);
              console.log('linea 131 scriptwebs');
            // Enviamos el mensaje al servidor
            miWebSocket.send(miNombre);
        });
    }

miNuevoMensaje.addEventListener("keypress", function enviarMensaje (evento) {
    if(evento.code === "Enter") {
      let miMensaje = JSON.stringify({
        action:"mensaje",
        nombre:nombre.value,
        texto: miNuevoMensaje.value,
        partido: partidoNumero.innerText
      });
      miWebSocket.send(miMensaje);
      // Borra texto en el input
      miNuevoMensaje.value = "";
    }
});

function revoloteaDado (dados, imagenesDados, resultado, turno) {
        let dado = JSON.stringify({
          action:"revoloteaDado",
          turno: turno,
          dados:dados,
          imagenesDados: imagenesDados,
          partido: partidoNumero.innerText,
          resultado: resultado
        });
        miWebSocket.send(dado);
    }

function moverPieza(resultadoDados, id, idpieza) {
        let movimientoPieza = JSON.stringify({
          action:"mueveLaPieza",
          turno: id,
          idPieza: idpieza,
          partido: partidoNumero.innerText,
          resultado: resultadoDados
        });
        console.log('linea 107 - movimiento pieza es: ', movimientoPieza);
        miWebSocket.send(movimientoPieza);
    }

function cartelAlertPerdioTurnoPor0 (id, nombre){
  let perdioTurno = JSON.stringify({
    action:"perdioTurnoPor0",
    turno: id,
    partido: partidoNumero.innerText,
    nombre: nombre,
  });
  miWebSocket.send(perdioTurno);
}

function cartelAlertPerdioTurnoPorNoMovimiento (id, nombre){
  let perdioTurno = JSON.stringify({
    action:"perdioTurnoPorNoMovimiento",
    turno: id,
    partido: partidoNumero.innerText,
    nombre: nombre
  });
  miWebSocket.send(perdioTurno);
}
function cartelTerminaJuego (id, nombre){
  let terminaJuego = JSON.stringify({
    action:"terminaJuego",
    partido: partidoNumero.innerText,
    turno: id,
    nombre: nombre
  });
  miWebSocket.send(terminaJuego);
}

function desconeccion (id, nombre) {
  let meDesconecto = JSON.stringify({
    action:"meDesconecto",
    turno: id,
    partido: partidoNumero.innerText,
    nombre: nombre
  });
  miWebSocket.send(meDesconecto);
  miWebSocket.close();
  window.location.href = "http://www.uronline.com";
}

function nuevoJuego (id, nombre) {
  let juegoDeNuevo = JSON.stringify({
    action:"juegoDeNuevo",
    turno: id,
    partido: partidoNumero.innerText,
    nombre: nombre
  });
  miWebSocket.send(juegoDeNuevo);
  let miNombre = JSON.stringify({
    action:"nombre",
    nombre:nombre
  });
  miWebSocket.send(miNombre);
  telon.style.display = "block";
  telon.style.backgroundColor = "rgb(255 255 255 / 85%)";
  espera.style.display = "block";
  divButton.style.zIndex = "5";
}
