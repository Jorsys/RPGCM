// Archivo principal para bolsas especiales
// Este archivo importa y exporta todas las funciones relacionadas con bolsas

import { generateUUID } from "./utils.js"
import { actualizarPesoTotal } from "./peso.js"
import { cargarInventarioAcordeon } from "./inventario.js"
import * as bootstrap from "bootstrap"

// Función para cargar las bolsas especiales
function cargarBolsasEspeciales() {
  const contenedorBolsas = document.getElementById("special-bags-container")
  if (!contenedorBolsas) return

  const bolsas = obtenerBolsasEspeciales()

  // Limpiar el contenedor
  contenedorBolsas.innerHTML = ""

  // Si no hay bolsas, mostrar mensaje
  if (bolsas.length === 0) {
    contenedorBolsas.innerHTML = `
            <div class="text-center mb-3">
                <p>No tienes bolsas especiales</p>
                <button class="btn btn-sm btn-primary" id="createBagBtn">
                    <i class="bi bi-plus-circle me-1"></i> Crear bolsa
                </button>
            </div>
        `

    // Agregar evento al botón de crear bolsa
    document.getElementById("createBagBtn").addEventListener("click", abrirModalCrearBolsa)
    return
  }

  // Crear el acordeón para las bolsas
  const accordion = document.createElement("div")
  accordion.className = "accordion mb-3"
  accordion.id = "specialBagsAccordion"

  // Agregar cada bolsa al acordeón
  bolsas.forEach((bolsa) => {
    const pesoTotal = calcularPesoBolsa(bolsa.id).toFixed(2)
    const cantidadObjetos = bolsa.contenido ? bolsa.contenido.length : 0

    const accordionItem = document.createElement("div")
    accordionItem.className = "accordion-item"
    accordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading-bag-${bolsa.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse-bag-${bolsa.id}" aria-expanded="false" 
                        aria-controls="collapse-bag-${bolsa.id}">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <span>${bolsa.nombre}</span>
                        <span class="badge bg-secondary me-2">${cantidadObjetos} objetos | ${pesoTotal} kg</span>
                    </div>
                </button>
            </h2>
            <div id="collapse-bag-${bolsa.id}" class="accordion-collapse collapse" 
                 aria-labelledby="heading-bag-${bolsa.id}" data-bs-parent="#specialBagsAccordion">
                <div class="accordion-body p-2">
                    <div class="d-flex justify-content-between mb-2">
                        <button class="btn btn-sm btn-outline-danger delete-bag" data-id="${bolsa.id}">
                            <i class="bi bi-trash"></i> Eliminar bolsa
                        </button>
                        <button class="btn btn-sm btn-outline-primary add-item-to-bag" data-id="${bolsa.id}">
                            <i class="bi bi-plus-circle"></i> Añadir objeto
                        </button>
                    </div>
                    <div class="bag-content" id="bag-content-${bolsa.id}">
                        <!-- El contenido se cargará dinámicamente -->
                    </div>
                </div>
            </div>
        `

    accordion.appendChild(accordionItem)
  })

  // Agregar el botón de crear bolsa
  const createBagBtn = document.createElement("button")
  createBagBtn.className = "btn btn-sm btn-primary w-100"
  createBagBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i> Crear bolsa'
  createBagBtn.id = "createBagBtn"

  // Agregar elementos al contenedor
  contenedorBolsas.appendChild(accordion)
  contenedorBolsas.appendChild(createBagBtn)

  // Agregar eventos a los botones
  document.querySelectorAll(".delete-bag").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bolsaId = e.currentTarget.dataset.id
      confirmarEliminarBolsa(bolsaId)
    })
  })

  document.querySelectorAll(".add-item-to-bag").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bolsaId = e.currentTarget.dataset.id
      abrirModalAgregarObjetoABolsa(bolsaId)
    })
  })

  document.getElementById("createBagBtn").addEventListener("click", abrirModalCrearBolsa)

  // Cargar el contenido de cada bolsa
  bolsas.forEach((bolsa) => {
    cargarContenidoBolsa(bolsa.id)
  })
}

// Función para obtener las bolsas especiales del personaje
function obtenerBolsasEspeciales() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje && personaje.bolsasEspeciales) {
    return personaje.bolsasEspeciales
  }
  return []
}

// Función para guardar las bolsas especiales en el personaje
function guardarBolsasEspeciales(bolsas) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje) {
    personaje.bolsasEspeciales = bolsas
    localStorage.setItem("personajeActual", JSON.stringify(personaje))
  }
}

// Función para crear una nueva bolsa especial
function crearBolsaEspecial(nombre, descripcion = "") {
  const bolsas = obtenerBolsasEspeciales()

  const nuevaBolsa = {
    id: generateUUID(),
    nombre,
    descripcion,
    contenido: [],
  }

  bolsas.push(nuevaBolsa)
  guardarBolsasEspeciales(bolsas)

  return nuevaBolsa
}

// Función para eliminar una bolsa especial
function eliminarBolsaEspecial(id) {
  let bolsas = obtenerBolsasEspeciales()

  // Verificar si la bolsa tiene contenido
  const bolsa = bolsas.find((b) => b.id === id)
  if (bolsa && bolsa.contenido && bolsa.contenido.length > 0) {
    // Mover el contenido al inventario
    const personaje = JSON.parse(localStorage.getItem("personajeActual"))
    if (personaje) {
      if (!personaje.inventario) {
        personaje.inventario = []
      }

      personaje.inventario = [...personaje.inventario, ...bolsa.contenido]
      localStorage.setItem("personajeActual", JSON.stringify(personaje))
    }
  }

  // Eliminar la bolsa
  bolsas = bolsas.filter((b) => b.id !== id)
  guardarBolsasEspeciales(bolsas)
}

// Función para confirmar la eliminación de una bolsa
function confirmarEliminarBolsa(bolsaId) {
  if (confirm("¿Estás seguro de que deseas eliminar esta bolsa? Su contenido se moverá al inventario.")) {
    eliminarBolsaEspecial(bolsaId)
    cargarBolsasEspeciales()

    // Actualizar el inventario si está disponible
    cargarInventarioAcordeon()

    // Actualizar el peso total
    actualizarPesoTotal()
  }
}

// Función para abrir el modal de crear bolsa
function abrirModalCrearBolsa() {
  const modal = new bootstrap.Modal(document.getElementById("createBagModal"))
  const form = document.getElementById("createBagForm")

  // Limpiar el formulario
  form.reset()

  // Configurar evento para guardar la bolsa
  form.onsubmit = (e) => {
    e.preventDefault()

    const nombre = document.getElementById("bagName").value
    const descripcion = document.getElementById("bagDescription").value

    crearBolsaEspecial(nombre, descripcion)
    cargarBolsasEspeciales()

    modal.hide()
  }

  modal.show()
}

// Función para cargar el contenido de una bolsa
function cargarContenidoBolsa(bolsaId) {
  const contenedor = document.getElementById(`bag-content-${bolsaId}`)
  if (!contenedor) return

  const bolsas = obtenerBolsasEspeciales()
  const bolsa = bolsas.find((b) => b.id === bolsaId)

  if (!bolsa) return

  // Limpiar el contenedor
  contenedor.innerHTML = ""

  // Si no hay contenido, mostrar mensaje
  if (!bolsa.contenido || bolsa.contenido.length === 0) {
    contenedor.innerHTML = '<p class="text-center">Esta bolsa está vacía</p>'
    return
  }

  // Crear la tabla para mostrar el contenido
  const table = document.createElement("table")
  table.className = "table table-sm table-hover"
  table.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Cant.</th>
                <th>Peso</th>
                <th>Valor</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- El contenido se agregará dinámicamente -->
        </tbody>
    `

  const tbody = table.querySelector("tbody")

  // Agregar cada objeto a la tabla
  bolsa.contenido.forEach((objeto) => {
    const cantidad = objeto.cantidad || 1
    const pesoTotal = (objeto.peso * cantidad).toFixed(2)
    const valorTotal = objeto.valor * cantidad

    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${objeto.nombre}</td>
            <td>${cantidad}</td>
            <td>${pesoTotal} kg</td>
            <td>${valorTotal} mo</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary edit-bag-item" data-id="${objeto.id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger delete-bag-item" data-id="${objeto.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-outline-secondary move-bag-item" data-id="${objeto.id}" title="Intercambio">
                        <i class="bi bi-arrow-left-right"></i>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(tr)
  })

  contenedor.appendChild(table)

  // Agregar eventos a los botones
  contenedor.querySelectorAll(".edit-bag-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const objetoId = e.currentTarget.dataset.id
      abrirModalEditarObjeto(bolsaId, objetoId)
    })
  })

  contenedor.querySelectorAll(".delete-bag-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const objetoId = e.currentTarget.dataset.id
      confirmarEliminarObjetoDeBolsa(bolsaId, objetoId)
    })
  })

  contenedor.querySelectorAll(".move-bag-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const objetoId = e.currentTarget.dataset.id
      abrirModalMoverObjeto(bolsaId, objetoId)
    })
  })
}

