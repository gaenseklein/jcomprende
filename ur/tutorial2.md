# Vamos a continuar.

el ur.js debe aparecer ahora asi:
```
juegoUr = {};

juegoUr.init = function(){
    var nombre1 = prompt("por favor dame tu nombre usuario 1");
    var nombre2 = prompt("por favor dame tu nombre usuario 2");
    juegoUr.jugador1 = {nombre:nombre1};
    juegoUr.jugador2 = {nombre:nombre2};
    var tituloJugador1 = document.getElementById("nombre1");
    var tituloJugador2 = document.getElementById("nombre2");
    tituloJugador1.innerText = nombre1;
    tituloJugador2.innerText = nombre2;
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
    this.dadosJuntos = resultado;
    var enHtml = document.getElementById("dadosJuntos");
    enHtml.innerText = resultado;
}

juegoUr.turno = function(){
    this.jugarDados(); //ahora se actualizó los dados y los puntos para el turno actual
    if(this.dadosJuntos===0){
        alert("oh, un 0... perdiste tu turno");
        this.terminaTurno(); //no hay más que hacer en un 0
        return;
    }
}

juegoUr.terminaTurno = function(){
    if(this.jugadorActual===1){
        this.jugadorActual = 2;
    }else{
        this.jugadorActual=1;
    }
    this.turno();
    var dados = document.getElementById("dados");
    dados.classList.toggle("jugador2");
}
```

---

## ahora vamos serio

empezamos a escribir ahora mucho. vamos paso a paso, pero sube el nivel.

lo que nesecitamos para continuar sea una construcción en javascript del juego.
vamos a ver que tiene:
1. tiene castillas a donde piezas pueden irse
2. tiene piezas de los jugadores que pueden moverse a castillas
3. tiene inicio y gol de cada jugador
4. cada jugador tiene su camino propio como irse desde inicio hasta el gol

asi empezamos. como los dados se juegan automaticamente cuando es cambio del turno veamos que la única interacción del jugador humano sea en las piezas.
asi eligimos una estrategia que el jugador "mueve las piezas".

vamos a empezar con las castillas. para crearles escribimos una función propia:

```
juegoUr.crearCastillas = function(){
  let castillas = [];
  let divs = document.getElementsByClassName("castilla");
  for(var x=0;x<20;x++){
      let castilla = {
          html:divs[x],
          nr:x,
          ocupante:null
      }
      castillas[x]=castilla;
  }
  return castillas;
}
```

creamos una lista *castillas* en que guardamos todas castillas que creamos.
en la variable *divs* nos colectamos todos elementos del html para conectarles con la castilla en el javascript. al final lo volvemos la lista resultada con todos castillas al llamador de la funcion

en un for-to-loop creamos 19 castillas y pongamos a este lista.
cada castilla es un objeto que definimos como *castilla* y ese objeto tiene:
1. html: el elemento del html por ese castilla
2. nr: el numero propio de la castilla
3. ocupante: un espacio a donde podemos añadir piezas - si es null no contiene pieza

bueno, eso no alcanza, hay que ver si es estrella o no. entramos eso:

```
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

      castillas[x]=castilla;
  }

  return castillas;
}
```

ahora guardamos tambien en la variable estrella de cada castilla si es una estrella (true) o no (false). eso puede ser muy util mas tarde.


bueno, alcanza por ahora vamos a volver a las castillas mas tarde.
vamos a crear piezas:

```
juegoUr.crearPiezas = function(){
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
            castilla:null
            html: this.crearHtmlParaPieza(x, jugador)
        };
        pieza.click = function(){
          alert("hola, yo soy de " + this.jugador.nombre);
        };
        jugador.piezas.push(pieza);
        juegoUr.piezas[x]=pieza;
    }
}
```

aqui usamos trucos como antes, para no escribir cada pieza por mano.
asi empezamos con el numero maximo de piezas para cada jugador.
despues construimos tres listas (array): dos listas para contener las piezas de cada jugador que pasamos a este jugador (juegoUr.jugador1.piezas y juegoUr.jugador2.piezas) y una lista para contener todas piezas que hay. (juegoUr.piezas)

