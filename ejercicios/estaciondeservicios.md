stack

un stack es una variable en donde guardamos más variables. pero un stack tiene caracteristicas especificas: 
en general no lo usas para lograr una lista y tener accesso a todos objetos/valores que obtiene, pero más para guardar un "orden" de ciertos valores y/o objetos. 

hay diferentes tipos de stack, en general tenemos dos:
first-in-last-out (primero-que-entra-sale-ultimo)
first-in-first-out (primero-que-entra-sale-primero)

el primero es como un balde: lo rellenas con cosas, pero solo tienes accesso al ultimo objeto que entraste al balde. para acceder al primero tienes que sacar todos antes. 
el otro es una cola: solo puede pasar uno cada vez y entonces cada nuevo que llega se va al fin de la cola y el primero sale de la cola. 

en javascript lo usamos listas (arrays) para formar un stack y usamos cuatro funciones que nos da: 
push(elemento/valor) : pone elemento/valor al fin de la lista 
pop() : vuelve el ultimo elemento de la lista sacandole de la lista
shift(): vuelve el primero elemento de la lista, sacandole de la lista 
unshift(elemento/valor): entra elemento/valor al inicio de la lista 
ejemplos en codigo: 
```
var lista = [1,2,3,4]
lista.push(5) // lista: [1,2,3,4,5]
var ultimo = lista.pop() //ultimo: 5, lista: [1,2,3,4]
var primero = lista.shift() //primero: 1, lista:[2,3,4]
lista.unshift(6) //lista:[6,2,3,4]
```

ejercicio: 

construye un simulador de una estacion de servicio. cada coche que llega a la estacion necesita 1 segundo para cada litro que tiene que llenar. 
la estacion debe ser simultable en donde puedes cambiar el numero de bombas - es decir cuantos coches pueden llenarse al mismo momento. 
guarda el tiempo total para cada noche (espera + llenar), haciendo una estatistica

coches de prueba pueden ser asi: (tanque: estado actual de litros, capacidad: litros maximo del tanque, LlegaAlServicioEnS: segundos desde el inicio de la simulacion -> cuando debe llegar el coche al servicio
```
var todoscoches = [
{tanque:15, capacidad:60, LlegaAlServicioEnS: 1},
{tanque:25, capacidad:70, LlegaAlServicioEnS: 10},
{tanque:13, capacidad:60, LlegaAlServicioEnS: 20},
{tanque:11, capacidad:50, LlegaAlServicioEnS: 25},
{tanque:12, capacidad:60, LlegaAlServicioEnS: 30},
{tanque:5, capacidad:50, LlegaAlServicioEnS: 45},
{tanque:18, capacidad:70, LlegaAlServicioEnS: 60},
{tanque:30, capacidad:70, LlegaAlServicioEnS: 80},
{tanque:52, capacidad:80, LlegaAlServicioEnS: 85},
{tanque:20, capacidad:60, LlegaAlServicioEnS: 100},
{tanque:30, capacidad:60, LlegaAlServicioEnS: 120},
]
```

para ejecutar cada segundo lo puedes usar la proxima funcion:

```
var simulador = {
    tiempoActual: 0,
    tiempoMax: 200,
    simular: function(){
        this.tiempoActual++
        if(this.tiempoMax<=tiempoActual){
            //termina la simulacion - si quieres puedes entrar codigo aqui 
            //ejemplo: estacion.termina(tiempoActual)
            return //se termina la funcion aqui
        }
        //entra por aqui la llamada a tu funcion, por ejemplo
        //estacion.turno(tiempoActual)

        //espera un segundo (1000 ms) y llamar otra vez al simulador
        setTimeout('simulador.simular()',1000)       
    },
}
```
