juegoUr{
  jugador1{
    nombre:nombre1,
    id:1
  }
  jugador2{
    nombre:nombre2,
    id:2
  }
  init()
  initJuego(){
    casillas[
      casilla{
          html:divs[0],
          nr:0,
          ocupante:null,
          estrella:false,
          puedeEntrar(piezaEntrando),
          entraPieza(piezaEntrando)
      },
      casilla{
          html:divs[1],
          nr:1,
          ocupante:null,
          estrella:false
      },
      casilla{
          html:divs[2],
          nr:2,
          ocupante: {jugador: jugador1},
          estrella:false
      },
      casilla{
          html:divs[3],
          nr:3,
          ocupante:null,
          estrella:true
      }
      // y así hasta casilla 20
    ]
  }
crearcasillas()
muevePiezaHtml(piezaEntrando.html, casilla.html)
animarDados()



jugadorActual{
    nombre:nombre1,
    id:1
  }
piezaEntrando{
  jugador:
  html:
}
},
