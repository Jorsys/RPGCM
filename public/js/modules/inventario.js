// Funciones para gestionar el inventario del personaje
import { actualizarPesoTotal } from "./peso.js"
import { cargarEquipamiento } from "./equipamiento.js"
import { generateUUID } from "./utils.js"
import * as bootstrap from "bootstrap"

// Función para cargar el inventario
function cargarInventario() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return

  const inventario = personaje.inventario

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para cargar el inventario en el acordeón
function cargarInventarioAcordeon() {
  const acordeon = document.getElementById("inventoryAccordion")
  if (!acordeon) return

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return

  const inventario = personaje.inventario

  // Agrupar objetos por tipo
  const objetosPorTipo = {}
  inventario.forEach((objeto) => {
    const tipo = objeto.tipo || "Otros"
    if (!objetosPorTipo[tipo]) {
      objetosPorTipo[tipo] = []
    }
    objetosPorTipo[tipo].push(objeto)
  })

  // Limpiar el acordeón
  acordeon.innerHTML = ""

  // Si no hay objetos, mostrar mensaje
  if (inventario.length === 0) {
    acordeon.innerHTML = '<p class="text-center">No tienes objetos en el inventario</p>'
    return
  }

  // Crear un elemento de acordeón para cada tipo de objeto
  Object.keys(objetosPorTipo).forEach((tipo, index) => {
    const objetos = objetosPorTipo[tipo]
    const cantidadObjetos = objetos.length

    const pesoTotal = objetos
      .reduce((total, obj) => {
        const cantidad = obj.cantidad || 1
        return total + obj.peso * cantidad
      }, 0)
      .toFixed(2)

    const acordeonItem = document.createElement("div")
    acordeonItem.className = "accordion-item"
    acordeonItem.innerHTML = `
            <h2 class="accordion-header" id="heading-${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse-${index}" aria-expanded="false" 
                        aria-controls="collapse-${index}">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <span>${tipo}</span>
                        <span class="badge bg-secondary me-2">${cantidadObjetos} objetos | ${pesoTotal} kg</span>
                    </div>
                </button>
            </h2>
            <div id="collapse-${index}" class="accordion-collapse collapse" 
                 aria-labelledby="heading-${index}" data-bs-parent="#inventoryAccordion">
                <div class="accordion-body p-2">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cant.</th>
                                <th>Peso</th>
                                <th>Valor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-body-${index}">
                            <!-- Los objetos se agregarán dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        `

    acordeon.appendChild(acordeonItem)

    // Agregar los objetos a la tabla
    const tbody = document.getElementById(`inventory-body-${index}`)
    objetos.forEach((objeto) => {
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
                        <button class="btn btn-outline-primary edit-item" data-id="${objeto.id}" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        ${
                          objeto.tipo === "arma" || objeto.tipo === "armadura" || objeto.tipo === "municion"
                            ? `<button class="btn btn-outline-success equip-item" data-id="${objeto.id}" title="Equipar">
                                <i class="bi bi-link"></i>
                            </button>`
                            : ""
                        }
                        <button class="btn btn-outline-secondary move-to-bag" data-id="${objeto.id}" title="Intercambio">
                            <i class="bi bi-arrow-left-right"></i>
                        </button>
                    </div>
                </td>
            `

      tbody.appendChild(tr)
    })
  })

  // Agregar eventos a los botones
  document.querySelectorAll(".edit-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id
      abrirModalObjeto(id)
    })
  })

  document.querySelectorAll(".equip-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id
      equiparObjeto(id)
    })
  })

  document.querySelectorAll(".move-to-bag").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id
      abrirModalMoverObjetoABolsa(id)
    })
  })

  // Agregar evento al botón de añadir objeto
  const addItemBtn = document.getElementById("addItemBtn")
  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      abrirModalObjeto()
    })
  }
}

// Función para abrir el modal de objeto
function abrirModalObjeto(id = null) {
  const modal = new bootstrap.Modal(document.getElementById("itemModal"))
  const form = document.getElementById("itemForm")
  const deleteBtn = document.getElementById("deleteItemBtn")
  const equipBtn = document.getElementById("equipItemBtn")
  const moveToBagBtn = document.getElementById("moveToBagBtn")

  // Limpiar el formulario
  form.reset()

  if (id) {
    // Editar objeto existente
    const personaje = JSON.parse(localStorage.getItem("personajeActual"))
    if (!personaje || !personaje.inventario) return

    const objeto = personaje.inventario.find((o) => o.id === id)
    if (!objeto) return

    document.getElementById("itemModalLabel").textContent = "Editar objeto"
    document.getElementById("itemId").value = objeto.id
    document.getElementById("itemName").value = objeto.nombre
    document.getElementById("itemType").value = objeto.tipo || "objeto"
    document.getElementById("itemQuantity").value = objeto.cantidad || 1
    document.getElementById("itemWeight").value = objeto.peso || 0
    document.getElementById("itemValue").value = objeto.valor || 0
    document.getElementById("itemDescription").value = objeto.descripcion || ""

    deleteBtn.style.display = "block"

    // Mostrar botón de equipar solo para armas, armaduras y municiones
    if (objeto.tipo === "arma" || objeto.tipo === "armadura" || objeto.tipo === "municion") {
      equipBtn.style.display = "block"
    } else {
      equipBtn.style.display = "none"
    }

    // Mostrar botón de mover a bolsa
    moveToBagBtn.style.display = "block"

    // Configurar evento para eliminar objeto
    deleteBtn.onclick = () => {
      eliminarObjeto(id)
      modal.hide()
    }

    // Configurar evento para equipar objeto
    equipBtn.onclick = () => {
      equiparObjeto(id)
      modal.hide()
    }

    // Configurar evento para mover a bolsa
    moveToBagBtn.onclick = () => {
      abrirModalMoverObjetoABolsa(id)
      modal.hide()
    }
  } else {
    // Nuevo objeto
    document.getElementById("itemModalLabel").textContent = "Nuevo objeto"
    document.getElementById("itemId").value = ""

    deleteBtn.style.display = "none"
    equipBtn.style.display = "none"
    moveToBagBtn.style.display = "none"
  }

  // Configurar evento para guardar objeto
  form.onsubmit = (e) => {
    e.preventDefault()
    guardarObjeto()
    modal.hide()
  }

  modal.show()
}

// Función para guardar un objeto
function guardarObjeto() {
  const id = document.getElementById("itemId").value
  const nombre = document.getElementById("itemName").value
  const tipo = document.getElementById("itemType").value
  const cantidad = Number.parseInt(document.getElementById("itemQuantity").value) || 1
  const peso = Number.parseFloat(document.getElementById("itemWeight").value) || 0
  const valor = Number.parseInt(document.getElementById("itemValue").value) || 0
  const descripcion = document.getElementById("itemDescription").value || ""

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  if (!personaje.inventario) {
    personaje.inventario = []
  }

  if (id) {
    // Actualizar objeto existente
    const index = personaje.inventario.findIndex((o) => o.id === id)
    if (index !== -1) {
      personaje.inventario[index] = {
        ...personaje.inventario[index],
        nombre,
        tipo,
        cantidad,
        peso,
        valor,
        descripcion,
      }
    }
  } else {
    // Crear nuevo objeto
    const nuevoObjeto = {
      id: generateUUID(),
      nombre,
      tipo,
      cantidad,
      peso,
      valor,
      descripcion,
    }

    personaje.inventario.push(nuevoObjeto)
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarInventarioAcordeon()

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para eliminar un objeto
function eliminarObjeto(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return

  personaje.inventario = personaje.inventario.filter((o) => o.id !== id)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarInventarioAcordeon()

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para equipar un objeto
function equiparObjeto(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return

  const objeto = personaje.inventario.find((o) => o.id === id)
  if (!objeto) return

  // Verificar el tipo de objeto
  if (!objeto.tipo || (objeto.tipo !== "arma" && objeto.tipo !== "armadura" && objeto.tipo !== "municion")) {
    alert("Este objeto no se puede equipar")
    return
  }

  // Inicializar el equipamiento si no existe
  if (!personaje.equipamiento) {
    personaje.equipamiento = {
      armas: [],
      armaduras: [],
      municiones: [],
    }
  }

  // Equipar el objeto según su tipo
  switch (objeto.tipo) {
    case "arma":
      if (!personaje.equipamiento.armas) {
        personaje.equipamiento.armas = []
      }
      personaje.equipamiento.armas.push(objeto)
      break
    case "armadura":
      if (!personaje.equipamiento.armaduras) {
        personaje.equipamiento.armaduras = []
      }
      personaje.equipamiento.armaduras.push(objeto)
      break
    case "municion":
      if (!personaje.equipamiento.municiones) {
        personaje.equipamiento.municiones = []
      }
      personaje.equipamiento.municiones.push(objeto)
      break
  }

  // Eliminar el objeto del inventario
  personaje.inventario = personaje.inventario.filter((o) => o.id !== id)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarInventarioAcordeon()

  // Cargar equipamiento
  cargarEquipamiento()

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para abrir el modal de mover objeto a bolsa
function abrirModalMoverObjetoABolsa(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return

  const objeto = personaje.inventario.find((o) => o.id === id)
  if (!objeto) return

  const modal = new bootstrap.Modal(document.getElementById("moveToBagModal"))
  const form = document.getElementById("moveToBagForm")
  const selectBag = document.getElementById("selectBag")

  // Limpiar el formulario
  form.reset()
  selectBag.innerHTML = ""

  // Establecer el ID del objeto
  document.getElementById("moveItemId").value = objeto.id
  document.getElementById("sourceBagId").value = "inventario"

  // Cargar las bolsas disponibles
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

  // Configurar evento para mover objeto
  form.onsubmit = (e) => {
    e.preventDefault()

    const bolsaId = selectBag.value
    moverObjetoDeInventarioABolsa(id, bolsaId)

    modal.hide()
  }

  modal.show()
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
  const bolsaIndex = personaje.bolsasEspeciales.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1) {
    if (!personaje.bolsasEspeciales[bolsaIndex].contenido) {
      personaje.bolsasEspeciales[bolsaIndex].contenido = []
    }

    personaje.bolsasEspeciales[bolsaIndex].contenido.push(objeto)

    // Guardar cambios
    localStorage.setItem("personajeActual", JSON.stringify(personaje))

    // Actualizar la interfaz
    cargarInventarioAcordeon()

    // Actualizar el peso total
    actualizarPesoTotal()

    return true
  }

  // Si no se pudo agregar a la bolsa, restaurar el objeto al inventario
  personaje.inventario.push(objeto)
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  return false
}

// Exportar funciones
export {
  cargarInventario,
  cargarInventarioAcordeon,
  abrirModalObjeto,
  guardarObjeto,
  eliminarObjeto,
  equiparObjeto,
  abrirModalMoverObjetoABolsa,
  moverObjetoDeInventarioABolsa,
}
