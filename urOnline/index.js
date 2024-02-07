//dependencias
const express = require('express'); //biblioteca que construye un servidor
const app = express();
const http = require('http');

const jugadores = {jugador1:"", jugador2:""};
const juego = [];

const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', onSocketConnect);

http.createServer((req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

// Cuando un nuevo jugador se conecta
function onSocketConnect(ws) {
  juego.push(ws);
  console.log('linea 22 index.js - nuevo jugador conectado');

  // ws.sendToRoom = function(message,excludeSelf){
  //     // console.log("sending to room:",message);
  //         for(var x=0;x<rooms[this.room].length;x++){
  //             if(excludeSelf && rooms[this.room][x] === this)continue;
  //             msg = message;
  //             if(typeof msg!="string")msg = JSON.stringify(message);
  //             rooms[this.room][x].send(msg);
  //         }
  //}

  // Manejar mensajes del jugador
  ws.on('message', function (message) {
    let data;
    try {
      console.log("linea 38 index");
        data = JSON.parse(message);
        console.log("linea 41 index");
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
        console.log("linea 58 index");
        let nombres = JSON.stringify({action:'nombre', nombre1:jugadores.jugador1, nombre2:jugadores.jugador2});
        for (let jugador of juego) {
          jugador.send(nombres);
        //ws.send(nombres);
      }
    }
      return;
    }

    if(data.action==='mensaje'){
        let saleMensaje = JSON.stringify(data);
        console.log("linea 67 index - ", data);
        for (let jugador of juego) {
          jugador.send(saleMensaje);
      }
      return;
    }


    message = message.slice(0, 50); // la longitud máxima del mensaje será 50
    console.log(`Mensaje recibido: ${message}`);

    // Enviar mensaje de vuelta al jugador
    ws.send(`Servidor dice: ${message}`);

    //Puedes enviar el mensaje a todos los jugadores conectados
    for (let jugador of juego) {
      jugador.send(message);
    }
  });

  // Manejar cierre de conexión
  ws.on('close', function () {
    const disconnectedjugadorWebSocket = ws; /* objeto WebSocket del jugador desconectado */
    // const disconnectedjugadorWebSocket = ws.id; /* objeto WebSocket del jugador desconectado */
    jugadores.delete(disconnectedjugadorWebSocket);
    console.log('linea 52 index.js - ID de jugador desconectado: ', disconnectedjugadorWebSocket);
  });

  // Obtener el número total de jugadores conectados
  // function numeroDeJugadores(juego) {
  //   let contador = 0;
  //   for (const jugadores of juego) {
  //     contador += 1;
  //   }
  //   console.log('linea 94 index.js - jugadores conectados: ', contador);
  //   return
  // }
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
