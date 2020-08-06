# Juego royal de Ur

## Reglas

Las reglas son simples:

1. El juego es por turnos
2. Hay 4 Dados de 2 lados que acumulan sus puntos (asi tienes de 0 hasta 4 puntos cada ronda)
3. Cada jugador tiene 7 piezas, que tiene que mover desde el inicio hasta el fin (ve al grafico siguiente para verlo mejor)
4. Al inicio de su ronda el jugador juga a sus dados. Ahora puede eligir si mueve una pieza en la tabla o si entra una nueva pieza a la tabla
5. Si su pieza termina en una castilla ocupada por pieza del otro jugador la pieza del otro jugador vuelve al inicio
6. Si su pieza termina en una casilla de estrella el jugador gana otro turno
7. Piezas en una casilla de estrella estan protegidos, asi en cambio a regla 5 si una pieza termina en una castilla de estrella ocupada se mueve una castilla más adelante (donde regla 5 si se cumple)
8. Piezas no pueden mover a castillas ocupadas con piezas del mismo jugador
9. Si el jugador no puede mover ninguna pieza pierde este turno


## Mapa del juego
![](Rules_of_Royal_Game_of_Ur.jpg)

---
# Empezamos con el tutorial

Creamos tres archivos:
- ur.html : contiene la pagina del juego
- ur.js : contiene el codigo del juego
- ur.css : contiene el css (declaraciones de apariencia) del juego

---
# Ur.html

El esceleton de una pagina html esta separado entre una cabeza `<head>` y el cuerpo `<body>`. En el `<head>` declaramos cosas "meta", cosas que no aparecen directamente en la pagina. En el `<body>` declaramos los elementos que aparecen en la pagina.

```
<html>
    <head>
    </head>
    <body>
    </body>
</html>
```

Al `<head>` vamos a copiar el tag `<title>` para pasar un titulo al navegador:
```
<title>Juego de Ur</title>
```

Despues quieremos incluir nuestro css del archivo ur.css (aunque todavia esta blanco). para eso incluimos el tag siguiente:
```
<link rel="stylesheet" href="ur.css">
```

Al fin quieremos incluir nuestro codigo de javascript cun un tag de `<script>`:
```
<script src="ur.js"></script>
```

Nuestro head debe parecer algo asi:

```
<head>
<title>Juego de Ur</title>
<link rel="stylesheet" href="ur.css">
<script src="ur.js"></script>
</head>
```
Guardalo y abrelo en el firefox. Es una Pagina blanca, porque no hemos definido nada todavia por el cuerpo.

---
# el cuerpo `<body>`

En el cuerpo vamos a definir un esceleton crudo para nuestro juego:
```
<div id="jugador1">
</div>
<div id="jugador2">
</div>
<div id="mesa">
</div>
```
Eso significa que tenemos un espacio para jugador 1, un espacio para jugador 2 y un espacio para la mesa.
Vamos a llenar esos espacios con algo sencillo ya, lo pongamos titulos con los nombres del jugador:
```
<div id="jugador1">
<h2 id="nombre1">Jugador 1</h2>
</div>
<div id="jugador2">
<h2 id="nombre2">Jugador 2</h2>
</div>
```
Ves que les damos siempre un ID? Una id es como un nombre del elemento y debe ser unico en la pagina. Con ese ID podemos llegar muy facil al elemento con Javascript.
Tambien lo podemos usar en nuestro CSS.

Y justo eso vamos a hacer ahora. Guarda el ur.html y abre en Atom el archivo ur.js. Como en Atom puedes tener dos paneles con codigo, abre el ur.html en el panel de izquierda y el ur.js en el panel de derecha - asi puedes ver ambos archivos al mismo momento - que va a ser muy util como veas pronto.

el ur.html en total debe aparecer ahora como asi:

```
<html>
    <head>
        <title>Juego de Ur</title>
        <link rel="stylesheet" href="ur.css">
        <script src="ur.js"></script>
    </head>
    <body>
        <div id="jugador1">
            <h2 id="nombre1">Jugador 1</h2>
        </div>
        <div id="jugador2">
            <h2 id="nombre2">Jugador 2</h2>
        </div>
        <div id="mesa">
        </div>
    </body>
</html>
```
---
# ur.js

Aqui estamos lo más comodo, nuestro codigo :)
Te recuerdas todo de Objetos, Variables, Listas y funciones?
Una sobrevista cortita para que lo recuperas. Todavia estamos muy simplificando:

## Variables

Variables son nombres bajo que puedes guardad cualquier informacion. La informacion puede ser simple como un numero, complejo como un texto o abstracto como un objeto o una funcion. Variables estan siempre en un contexto. Asi si declares Variables en el codigo no más eso llamamos "global" - es decir de cualquier parte del programa lo puedes llamar a este variable. Eso evitamos en general maximo posible, para que no nos confundimos con las variables y para que eran. Pero si claro, lo usamos.

