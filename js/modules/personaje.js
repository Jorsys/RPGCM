// Módulo para la gestión del personaje

import { fillField } from "./utils.js"

// Función para cargar los datos del personaje
export function cargarPersonaje() {
  // Obtener el nombre del personaje de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const characterName = urlParams.get("nombre")

  if (!characterName) {
    alert("No se ha especificado un personaje.")
    window.location.href = "personaje.html"
    return null
  }

  // Cargar datos del personaje
  const characterData = localStorage.getItem(characterName + ".json")
  if (!characterData) {
    alert("No se encontró el personaje especificado.")
    window.location.href = "personaje.html"
    return null
  }

  const personaje = JSON.parse(characterData)
  console.log("Personaje cargado:", personaje)

  // Inicializar estructura de datos si no existe
  if (!personaje.grimorio) {
    personaje.grimorio = []
  }

  if (!personaje.equipados) {
    personaje.equipados = []
  }

  if (!personaje.inventario) {
    personaje.inventario = {
      armaduras: [],
      armas: [],
      municion: [],
      pociones: [],
      pergaminos: [],
      monedas: 0,
      ganzuas: 0,
      antorchas: 0,
      cuerdas: 0,
      otros: [],
    }
  }

  // Inicializar atributos derivados si no existen
  if (!personaje.atributosDerivedos) {
    personaje.atributosDerivedos = {
      percepcion: 0,
      destreza: 0,
      agilidad: 0,
      inteligencia: 0,
    }
  }

  // Inicializar bolsas especiales si no existen
  if (!personaje.bolsasEspeciales) {
    personaje.bolsasEspeciales = []
  }

  // Asegurar que existen todas las categorías de inventario
  const categorias = ["armaduras", "armas", "municion", "pociones", "pergaminos", "otros"]
  categorias.forEach((categoria) => {
    if (!personaje.inventario[categoria]) {
      personaje.inventario[categoria] = []
    }
  })

  // Asegurar que existen los contadores simples
  const contadoresSimples = ["monedas", "ganzuas", "antorchas", "cuerdas"]
  contadoresSimples.forEach((contador) => {
    if (personaje.inventario[contador] === undefined) {
      personaje.inventario[contador] = 0
    }
  })

  // Asegurar que todos los objetos tienen coste
  categorias.forEach((categoria) => {
    personaje.inventario[categoria].forEach((item) => {
      if (item.coste === undefined) {
        item.coste = 0
      }
    })
  })

  // Asegurar que existen los valores máximos de vida, aguante y maná
  if (!personaje.vidaMax) {
    personaje.vidaMax = personaje.vida || 10
  }
  if (!personaje.aguanteMax) {
    personaje.aguanteMax = personaje.aguante || 10
  }
  if (!personaje.manaMax) {
    personaje.manaMax = personaje.mana || 10
  }

  // Asegurar que los valores actuales no superan los máximos
  if (personaje.vida > personaje.vidaMax) {
    personaje.vida = personaje.vidaMax
  }
  if (personaje.aguante > personaje.aguanteMax) {
    personaje.aguante = personaje.aguanteMax
  }
  if (personaje.mana > personaje.manaMax) {
    personaje.mana = personaje.manaMax
  }

  return personaje
}

// Función para guardar el personaje
export function guardarPersonaje(personaje) {
  if (window.saveDataAndSync) {
    window.saveDataAndSync(personaje.nombre + ".json", personaje)
  } else {
    localStorage.setItem(personaje.nombre + ".json", JSON.stringify(personaje))
  }
  console.log("Personaje guardado:", personaje)
}

// Función para actualizar la interfaz con los datos del personaje
export function actualizarInterfazPersonaje(personaje) {
  // Actualizar título de la página
  const characterNameElement = document.getElementById("characterName")
  if (characterNameElement) {
    characterNameElement.textContent = `Ficha de ${personaje.nombre}`
  }

  // Rellenar campos del formulario
  fillField("nombre", personaje.nombre)
  fillField("raza", personaje.raza)
  fillField("nivel", personaje.nivel)
  fillField("clase", personaje.clase)
  fillField("combateCuerpo", personaje.combateCuerpo)
  fillField("combateDistancia", personaje.combateDistancia)
  fillField("lanzamientoHechizos", personaje.lanzamientoHechizos)

  // Actualizar valores de vida, aguante y maná
  actualizarValoresRecursos(personaje)
}

// Función para actualizar los valores de vida, aguante y maná en la interfaz
export function actualizarValoresRecursos(personaje) {
  // Actualizar valores actuales
  fillField("vida", personaje.vida)
  fillField("aguante", personaje.aguante)
  fillField("mana", personaje.mana)

  // Actualizar valores máximos
  fillField("vidaMax", personaje.vidaMax)
  fillField("aguanteMax", personaje.aguanteMax)
  fillField("manaMax", personaje.manaMax)
}

// Función para calcular los atributos derivados
export function calcularAtributosDerivados(personaje) {
  // Aquí implementarías la lógica para calcular los atributos derivados
  const percepcion = Number(personaje.combateCuerpo || 0) + Number(personaje.combateDistancia || 0)
  const destreza = Number(personaje.combateCuerpo || 0) + Number(personaje.lanzamientoHechizos || 0)
  const agilidad = Number(personaje.combateDistancia || 0) + Number(personaje.lanzamientoHechizos || 0)
  const inteligencia =
    Number(personaje.combateCuerpo || 0) +
    Number(personaje.combateDistancia || 0) +
    Number(personaje.lanzamientoHechizos || 0)

  // Actualizar los valores en el personaje
  personaje.atributosDerivedos = {
    percepcion,
    destreza,
    agilidad,
    inteligencia,
  }

  // Actualizar los campos en el formulario
  fillField("percepcion", percepcion)
  fillField("destreza", destreza)
  fillField("agilidad", agilidad)
  fillField("inteligencia", inteligencia)

  guardarPersonaje(personaje)
}
