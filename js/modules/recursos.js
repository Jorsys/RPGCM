// Módulo para la gestión de recursos (vida, aguante, maná, monedas, etc.)

import { guardarPersonaje } from "./personaje.js"

// Función para inicializar los recursos
export function inicializarRecursos(personaje) {
  // Configurar los recursos de estado (vida, aguante, maná)
  const estadoRecursos = ["vida", "aguante", "mana"]
  estadoRecursos.forEach((recurso) => {
    const valorElement = document.getElementById(recurso)
    if (valorElement) {
      // Hacer que el valor sea clicable
      valorElement.classList.add("clickable-value")
      valorElement.addEventListener("click", () => {
        mostrarModalRecurso(personaje, recurso, personaje[recurso], personaje[`${recurso}Max`])
      })
    }
  })

  // Configurar los recursos de inventario (monedas, ganzúas, antorchas, cuerdas)
  const inventarioRecursos = ["monedas", "ganzuas", "antorchas", "cuerdas"]
  inventarioRecursos.forEach((recurso) => {
    const valorElement = document.getElementById(`${recurso}-value`)
    if (valorElement) {
      // Hacer que el valor sea clicable
      valorElement.classList.add("clickable-value")
      valorElement.addEventListener("click", () => {
        mostrarModalRecurso(personaje, recurso, personaje.inventario[recurso])
      })
    }
  })

  // Actualizar los valores iniciales
  actualizarValoresRecursos(personaje)
}

// Función para actualizar los valores de los recursos en la interfaz
export function actualizarValoresRecursos(personaje) {
  // Actualizar recursos de estado
  const estadoRecursos = ["vida", "aguante", "mana"]
  estadoRecursos.forEach((recurso) => {
    const valorElement = document.getElementById(recurso)
    const valorMaxElement = document.getElementById(`${recurso}Max`)

    if (valorElement) {
      valorElement.value = personaje[recurso]
    }

    if (valorMaxElement) {
      valorMaxElement.value = personaje[`${recurso}Max`]
    }
  })

  // Actualizar recursos de inventario
  const inventarioRecursos = ["monedas", "ganzuas", "antorchas", "cuerdas"]
  inventarioRecursos.forEach((recurso) => {
    const valorElement = document.getElementById(`${recurso}-value`)
    if (valorElement) {
      valorElement.textContent = personaje.inventario[recurso]
    }
  })
}

