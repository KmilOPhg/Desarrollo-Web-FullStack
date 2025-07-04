const jugador = {
    nombre : "Cookie",
    ph : 500,
    ataque : 10,
}

const enemigo = {
    nombre : "Gato",
    ph : 500,
    ataque : 10,
}

const armas = {
    espada : {nombre : "Espada", ataque : 10},
    salud : {nombre : "Armadura", ph : 20},
    rayo : {nombre : "Rayo", ataque : 20},
} 


let jugadorAtaca;
let juegoTerminado = true;
let armaElegidaJugador = false; 
let armaElegidaEnemigo = false;
let btnJugar = document.getElementById("btnJugar");
let btnAtacar = document.getElementById("btnAtacar");
let vidaJugador = document.getElementById("vidaJugador");
let vidaEnemigo = document.getElementById("vidaEnemigo");
let nombreJugador = document.getElementById("nombreJugador");
let nombreEnemigo = document.getElementById("nombreEnemigo");
let armaJugador = document.getElementById("armaJugador");
let estadoJuego = document.getElementById("estadoJuego");
let armaEnemigo = document.getElementById("armaEnemigoElegida");
let mensajeCritico = document.getElementById("mensajeCritico");
let mensajeCriticoJugador = document.getElementById("mensajeCriticoJugador");
let mensajeCriticoEnemigo = document.getElementById("mensajeCriticoEnemigo");   
estadoJuego.innerHTML = "Dale a jugar";
btnAtacar.disabled = true;


function jugar() {
    juegoTerminado = false;
    actualiarPantalla(); 
    jugadorAtaca = Math.random() < 0.5; //50% de probabilidad de que el jugador ataque primero
    armaJugador.innerHTML = 'AD: ' + jugador.ataque; 
    armaEnemigo.innerHTML = 'AD: ' + enemigo.ataque; 
    vidaJugador.innerHTML = jugador.ph; //actualiza la vida del jugador en la pantalla
    vidaEnemigo.innerHTML = enemigo.ph; //actualiza la vida del enemigo en la pantalla
    btnJugar.disabled = true;

    if (juegoTerminado) return; //si el juego ha terminado no hace nada
    if (jugadorAtaca) {
        estadoJuego.innerHTML = jugador.nombre + ' Ataca primero'
        btnAtacar.disabled = false; 
    } else {
        estadoJuego.innerHTML = enemigo.nombre + ' Ataca primero'
        elegirArmaEnemigo(); //elige el arma del enemigos
        setTimeout(realizarAtaque, 1000); //espera 1 segundo para que el enemigo ataque
    }
}

//Arrow function para elegir el arma del jugador
const elegirArmaJugador = (arma) => {
    if(juegoTerminado) return alert("Inicia el juego para elegir arma"); //si el juego ha terminado no hace nada
    if (armaElegidaJugador) return alert("Ya has elegido arma"); //si el jugador ya ha elegido un arma no hace nada
    let armaSeleccionada = armas[arma]; //guarda el arma seleccionada
    armaElegidaJugador = true; //El jugador ha elegido un arma
    if (armas[arma]) {
        //si el arma tiene ataque suma el ataque del arma al ataque del jugador
        if (armaSeleccionada.ataque) { 
            jugador.ataque += armaSeleccionada.ataque;
            armaJugador.innerHTML = 'AD: ' + jugador.ataque;
        //si el arma tiene vida suma la vida del arma a la vida del jugador
        } else if (armaSeleccionada.ph) { 
            jugador.ph += armaSeleccionada.ph
            armaJugador.innerHTML = 'Vida: +' + armaSeleccionada.ph;
            actualiarPantalla();
        }
    }
}

//Arrow function para elegir el arma del enemigo
const elegirArmaEnemigo = () => {
    if (juegoTerminado) return; //si el juego ha terminado no hace nada
    if (armaElegidaEnemigo) return alert("el enemigo ya eligió arma"); //si el enemigo ya ha elegido un arma no hace nada

    let armasEnemigo = Object.keys(armas); //guarda las armas en un array
    let armaEnemigo = Math.floor(Math.random() * armasEnemigo.length); //elige un arma al azar
    let nombreArma = armas[armasEnemigo[armaEnemigo]]; //guarda el arma elegida al azar
    armaElegidaEnemigo = true; //el enemigo ha elegido un arma

    //Si el arma tiene ataque suma el ataque del arma al ataque del enemigo
    if(nombreArma.ataque) { 
        enemigo.ataque += nombreArma.ataque;
        armaEnemigoElegida.innerHTML = 'AD: ' + enemigo.ataque;
    //si el arma tiene vida suma la vida del arma a la vida del enemigo
    } else if (nombreArma.ph) { 
        enemigo.ph += nombreArma.ph; 
        armaEnemigoElegida.innerHTML = 'Vida +' + enemigo.ph;
        //actualiza el ataque del enemigo en la pantalla
        setTimeout(() => armaEnemigoElegida.innerHTML = 'AD: ' + enemigo.ataque, 1000);
    }
}