Una variable se declara como
```
var nombreDeMiVariable = valor;
```

Variables pueden tener diferentes tipos de valor. Vamos a ver cuales:

```
var miTexto = "mi texto de ejemplo";
var miNumero = 123;
var miLista = [1,2,3,4];
var miObjeto = {texto:"texto de ejemplo",numero:123,lista:[1,2,3]};
```

miTexto es una variable de tipo *string* - que significa un texto.
miNumero es una variable del tipo *number* - un numero.

un ejemplo de diferencia y que pasa si lo mesclas:
```
miTexto = miTexto + 1;
miNumero = miNumero + 1;
```
miTexto ahora es "mi texto de ejemplo1" y miNumero es 124.
Eso es muy importante a ver, porque lo usaremos un monton. Si te pasa que un numero cambia a ser un texto muchas veces es por eso. Ahi nos hace facil y dificil al mismo momento que no tenemos que preocuparnos del tipo de la variable y que se puede cambiar automaticamente. Si hacemos por ejemplo:
```
miNumero = miNumero + "1";
```
miNumero cambiara a ser un texto y entonces no calcula pero conjunta la 1 al otro. a vez de que miNumero sea 124 sea "1231".

## Listas y Objetos

Tenemos que ordenar nuestras variables, si no sea muy dificil entender y trabajar con codigo. Para eso usamos dos formas: listas y objetos.
Una lista, se llama *Array* es un container para variables. Es decir a vez de un valor contienen muchos. esos valores tambien pueden ser de todos tipos de variables.
En nuestro ejemplo tenemos una lista con 4 entradas de numeros. Hacemos dos listas:
```
miListaDeNumeros = [1,2,3,4];
miListaDeTextos = ["a","b","c","d"];
```

Como podemos tener accesso a los valores? Con el estilo `nombre[indice]`:
miListaDeNumeros[0] es 1, miListaDeNumeros[1] es 2...
miListaDeTextos[0] es "a", miListaDeTextos[1] es "b"...

**IMPORTANTE**: Listas empienzan en 0, no en 1. La primera entrada de una lista es 0! Porque al inicio era un 0, no un 1 ;)

Objetos son más abstracto todavia. Son como un container que puede tener todo, pero por nombre a vez de numero. Asi el objeto de ejempo era:
```
var miObjeto = {texto:"texto de ejemplo",numero:123,lista:[1,2,3]};
```

Como puedes ver lo declaramos con {} para ser un objeto. Aldentro del {} en ese forma de declaración se cambia de usar un "=" a un ":" para declarar.
Asi construimos un objeto que *contiene* las variables texto, numero y lista.
Si quiero obtener su valor puedo llamarlo con su nombre con un punto y despues el nombre de la variable:

1. miObjeto.texto
2. miObjeto.numero
3. miObjeto.lista

## Funciones

Una funcion contiene *codigo*. Cuando llamas a una funcion lo cumple el codigo que contiene. Lo usamos muchisimo para que no tenemos escribir lo mismo otra vez y otra vez y otra vez y otra vez y otra vez y otra vez...
Pero tambien para ordenar nuestro codigo, danos una sobrevista mejor de lo que esta pasando. Una funcion puede ser llamado con parametros y puede pero no necesita revolver un valor al llamador.

Se puede declarar una funcion de dos maneras:
```
function miFuncion(parametro){

}
var miFunction2 = function(parametro){

}
```
La primera constituye una function global con nombre miFuncion, la segunda hace lo mismo pero con nombre miFuncion2. Porque hay dos formas? Pues la segunda forma usaremos mucho, cuando quieremos declarar funciones de objetos:
```
miObjeto.miFuncion = function(){

}
```

Para llamar funciones les llamas con su nombre y () al fin. aldentro de los () puedes pasar los parametros que la funcion espera:
```
miFuncion("asdf");
miFuncion2("asdf");
miObjeto.miFuncion();
```

Una funcion puede volver un valor con `return`, el recipiente puede hacer con ese valor lo que quiere - por ejemplo guardarlo en una variable:

```
function cualEsMiNombre(nombre){
    return "tu nombre es "+nombre;
}

var retorno = cualEsMiNombre("famosa");
```
retorno ahora tiene el valor "tu nombre es famosa".

Todo bien?
---
# Empezamos

Si entendiste todo anterior empieza con declarar tus variables para darle estructura. Abre el ur.js - que debe ser blanco todavia (si entraste las cosas anteriores borrales).
Empezamos a declarar nuestro juego como un objeto:
```
var juegoUr = {};
```
Despues vamos a añadirla una funcion que se llama init:
```
juegoUr.init = function(){

}
```

aldentro de esa funcion init vamos a escribir:
```
var nombre1 = prompt("por favor dame tu nombre usuario 1");
var nombre2 = prompt("por favor dame tu nombre usuario 2");
```