despues hacemos un for-to loop por doble veces que hay piezas por jugador para crear todas piezas.
en las primeras lineas chequeamos y guardamos para que jugador debe ser: si es mas grande que la maxima cantidad por jugador sea jugador2, si no jugador1.
cada pieza construimos con
1. posicion: un numero para saber en cual posicion de su camino esta. empezamos con -1, porque esta afuera de su camino todavia
2. jugador: el elemento jugador para saber de quien es esa pieza, castilla
3. castilla: la castilla en que esta la pieza, empieza con null
4. html: el elemento html de la pieza. no existe todavia, lo creamos con una llamada a "this.crearHtmlParaPieza" - una funcion que tenemos que escribir todavia y a que vamos a pasar las informaciones necesarias el numero y el jugador.
5. click: una funcion que quieremos llamar cuando un usuario hace un click a la pieza.

despues lo añadimos con un push la pieza a la lista del jugador y al juego, para llenar las listas que definimos antes.

continuamos con el crearHtmlParaPieza, porque sin eso no se ve piezas en el navegador:

```
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
    return pieza;
}
```
ahi generamos con document.createElement un elemento html de tipo "button".
cada pieza se obtiene una clase pieza.
despues obtiene una clase depende cual jugador es: ("piezaJugador1" o "piezaJugador2")
le damos un id para poder identificarlo mas facil y en name le damos el numero tambien para guardar cual de los piezas en la lista de todas piezas lo es.
lo ponemos un img tambien, para tener un bien grafico.
despues lo definimos *onclick* - una funcion especial del elemento html, que reacciona cuando el usuario hace un click al boton.
en esa funcion tenemos accesso por "this" al elemento mismo y lo usamos para llamar la funcion click de la pieza aldentro de la lista *juegoUr.piezas* (que contiene todas piezas). asi conectamos el click del usuario a nuestro javascript.
finalmente lo volvemos al llamador de la funcion con el *return pieza*.


---

## continuamos construir un camino

ahora tenemos piezas y castillas, faltan los caminos de cada jugador. como son cosas que se inicia una vez cuando empieza un juego lo pongamos en una función para que lo podemos reutilizar cada vez cuando empezamos con un juego nuevo.

veamos a la mapa del juego:
![](Rules_of_Royal_Game_of_Ur.jpg)

entonces hay dos caminos.
cada castilla tiene su numero, lo que falta ser recordarse de que numero se va a cual. son dos caminos, porque cada jugador tiene un camino diferente.  

asi lo llamamos *initJugadores* y aldentro construimos el camino:

```
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
}
```

Que pasa aqui?
primero definimos una lista para cada uno de los jugadores en que guardamos el camino como de numeros.
esa llamamos caminoEnNumeros - de jugador1 y de jugador2.
jugador1 tiene ahora en una lista en orden los numeros (que usamos como nombres) de cada castilla correspondiente a la mapa.
despues, para tener un accesso más rapido y facil, construimos de esta lista la lista del camino de verdad, en donde lo pongamos los objetos de castillas en una lista en orden del camino. como es siempre lo mismo para jugador 1 como para jugador 2 lo hacemos en un for-to-loop solo:
primero construimos dos listas nuevas - por cada jugador una nueva lista que llamamos *camino*.
esas listas estan vacias. en el for-to-loop lo llenamos con las castillas correspondientes.  primero buscamos el numero actual desde la lista *caminoEnNumeros* y con ese numero lo hacemos un *push()* a la lista *camino*.
el *push* es una función de listas muy útil - se añade lo que quieres al fin de la lista - en nuestro caso un objeto que esta guardado en otra lista.  
como son objetos se pueden existir en diferentes listas - es decir castilla #18 de verdad esta en las tres listas. no es similar, es el mismo objeto.
se puede tener accesso a este castilla por juegoUr.castillas[18] o ahora tambien por juegoUr.jugador1.camino[4] o por juegoUr.jugador2.camino[4] - es siempre este castilla con numero 18.

