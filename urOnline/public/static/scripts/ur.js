juegoUr = {};

juegoUr.init = function(){
    var tituloJugador1 = document.getElementById("nombre1");
    var tituloJugador2 = document.getElementById("nombre2");
    let nombre1 = tituloJugador1.innerText;
    let nombre2 = tituloJugador2.innerText;
    juegoUr.jugador1 = {nombre:nombre1, id:1};
    juegoUr.jugador2 = {nombre:nombre2, id:2};
    console.log("linea 14 ur.js - juegoUr es: ", juegoUr);
    this.initJuego();
},

juegoUr.initJuego = function(){
    console.log('linea 19 ur.js - inicia initJuego()');
    this.casillas = this.crearcasillas();
    this.crearPiezas();
    this.initJugadores();
    this.jugadorActual=this.jugador1;
    this.turno();
},

juegoUr.crearcasillas = function(){
    let casillas = [];
    let divs = document.getElementsByClassName("casilla");
    for(var x=0;x<24;x++){
        let casilla = {
            html:divs[x],
            nr:divs[x].innerText,
            ocupante:null
        }
        if(divs[x].innerText==3 || divs[x].innerText==5 || divs[x].innerText==9 || divs[x].innerText==17 || divs[x].innerText==19)casilla.estrella=true;
        else casilla.estrella=false;

        casilla.puedeEntrar = function(piezaEntrando){
            //casilla esta vacia, entonces si:
            if(this.ocupante===null)return true;
            //casilla ocupado del mismo jugador:
            if(this.ocupante.jugador === piezaEntrando.jugador)return false;
            // si llegó acá es porque está ocupada por otro jugador
            // está en casilla estrella?
            if(this.estrella === true)return false; //está protegido por estrella asi que no puede entrar
            //la única opción que queda es que esté ocupada por el otro jugador pero sin estrella, entonces sí puede entrar
            return true;
        }
        casilla.entraPieza = function(piezaEntrando){
            //vamos a mover la pieza gráficamente
            //this.html.appendChild(piezaEntrando.html);
            console.log('linea 64 ur.js - piezaEntrando.html es: ', piezaEntrando.html);
            console.log('linea 65 ur.js - casilla.html es: ', casilla.html);
            juegoUr.muevePiezaHtml(piezaEntrando.html, this.html);
            if(this.ocupante!=null){
                //hay una pieza del otro jugador:
                this.ocupante.posicion = -1; //la pieza del otro jugador ahora está afuera
                //lo movemos graficamente
                //this.ocupante.jugador.htmlInicio.appendChild(this.ocupante.html);
              juegoUr.muevePiezaHtml(this.ocupante.html, this.ocupante.jugador.htmlInicio);
            }
            this.ocupante = piezaEntrando;
        }
        casillas[x]=casilla;
    }
    return casillas;
},
// SEGUI ACA
juegoUr.animarDados = function(step, tiempo,dados){
  for(var x=0;x<dados.length;x++){
    var img = document.getElementById("dado"+x);
    var nombreArchivo="dado";
    if(step===0){
      if(dados[x]===1){
          nombreArchivo = nombreArchivo+"a";
      }else{
       nombreArchivo = nombreArchivo+"b";
      }
    }else{
      if(Math.floor(Math.random()*2)===1)nombreArchivo = nombreArchivo+"a";
      else nombreArchivo = nombreArchivo+"b";
    }

    nombreArchivo = nombreArchivo+Math.floor(Math.random()*3);
    nombreArchivo = nombreArchivo+".png";
    img.src="/public/files/"+nombreArchivo;
  }
  if(step>0)setTimeout(function(){
    juegoUr.animarDados(step-1,tiempo,dados)
  },tiempo);
},

juegoUr.jugarDados = function(){
    var dados = [];
    var resultado = 0;
    var imagenesDados = []
    for(var x=0;x<4;x++){
        dados[x] = Math.floor(Math.random()*2);
        resultado+=dados[x];
        var img = document.getElementById("dado"+x);
        var nombreArchivo="dado";
        if(dados[x]===1){
            nombreArchivo = nombreArchivo+"a";
        }else{
         nombreArchivo = nombreArchivo+"b";
        }
        nombreArchivo = nombreArchivo+Math.floor(Math.random()*3);
        nombreArchivo = nombreArchivo+".png";
        img.src="/public/files/"+nombreArchivo;
        imagenesDados[x]=img.src;
    }
    jugadorMandaMensajeAlServidor.revoloteaDado(dados, imagenesDados, resultado, this.jugadorActual.id);
    this.animarDados(10,50,dados);
    setTimeout(function(){
    var enHtml = document.getElementById("dadosJuntos");
    enHtml.innerText = resultado;
    enHtml.style.display="grid";},1000);
    this.dadosJuntos = resultado;
},