// Función para mostrar el modal de recurso
export function mostrarModalRecurso(personaje, recurso, valorActual, valorMaximo = null) {
  const resourceModal = document.getElementById("resourceModal")
  const resourceModalContent = document.getElementById("resourceModalContent")

  // Determinar si es un recurso de estado o de inventario
  const esRecursoEstado = ["vida", "aguante", "mana"].includes(recurso)
  const nombreRecurso = obtenerNombreRecurso(recurso)

  // Guardar el valor original para poder restaurarlo si se cierra el modal sin guardar
  const valorOriginal = valorActual

  // Preparar contenido del modal
  resourceModalContent.innerHTML = `
    <h3>Modificar ${nombreRecurso}</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="resourceCurrentValue">Valor actual:</label>
        <input type="number" id="resourceCurrentValue" min="0" ${valorMaximo ? `max="${valorMaximo}"` : ""} value="${valorActual}">
      </div>
      ${
        valorMaximo
          ? `<div class="form-group">
        <label for="resourceMaxValue">Valor máximo:</label>
        <input type="number" id="resourceMaxValue" value="${valorMaximo}" readonly class="max-value">
      </div>`
          : ""
      }
      <div class="form-group">
        <label for="resourceAmount">Cantidad a modificar:</label>
        <input type="number" id="resourceAmount" min="1" value="1">
      </div>
    </div>
    <div class="form-actions">
      <button id="addResourceBtn" class="btn" data-recurso="${recurso}">
        <i class="fas fa-plus"></i> Agregar
      </button>
      <button id="subtractResourceBtn" class="btn" data-recurso="${recurso}">
        <i class="fas fa-minus"></i> Restar
      </button>
      <button id="setResourceBtn" class="btn btn-primary" data-recurso="${recurso}">
        Establecer Valor
      </button>
    </div>
  `

  // Mostrar modal
  resourceModal.classList.add("show-modal")

  // Configurar botones
  const addResourceBtn = document.getElementById("addResourceBtn")
  const subtractResourceBtn = document.getElementById("subtractResourceBtn")
  const setResourceBtn = document.getElementById("setResourceBtn")
  const resourceCurrentValue = document.getElementById("resourceCurrentValue")

  if (addResourceBtn) {
    // Eliminar event listeners anteriores
    const newAddResourceBtn = addResourceBtn.cloneNode(true)
    addResourceBtn.parentNode.replaceChild(newAddResourceBtn, addResourceBtn)

    newAddResourceBtn.addEventListener("click", () => {
      const cantidad = Number.parseInt(document.getElementById("resourceAmount").value) || 1
      let nuevoValor = Number.parseInt(resourceCurrentValue.value) + cantidad

      // Asegurar que no exceda el máximo si existe
      if (valorMaximo !== null) {
        nuevoValor = Math.min(nuevoValor, valorMaximo)
      }

      // Actualizar solo el valor en el modal
      resourceCurrentValue.value = nuevoValor
    })
  }

  if (subtractResourceBtn) {
    // Eliminar event listeners anteriores
    const newSubtractResourceBtn = subtractResourceBtn.cloneNode(true)
    subtractResourceBtn.parentNode.replaceChild(newSubtractResourceBtn, subtractResourceBtn)

    newSubtractResourceBtn.addEventListener("click", () => {
      const cantidad = Number.parseInt(document.getElementById("resourceAmount").value) || 1
      let nuevoValor = Number.parseInt(resourceCurrentValue.value) - cantidad

      // Asegurar que no sea negativo
      nuevoValor = Math.max(0, nuevoValor)

      // Actualizar solo el valor en el modal
      resourceCurrentValue.value = nuevoValor
    })
  }

  if (setResourceBtn) {
    // Eliminar event listeners anteriores
    const newSetResourceBtn = setResourceBtn.cloneNode(true)
    setResourceBtn.parentNode.replaceChild(newSetResourceBtn, setResourceBtn)

    newSetResourceBtn.addEventListener("click", function () {
      const recurso = this.dataset.recurso
      const nuevoValor = Number.parseInt(resourceCurrentValue.value) || 0

      // Aplicar el cambio al personaje
      establecerValorRecurso(personaje, recurso, nuevoValor)

      // Cerrar modal
      resourceModal.classList.remove("show-modal")
    })
  }

  // Configurar cierre del modal sin guardar cambios
  const closeResourceModal = document.getElementById("closeResourceModal")
  if (closeResourceModal) {
    // Eliminar event listeners anteriores
    const newCloseResourceModal = closeResourceModal.cloneNode(true)
    closeResourceModal.parentNode.replaceChild(newCloseResourceModal, closeResourceModal)

    newCloseResourceModal.addEventListener("click", () => {
      // No guardar cambios, cerrar modal
      resourceModal.classList.remove("show-modal")
    })
  }

  // También cerrar al hacer clic fuera del modal sin guardar cambios
  window.addEventListener("click", (event) => {
    if (event.target === resourceModal) {
      resourceModal.classList.remove("show-modal")
    }
  })
}

// Función para establecer directamente el valor de un recurso
export function establecerValorRecurso(personaje, recurso, nuevoValor) {
  // Asegurar que el valor no sea negativo
  nuevoValor = Math.max(0, nuevoValor)

  // Determinar si es un recurso de estado o de inventario
  const esRecursoEstado = ["vida", "aguante", "mana"].includes(recurso)

  if (esRecursoEstado) {
    // Es un recurso de estado
    // Asegurar que no supere el valor máximo
    const valorMaximo = personaje[`${recurso}Max`]
    nuevoValor = Math.min(nuevoValor, valorMaximo)
    personaje[recurso] = nuevoValor
  } else {
    // Es un recurso de inventario
    personaje.inventario[recurso] = nuevoValor
  }

  // Guardar cambios y actualizar interfaz
  guardarPersonaje(personaje)
  actualizarValoresRecursos(personaje)
}

// Función para obtener el nombre legible de un recurso
function obtenerNombreRecurso(recurso) {
  const nombres = {
    vida: "Vida",
    aguante: "Aguante",
    mana: "Maná",
    monedas: "Monedas",
    ganzuas: "Ganzúas",
    antorchas: "Antorchas",
    cuerdas: "Cuerdas",
  }
  return nombres[recurso] || recurso
}

// Función para configurar el cierre del modal de recursos
export function configurarCierreModalRecursos() {
  const closeResourceModal = document.getElementById("closeResourceModal")
  const resourceModal = document.getElementById("resourceModal")

  if (closeResourceModal && resourceModal) {
    closeResourceModal.addEventListener("click", () => {
      resourceModal.classList.remove("show-modal")
    })

    // También cerrar al hacer clic fuera del modal
    window.addEventListener("click", (event) => {
      if (event.target === resourceModal) {
        resourceModal.classList.remove("show-modal")
      }
    })
  }
}
