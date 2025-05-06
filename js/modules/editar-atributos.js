// Funciones para gestionar la edición de atributos del personaje

// Función para cargar los atributos en el formulario de edición
function cargarAtributosEdicion() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Cargar atributos básicos
  document.getElementById("nivel").value = personaje.nivel || "1"
  document.getElementById("clase").value = personaje.clase || ""

  // Cargar atributos de combate
  document.getElementById("combate").value = personaje.atributos?.combate || 0
  document.getElementById("punteria").value = personaje.atributos?.punteria || 0
  document.getElementById("magia").value = personaje.atributos?.magia || 0

  // Cargar atributos vitales
  document.getElementById("vida").value = personaje.atributos?.vida || 0
  document.getElementById("aguante").value = personaje.atributos?.aguante || 0
  document.getElementById("mana").value = personaje.atributos?.mana || 0

  // Añadir iconos a los atributos
  añadirIconosAtributosEdicion()
}

// Función para guardar los atributos desde el formulario de edición
function guardarAtributosEdicion() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Guardar atributos básicos
  personaje.nivel = document.getElementById("nivel").value
  personaje.clase = document.getElementById("clase").value

  // Guardar atributos de combate
  if (!personaje.atributos) {
    personaje.atributos = {}
  }
  personaje.atributos.combate = Number.parseInt(document.getElementById("combate").value) || 0
  personaje.atributos.punteria = Number.parseInt(document.getElementById("punteria").value) || 0
  personaje.atributos.magia = Number.parseInt(document.getElementById("magia").value) || 0

  // Guardar atributos vitales
  personaje.atributos.vida = Number.parseInt(document.getElementById("vida").value) || 0
  personaje.atributos.aguante = Number.parseInt(document.getElementById("aguante").value) || 0
  personaje.atributos.mana = Number.parseInt(document.getElementById("mana").value) || 0

  // Actualizar atributos actuales si no existen o son mayores que los máximos
  if (!personaje.atributos.vidaActual || personaje.atributos.vidaActual > personaje.atributos.vida) {
    personaje.atributos.vidaActual = personaje.atributos.vida
  }
  if (!personaje.atributos.aguanteActual || personaje.atributos.aguanteActual > personaje.atributos.aguante) {
    personaje.atributos.aguanteActual = personaje.atributos.aguante
  }
  if (!personaje.atributos.manaActual || personaje.atributos.manaActual > personaje.atributos.mana) {
    personaje.atributos.manaActual = personaje.atributos.mana
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))
}

// Función para añadir iconos a los atributos en la pantalla de edición
function añadirIconosAtributosEdicion() {
  // Añadir iconos a los atributos de combate
  const combateLabel = document.querySelector('label[for="combate"]')
  if (combateLabel) {
    combateLabel.innerHTML = '<i class="bi bi-sword me-1"></i> Combate'
  }

  const punteriaLabel = document.querySelector('label[for="punteria"]')
  if (punteriaLabel) {
    punteriaLabel.innerHTML = '<i class="bi bi-bullseye me-1"></i> Puntería'
  }

  const magiaLabel = document.querySelector('label[for="magia"]')
  if (magiaLabel) {
    magiaLabel.innerHTML = '<i class="bi bi-stars me-1"></i> Magia'
  }

  // Añadir iconos a los atributos vitales
  const vidaLabel = document.querySelector('label[for="vida"]')
  if (vidaLabel) {
    vidaLabel.innerHTML = '<i class="bi bi-heart-fill me-1"></i> Vida'
  }

  const aguanteLabel = document.querySelector('label[for="aguante"]')
  if (aguanteLabel) {
    aguanteLabel.innerHTML = '<i class="bi bi-lightning-fill me-1"></i> Aguante'
  }

  const manaLabel = document.querySelector('label[for="mana"]')
  if (manaLabel) {
    manaLabel.innerHTML = '<i class="bi bi-magic me-1"></i> Maná'
  }
}

// Exportar funciones
export { cargarAtributosEdicion, guardarAtributosEdicion, añadirIconosAtributosEdicion }