juegoUr.turno = function(){
  const esperaTurno = document.getElementById("esperaTurno");
  esperaTurno.style.display = "none";
  var activarElementos = document.querySelectorAll('button');
  for (var i = 0; i < activarElementos.length; i++) {
    activarElementos[i].disabled = false;
  }
  let dadosViejos = document.getElementById("dadosJuntos");
  dadosViejos.style.display="none";
  let dados = document.getElementById("dados");
  if(this.jugadorActual===this.jugador1){
      dados.style.gridArea="dados1";
  }else{
      dados.style.gridArea="dados2";
  }
  const miNombre = document.getElementById("nombre");
  const yoJugador=miNombre.value;
  console.log('linea 131 ur.js ', yoJugador);
    console.log('linea 132 ur.js ', this.jugadorActual.nombre);
  if (this.jugadorActual.nombre===yoJugador) {
    console.log("turno y jugador son iguales");
    dados.style.display="grid";
    this.jugarDados(); //ahora se actualizó los dados y los puntos para el turno actual
    if(this.dadosJuntos===0){
        //alert("oh, un 0... perdiste tu turno");
        //this.terminaTurno(); //no hay más que hacer en un 0
        setTimeout("juegoUr.terminaTurno('oooh, un 0... perdiste tu turno')",2000);
        jugadorMandaMensajeAlServidor.cartelAlertPerdioTurnoPor0(this.jugadorActual.id, this.jugadorActual.nombre);
        return;
    }
    //chequear si hay movimientos posibles. sino termina turno
    let posible=false; //empezamos con false, no hay movimientos
    for(var x=0;x<this.jugadorActual.piezas.length;x++){
        let pieza = this.jugadorActual.piezas[x];
        let camino = this.jugadorActual.camino;
        let futuropos = pieza.posicion + this.dadosJuntos;
        console.log("linea 144 ur.js - pieza.posicion es: ", pieza.posicion);
        console.log("linea 145 ur.js - futuropos es: ", futuropos);
        if(futuropos>=camino.length)continue;//si no puede moverse esa pieza,
        //continue indica que termine ese ciclo y siga con el siguiente ciclo
        //del loop para checkear el resto de piezas
        /*if(futuropos===camino.length){
            posible=true; //si, es posible - esta en gol
            break; //no busca mas, una alcanza
        }*/
        if(camino[futuropos].puedeEntrar(pieza)){
            posible=true; //si, es posible
            console.log("linea 165 ur.js - camino[futuropos] es: ", camino[futuropos]);
            break; //no busca mas, una alcanza
        }else if(camino[futuropos].estrella &&
                camino[futuropos].ocupante.jugador != this.jugadorActual &&
                camino[futuropos+1].puedeEntrar(pieza))posible=true
                ; //estrella:salta a la siguiente casilla
    }
    if(posible===false){
        setTimeout("juegoUr.terminaTurno('ooooh... no hay movimientos posibles... perdiste tu turno '+juegoUr.jugadorActual.nombre);",800);
        jugadorMandaMensajeAlServidor.cartelAlertPerdioTurnoPorNoMovimiento(this.jugadorActual.id, this.jugadorActual.nombre);
    }
  }else {
    console.log("turno y jugador son diferentes");
    esperaTurno.style.display = "block";
      // Deshabilitar todos los elementos button (las piezas) en la página
   var bloquearElementos = document.querySelectorAll('button');
   for (var i = 0; i < bloquearElementos.length; i++) {
     bloquearElementos[i].disabled = true;
   }
  }
},

juegoUr.juegaDadosElOtro = function(data){
    let dados = document.getElementById("dados");
    dados.style.display="grid";
    var dadosJugados = data.dados;
    var resultado = data.resultado;
    for(var x=0;x<4;x++){
        var img = document.getElementById("dado"+x);
        img.src=data.imagenesDados[x];
    }
    this.animarDados(10,50,dadosJugados);
    setTimeout(function(){
    var enHtml = document.getElementById("dadosJuntos");
    enHtml.innerText = data.resultado;
    enHtml.style.display="grid";},1000);
    this.dadosJuntos = data.resultado;
},

