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
        mostrarModalRecurso(personaje, recurso, personaje[recurso])
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
    if (valorElement) {
      valorElement.value = personaje[recurso]
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
export function mostrarModalRecurso(personaje, recurso, valorActual) {
  const resourceModal = document.getElementById("resourceModal")
  const resourceModalContent = document.getElementById("resourceModalContent")

  // Determinar si es un recurso de estado o de inventario
  const esRecursoEstado = ["vida", "aguante", "mana"].includes(recurso)
  const nombreRecurso = obtenerNombreRecurso(recurso)

  // Preparar contenido del modal
  resourceModalContent.innerHTML = `
    <h3>Modificar ${nombreRecurso}</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="resourceCurrentValue">Valor actual:</label>
        <input type="number" id="resourceCurrentValue" min="0" value="${valorActual}">
      </div>
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

  if (addResourceBtn) {
    addResourceBtn.addEventListener("click", function () {
      const recurso = this.dataset.recurso
      const cantidad = Number.parseInt(document.getElementById("resourceAmount").value) || 1
      modificarRecurso(personaje, recurso, cantidad)
      resourceModal.classList.remove("show-modal")
    })
  }

  if (subtractResourceBtn) {
    subtractResourceBtn.addEventListener("click", function () {
      const recurso = this.dataset.recurso
      const cantidad = Number.parseInt(document.getElementById("resourceAmount").value) || 1
      modificarRecurso(personaje, recurso, -cantidad)
      resourceModal.classList.remove("show-modal")
    })
  }

  if (setResourceBtn) {
    setResourceBtn.addEventListener("click", function () {
      const recurso = this.dataset.recurso
      const nuevoValor = Number.parseInt(document.getElementById("resourceCurrentValue").value) || 0
      establecerValorRecurso(personaje, recurso, nuevoValor)
      resourceModal.classList.remove("show-modal")
    })
  }
}

// Función para modificar un recurso (agregar o restar)
export function modificarRecurso(personaje, recurso, cantidad) {
  // Determinar si es un recurso de estado o de inventario
  const esRecursoEstado = ["vida", "aguante", "mana"].includes(recurso)

  if (esRecursoEstado) {
    // Es un recurso de estado
    const valorActual = personaje[recurso]
    const nuevoValor = Math.max(0, valorActual + cantidad) // Asegurar que no sea negativo
    personaje[recurso] = nuevoValor
  } else {
    // Es un recurso de inventario
    const valorActual = personaje.inventario[recurso]
    const nuevoValor = Math.max(0, valorActual + cantidad) // Asegurar que no sea negativo
    personaje.inventario[recurso] = nuevoValor
  }

  // Guardar cambios y actualizar interfaz
  guardarPersonaje(personaje)
  actualizarValoresRecursos(personaje)
}

// Función para establecer directamente el valor de un recurso
export function establecerValorRecurso(personaje, recurso, nuevoValor) {
  // Asegurar que el valor no sea negativo
  nuevoValor = Math.max(0, nuevoValor)

  // Determinar si es un recurso de estado o de inventario
  const esRecursoEstado = ["vida", "aguante", "mana"].includes(recurso)

  if (esRecursoEstado) {
    // Es un recurso de estado
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