entendido?
bueno, al final tenemos una lista *camino* de cada jugador en que podemos saber cual sea la proxima castilla.
buenisimo. casi estamos listo.

lo que falta sean las piezas y inico y goles.
primero vamos con las piezas y inicio, el gol cumplimos más tarde cuando sabemos como van a interactuar piezas y castillas.
asi para ver algo enlargeamos initJugadores:

```
juegoUr.initJugadores = function(){
    this.jugador1.caminoEnNumeros = [8,11,14,17,18,15,12,9,7,6,4,1,0,3];
    this.jugador2.caminoEnNumeros = [10,13,16,19,18,15,12,9,7,6,4,1,2,5];
    this.jugador1.camino = [];    this.jugador2.camino = [];
    for(var x=0; x<this.jugador1.caminoEnNumeros.length; x++){
        let actNumeroJug1 = this.jugador1.caminoEnNumeros[x];
        let actNumeroJug2 = this.jugador2.caminoEnNumeros[x];
        this.jugador1.camino.push(this.castillas[actNumeroJug1]);
        this.jugador2.camino.push(this.castillas[actNumeroJug2]);
    }
  this.jugador1.htmlInicio = document.getElementById("inicioJugador1");
  this.jugador2.htmlInicio = document.getElementById("inicioJugador2");
  for(var x=0;x<this.piezas.length;x++){
      this.piezas[x].jugador.htmlInicio.appendChild(this.piezas[x].html)
  }
}
```

primero guardamos en la variable htmlInicio de cada jugador el elemento html del inicio correspondiente.
en un for-to-loop por todas piezas (la lista *juegoUr.piezas*)   
digamos que el elemento html de cada pieza debe ser niño (child en ingles) del elemento de inicio, es decir estar aldentro del nodo html de inicio. la función para hacer eso se llama *appendChild*.
lo bueno de eso es que en html un elemento no puede ser hijo de dos elementos al mismo momento - asi se cambia y va por alli. eso es justo lo que quieremos hacer.
asi al inicio cada tres piezas del jugador se acumulan en el parte inicial del jugador.


quieremos ver algo, asi vamos a escribir tambien una función initJuego - eso sea la función que llamamos para iniciar un nuevo partido que cumple en llamar todos demas de lo que hemos escrito arriba:

```
juegoUr.initJuego = function(){
    this.castillas = this.crearCastillas();
    this.crearPiezas();
    this.initJugadores();
    this.jugadorActual=this.jugador1;
    this.turno();
}
```

primero creamos las castillas, despues las piezas, inicializamos los jugadores, digamos que el jugadorActual sea jugador1 y empezamos el juego con llamar a *turno()*.

casi listo. falta llamar a esa funcion al inicio para empieza el juego cuando esta listo. asi pongamos una linea más como ultima linea a la funcion **juegoUr.init**:

```
  this.initJuego();
```

guardar todo y abrirlo en firefox o chromium. ve todo bien? puedes hacer un click a la pieza?
buenisimo. asi lograste otro gran parte del tutorial.
vamos mas profundo todavia en lo proximo.

---

## interacción de piezas y castillas

el control principal del juego sea que los usuarios hagan un click a una pieza. para ser mas ordenado lo pongamos en una variable/funcion afuera:

```
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
```

recuerda: esa funcion lo añadimos al objeto "pieza" de cada jugador - el "this" entonces es este objeto especifico con todos sus valores.
primero chequeamos si el usuario puede mover una pieza - como si ha dado "0" no
se debe mover ninguna pieza. asi la funcion aborta con un "return"
lo mismo si no es tu turno. asi establecemos que se puede hacer solo un click valido a sus propios dados en su turno y no a los del otro:

```
if(juegoUr.dadosJuntos===0)return; //si hay un zero un click no hace nada
if(this.jugador!=juegoUr.jugadorActual)return; //no debes moverte afuera tu turno
```

