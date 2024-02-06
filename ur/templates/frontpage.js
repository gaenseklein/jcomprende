const template = function(dataFrontpage){

  let raw =`
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Juego de Ur</title>
      <link rel="stylesheet" href="./public/static/ur.css">
      <!-- <script src="/public/static/scripts/wsChat.js"></script>-->
    </head>
    <!-- <body onload="juegoUr.init()"> -->
    <body>
      <div id="jugador1">
        <h2 id="nombre1">Jugador 1</h2>
      </div>
      <div id="jugador2">
        <h2 id="nombre2">Jugador 2</h2>
      </div>
      <div id="dados">
        <img id="dado0" src="/public/files/dadoa0.png">
        <img id="dado1" src="/public/files/dadoa1.png">
        <img id="dado2" src="/public/files/dadob0.png">
        <img id="dado3" src="/public/files/dadob1.png">
        <div id="dadosJuntos"></div>
      </div>
      <div id="mesa">
        <div id="tabla">
          <div class="casilla arriba">0</div>
          <div class="casilla cinco">1</div>
          <div class="casilla arriba">2</div>
          <div class="casilla estrella">3</div>
          <div class="casilla ojos">4</div>
          <div class="casilla estrella">5</div>
          <div id="finJugador1" class="casilla">F1</div>
          <div class="casilla cuatrocincos">6</div>
          <div id="finJugador2" class="casilla">F2</div>
          <div id="inicioJugador1" class="casilla">I1</div>
          <div class="casilla cinco">7</div>
          <div id="inicioJugador2" class="casilla">I2</div>
          <div class="casilla ojos">8</div>
          <div class="casilla estrella">9</div>
          <div class="casilla ojos">10</div>
          <div class="casilla cinco">11</div>
          <div class="casilla cuatrocincos">12</div>
          <div class="casilla cinco">13</div>
          <div class="casilla ojos">14</div>
          <div class="casilla cinco">15</div>
          <div class="casilla ojos">16</div>
          <div class="casilla estrella">17</div>
          <div class="casilla fondo">18</div>
          <div class="casilla estrella">19</div>
        </div>
      </div>
      <script src="/public/static/scripts/ur.js"></script>
    </body>
  </html>

  `;
  return raw;
}

module.exports = template;