juegoUr.cartelPierdeTurnoPor0Ws = function(data){
    setTimeout("juegoUr.terminaTurno(data.nombre +' sacó un 0... pierde el turno')",2000);
    return;
}

juegoUr.cartelPierdeTurnoPorNoMovimientoWs = function(data){
    console.log('linea 212 index - nombre del jugador que no tiene movimientos: ', nombre);
    setTimeout("juegoUr.terminaTurno(data.nombre +' no tiene movimientos posibles... pierde el turno')",2000);
    return;
}

juegoUr.terminaTurno = function(texto){
    if(texto)alert(texto);
    //chequear si todos estan al fin:
    let terminaJuego = true; //esta vez empezamos en true
    for(var x=0;x<this.jugadorActual.piezas.length;x++){
        //buscamos si todavia hay piezas en juego
        let pieza = this.jugadorActual.piezas[x]; // la pieza que chequeamos este turno
        if(pieza.posicion < this.jugadorActual.camino.length-1){
            //si la posicion es menor que el length del camino la pieza está en juego todavia
            terminaJuego = false; //no termina el Juego
            break; // no busca más, con una pieza en juego alcanza
        }
    }
    if(terminaJuego===true){ //no encontramos ninguna pieza en el camino
        this.terminaJuego(); //llama la funcion para terminar el juego
        return; //no hagas nada mas
    }
    if(this.jugadorActual===this.jugador1){
        this.jugadorActual = this.jugador2;
    }else{
        this.jugadorActual=this.jugador1;
    }
    this.turno();
    var dados = document.getElementById("dados");
    dados.classList.toggle("jugador2", this.jugadorActual.id===2);
},

juegoUr.terminaJuego = function(){
    alert("¡Felicidades " + juegoUr.jugadorActual.nombre + ", has ganado el juego!");
    jugadorMandaMensajeAlServidor.cartelTerminaJuego(this.jugadorActual.id, this.jugadorActual.nombre);
    juegoUr.desconectarseOJugarDeNuevo();
},

juegoUr.terminaJuegoWs = function(data){
    alert("¡" + data.nombre + " ganó el juego!");
    juegoUr.desconectarseOJugarDeNuevo();
},

juegoUr.desconectarseOJugarDeNuevo=function(data){
  var desconectarse = document.getElementById("desconectarse");
  var jugarDeNuevo = document.getElementById("jugarDeNuevo");
  var reiniciarPartido = document.getElementById("reiniciarPartido");
  var telon = document.getElementById("telon");
  var mesa = document.getElementById("mesa");
  var dados = document.getElementById("dados");
  telon.style.display = "block";
  jugarDeNuevo.style.display = "none";
  mesa.style.opacity = "0.5";
  dados.style.opacity = "0.5";
  telon.style.opacity = "0.7";
  desconectarse.style.display = "block";
  reiniciarPartido.style.display = "block";
  desconectarse.style.zIndex = '7';
  reiniciarPartido.style.zIndex = '7';
  esperaTurno.style.display = "none";
  desconectarse.disabled = false;
  reiniciarPartido.disabled = false;
  return;
}

juegoUr.meDesconecto = function(){
  let miId = document.getElementById("idJugador");
  jugadorMandaMensajeAlServidor.desconeccion(miId);
}

juegoUr.jugarDeNuevo = function(){
  const miNombre = document.getElementById("nombre");
  if (juegoUr.jugador1.nombre===miNombre.value) {
    jugadorMandaMensajeAlServidor.nuevoJuego(juegoUr.jugador1.nombre);
  } else {
    jugadorMandaMensajeAlServidor.nuevoJuego(juegoUr.jugador2.nombre);
  }
    var jugarDeNuevo = document.getElementById("jugarDeNuevo");
    var telon = document.getElementById("telon");
    telon.style.display = "block";
    telon.style.opacity = "1";
    nombre.style.display = "none";
    espera.style.display = "block";
    jugarDeNuevo.style.display = "none";
    nombreIncorrecto.style.display = "none";
}

juegoUr.reiniciarPartido=function(){

}

juegoUr.meDesconectoWs=function(data){
  alert(data.nombre + " se ha desconectado");
  juegoUr.desconectarseOJugarDeNuevo();
  return;
}