el prompt pregunta al usuario por una entrada de texto y lo guardes en las variables.
despues quieremos guardar los nombres, pero como cada usuario puede tener más cosas despues (puntos, turnos...) lo abstraimos otra vez con un nuevo objeto aldentro del juego:
```
juegoUr.jugador1 = {nombre:nombre1};
juegoUr.jugador2 = {nombre:nombre2};
```
ahora tenemos un objeto juegoUr con dos jugadores, que tienen su nombre. lo añadimos al documento:
```
var tituloJugador1 = document.getElementById("nombre1");
var tituloJugador2 = document.getElementById("nombre2");
tituloJugador1.innerText = nombre1;
tituloJugador2.innerText = nombre2;
```
Que pasó ahi? bueno, lo preguntamos al documento al elemento con la id "nombre1" y al elemento con la id "nombre2" y cambiamos su valor de innerText al nombre que hemos recibido de los usuarios.
buenisimo.
tu funcion de init debe aparecer ahora asi:
```
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
```
falta de llamarlo. lo hacemos en el archivo de html. cambiamos el tag `<body>` en que entramos a este tag un "onload" a donde pasamos que debe hacer:
```
<body onload="juegoUr.init()">
```

Todo guardado?
Abre de nuevo el html en el firefox para ver si funciona.
---
# apareción de la pagina

La pagina funciona y el script ya esta cambiando algo - pero no parece lindo por nada.
Lo vamos a mejorar un poco con css.
Abre el archivo ur.css y ponga:
```
body {
    display:grid;
    grid-template-areas:"jugador1 mesa jugador2";
    grid-template-columns: 20% 60% 20%;
}
#jugador1{
    grid-area:jugador1;
}
#jugador2{
    grid-area:jugador2;
}
#mesa{
    grid-area:mesa;
}
```
Eso es codigo CSS.

CSS no es programar, aunque se puede hacer muchas cosas con eso. CSS es una forma de declaraciones. Solo puedes declarar valores. Pero estas valores son interpretada del Navegador para saber como debe aparecer la pagina.
Lo puedes cambiar estos valores del Elemento en CSS y en javascript directo. Usamos CSS para eso porque es bien estilo tenerlo separado - te facilita mucho cuando quieres cambiar cosas despues.

CSS funciona en que eliges cual elemento debe tener cuales valores.
Principalmente hay tres cosas para distinguir elementos:
- El tag
- una id
- una clase

El tag del elemento escribes asi no mas: por ejemplo el "body" es el elemento body.
Si hagas una regla para "div" sea para todos divs de la pagina.

La id es lo más especifico, como solo debe aparecer una vez en la pagina. Una id escribes con un numeral *#* al inicio: *#jugador1*  o *#mesa* por ejemplo.

Clases no usamos todavia. Se escribe con un punto al inicio: *.miClase*

Despues se entra como en el estilo "objeto" de javascript los valores de esta declaración css.

---
# en detalle

```
body {
    display:grid;
    grid-template-areas:"jugador1 mesa jugador2";
    grid-template-columns: 20% 60% 20%;
}
#jugador1{
    grid-area:jugador1;
}
#jugador2{
    grid-area:jugador2;
}
#mesa{
    grid-area:mesa;
}
```

Veamos otra vez al ejemplo:

Con eso hemos posicionado los diferentes elementos en la pagina con una tecnica que se llama grid. Guarda el archivo y abre ur.html de nuevo en firefox. Ahora los nombres de jugadores estan a los lados de la pagina con espacio en el medio.

Con *display:grid* decidimos que el body debe posicionar los elementos niños *children* en un grid. *grid-template-areas* define tres zonas del grid, con nombres para que lo podemos reusar despues. como estan en una linea (entre "") estan al lado del otro.
Con *grid-template-columns* definimos el tamaño horizontal *width* de cada zona - sean 20% por los jugadores y 60% para la mesa del espacio que hay.

despues definimos para los diferentes elementos con *grid-area* en que zona deben aparecer. jugador1 en jugador1, jugador2 en jugador2 y mesa en la zona mesa. Se llaman igual y eso es bueno, pero no necesario. pero es buen estilo para no pensar "como llamé la zona...?".


Bien - concluiste el primer nivel.
---
# Que hemos aprendido?

- como escribir el esceleton del html
- como escribir css en general
- como posicionar elementos con grid
- como escribir una estructura en javascript y empezar con el codigo
- como cambiar valores de elementos en la pagina

A continuar pronto...

---
# La tabla

Vamos a empezar con la tabla. Lo vamos al ur.html y entramos aldentro del **div** con **id="mesa"** un nuevo div para la tabla y otro div para los dados:
```
<div id="dados">
</div>
<div id="tabla">
</div>
```
---
Ahora vamos a llenar la tabla con los castillas. para los castillas vamos a usar botones:
```
<button class="castilla"></button>
```
De esos elementos *button* nececitamos en total 20. copia ese linea entonces 20 veces a la tabla. Esos botones llegan en un orden numeral aldentro de la tabla. El orden va a ser asi:
```
0  1  2
3  4  5
   6
   7
8  9  10
11 12 13
14 15 16
17 18 19
```