despues guardamos la posicion actual en una variable temporal "pos" y la posicion a donde quiere moverse la pieza "futuroPos". lo usamos para chequear algunas cosas en una forma mejor leible y mas comodo de escribir como siempre usar "this.posicion"

```
let pos = this.posicion;
let futuroPos = pos + juegoUr.dadosJuntos;
```

chequeamos si futuroPos esta afuera del camino. porque si sea asi - no hay que hacer nada porque para llegar al fin las reglas dicen que debes llegar justo:
```
if(futuroPos>=this.jugador.camino.length)return; //no es posible moverse afuera
```


guardamos la castilla adonde quieremos mover - como arriba mas que nada para ser mas comodo en escribir y leer el codigo. pero hay una regla que dice si la castilla es una estrella y ocupado del enemigo nos movemos una posicion mas. lo chequeamos para eso y si sea asi futuroCastilla se mueve por una posicion mas:

```
//la castilla adonde quieremos mover:
let futuroCastilla = this.jugador.camino[futuroPos];
//pero si es una estrella y ocupada del otro intentamos la proxima:
if(futuroCastilla.puedeEntrar(this)===false  && futuroCastilla.estrella===true
    && futuroCastilla.ocupante.jugador!=this.jugador){
    futuroPos++;
    futuroCastilla = this.jugador.camino[futuroPos];
}
```

ahora chequeamos a la castilla si se puede entrar y solo si se puede finalmente movemos la pieza a este castilla:
```
if(futuroCastilla.puedeEntrar(this)===true){
    this.posicion = futuroPos;
    futuroCastilla.entraPieza(this);
    if(this.castilla!=null)this.castilla.ocupante=null; //liberamos la castilla que estamos ocupando
    this.castilla=futuroCastilla; //memorizamos la castilla en donde estamos
    //estamos listo por aqui.
    //...    
}
```

finalmente chequeamos si la pieza se movió a una castilla con estrella - y si es asi le damos un mensaje al jugador que ganó otro turno y empezamos el turno. pero todo eso lo hacemos en una funcion que se llama "**setTimeout**":
```
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
```

la funcion **setTimeout** es una funcion especial de javascript para delantar ejecuciones. se toma dos parametros: una funcion que dice que debe ejecutar despues una pausa y un numero que dice cuanto tiempo tiene que esperar en milisegundos. 1000 sea un segundo entonces

---

avanzando mucho.

ya estamos con la funcion. lo añadimos a cada pieza en que cambiamos en juegoUr.crearPieza el parte donde se dice pieza.click = ... y lo cambiamos a una linea en que pongamos a pieza.click solo el nombre de la variable global piezaClick (que en su mismo es una funcion)
```
//viejo:
pieza.click = function(){
  alert("hola, yo soy de " + this.jugador.nombre);
};
//nuevo:
pieza.click = piezaClick;
```

si lo intentas en el navegador te produce un error porque llamamos a la funcion "***puedeEntrar***" - que usamos para ver si la castilla esta ocupada o no. como es parte de cada castilla lo pongamos en la funcion crearCastillas, en el momento de crear cada castilla. y lo mismo para la funcion que cumple en el momento de entrar una pieza a una castilla que llamamos "***entraPieza***".
```
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
            this.html.appendChild(piezaEntrando.html);
            if(this.ocupante!=null){
                //hay una pieza del otro jugador:
                this.ocupante.posicion = -1; //esta afuera ahora
                //muevelo graficamente:
                this.ocupante.jugador.htmlInicio.appendChild(this.ocupante.html);
            }
            this.ocupante = piezaEntrando;
        }
        castillas[x]=castilla;
    }
    return castillas;
}
```

la funcion ***puedeEntrar*** es simple:
- pregunta si tiene ocupante (si no tiene, la pieza puede entrar )
- pregunta si la pieza que ya hay es del mismo jugador (si es asi no se puede entrar)
- pregunta si la castilla es una estrella (si es asi no se puede entrar)

