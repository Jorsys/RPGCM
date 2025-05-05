// Módulo para la gestión de bolsas especiales

import { guardarPersonaje } from "./personaje.js"
import { showConfirmation } from "./utils.js"

// Función para cargar las bolsas especiales
export function cargarBolsasEspeciales(personaje, confirmModal, confirmMessage) {
  const specialBagsContainer = document.getElementById("special-bags-container")

  if (!specialBagsContainer) {
    console.error("No se encontró el contenedor de bolsas especiales")
    return
  }

  specialBagsContainer.innerHTML = ""

  if (!personaje.bolsasEspeciales || personaje.bolsasEspeciales.length === 0) {
    return
  }

  personaje.bolsasEspeciales.forEach((bolsa, index) => {
    const bagElement = document.createElement("div")
    bagElement.className = "special-bag"
    bagElement.innerHTML = `
      <div class="special-bag-header" data-bag-index="${index}">
        <h3>${bolsa.nombre}</h3>
        <div>
          <i class="fas fa-edit action-icon edit-bag-name-icon" data-bag-index="${index}" title="Editar nombre"></i>
          <i class="fas fa-trash action-icon delete-bag-icon" data-bag-index="${index}" title="Eliminar bolsa"></i>
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
      <div class="special-bag-content" id="bag-content-${index}">
        <div class="bag-items-list"></div>
        <p class="empty-bag-message ${bolsa.contenido.length > 0 ? "hidden" : ""}">Esta bolsa está vacía.</p>
      </div>
    `

    specialBagsContainer.appendChild(bagElement)

    // Cargar contenido de la bolsa
    cargarContenidoBolsa(personaje, index)
  })

  // Agregar event listeners a los headers de las bolsas
  const bagHeaders = document.querySelectorAll(".special-bag-header")
  bagHeaders.forEach((header) => {
    header.addEventListener("click", function (e) {
      // Ignorar si se hizo clic en un icono
      if (e.target.classList.contains("action-icon")) {
        return
      }

      const bagIndex = this.dataset.bagIndex
      const content = document.getElementById(`bag-content-${bagIndex}`)

      // Cerrar todas las bolsas
      document.querySelectorAll(".special-bag-content").forEach((c) => {
        if (c !== content) {
          c.classList.remove("active")
        }
      })

      // Alternar la bolsa actual
      content.classList.toggle("active")
    })
  })

  // Agregar event listeners a los iconos de editar nombre de bolsa
  const editBagNameIcons = document.querySelectorAll(".edit-bag-name-icon")
  editBagNameIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      editarNombreBolsa(personaje, bagIndex)
    })
  })

  // Agregar event listeners a los iconos de eliminar bolsa
  const deleteBagIcons = document.querySelectorAll(".delete-bag-icon")
  deleteBagIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const bagName = personaje.bolsasEspeciales[bagIndex].nombre

      showConfirmation(
        `¿Estás seguro de que deseas eliminar la bolsa "${bagName}"? Todos los objetos en ella volverán al inventario.`,
        () => {
          eliminarBolsa(personaje, bagIndex)
          cargarBolsasEspeciales(personaje, confirmModal, confirmMessage)
        },
        confirmModal,
        confirmMessage,
      )
    })
  })
}

