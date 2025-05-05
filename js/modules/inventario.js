// Módulo para la gestión del inventario

import { guardarPersonaje } from "./personaje.js"
import { getCategoryIcon, showConfirmation } from "./utils.js"
import { cargarEquipamiento } from "./equipamiento.js"

// Función para cargar el inventario en el acordeón
export function cargarInventarioAcordeon(personaje, category, confirmModal, confirmMessage) {
  const accordionList = document.querySelector(`#${category}-content .accordion-list`)
  if (!accordionList) {
    console.error(`No se encontró el elemento con clase 'accordion-list' en #${category}-content`)
    return
  }

  accordionList.innerHTML = ""

  // Añadir leyenda de iconos
  const legendHTML = `
    <div class="icons-legend">
      <div class="legend-item"><i class="fas fa-edit"></i> Editar</div>
      <div class="legend-item"><i class="fas fa-trash"></i> Eliminar</div>
      <div class="legend-item"><i class="fas fa-link"></i> Equipar</div>
      <div class="legend-item"><i class="fas fa-suitcase"></i> Mover a bolsa</div>
    </div>
  `
  accordionList.innerHTML = legendHTML

  if (!personaje.inventario[category] || personaje.inventario[category].length === 0) {
    accordionList.innerHTML += "<p>No hay objetos en esta categoría.</p>"
    return
  }

  // Crear tabla para mostrar los items
  let tableHTML = `<table class="inventory-table"><thead><tr>
    <th>Nombre</th>
    <th>Detalles</th>
    <th>Coste</th>
    <th>Acciones</th>
  </tr></thead><tbody id="${category}List">`

  personaje.inventario[category].forEach((item, index) => {
    let detalles = ""

    switch (category) {
      case "armaduras":
        detalles = `BF: ${item.bloqueoFisico}, BM: ${item.bloqueoMagico}, Res: ${item.resistenciaMax}`
        break
      case "armas":
        detalles = `${item.manos} mano(s), ${item.tipo}, Daño: ${item.danio}`
        break
      case "municion":
        detalles = `Cantidad: ${item.cantidad}, ${item.mejora || "-"}`
        break
      case "pociones":
        detalles = item.efecto
        break
      case "pergaminos":
        detalles = item.hechizo
        break
      case "otros":
        detalles = item.descripcion
        break
    }

    tableHTML += `
    <tr>
      <td>${item.nombre}</td>
      <td>${detalles}</td>
      <td>${item.coste}</td>
      <td class="actions-cell">
        <i class="fas fa-edit action-icon edit-inventory-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
        <i class="fas fa-trash action-icon delete-inventory-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
        <i class="fas fa-link action-icon equip-icon" data-category="${category}" data-index="${index}" title="Equipar"></i>
        <i class="fas fa-suitcase action-icon move-to-bag-icon" data-category="${category}" data-index="${index}" title="Mover a bolsa"></i>
      </td>
    </tr>
  `
  })

  tableHTML += `</tbody></table>`
  accordionList.innerHTML += tableHTML

  // Agregar event listeners a los iconos
  const editInventoryIcons = accordionList.querySelectorAll(".edit-inventory-icon")
  editInventoryIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const category = this.dataset.category
      const index = this.dataset.index
      editarItemInventario(personaje, category, index)
    })
  })

  const deleteInventoryIcons = accordionList.querySelectorAll(".delete-inventory-icon")
  deleteInventoryIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const category = this.dataset.category
      const index = this.dataset.index
      const itemName = personaje.inventario[category][index].nombre

      showConfirmation(
        `¿Estás seguro de que deseas eliminar "${itemName}" del inventario?`,
        () => {
          eliminarItemInventario(personaje, category, index)
          cargarInventarioAcordeon(personaje, category, confirmModal, confirmMessage)
        },
        confirmModal,
        confirmMessage,
      )
    })
  })

  const equipIcons = accordionList.querySelectorAll(".equip-icon")
  equipIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const category = this.dataset.category
      const index = this.dataset.index
      equiparItem(personaje, category, index)
      cargarInventarioAcordeon(personaje, category, confirmModal, confirmMessage)
      cargarEquipamiento(personaje, confirmModal, confirmMessage)
    })
  })

  // Agregar event listeners a los iconos de mover a bolsa
  const moveToBagIcons = accordionList.querySelectorAll(".move-to-bag-icon")
  moveToBagIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const category = this.dataset.category
      const index = this.dataset.index
      mostrarModalMoverABolsa(personaje, category, index)
    })
  })
}