Ese orden es muy importante para recordarnos. Para hacernos más facil lo pongamos entonces los numeros aldentro de los botones - desde 0 hasta 19. Asi lo veamos siempre cuando chequeamos el codigo. La seccion de la mesa debe estar ahora en total asi:
```
<div id="mesa">
    <div id="dados">
    </div>
    <div id="tabla">
        <button class="castilla">0</button>
        <button class="castilla">1</button>
        <button class="castilla">2</button>
        <button class="castilla">3</button>
        <button class="castilla">4</button>
        <button class="castilla">5</button>
        <button class="castilla">6</button>
        <button class="castilla">7</button>
        <button class="castilla">8</button>
        <button class="castilla">9</button>
        <button class="castilla">10</button>
        <button class="castilla">11</button>
        <button class="castilla">12</button>
        <button class="castilla">13</button>
        <button class="castilla">14</button>
        <button class="castilla">15</button>
        <button class="castilla">16</button>
        <button class="castilla">17</button>
        <button class="castilla">18</button>
        <button class="castilla">19</button>
    </div>
</div>
```

Guardalo y vea como aparece en el firefox
Bien. Tiene 20 botones gris ahora, estan ya dentro de los jugadores, pero como una tabla no parece todavia, cierto?
---
vamos abrir el ur.css y pongamos una declaración de *grid* a la tabla:
```
#tabla{
    display:grid;
    grid-template-columns: 33% 33% 33%;
}
```

guardamos - abrimos el firefox:
bien. ahora es una tabla de tres columnos. Pero no es como la tabla del juego.
Veamos otra vez a la tabla como debe ser:
```
0  1  2
3  4  5
   6
   7
8  9  10
11 12 13
14 15 16
17 18 19
```

La 6 y la 7 estan solitos entre espacio libre. Si entramos algo ahi lo tenemos una tabla llena. Como abajo es el inicio y arriba es el fin - vamos a usar ese espacio justo por eso.
---
Nececitamos entonces una tabla asi: (F1 es fin Jugador1, I1 es inicio de Jugador1,
F2 es fin Jugador2, I2 sea inicio Jugador2)

```
0  1  2
3  4  5
F1 6  F2
I1 7  I2
8  9  10
11 12 13
14 15 16
17 18 19
```

Entramos elementos basicos (no nececitan un click) en **ur.html** a sus posiciones y les damos un id correspondiente a su uso para que les podemos ver mejor mas tarde:
```
                ...
                <button class="castilla">5</button>
                <div id="finJugador1"></div>
                <button class="castilla">6</button>                
                <div id="finJugador2"></div>
                 <div id="inicioJugador1"></div>
                <button class="castilla">7</button>
                <div id="inicioJugador2"></div>
                ...
```

---

La tabla entera debe aparecer asi:

```
<div id="tabla">
    <button class="castilla">0</button>
    <button class="castilla">1</button>
    <button class="castilla">2</button>
    <button class="castilla">3</button>
    <button class="castilla">4</button>
    <button class="castilla">5</button>
    <div id="finJugador1"></div>
    <button class="castilla">6</button>                
    <div id="finJugador2"></div>
     <div id="inicioJugador1"></div>
    <button class="castilla">7</button>
    <div id="inicioJugador2"></div>
    <button class="castilla">8</button>
    <button class="castilla">9</button>
    <button class="castilla">10</button>
    <button class="castilla">11</button>
    <button class="castilla">12</button>
    <button class="castilla">13</button>
    <button class="castilla">14</button>
    <button class="castilla">15</button>
    <button class="castilla">16</button>
    <button class="castilla">17</button>
    <button class="castilla">18</button>
    <button class="castilla">19</button>
</div>
```

Guardamos, abrimos en firefox: Bien! Ahora tenemos los botones como deben aparecer en el juego. Son gris y tal, pero ahi estan, ya funcionables :)
---
Pero lo que falta es distinguir ciertas castillas - las castillas con la estrella.
Veamos a la mapa y lo comparemos con la de rules:
```
0  1  2
3  4  5
F1 6  F2
I1 7  I2
8  9  10
11 12 13
14 15 16
17 18 19
```
combinado:
![](Rules_of_Royal_Game_of_Ur-numbers.jpg)

Los numeros 0, 2, 9, 17 y 19 tienen estrellas.
Asi vamos a añadir una clase más a esos elementos, la classe estrella. por ejemplo al boton 19:

```
    <button class="castilla estrella">19</button>
```