// Función para cargar el contenido de una bolsa
export function cargarContenidoBolsa(personaje, bagIndex) {
  console.log(`Cargando contenido de la bolsa ${bagIndex}`)
  const bagContent = document.getElementById(`bag-content-${bagIndex}`)
  const bagItemsList = bagContent.querySelector(".bag-items-list")
  const emptyBagMessage = bagContent.querySelector(".empty-bag-message")
  const bolsa = personaje.bolsasEspeciales[bagIndex]

  if (!bagItemsList) {
    console.error(`No se encontró la lista de items para la bolsa ${bagIndex}`)
    return
  }

  bagItemsList.innerHTML = ""

  // Añadir leyenda de iconos
  const legendHTML = `
    <div class="icons-legend">
      <div class="legend-item"><i class="fas fa-edit"></i> Editar</div>
      <div class="legend-item"><i class="fas fa-arrow-up"></i> Mover al inventario</div>
      <div class="legend-item"><i class="fas fa-exchange-alt"></i> Mover a otra bolsa</div>
    </div>
  `
  bagItemsList.innerHTML = legendHTML

  // Añadir botón para crear nuevo objeto en la bolsa (siempre visible)
  const addItemButton = document.createElement("button")
  addItemButton.className = "btn-small"
  addItemButton.innerHTML = '<i class="fas fa-plus"></i> Añadir Objeto'
  addItemButton.dataset.bagIndex = bagIndex
  addItemButton.addEventListener("click", function () {
    const bagIndex = this.dataset.bagIndex
    mostrarModalAnadirItemABolsa(personaje, bagIndex)
  })

  bagItemsList.appendChild(addItemButton)
  bagItemsList.appendChild(document.createElement("br"))
  bagItemsList.appendChild(document.createElement("br"))

  if (!bolsa.contenido || bolsa.contenido.length === 0) {
    console.log(`La bolsa ${bagIndex} está vacía`)
    emptyBagMessage.classList.remove("hidden")
  } else {
    console.log(`La bolsa ${bagIndex} tiene ${bolsa.contenido.length} objetos:`, bolsa.contenido)
    emptyBagMessage.classList.add("hidden")

    // Crear tabla para mostrar los items
    let tableHTML = `<table class="bag-items-table"><thead><tr>
      <th>Nombre</th>
      <th>Tipo</th>
      <th>Cantidad</th>
      <th>Acciones</th>
    </tr></thead><tbody>`

    bolsa.contenido.forEach((item, index) => {
      tableHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.categoria}</td>
        <td>${item.cantidad || 1}</td>
        <td class="actions-cell">
          <i class="fas fa-edit action-icon edit-bag-item-icon" data-bag-index="${bagIndex}" data-item-index="${index}" title="Editar"></i>
          <i class="fas fa-arrow-up action-icon move-from-bag-icon" data-bag-index="${bagIndex}" data-item-index="${index}" title="Mover al inventario"></i>
          <i class="fas fa-exchange-alt action-icon move-to-other-bag-icon" data-bag-index="${bagIndex}" data-item-index="${index}" title="Mover a otra bolsa">
        </td>
      </tr>
    `
    })

    tableHTML += `</tbody></table>`
    bagItemsList.innerHTML += tableHTML

    // Agregar event listeners a los iconos
    const editBagItemIcons = bagItemsList.querySelectorAll(".edit-bag-item-icon")
    editBagItemIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        editarItemBolsa(personaje, bagIndex, itemIndex)
      })
    })

    const moveFromBagIcons = bagItemsList.querySelectorAll(".move-from-bag-icon")
    moveFromBagIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        mostrarModalMoverDesdebolsa(personaje, bagIndex, itemIndex)
      })
    })

    const moveToOtherBagIcons = bagItemsList.querySelectorAll(".move-to-other-bag-icon")
    moveToOtherBagIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        mostrarModalMoverAOtraBolsa(personaje, bagIndex, itemIndex)
      })
    })
  }
}

// Función para configurar el botón de crear bolsas especiales
export function configurarBotonCrearBolsa(personaje, confirmModal, confirmMessage) {
  const createBagBtn = document.getElementById("createBagBtn")
  const createBagModal = document.getElementById("createBagModal")
  const closeCreateBagModal = document.getElementById("closeCreateBagModal")
  const bagNameInput = document.getElementById("bagName")
  const createBagModalBtn = document.querySelector("#createBagModal #createBagBtn")

  if (createBagBtn) {
    createBagBtn.addEventListener("click", () => {
      // Limpiar campo
      if (bagNameInput) bagNameInput.value = ""
      // Mostrar modal
      createBagModal.classList.add("show-modal")
    })
  }

  if (closeCreateBagModal) {
    closeCreateBagModal.addEventListener("click", () => {
      createBagModal.classList.remove("show-modal")
    })

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === createBagModal) {
        createBagModal.classList.remove("show-modal")
      }
    })
  }

  // Corregir el selector para el botón dentro del modal
  if (createBagModalBtn) {
    createBagModalBtn.addEventListener("click", () => {
      const bagName = bagNameInput.value.trim()
      if (bagName) {
        // Crear nueva bolsa
        const newBag = {
          id: Date.now().toString(),
          nombre: bagName,
          contenido: [],
        }

        personaje.bolsasEspeciales.push(newBag)
        guardarPersonaje(personaje)
        cargarBolsasEspeciales(personaje, confirmModal, confirmMessage)

        // Cerrar modal
        createBagModal.classList.remove("show-modal")
      } else {
        alert("El nombre de la bolsa es obligatorio")
      }
    })
  }
}

// Función para editar el nombre de una bolsa
export function editarNombreBolsa(personaje, bagIndex) {
  const bolsa = personaje.bolsasEspeciales[bagIndex]

  // Mostrar un prompt para editar el nombre
  const newName = prompt("Introduce el nuevo nombre para la bolsa:", bolsa.nombre)

  if (newName && newName.trim() !== "") {
    bolsa.nombre = newName.trim()
    guardarPersonaje(personaje)
    cargarBolsasEspeciales(
      personaje,
      document.getElementById("confirmModal"),
      document.getElementById("confirmMessage"),
    )
  }
}

// Función para eliminar una bolsa
export function eliminarBolsa(personaje, bagIndex) {
  const bolsa = personaje.bolsasEspeciales[bagIndex]

  // Mover todos los objetos de la bolsa al inventario
  bolsa.contenido.forEach((item) => {
    if (!personaje.inventario[item.categoria]) {
      personaje.inventario[item.categoria] = []
    }

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
  })

  // Eliminar la bolsa
  personaje.bolsasEspeciales.splice(bagIndex, 1)
  guardarPersonaje(personaje)
}

// Función para mostrar el modal de añadir item a bolsa
export function mostrarModalAnadirItemABolsa(personaje, bagIndex) {
  const itemModal = document.getElementById("itemModal")
  const itemModalContent = document.getElementById("itemModalContent")
  const closeItemModal = document.getElementById("closeItemModal")

  // Preparar contenido del modal
  itemModalContent.innerHTML = `
    <h3>Añadir Objeto a la Bolsa</h3>
    <div class="form-group">
      <label for="itemTypeSelect">Selecciona el tipo de objeto:</label>
      <select id="itemTypeSelect">
        <option value="armaduras">Armadura</option>
        <option value="armas">Arma</option>
        <option value="municion">Munición</option>
        <option value="pociones">Poción</option>
        <option value="pergaminos">Pergamino</option>
        <option value="otros">Otro</option>
        <option value="monedas">Monedas</option>
        <option value="ganzuas">Ganzúas</option>
        <option value="antorchas">Antorchas</option>
        <option value="cuerdas">Cuerdas</option>
      </select>
    </div>
    <div class="form-actions">
      <button id="continueAddItemBtn" class="btn" data-bag-index="${bagIndex}">Continuar</button>
    </div>
  `

  // Mostrar modal
  itemModal.classList.add("show-modal")

  // Configurar botón de cerrar
  if (closeItemModal) {
    closeItemModal.addEventListener("click", () => {
      itemModal.classList.remove("show-modal")
    })
  }

  // Configurar botón de continuar
  const continueAddItemBtn = document.getElementById("continueAddItemBtn")
  if (continueAddItemBtn) {
    continueAddItemBtn.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const itemType = document.getElementById("itemTypeSelect").value

      // Si es un recurso simple, mostrar un formulario específico
      if (["monedas", "ganzuas", "antorchas", "cuerdas"].includes(itemType)) {
        mostrarModalAnadirRecursoABolsa(personaje, bagIndex, itemType)
      } else {
        mostrarModalFormularioAnadirItemABolsa(personaje, bagIndex, itemType)
      }

      itemModal.classList.remove("show-modal")
    })
  }
}

// Función para mostrar el modal de añadir recurso a bolsa
export function mostrarModalAnadirRecursoABolsa(personaje, bagIndex, itemType) {
  const resourceModal = document.getElementById("resourceModal")
  const resourceModalContent = document.getElementById("resourceModalContent")
  const closeResourceModal = document.getElementById("closeResourceModal")

  // Obtener nombre legible del recurso
  const nombreRecurso = obtenerNombreRecurso(itemType)

  // Preparar contenido del modal
  resourceModalContent.innerHTML = `
    <h3>Añadir ${nombreRecurso} a la Bolsa</h3>
    <div class="form-group">
      <label for="resourceAmount">Cantidad:</label>
      <input type="number" id="resourceAmount" min="1" value="1">
    </div>
    <div class="form-actions">
      <button id="addResourceToBagBtn" class="btn" data-bag-index="${bagIndex}" data-item-type="${itemType}">Añadir</button>
    </div>
  `

  // Mostrar modal
  resourceModal.classList.add("show-modal")

  // Configurar botón de cerrar
  if (closeResourceModal) {
    closeResourceModal.addEventListener("click", () => {
      resourceModal.classList.remove("show-modal")
    })
  }

  // Configurar botón de añadir
  const addResourceToBagBtn = document.getElementById("addResourceToBagBtn")
  if (addResourceToBagBtn) {
    addResourceToBagBtn.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const itemType = this.dataset.itemType
      const cantidad = Number.parseInt(document.getElementById("resourceAmount").value) || 1

      // Crear objeto para añadir a la bolsa
      const newItem = {
        nombre: nombreRecurso,
        categoria: itemType,
        cantidad: cantidad,
      }

      // Añadir a la bolsa
      personaje.bolsasEspeciales[bagIndex].contenido.push(newItem)
      guardarPersonaje(personaje)
      cargarContenidoBolsa(personaje, bagIndex)

      // Cerrar modal
      resourceModal.classList.remove("show-modal")
    })
  }
}

// Función para mostrar el modal de formulario para añadir item a bolsa
export function mostrarModalFormularioAnadirItemABolsa(personaje, bagIndex, itemType) {
  const itemModal = document.getElementById("itemModal")
  const itemModalContent = document.getElementById("itemModalContent")
  const closeItemModal = document.getElementById("closeItemModal")

  let formHTML = ""
  let title = ""

  switch (itemType) {
    case "armaduras":
      title = "Añadir Armadura a la Bolsa"
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
      title = "Añadir Arma a la Bolsa"
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
    case "municion":
      title = "Añadir Munición a la Bolsa"
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
      title = "Añadir Poción a la Bolsa"
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
      title = "Añadir Pergamino a la Bolsa"
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
      title = "Añadir Otro Objeto a la Bolsa"
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
      <button id="addItemToBagBtn" class="btn" data-bag-index="${bagIndex}" data-item-type="${itemType}">Agregar</button>
    </div>
  `

  // Mostrar modal
  itemModal.classList.add("show-modal")

  // Configurar botón de cerrar
  if (closeItemModal) {
    closeItemModal.addEventListener("click", () => {
      itemModal.classList.remove("show-modal")
    })
  }

  // Configurar botón de agregar
  const addItemToBagBtn = document.getElementById("addItemToBagBtn")
  if (addItemToBagBtn) {
    addItemToBagBtn.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const itemType = this.dataset.itemType
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
        categoria: itemType,
      }

      switch (itemType) {
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

      // Añadir a la bolsa
      personaje.bolsasEspeciales[bagIndex].contenido.push(newItem)
      guardarPersonaje(personaje)
      cargarContenidoBolsa(personaje, bagIndex)

      // Cerrar modal
      itemModal.classList.remove("show-modal")
    })
  }
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

// Función para editar un item de una bolsa
export function editarItemBolsa(personaje, bagIndex, itemIndex) {
  const bolsa = personaje.bolsasEspeciales[bagIndex]
  const item = bolsa.contenido[itemIndex]
  const itemModal = document.getElementById("itemModal")
  const itemModalContent = document.getElementById("itemModalContent")
  const closeItemModal = document.getElementById("closeItemModal")

  let formHTML = ""
  const title = `Editar ${item.nombre}`

  switch (item.categoria) {
    case "armaduras":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
          </div>
          <div class="form-group">
            <label for="itemResistenciaMax">Resistencia Máxima:</label>
            <input type="number" id="itemResistenciaMax" min="0" value="${item.resistenciaMax || 10}">
          </div>
          <div class="form-group">
            <label for="itemBloqueoFisico">Bloqueo Físico:</label>
            <input type="number" id="itemBloqueoFisico" min="0" value="${item.bloqueoFisico || 0}">
          </div>
          <div class="form-group">
            <label for="itemBloqueoMagico">Bloqueo Mágico:</label>
            <input type="number" id="itemBloqueoMagico" min="0" value="${item.bloqueoMagico || 0}">
          </div>
          <div class="form-group">
            <label for="itemResistenciaActual">Resistencia Actual:</label>
            <input type="number" id="itemResistenciaActual" min="0" value="${item.resistenciaActual || item.resistenciaMax || 10}">
          </div>
        </div>
      `
      break
    case "armas":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
          </div>
          <div class="form-group">
            <label for="itemManos">Manos necesarias:</label>
            <select id="itemManos">
              <option value="0" ${item.manos === 0 ? "selected" : ""}>No requiere manos</option>
              <option value="1" ${item.manos === 1 ? "selected" : ""}>1 mano</option>
              <option value="2" ${item.manos === 2 ? "selected" : ""}>2 manos</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemTipo">Tipo de arma:</label>
            <select id="itemTipo">
              <option value="Cuerpo a cuerpo" ${item.tipo === "Cuerpo a cuerpo" ? "selected" : ""}>Cuerpo a cuerpo</option>
              <option value="A distancia" ${item.tipo === "A distancia" ? "selected" : ""}>A distancia</option>
              <option value="Mágica" ${item.tipo === "Mágica" ? "selected" : ""}>Mágica</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemDanio">Daño (ej: 2d4+1):</label>
            <input type="text" id="itemDanio" placeholder="1d6" value="${item.danio || "1d6"}">
          </div>
          <div class="form-group">
            <label for="itemResistenciaMax">Resistencia Máxima:</label>
            <input type="number" id="itemResistenciaMax" min="0" value="${item.resistenciaMax || 10}">
          </div>
          <div class="form-group">
            <label for="itemResistenciaActual">Resistencia Actual:</label>
            <input type="number" id="itemResistenciaActual" min="0" value="${item.resistenciaActual || item.resistenciaMax || 10}">
          </div>
          <div class="form-group">
            <label for="itemEstadisticas">Estadísticas modificadas:</label>
            <input type="text" id="itemEstadisticas" placeholder="+1 daño, -1 defensa" value="${item.estadisticas || ""}">
          </div>
        </div>
      `
      break
    case "municion":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 10}">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
          </div>
          <div class="form-group">
            <label for="itemMejora">Mejora:</label>
            <input type="text" id="itemMejora" placeholder="daño +1" value="${item.mejora || ""}">
          </div>
        </div>
      `
      break
    case "pociones":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
          </div>
          <div class="form-group">
            <label for="itemModificador">Modificador:</label>
            <input type="text" id="itemModificador" placeholder="salud" value="${item.modificador || ""}">
          </div>
          <div class="form-group">
            <label for="itemEfecto">Efecto:</label>
            <input type="text" id="itemEfecto" placeholder="+1" value="${item.efecto || ""}">
          </div>
        </div>
      `
      break
    case "pergaminos":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
          </div>
          <div class="form-group">
            <label for="itemTipo">Tipo:</label>
            <select id="itemTipo">
              <option value="Ofensivo" ${item.tipo === "Ofensivo" ? "selected" : ""}>Ofensivo</option>
              <option value="Efecto de estado" ${item.tipo === "Efecto de estado" ? "selected" : ""}>Efecto de estado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemModificador">Modificador:</label>
            <input type="text" id="itemModificador" placeholder="daño" value="${item.modificador || ""}">
          </div>
          <div class="form-group">
            <label for="itemEfecto">Efecto:</label>
            <input type="text" id="itemEfecto" placeholder="+2" value="${item.efecto || ""}">
          </div>
          <div class="form-group full-width">
            <label for="itemDescripcion">Descripción:</label>
            <textarea id="itemDescripcion" rows="2">${item.descripcion || ""}</textarea>
          </div>
        </div>
      `
      break
    case "otros":
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
          </div>
          <div class="form-group">
            <label for="itemCoste">Coste por unidad:</label>
            <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
          </div>
          <div class="form-group full-width">
            <label for="itemDescripcion">Descripción:</label>
            <textarea id="itemDescripcion" rows="2">${item.descripcion || ""}</textarea>
          </div>
        </div>
      `
      break
    default:
      formHTML = `
        <div class="form-grid">
          <div class="form-group">
            <label for="itemName">Nombre:</label>
            <input type="text" id="itemName" value="${item.nombre}" required>
          </div>
          <div class="form-group">
            <label for="itemQuantity">Cantidad:</label>
            <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
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
      <button id="saveItemBagBtn" class="btn" data-bag-index="${bagIndex}" data-item-index="${itemIndex}">Guardar Cambios</button>
    </div>
  `

  // Mostrar modal
  itemModal.classList.add("show-modal")

  // Configurar botón de cerrar
  if (closeItemModal) {
    closeItemModal.addEventListener("click", () => {
      itemModal.classList.remove("show-modal")
    })
  }

  // Configurar botón de guardar
  const saveItemBagBtn = document.getElementById("saveItemBagBtn")
  if (saveItemBagBtn) {
    saveItemBagBtn.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const itemIndex = this.dataset.itemIndex
      const itemName = document.getElementById("itemName").value.trim()
      const itemQuantity = Number.parseInt(document.getElementById("itemQuantity").value) || 1
      const itemCoste = Number.parseInt(document.getElementById("itemCoste").value) || 0

      if (!itemName) {
        alert("El nombre del objeto es obligatorio")
        return
      }

      // Actualizar propiedades básicas
      item.nombre = itemName
      item.cantidad = itemQuantity
      item.coste = itemCoste

      // Actualizar propiedades específicas según la categoría
      switch (item.categoria) {
        case "armaduras":
          item.resistenciaMax = Number.parseInt(document.getElementById("itemResistenciaMax").value) || 10
          item.bloqueoFisico = Number.parseInt(document.getElementById("itemBloqueoFisico").value) || 0
          item.bloqueoMagico = Number.parseInt(document.getElementById("itemBloqueoMagico").value) || 0
          item.resistenciaActual =
            Number.parseInt(document.getElementById("itemResistenciaActual").value) || item.resistenciaMax
          break
        case "armas":
          item.manos = Number.parseInt(document.getElementById("itemManos").value) || 1
          item.tipo = document.getElementById("itemTipo").value
          item.danio = document.getElementById("itemDanio").value || "1d6"
          item.resistenciaMax = Number.parseInt(document.getElementById("itemResistenciaMax").value) || 10
          item.resistenciaActual =
            Number.parseInt(document.getElementById("itemResistenciaActual").value) || item.resistenciaMax
          item.estadisticas = document.getElementById("itemEstadisticas").value || ""
          break
        case "municion":
          item.mejora = document.getElementById("itemMejora").value || ""
          break
        case "pociones":
          item.modificador = document.getElementById("itemModificador").value || ""
          item.efecto = document.getElementById("itemEfecto").value || ""
          break
        case "pergaminos":
          item.tipo = document.getElementById("itemTipo").value
          item.modificador = document.getElementById("itemModificador").value || ""
          item.efecto = document.getElementById("itemEfecto").value || ""
          item.descripcion = document.getElementById("itemDescripcion").value || ""
          break
        case "otros":
          item.descripcion = document.getElementById("itemDescripcion").value || ""
          break
      }

      guardarPersonaje(personaje)
      cargarContenidoBolsa(personaje, bagIndex)

      // Cerrar modal
      itemModal.classList.remove("show-modal")
    })
  }
}