// Función para configurar el acordeón del inventario
export function configurarAcordeonInventario(personaje, confirmModal, confirmMessage) {
  const accordionHeaders = document.querySelectorAll(".accordion-header")

  accordionHeaders.forEach((header) => {
    // Añadir icono a cada categoría
    const category = header.dataset.category
    const categoryIcon = getCategoryIcon(category)

    // Verificar si ya existe un icono
    if (!header.querySelector(".category-icon")) {
      const titleElement = header.querySelector("h3") || header.querySelector("span")
      if (titleElement) {
        const iconElement = document.createElement("i")
        iconElement.className = `fas ${categoryIcon} category-icon`
        iconElement.style.marginRight = "10px"
        titleElement.insertBefore(iconElement, titleElement.firstChild)
      }
    }

    header.addEventListener("click", function () {
      const category = this.dataset.category
      const content = document.getElementById(`${category}-content`)
      const isActive = this.classList.contains("active")

      // Cerrar todos los acordeones
      document.querySelectorAll(".accordion-header").forEach((h) => h.classList.remove("active"))
      document.querySelectorAll(".accordion-content").forEach((c) => c.classList.remove("active"))

      // Si no estaba activo, abrirlo y cargar su contenido
      if (!isActive) {
        this.classList.add("active")
        content.classList.add("active")
        cargarInventarioAcordeon(personaje, category, confirmModal, confirmMessage)
      }
    })
  })

  // Configurar botones de añadir items
  configurarBotonesAnadirItems(personaje, confirmModal, confirmMessage)
}

// Función para configurar los botones de añadir items
export function configurarBotonesAnadirItems(personaje, confirmModal, confirmMessage) {
  const addItemBtns = document.querySelectorAll(".add-item-btn")
  addItemBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.dataset.category
      mostrarModalAnadirItem(personaje, category, confirmModal, confirmMessage)
    })
  })
}

// Función para mostrar el modal de añadir item
export function mostrarModalAnadirItem(personaje, category, confirmModal, confirmMessage) {
  const itemModal = document.getElementById("itemModal")
  const itemModalContent = document.getElementById("itemModalContent")

  let formHTML = ""
  let title = ""

  switch (category) {
    case "armaduras":
      title = "Añadir Armadura"
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="1">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemResistenciaMax">Resistencia Máxima:</label>
            <input type="number" id="itemResistenciaMax" min="0" value="10">
          </div>
          <div class="form-group">
            <label for="itemBloqueoFisico">Bloqueo Físico:</label>
            <input type="number" id="itemBloqueoFisico" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemBloqueoMagico">Bloqueo Mágico:</label>
            <input type="number" id="itemBloqueoMagico" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemResistenciaActual">Resistencia Actual:</label>
            <input type="number" id="itemResistenciaActual" min="0" value="10">
          </div>
        </div>
      `
      break
    case "armas":
      title = "Añadir Arma"
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="1">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemManos">Manos necesarias:</label>
            <select id="itemManos">
              <option value="0">No requiere manos</option>
              <option value="1" selected>1 mano</option>
              <option value="2">2 manos</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemTipo">Tipo de arma:</label>
            <select id="itemTipo">
              <option value="Cuerpo a cuerpo" selected>Cuerpo a cuerpo</option>
              <option value="A distancia">A distancia</option>
              <option value="Mágica">Mágica</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemDanio">Daño (ej: 2d4+1):</label>
            <input type="text" id="itemDanio" placeholder="1d6" value="1d6">
          </div>
          <div class="form-group">
            <label for="itemResistenciaMax">Resistencia Máxima:</label>
            <input type="number" id="itemResistenciaMax" min="0" value="10">
          </div>
          <div class="form-group">
            <label for="itemResistenciaActual">Resistencia Actual:</label>
            <input type="number" id="itemResistenciaActual" min="0" value="10">
          </div>
          <div class="form-group">
            <label for="itemEstadisticas">Estadísticas modificadas:</label>
            <input type="text" id="itemEstadisticas" placeholder="+1 daño, -1 defensa">
          </div>
        </div>
      `
      break
    // Continuar con los demás casos...
    case "municion":
      title = "Añadir Munición"
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="10">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemMejora">Mejora:</label>
            <input type="text" id="itemMejora" placeholder="daño +1">
          </div>
        </div>
      `
      break
    case "pociones":
      title = "Añadir Poción"
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="1">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemModificador">Modificador:</label>
            <input type="text" id="itemModificador" placeholder="salud">
          </div>
          <div class="form-group">
            <label for="itemEfecto">Efecto:</label>
            <input type="text" id="itemEfecto" placeholder="+1">
          </div>
        </div>
      `
      break
    case "pergaminos":
      title = "Añadir Pergamino"
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="1">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="0">
          </div>
          <div class="form-group">
            <label for="itemTipo">Tipo:</label>
            <select id="itemTipo">
              <option value="Ofensivo" selected>Ofensivo</option>
              <option value="Efecto de estado">Efecto de estado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemModificador">Modificador:</label>
            <input type="text" id="itemModificador" placeholder="daño">
          </div>
          <div class="form-group">
            <label for="itemEfecto">Efecto:</label>
            <input type="text" id="itemEfecto" placeholder="+2">
          </div>
          <div class="form-group full-width">
            <label for="itemDescripcion">Descripción:</label>
            <textarea id="itemDescripcion" rows="2"></textarea>
          </div>
        </div>
      `
      break
    case "otros":
      title = "Añadir Otro Objeto"
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="1">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="0">
          </div>
          <div class="form-group full-width">
            <label for="itemDescripcion">Descripción:</label>
            <textarea id="itemDescripcion" rows="2"></textarea>
          </div>
        </div>
      `
      break
  }

  // Preparar contenido del modal
  itemModalContent.innerHTML = `
    <h3>${title}</h3>
    ${formHTML}
    <div class="form-actions">
      <button id="addItemModalBtn" class="btn" data-category="${category}">Agregar</button>
    </div>
  `

  // Mostrar modal
  itemModal.classList.add("show-modal")

  // Configurar botón de agregar
  const addItemModalBtn = document.getElementById("addItemModalBtn")
  if (addItemModalBtn) {
    addItemModalBtn.addEventListener("click", function () {
      const category = this.dataset.category
      anadirItemInventario(personaje, category)
      itemModal.classList.remove("show-modal")
      cargarInventarioAcordeon(personaje, category, confirmModal, confirmMessage)
    })
  }
}

