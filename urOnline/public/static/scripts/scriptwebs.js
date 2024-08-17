// Variables
const miWebSocket = new WebSocket("ws://192.168.122.117:6500");
//const miWebSocket = new WebSocket("ws://archivo.comecuco.org:6500"); //para el servidor Comecuco

// Eventos de WebSocket
miWebSocket.addEventListener("open", function() { // Abre conexión
    //console.log("linea 6 scriptwebs.js - WebSocket abierto");
    });

miWebSocket.addEventListener("message", async function (message) {
    // Se recibe un mensaje
    //console.log("linea 11 scriptwebs.js - WebSocket ha recibido un mensaje", message.data);

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
      if(datos.action==='conectado'){
        const idNuevoJugador = document.getElementById("idJugador");
        idNuevoJugador.innerText = datos.id;
        //console.log('idNuevoJugador es: ', idNuevoJugador.innerText);
        return;
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
        juegoUr.juegaDadosElOtroWs(datos);
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
    console.error("WebSocket ha observado un error: ", evento);
});

miWebSocket.addEventListener("close", function () {// Cierra la conexión
    console.log("WebSocket cerrado");
});

jugadorMandaMensajeAlServidor = {};

const idJugador = document.getElementById("idJugador");
const nombre = document.getElementById("nombre");
const partidoNumero = document.getElementById("partidoNumero");
const miNuevoMensaje = document.getElementById("nuevoMensaje");
const misRespuestas = document.getElementById("respuestas");
const telon = document.getElementById("telon");
const espera = document.getElementById("espera");
const nombreIncorrecto = document.getElementById("nombreIncorrecto");
const divButton = document.getElementById("botonDebotones");

nombre.addEventListener("keypress", async function definirMiNombre(evento) {
    if (evento.code === "Enter") {
        try {
            await jugadorMandaMensajeAlServidor.enviarNombreAlServidor(nombre.value);
        } catch (error) {
            console.error('Error al recibir respuesta del servidor');
        }
    }
});

miNuevoMensaje.addEventListener("keypress", function enviarMensaje (evento) {
    if(evento.code === "Enter") {
      let miMensaje = JSON.stringify({
        action:"mensaje",
        nombre:nombre.value,
        texto: miNuevoMensaje.value,
        id:idJugador.innerText,
        partido: partidoNumero.innerText
      });
      miWebSocket.send(miMensaje);
      // Borra texto en el input
      miNuevoMensaje.value = "";
    }
});

jugadorMandaMensajeAlServidor.enviarNombreAlServidor = async function(nombreJugador) {
        let miNombre = JSON.stringify({
          action:"nombre",
          id:idJugador.innerText,
          nombre:nombreJugador
        });
              // Creamos una promesa
        return new Promise((resolve, reject) => {
            // Definimos una función para manejar los mensajes entrantes
            const manejarMensaje = (mensaje) => {
                // Convertimos el mensaje a objeto
                let respuesta = JSON.parse(mensaje.data);
                // Si el mensaje indica "true", resolvemos la promesa con true
                if (respuesta.action === 'nombreDisponible') {
                    nombre.style.display = "none";
                    espera.style.display = "block";
                    nombreIncorrecto.style.display = "none";
                    resolve(true);
                }else if (respuesta.action === 'nombreNoDisponible') {
                    nombre.value="";
                    nombreIncorrecto.style.display = "block";
                    resolve(false);
                } else {
                    // Si no, rechazamos la promesa
                    reject(new Error('Respuesta inesperada del servidor'));
                    console.error('Error al recibir respuesta del servidor');
                }
                // Nos desuscribimos del evento 'message' para evitar múltiples respuestas
                miWebSocket.removeEventListener('message', manejarMensaje);
            };
            // Nos suscribimos al evento 'message' para manejar la respuesta del servidor
            miWebSocket.addEventListener('message', manejarMensaje);
            // Enviamos el mensaje al servidor
            miWebSocket.send(miNombre);
        });
    }

jugadorMandaMensajeAlServidor.revoloteaDado = function(dados, imagenesDados, resultado, turno) {
        let dado = JSON.stringify({
          action:"revoloteaDado",
          turno: turno,
          dados:dados,
          imagenesDados: imagenesDados,
          id:idJugador.innerText,
          partido: partidoNumero.innerText,
          resultado: resultado
        });
        miWebSocket.send(dado);
    }

jugadorMandaMensajeAlServidor.moverPieza = function(resultadoDados, id, idpieza) {
        let movimientoPieza = JSON.stringify({
          action:"mueveLaPieza",
          turno: id,
          idPieza: idpieza,
          id:idJugador.innerText,
          partido: partidoNumero.innerText,
          resultado: resultadoDados
        });
        miWebSocket.send(movimientoPieza);
    }

// jugadorMandaMensajeAlServidor.otroTurnoPorEstrella = function(id, nombre){
//       let otroTurno = JSON.stringify({
//         action:"otroTurnoPorEstrella",
//         turno: id,
//         id:idJugador.innerText,
//         partido: partidoNumero.innerText,
//         nombre: nombre
//       });
//       miWebSocket.send(otroTurno);
//     }

jugadorMandaMensajeAlServidor.cartelAlertPerdioTurnoPor0 = function (id, nombre){
  let perdioTurno = JSON.stringify({
    action:"perdioTurnoPor0",
    turno: id,
    id:idJugador.innerText,
    partido: partidoNumero.innerText,
    nombre: nombre
  });
  console.log("linea 192 scriptweb", id);
    console.log("linea 193 scriptweb", idJugador.innerText);
      console.log("linea 194 scriptweb", partidoNumero.innerText);
        console.log("linea 195 scriptweb", nombre);
  miWebSocket.send(perdioTurno);
}

jugadorMandaMensajeAlServidor.cartelAlertPerdioTurnoPorNoMovimiento = function(id, nombre){
  let perdioTurno = JSON.stringify({
    action:"perdioTurnoPorNoMovimiento",
    turno: id,
    id:idJugador.innerText,
    partido: partidoNumero.innerText,
    nombre: nombre
  });
  miWebSocket.send(perdioTurno);
}
jugadorMandaMensajeAlServidor.cartelTerminaJuego = function(id, nombre){
  let terminaJuego = JSON.stringify({
    action:"terminaJuego",
    partido: partidoNumero.innerText,
    id:idJugador.innerText,
    turno: id,
    nombre: nombre
  });
  miWebSocket.send(terminaJuego);
}

jugadorMandaMensajeAlServidor.desconeccion = function(id) {
  let meDesconecto = JSON.stringify({
    action:"meDesconecto",
    turno: id,
    id:idJugador.innerText,
    partido: partidoNumero.innerText,
    nombre: nombre.value
  });
  miWebSocket.send(meDesconecto);
  miWebSocket.close();
  window.location.href = "http://www.uronline.com";
}

jugadorMandaMensajeAlServidor.nuevoJuego = function(nombre) {
  let juegoDeNuevo = JSON.stringify({
    action:"juegoDeNuevo",
    id:idJugador.innerText,
    partido: "",
    nombre: nombre
  });
  miWebSocket.send(juegoDeNuevo);
}
