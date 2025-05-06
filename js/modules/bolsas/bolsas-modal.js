// Funciones para gestionar los modales de las bolsas especiales
import {
  obtenerBolsasEspeciales,
  crearBolsaEspecial,
  agregarObjetoABolsa,
  actualizarObjetoEnBolsa,
  moverObjetoEntreBolsas,
  generateUUID,
} from "./bolsas-data.js"
import { cargarBolsasEspeciales } from "./bolsas-ui.js"
import { cargarContenidoBolsa } from "./bolsas-contenido.js"
import * as bootstrap from "bootstrap" // Import Bootstrap
import { actualizarPesoTotal } from "../equipamiento.js" // Corregir la importación
import { cargarInventarioAcordeon } from "../inventario.js" // Corregir la importación

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
      const bolsas = obtenerBolsasEspeciales()
      const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

      if (bolsaIndex !== -1 && bolsas[bolsaIndex].contenido) {
        bolsas[bolsaIndex].contenido = bolsas[bolsaIndex].contenido.filter((o) => o.id !== objetoId)
        localStorage.setItem(
          "personajeActual",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("personajeActual")),
            bolsasEspeciales: bolsas,
          }),
        )

        cargarContenidoBolsa(bolsaId)

        // Actualizar el peso total
        actualizarPesoTotal()
      }

      modal.hide()
    }
  }

  modal.show()
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
      if (confirm("¿Estás seguro de que deseas mover este objeto al inventario?")) {
        const personaje = JSON.parse(localStorage.getItem("personajeActual"))
        if (!personaje) return

        // Eliminar el objeto de la bolsa
        const bolsas = obtenerBolsasEspeciales()
        const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaOrigenId)

        if (bolsaIndex !== -1 && bolsas[bolsaIndex].contenido) {
          const objetoIndex = bolsas[bolsaIndex].contenido.findIndex((o) => o.id === objetoId)

          if (objetoIndex !== -1) {
            const objeto = { ...bolsas[bolsaIndex].contenido[objetoIndex] }

            // Eliminar el objeto de la bolsa
            bolsas[bolsaIndex].contenido.splice(objetoIndex, 1)

            // Agregar el objeto al inventario
            if (!personaje.inventario) {
              personaje.inventario = []
            }

            personaje.inventario.push(objeto)

            // Guardar cambios
            personaje.bolsasEspeciales = bolsas
            localStorage.setItem("personajeActual", JSON.stringify(personaje))

            // Actualizar vistas
            cargarContenidoBolsa(bolsaOrigenId)
            cargarInventarioAcordeon()

            // Actualizar el peso total
            actualizarPesoTotal()
          }
        }
      }
    } else {
      // Mover a otra bolsa
      moverObjetoEntreBolsas(bolsaOrigenId, bolsaDestinoId, objetoId)

      // Actualizar vistas
      cargarContenidoBolsa(bolsaOrigenId)
      cargarContenidoBolsa(bolsaDestinoId)

      // Actualizar el peso total
      actualizarPesoTotal()
    }

    modal.hide()
  }

  modal.show()
}

// Exportar funciones
export { abrirModalCrearBolsa, abrirModalAgregarObjetoABolsa, abrirModalEditarObjeto, abrirModalMoverObjeto }
