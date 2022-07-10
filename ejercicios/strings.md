# trabajar con string

un string en javascript es un tipo de variable especial. es decir se trata como una variable directa, pero al mismo momento tiene caracteristicas de una lista.
se contiene texto y el accesso en general es "por total". se puede ser trabajado de muchas formas:

editar directo:
```
var ejemplo = "eso es mi texto" //ejemplo: "eso es mi texto"
ejemplo = "ahora es otro" //ejemplo "ahora es otro"
```
ajuntar cosas:
```
ejemplo+=" y eso tambien" //ejemplo "ahora es otro y eso tambien"
segundo_ejemplo = "primero "+"segundo" //segundo_ejemplo: "primero segundo"
```
lo puedes usar aldentro tb:
```
ejemplo = "en frente" + ejemplo //ejemplo "en frente ahora es otro y eso tambien"
```
pero lo puedes tambien tratar como una lista:
```
ejemplo[0] = "!" //ejemplo "!n frente ahora es otro y eso tambien"
let contarCaracteres = ejemplo.length //contarCaracteres: 35
```
y tiene sus propios funciones:
```
let corto = ejemplo.substring(3,9) //corto "frente" - el parte desde 3 hasta 9
let posicionDeR = corto.indexOf('r') //posicionDeR: 1
let ultimaPosicionDeE = corto.lastIndexOf('e') //ultimaPosicionDeE: 5
```
## construir un string

un string se puede construir de tres diferentes formas:

```
comillas = "entre doble comillas"
comillas2 = 'entre simple comillas'
comillas3 = `entre comillas por atras`
```

lo bueno de eso es que lo puedes usar para entrar comillas aldentro del texto:
```
comillas4 = "simple 'comilla' aldentro de doble comillas"
comillas5 = 'doble "comillas" aldentro de simple comillas'
comillas6 = `'simple' y "doble" comillas aldentro de comillas por atras`
```

simple y doble comilla solo soporta una linea. no se continua a la segunda linea.
entre comillas de atras si, se puede usar más lineas
```
//no valido:
comillas = "eso no se puede
aunque se quiere"
comillas = `eso si
se puede construir por mas que una linea`
```

ojo: aunque no se puede definir por más que una linea - el texto aldentro si
puede tener más lineas. en un string empezar una nueva linea se hace por
un caracter especial. caracteres especiales se puede lograr con un '\' en frente
y entrar el simbolo para el caracter especial. el caracter para nueva linea es '\n'
y se puede definir y buscar para eso tambien.
ojo: aunque el caracter especial esta definido con dos letras es un caracter
solo en el string.

```
texto = "eso es la primera linea.\neso es la segunda"
//texto es:
//eso es la primera linea.
//eso es la segunda
nl = texto[24] //nl es "\n"
x = texto[25] //x es "e"
doslineas = "abc\ndef"
length = doslineas.length //length: 7
```

las comillas de atras soportan tambien una forma especial de entrar
valores y/o variables por aldentro de un texto. para eso se usa la forma:
${valor}. ejemplo:

```
nombre="juan"
texto=`hola, mi nombre es ${nombre}. como estas?`
//texto es: "hola, mi nombre es juan. como estas?"
texto=`uno mas dos es: ${1+2}`
//texto es: "uno mas dos es: 3"
```

pero un string no solamente es un string cuando esta guardado en una variable -
en el momento que defines un string se construye un string y puede ser usado
directo como un string:
```
texto = "hola juan, tu nombre tiene "+ "juan".length + " caracteres"
//texto: "hola juan, tu nombre tiene 4 caracteres"
cinconumerales = "###########################".substring(0,5)
//cinconumerales: "#####"
```

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

## escribe una funcion de hola, que toma un nombre y vuelve un string "hola nombre"

```
function hola(nombre){
  let result = ""
  //tu codigo aqui

  return result
}
```
## escribe una funcion que vuelve una lista con todas las posiciones de un string en un string (tienes que usar un loop)

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