Asi igual a los otros botones.
---
Tu tabla debe estar ahora asi:
```
<div id="tabla">
                <button class="castilla estrella">0</button>
                <button class="castilla">1</button>
                <button class="castilla estrella">2</button>
                <button class="castilla">3</button>
                <button class="castilla">4</button>
                <button class="castilla">5</button>
                <div id="finJugador1"></div>
                <button class="castilla">6</button>                
                <div id="finJugador2"></div>
                 <div id="inicioJugador1"></div>
                <button class="castilla">7</button>
                <div id="inicioJugador2"></div>
                <button class="castilla">8</button>
                <button class="castilla estrella">9</button>
                <button class="castilla">10</button>
                <button class="castilla">11</button>
                <button class="castilla">12</button>
                <button class="castilla">13</button>
                <button class="castilla">14</button>
                <button class="castilla">15</button>
                <button class="castilla">16</button>
                <button class="castilla estrella">17</button>
                <button class="castilla">18</button>
                <button class="castilla estrella">19</button>
            </div>
```
Guarda todo, abre el firefox y vealo.
No ves ninguna diferencia? Vale. Hay que usar CSS...

---

abrir ur.css y ponga la declaración siguiente:
```
.estrella{
    background:red;
}
```
Lo que digamos en esa declaracion es que todos elementos que tienen la clase *estrella* deben tener un fondo **background** en rojo.
No es lo mas lindo, pero para verlo por ahora alcanza.
Guardamos todo, reload en el firefox...
Al fin. La tabla con estrellas.
---

Ahora, como estamos ya en el css, vamos a declarar unas cosas más:
quieremos que la tabla esta mas linda. para eso podemos declarar el tamaño de las castillas:

```
.castilla{
    width:10vh;
    height:10vh;
}

```
Bien. Ya son cuadrados. Pero estan muy lejos de cada uno.
A la tabla pongamos un **grid-gap** de **1vh** y un **width** de **33vh**:
```
#tabla{
    display:grid;
    grid-template-columns: 33% 33% 33%;
    grid-gap:1vh;
    width: 35vh;
}
```
---
Ahora la tabla esta bien, per pegado a la izquierda.
cambiamos la mesa:
```
#mesa{
    grid-area:mesa;
    display: grid;
    grid-template-areas: "dados1 tabla dados2";
    grid-template-columns: 1fr auto 1fr;
}
```
Otra vez declaramos un nuevo grid con **display:grid**. definimos tres areas: **grid-template-areas: "dados1 tabla dados2"** y tambien el tamano de las columnas: **grid-template-columns: 1fr auto 1fr**.
Lo que usamos aqui es **1fr** es una fraccion: es decir se divide el "espacio sobre" en fracciones. **auto** es decir que el tamaño depende del contenido del elemento.
---
Solo falta cambiar la tabla para darle la información que debe estar en la area tabla:
```
#tabla{
    display:grid;
    grid-template-columns: 33% 33% 33%;
    grid-gap:1vh;
    grid-area: tabla;
    width: 35vh;
}
```
---
Tu ur.css debe aparecer ahora asi:
```
body {
    display:grid;
    grid-template-areas:"jugador1 mesa jugador2";
    grid-template-columns: 20% 60% 20%;
}
#jugador1{
    grid-area:jugador1;
}
#jugador2{
    grid-area:jugador2;
}
#mesa{
    grid-area:mesa;
    display: grid;
    grid-template-areas: "dados1 tabla dados2";
    grid-template-columns: 1fr auto 1fr;
}
#tabla{
    display:grid;
    grid-template-columns: 33% 33% 33%;
    grid-gap: 2vh;
    grid-area: tabla;
    width: 35vh;
}

.estrella{
    background:red;
}
.castilla{
    width:10vh;
    height:10vh;
}

```

Felicitaciones. Lograste terminar este parte largo del tutorial.

---
# A Continuar

ya preparé los imagenes para este juego. Estan en el directorio de ur. 
vamos a acolocarles. Vea a este imagen:

![](tablaconnumeros.png)

Ahi veamos cual numero debe tener cual imagen. 
veamos a las castillas y les damos clases para distinguirles por imagen. La estrella ya tiene clase extra. usamos nombres como los imagenes para no confundirlos. 
- Imagen 0 y 2 damos la clase arriba
- imagen 1, 7, 11, 13, 15 le damos la clase cinco
- imagen 4,8,10,14,16 damos la clase ojos
- imagen 6 y 12 damos la clase cuatrocincos
- imagen 18 damos la clase fondo

asi vamos a entrar ur.html y añadimos las clases de mano a todas castillas. para eso lo entramos donde se declare *class="castilla"* y lo pongamos de forma *class="castilla arriba"*. 


uff... ya estamos?

