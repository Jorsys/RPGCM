// Módulo para la gestión de atributos derivados

import { guardarPersonaje } from "./personaje.js"

// Lista de subatributos por grupo
const subatributosPorGrupo = {
  percepcion: ["buscar", "sigilo", "observar"],
  destreza: ["cerradura", "trampas", "manipularObjetos"],
  agilidad: ["acrobacia", "desarmar", "equitacion"],
  inteligencia: ["elocuencia", "resolver"],
}

// Función para inicializar los atributos derivados
export function inicializarAtributosDerivados(personaje) {
  // Asegurar que existe la estructura de atributos derivados
  if (!personaje.atributosDerivedos) {
    personaje.atributosDerivedos = {
      percepcion: 0,
      destreza: 0,
      agilidad: 0,
      inteligencia: 0,
    }
  }

  // Asegurar que existen los subatributos
  if (!personaje.subatributos) {
    personaje.subatributos = {
      buscar: 0,
      sigilo: 0,
      observar: 0,
      cerradura: 0,
      trampas: 0,
      manipularObjetos: 0,
      acrobacia: 0,
      desarmar: 0,
      equitacion: 0,
      elocuencia: 0,
      resolver: 0,
    }
  }

  // Configurar event listeners para los inputs de subatributos
  Object.keys(subatributosPorGrupo).forEach((grupo) => {
    subatributosPorGrupo[grupo].forEach((subatributo) => {
      const input = document.getElementById(subatributo)
      if (input) {
        input.value = personaje.subatributos[subatributo] || 0

        // Añadir event listener para actualizar al cambiar
        input.addEventListener("change", () => {
          personaje.subatributos[subatributo] = Number.parseInt(input.value) || 0
          calcularAtributosDerivados(personaje)
          guardarPersonaje(personaje)
        })
      }
    })
  })

  // Calcular valores iniciales
  calcularAtributosDerivados(personaje)
}

// Función para calcular los atributos derivados
export function calcularAtributosDerivados(personaje) {
  // Calcular cada atributo derivado como la suma de sus subatributos
  Object.keys(subatributosPorGrupo).forEach((grupo) => {
    const total = subatributosPorGrupo[grupo].reduce((sum, subatributo) => {
      return sum + (personaje.subatributos[subatributo] || 0)
    }, 0)

    personaje.atributosDerivedos[grupo] = total

    // Actualizar el valor en la interfaz
    const totalElement = document.getElementById(grupo)
    if (totalElement) {
      totalElement.textContent = total.toString()
    }
  })
}

// Función para actualizar la interfaz con los valores de los subatributos
export function actualizarInterfazSubatributos(personaje) {
  if (!personaje.subatributos) return

  // Actualizar cada input con su valor correspondiente
  Object.keys(personaje.subatributos).forEach((subatributo) => {
    const input = document.getElementById(subatributo)
    if (input) {
      input.value = personaje.subatributos[subatributo] || 0
    }
  })

  // Actualizar los totales
  Object.keys(subatributosPorGrupo).forEach((grupo) => {
    const totalElement = document.getElementById(grupo)
    if (totalElement) {
      totalElement.textContent = personaje.atributosDerivedos[grupo].toString()
    }
  })
}