cada vez que una pregunta esta en si se aborte la funcion y responde true o false. es decir si llega al fin ni una pregunta se respondio en si y lo unico que puede ser ahora sea que si la castilla tiene ya una pieza del otro jugador y no esta en estrella. asi si, se puede entrar.

la funcion ***entraPieza*** espera una pieza que va a entrar a la castilla.
con "this.html.appendChild" añadimos el elemento html de la pieza por aldentro del elemento html (o nudo del DOM) de la castilla. usamos un truco del DOM, que dice, que un elemento solo puede tener un elemento padre (aunque puede tener muchos hijos).
asi el elemento no se copia pero se mueve por aldentro de la castilla. tan simple podemos mover elementos html en la pagina.

despues preguntamos si hay un ocupante en la castilla - si es asi movemos este pieza a su posicion de inicio. finalmente guardamos en la variable "ocupante" la pieza que entró ahora a la castilla y listo.

faltan dos cosas mas:
- terminar el turno/juego
- inicialisar los goles de cada jugador

primero los goles. vamos a la funcion ***initJugadores***:
```
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
        this.html.appendChild(piezaEntrando)
      },
    }
    let golJugador2 = {
      html:document.getElementById("finJugador2"),
      gol:true,
      ocupante:null,
      puedeEntrar:function(piezaEntrando){return true;},
      entraPieza:function(piezaEntrando){
        this.html.appendChild(piezaEntrando)
      },
    }
    this.jugador1.camino.push(golJugador1);
    this.jugador2.camino.push(golJugador2);
    this.jugador1.htmlInicio = document.getElementById("inicioJugador1");
    this.jugador2.htmlInicio = document.getElementById("inicioJugador2");
    for(var x=0;x<this.piezas.length;x++){
        this.piezas[x].jugador.htmlInicio.appendChild(this.piezas[x].html)
    }
}
```

como lo sabemos ahora que el "gol" sea como una castilla y ultimo parte del camino lo creamos muy similar. pero esta vez de mano porque hay unas diferencias del gol a una castilla: la funcion **puedeEntrar** y la funcion **entraPieza** son mucho mas simples.
porque siempre se puede entrar al fin (no importa cuantos ocupantes ya tiene) no chequeamos nada pero respondemos siempre *true*.
y lo mismo para *entraPieza* en que solo se mueve la pieza al gol y listo.
asi creamos objetos de mano y lo pongamos con un "push" al fin de cada camino.
finalmente

---

finalmente el fin del turno:

```
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
```

primero lo añadimos un parametro para que podemos dar un texto en caso si queremos.
si hay texto se hace un alert.

despues chequeamos si el juego se termina. para verlo lo empezamos un boolean en *true* y chequeamos en un loop por todas las piezas si una pieza todavia esta en camino. si es asi cambiamos el boolean a false y usamos **break** para salir del loop.

si el boolean esta en true hay que terminar el juego - que hacemos en llamar una funcion terminaJuego del juegoUr (que hay que escribir todavia) y abortamos la funcion con un **return**
si no continua como lo hicimos antes.

la funcion **terminaJuego** es simple:

```
juegoUr.terminaJuego = function(){
    alert(juegoUr.jugadorActual.nombre + " ganó el juego");
    let cualGano = juegoUr.jugadorActual;
    this.initJuego();
    if(cualGano===juegoUr.jugador1){
        juegoUr.terminaTurno();
    }
}
```

le damos felicitaciones al jugador y empezamos un nuevo juego. chequeamos tb quien gano para empezar con el otro jugador.

listo? casi...
hay algunas cosas que pueden pasar que dejan el jugador sin opcion de jugar. por ejemplo si no hay movimientos posibles. eso por ahora para el juego y eso tenemos que tratar:


```
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
```