// Función para abrir el modal de agregar objeto a bolsa
function abrirModalAgregarObjetoABolsa(bolsaId) {
  const modal = new bootstrap.Modal(document.getElementById("itemModal"))
  const form = document.getElementById("itemForm")

  // Limpiar el formulario
  form.reset()

  // Establecer el título del modal
  document.getElementById("itemModalLabel").textContent = "Agregar objeto a bolsa"

  // Ocultar el botón de eliminar
  document.getElementById("deleteItemBtn").style.display = "none"

  // Ocultar el botón de equipar
  document.getElementById("equipItemBtn").style.display = "none"

  // Ocultar el botón de mover a bolsa
  document.getElementById("moveToBagBtn").style.display = "none"

  // Configurar evento para guardar el objeto
  form.onsubmit = (e) => {
    e.preventDefault()

    const nombre = document.getElementById("itemName").value
    const tipo = document.getElementById("itemType").value
    const cantidad = Number.parseInt(document.getElementById("itemQuantity").value) || 1
    const peso = Number.parseFloat(document.getElementById("itemWeight").value) || 0
    const valor = Number.parseInt(document.getElementById("itemValue").value) || 0
    const descripcion = document.getElementById("itemDescription").value || ""

    const nuevoObjeto = {
      id: generateUUID(),
      nombre,
      tipo,
      cantidad,
      peso,
      valor,
      descripcion,
    }

    agregarObjetoABolsa(bolsaId, nuevoObjeto)
    cargarContenidoBolsa(bolsaId)

    // Actualizar el peso total
    actualizarPesoTotal()

    modal.hide()
  }

  modal.show()
}