tu tabla debe estar ahora asi:
```
<div id="tabla">
    <button class="castilla arriba">0</button>
    <button class="castilla cinco">1</button>
    <button class="castilla arriba">2</button>
    <button class="castilla estrella">3</button>
    <button class="castilla ojos">4</button>
    <button class="castilla estrella">5</button>
    <div id="finJugador1"></div>
    <button class="castilla cuatrocincos">6</button>                
    <div id="finJugador2"></div>
     <div id="inicioJugador1"></div>
    <button class="castilla cinco">7</button>
    <div id="inicioJugador2"></div>
    <button class="castilla ojos">8</button> 
    <button class="castilla estrella">9</button>
    <button class="castilla ojos">10</button>
    <button class="castilla cinco">11</button>
    <button class="castilla cuatrocincos">12</button>
    <button class="castilla cinco">13</button>
    <button class="castilla ojos">14</button>
    <button class="castilla cinco">15</button>
    <button class="castilla ojos">16</button>
    <button class="castilla estrella">17</button>
    <button class="castilla fondo">18</button>
    <button class="castilla estrella">19</button>
</div>
```

vamos al ur.css para usar esas clases. 
al fondo pegamos: 
```
/* los imagenes del fondo:*/

.estrella{background-image:url("castillaestrella.png");}
.arriba{background-image:url("castillaarriba.png");}
.cinco{background-image:url("castillacinco.png");}
.ojos{background-image:url("castillaojos.png");}
.cuatrocincos{background-image:url("castillacuatrocincos.png");}
.fondo{background-image:url("castillafondo.png");}

```

ahí declaramos que cada clase con el nombre debe tener su imagen como imagen de fondo. 
como es lo único que quieremos declarar asi lo hemos pegado en una linea y para explicarlo mejor arriba hemos dado un commentario *los imagenes del fondo* - que nos explica bien que va a pasar por ahi. eso nos produce una sobrevista mejor. si en el futuro quieremos cambiar un imagen nos facilita encontrar el parte en donde lo tenemos que cambiar. 

ahora puedes guardar todo y ver como aparece en firefox. 
esta bien? 
hmm... algo podemos mejorar que no es visible de primera vista. vamos a la entrada de las castillas *.castilla* y lo cambiamos: 

```
.castilla{
    width:10vh;
    height:10vh;
    background-repeat:no-repeat;
    background-size:cover;
}

```

mejor. ahi declaramos ahora que el imagen del fondo de *cada castilla* debe ser tan grande como la castilla misma: *background-size:cover;* y que no debe repitirse *background-repeat:no-repeat;*. ahi ves que util es usar los clases? 

buenisimo. 
aprendiste como usar clases en CSS para poner valores iguales a elementos diferentes en la pagina. 

Pero hay una cosa más: 
Cuando estoy piensando del programa, no me gusta que las castillas sean botones. 
Porque cuando pienso donde el usuario debe hacer un click es mucho más facil si lo hace a la pieza que quiere mover y no a la castilla donde quiere irse. 
Asi tenemos que cambiar el ur.html para que no sean más **button** los castillas, pero **div**.

Ya te veo diciendo *Queee? tengo que cambiar todo de mano?*
Cosas como eso te pasaran muchas veces cuando estas programando. Toma por ejemplo nombres de variables. Primero te parecia bien este nombre, pero cuando avanzas tienes otra cosa que puede tener el mismo nombre. asi para facilitar entender el codigo hay que cambiar este nombre en todos lugares donde aparece. 

El editor de texto, en tu caso Atom, te facilita eso. 
Entra al "ur.html" - el cursor debe estar aldentro del archivo. 

Ahora ponga las teclas "ctrl + f" para abrir la busqueda de Atom
Una pantalla abajo se abre con el titulo *Find in Current Buffer*
y tu cursor esta aldentro de la primera entrada donde se dice *Find in current buffer*
Ahi entras lo que quieres buscar. En nuestro caso `button`.

Imediamente ves que encuentra todos partes donde se dice "button".
Ahora haga un click a la entrada abajo donde se dice *Replace in current buffer*
Ahi entras `div`

Te va a decir *40 results found for 'button'*

Ahora a la derecha hay los botones *Find, Find All, Replace, Replace All*.
*Find* es ingles para decir *encontrar* *All* es ingles para *todos*
*Replace* es ingles para decir *Replazar*.

Entonces: 
Quieremos replazar, entonces hacemos un click a *replace*. 
Se cambiaba el primer parte y esta ahora en el fin de la primera castilla. 
otro click, cambia eso...
Asi puedes continuar - o como son los unicos botones que hay todavia en el documento puedes hacer un click a *Replace All* y se cambia todas entradas en uno. 
**pero ojo con eso en el futuro**. Es más seguro hacerlo uno por uno para ver si esta cambiando solo este parte. Hay un truco para evitar eso - a ver si lo encuentras por tu mismo. Si no te enseño cuando lo necesitamos ;)

Bien. Tu tabla debe ahora estar asi:

```
<div id="tabla">
                <div class="castilla arriba">0</div>
                <div class="castilla cinco">1</div>
                <div class="castilla arriba">2</div>
                <div class="castilla estrella">3</div>
                <div class="castilla ojos">4</div>
                <div class="castilla estrella">5</div>
                <div id="finJugador1"></div>
                <div class="castilla cuatrocincos">6</div>                
                <div id="finJugador2"></div>
                 <div id="inicioJugador1"></div>
                <div class="castilla cinco">7</div>
                <div id="inicioJugador2"></div>
                <div class="castilla ojos">8</div> 
                <div class="castilla estrella">9</div>
                <div class="castilla ojos">10</div>
                <div class="castilla cinco">11</div>
                <div class="castilla cuatrocincos">12</div>
                <div class="castilla cinco">13</div>
                <div class="castilla ojos">14</div>
                <div class="castilla cinco">15</div>
                <div class="castilla ojos">16</div>
                <div class="castilla estrella">17</div>
                <div class="castilla fondo">18</div>
                <div class="castilla estrella">19</div>
            </div>
```
Estamos listo con la tabla verdad? 
Lo que falta sean los dados y las piezas. 

Vamos a poner dados:

arriba del elemento tabla esta el elemento con id dados. ese elemento vamos a llenar con html: 

```
<div id="dados">
  <img id="dado0" src="dadoa0.png">
  <img id="dado1" src="dadoa1.png">
  <img id="dado2" src="dadob0.png">
  <img id="dado3" src="dadob1.png">
  <div id="dadosJuntos"></div>
</div>
```

que hicimos?
el div dados esta ahora llenado con 4 imagenes - el elemento **img**. cada imagen tiene una id *dado0 hasta dado3* y un **src** que es el source - el **nombre del archivo** que quieremos usar para este imagen.
al final punimos un div con id "dadosJuntos" donde vamos a poner los puntos acumulados mas tarde. por ahora no tiene contenido. 

asi estamos - hay dados. pero no aparecen lindos. 
vamos a abrir ur.css y pongamos

```
#dados {
  grid-area: dados1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
#dados img {
  width: 100%;
}
```

el `#dados` da a la area dados una **grid-area**, es decir en donde en el **grid** de la `#mesa` debe aparecer. lo nombramos dados1, que sea la area de los dados para jugador 1. 

despues digamos que debe presentar su mismo tambien de forma **grid**. 
con *grid-template-columns* digamos que va a ser un grid de 4 columnas, cada uno tiene un igual parte del tamaño posible. 

el otro es algo mas dificil: 
con **#dados img{}** declaramos valores para todos imagenes dentro del elemento con la **id** dados. son justo todos dados que tenemos. se puede escribir tambien por cada dado, pero a nosotros nos parece mejor asi. ahi digamos que el imagen debe obtener todo el espacio horizontal posible. como esta fraccionado arriba en 4 columnas eso nos asegura que el imagen va a cambiar su tamaño para ser exacto como lo quieremos y no como esta en su original. si no lo declaramos el imagen va a ser tan grande como en su archivo - y eso puede ser muy grande o muy chiquito. 

wow - estamos casi listo con la **GUI**. podemos empezar a programar:

---
# vamos a programar

empezamos con los dados. Como cada ronda empienza en jugar los dados quieremos una funcion - es decir un parte de codigo - que podemos llamar una y otra vez. 
asi lo llamamos jugarDados y lo juntamos al objeto del juegoUr:

```
juegoUr.jugadorDados = function(){

}
```
bueno, tenemos la función. Ahora - cada dado debe tener un 0 o un 1. 
Lo podemos lograr con dos funciones juntos en una calculación:
1. Math.random()
2. Math.floor()

Esos son funciones del objeto *Math* que siempre esta disponible en javascript. 
Math.random() nos produce un numero entre 0 y 1, pero nunca 1. 
Ese numero lo multiplicamos con 2, asi llegamos a un numero entre 0 y 2. 
Ahora usamos Math.floor() a ese numero para que borre todo despues del coma. 
Asi un numero 1,345532234256 va a ser un 1, un 0,24235215 va a ser un 0. 
Asi al final tenemos un 0 o un 1. 
```
var numero = Math.random();
numero=numero*2;
numero=Math.floor(numero);
```

O en una linea:
```
var numero=Math.floor(Math.random()*2);
```

Lo entramos para cuatro dados:

```
juegoUr.jugarDados = function(){
    var dado1 = Math.floor(Math.random()*2);
    var dado2 = Math.floor(Math.random()*2);
    var dado3 = Math.floor(Math.random()*2);
    var dado4 = Math.floor(Math.random()*2);
    var resultado = dado1+dado2+dado3+dado4;
}
```
asi tenemos logrado a tener jugado 4 dados y hemos acumulado los puntos en el resultado.
Ahora quieremos cada dado representado graficamente corecto. Asi hacemos:
```
    var dadoimg1 = document.getElementById("dado0");
    var dadoimg2 = document.getElementById("dado1");
    var dadoimg2 = document.getElementById("dado1");
    var dadoimg2 = document.getElementById("dado1");
```

