// Funciones para gestionar el grimorio del personaje
import { generateUUID } from "./utils.js"
import * as bootstrap from "bootstrap"

// Función para cargar el grimorio
function cargarGrimorio() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.grimorio) return

  const grimorio = personaje.grimorio
  const contenedorGrimorio = document.getElementById("grimorio-container")
  if (!contenedorGrimorio) return

  // Limpiar el contenedor
  contenedorGrimorio.innerHTML = ""

  // Si no hay hechizos, mostrar mensaje
  if (grimorio.length === 0) {
    contenedorGrimorio.innerHTML = '<p class="text-center">No tienes hechizos en tu grimorio</p>'
    return
  }

  // Crear la tabla para mostrar los hechizos
  const table = document.createElement("table")
  table.className = "table table-sm table-hover"
  table.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Nivel</th>
        <th>Coste</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <!-- Los hechizos se agregarán dinámicamente -->
    </tbody>
  `

  const tbody = table.querySelector("tbody")

  // Agregar cada hechizo a la tabla
  grimorio.forEach((hechizo) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${hechizo.nombre}</td>
      <td>${hechizo.nivel}</td>
      <td>${hechizo.coste} maná</td>
      <td>
        <button class="btn btn-sm btn-outline-primary edit-spell" data-id="${hechizo.id}" title="Editar">
          <i class="bi bi-pencil"></i>
        </button>
      </td>
    `

    tbody.appendChild(tr)
  })

  contenedorGrimorio.appendChild(table)

  // Agregar eventos a los botones de editar
  document.querySelectorAll(".edit-spell").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id
      abrirModalHechizo(id)
    })
  })

  // Agregar evento al botón de añadir hechizo
  const addSpellBtn = document.getElementById("addSpellBtn")
  if (addSpellBtn) {
    addSpellBtn.addEventListener("click", () => {
      abrirModalHechizo()
    })
  }
}

// Función para abrir el modal de hechizo
function abrirModalHechizo(id = null) {
  const modal = new bootstrap.Modal(document.getElementById("spellModal"))
  const form = document.getElementById("spellForm")
  const deleteBtn = document.getElementById("deleteSpellBtn")

  // Limpiar el formulario
  form.reset()

  if (id) {
    // Editar hechizo existente
    const personaje = JSON.parse(localStorage.getItem("personajeActual"))
    if (!personaje || !personaje.grimorio) return

    const hechizo = personaje.grimorio.find((h) => h.id === id)
    if (!hechizo) return

    document.getElementById("spellModalLabel").textContent = "Editar Hechizo"
    document.getElementById("spellId").value = hechizo.id
    document.getElementById("spellName").value = hechizo.nombre
    document.getElementById("spellLevel").value = hechizo.nivel
    document.getElementById("spellCost").value = hechizo.coste
    document.getElementById("spellEffect").value = hechizo.efecto

    deleteBtn.style.display = "block"

    // Configurar evento para eliminar hechizo
    deleteBtn.onclick = () => {
      eliminarHechizo(id)
      modal.hide()
    }
  } else {
    // Nuevo hechizo
    document.getElementById("spellModalLabel").textContent = "Nuevo Hechizo"
    document.getElementById("spellId").value = ""

    deleteBtn.style.display = "none"
  }

  // Configurar evento para guardar hechizo
  form.onsubmit = (e) => {
    e.preventDefault()
    guardarHechizo()
    modal.hide()
  }

  modal.show()
}

// Función para guardar un hechizo
function guardarHechizo() {
  const id = document.getElementById("spellId").value
  const nombre = document.getElementById("spellName").value
  const nivel = Number.parseInt(document.getElementById("spellLevel").value) || 1
  const coste = Number.parseInt(document.getElementById("spellCost").value) || 0
  const efecto = document.getElementById("spellEffect").value

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  if (!personaje.grimorio) {
    personaje.grimorio = []
  }

  if (id) {
    // Actualizar hechizo existente
    const index = personaje.grimorio.findIndex((h) => h.id === id)
    if (index !== -1) {
      personaje.grimorio[index] = {
        ...personaje.grimorio[index],
        nombre,
        nivel,
        coste,
        efecto,
      }
    }
  } else {
    // Crear nuevo hechizo
    const nuevoHechizo = {
      id: generateUUID(),
      nombre,
      nivel,
      coste,
      efecto,
    }

    personaje.grimorio.push(nuevoHechizo)
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarGrimorio()
}

// Función para eliminar un hechizo
function eliminarHechizo(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.grimorio) return

  personaje.grimorio = personaje.grimorio.filter((h) => h.id !== id)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarGrimorio()
}

// Exportar funciones
export { cargarGrimorio, abrirModalHechizo, guardarHechizo, eliminarHechizo }