// Resto de funciones del módulo de inventario...
// Función para añadir item al inventario
export function anadirItemInventario(personaje, category) {
  const itemName = document.getElementById("itemName").value.trim()
  const itemQuantity = Number.parseInt(document.getElementById("itemQuantity").value) || 1
  const itemCoste = Number.parseInt(document.getElementById("itemCoste").value) || 0

  if (!itemName) {
    alert("El nombre del objeto es obligatorio")
    return
  }

  const newItem = {
    nombre: itemName,
    cantidad: itemQuantity,
    coste: itemCoste,
    categoria: category,
  }

  switch (category) {
    case "armaduras":
      newItem.resistenciaMax = Number.parseInt(document.getElementById("itemResistenciaMax").value) || 10
      newItem.bloqueoFisico = Number.parseInt(document.getElementById("itemBloqueoFisico").value) || 0
      newItem.bloqueoMagico = Number.parseInt(document.getElementById("itemBloqueoMagico").value) || 0
      newItem.resistenciaActual =
        Number.parseInt(document.getElementById("itemResistenciaActual").value) || newItem.resistenciaMax
      break
    case "armas":
      newItem.manos = Number.parseInt(document.getElementById("itemManos").value) || 1
      newItem.tipo = document.getElementById("itemTipo").value
      newItem.danio = document.getElementById("itemDanio").value || "1d6"
      newItem.resistenciaMax = Number.parseInt(document.getElementById("itemResistenciaMax").value) || 10
      newItem.resistenciaActual =
        Number.parseInt(document.getElementById("itemResistenciaActual").value) || newItem.resistenciaMax
      newItem.estadisticas = document.getElementById("itemEstadisticas").value || ""
      break
    case "municion":
      newItem.mejora = document.getElementById("itemMejora").value || ""
      break
    case "pociones":
      newItem.modificador = document.getElementById("itemModificador").value || ""
      newItem.efecto = document.getElementById("itemEfecto").value || ""
      break
    case "pergaminos":
      newItem.tipo = document.getElementById("itemTipo").value
      newItem.modificador = document.getElementById("itemModificador").value || ""
      newItem.efecto = document.getElementById("itemEfecto").value || ""
      newItem.descripcion = document.getElementById("itemDescripcion").value || ""
      break
    case "otros":
      newItem.descripcion = document.getElementById("itemDescripcion").value || ""
      break
  }

  personaje.inventario[category].push(newItem)
  guardarPersonaje(personaje)
}

// Función para editar un item del inventario
export function editarItemInventario(personaje, category, index) {
  // Implementación de la función...
}

// Función para eliminar un item del inventario
export function eliminarItemInventario(personaje, category, index) {
  personaje.inventario[category].splice(index, 1)
  guardarPersonaje(personaje)
}

// Función para equipar un item del inventario
export function equiparItem(personaje, category, index) {
  const item = personaje.inventario[category][index]

  // Solo se pueden equipar armaduras, armas y munición
  if (category !== "armaduras" && category !== "armas" && category !== "municion") {
    alert("Este tipo de objeto no se puede equipar.")
    return
  }

  // Verificar si el personaje tiene suficientes brazos para equipar el arma
  if (category === "armas" && item.manos > 0) {
    // Contar cuántas manos están ocupadas
    const manosOcupadas = personaje.equipados
      .filter((i) => i.categoria === "armas" && i.manos > 0)
      .reduce((total, i) => total + i.manos, 0)

    // Verificar si hay suficientes manos disponibles
    if (manosOcupadas + item.manos > personaje.brazos) {
      alert(`No tienes suficientes brazos para equipar esta arma. Necesitas ${item.manos} mano(s) libre(s).`)
      return
    }
  }

  // Crear una copia del item para equipar
  const itemToEquip = { ...item }

  // Si la cantidad es mayor que 1, reducir la cantidad en el inventario
  if (item.cantidad > 1) {
    item.cantidad -= 1
    itemToEquip.cantidad = 1
  } else {
    // Si solo hay 1, eliminar del inventario
    personaje.inventario[category].splice(index, 1)
  }

  // Añadir a equipados
  personaje.equipados.push(itemToEquip)

  guardarPersonaje(personaje)
}

// Función para mostrar el modal de mover a bolsa
export function mostrarModalMoverABolsa(personaje, category, index) {
  // Implementación de la función...
}
