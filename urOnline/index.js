//dependencias
const express = require('express'); //biblioteca que construye un servidor
const app = express();
const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const listaJugadores = [];
let jugadorEnEspera = 'false';

http.createServer((req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

// Cuando un nuevo jugador se conecta
wss.on('connection', function onSocketConnect(ws) {
  ws.estado='conectado';
  ws.nombre='';
  let mandoMensaje=ws;
  listaJugadores.push(ws);
  console.log('linea 23 index.js - nuevo jugador conectado');
  console.log('linea 24 index.js - listaJugadores.length: ', listaJugadores.length);
  // Manejar mensajes del jugador
  ws.on('message', async function (message) {
      let data;
      try {
          data = JSON.parse(message);
          console.log("linea 30 index", data);
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
        let nombre=data.nombre;
        let busquedaNombre=listaJugadores.find((jugadorViejo)=>jugadorViejo.nombre === nombre);
        if(busquedaNombre===undefined){
          let respuestaAlNombre=JSON.stringify({action:'nombreDisponible'});
          mandoMensaje.send(respuestaAlNombre);
        } else {
          let respuestaAlNombre=JSON.stringify({action:'nombreNoDisponible'});
          mandoMensaje.send(respuestaAlNombre);
          return
        }
        if (jugadorEnEspera==='false') {
          jugadorEnEspera='true';
          ws.estado='enEspera';
          ws.nombre=data.nombre;
          console.log('linea 55 index.js - jugador '+ ws.nombre +' ahora en espera');
          return;
        } else {
          let cifraAzar=Math.floor(Math.random()*10000);
          ws.nombre=data.nombre;
          ws.estado='jugador2-partido'+cifraAzar;
          console.log('linea 61 index - estado del jugador: ', ws.estado);
          ws.partido=cifraAzar;
          let busquedaJugadorEnEspera=listaJugadores.find((jugadorEsperando)=>jugadorEsperando.estado === "enEspera");
          console.log('linea 63 index - habia jugador en espera: ', busquedaJugadorEnEspera.nombre);
          busquedaJugadorEnEspera.estado='jugador1-partido'+cifraAzar;
          busquedaJugadorEnEspera.partido=cifraAzar;
          jugadorEnEspera='false';
          let nombres = {action:'nombre', partido:ws.partido, nombre1:busquedaJugadorEnEspera.nombre, nombre2:ws.nombre};
          let buscarPartidoNombre=listaJugadores.filter((jugadoresDelPartido)=>jugadoresDelPartido.partido == ws.partido);
          mensajeParaTodes=JSON.stringify(nombres);
          buscarPartidoNombre.forEach((jugador) => {
            jugador.send(mensajeParaTodes);
            });
          return;
          }
        }
      if(data.action==='mensaje'){
        let saleMensaje = JSON.stringify(data);
        let buscarPartidoMensaje=listaJugadores.filter((jugadoresDelPartido)=>jugadoresDelPartido.partido == data.partido);
        buscarPartidoMensaje.forEach((jugador) => {
          jugador.send(saleMensaje);
          });
        return;
      }
      if (data.turno) {
        let mandaData = JSON.stringify(data);
        let receptor = {};
        console.log('linea 86 index.js - data.partido es: ', data.partido);
        let jugadorDelPartido=listaJugadores.filter((jugadoresOponentes) => jugadoresOponentes.partido==data.partido);
          // Verificar cual es el que envió el mensaje
        if (jugadorDelPartido[0] != ws) {
            // Enviar el mensaje al jugador actual
            receptor=jugadorDelPartido[0];
          } else {
            receptor=jugadorDelPartido[1];
          }
        receptor.send(mandaData);
      }
    });

    // Manejar cierre de conexión
  ws.on('close', function () {
    const index = listaJugadores.indexOf(ws);
    if (index > -1) {
      listaJugadores.splice(index, 1);
    }
    console.log('linea 91 index.js - jugador '+data.nombre+' desconectado');
  });
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
