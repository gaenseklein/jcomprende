// Variables
const miWebSocket = new WebSocket("ws://192.168.122.117:6500");
const nombre = document.getElementById("nombre");
const miNuevoMensaje = document.getElementById("nuevoMensaje");
const misRespuestas = document.getElementById("respuestas");

//  ESTRUCTURA PARA JSON: juegoUr.jugador1 = {data:"", nombre:nombre, id:"1", mensaje:"", ficha:"", dados:""};

// Funciones
function open () {
    // Abre conexión
    console.log("linea 9 scriptwebs.js - WebSocket abierto");
}

async function message (evento) {
    // Se recibe un mensaje
    console.log("linea 14 scriptwebs.js - WebSocket ha recibido un mensaje", evento.data);

      let data;
      try {
        data = JSON.parse(evento.data);
      }catch(e){
        console.log(e);
        console.log("malformed message - no JSON");
        return;
      }
      if(data.action===undefined){
        console.error("action not defined");
        return; //close connection of ws directly in future
      }
      if(data.action==='nombre'){
        const tituloJugador1 = document.getElementById("nombre1");
        const tituloJugador2 = document.getElementById("nombre2");
        tituloJugador1.innerText = data.nombre1;
        tituloJugador2.innerText = data.nombre2;
        const telon = document.getElementById("telon");
        juegoUr.init();
        telon.style.display = "none";
        return; //close connection of ws directly in future
      }
      if(data.action==='mensaje'){
        chatAnterior = misRespuestas.innerHTML
        misRespuestas.innerHTML = chatAnterior + '<br>' + data.nombre +": "+ data.texto;
        return; //close connection of ws directly in future
      }
  }

function error (evento) {
    // Ha ocurrido un error
    console.error("linea 22 scriptwebs.js - WebSocket ha observado un error: ", evento);
}

function close () {
    // Cierra la conexión
    console.log("linea 27 scriptwebs.js - WebSocket cerrado.");
}

function revoloteaDado () {
        let dado = JSON.stringify({
          action:"revoloteaDado",
          dado:nombre.value
        });
        miWebSocket.send(miNombre);

        nombre.style.display = "none";
        const espera = document.getElementById("espera");
        espera.style.display = "block";
    }

function definirMiNombre (evento) {
    // Evento tecla Enter
    if(evento.code === "Enter") {
        // Envia mensaje por WebSockets
        let miNombre = JSON.stringify({
          action:"nombre",
          nombre:nombre.value
        });
        miWebSocket.send(miNombre);

        nombre.style.display = "none";
        const espera = document.getElementById("espera");
        espera.style.display = "block";
    }
}
function enviarMensaje (evento) {
    if(evento.code === "Enter") {
      // Envia mensaje por WebSockets
      let miMensaje = JSON.stringify({
        action:"mensaje",
        nombre:nombre.value,
        texto: miNuevoMensaje.value
      });
      miWebSocket.send(miMensaje);
      miWebSocket.send(miNuevoMensaje.value);
      // Borra texto en el input
      miNuevoMensaje.value = "";
    }
}

// Eventos de WebSocket
miWebSocket.addEventListener("open", open);
miWebSocket.addEventListener("message", message);
miWebSocket.addEventListener("error", error);
miWebSocket.addEventListener("close", close);

// Evento para envia nuevo mensaje
nombre.addEventListener("keypress", definirMiNombre);
miNuevoMensaje.addEventListener("keypress", enviarMensaje);
