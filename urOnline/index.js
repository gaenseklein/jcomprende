//dependencias
const express = require('express'); //biblioteca que construye un servidor
const app = express();
const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const listaJugadores = [];
// let jugador={};
let jugadorEnEspera = 'false';

http.createServer((req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

// Cuando un nuevo jugador se conecta
wss.on('connection', function onSocketConnect(ws) {
  let jugadorNuevo;
  for (var i = 0; i < 100; i++) {
    let idAzar=Math.floor(Math.random()*100000);
    let busquedaIdAzar=listaJugadores.find((jugadorMismaId)=>jugadorMismaId.id == idAzar);
    if(busquedaIdAzar===undefined){
      jugadorNuevo={
        id:idAzar,
        webSocket:ws,
        estado:'conectado',
        nombre:''
        };
      break;
      }
    }
    if (jugadorNuevo) {
      listaJugadores.push(jugadorNuevo);
    } else {
      console.log('No se pudo encontrar un id único después de 100 intentos.');
    }
  console.log('linea 104 index - listaJugadores es: ', listaJugadores);
  let respuestaPorConeccion=JSON.stringify({action:'conectado', id: jugadorNuevo.id});
  ws.send(respuestaPorConeccion);
  console.log('linea 34 index.js - nuevo jugador conectado');
  console.log('linea 35 index.js - listaJugadores.length: ', listaJugadores.length);
  // Manejar mensajes del jugador
  ws.on('message', async function (message) {
      let data;
      try {
          data = JSON.parse(message);
          console.log("linea 41 index", data);
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
        if(data.juegoDeNuevo){
          await ws.pasarAJugadorEnEspera(data);
          return;
        }else{
          let busquedaNombre=listaJugadores.find((jugadorViejo)=>jugadorViejo.nombre === data.nombre);
          if(busquedaNombre===undefined){
            let respuestaAlNombre=JSON.stringify({action:'nombreDisponible'});
            ws.send(respuestaAlNombre);
            await ws.pasarAJugadorEnEspera(data);
            return;
          } else {
            let respuestaAlNombre=JSON.stringify({action:'nombreNoDisponible'});
            ws.send(respuestaAlNombre);
            return;
          }
        }
      }
      if(data.action==='mensaje'){
        let saleMensaje = JSON.stringify(data);
        let buscarPartidoMensaje=listaJugadores.filter((jugadoresDelPartido)=>jugadoresDelPartido.partido == data.partido);
        buscarPartidoMensaje.forEach((jugador) => {
          jugador.webSocket.send(saleMensaje);
          });
        return;
      }
      if (data.turno) {
        let mandaData = JSON.stringify(data);
        let receptor = {};
        console.log('linea 80 index.js - data.partido es: ', data.partido);
        let jugadorDelPartido=listaJugadores.filter((jugadoresOponentes) => jugadoresOponentes.partido==data.partido);
          // Verificar cual es el que envió el mensaje
        if (jugadorDelPartido[0].id != data.id) {
            receptor=jugadorDelPartido[0];
          } else {
            receptor=jugadorDelPartido[1];
          }
        receptor.webSocket.send(mandaData);
      }
      if(data.action==='meDesconecto'){
        let jugadorParaBorrarDeLaLista=listaJugadores.find((jugadorBorraId)=>jugadorBorraId.id == data.id);
        console.log('linea 98 index - data.id es: ', data.id);
        let index = listaJugadores.indexOf(jugadorParaBorrarDeLaLista);
        console.log('linea 99 index - index es: ', index);
        if (index !== -1) {
            console.log('linea 101 index - listaJugadores[index].nombre es: ', listaJugadores[index].nombre);
           console.log('linea 102 index.js - el jugador ' + data.nombre + ' se ha desconectado');
           listaJugadores.splice(index, 1);
       } else {
           console.log('linea 106 index.js - Error al sacar al jugador de la Lista de Jugadores');
      }
    }
  });
    // Manejar cierre de conexión
  ws.on('close', function () {
    console.log('linea 109 index - Un jugador se ha desconectado');
  });

  ws.pasarAJugadorEnEspera=async function(data){
    let jugadorQueMandaMensaje=listaJugadores.find((jugadorListaId)=>jugadorListaId.id == data.id);
    console.log('linea 103 index - data es: ', data);
    console.log('linea 104 index - jugadorQueMandaMensaje es: ', jugadorQueMandaMensaje);
    console.log('linea 105 index - jugadorQueMandaMensaje.id es: ', jugadorQueMandaMensaje.id);
    if (jugadorEnEspera==='false') {
      jugadorEnEspera='true';
      jugadorQueMandaMensaje.estado='enEspera';
      jugadorQueMandaMensaje.nombre=data.nombre;
      console.log('linea 98 index.js - jugador '+ jugadorQueMandaMensaje.nombre +' ahora en espera');
      return;
    } else {
      let cifraAzar=Math.floor(Math.random()*10000);
      jugadorQueMandaMensaje.nombre=data.nombre;
      jugadorQueMandaMensaje.estado='jugador2-partido'+cifraAzar;
      console.log('linea 103 index - estado del jugador: ', jugadorQueMandaMensaje.estado);
      jugadorQueMandaMensaje.partido=cifraAzar;
      let busquedaJugadorEnEspera=listaJugadores.find((jugadorEsperando)=>jugadorEsperando.estado === "enEspera");
      console.log('linea 106 index - habia jugador en espera: ', busquedaJugadorEnEspera.nombre);
      busquedaJugadorEnEspera.estado='jugador1-partido'+cifraAzar;
      busquedaJugadorEnEspera.partido=cifraAzar;
      jugadorEnEspera='false';
      let nombres = {action:'nombre', partido:jugadorQueMandaMensaje.partido, nombre1:busquedaJugadorEnEspera.nombre, nombre2:jugadorQueMandaMensaje.nombre};
      let buscarPartidoNombre=listaJugadores.filter((jugadoresDelPartido)=>jugadoresDelPartido.partido == jugadorQueMandaMensaje.partido);
      mensajeParaTodes=JSON.stringify(nombres);
      buscarPartidoNombre.forEach((jugador) => {
        jugador.webSocket.send(mensajeParaTodes);
        });
      return;
      }
  }
});

//Import routes
const fpRoute = require('./routes/urRoute');

//Route Middlewares
app.use(express.json({limit: '50mb'}));
app.use('/',fpRoute);

//serving static-files for test-purpose / can be served directly by nginx
app.use('/public', express.static('./public'));

app.use('/public/static/scripts', express.static('/public/static/scripts/', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));

const PORT = 4500;
app.listen(PORT,() => console.log('server up and running at port ',PORT));
const PORTws = 6500;
server.listen(PORTws,() => console.log('Servidor WebSocket escuchando en el puerto ',PORTws));