juegoUr.jugarDeNuevoWs=function(data){
  alert(data.nombre + " quiere jugar de nuevo");
  juegoUr.desconectarseOJugarDeNuevo();
  return;
}

juegoUr.initJugadores = function(){
    this.jugador1.caminoEnNumeros = [12,15,18,21,22,19,16,13,10,7,4,1,0,3];
    this.jugador2.caminoEnNumeros = [14,17,20,23,22,19,16,13,10,7,4,1,2,5];
    this.jugador1.camino = [];
    this.jugador2.camino = [];

    for(var x=0;x<this.jugador1.caminoEnNumeros.length;x++){
        let actNumeroJug1 = this.jugador1.caminoEnNumeros[x];
        let actNumeroJug2 = this.jugador2.caminoEnNumeros[x];
        this.jugador1.camino.push(this.casillas[actNumeroJug1]);
        this.jugador2.camino.push(this.casillas[actNumeroJug2]);
    }
    let golJugador1 = {
      html:document.getElementById("finJugador1"),
      gol:true,
      ocupante:null,
      puedeEntrar:function(piezaEntrando){return true;},
      entraPieza:function(piezaEntrando){
        juegoUr.muevePiezaHtml(piezaEntrando.html,this.html);
      },
    };
    let golJugador2 = {
      html:document.getElementById("finJugador2"),
      gol:true,
      ocupante:null,
      puedeEntrar:function(piezaEntrando){return true;},
      entraPieza:function(piezaEntrando){
        juegoUr.muevePiezaHtml(piezaEntrando.html,this.html);
      },
    };
    this.jugador1.camino.push(golJugador1);
    this.jugador2.camino.push(golJugador2);
    this.jugador1.htmlInicio = document.getElementById("inicioJugador1");
    this.jugador2.htmlInicio = document.getElementById("inicioJugador2");
    //this.jugador1.htmlFin = document.getElementById("finJugador1");
    //this.jugador2.htmlFin = document.getElementById("finJugador2");
    for(var x=0;x<this.piezas.length;x++){
        //this.piezas[x].jugador.htmlInicio.appendChild(this.piezas[x].html)
        let piezahtml = this.piezas[x].html;
        let target = this.piezas[x].jugador.htmlInicio;
        juegoUr.muevePiezaHtml(piezahtml,target);
        let newleft = (target.offsetLeft-10 - Math.floor(Math.random()*50)+50)+"px";
        let newtop = (target.offsetTop-10 + Math.floor(Math.random()*20)+10)+"px";
        piezahtml.children[0].style.left = newleft;
        piezahtml.children[0].style.top = newtop;
    }
},

juegoUr.muevePiezaHtml = function(pieza,target){
  console.log('linea 253 ur.js - pieza es: ', pieza);
    target.appendChild(pieza);
    let img = pieza.children[0];
    console.log('linea 256 ur.js - target es: ', target);
    img.style.position = "absolute";
    img.style.top = target.offsetTop+"px";
    img.style.left = target.offsetLeft+"px";
    img.style.transition = "all 1s";
},

juegoUr.crearPiezas = function(){
    let oldpiezas = document.getElementsByClassName("pieza");
    while(oldpiezas.length>0)oldpiezas[0].parentElement.removeChild(oldpiezas[0]);

    let maximoPiezasPerJugador = 3;
    juegoUr.jugador1.piezas = [];
    juegoUr.jugador2.piezas = [];
    juegoUr.piezas = [];
    for(var x=0;x<maximoPiezasPerJugador*2;x++){
        let jugador = juegoUr.jugador1;
        if(x>=maximoPiezasPerJugador)jugador = juegoUr.jugador2;
        let pieza = {
            posicion:-1, //empieza fuera del tablero
            jugador:jugador,
            casilla:null,
            id:x,
            html: this.crearHtmlParaPieza(x, jugador)
        };
        jugador.piezas.push(pieza);
        juegoUr.piezas[x]=pieza;
        pieza.click = piezaClick;//piezaClick es una variable global que en si mismo es una funcion
    }
};



//todos funciones de las piezas:
var piezaClick = function(){
    console.log('linea 380 - activo jugadorMandaMensajeAlServidor.moverPieza()');
    jugadorMandaMensajeAlServidor.moverPieza(juegoUr.dadosJuntos, juegoUr.jugadorActual.id, this.id);
    juegoUr.piezaClickeada(this);
  }

