// Módulo para la gestión del equipamiento

import { guardarPersonaje } from "./personaje.js"
import { getCategoryName, showConfirmation } from "./utils.js"

// Función para cargar el equipamiento
export function cargarEquipamiento(personaje, confirmModal, confirmMessage) {
  const equippedItems = document.getElementById("equippedItems")
  if (!equippedItems) {
    console.error("No se encontró el elemento con ID 'equippedItems'")
    return
  }

  equippedItems.innerHTML = ""

  // Añadir leyenda de iconos
  const legendHTML = `
    <div class="icons-legend">
      <div class="legend-item"><i class="fas fa-edit"></i> Editar</div>
      <div class="legend-item"><i class="fas fa-unlink"></i> Desequipar</div>
    </div>
  `
  equippedItems.innerHTML = legendHTML

  if (!personaje.equipados || personaje.equipados.length === 0) {
    equippedItems.innerHTML += "<p>No hay objetos equipados.</p>"
    return
  }

  // Crear tabla para mostrar los items equipados
  let tableHTML = `<table class="equipment-table"><thead><tr>
    <th>Tipo</th>
    <th>Nombre</th>
    <th>Detalles</th>
    <th>Acciones</th>
  </tr></thead><tbody>`

  personaje.equipados.forEach((item, index) => {
    let detalles = ""

    switch (item.categoria) {
      case "armaduras":
        detalles = `BF: ${item.bloqueoFisico}, BM: ${item.bloqueoMagico}, Res: ${item.resistenciaActual}/${item.resistenciaMax}`
        break
      case "armas":
        detalles = `${item.manos} mano(s), ${item.tipo}, Daño: ${item.danio}, Res: ${item.resistenciaActual || 10}/${item.resistenciaMax || 10}`
        break
      case "municion":
        detalles = `Cantidad: ${item.cantidad}, ${item.mejora || "-"}`
        break
    }

    tableHTML += `
      <tr>
        <td>${getCategoryName(item.categoria)}</td>
        <td>${item.nombre}</td>
        <td>${detalles}</td>
        <td class="actions-cell">
          <i class="fas fa-edit action-icon edit-equipment-icon" data-index="${index}" title="Editar"></i>
          <i class="fas fa-unlink action-icon unequip-icon" data-index="${index}" title="Desequipar"></i>
        </td>
      </tr>
    `
  })

  tableHTML += `</tbody></table>`
  equippedItems.innerHTML += tableHTML

  // Agregar event listeners a los iconos
  const editEquipmentIcons = equippedItems.querySelectorAll(".edit-equipment-icon")
  editEquipmentIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index
      editarEquipamiento(personaje, index)
    })
  })

  const unequipIcons = equippedItems.querySelectorAll(".unequip-icon")
  unequipIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index
      const itemName = personaje.equipados[index].nombre

      showConfirmation(
        `¿Estás seguro de que deseas desequipar "${itemName}"?`,
        () => {
          desequiparItem(personaje, index)
          cargarEquipamiento(personaje, confirmModal, confirmMessage)
        },
        confirmModal,
        confirmMessage,
      )
    })
  })
}

// Función para desequipar un item
export function desequiparItem(personaje, index) {
  const item = personaje.equipados[index]

  // Verificar si ya existe un item similar en el inventario
  const existingItemIndex = personaje.inventario[item.categoria].findIndex(
    (i) =>
      i.nombre === item.nombre &&
      (item.categoria !== "armas" || i.manos === item.manos) &&
      (item.categoria !== "armaduras" ||
        (i.resistenciaMax === item.resistenciaMax &&
          i.bloqueoFisico === item.bloqueoFisico &&
          i.bloqueoMagico === item.bloqueoMagico)),
  )

  if (existingItemIndex !== -1) {
    // Si existe, incrementar la cantidad
    personaje.inventario[item.categoria][existingItemIndex].cantidad += item.cantidad || 1
  } else {
    // Si no existe, agregar como nuevo item
    personaje.inventario[item.categoria].push({ ...item })
  }

  // Eliminar el item de equipados
  personaje.equipados.splice(index, 1)
  guardarPersonaje(personaje)
}

