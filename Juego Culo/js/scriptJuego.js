class Arma {
    constructor(nombre, ataque = 0, ph = 0) {
        this.nombre = nombre;
        this.ataque = ataque;
        this.ph = ph;
    }
}

class Personaje {
    constructor(nombre, ph, ataque) {
        this.nombre = nombre;
        this.ph = ph;
        this.ataque = ataque;
        this.armaElegida = false;
    }

    usarArma(arma) {
        if (this.armaElegida) return;
        this.armaElegida = true;
        if (arma.ataque) this.ataque += arma.ataque;
        if (arma.ph) this.ph += arma.ph;
    }

    recibirDaño(daño) {
        this.ph -= daño;
    }

    estaVivo() {
        return this.ph > 0;
    }
}

class Juego {
    constructor(jugador, enemigo, armas) {
        this.jugador = jugador;
        this.enemigo = enemigo;
        this.armas = armas;
        this.jugadorAtaca = true;
        this.juegoTerminado = true;

        //DOM
        this.btnJugar = document.getElementById("btnJugar");
        this.btnAtacar = document.getElementById("btnAtacar");
        this.vidaJugador = document.getElementById("vidaJugador");
        this.vidaEnemigo = document.getElementById("vidaEnemigo");
        this.nombreJugador = document.getElementById("nombreJugador");
        this.nombreEnemigo = document.getElementById("nombreEnemigo");
        this.armaJugador = document.getElementById("armaJugador");
        this.estadoJuego = document.getElementById("estadoJuego");
        this.armaEnemigo = document.getElementById("armaEnemigoElegida");
        this.msjCriticoJugador = document.getElementById("mensajeCriticoJugador");
        this.msjCriticoEnemigo = document.getElementById("mensajeCriticoEnemigo");

        this.btnJugar.addEventListener("click", () => this.iniciarJuego());
        this.btnAtacar.addEventListener("click", () => this.realizarAtaque());
    }

    iniciarJuego() {
        this.juegoTerminado = false;
        this.jugador.ph = 500;
        this.enemigo.ph = 500;
        this.jugador.ataque = 10;
        this.enemigo.ataque = 10;
        this.jugador.armaElegida = false;
        this.enemigo.armaElegida = false;
        this.jugadorAtaca = Math.random() < 0.5;

        this.btnJugar.disabled = true;
        this.actualizarPantalla();

        this.armaJugador.innerHTML = 'AD: ' + this.jugador.ataque;
        this.armaEnemigo.innerHTML = 'AD: ' + this.enemigo.ataque;

        if (this.jugadorAtaca) {
            this.estadoJuego.innerHTML = this.jugador.nombre + ' Ataca primero';
            this.btnAtacar.disabled = false;
        } else {
            this.estadoJuego.innerHTML = this.enemigo.nombre + ' Ataca primero';
            this.elegirArmaAleatoria(this.enemigo);
            setTimeout(() => this.realizarAtaque(), 1000);
        }
    }

    elegirArmaJugador(nombreArma) {
        if (this.juegoTerminado) return alert("Inicia el juego para elegir arma");
        if (this.jugador.armaElegida) return alert("Ya has elegido arma");
        let arma = this.armas[nombreArma];
        this.jugador.usarArma(arma);

        if (arma.ataque) {
            this.armaJugador.innerHTML = 'AD: ' + this.jugador.ataque;
        } else {
            this.armaJugador.innerHTML = 'Vida: +' + arma.ph;
        }

        this.actualizarPantalla();
    }

    elegirArmaAleatoria(personaje) {
        if (personaje.armaElegida) return;
        let inventarioArmas = Object.keys(this.armas);
        let aleatoria = this.armas[inventarioArmas[Math.floor(Math.random() * inventarioArmas.length)]];
        personaje.usarArma(aleatoria);

        if (personaje === this.enemigo) {
            if (aleatoria.ataque) {
                this.armaEnemigo.innerHTML = 'AD: ' + personaje.ataque;
            } else {
                this.armaEnemigo.innerHTML = 'Vida +' + aleatoria.ph;
                setTimeout(() => {
                    this.armaEnemigo.innerHTML = 'AD: ' + personaje.ataque;
                }, 1000);
            }
        }
    }

    golpeCritico(atacante) {
        let daño = atacante.ataque;
        if (Math.random() < 0.25) {
            daño *= 2;
            let msj = atacante === this.jugador ? this.msjCriticoEnemigo : this.msjCriticoJugador;
            msj.innerHTML = '¡Crítico! -' + daño;
            msj.classList.add('temblor');
            setTimeout(() => {
                msj.innerHTML = '';
                msj.classList.remove('temblor');
            }, 1000);
        }
        return daño;
    }

    ejecutarAtaque(atacante, defensor) {
        let daño = this.golpeCritico(atacante);
        defensor.recibirDaño(daño);
        this.actualizarPantalla();
        this.revisarMuertes();
        this.cambiarTurno();
    }

    realizarAtaque() {
        if (this.juegoTerminado) return;
        if (this.jugadorAtaca) {
            this.ejecutarAtaque(this.jugador, this.enemigo);
            setTimeout(() => this.realizarAtaque(), 1000);
        } else {
            if (!this.enemigo.armaElegida) this.elegirArmaAleatoria(this.enemigo);
            this.btnAtacar.disabled = true;
            this.ejecutarAtaque(this.enemigo, this.jugador);
        }
    }

    cambiarTurno() {
        if (this.juegoTerminado) return;
        this.jugadorAtaca = !this.jugadorAtaca;
        this.btnAtacar.disabled = !this.jugadorAtaca;
        this.estadoJuego.innerHTML = "Turno de " + (this.jugadorAtaca ? this.jugador.nombre : this.enemigo.nombre);
    }

    revisarMuertes() {
        if (!this.enemigo.estaVivo()) {
            alert(`${this.jugador.nombre} ha ganado`);
            this.terminarJuego();
        } else if (!this.jugador.estaVivo()) {
            alert(`${this.enemigo.nombre} ha ganado`);
            this.terminarJuego();
        }
    }

    terminarJuego() {
        this.juegoTerminado = true;
        this.btnJugar.disabled = false;
        this.estadoJuego.innerHTML = "Dale a jugar";
    }

    actualizarPantalla() {
        this.vidaJugador.innerHTML = this.jugador.ph;
        this.vidaEnemigo.innerHTML = this.enemigo.ph;
        this.nombreJugador.innerHTML = this.jugador.nombre;
        this.nombreEnemigo.innerHTML = this.enemigo.nombre;
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const armas = {
      espada: new Arma("Espada", 10),
      salud: new Arma("Armadura", 0, 20),
      rayo: new Arma("Rayo", 20)
  };

  const jugador = new Personaje("Cookie", 500, 10);
  const enemigo = new Personaje("Gato", 500, 10);
  const juego = new Juego(jugador, enemigo, armas);

  document.getElementById("btnEspada").addEventListener("click", () => juego.elegirArmaJugador("espada"));
  document.getElementById("btnRayo").addEventListener("click", () => juego.elegirArmaJugador("rayo"));
  document.getElementById("btnSalud").addEventListener("click", () => juego.elegirArmaJugador("salud"));
});