// Función para mostrar el modal de mover desde bolsa al inventario
export function mostrarModalMoverDesdebolsa(personaje, bagIndex, itemIndex) {
  const bolsa = personaje.bolsasEspeciales[bagIndex]
  const item = bolsa.contenido[itemIndex]
  const confirmModal = document.getElementById("confirmModal")
  const confirmMessage = document.getElementById("confirmMessage")

  // Mostrar confirmación
  showConfirmation(
    `¿Estás seguro de que deseas mover "${item.nombre}" al inventario?`,
    () => {
      moverItemDesdeBolsa(personaje, bagIndex, itemIndex)
    },
    confirmModal,
    confirmMessage,
  )
}

// Función para mover un item desde una bolsa al inventario
export function moverItemDesdeBolsa(personaje, bagIndex, itemIndex) {
  const bolsa = personaje.bolsasEspeciales[bagIndex]
  const item = bolsa.contenido[itemIndex]

  // Si es un recurso simple, incrementar el contador
  if (["monedas", "ganzuas", "antorchas", "cuerdas"].includes(item.categoria)) {
    personaje.inventario[item.categoria] += item.cantidad || 1
  } else {
    // Si es un objeto, añadirlo a la categoría correspondiente
    if (!personaje.inventario[item.categoria]) {
      personaje.inventario[item.categoria] = []
    }

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
  }

  // Eliminar el item de la bolsa
  bolsa.contenido.splice(itemIndex, 1)
  guardarPersonaje(personaje)
  cargarContenidoBolsa(personaje, bagIndex)
}

