// Funciones para gestionar la edición de atributos del personaje

// Función para cargar los atributos en el formulario de edición
function cargarAtributosEdicion() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Cargar atributos básicos
  document.getElementById("nivel").value = personaje.nivel || "1"
  document.getElementById("clase").value = personaje.clase || ""

  // Cargar atributos básicos
  document.getElementById("percepcion").value = personaje.atributos?.percepcion || 0
  document.getElementById("destreza").value = personaje.atributos?.destreza || 0
  document.getElementById("agilidad").value = personaje.atributos?.agilidad || 0
  document.getElementById("inteligencia").value = personaje.atributos?.inteligencia || 0

  // Cargar habilidades de percepción
  document.getElementById("buscar").value = personaje.atributos?.buscar || 0
  document.getElementById("sigilo").value = personaje.atributos?.sigilo || 0
  document.getElementById("observar").value = personaje.atributos?.observar || 0

  // Cargar habilidades de destreza
  document.getElementById("cerradura").value = personaje.atributos?.cerradura || 0
  document.getElementById("trampas").value = personaje.atributos?.trampas || 0
  document.getElementById("manipularObjetos").value = personaje.atributos?.manipularObjetos || 0

  // Cargar habilidades de agilidad
  document.getElementById("acrobacia").value = personaje.atributos?.acrobacia || 0
  document.getElementById("desarmar").value = personaje.atributos?.desarmar || 0
  document.getElementById("equitacion").value = personaje.atributos?.equitacion || 0

  // Cargar habilidades de inteligencia
  document.getElementById("elocuencia").value = personaje.atributos?.elocuencia || 0
  document.getElementById("resolver").value = personaje.atributos?.resolver || 0

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

  // Guardar atributos básicos
  personaje.atributos.percepcion = Number.parseInt(document.getElementById("percepcion").value) || 0
  personaje.atributos.destreza = Number.parseInt(document.getElementById("destreza").value) || 0
  personaje.atributos.agilidad = Number.parseInt(document.getElementById("agilidad").value) || 0
  personaje.atributos.inteligencia = Number.parseInt(document.getElementById("inteligencia").value) || 0

  // Guardar habilidades de percepción
  personaje.atributos.buscar = Number.parseInt(document.getElementById("buscar").value) || 0
  personaje.atributos.sigilo = Number.parseInt(document.getElementById("sigilo").value) || 0
  personaje.atributos.observar = Number.parseInt(document.getElementById("observar").value) || 0

  // Guardar habilidades de destreza
  personaje.atributos.cerradura = Number.parseInt(document.getElementById("cerradura").value) || 0
  personaje.atributos.trampas = Number.parseInt(document.getElementById("trampas").value) || 0
  personaje.atributos.manipularObjetos = Number.parseInt(document.getElementById("manipularObjetos").value) || 0

  // Guardar habilidades de agilidad
  personaje.atributos.acrobacia = Number.parseInt(document.getElementById("acrobacia").value) || 0
  personaje.atributos.desarmar = Number.parseInt(document.getElementById("desarmar").value) || 0
  personaje.atributos.equitacion = Number.parseInt(document.getElementById("equitacion").value) || 0

  // Guardar habilidades de inteligencia
  personaje.atributos.elocuencia = Number.parseInt(document.getElementById("elocuencia").value) || 0
  personaje.atributos.resolver = Number.parseInt(document.getElementById("resolver").value) || 0

  // Guardar atributos derivados
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

  // Añadir iconos a las habilidades de percepción
  const buscarLabel = document.querySelector('label[for="buscar"]')
  if (buscarLabel) {
    buscarLabel.innerHTML = '<i class="bi bi-search me-1"></i> Buscar'
  }

  const sigiloLabel = document.querySelector('label[for="sigilo"]')
  if (sigiloLabel) {
    sigiloLabel.innerHTML = '<i class="bi bi-person-fill-lock me-1"></i> Sigilo'
  }

  const observarLabel = document.querySelector('label[for="observar"]')
  if (observarLabel) {
    observarLabel.innerHTML = '<i class="bi bi-binoculars me-1"></i> Observar'
  }

  // Añadir iconos a las habilidades de destreza
  const cerraduraLabel = document.querySelector('label[for="cerradura"]')
  if (cerraduraLabel) {
    cerraduraLabel.innerHTML = '<i class="bi bi-key me-1"></i> Cerradura'
  }

  const trampasLabel = document.querySelector('label[for="trampas"]')
  if (trampasLabel) {
    trampasLabel.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i> Trampas'
  }

  const manipularObjetosLabel = document.querySelector('label[for="manipularObjetos"]')
  if (manipularObjetosLabel) {
    manipularObjetosLabel.innerHTML = '<i class="bi bi-tools me-1"></i> Manipular Objetos'
  }

  // Añadir iconos a las habilidades de agilidad
  const acrobaciaLabel = document.querySelector('label[for="acrobacia"]')
  if (acrobaciaLabel) {
    acrobaciaLabel.innerHTML = '<i class="bi bi-person-walking me-1"></i> Acrobacia'
  }

  const desarmarLabel = document.querySelector('label[for="desarmar"]')
  if (desarmarLabel) {
    desarmarLabel.innerHTML = '<i class="bi bi-shield-slash me-1"></i> Desarmar'
  }

  const equitacionLabel = document.querySelector('label[for="equitacion"]')
  if (equitacionLabel) {
    equitacionLabel.innerHTML = '<i class="bi bi-bicycle me-1"></i> Equitación'
  }

  // Añadir iconos a las habilidades de inteligencia
  const elocuenciaLabel = document.querySelector('label[for="elocuencia"]')
  if (elocuenciaLabel) {
    elocuenciaLabel.innerHTML = '<i class="bi bi-chat-quote me-1"></i> Elocuencia'
  }

  const resolverLabel = document.querySelector('label[for="resolver"]')
  if (resolverLabel) {
    resolverLabel.innerHTML = '<i class="bi bi-puzzle me-1"></i> Resolver'
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
}

// Exportar funciones
export { cargarAtributosEdicion, guardarAtributosEdicion, añadirIconosAtributosEdicion }
