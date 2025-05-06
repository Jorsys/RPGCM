// Funciones para gestionar los recursos del personaje
let recursos = []

// Importar funciones necesarias
import { actualizarPesoTotal } from "./peso.js" // Importa la función para actualizar el peso total
import { generateUUID } from "./utils.js" // Importa la función para generar UUIDs
import { cargarBolsasEspeciales } from "./bolsas.js" // Importa la función para cargar las bolsas especiales
import * as bootstrap from "bootstrap" // Importa Bootstrap

// Función para cargar los recursos
function cargarRecursos() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje && personaje.recursos) {
    recursos = personaje.recursos
  } else {
    recursos = []
  }

  actualizarVistaRecursos()
}

// Función para actualizar la vista de recursos
function actualizarVistaRecursos() {
  const contenedorRecursos = document.getElementById("recursos-container")
  if (!contenedorRecursos) return

  contenedorRecursos.innerHTML = ""

  if (recursos.length === 0) {
    contenedorRecursos.innerHTML = '<p class="text-center">No hay recursos disponibles</p>'
    return
  }

  recursos.forEach((recurso) => {
    const card = document.createElement("div")
    card.className = "card mb-2"
    card.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="card-title mb-0">${recurso.nombre}</h6>
                    <div>
                        <span class="badge bg-primary me-1">${recurso.cantidad}</span>
                        <button class="btn btn-sm btn-outline-primary edit-resource" data-id="${recurso.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </div>
                <p class="card-text small mb-0">Peso: ${(recurso.peso * recurso.cantidad).toFixed(2)} kg | Valor: ${recurso.valor * recurso.cantidad} mo</p>
            </div>
        `

    contenedorRecursos.appendChild(card)

    // Agregar evento al botón de editar
    card.querySelector(".edit-resource").addEventListener("click", () => {
      abrirModalRecurso(recurso.id)
    })
  })

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para abrir el modal de recurso
function abrirModalRecurso(id = null) {
  const modal = new bootstrap.Modal(document.getElementById("resourceModal"))
  const form = document.getElementById("resourceForm")
  const deleteBtn = document.getElementById("deleteResourceBtn")
  const moveResourceToBagBtn = document.getElementById("moveResourceToBagBtn")

  // Limpiar el formulario
  form.reset()

  if (id) {
    // Editar recurso existente
    const recurso = recursos.find((r) => r.id === id)
    if (recurso) {
      document.getElementById("resourceId").value = recurso.id
      document.getElementById("resourceName").value = recurso.nombre
      document.getElementById("resourceQuantity").value = recurso.cantidad
      document.getElementById("resourceWeight").value = recurso.peso
      document.getElementById("resourceValue").value = recurso.valor
      document.getElementById("resourceDescription").value = recurso.descripcion || ""

      deleteBtn.style.display = "block"
      moveResourceToBagBtn.style.display = "block"

      // Configurar evento para eliminar recurso
      deleteBtn.onclick = () => {
        eliminarRecurso(id)
        modal.hide()
      }

      // Configurar evento para mover recurso a bolsa especial
      moveResourceToBagBtn.onclick = () => {
        prepararMoverRecursoABolsa(id)
        modal.hide()
      }
    }
  } else {
    // Nuevo recurso
    document.getElementById("resourceId").value = ""
    deleteBtn.style.display = "none"
    moveResourceToBagBtn.style.display = "none"
  }

  // Configurar evento para guardar cambios
  form.onsubmit = (e) => {
    e.preventDefault()
    guardarRecurso()
    modal.hide()
  }

  modal.show()
}

// Función para guardar un recurso
function guardarRecurso() {
  const id = document.getElementById("resourceId").value
  const nombre = document.getElementById("resourceName").value
  const cantidad = Number.parseInt(document.getElementById("resourceQuantity").value)
  const peso = Number.parseFloat(document.getElementById("resourceWeight").value)
  const valor = Number.parseInt(document.getElementById("resourceValue").value)
  const descripcion = document.getElementById("resourceDescription").value

  if (id) {
    // Actualizar recurso existente
    const index = recursos.findIndex((r) => r.id === id)
    if (index !== -1) {
      recursos[index] = {
        ...recursos[index],
        nombre,
        cantidad,
        peso,
        valor,
        descripcion,
      }
    }
  } else {
    // Crear nuevo recurso
    const nuevoRecurso = {
      id: generateUUID(),
      nombre,
      cantidad,
      peso,
      valor,
      descripcion,
    }
    recursos.push(nuevoRecurso)
  }

  // Guardar cambios
  guardarRecursosEnPersonaje()
  actualizarVistaRecursos()
}

// Función para eliminar un recurso
function eliminarRecurso(id) {
  recursos = recursos.filter((r) => r.id !== id)
  guardarRecursosEnPersonaje()
  actualizarVistaRecursos()
}

// Función para guardar los recursos en el personaje
function guardarRecursosEnPersonaje() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje) {
    personaje.recursos = recursos
    localStorage.setItem("personajeActual", JSON.stringify(personaje))
  }
}

// Función para preparar el modal de mover recurso a bolsa especial
function prepararMoverRecursoABolsa(id) {
  const recurso = recursos.find((r) => r.id === id)
  if (!recurso) return

  const modal = new bootstrap.Modal(document.getElementById("moveResourceToBagModal"))
  const form = document.getElementById("moveResourceToBagForm")
  const selectBag = document.getElementById("selectBagForResource")
  const quantityInput = document.getElementById("moveResourceQuantity")

  // Limpiar el formulario
  form.reset()
  selectBag.innerHTML = ""

  // Establecer el ID del recurso
  document.getElementById("moveResourceId").value = id

  // Establecer la cantidad máxima
  quantityInput.max = recurso.cantidad.toString()
  quantityInput.value = "1"

  // Cargar las bolsas especiales
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje && personaje.bolsasEspeciales && personaje.bolsasEspeciales.length > 0) {
    personaje.bolsasEspeciales.forEach((bolsa) => {
      const option = document.createElement("option")
      option.value = bolsa.id
      option.textContent = bolsa.nombre
      selectBag.appendChild(option)
    })
  } else {
    // Si no hay bolsas, mostrar mensaje
    const option = document.createElement("option")
    option.disabled = true
    option.selected = true
    option.textContent = "No hay bolsas disponibles"
    selectBag.appendChild(option)

    // Deshabilitar el botón de enviar
    form.querySelector('button[type="submit"]').disabled = true
  }

  // Configurar evento para mover recurso
  form.onsubmit = (e) => {
    e.preventDefault()
    moverRecursoABolsa()
    modal.hide()
  }

  modal.show()
}

// Función para mover un recurso a una bolsa especial
function moverRecursoABolsa() {
  const recursoId = document.getElementById("moveResourceId").value
  const bolsaId = document.getElementById("selectBagForResource").value
  const cantidad = Number.parseInt(document.getElementById("moveResourceQuantity").value)

  const recurso = recursos.find((r) => r.id === recursoId)
  if (!recurso) return

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.bolsasEspeciales) return

  const bolsa = personaje.bolsasEspeciales.find((b) => b.id === bolsaId)
  if (!bolsa) return

  // Verificar que la cantidad sea válida
  if (cantidad <= 0 || cantidad > recurso.cantidad) return

  // Crear objeto para la bolsa
  const objetoParaBolsa = {
    id: generateUUID(),
    nombre: recurso.nombre,
    tipo: "recurso",
    peso: recurso.peso,
    valor: recurso.valor,
    cantidad: cantidad,
    descripcion: recurso.descripcion || "",
  }

  // Agregar objeto a la bolsa
  if (!bolsa.contenido) {
    bolsa.contenido = []
  }
  bolsa.contenido.push(objetoParaBolsa)

  // Actualizar la cantidad del recurso original
  recurso.cantidad -= cantidad

  // Si la cantidad llega a 0, eliminar el recurso
  if (recurso.cantidad <= 0) {
    recursos = recursos.filter((r) => r.id !== recursoId)
  }

  // Guardar cambios
  personaje.recursos = recursos
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar vistas
  actualizarVistaRecursos()
  if (typeof cargarBolsasEspeciales === "function") {
    cargarBolsasEspeciales()
  }
}

// Exportar funciones
export {
  cargarRecursos,
  actualizarVistaRecursos,
  abrirModalRecurso,
  guardarRecurso,
  eliminarRecurso,
  guardarRecursosEnPersonaje,
  prepararMoverRecursoABolsa,
  moverRecursoABolsa,
}