// Función para agregar un objeto a una bolsa especial
function agregarObjetoABolsa(bolsaId, objeto) {
  const bolsas = obtenerBolsasEspeciales()
  const index = bolsas.findIndex((b) => b.id === bolsaId)

  if (index !== -1) {
    if (!bolsas[index].contenido) {
      bolsas[index].contenido = []
    }

    bolsas[index].contenido.push(objeto)
    guardarBolsasEspeciales(bolsas)
    return true
  }

  return false
}

// Función para abrir el modal de editar objeto
function abrirModalEditarObjeto(bolsaId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsa = bolsas.find((b) => b.id === bolsaId)

  if (!bolsa || !bolsa.contenido) return

  const objeto = bolsa.contenido.find((o) => o.id === objetoId)
  if (!objeto) return

  const modal = new bootstrap.Modal(document.getElementById("itemModal"))
  const form = document.getElementById("itemForm")

  // Limpiar el formulario
  form.reset()

  // Establecer el título del modal
  document.getElementById("itemModalLabel").textContent = "Editar objeto"

  // Mostrar el botón de eliminar
  document.getElementById("deleteItemBtn").style.display = "block"

  // Ocultar el botón de equipar
  document.getElementById("equipItemBtn").style.display = "none"

  // Ocultar el botón de mover a bolsa
  document.getElementById("moveToBagBtn").style.display = "none"

  // Establecer los valores del objeto
  document.getElementById("itemId").value = objeto.id
  document.getElementById("itemName").value = objeto.nombre
  document.getElementById("itemType").value = objeto.tipo || "objeto"
  document.getElementById("itemQuantity").value = objeto.cantidad || 1
  document.getElementById("itemWeight").value = objeto.peso || 0
  document.getElementById("itemValue").value = objeto.valor || 0
  document.getElementById("itemDescription").value = objeto.descripcion || ""

  // Configurar evento para guardar los cambios
  form.onsubmit = (e) => {
    e.preventDefault()

    const objetoActualizado = {
      id: objeto.id,
      nombre: document.getElementById("itemName").value,
      tipo: document.getElementById("itemType").value,
      cantidad: Number.parseInt(document.getElementById("itemQuantity").value) || 1,
      peso: Number.parseFloat(document.getElementById("itemWeight").value) || 0,
      valor: Number.parseInt(document.getElementById("itemValue").value) || 0,
      descripcion: document.getElementById("itemDescription").value || "",
    }

    actualizarObjetoEnBolsa(bolsaId, objetoActualizado)
    cargarContenidoBolsa(bolsaId)

    // Actualizar el peso total
    actualizarPesoTotal()

    modal.hide()
  }

  // Configurar evento para eliminar el objeto
  document.getElementById("deleteItemBtn").onclick = () => {
    if (confirm("¿Estás seguro de que deseas eliminar este objeto?")) {
      eliminarObjetoDeBolsa(bolsaId, objetoId)
      cargarContenidoBolsa(bolsaId)

      // Actualizar el peso total
      actualizarPesoTotal()

      modal.hide()
    }
  }

  modal.show()
}

