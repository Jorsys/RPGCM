// Funciones para gestionar los atributos derivados del personaje

// Función para cargar los atributos derivados
function cargarAtributos() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Cargar atributos básicos
  document.getElementById("nivel").textContent = personaje.nivel || "1"
  document.getElementById("clase").textContent = personaje.clase || "-"

  // Cargar atributos básicos
  const percepcion = personaje.atributos?.percepcion || 0
  const destreza = personaje.atributos?.destreza || 0
  const agilidad = personaje.atributos?.agilidad || 0
  const inteligencia = personaje.atributos?.inteligencia || 0

  document.getElementById("percepcion").textContent = percepcion
  document.getElementById("destreza").textContent = destreza
  document.getElementById("agilidad").textContent = agilidad
  document.getElementById("inteligencia").textContent = inteligencia

  // Cargar atributos de combate
  const combate = personaje.atributos?.combate || 0
  const punteria = personaje.atributos?.punteria || 0
  const magia = personaje.atributos?.magia || 0

  document.getElementById("combate").textContent = combate
  document.getElementById("punteria").textContent = punteria
  document.getElementById("magia").textContent = magia

  // Cargar atributos vitales
  const vida = personaje.atributos?.vida || 0
  const aguante = personaje.atributos?.aguante || 0
  const mana = personaje.atributos?.mana || 0

  document.getElementById("vida").textContent = vida
  document.getElementById("aguante").textContent = aguante
  document.getElementById("mana").textContent = mana

  // Cargar atributos secundarios
  const vidaActual = personaje.atributos?.vidaActual || vida
  const aguanteActual = personaje.atributos?.aguanteActual || aguante
  const manaActual = personaje.atributos?.manaActual || mana

  document.getElementById("vidaActual").value = vidaActual
  document.getElementById("aguanteActual").value = aguanteActual
  document.getElementById("manaActual").value = manaActual

  // Configurar eventos para los atributos actuales
  document.getElementById("vidaActual").addEventListener("change", actualizarAtributoActual)
  document.getElementById("aguanteActual").addEventListener("change", actualizarAtributoActual)
  document.getElementById("manaActual").addEventListener("change", actualizarAtributoActual)

  // Añadir iconos a los atributos
  añadirIconosAtributos()
}

// Función para actualizar un atributo actual
function actualizarAtributoActual(event) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  const atributo = event.target.id
  const valor = Number.parseInt(event.target.value) || 0

  // Actualizar el atributo en el personaje
  if (!personaje.atributos) {
    personaje.atributos = {}
  }

  personaje.atributos[atributo] = valor

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))
}

// Función para añadir iconos a los atributos
function añadirIconosAtributos() {
  // Añadir iconos a los atributos básicos
  const percepcionLabel = document.querySelector('label[for="percepcion"]')
  if (percepcionLabel) {
    percepcionLabel.innerHTML = '<i class="bi bi-eye me-1"></i> Percepción'
  }

  const destrezaLabel = document.querySelector('label[for="destreza"]')
  if (destrezaLabel) {
    destrezaLabel.innerHTML = '<i class="bi bi-hand me-1"></i> Destreza'
  }

  const agilidadLabel = document.querySelector('label[for="agilidad"]')
  if (agilidadLabel) {
    agilidadLabel.innerHTML = '<i class="bi bi-lightning me-1"></i> Agilidad'
  }

  const inteligenciaLabel = document.querySelector('label[for="inteligencia"]')
  if (inteligenciaLabel) {
    inteligenciaLabel.innerHTML = '<i class="bi bi-brain me-1"></i> Inteligencia'
  }

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

  // Añadir iconos a los atributos actuales
  const vidaActualLabel = document.querySelector('label[for="vidaActual"]')
  if (vidaActualLabel) {
    vidaActualLabel.innerHTML = '<i class="bi bi-heart-fill me-1"></i> Vida Actual'
  }

  const aguanteActualLabel = document.querySelector('label[for="aguanteActual"]')
  if (aguanteActualLabel) {
    aguanteActualLabel.innerHTML = '<i class="bi bi-lightning-fill me-1"></i> Aguante Actual'
  }

  const manaActualLabel = document.querySelector('label[for="manaActual"]')
  if (manaActualLabel) {
    manaActualLabel.innerHTML = '<i class="bi bi-magic me-1"></i> Maná Actual'
  }
}

// Exportar funciones
export { cargarAtributos, actualizarAtributoActual, añadirIconosAtributos }