// Función para mostrar el modal de mover a otra bolsa
export function mostrarModalMoverAOtraBolsa(personaje, bagIndex, itemIndex) {
  const bolsa = personaje.bolsasEspeciales[bagIndex]
  const item = bolsa.contenido[itemIndex]
  const moveToBagModal = document.getElementById("moveToBagModal")
  const moveToBagModalContent = document.getElementById("moveToBagModalContent")
  const closeMoveToBagModal = document.getElementById("closeMoveToBagModal")

  // Preparar contenido del modal
  let bagOptionsHTML = ""
  personaje.bolsasEspeciales.forEach((b, i) => {
    if (i !== Number(bagIndex)) {
      bagOptionsHTML += `<option value="${i}">${b.nombre}</option>`
    }
  })

  moveToBagModalContent.innerHTML = `
    <h3>Mover ${item.nombre} a otra bolsa</h3>
    <div class="form-group">
      <label for="targetBagSelect">Selecciona la bolsa destino:</label>
      <select id="targetBagSelect">
        ${bagOptionsHTML}
      </select>
    </div>
    <div class="form-group">
      <label for="moveQuantity">Cantidad a mover:</label>
      <input type="number" id="moveQuantity" min="1" max="${item.cantidad || 1}" value="${item.cantidad || 1}">
    </div>
    <div class="form-actions">
      <button id="moveToOtherBagBtn" class="btn" data-bag-index="${bagIndex}" data-item-index="${itemIndex}">Mover</button>
    </div>
  `

  // Mostrar modal
  moveToBagModal.classList.add("show-modal")

  // Configurar botón de cerrar
  if (closeMoveToBagModal) {
    closeMoveToBagModal.addEventListener("click", () => {
      moveToBagModal.classList.remove("show-modal")
    })
  }

  // Configurar botón de mover
  const moveToOtherBagBtn = document.getElementById("moveToOtherBagBtn")
  if (moveToOtherBagBtn) {
    moveToOtherBagBtn.addEventListener("click", function () {
      const sourceBagIndex = this.dataset.bagIndex
      const itemIndex = this.dataset.itemIndex
      const targetBagIndex = document.getElementById("targetBagSelect").value
      const quantity = Number.parseInt(document.getElementById("moveQuantity").value) || 1

      moverItemAOtraBolsa(personaje, sourceBagIndex, itemIndex, targetBagIndex, quantity)
      moveToBagModal.classList.remove("show-modal")
    })
  }
}

// Función para mover un item a otra bolsa
export function moverItemAOtraBolsa(personaje, sourceBagIndex, itemIndex, targetBagIndex, quantity) {
  const sourceBag = personaje.bolsasEspeciales[sourceBagIndex]
  const targetBag = personaje.bolsasEspeciales[targetBagIndex]
  const item = sourceBag.contenido[itemIndex]

  // Crear copia del item para la bolsa destino
  const itemToMove = { ...item }
  itemToMove.cantidad = quantity

  // Añadir a la bolsa destino
  targetBag.contenido.push(itemToMove)

  // Actualizar o eliminar del origen
  if (item.cantidad > quantity) {
    item.cantidad -= quantity
  } else {
    sourceBag.contenido.splice(itemIndex, 1)
  }

  guardarPersonaje(personaje)
  cargarContenidoBolsa(personaje, sourceBagIndex)
  cargarContenidoBolsa(personaje, targetBagIndex)
}