lo mas notable es el for-loop sobre todas las piezas del jugador actual:
en el loop se pregunta por la posicion a donde quiere moverse (futuropos).
se pregunta por cada pieza si se puede entrar a la castilla del futuropos.
si una vez se encuentra una castilla adonde se puede mover una pieza se aborte el loop.
se pregunta tb si hay una estrella si sea posible mover al siguiente porque si no no es posible mover este pieza.
tambien notable sea ese linea aldentro del loop:
```
if(futuropos>=camino.length)continue;        
```
ahi preguntamos si futuropos esta aldentro del camino. si no sabemos (como antes) que no es posible moverse por ahi y usamos un **continue**. un **continue** significa que aborte el turno actual del loop y empieza por el proximo. (es decir si estamos en pieza 1 y futuropos esta afuera continua directo con pieza 2). es algo similar a un *break* o *return* porque no se cumple nada mas del codigo siguiente del loop para este turno.

porque usamos un timeout y no le llamamos directo?
porque si lo llamamos directo sea imediato para el usuario y no ve que esta pasando como la animacion de los dados y tal. se va directo al "alert" que para toda la ejecucion de javascript hasta el usuario apreta "ok". da mala experiencia y asi le damos una pausa de 2 segundos.

creo que ya estamos. termina el juego.

---
mejorarlo graficamente

para mejorar la experiencia del usuario añadamos un poco magica de javascript y css.
a vez de usar ***appendChild*** directo lo abstraimos a una funcion **juegoUr.muevePiezaHtml(elemento, target)**
```
juegoUr.muevePiezaHtml = function(pieza,target){
    target.appendChild(pieza);
    let img = pieza.children[0];
    img.style.position = "absolute";
    img.style.top = target.offsetTop+"px";
    img.style.left = target.offsetLeft+"px";
    img.style.transition = "all 1s";
    console.log("movio pieza a "+img.style.top+"/"+img.style.left);
}
```

lo que hacemos ahi es posicionar el imagen del boton de forma absoluta y lo usamos los posiciones del target para posicionarlo. eso en conjunto con el css corresponde (transition) nos produce una animacion en que la pieza se va no imediato pero visible de una castilla a otra.

y a la funcion **crearHtmlParaPieza** podemos añadir tambien una "prevista" adonde la pieza se mueve si lo hacias un click:
```
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
```

como ves añadimos dos funciones al imagen del boton:
- img.onmouseenter
- img.onmouseout

ambos son funciones especiales de javascript de elementos en el DOM - **onmouseenter** se ejecuta cuando el raton se mueve por aldentro del imagen y **onmouseout** cuando el raton "sale" del imagen. lo que hacemos en onmouseenter es crear una copia de la pieza en html, le pongamos una id para definir mas css a esa pieza (por ejemplo que sea transparente) y lo movemos con la misma funcion de arriba al futuroCastilla.
en **onmouseout** borramos ese copia con *removeChild()* al padre de la pieza actual.

solo falta mejorar los piezas en el inicio y lo hacemos con un for-loop en la funcion **initJugadores**

```
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
```

parece complicado pero lo unico que hacemos es cambiar la posicion un poquito. el newleft y newtop sean los posiciones desde la izquierda y desde arriba. con offsetLeft y offsetTop preguntamos justo a la castilla/inicio sus distancias desde izquierda y arriba, lo disminuimos por diez y usamos **Math.floor(Math.random()*50)+50** para llegar a un numero de casualidad entre 0 y 50. al fin tenemos añadir "px" porque usamos pixeles para posicionar el elemento. con elemento.style.left y elemento.style.top lo accedemos directo al css de este elemento y pongamos el valor que calculemos antes.

 * **Math.random()** te da un numero entre 0 y 1, multiplicado con 50 sea n numero entre 0 y 50. **Math.floor()** reduce el numero a un numero total, eg. de 46.23456 a 46 o de 6.8 a 6 - siempre por abajo*

las versiones finales del html, css y js se puede acceder bajo "solucion" - ojo que solo funcionan si copias los imagenes a ese carpeta o si mueves los archivos por ese carpeta

[ur.html](solucion/ur.html)
[ur.css](solucion/ur.css)
[ur.js](solucion/ur.js)
