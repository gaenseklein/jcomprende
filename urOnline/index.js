//dependencias
const express = require('express'); //biblioteca que construye un servidor
const app = express();
const http = require('http');

const jugadores = {jugador1:"", jugador2:""};
const clientes = new Set();

const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', onSocketConnect);

http.createServer((req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});


// Cuando un nuevo jugador se conecta
function onSocketConnect(ws) {
  clientes.add(ws);
  console.log('linea 22 index.js - nuevo jugador conectado');

  // Manejar mensajes del jugador
  ws.on('message', function (message) {
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
        if (jugadores.jugador1==="") {
            jugadores.jugador1=data.nombre;
        } else {
          jugadores.jugador2=data.nombre;
          if (jugadores.jugador1===jugadores.jugador2) {
            jugadores.jugador2=data.nombre+"*";
          }
          let nombres = JSON.stringify({action:'nombre', nombre1:jugadores.jugador1, nombre2:jugadores.jugador2});
          for (let jugador of clientes) {
            jugador.send(nombres);
        }
      }
        return;
      }
      if (data.turno) {
        let receptor = {};
        clientes.forEach((cliente) => {
          // Verificar si el cliente actual no es el que envió el mensaje
          if (cliente !== ws) {
            // Enviar el mensaje al cliente actual
            receptor=cliente;
          }
        });
        if (data.action==='revoloteaDado') {
          let tiraDados = JSON.stringify(data)
          receptor.send(tiraDados);
        }
        if (data.action==='mueveLaPieza') {
          let muevePieza = JSON.stringify(data)
          receptor.send(muevePieza);
        }
        if (data.action==='perdioTurno') {
          let pierdeTurno = JSON.stringify(data)
          receptor.send(pierdeTurno);
        }
        if (data.action==='terminaJuego') {
          let terminoJuego = JSON.stringify(data)
          receptor.send(terminoJuego);
        }
        if (data.action==='meDesconecto') {
          let desconectado = JSON.stringify(data)
          receptor.send(desconectado);
        }
        if (data.action==='juegoDeNuevo') {
          let jugamosdeNuevo = JSON.stringify(data)
          receptor.send(jugamosdeNuevo);
        }
      }
      if(data.action==='mensaje'){
        let mensajeJson = JSON.stringify(data)
          for (let jugador of clientes) {
            jugador.send(mensajeJson);
      }
      return;
    }
  });

  // Manejar cierre de conexión
  ws.on('close', function () {
    console.log("linea 99 index - clientes es : ", clientes.length);
    console.log("linea 100 index - clientes es : ", clientes);
    clientes.delete(ws);
    console.log("linea 102 index - clientes es : ", clientes.length);
    console.log("linea 103 index - clientes es : ", clientes);
  });
};

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
