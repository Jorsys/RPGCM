// Funciones para gestionar los recursos del personaje
import { actualizarPesoTotal } from "./peso.js"
import { generateUUID } from "./utils.js"
import * as bootstrap from "bootstrap"

// Función para cargar los recursos
function cargarRecursos() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.recursos) return

  const recursos = personaje.recursos
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

  // Agregar evento al botón de añadir recurso
  const addResourceBtn = document.getElementById("addResourceBtn")
  if (addResourceBtn) {
    addResourceBtn.addEventListener("click", () => {
      abrirModalRecurso()
    })
  }

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
    const personaje = JSON.parse(localStorage.getItem("personajeActual"))
    if (!personaje || !personaje.recursos) return

    const recurso = personaje.recursos.find((r) => r.id === id)
    if (!recurso) return

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

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  if (!personaje.recursos) {
    personaje.recursos = []
  }

  if (id) {
    // Actualizar recurso existente
    const index = personaje.recursos.findIndex((r) => r.id === id)
    if (index !== -1) {
      personaje.recursos[index] = {
        ...personaje.recursos[index],
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
    personaje.recursos.push(nuevoRecurso)
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarRecursos()
}

// Función para eliminar un recurso
function eliminarRecurso(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.recursos) return

  personaje.recursos = personaje.recursos.filter((r) => r.id !== id)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarRecursos()
}

// Función para preparar el modal de mover recurso a bolsa especial
function prepararMoverRecursoABolsa(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.recursos) return

  const recurso = personaje.recursos.find((r) => r.id === id)
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
  if (personaje.bolsasEspeciales && personaje.bolsasEspeciales.length > 0) {
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

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.recursos || !personaje.bolsasEspeciales) return

  const recursoIndex = personaje.recursos.findIndex((r) => r.id === recursoId)
  if (recursoIndex === -1) return

  const recurso = personaje.recursos[recursoIndex]
  const bolsaIndex = personaje.bolsasEspeciales.findIndex((b) => b.id === bolsaId)
  if (bolsaIndex === -1) return

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
  if (!personaje.bolsasEspeciales[bolsaIndex].contenido) {
    personaje.bolsasEspeciales[bolsaIndex].contenido = []
  }
  personaje.bolsasEspeciales[bolsaIndex].contenido.push(objetoParaBolsa)

  // Actualizar la cantidad del recurso original
  personaje.recursos[recursoIndex].cantidad -= cantidad

  // Si la cantidad llega a 0, eliminar el recurso
  if (personaje.recursos[recursoIndex].cantidad <= 0) {
    personaje.recursos = personaje.recursos.filter((r) => r.id !== recursoId)
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar vistas
  cargarRecursos()
}

// Exportar funciones
export {
  cargarRecursos,
  abrirModalRecurso,
  guardarRecurso,
  eliminarRecurso,
  prepararMoverRecursoABolsa,
  moverRecursoABolsa,
}
