# trabajar con string

un string en javascript es un tipo de variable especial. es decir se trata como una variable directa, pero al mismo momento tiene caracteristicas de una lista. 
se contiene texto y el accesso en general es "por total". se puede ser trabajado de muchas formas:

editar directo:
var ejemplo = "eso es mi texto" //ejemplo: "eso es mi texto"
ejemplo = "ahora es otro" //ejemplo "ahora es otro"
ajuntar cosas:
ejemplo+=" y eso tambien" //ejemplo "ahora es otro y eso tambien"
lo puedes usar aldentro tb:
ejemplo = "en frente" + ejemplo //ejemplo "en frente ahora es otro y eso tambien"

pero lo puedes tambien tratar como una lista:
ejemplo[0] = "!" //ejemplo "!n frente ahora es otro y eso tambien"
let contarCaracteres = ejemplo.length //contarCaracteres: 35

y tiene sus propios funciones:
```
let corto = ejemplo.substring(3,9) //corto "frente" - el parte desde 3 hasta 9
let posicionDeR = corto.indexOf('r') //posicionDeR: 1
let ultimaPosicionDeE = corto.lastIndexOf('e') //ultimaPosicionDeE: 5
```
## definir un string

## buscar en un string

hay diferentes opciones para buscar la posicion de un string o de una palabra:
- search
- indexOf
- lastIndexOf


### search

search busca la primera posicion de la busqueda. la busqueda puede ser un string, pero tambien puede ser una regular Expression - o regex en corto. 
regex no vamos a tomar por ahora, como es una tarea por su mismo y bastante complejo. 
si no encuentra una posicion vuelve -1

ejemplo:
```
let test = "abcde"
let posDeC = test.search("c") //2
let posDeF = test.search("f") //-1
```

### indexOf y lastIndexOf

indexOf tambien busca la primera posicion, pero solo acepta string o un char para buscar. 
pero en cambio a search accepta segundo parametro para definir la posicion del inicio de la busqueda. si no esta emitido segundo parametro 
empieza en el inicio del string (es decir posicion 0). 
lastIndexOf es lo mismo pero al revez - a vez de buscar desde el inicio al fin se busca del fin al inicio. tambien accepta segundo parametro. 
pero ojo: si quieres continuar la busqueda no empieza con la posicion del primero o te vuelve siempre la misma posicion! 
si no encuentra una posicion vuelve -1

ejemplos: 
```
let test = "como estas?"
let primeroO = test.indexOf('o') //primeroO: 1
let segundoO = test.indexOf('o',primeroO) //segundoO: 1 - malo
segundoO = test.indexOf('o',primeroO+1) //segundoO: 3
let ultimoS = test.lastIndedOf('s') //ultimoS: 9
let otroS = test.lastIndedOf('s',ultimoS) //otroS: 9 - malo
otroS = test.lastIndedOf('s',ultimoS-1) //otroS: 6
let noExiste = test.indexOf('s',ultimoS+1) // noExiste: -1
noExiste = test.lastIndexOf('o',primeroO-1) // noExiste: -1
noExiste = test.indexOf('v') //noExiste: -1
```

# ejercicios 

## escribe una funcion que vuelve una lista con todas las posiciones de un string en un string

```
function buscaPosiciones(busqueda, texto){
    let result = []
    //tu codigo entra aqui

    return result
}

```

## escribe el juego "hangman" (hombre colgado?)

el juego tiene reglas simple
- hay una palabra oculta que jugadores tienen que buscar
- la palabra esta monstrada por "espacios" para cada letra de la palabra
- es por turno
- en cada turno jugadores pueden eligir de preguntar por una letra
- si la letra esta aldentro de la palabra se muenstra la letra a la posicion corespodiente en la palabra
- si la letra no esta aldentro de la palabra se asuma una "falta"
- si se llenan 7 faltas (o algo asi) el juego termine y el o la jugadora pierde
- jugadores tambien pueden entrar la palabra si piensan que ya lo conocen
- si la palabra esta corecta ganan el juego - si no se asume una falta


```
<html>
<head><title>hangman</title></head>
<body>
<h1>busca la palabra</h1>
<h2 id="tabla">******</h2>
<div>faltas: <span id="faltas">0</span></div>
<hr>
<label for="palabra">palabra:</label>
<input type="text" id="palabra">
<button id="buscaPalabra" onclick="hangman.buscaPalabra(this.value)">busca palabra</button>
<label for="letra"><input type="text" maxlength="1" id="letra" onkeyup="hangman.buscaLetra(this.value); this.value='';">

<script>
var hangman = {
    init: function(palabra){  
        //inicializar el juego
        this.secreto = palabra
        this.tablaText = "??????????????????????????????".substring(0,palabra.length)
        this.faltas = 0
        tabla.innerText = this.tablaText
        faltas.innerText = this.faltas
    },
    buscaPalabra: function(palabra){
        //tu codigo para buscar una palabra     
    },
    buscaLetra: function(letra){
        //tu codigo para buscar una letra
    },

}
hangman.init('ejemplo')
</script>
</body>
</html>

```
