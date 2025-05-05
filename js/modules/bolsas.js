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

// Otras funciones del módulo de bolsas...

// Declaración de funciones faltantes (dummy functions, replace with actual implementations)
function editarItemBolsa(personaje, bagIndex, itemIndex) {
  console.warn("editarItemBolsa function is not implemented yet.")
}

function mostrarModalMoverDesdebolsa(personaje, bagIndex, itemIndex) {
  console.warn("mostrarModalMoverDesdebolsa function is not implemented yet.")
}

function mostrarModalMoverAOtraBolsa(personaje, bagIndex, itemIndex) {
  console.warn("mostrarModalMoverAOtraBolsa function is not implemented yet.")
}

function mostrarModalAnadirRecursoABolsa(personaje, bagIndex, itemType) {
  console.warn("mostrarModalAnadirRecursoABolsa function is not implemented yet.")
}

function mostrarModalFormularioAnadirItemABolsa(personaje, bagIndex, itemType) {
  console.warn("mostrarModalFormularioAnadirItemABolsa function is not implemented yet.")
}