juegoUr.piezaClickeada = function(data){
  console.log('linea 385 - activo piezaClickeada(this) y data es: ', data);
    if(juegoUr.dadosJuntos===0)return; //si hay un 0 un click no hace nada
    if(data.jugador!=juegoUr.jugadorActual)return; //no te mueves si no es tu turno
    let pos = data.posicion;
    let futuroPos = pos + juegoUr.dadosJuntos;
    if(futuroPos>=data.jugador.camino.length)return; //no se puede mover fuera del camino, hay que llegar justo al final

    //la casilla a donde queremos mover:
    let futurocasilla = data.jugador.camino[futuroPos];
    //pero si es una estrella y ocupada por otro, movemos a la siguiente
    if(futurocasilla.puedeEntrar(data)===false  && futurocasilla.estrella===true
        && futurocasilla.ocupante.jugador!=data.jugador){
        futuroPos++;
        futurocasilla = data.jugador.camino[futuroPos];
    }
    if(futurocasilla.puedeEntrar(data)===true){
        data.posicion = futuroPos;
        futurocasilla.entraPieza(data);
        if(data.casilla!=null)data.casilla.ocupante=null; //liberamos la casilla que estábamos ocupando
        data.casilla=futurocasilla; //memorizamos la casilla donde estábamos
        //estamos listo por aqui.
        //si estamos en estrella ahora tenemos otro turno, sino termina el turno:
        if(data.casilla.estrella === true){
            setTimeout(function(){
                alert("buenisimo! tienes otro turno "+juegoUr.jugadorActual.nombre);
                juegoUr.turno();
            },1000);
        }else{
            //termina el turno
            juegoUr.terminaTurno();
        }
    }
};

juegoUr.piezaClickWs = function(data){
  let piezaAmover=null;
  console.log('juegoUr.piezas es: ',juegoUr.piezas);
  for (let i = 0; i < juegoUr.piezas.length; i++) {
    console.log('juegoUr.piezas[i].id es: ', juegoUr.piezas[i].id);
    if (juegoUr.piezas[i].id===data.idPieza) {
    console.log('linea 419 - juegoUr.piezas[i] es:', juegoUr.piezas[i]);
      piezaAmover=juegoUr.piezas[i];
      console.log('linea 427 - piezaAmover es: ', piezaAmover);
      break;
    }
  };
  console.log('piezaAmover es: ', piezaAmover);
    juegoUr.dadosJuntos = data.resultado;
    if(data.turno===1){
        this.jugadorActual = this.jugador1;
    }else{
        this.jugadorActual=this.jugador2;
    }
    juegoUr.piezaClickeada(piezaAmover);
};

juegoUr.crearHtmlParaPieza = function(numero, jugador){
    let pieza = document.createElement("button");
    pieza.classList.add("pieza");
    pieza.classList.add("piezaJugador"+jugador.id);
    pieza.id = "pieza"+numero;
    pieza.name = numero;
    let img = new Image();
    img.name=jugador.id;
    img.src="/public/files/pieza5.png";
    pieza.appendChild(img);

    pieza.onclick = function(){
        juegoUr.piezas[this.name].click();
    };
    img.onmouseenter = function(){
        if(this.name!=juegoUr.jugadorActual.id)return;
        let tempPieza = document.createElement("div");
        tempPieza.id="tempPieza";
        tempPieza.className = this.parentElement.className;
        let tempimg = new Image();
        tempimg.src = this.src;
        tempPieza.appendChild(tempimg);
        // juegoUr.muevePiezaHtml(tempPieza,this.parentElement.parentElement);

        let pieza = juegoUr.piezas[this.parentElement.name];
        let futuropos = pieza.posicion+juegoUr.dadosJuntos;
        let futurocasilla = null;
        if(futuropos<pieza.jugador.camino.length)futurocasilla = pieza.jugador.camino[futuropos];
        if(futurocasilla===null || juegoUr.dadosJuntos===0 || !futurocasilla.puedeEntrar(pieza))tempPieza.classList.add("noPuede");
        if(futurocasilla){
            juegoUr.muevePiezaHtml(tempPieza,futurocasilla.html);
        }
    }
    img.onmouseout = function(){
        let tempPieza = document.getElementById("tempPieza");
        if(tempPieza){
          tempPieza.style.display='none';
          tempPieza.parentElement.removeChild(tempPieza);
        }
    }
    return pieza;
};
