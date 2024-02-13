// Variables
const miWebSocket = new WebSocket("ws://192.168.122.117:6500");
const nombre = document.getElementById("nombre");
const miNuevoMensaje = document.getElementById("nuevoMensaje");
const misRespuestas = document.getElementById("respuestas");
const telon = document.getElementById("telon");
const espera = document.getElementById("espera");

//  ESTRUCTURA PARA JSON: juegoUr.jugador1 = {data:"", nombre:nombre, id:"1", mensaje:"", ficha:"", dados:""};

// Funciones
function open () {
    // Abre conexión
    console.log("linea 12 scriptwebs.js - WebSocket abierto");
}

async function message (message) {
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
  }

function error (evento) {
    // Ha ocurrido un error
    console.error("linea 54 scriptwebs.js - WebSocket ha observado un error: ", evento);
}

function close () {
    // Cierra la conexión
    console.log("linea 59 scriptwebs.js - WebSocket cerrado.");
}

function revoloteaDado (dados, imagenesDados, resultado, turno) {
        let dado = JSON.stringify({
          action:"revoloteaDado",
          turno: turno,
          dados:dados,
          imagenesDados: imagenesDados,
          resultado: resultado
        });
        miWebSocket.send(dado);
    }

    function moverPieza(resultadoDados, id, idpieza) {
            let movimientoPieza = JSON.stringify({
              action:"mueveLaPieza",
              turno: id,
              idPieza: idpieza,
              resultado: resultadoDados
            });
            console.log('linea 107 - ovimiento pieza es: ', movimientoPieza);
            miWebSocket.send(movimientoPieza);
        }

  function cartelAlertPerdioTurnoPor0 (id, nombre){
    let perdioTurno = JSON.stringify({
      action:"perdioTurnoPor0",
      turno: id,
      nombre: nombre,
    });
    miWebSocket.send(perdioTurno);
  }

  function cartelAlertPerdioTurnoPorNoMovimiento (id, nombre){
    let perdioTurno = JSON.stringify({
      action:"perdioTurnoPorNoMovimiento",
      turno: id,
      nombre: nombre
    });
    miWebSocket.send(perdioTurno);
  }
  function cartelTerminaJuego (id, nombre){
    let terminaJuego = JSON.stringify({
      action:"terminaJuego",
      turno: id,
      nombre: nombre
    });
    miWebSocket.send(terminaJuego);
  }

function definirMiNombre (evento) {
    // Evento tecla Enter
    if(evento.code === "Enter") {
        let miNombre = JSON.stringify({
          action:"nombre",
          nombre:nombre.value
        });
        miWebSocket.send(miNombre);

        nombre.style.display = "none";
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
//      miWebSocket.send(miNuevoMensaje.value);
      // Borra texto en el input
      miNuevoMensaje.value = "";
    }
}
function desconeccion (id, nombre) {
      let meDesconecto = JSON.stringify({
        action:"meDesconecto",
        turno: id,
        nombre: nombre
      });
      miWebSocket.send(meDesconecto);
      miWebSocket.close();
      res.redirect('/');
}

function nuevoJuego (id, nombre) {
      let juegoDeNuevo = JSON.stringify({
        action:"juegoDeNuevo",
        turno: id,
        nombre: nombre
      });
      miWebSocket.send(juegoDeNuevo);
      let miNombre = JSON.stringify({
        action:"nombre",
        nombre:nombre
      });
      miWebSocket.send(miNombre);
      telon.style.display = "block";
      telon.style.opacity = "1";
      espera.style.display = "block";
}

// Eventos de WebSocket
miWebSocket.addEventListener("open", open);
miWebSocket.addEventListener("message", message);
miWebSocket.addEventListener("error", error);
miWebSocket.addEventListener("close", close);

// Evento que envia nuevo mensaje
nombre.addEventListener("keypress", definirMiNombre);
miNuevoMensaje.addEventListener("keypress", enviarMensaje);