Asi logramos aceso al imagen que representa cada dado. 
Pero para. Te das cuenta de algo? 
Siempre hacemos lo mismo 4 veces. 
Si continuamos asi nuestro codigo va a ser muy grande y complicado de cambiar cosas despues. 

Hacemos algo más elegante. usamos listas y loops.
Primero, a vez de tener una variable por cada dado tenemos una lista que contiene todos.
lo llamamos dados. y otra variable llamamos resultado y sea un numero 0:

```
juegoUr.jugarDados = function(){
    var dados = [];
    var resultado = 0;
}
```

Ahora entramos un loop:

```
juegoUr.jugarDados = function(){
    var dados = [];
    var resultado = 0;
    for(var x=0;x<4;x++){

    }
}
```

El `for(var x=0;x<4;x++){}` hace que el codigo entre las `{}` va a ser repitido hasta que x esta 4, entonces 4 veces en total. cada ronda se incrementa `x` por uno. asi puedes distinguir en que ronda estas:

```
juegoUr.jugarDados = function(){
    var dados = [];
    var resultado = 0;
    for(var x=0;x<4;x++){
        dados[x] = Math.floor(Math.random()*2);
        resultado+=dados[x];
    }
}
```

Ahora tenemos una lista con los cuatro dados y el resultado tambien es correcto. 
Vamos a cambiar los imagenes:

```
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
        nombreArchivo = nombreArchivo+"0.png";
        img.src=nombreArchivo;
    }
}
```

Que pasa ahi?
Primero nos construimos accesso al imagen por su id. como siempre es "dado" mas un numero podemos llamarlo facilmente de esta forma. en la primera ronda es "dado0" en la segunda "dado1"...
Despues construimos el nombre del Archivo. Empienza siempre con dado, despues viene un "a" si es un punto/1 y b si es un 0. 
al final ponemos "0.png" para eligir el primer imagen.
y lo pasamos al **src** del **img** para cambiar el imagen en el navegador.

Pero si, tenemos 3 diferentes imagenes para cada dado. porque no lo usamos?
```
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
}
```
Epa, asi tambien cada vez se toma un imagen de casualidad :)

Bien. Si lo quieres probar guarda todo, abre el firefox y aldentro abres la consola del inspector:
hagas un click con la derecha en la pagina y eliges "inspect element". o pongas "ctrl+shift+i" o directamente "ctrl+shift+k" para la consola. 
ahi entras 
`juegoUr.jugarDados()`

Te debe cambiar los dados si hiciste todo bien hasta ahora :)

Falta el resultado:
```
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
```
Como puedes ver lo hacemos afuera del for-loop, es lo que hacemos despues. cuando el loop termina el codigo sigue despues. primero lo guardamos en la variable *dadosJuntos* del objeto en que estamos - eso es el **this**. como estamos en el objeto *juegoUr* el nombre completo para llamarlo desde afuera sea **juegoUr.dadosJuntos**. Aldentro del objeto lo podemos tambien llamar con **this.dadosJuntos**

Bien. Continuamos con el juego. 
Como el juego es por turno vamos a poner una función turno - que contiene lo que debe pasar cada inicio de turno
```
juegoUr.turno = function(){
    this.jugarDados(); //ahora se actualizó los dados y los puntos para el turno actual
    if(this.dadosJuntos===0){
        alert("Ooooh... un 0... perdiste tu turno");
        this.terminaTurno(); //no hay más que hacer en un 0
        return;
    }
}
```

Empezamos el turno con jugarDados, la funcion que escribimos arriba. Esa nos produce un numero que podemos usar, los dadosJuntos. Lo primero que chequeamos es si sea 0. Porque si hay un 0 no se puede hacer nada. Si es asi lo digamos al usuario con un alert.
despues llamamos a otra funcion *terminaTurno*.
Al final digamos `return`, que dice termina la funciòn por aqui. 
La funcion *terminaTurno* todavia no existe - asi lo escribimos:

```
juegoUr.terminaTurno = function(){
    if(this.jugadorActual===1){
        this.jugadorActual = 2; 
    }else{
        this.jugadorActual=1;
    }
    this.turno();
}
```

Lo que hacemos aqui es cambiar el turno de Jugador y guardarlo en la variable jugadorActual. Asi sabemos siempre en que turno estamos. despues llamamos a otro turno. 
Pero vamos a cambiar tambien la posición del dado por aqui. Entramos


```
juegoUr.terminaTurno = function(){
    if(this.jugadorActual===1){
        this.jugadorActual = 2; 
    }else{
        this.jugadorActual=1;
    }
    this.turno();
    var dados = document.getElementById("dados");
    dados.classList.add("jugador2");
}
```


Bien. Terminaste otro gran parte del tutorial. 
Si lo quieres ver en acción abre la consola de firefox y ponga 
`juegoUr.terminaTurno();
En lo proximo continuamos con la actuación de los usuarios.

---