// Función para actualizar un objeto en una bolsa especial
function actualizarObjetoEnBolsa(bolsaId, objeto) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1 && bolsas[bolsaIndex].contenido) {
    const objetoIndex = bolsas[bolsaIndex].contenido.findIndex((o) => o.id === objeto.id)

    if (objetoIndex !== -1) {
      bolsas[bolsaIndex].contenido[objetoIndex] = objeto
      guardarBolsasEspeciales(bolsas)
      return true
    }
  }

  return false
}

// Función para eliminar un objeto de una bolsa especial
function eliminarObjetoDeBolsa(bolsaId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const index = bolsas.findIndex((b) => b.id === bolsaId)

  if (index !== -1 && bolsas[index].contenido) {
    bolsas[index].contenido = bolsas[index].contenido.filter((o) => o.id !== objetoId)
    guardarBolsasEspeciales(bolsas)
    return true
  }

  return false
}

// Función para confirmar la eliminación de un objeto de una bolsa
function confirmarEliminarObjetoDeBolsa(bolsaId, objetoId) {
  if (confirm("¿Estás seguro de que deseas eliminar este objeto?")) {
    eliminarObjetoDeBolsa(bolsaId, objetoId)
    cargarContenidoBolsa(bolsaId)

    // Actualizar el peso total
    actualizarPesoTotal()
  }
}

// Función para abrir el modal de mover objeto
function abrirModalMoverObjeto(bolsaOrigenId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaOrigen = bolsas.find((b) => b.id === bolsaOrigenId)

  if (!bolsaOrigen || !bolsaOrigen.contenido) return

  const objeto = bolsaOrigen.contenido.find((o) => o.id === objetoId)
  if (!objeto) return

  const modal = new bootstrap.Modal(document.getElementById("moveToBagModal"))
  const form = document.getElementById("moveToBagForm")
  const selectBag = document.getElementById("selectBag")

  // Limpiar el formulario
  form.reset()
  selectBag.innerHTML = ""

  // Establecer el ID del objeto
  document.getElementById("moveItemId").value = objetoId
  document.getElementById("sourceBagId").value = bolsaOrigenId

  // Agregar opción para mover al inventario
  const inventoryOption = document.createElement("option")
  inventoryOption.value = "inventario"
  inventoryOption.textContent = "Inventario"
  selectBag.appendChild(inventoryOption)

  // Agregar opciones para las bolsas (excepto la de origen)
  bolsas.forEach((bolsa) => {
    if (bolsa.id !== bolsaOrigenId) {
      const option = document.createElement("option")
      option.value = bolsa.id
      option.textContent = bolsa.nombre
      selectBag.appendChild(option)
    }
  })

  // Configurar evento para mover el objeto
  form.onsubmit = (e) => {
    e.preventDefault()

    const bolsaDestinoId = selectBag.value

    if (bolsaDestinoId === "inventario") {
      // Mover al inventario
      moverObjetoAInventario(bolsaOrigenId, objetoId)
    } else {
      // Mover a otra bolsa
      moverObjetoEntreBolsas(bolsaOrigenId, bolsaDestinoId, objetoId)
    }

    // Actualizar vistas
    cargarContenidoBolsa(bolsaOrigenId)
    if (bolsaDestinoId !== "inventario") {
      cargarContenidoBolsa(bolsaDestinoId)
    }
    cargarInventarioAcordeon()

    // Actualizar el peso total
    actualizarPesoTotal()

    modal.hide()
  }

  modal.show()
}