// Función para editar un item equipado
export function editarEquipamiento(personaje, index) {
  const item = personaje.equipados[index]
  const editEquippedModal = document.getElementById("editEquippedModal")
  const editEquippedModalContent = document.getElementById("editEquippedModalContent")

  let formHTML = ""
  const title = `Editar ${getCategoryName(item.categoria)}`

  switch (item.categoria) {
    case "armaduras":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="editEquippedName">Nombre:</label>
            <input type="text" id="editEquippedName" value="${item.nombre}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedResistenciaMax">Resistencia Máxima:</label>
            <input type="number" id="editEquippedResistenciaMax" min="0" value="${item.resistenciaMax}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedBloqueoFisico">Bloqueo Físico:</label>
            <input type="number" id="editEquippedBloqueoFisico" min="0" value="${item.bloqueoFisico}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedBloqueoMagico">Bloqueo Mágico:</label>
            <input type="number" id="editEquippedBloqueoMagico" min="0" value="${item.bloqueoMagico}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedResistenciaActual">Resistencia Actual:</label>
            <input type="number" id="editEquippedResistenciaActual" min="0" max="${item.resistenciaMax}" value="${item.resistenciaActual}">
          </div>
        </div>
      `
      break
    case "armas":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="editEquippedName">Nombre:</label>
            <input type="text" id="editEquippedName" value="${item.nombre}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedManos">Manos necesarias:</label>
            <input type="text" id="editEquippedManos" value="${item.manos}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedTipo">Tipo de arma:</label>
            <input type="text" id="editEquippedTipo" value="${item.tipo}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedDanio">Daño:</label>
            <input type="text" id="editEquippedDanio" value="${item.danio}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedResistenciaMax">Resistencia Máxima:</label>
            <input type="number" id="editEquippedResistenciaMax" min="0" value="${item.resistenciaMax || 10}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedResistenciaActual">Resistencia Actual:</label>
            <input type="number" id="editEquippedResistenciaActual" min="0" max="${item.resistenciaMax || 10}" value="${item.resistenciaActual || 10}">
          </div>
        </div>
      `
      break
    case "municion":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="editEquippedName">Nombre:</label>
            <input type="text" id="editEquippedName" value="${item.nombre}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedMejora">Mejora:</label>
            <input type="text" id="editEquippedMejora" value="${item.mejora || ""}" readonly>
          </div>
          <div class="form-group">
            <label for="editEquippedCantidad">Cantidad:</label>
            <input type="number" id="editEquippedCantidad" min="1" value="${item.cantidad || 1}">
          </div>
        </div>
      `
      break
  }

  // Preparar contenido del modal
  editEquippedModalContent.innerHTML = `
    <h3>${title}</h3>
    ${formHTML}
    <div class="form-actions">
      <button id="saveEquippedBtn" class="btn" data-index="${index}">Guardar Cambios</button>
    </div>
  `

  // Mostrar modal
  editEquippedModal.classList.add("show-modal")

  // Configurar botón de guardar
  const saveEquippedBtn = document.getElementById("saveEquippedBtn")
  if (saveEquippedBtn) {
    saveEquippedBtn.addEventListener("click", function () {
      const index = this.dataset.index
      guardarCambiosEquipamiento(personaje, index)
      editEquippedModal.classList.remove("show-modal")
    })
  }
}

// Función para guardar los cambios de un item equipado
export function guardarCambiosEquipamiento(personaje, index) {
  const item = personaje.equipados[index]

  switch (item.categoria) {
    case "armaduras":
      item.resistenciaActual = Number.parseInt(document.getElementById("editEquippedResistenciaActual").value)
      break
    case "armas":
      item.resistenciaActual = Number.parseInt(document.getElementById("editEquippedResistenciaActual").value)
      break
    case "municion":
      item.cantidad = Number.parseInt(document.getElementById("editEquippedCantidad").value)
      break
  }

  guardarPersonaje(personaje)
}

// Función para configurar los eventos de cierre del modal de editar equipamiento
export function configurarCierreModalEquipamiento() {
  const closeEditEquippedModal = document.getElementById("closeEditEquippedModal")
  if (closeEditEquippedModal) {
    closeEditEquippedModal.addEventListener("click", () => {
      const editEquippedModal = document.getElementById("editEquippedModal")
      if (editEquippedModal) {
        editEquippedModal.classList.remove("show-modal")
      }
    })
  }

  // También añadir el cierre al hacer clic fuera del modal
  window.addEventListener("click", (event) => {
    const editEquippedModal = document.getElementById("editEquippedModal")
    if (event.target === editEquippedModal) {
      editEquippedModal.classList.remove("show-modal")
    }
  })
}
