juegoUr = {};

juegoUr.init = function(){
    var nombre1 = prompt("por favor dame tu nombre usuario 1");
    var nombre2 = prompt("por favor dame tu nombre usuario 2");
    juegoUr.jugador1 = {nombre:nombre1, id:1};
    juegoUr.jugador2 = {nombre:nombre2, id:2};
    var tituloJugador1 = document.getElementById("nombre1");
    var tituloJugador2 = document.getElementById("nombre2");
    tituloJugador1.innerText = nombre1;
    tituloJugador2.innerText = nombre2;
    this.initJuego();
}

juegoUr.jugarDados = function(){
    var dado1 = Math.floor(Math.random()*2);
    var dado2 = Math.floor(Math.random()*2);
    var dado3 = Math.floor(Math.random()*2);
    var dado4 = Math.floor(Math.random()*2);
    var resultado = dado1+dado2+dado3+dado4;
}

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
    img.src=nombreArchivo;
  }
  if(step>0)setTimeout(function(){
    juegoUr.animarDados(step-1,tiempo,dados)
  },tiempo);
}

juegoUr.jugarDados = function(){
    var dados = [];
    var resultado = 0;
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
        img.src=nombreArchivo;
    }
    //this.animarDados(10,100,dados);
    this.dadosJuntos = resultado;
    var enHtml = document.getElementById("dadosJuntos");
    enHtml.innerText = resultado;
}

juegoUr.turno = function(){
    this.jugarDados(); //ahora se actualizó los dados y los puntos para el turno actual
    if(this.dadosJuntos===0){
        //alert("oh, un 0... perdiste tu turno");
        //this.terminaTurno(); //no hay más que hacer en un 0
        setTimeout("juegoUr.terminaTurno('oooh, un 0... perdiste tu turno')",2000);
        return;
    }
    //chequear si hay movimientos posibles. si no - termina turno
    let posible=false; //empezamos con false
    for(var x=0;x<this.jugadorActual.piezas.length;x++){
        let pieza = this.jugadorActual.piezas[x];
        let camino = this.jugadorActual.camino;
        let futuropos = pieza.posicion + this.dadosJuntos;
        if(futuropos>=camino.length)continue;
        /*if(futuropos===camino.length){
            posible=true; //si, es posible - esta en gol
            break; //no busca mas, una alcanza
        }*/
        if(camino[futuropos].puedeEntrar(pieza)){
            posible=true; //si, es posible
            break; //no busca mas, una alcanza
        }else if(camino[futuropos].estrella &&
                camino[futuropos].ocupante.jugador != this.jugadorActual &&
                camino[futuropos+1].puedeEntrar(pieza))posible=true
                ; //estrella:la proxima
    }
    if(posible===false){
        setTimeout("juegoUr.terminaTurno('ooooh... no hay movimientos posibles... perdiste tu turno '+juegoUr.jugadorActual.nombre);",2000);
    }
}