function golpeCritico(atacante, daño) {
    //si es critico con 25% de probabilidad
    if (Math.random() < 0.25) { 
        daño *= 2; //multiplica el ataque por 2
        
        //Si el atacado es el jugador
        if (atacante === jugador) {
            mensajeCriticoEnemigo.innerHTML = 'Hiiste Crítico!' + " -" + daño;
            mensajeCriticoEnemigo.classList.add('temblor'); //añade la clase critico al mensaje
        } else {
            //Si el atacado es el enemigo
            mensajeCriticoJugador.innerHTML = 'Crítico!' + " -" + daño;
            mensajeCriticoJugador.classList.add('temblor'); //añade la clase critico al mensaje
        }

        //Limpiar los mensajes después de 2 segundos
        setTimeout(() => {
            mensajeCriticoEnemigo.innerHTML = ''; //Limpia el mensaje del golpe crítico
            mensajeCriticoJugador.innerHTML = '';
            mensajeCriticoEnemigo.classList.remove('temblor'); //remueve la clase critico al mensaje
            mensajeCriticoJugador.classList.remove('temblor');
        }, 1000);

        return daño; //devuelve el daño
    }
    return daño; //si no es critico no devuelve daño adicional
}

function ejecutarAtaque(atacante, objetivo) {
    let critico = golpeCritico(atacante, atacante.ataque);
    objetivo.ph -= critico; //resta el daño retornado de la funcion golpeCritico al enemigo
    gestionarMuerte();
    cambiarTurno();
    actualiarPantalla();
}

function realizarAtaque() {
    if (juegoTerminado) return; //si el juego ha terminado no hace nada

    if (jugadorAtaca) {
        ejecutarAtaque(jugador, enemigo);
        setTimeout(realizarAtaque, 1000);
    } else {
        if (!armaElegidaEnemigo) elegirArmaEnemigo(); //si el enemigo no ha elegido un arma, elige una
        btnAtacar.disabled = true;
        ejecutarAtaque(enemigo, jugador);
    }
}

function cambiarTurno() {
    if (juegoTerminado) return; //si el juego ha terminado no hace nada
    jugadorAtaca = !jugadorAtaca; //cambia el turno
    if (jugadorAtaca) {
        btnAtacar.disabled = false; 
    } else {
        btnAtacar.disabled = true;
    }
    estadoJuego.innerHTML = "Turno de " + (jugadorAtaca ? jugador.nombre : enemigo.nombre); //actualiza el estado del jugador en la pantalla
}

function gestionarMuerte() {
    if (enemigo.ph <= 0) {
        alert(`${jugador.nombre} ha ganado`);
        juegoTerminado = true; //cambia el estado del juego a terminado
        reinciar();
        return; 
    } else if (jugador.ph <= 0) {
        alert(`${enemigo.nombre} ha ganado`);
        juegoTerminado = true; //cambia el estado del juego a terminado
        reinciar();
        return; 
    }
}

function actualiarPantalla() {
    vidaJugador.innerHTML = jugador.ph; //actualiza la vida del jugador en la pantalla
    vidaEnemigo.innerHTML = enemigo.ph; //actualiza la vida del enemigo en la pantalla
    nombreJugador.innerHTML = jugador.nombre; //actualiza el nombre del jugador en la pantalla
    nombreEnemigo.innerHTML = enemigo.nombre; //actualiza el nombre del enemigo en la pantalla
}

function reinciar() {
    juegoTerminado = true; //cambia el estado del juego a no terminado
    armaElegidaJugador = false; //variable para saber si el jugador ha elegido un arma
    armaElegidaEnemigo = false; //variable para saber si el enemigo ha elegido un arma
    console.clear(); //limpia la consola
    console.log("JUEGO TERMINADO");
    jugador.ataque = 10; //reinicia el ataque del jugador
    enemigo.ataque = 10; //reinicia el ataque del enemigo
    armaJugador.innerHTML = 'Daño actual de Cookie: ' + jugador.ataque; //actualiza el nombre del arma en la pantalla
    armaEnemigo.innerHTML = 'Daño actual de Gato: ' + enemigo.ataque; //actualiza el nombre del arma en la pantalla
    estadoJuego.innerHTML = "Dale a jugar"; //actualiza el estado del jugador en la pantalla
    //Reiniciar la vida del jugador y el enemigo
    jugador.ph = 500; //reinicia la vida del jugador
    enemigo.ph = 500; //reinicia la vida del enemigo
    actualiarPantalla();
    btnJugar.disabled = false; //habilita el boton de jugar
}