// Función para mover un objeto de una bolsa al inventario
function moverObjetoAInventario(bolsaId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1 && bolsas[bolsaIndex].contenido) {
    const objeto = bolsas[bolsaIndex].contenido.find((o) => o.id === objetoId)

    if (objeto) {
      // Eliminar el objeto de la bolsa
      bolsas[bolsaIndex].contenido = bolsas[bolsaIndex].contenido.filter((o) => o.id !== objetoId)
      guardarBolsasEspeciales(bolsas)

      // Agregar el objeto al inventario
      const personaje = JSON.parse(localStorage.getItem("personajeActual"))
      if (personaje) {
        if (!personaje.inventario) {
          personaje.inventario = []
        }

        personaje.inventario.push(objeto)
        localStorage.setItem("personajeActual", JSON.stringify(personaje))

        return true
      }
    }
  }

  return false
}

// Función para mover un objeto entre bolsas
function moverObjetoEntreBolsas(bolsaOrigenId, bolsaDestinoId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaOrigenIndex = bolsas.findIndex((b) => b.id === bolsaOrigenId)
  const bolsaDestinoIndex = bolsas.findIndex((b) => b.id === bolsaDestinoId)

  if (
    bolsaOrigenIndex !== -1 &&
    bolsaDestinoIndex !== -1 &&
    bolsas[bolsaOrigenIndex].contenido &&
    bolsaOrigenId !== bolsaDestinoId
  ) {
    const objetoIndex = bolsas[bolsaOrigenIndex].contenido.findIndex((o) => o.id === objetoId)

    if (objetoIndex !== -1) {
      // Obtener el objeto
      const objeto = { ...bolsas[bolsaOrigenIndex].contenido[objetoIndex] }

      // Eliminar el objeto de la bolsa
      bolsas[bolsaOrigenIndex].contenido.splice(objetoIndex, 1)

      // Agregar el objeto a la bolsa de destino
      if (!bolsas[bolsaDestinoIndex].contenido) {
        bolsas[bolsaDestinoIndex].contenido = []
      }

      bolsas[bolsaDestinoIndex].contenido.push(objeto)

      // Guardar cambios
      guardarBolsasEspeciales(bolsas)
      return true
    }
  }

  return false
}

// Función para mover un objeto del inventario a una bolsa
function moverObjetoDeInventarioABolsa(objetoId, bolsaId) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return false

  const objetoIndex = personaje.inventario.findIndex((o) => o.id === objetoId)
  if (objetoIndex === -1) return false

  // Obtener el objeto
  const objeto = { ...personaje.inventario[objetoIndex] }

  // Eliminar el objeto del inventario
  personaje.inventario.splice(objetoIndex, 1)

  // Agregar el objeto a la bolsa
  const bolsas = obtenerBolsasEspeciales()
  const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1) {
    if (!bolsas[bolsaIndex].contenido) {
      bolsas[bolsaIndex].contenido = []
    }

    bolsas[bolsaIndex].contenido.push(objeto)

    // Guardar cambios
    personaje.bolsasEspeciales = bolsas
    localStorage.setItem("personajeActual", JSON.stringify(personaje))

    return true
  }

  // Si no se pudo agregar a la bolsa, restaurar el objeto al inventario
  personaje.inventario.push(objeto)
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  return false
}

// Función para calcular el peso total de una bolsa
function calcularPesoBolsa(bolsaId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsa = bolsas.find((b) => b.id === bolsaId)

  if (bolsa && bolsa.contenido && bolsa.contenido.length > 0) {
    return bolsa.contenido.reduce((total, objeto) => {
      const cantidad = objeto.cantidad || 1
      return total + objeto.peso * cantidad
    }, 0)
  }

  return 0
}

// Exportar funciones
export {
  cargarBolsasEspeciales,
  obtenerBolsasEspeciales,
  guardarBolsasEspeciales,
  crearBolsaEspecial,
  eliminarBolsaEspecial,
  confirmarEliminarBolsa,
  cargarContenidoBolsa,
  abrirModalCrearBolsa,
  abrirModalAgregarObjetoABolsa,
  agregarObjetoABolsa,
  abrirModalEditarObjeto,
  actualizarObjetoEnBolsa,
  eliminarObjetoDeBolsa,
  confirmarEliminarObjetoDeBolsa,
  abrirModalMoverObjeto,
  moverObjetoAInventario,
  moverObjetoEntreBolsas,
  moverObjetoDeInventarioABolsa,
  calcularPesoBolsa,
}