juegoUr.terminaTurno = function(texto){
    if(texto)alert(texto);
    //chequear si todos estan al fin:
    let terminaJuego = true; //esta vez empezamos en true
    for(var x=0;x<this.jugadorActual.piezas.length;x++){
        //buscamos por una pieza que todavia esta en juego
        let pieza = this.jugadorActual.piezas[x]; // la pieza que chequeamos este turno
        if(pieza.posicion < this.jugadorActual.camino.length-1){
            //si la posicion esta menor que el length del camino esta aldentro todavia
            terminaJuego = false; //no termina el Juego
            break; // no busca más, una pieza alcanza
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
}

juegoUr.terminaJuego = function(){
    alert(juegoUr.jugadorActual.nombre + " ganó el juego");
    let cualGano = juegoUr.jugadorActual;
    this.initJuego();
    if(cualGano===juegoUr.jugador1){
        juegoUr.terminaTurno();
    }
}


juegoUr.initJuego = function(){
    var dados = document.getElementById("dados");
    dados.classList.remove("jugador2");
    this.castillas = this.crearCastillas();
    this.allPiezas = this.crearPiezas();
    this.initJugadores();
    this.jugadorActual=this.jugador1;
    this.turno();
}

juegoUr.initJugadores = function(){
    this.jugador1.caminoEnNumeros = [8,11,14,17,18,15,12,9,7,6,4,1,0,3];
    this.jugador2.caminoEnNumeros = [10,13,16,19,18,15,12,9,7,6,4,1,2,5];
    this.jugador1.camino = [];    this.jugador2.camino = [];
    for(var x=0;x<this.jugador1.caminoEnNumeros.length;x++){
        let actNumeroJug1 = this.jugador1.caminoEnNumeros[x];
        let actNumeroJug2 = this.jugador2.caminoEnNumeros[x];
        this.jugador1.camino.push(this.castillas[actNumeroJug1]);
        this.jugador2.camino.push(this.castillas[actNumeroJug2]);
    }
    let golJugador1 = {
      html:document.getElementById("finJugador1"),
      gol:true,
      ocupante:null,
      puedeEntrar:function(piezaEntrando){return true;},
      entraPieza:function(piezaEntrando){
        juegoUr.muevePiezaHtml(piezaEntrando.html,this.html);
      },
    }
    let golJugador2 = {
      html:document.getElementById("finJugador2"),
      gol:true,
      ocupante:null,
      puedeEntrar:function(piezaEntrando){return true;},
      entraPieza:function(piezaEntrando){
        juegoUr.muevePiezaHtml(piezaEntrando.html,this.html);
      },
    }
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
        console.log("newleft:"+newleft);
        piezahtml.children[0].style.left = newleft;
        piezahtml.children[0].style.top = newtop;
    }
}

juegoUr.crearCastillas = function(){
    let castillas = [];
    let divs = document.getElementsByClassName("castilla");
    for(var x=0;x<20;x++){
        let castilla = {
            html:divs[x],
            nr:x,
            ocupante:null
        }
        if(x==3 || x==5 || x==9 || x==17 || x==19)castilla.estrella=true;
        else castilla.estrella=false;

        castilla.puedeEntrar = function(piezaEntrando){
            //castilla esta vacia, entonces si:
            if(this.ocupante===null)return true;
            //castilla ocupado del mismo jugador:
            if(this.ocupante.jugador === piezaEntrando.jugador)return false;
            //entonces ahora esta ocupado del otro
            //esta en estrella?:
            if(this.estrella === true)return false; //protegido de la estrella
            //no es vacia, ni es ocupado del mismo jugador, ni ocupado en estrella
            //lo unico que queda es si es ocupado del otro, entonces si, es posible :)
            return true;
        }
        castilla.entraPieza = function(piezaEntrando){
            //vamos a moverlo graficamente:
            //this.html.appendChild(piezaEntrando.html);
            juegoUr.muevePiezaHtml(piezaEntrando.html, this.html);
            if(this.ocupante!=null){
                //hay una pieza del otro jugador:
                this.ocupante.posicion = -1; //esta afuera ahora
                //muevelo graficamente:
                //this.ocupante.jugador.htmlInicio.appendChild(this.ocupante.html);
              juegoUr.muevePiezaHtml(this.ocupante.html, this.ocupante.jugador.htmlInicio);
            }
            this.ocupante = piezaEntrando;
        }
        castillas[x]=castilla;
    }
    return castillas;
}

juegoUr.muevePiezaHtml = function(pieza,target){
    target.appendChild(pieza);
    let img = pieza.children[0];
    img.style.position = "absolute";
    img.style.top = target.offsetTop+"px";
    img.style.left = target.offsetLeft+"px";
    img.style.transition = "all 1s";
    console.log("movio pieza a "+img.style.top+"/"+img.style.left);
}

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
            posicion:-1, //esta afuera todavia
            jugador:jugador,
            castilla:null,
            html: this.crearHtmlParaPieza(x, jugador)
        };
        jugador.piezas.push(pieza);
        juegoUr.piezas[x]=pieza;
        pieza.click = piezaClick;
    }
}

//todos funciones de pieza:
var piezaClick = function(){
    if(juegoUr.dadosJuntos===0)return; //si hay un zero un click no hace nada
    if(this.jugador!=juegoUr.jugadorActual)return; //no debes moverte afuera tu turno
    let pos = this.posicion;
    let futuroPos = pos + juegoUr.dadosJuntos;
    if(futuroPos>=this.jugador.camino.length)return; //no es posible moverse afuera

    //la castilla adonde quieremos mover:
    let futuroCastilla = this.jugador.camino[futuroPos];
    //pero si es una estrella y ocupada del otro intentamos la proxima:
    if(futuroCastilla.puedeEntrar(this)===false  && futuroCastilla.estrella===true
        && futuroCastilla.ocupante.jugador!=this.jugador){
        futuroPos++;
        futuroCastilla = this.jugador.camino[futuroPos];
    }
    if(futuroCastilla.puedeEntrar(this)===true){
        this.posicion = futuroPos;
        futuroCastilla.entraPieza(this);
        if(this.castilla!=null)this.castilla.ocupante=null; //liberamos la castilla que estamos ocupando
        this.castilla=futuroCastilla; //memorizamos la castilla en donde estamos
        //estamos listo por aqui.
        //si estamos en estrella ahora tenemos otro turno, si no cambia el turno:
        if(this.castilla.estrella === true){
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

juegoUr.crearHtmlParaPieza = function(numero, jugador){
    let pieza = document.createElement("button");
    pieza.classList.add("pieza");
    pieza.classList.add("piezaJugador"+jugador.id);
    pieza.id = "pieza"+numero;
    pieza.name = numero;
    let img = new Image();
    img.name=jugador.id;
    img.src="pieza5.png";
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
        juegoUr.muevePiezaHtml(tempPieza,this.parentElement.parentElement);

        let pieza = juegoUr.piezas[this.parentElement.name];
        let futuropos = pieza.posicion+juegoUr.dadosJuntos;
        let futuroCastilla = null;
        if(futuropos<pieza.jugador.camino.length)futuroCastilla = pieza.jugador.camino[futuropos];
        if(futuroCastilla===null || juegoUr.dadosJuntos===0 || !futuroCastilla.puedeEntrar(pieza))tempPieza.classList.add("noPuede");
        if(futuroCastilla){
            juegoUr.muevePiezaHtml(tempPieza,futuroCastilla.html);
        }
    }
    img.onmouseout = function(){
        let tempPieza = document.getElementById("tempPieza");
        if(tempPieza)tempPieza.parentElement.removeChild(tempPieza);
    }
    return pieza;
}
