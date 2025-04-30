// Esperar a que los componentes se carguen antes de inicializar la aplicación
document.addEventListener("componentsLoaded", () => {
  console.log("ficha-personaje.js: Componentes cargados, inicializando aplicación")

  // Aquí va el código original de ficha-personaje.js
  // Obtener el nombre del personaje de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const characterName = urlParams.get("nombre")

  if (!characterName) {
    alert("No se ha especificado un personaje.")
    window.location.href = "personaje.html"
    return
  }

  // Cargar datos del personaje
  const characterData = localStorage.getItem(characterName + ".json")
  if (!characterData) {
    alert("No se encontró el personaje especificado.")
    window.location.href = "personaje.html"
    return
  }

  const personaje = JSON.parse(characterData)
  console.log("Personaje cargado:", personaje)

  // Inicializar estructura de datos si no existe
  if (!personaje.grimorio) {
    personaje.grimorio = []
  }

  if (!personaje.equipados) {
    personaje.equipados = []
  }

  if (!personaje.inventario) {
    personaje.inventario = {
      armaduras: [],
      armas: [],
      municion: [],
      pociones: [],
      pergaminos: [],
      monedas: 0,
      ganzuas: 0,
      antorchas: 0,
      cuerdas: 0,
      otros: [],
    }
  }

  // Inicializar bolsas especiales si no existen
  if (!personaje.bolsasEspeciales) {
    personaje.bolsasEspeciales = []
  }

  // Asegurar que existen todas las categorías de inventario
  const categorias = ["armaduras", "armas", "municion", "pociones", "pergaminos", "otros"]
  categorias.forEach((categoria) => {
    if (!personaje.inventario[categoria]) {
      personaje.inventario[categoria] = []
    }
  })

  // Asegurar que existen los contadores simples
  const contadoresSimples = ["monedas", "ganzuas", "antorchas", "cuerdas"]
  contadoresSimples.forEach((contador) => {
    if (personaje.inventario[contador] === undefined) {
      personaje.inventario[contador] = 0
    }
  })

  // Asegurar que todos los objetos tienen coste
  categorias.forEach((categoria) => {
    personaje.inventario[categoria].forEach((item) => {
      if (item.coste === undefined) {
        item.coste = 0
      }
    })
  })

  // Actualizar título de la página
  const characterNameElement = document.getElementById("characterName")
  if (characterNameElement) {
    characterNameElement.textContent = `Ficha de ${personaje.nombre}`
  }

  // Rellenar campos del formulario con verificación de existencia
  const fillField = (id, value) => {
    const element = document.getElementById(id)
    if (element) {
      element.value = value
    } else {
      console.error(`Elemento con ID ${id} no encontrado`)
    }
  }

  fillField("nombre", personaje.nombre)
  fillField("raza", personaje.raza)
  fillField("nivel", personaje.nivel)
  fillField("clase", personaje.clase)
  fillField("combateCuerpo", personaje.combateCuerpo)
  fillField("combateDistancia", personaje.combateDistancia)
  fillField("lanzamientoHechizos", personaje.lanzamientoHechizos)
  fillField("vida", personaje.vida)
  fillField("aguante", personaje.aguante)
  fillField("mana", personaje.mana)

  // Variables para la confirmación
  let confirmCallback = null

  // Configurar modal de confirmación
  const confirmModal = document.getElementById("confirmModal")
  const closeConfirmModal = document.getElementById("closeConfirmModal")
  const confirmYesBtn = document.getElementById("confirmYesBtn")
  const confirmNoBtn = document.getElementById("confirmNoBtn")
  const confirmMessage = document.getElementById("confirmMessage")

  if (closeConfirmModal) {
    closeConfirmModal.addEventListener("click", () => {
      confirmModal.classList.remove("show-modal")
    })
  }

  if (confirmNoBtn) {
    confirmNoBtn.addEventListener("click", () => {
      confirmModal.classList.remove("show-modal")
    })
  }

  if (confirmYesBtn) {
    confirmYesBtn.addEventListener("click", () => {
      if (confirmCallback) {
        confirmCallback()
      }
      confirmModal.classList.remove("show-modal")
    })
  }

  // Función para mostrar confirmación
  function showConfirmation(message, callback) {
    confirmMessage.textContent = message
    confirmCallback = callback
    confirmModal.classList.add("show-modal")
  }

  // Función para guardar el personaje
  function saveCharacter() {
    if (window.saveDataAndSync) {
      window.saveDataAndSync(personaje.nombre + ".json", personaje)
    } else {
      localStorage.setItem(personaje.nombre + ".json", JSON.stringify(personaje))
    }
    console.log("Personaje guardado:", personaje)
  }

  // Función para obtener el nombre legible de una categoría
  function getCategoryName(category) {
    const names = {
      armaduras: "Armadura",
      armas: "Arma",
      municion: "Munición",
      pociones: "Poción",
      pergaminos: "Pergamino",
      otros: "Otro",
    }

    return names[category] || category
  }

  // Declaración de funciones (antes de su uso)
  let loadGrimorio
  let loadEquipment
  let setupInventoryAccordion
  let setupResourceModals
  let loadSpecialBags
  let attributeListenersFunc
  let statusControlsFunc

  // Función para cargar el grimorio
  loadGrimorio = () => {
    const grimorioList = document.getElementById("grimorioList")
    if (!grimorioList) {
      console.error("No se encontró el elemento con ID 'grimorioList'")
      return
    }

    grimorioList.innerHTML = ""

    if (!personaje.grimorio || personaje.grimorio.length === 0) {
      grimorioList.innerHTML = "<tr><td colspan='7'>No hay hechizos en el grimorio.</td></tr>"
      return
    }

    personaje.grimorio.forEach((hechizo, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${hechizo.nombre}</td>
        <td>${hechizo.dificultad.valor} ${hechizo.dificultad.dados}</td>
        <td>${hechizo.distancia}m</td>
        <td>${hechizo.uso}</td>
        <td>${hechizo.accion}</td>
        <td>${hechizo.descripcion || "-"}</td>
        <td class="actions-cell">
          <i class="fas fa-edit action-icon edit-spell-icon" data-index="${index}" title="Editar"></i>
          <i class="fas fa-trash action-icon delete-spell-icon" data-index="${index}" title="Eliminar"></i>
        </td>
      `

      grimorioList.appendChild(row)
    })

    // Agregar event listeners a los iconos de editar hechizo
    const editSpellIcons = document.querySelectorAll(".edit-spell-icon")
    editSpellIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.dataset.index
        editSpell(index)
      })
    })

    // Agregar event listeners a los iconos de eliminar hechizo
    const deleteSpellIcons = document.querySelectorAll(".delete-spell-icon")
    deleteSpellIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.dataset.index
        const spellName = personaje.grimorio[index].nombre

        showConfirmation(`¿Estás seguro de que deseas eliminar el hechizo "${spellName}"?`, () => {
          removeSpell(index)
        })
      })
    })
  }

  // Función para agregar un hechizo al grimorio
  function addSpell(hechizo) {
    personaje.grimorio.push(hechizo)
    saveCharacter()
    loadGrimorio()
  }

  // Función para eliminar un hechizo del grimorio
  function removeSpell(index) {
    personaje.grimorio.splice(index, 1)
    saveCharacter()
    loadGrimorio()
  }

  // Función para editar un hechizo del grimorio
  function editSpell(index) {
    const hechizo = personaje.grimorio[index]
    const createSpellModal = document.getElementById("createSpellModal")

    // Rellenar campos del formulario con los datos del hechizo
    if (document.getElementById("spellName")) document.getElementById("spellName").value = hechizo.nombre
    if (document.getElementById("spellDifficultyValue"))
      document.getElementById("spellDifficultyValue").value = hechizo.dificultad.valor
    if (document.getElementById("spellDifficultyDice"))
      document.getElementById("spellDifficultyDice").value = hechizo.dificultad.dados
    if (document.getElementById("spellDistance")) document.getElementById("spellDistance").value = hechizo.distancia
    if (document.getElementById("spellUse")) document.getElementById("spellUse").value = hechizo.uso
    if (document.getElementById("spellAction")) document.getElementById("spellAction").value = hechizo.accion
    if (document.getElementById("spellDescription"))
      document.getElementById("spellDescription").value = hechizo.descripcion

    // Mostrar el modal
    createSpellModal.classList.add("show-modal")

    // Modificar el botón de agregar hechizo para que actualice el hechizo existente
    const addSpellBtn = document.getElementById("addSpellBtn")
    if (addSpellBtn) {
      // Eliminar cualquier event listener anterior
      const newAddSpellBtn = addSpellBtn.cloneNode(true)
      addSpellBtn.parentNode.replaceChild(newAddSpellBtn, addSpellBtn)

      newAddSpellBtn.textContent = "Actualizar Hechizo"

      newAddSpellBtn.addEventListener("click", () => {
        const spellName = document.getElementById("spellName")?.value.trim() || ""
        const difficultyValue = document.getElementById("spellDifficultyValue")?.value || "6"
        const difficultyDice = document.getElementById("spellDifficultyDice")?.value || "1d10"
        const distance = document.getElementById("spellDistance")?.value || "0"
        const use = document.getElementById("spellUse")?.value || "Ofensivo"
        const action = document.getElementById("spellAction")?.value || ""
        const description = document.getElementById("spellDescription")?.value || ""

        if (spellName) {
          // Actualizar el hechizo existente
          personaje.grimorio[index] = {
            nombre: spellName,
            dificultad: {
              valor: difficultyValue,
              dados: difficultyDice,
            },
            distancia: distance,
            uso: use,
            accion: action,
            descripcion: description,
          }

          saveCharacter()
          loadGrimorio()

          // Cerrar el modal
          createSpellModal.classList.remove("show-modal")
        } else {
          alert("El nombre del hechizo es obligatorio")
        }
      })
    }
  }

  // Función para cargar el equipamiento
  loadEquipment = () => {
    const equippedItems = document.getElementById("equippedItems")
    if (!equippedItems) {
      console.error("No se encontró el elemento con ID 'equippedItems'")
      return
    }

    equippedItems.innerHTML = ""

    if (!personaje.equipados || personaje.equipados.length === 0) {
      equippedItems.innerHTML = "<p>No hay objetos equipados.</p>"
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
            <i class="fas fa-trash action-icon unequip-icon" data-index="${index}" title="Desequipar"></i>
          </td>
        </tr>
      `
    })

    tableHTML += `</tbody></table>`
    equippedItems.innerHTML = tableHTML

    // Agregar event listeners a los iconos
    const editEquipmentIcons = equippedItems.querySelectorAll(".edit-equipment-icon")
    editEquipmentIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.dataset.index
        editEquipment(index)
      })
    })

    const unequipIcons = equippedItems.querySelectorAll(".unequip-icon")
    unequipIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const index = this.dataset.index
        const itemName = personaje.equipados[index].nombre

        showConfirmation(`¿Estás seguro de que deseas desequipar "${itemName}"?`, () => {
          unequipItem(index)
        })
      })
    })
  }

  // Función para desequipar un item
  function unequipItem(index) {
    const item = personaje.equipados[index]

    // Verificar si ya existe un item similar en el inventario
    const existingItemIndex = personaje.inventario[item.categoria].findIndex(
      (i) =>
        i.nombre === item.nombre &&
        (item.categoria !== "armas" || i.manos === item.manos) &&
        (item.categoria !== "armaduras" ||
          (i.resistenciaMax === item.resistenciaMax &&
            i.bloqueoFisico === item.bloqueoFisico &&
            i.bloqueoMagico === i.bloqueoMagico)),
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
    saveCharacter()
    loadEquipment()

    // Recargar la categoría actual del inventario si está abierta
    const activeHeader = document.querySelector(".accordion-header.active")
    if (activeHeader) {
      const category = activeHeader.dataset.category
      loadInventoryAccordion(category)
    }
  }

  // Función para editar un item equipado
  function editEquipment(index) {
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
        saveEquippedChanges(index)
        editEquippedModal.classList.remove("show-modal")
      })
    }
  }

  // Función para guardar cambios en un item equipado
  function saveEquippedChanges(index) {
    const item = personaje.equipados[index]

    switch (item.categoria) {
      case "armaduras":
        const resistenciaActual = Number.parseInt(document.getElementById("editEquippedResistenciaActual").value) || 0
        item.resistenciaActual = Math.min(resistenciaActual, item.resistenciaMax)
        break
      case "armas":
        const armaResistenciaActual =
          Number.parseInt(document.getElementById("editEquippedResistenciaActual").value) || 0
        item.resistenciaActual = Math.min(armaResistenciaActual, item.resistenciaMax || 10)
        break
      case "municion":
        const cantidad = Number.parseInt(document.getElementById("editEquippedCantidad").value) || 1
        item.cantidad = Math.max(1, cantidad)
        break
    }

    saveCharacter()
    loadEquipment()
  }

  // Función para cargar los recursos simples
  function loadSimpleResources() {
    // Actualizar los valores de los recursos
    document.getElementById("monedas-value").textContent = personaje.inventario.monedas
    document.getElementById("ganzuas-value").textContent = personaje.inventario.ganzuas
    document.getElementById("antorchas-value").textContent = personaje.inventario.antorchas
    document.getElementById("cuerdas-value").textContent = personaje.inventario.cuerdas

    // Agregar event listeners a los recursos
    const resources = ["monedas", "ganzuas", "antorchas", "cuerdas"]
    resources.forEach((resource) => {
      const resourceElement = document.getElementById(`${resource}-resource`)
      if (resourceElement) {
        resourceElement.addEventListener("click", () => {
          showResourceModal(resource)
        })
      }
    })
  }

  // Función para mostrar el modal de recursos
  function showResourceModal(resource) {
    const resourceModal = document.getElementById("resourceModal")
    const resourceModalContent = document.getElementById("resourceModalContent")

    // Preparar contenido del modal
    resourceModalContent.innerHTML = `
      <h3>Gestionar ${resource}</h3>
      <div class="form-group">
        <label for="resourceQuantity">Cantidad actual:</label>
        <input type="number" id="resourceQuantity" min="0" value="${personaje.inventario[resource]}">
      </div>
      <div class="resource-form">
        <div class="resource-form-row">
          <label for="resourceAmount">Cantidad:</label>
          <input type="number" id="resourceAmount" min="1" value="1">
          <div class="resource-form-actions">
            <button id="addResourceBtn" class="btn-small" data-resource="${resource}">Añadir</button>
            <button id="removeResourceBtn" class="btn-small" data-resource="${resource}">Quitar</button>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button id="saveResourceBtn" class="btn" data-resource="${resource}">Guardar</button>
      </div>
    `

    // Mostrar modal
    resourceModal.classList.add("show-modal")

    // Configurar botones
    const saveResourceBtn = document.getElementById("saveResourceBtn")
    const addResourceBtn = document.getElementById("addResourceBtn")
    const removeResourceBtn = document.getElementById("removeResourceBtn")

    if (saveResourceBtn) {
      saveResourceBtn.addEventListener("click", function () {
        const resource = this.dataset.resource
        const quantity = Number.parseInt(document.getElementById("resourceQuantity").value) || 0

        // Actualizar cantidad
        personaje.inventario[resource] = quantity

        // Guardar y actualizar UI
        saveCharacter()
        loadSimpleResources()

        // Cerrar modal
        resourceModal.classList.remove("show-modal")
      })
    }

    if (addResourceBtn) {
      addResourceBtn.addEventListener("click", function () {
        const resource = this.dataset.resource
        const amount = Number.parseInt(document.getElementById("resourceAmount").value) || 0
        const currentQuantity = Number.parseInt(document.getElementById("resourceQuantity").value) || 0

        // Actualizar cantidad en el input
        document.getElementById("resourceQuantity").value = currentQuantity + amount
      })
    }

    if (removeResourceBtn) {
      removeResourceBtn.addEventListener("click", function () {
        const resource = this.dataset.resource
        const amount = Number.parseInt(document.getElementById("resourceAmount").value) || 0
        const currentQuantity = Number.parseInt(document.getElementById("resourceQuantity").value) || 0

        // Actualizar cantidad en el input (no permitir valores negativos)
        document.getElementById("resourceQuantity").value = Math.max(0, currentQuantity - amount)
      })
    }
  }

  // Configurar modales para recursos simples
  setupResourceModals = () => {
    const resourceModal = document.getElementById("resourceModal")
    const closeResourceModal = document.getElementById("closeResourceModal")

    // Cerrar modal al hacer clic en X
    if (closeResourceModal) {
      closeResourceModal.addEventListener("click", () => {
        resourceModal.classList.remove("show-modal")
      })
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === resourceModal) {
        resourceModal.classList.remove("show-modal")
      }
    })
  }

  // Función para configurar el acordeón de inventario
  setupInventoryAccordion = () => {
    const accordionHeaders = document.querySelectorAll(".accordion-header")

    accordionHeaders.forEach((header) => {
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
          loadInventoryAccordion(category)
        }
      })
    })
  }

  // Función para cargar el contenido del acordeón de inventario
  function loadInventoryAccordion(category) {
    const accordionList = document.querySelector(`#${category}-content .accordion-list`)

    if (!accordionList) {
      console.error(`No se encontró el contenedor para la categoría ${category}`)
      return
    }

    accordionList.innerHTML = ""

    // Si no hay items en esta categoría
    if (!personaje.inventario[category] || personaje.inventario[category].length === 0) {
      accordionList.innerHTML = "<p>No hay objetos en esta categoría.</p>"
      return
    }

    // Crear tabla según la categoría
    let tableHTML = `<table class="inventory-table"><thead><tr>`

    // Definir columnas según la categoría
    let columns = []

    switch (category) {
      case "armaduras":
        columns = ["Cantidad", "Nombre", "Resistencia", "Bloqueo F/M", "Coste", "Acciones"]
        break
      case "armas":
        columns = ["Cantidad", "Nombre", "Manos", "Tipo", "Daño", "Resistencia", "Coste", "Acciones"]
        break
      case "municion":
        columns = ["Cantidad", "Nombre", "Mejora", "Coste", "Acciones"]
        break
      case "pociones":
        columns = ["Cantidad", "Nombre", "Efecto", "Coste", "Acciones"]
        break
      case "pergaminos":
        columns = ["Cantidad", "Nombre", "Tipo", "Efecto", "Coste", "Acciones"]
        break
      case "otros":
        columns = ["Cantidad", "Nombre", "Descripción", "Coste", "Acciones"]
        break
      default:
        columns = ["Cantidad", "Nombre", "Coste", "Acciones"]
    }

    // Crear encabezados de tabla
    columns.forEach((column) => {
      tableHTML += `<th>${column}</th>`
    })

    tableHTML += `</tr></thead><tbody>`

    // Agregar filas según los items
    personaje.inventario[category].forEach((item, index) => {
      tableHTML += `<tr>`

      switch (category) {
        case "armaduras":
          const costeArmadura = item.coste * item.cantidad
          tableHTML += `
            <td class="quantity-cell">${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.resistenciaActual}/${item.resistenciaMax}</td>
            <td>${item.bloqueoFisico}/${item.bloqueoMagico}</td>
            <td class="cost-cell">
              ${item.coste}
              <span class="total-cost">Total: ${costeArmadura}</span>
            </td>
            <td class="actions-cell">
              <i class="fas fa-edit action-icon edit-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
              <i class="fas fa-shield-alt action-icon equip-icon" data-category="${category}" data-index="${index}" title="Equipar"></i>
              <i class="fas fa-coins action-icon sell-icon" data-category="${category}" data-index="${index}" title="Vender"></i>
              <i class="fas fa-trash action-icon delete-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
            </td>
          `
          break
        case "armas":
          // Asegurar que las armas tienen propiedades de resistencia
          if (item.resistenciaMax === undefined) item.resistenciaMax = 10
          if (item.resistenciaActual === undefined) item.resistenciaActual = 10
          const costeArma = item.coste * item.cantidad

          tableHTML += `
            <td class="quantity-cell">${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.manos} mano(s)</td>
            <td>${item.tipo}</td>
            <td>${item.danio}</td>
            <td>${item.resistenciaActual || 10}/${item.resistenciaMax || 10}</td>
            <td class="cost-cell">
              ${item.coste}
              <span class="total-cost">Total: ${costeArma}</span>
            </td>
            <td class="actions-cell">
              <i class="fas fa-edit action-icon edit-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
              <i class="fas fa-hand-rock action-icon equip-icon" data-category="${category}" data-index="${index}" title="Equipar"></i>
              <i class="fas fa-coins action-icon sell-icon" data-category="${category}" data-index="${index}" title="Vender"></i>
              <i class="fas fa-trash action-icon delete-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
            </td>
          `
          break
        case "municion":
          const costeMunicion = item.coste * item.cantidad
          tableHTML += `
            <td class="quantity-cell">${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.mejora || "-"}</td>
            <td class="cost-cell">
              ${item.coste}
              <span class="total-cost">Total: ${costeMunicion}</span>
            </td>
            <td class="actions-cell">
              <i class="fas fa-edit action-icon edit-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
              <i class="fas fa-hand-rock action-icon equip-icon" data-category="${category}" data-index="${index}" title="Equipar"></i>
              <i class="fas fa-coins action-icon sell-icon" data-category="${category}" data-index="${index}" title="Vender"></i>
              <i class="fas fa-trash action-icon delete-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
            </td>
          `
          break
        case "pociones":
          const costePocion = item.coste * item.cantidad
          tableHTML += `
            <td class="quantity-cell">${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.modificador} ${item.efecto}</td>
            <td class="cost-cell">
              ${item.coste}
              <span class="total-cost">Total: ${costePocion}</span>
            </td>
            <td class="actions-cell">
              <i class="fas fa-edit action-icon edit-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
              <i class="fas fa-coins action-icon sell-icon" data-category="${category}" data-index="${index}" title="Vender"></i>
              <i class="fas fa-trash action-icon delete-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
            </td>
          `
          break
        case "pergaminos":
          const costePergamino = item.coste * item.cantidad
          tableHTML += `
            <td class="quantity-cell">${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.tipo}</td>
            <td>${item.modificador} ${item.efecto}</td>
            <td class="cost-cell">
              ${item.coste}
              <span class="total-cost">Total: ${costePergamino}</span>
            </td>
            <td class="actions-cell">
              <i class="fas fa-edit action-icon edit-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
              <i class="fas fa-coins action-icon sell-icon" data-category="${category}" data-index="${index}" title="Vender"></i>
              <i class="fas fa-trash action-icon delete-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
            </td>
          `
          break
        case "otros":
          const costeOtro = item.coste * item.cantidad
          tableHTML += `
            <td class="quantity-cell">${item.cantidad}</td>
            <td>${item.nombre}</td>
            <td>${item.descripcion || "-"}</td>
            <td class="cost-cell">
              ${item.coste}
              <span class="total-cost">Total: ${costeOtro}</span>
            </td>
            <td class="actions-cell">
              <i class="fas fa-edit action-icon edit-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
              <i class="fas fa-coins action-icon sell-icon" data-category="${category}" data-index="${index}" title="Vender"></i>
              <i class="fas fa-trash action-icon delete-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
            </td>
          `
          break
      }

      tableHTML += `</tr>`
    })

    tableHTML += `</tbody></table>`

    accordionList.innerHTML = tableHTML

    // Agregar event listeners a los iconos
    const editIcons = accordionList.querySelectorAll(".edit-icon")
    if (editIcons) {
      editIcons.forEach((icon) => {
        icon.addEventListener("click", function () {
          const category = this.dataset.category
          const index = Number.parseInt(this.dataset.index)
          showEditItemModal(category, index)
        })
      })
    }

    const equipIcons = accordionList.querySelectorAll(".equip-icon")
    if (equipIcons) {
      equipIcons.forEach((icon) => {
        icon.addEventListener("click", function () {
          const category = this.dataset.category
          const index = Number.parseInt(this.dataset.index)
          equipItem(category, index)
        })
      })
    }

    const sellIcons = accordionList.querySelectorAll(".sell-icon")
    if (sellIcons) {
      sellIcons.forEach((icon) => {
        icon.addEventListener("click", function () {
          const category = this.dataset.category
          const index = Number.parseInt(this.dataset.index)
          showSellItemModal(category, index)
        })
      })
    }

    const deleteIcons = accordionList.querySelectorAll(".delete-icon")
    if (deleteIcons) {
      deleteIcons.forEach((icon) => {
        icon.addEventListener("click", function () {
          const category = this.dataset.category
          const index = Number.parseInt(this.dataset.index)
          const itemName = personaje.inventario[category][index].nombre

          showConfirmation(`¿Estás seguro de que deseas eliminar "${itemName}" del inventario?`, () => {
            removeInventoryItem(category, index)
          })
        })
      })
    }
  }

  // Función para equipar un item
  function equipItem(category, index) {
    const item = personaje.inventario[category][index]

    // Solo se pueden equipar armas, armaduras y munición
    if (category !== "armas" && category !== "armaduras" && category !== "municion") {
      alert("Solo se pueden equipar armas, armaduras y munición")
      return
    }

    // Verificar si hay suficientes manos disponibles (solo para armas)
    if (category === "armas" && item.manos > 0) {
      const manosUsadas = personaje.equipados
        .filter((item) => item.categoria === "armas")
        .reduce((total, item) => total + item.manos, 0)

      const manosDisponibles = 2 // Por defecto, un personaje tiene 2 manos

      if (manosUsadas + item.manos > manosDisponibles) {
        alert(`No tienes suficientes manos disponibles. Tienes ${manosDisponibles - manosUsadas} mano(s) libre(s).`)
        return
      }
    }

    // Si es un item con cantidad, reducir la cantidad
    if (item.cantidad > 1) {
      item.cantidad--

      // Crear una copia del item para equipar
      const itemToEquip = { ...item, cantidad: 1 }

      personaje.equipados.push(itemToEquip)
    } else {
      // Si solo hay uno, moverlo a equipados
      personaje.equipados.push({ ...item })
      personaje.inventario[category].splice(index, 1)
    }

    saveCharacter()
    loadInventoryAccordion(category)
    loadEquipment()
  }

  // Función para eliminar un item del inventario
  function removeInventoryItem(category, index) {
    personaje.inventario[category].splice(index, 1)
    saveCharacter()
    loadInventoryAccordion(category)
  }

  // Función para mostrar el modal de venta de un item
  function showSellItemModal(category, index) {
    const item = personaje.inventario[category][index]
    const sellItemModal = document.getElementById("sellItemModal")
    const sellItemModalContent = document.getElementById("sellItemModalContent")

    // Preparar contenido del modal
    sellItemModalContent.innerHTML = `
      <p>Estás vendiendo: <strong>${item.nombre}</strong></p>
      <p>Cantidad disponible: ${item.cantidad}</p>
      <p>Precio por unidad: ${item.coste}</p>
      
      <div class="form-group">
        <label for="sellQuantity">Cantidad a vender:</label>
        <input type="number" id="sellQuantity" min="1" max="${item.cantidad}" value="${item.cantidad}">
      </div>
      
      <div class="form-group">
        <label for="sellPrice">Precio de venta por unidad:</label>
        <input type="number" id="sellPrice" min="0" value="${item.coste}">
      </div>
      
      <div class="form-group">
        <p>Total a recibir: <span id="sellTotal">${item.coste * item.cantidad}</span> monedas</p>
      </div>
      
      <div class="form-actions">
        <button id="confirmSellBtn" class="btn btn-primary" data-category="${category}" data-index="${index}">Vender</button>
        <button id="cancelSellBtn" class="btn">Cancelar</button>
      </div>
    `

    // Mostrar modal
    sellItemModal.classList.add("show-modal")

    // Actualizar total al cambiar cantidad o precio
    const sellQuantityInput = document.getElementById("sellQuantity")
    const sellPriceInput = document.getElementById("sellPrice")
    const sellTotalSpan = document.getElementById("sellTotal")

    function updateTotal() {
      const quantity = Number.parseInt(sellQuantityInput.value) || 0
      const price = Number.parseInt(sellPriceInput.value) || 0
      sellTotalSpan.textContent = quantity * price
    }

    sellQuantityInput.addEventListener("input", updateTotal)
    sellPriceInput.addEventListener("input", updateTotal)

    // Configurar botones
    const confirmSellBtn = document.getElementById("confirmSellBtn")
    const cancelSellBtn = document.getElementById("cancelSellBtn")

    confirmSellBtn.addEventListener("click", function () {
      const category = this.dataset.category
      const index = Number.parseInt(this.dataset.index)
      const quantity = Number.parseInt(sellQuantityInput.value) || 0
      const price = Number.parseInt(sellPriceInput.value) || 0

      if (quantity <= 0 || quantity > item.cantidad) {
        alert("Cantidad inválida")
        return
      }

      // Vender el item
      sellItem(category, index, quantity, price)
      sellItemModal.classList.remove("show-modal")
    })

    cancelSellBtn.addEventListener("click", () => {
      sellItemModal.classList.remove("show-modal")
    })
  }

  // Función para vender un item
  function sellItem(category, index, quantity, price) {
    const item = personaje.inventario[category][index]
    const totalPrice = quantity * price

    // Agregar monedas al personaje
    personaje.inventario.monedas += totalPrice

    // Reducir la cantidad del item o eliminarlo
    if (quantity < item.cantidad) {
      item.cantidad -= quantity
    } else {
      personaje.inventario[category].splice(index, 1)
    }

    saveCharacter()
    loadInventoryAccordion(category)
    loadSimpleResources()
  }

  // Función para mostrar el modal de editar item
  function showEditItemModal(category, index) {
    const item = personaje.inventario[category][index]
    const itemModal = document.getElementById("itemModal")
    const itemModalContent = document.getElementById("itemModalContent")

    let formHTML = ""
    let title = ""

    switch (category) {
      case "armaduras":
        title = "Editar Armadura"
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaMax">Resistencia Máxima:</label>
              <input type="number" id="editItemResistenciaMax" min="0" value="${item.resistenciaMax}">
            </div>
            <div class="form-group">
              <label for="editItemBloqueoFisico">Bloqueo Físico:</label>
              <input type="number" id="editItemBloqueoFisico" min="0" value="${item.bloqueoFisico}">
            </div>
            <div class="form-group">
              <label for="editItemBloqueoMagico">Bloqueo Mágico:</label>
              <input type="number" id="editItemBloqueoMagico" min="0" value="${item.bloqueoMagico}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaActual">Resistencia Actual:</label>
              <input type="number" id="editItemResistenciaActual" min="0" max="${item.resistenciaMax}" value="${item.resistenciaActual}">
            </div>
          </div>
        `
        break
      case "armas":
        // Asegurar que las armas tienen propiedades de resistencia
        if (item.resistenciaMax === undefined) item.resistenciaMax = 10
        if (item.resistenciaActual === undefined) item.resistenciaActual = 10

        title = "Editar Arma"
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemManos">Manos necesarias:</label>
              <select id="editItemManos">
                <option value="0" ${item.manos == 0 ? "selected" : ""}>No requiere manos</option>
                <option value="1" ${item.manos == 1 ? "selected" : ""}>1 mano</option>
                <option value="2" ${item.manos == 2 ? "selected" : ""}>2 manos</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editItemTipo">Tipo de arma:</label>
              <select id="editItemTipo">
                <option value="Cuerpo a cuerpo" ${item.tipo === "Cuerpo a cuerpo" ? "selected" : ""}>Cuerpo a cuerpo</option>
                <option value="A distancia" ${item.tipo === "A distancia" ? "selected" : ""}>Cuerpo a cuerpo</option>
                <option value="Mágica" ${item.tipo === "Mágica" ? "selected" : ""}>Mágica</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editItemDanio">Daño (ej: 2d4+1):</label>
              <input type="text" id="editItemDanio" placeholder="1d6" value="${item.danio}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaMax">Resistencia Máxima:</label>
              <input type="number" id="editItemResistenciaMax" min="0" value="${item.resistenciaMax || 10}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaActual">Resistencia Actual:</label>
              <input type="number" id="editItemResistenciaActual" min="0" max="${item.resistenciaMax || 10}" value="${item.resistenciaActual || 10}">
            </div>
            <div class="form-group">
              <label for="editItemEstadisticas">Estadísticas modificadas:</label>
              <input type="text" id="editItemEstadisticas" placeholder="+1 daño, -1 defensa" value="${item.estadisticas || ""}">
            </div>
          </div>
        `
        break
      case "municion":
        title = "Editar Munición"
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemMejora">Mejora:</label>
              <input type="text" id="editItemMejora" placeholder="daño +1" value="${item.mejora || ""}">
            </div>
          </div>
        `
        break
      case "pociones":
        title = "Editar Poción"
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemModificador">Modificador:</label>
              <input type="text" id="editItemModificador" placeholder="salud" value="${item.modificador || ""}">
            </div>
            <div class="form-group">
              <label for="editItemEfecto">Efecto:</label>
              <input type="text" id="editItemEfecto" placeholder="+1" value="${item.efecto || ""}">
            </div>
          </div>
        `
        break
      case "pergaminos":
        title = "Editar Pergamino"
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemTipo">Tipo:</label>
              <select id="editItemTipo">
                <option value="Ofensivo" ${item.tipo === "Ofensivo" ? "selected" : ""}>Ofensivo</option>
                <option value="Efecto de estado" ${item.tipo === "Efecto de estado" ? "selected" : ""}>Efecto de estado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editItemModificador">Modificador:</label>
              <input type="text" id="editItemModificador" placeholder="daño" value="${item.modificador || ""}">
            </div>
            <div class="form-group">
              <label for="editItemEfecto">Efecto:</label>
              <input type="text" id="editItemEfecto" placeholder="+2" value="${item.efecto || ""}">
            </div>
            <div class="form-group full-width">
              <label for="editItemDescripcion">Descripción:</label>
              <textarea id="editItemDescripcion" rows="2">${item.descripcion || ""}</textarea>
            </div>
          </div>
        `
        break
      case "otros":
        title = "Editar Otro Objeto"
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group full-width">
              <label for="editItemDescripcion">Descripción:</label>
              <textarea id="editItemDescripcion" rows="2">${item.descripcion || ""}</textarea>
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
        <button id="saveEditItemBtn" class="btn" data-category="${category}" data-index="${index}">Guardar Cambios</button>
      </div>
    `

    // Mostrar modal
    itemModal.classList.add("show-modal")

    // Configurar botón de guardar
    const saveEditItemBtn = document.getElementById("saveEditItemBtn")
    if (saveEditItemBtn) {
      saveEditItemBtn.addEventListener("click", function () {
        const category = this.dataset.category
        const index = Number.parseInt(this.dataset.index)
        saveEditedItem(category, index)
        itemModal.classList.remove("show-modal")
      })
    }
  }

  // Función para guardar un item editado
  function saveEditedItem(category, index) {
    // Obtener los valores del formulario
    const name = document.getElementById("editItemName").value.trim()
    const quantity = Number.parseInt(document.getElementById("editItemQuantity").value) || 1
    const coste = Number.parseInt(document.getElementById("editItemCoste").value) || 0

    if (!name) {
      alert("El nombre del objeto es obligatorio")
      return
    }

    // Actualizar el item según la categoría
    switch (category) {
      case "armaduras":
        const resistenciaMax = Number.parseInt(document.getElementById("editItemResistenciaMax").value) || 10
        let resistenciaActual = Number.parseInt(document.getElementById("editItemResistenciaActual").value) || 10

        // Asegurar que la resistencia actual no sea mayor que la máxima
        if (resistenciaActual > resistenciaMax) {
          resistenciaActual = resistenciaMax
        }

        personaje.inventario[category][index] = {
          nombre: name,
          cantidad: quantity,
          coste: coste,
          categoria: category,
          resistenciaMax: resistenciaMax,
          bloqueoFisico: Number.parseInt(document.getElementById("editItemBloqueoFisico").value) || 0,
          bloqueoMagico: Number.parseInt(document.getElementById("editItemBloqueoMagico").value) || 0,
          resistenciaActual: resistenciaActual,
        }
        break
      case "armas":
        const armaResistenciaMax = Number.parseInt(document.getElementById("editItemResistenciaMax").value) || 10
        let armaResistenciaActual = Number.parseInt(document.getElementById("editItemResistenciaActual").value) || 10

        // Asegurar que la resistencia actual no sea mayor que la máxima
        if (armaResistenciaActual > armaResistenciaMax) {
          armaResistenciaActual = armaResistenciaMax
        }

        personaje.inventario[category][index] = {
          nombre: name,
          cantidad: quantity,
          coste: coste,
          categoria: category,
          manos: Number.parseInt(document.getElementById("editItemManos").value) || 1,
          tipo: document.getElementById("editItemTipo").value,
          danio: document.getElementById("editItemDanio").value || "1d6",
          resistenciaMax: armaResistenciaMax,
          resistenciaActual: armaResistenciaActual,
          estadisticas: document.getElementById("editItemEstadisticas").value || "",
        }
        break
      case "municion":
        personaje.inventario[category][index] = {
          nombre: name,
          cantidad: quantity,
          coste: coste,
          categoria: category,
          mejora: document.getElementById("editItemMejora").value || "",
        }
        break
      case "pociones":
        personaje.inventario[category][index] = {
          nombre: name,
          cantidad: quantity,
          coste: coste,
          categoria: category,
          modificador: document.getElementById("editItemModificador").value || "",
          efecto: document.getElementById("editItemEfecto").value || "",
        }
        break
      case "pergaminos":
        personaje.inventario[category][index] = {
          nombre: name,
          cantidad: quantity,
          coste: coste,
          categoria: category,
          tipo: document.getElementById("editItemTipo").value,
          modificador: document.getElementById("editItemModificador").value || "",
          efecto: document.getElementById("editItemEfecto").value || "",
          descripcion: document.getElementById("editItemDescripcion").value || "",
        }
        break
      case "otros":
        personaje.inventario[category][index] = {
          nombre: name,
          cantidad: quantity,
          coste: coste,
          categoria: category,
          descripcion: document.getElementById("editItemDescripcion").value || "",
        }
        break
    }

    saveCharacter()
    loadInventoryAccordion(category)
  }

  // Función para mostrar el modal de añadir item
  function showAddItemModal(category) {
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
                <option value="1">1 mano</option>
                <option value="2">2 manos</option>
              </select>
            </div>
            <div class="form-group">
              <label for="itemTipo">Tipo de arma:</label>
              <select id="itemTipo">
                <option value="Cuerpo a cuerpo">Cuerpo a cuerpo</option>
                <option value="A distancia">A distancia</option>
                <option value="Mágica">Mágica</option>
              </select>
            </div>
            <div class="form-group">
              <label for="itemDanio">Daño (ej: 2d4+1):</label>
              <input type="text" id="itemDanio" placeholder="1d6">
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
                <option value="Ofensivo">Ofensivo</option>
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
        addInventoryItem(category)
        itemModal.classList.remove("show-modal")
      })
    }
  }

  // Función para añadir item al inventario
  function addInventoryItem(category) {
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
    saveCharacter()
    loadInventoryAccordion(category)
  }

  // Función para actualizar el personaje en la lista de personajes
  function updateCharacterInList() {
    // Obtener la lista de personajes
    const personajesData = JSON.parse(localStorage.getItem("personajes")) || { personajes: [] }

    // Buscar el personaje en la lista
    const index = personajesData.personajes.findIndex((p) => p.nombre === personaje.nombre)

    if (index !== -1) {
      // Actualizar los datos del personaje en la lista
      personajesData.personajes[index] = {
        nombre: personaje.nombre,
        raza: personaje.raza,
        nivel: personaje.nivel,
      }

      // Guardar la lista actualizada
      localStorage.setItem("personajes", JSON.stringify(personajesData))
    }
  }

  // Configurar modal para items
  function setupItemModal() {
    const itemModal = document.getElementById("itemModal")
    const closeItemModal = document.getElementById("closeItemModal")

    // Cerrar modal al hacer clic en X
    if (closeItemModal) {
      closeItemModal.addEventListener("click", () => {
        itemModal.classList.remove("show-modal")
      })
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === itemModal) {
        itemModal.classList.remove("show-modal")
      }
    })
  }

  // Configurar modal para vender items
  function setupSellItemModal() {
    const sellItemModal = document.getElementById("sellItemModal")
    const closeSellItemModal = document.getElementById("closeSellItemModal")

    // Cerrar modal al hacer clic en X
    if (closeSellItemModal) {
      closeSellItemModal.addEventListener("click", () => {
        sellItemModal.classList.remove("show-modal")
      })
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === sellItemModal) {
        sellItemModal.classList.remove("show-modal")
      }
    })
  }

  // Configurar modal para mover items a bolsas
  function setupMoveToBagModal() {
    const moveToBagModal = document.getElementById("moveToBagModal")
    const closeMoveToBagModal = document.getElementById("closeMoveToBagModal")

    // Cerrar modal al hacer clic en X
    if (closeMoveToBagModal) {
      closeMoveToBagModal.addEventListener("click", () => {
        moveToBagModal.classList.remove("show-modal")
      })
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === moveToBagModal) {
        moveToBagModal.classList.remove("show-modal")
      }
    })
  }

  // Función para configurar el botón de crear bolsas especiales
  function setupCreateBagButton() {
    const createBagBtn = document.getElementById("createBagBtn")
    const createBagModal = document.getElementById("createBagModal")
    const closeCreateBagModal = document.getElementById("closeCreateBagModal")
    const bagNameInput = document.getElementById("bagName")
    const createBagModalBtn = document.getElementById("createBagBtn")

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
          saveCharacter()
          loadSpecialBags()

          // Cerrar modal
          createBagModal.classList.remove("show-modal")
        } else {
          alert("El nombre de la bolsa es obligatorio")
        }
      })
    }
  }

  // Función para cargar las bolsas especiales
  loadSpecialBags = () => {
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
            <i class="fas fa-edit action-icon edit-bag-icon" data-bag-index="${index}" title="Editar nombre"></i>
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
      if (bolsa.contenido.length > 0) {
        loadBagContent(index)
      }
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

    // Agregar event listeners a los iconos de editar bolsa
    const editBagIcons = document.querySelectorAll(".edit-bag-icon")
    editBagIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        editBagName(bagIndex)
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
            deleteBag(bagIndex)
          },
        )
      })
    })
  }

  // Función para editar el nombre de una bolsa
  function editBagName(bagIndex) {
    const bolsa = personaje.bolsasEspeciales[bagIndex]
    const newName = prompt("Introduce el nuevo nombre para la bolsa:", bolsa.nombre)

    if (newName && newName.trim() !== "") {
      bolsa.nombre = newName.trim()
      saveCharacter()
      loadSpecialBags()
    }
  }

  // Función para eliminar una bolsa
  function deleteBag(bagIndex) {
    const bolsa = personaje.bolsasEspeciales[bagIndex]

    // Devolver todos los objetos al inventario
    bolsa.contenido.forEach((item) => {
      // Verificar si ya existe un item similar en el inventario
      const existingItemIndex = personaje.inventario[item.categoria].findIndex(
        (i) =>
          i.nombre === item.nombre &&
          (item.categoria !== "armas" || i.manos === item.manos) &&
          (item.categoria !== "armaduras" ||
            (i.resistenciaMax === item.resistenciaMax &&
              i.bloqueoFisico === item.bloqueoFisico &&
              i.bloqueoMagico === i.bloqueoMagico)),
      )

      if (existingItemIndex !== -1) {
        // Si existe, incrementar la cantidad
        personaje.inventario[item.categoria][existingItemIndex].cantidad += item.cantidad
      } else {
        // Si no existe, agregar como nuevo item
        const { bolsaId, ...itemForInventory } = item
        personaje.inventario[item.categoria].push(itemForInventory)
      }
    })

    // Eliminar la bolsa
    personaje.bolsasEspeciales.splice(bagIndex, 1)
    saveCharacter()
    loadSpecialBags()

    // Recargar la categoría actual del inventario si está abierta
    const activeHeader = document.querySelector(".accordion-header.active")
    if (activeHeader) {
      const category = activeHeader.dataset.category
      loadInventoryAccordion(category)
    }
  }

  // Función para cargar el contenido de una bolsa
  function loadBagContent(bagIndex) {
    const bolsa = personaje.bolsasEspeciales[bagIndex]
    const bagItemsList = document.querySelector(`#bag-content-${bagIndex} .bag-items-list`)

    if (!bagItemsList) {
      console.error(`No se encontró la lista de items para la bolsa ${bagIndex}`)
      return
    }

    bagItemsList.innerHTML = ""

    if (bolsa.contenido.length === 0) {
      document.querySelector(`#bag-content-${bagIndex} .empty-bag-message`).classList.remove("hidden")
      return
    }

    document.querySelector(`#bag-content-${bagIndex} .empty-bag-message`).classList.add("hidden")

    // Crear tabla para mostrar los items
    let tableHTML = `<table class="inventory-table"><thead><tr>
      <th>Categoría</th>
      <th>Cantidad</th>
      <th>Nombre</th>
      <th>Detalles</th>
      <th>Coste</th>
      <th>Acciones</th>
    </tr></thead><tbody>`

    bolsa.contenido.forEach((item, itemIndex) => {
      let detalles = ""
      const costeTotal = item.coste * item.cantidad

      switch (item.categoria) {
        case "armaduras":
          detalles = `BF: ${item.bloqueoFisico}, BM: ${item.bloqueoMagico}, Res: ${item.resistenciaActual}/${item.resistenciaMax}`
          break
        case "armas":
          detalles = `${item.manos} mano(s), ${item.tipo}, Daño: ${item.danio}, Res: ${item.resistenciaActual || 10}/${item.resistenciaMax || 10}`
          break
        case "municion":
          detalles = item.mejora || "-"
          break
        case "pociones":
          detalles = `${item.modificador} ${item.efecto}`
          break
        case "pergaminos":
          detalles = `${item.tipo}, ${item.modificador} ${item.efecto}`
          break
        case "otros":
          detalles = item.descripcion || "-"
          break
      }

      tableHTML += `
        <tr>
          <td>${getCategoryName(item.categoria)}</td>
          <td class="quantity-cell">${item.cantidad}</td>
          <td>${item.nombre}</td>
          <td>${detalles}</td>
          <td class="cost-cell">
            ${item.coste}
            <span class="total-cost">Total: ${costeTotal}</span>
          </td>
          <td class="actions-cell">
            <i class="fas fa-edit action-icon edit-icon" data-bag-index="${bagIndex}" data-item-index="${itemIndex}" title="Editar"></i>
            ${
              item.categoria === "armas" || item.categoria === "armaduras" || item.categoria === "municion"
                ? `<i class="fas fa-hand-rock action-icon equip-icon" data-bag-index="${bagIndex}" data-item-index="${itemIndex}" title="Equipar"></i>`
                : ""
            }
            <i class="fas fa-exchange-alt action-icon move-icon" data-bag-index="${bagIndex}" data-item-index="${itemIndex}" title="Mover"></i>
            <i class="fas fa-coins action-icon sell-icon" data-bag-index="${bagIndex}" data-item-index="${itemIndex}" title="Vender"></i>
            <i class="fas fa-trash action-icon delete-icon" data-bag-index="${bagIndex}" data-item-index="${itemIndex}" title="Eliminar"></i>
          </td>
        </tr>
      `
    })

    tableHTML += `</tbody></table>`

    bagItemsList.innerHTML = tableHTML

    // Agregar event listeners a los iconos
    const editIcons = bagItemsList.querySelectorAll(".edit-icon")
    editIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        editBagItem(bagIndex, itemIndex)
      })
    })

    const equipIcons = bagItemsList.querySelectorAll(".equip-icon")
    equipIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        equipFromBag(bagIndex, itemIndex)
      })
    })

    const moveIcons = bagItemsList.querySelectorAll(".move-icon")
    moveIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        showMoveBagItemModal(bagIndex, itemIndex)
      })
    })

    const sellIcons = bagItemsList.querySelectorAll(".sell-icon")
    sellIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        showSellBagItemModal(bagIndex, itemIndex)
      })
    })

    const deleteIcons = bagItemsList.querySelectorAll(".delete-icon")
    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        const itemName = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex].nombre

        showConfirmation(`¿Estás seguro de que deseas eliminar "${itemName}" de la bolsa?`, () => {
          removeBagItem(bagIndex, itemIndex)
        })
      })
    })
  }

  // Función para editar un item de una bolsa
  function editBagItem(bagIndex, itemIndex) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]
    const itemModal = document.getElementById("itemModal")
    const itemModalContent = document.getElementById("itemModalContent")

    let formHTML = ""
    const title = `Editar ${getCategoryName(item.categoria)}`

    switch (item.categoria) {
      case "armaduras":
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaMax">Resistencia Máxima:</label>
              <input type="number" id="editItemResistenciaMax" min="0" value="${item.resistenciaMax}">
            </div>
            <div class="form-group">
              <label for="editItemBloqueoFisico">Bloqueo Físico:</label>
              <input type="number" id="editItemBloqueoFisico" min="0" value="${item.bloqueoFisico}">
            </div>
            <div class="form-group">
              <label for="editItemBloqueoMagico">Bloqueo Mágico:</label>
              <input type="number" id="editItemBloqueoMagico" min="0" value="${item.bloqueoMagico}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaActual">Resistencia Actual:</label>
              <input type="number" id="editItemResistenciaActual" min="0" max="${item.resistenciaMax}" value="${item.resistenciaActual}">
            </div>
          </div>
        `
        break
      case "armas":
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemManos">Manos necesarias:</label>
              <select id="editItemManos">
                <option value="0" ${item.manos == 0 ? "selected" : ""}>No requiere manos</option>
                <option value="1" ${item.manos == 1 ? "selected" : ""}>1 mano</option>
                <option value="2" ${item.manos == 2 ? "selected" : ""}>2 manos</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editItemTipo">Tipo de arma:</label>
              <select id="editItemTipo">
                <option value="Cuerpo a cuerpo" ${item.tipo === "Cuerpo a cuerpo" ? "selected" : ""}>Cuerpo a cuerpo</option>
                <option value="A distancia" ${item.tipo === "A distancia" ? "selected" : ""}>Cuerpo a cuerpo</option>
                <option value="Mágica" ${item.tipo === "Mágica" ? "selected" : ""}>Mágica</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editItemDanio">Daño (ej: 2d4+1):</label>
              <input type="text" id="editItemDanio" placeholder="1d6" value="${item.danio}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaMax">Resistencia Máxima:</label>
              <input type="number" id="editItemResistenciaMax" min="0" value="${item.resistenciaMax || 10}">
            </div>
            <div class="form-group">
              <label for="editItemResistenciaActual">Resistencia Actual:</label>
              <input type="number" id="editItemResistenciaActual" min="0" max="${item.resistenciaMax || 10}" value="${item.resistenciaActual || 10}">
            </div>
            <div class="form-group">
              <label for="editItemEstadisticas">Estadísticas modificadas:</label>
              <input type="text" id="editItemEstadisticas" placeholder="+1 daño, -1 defensa" value="${item.estadisticas || ""}">
            </div>
          </div>
        `
        break
      case "municion":
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemMejora">Mejora:</label>
              <input type="text" id="editItemMejora" placeholder="daño +1" value="${item.mejora || ""}">
            </div>
          </div>
        `
        break
      case "pociones":
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemModificador">Modificador:</label>
              <input type="text" id="editItemModificador" placeholder="salud" value="${item.modificador || ""}">
            </div>
            <div class="form-group">
              <label for="editItemEfecto">Efecto:</label>
              <input type="text" id="editItemEfecto" placeholder="+1" value="${item.efecto || ""}">
            </div>
          </div>
        `
        break
      case "pergaminos":
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group">
              <label for="editItemTipo">Tipo:</label>
              <select id="editItemTipo">
                <option value="Ofensivo" ${item.tipo === "Ofensivo" ? "selected" : ""}>Ofensivo</option>
                <option value="Efecto de estado" ${item.tipo === "Efecto de estado" ? "selected" : ""}>Efecto de estado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editItemModificador">Modificador:</label>
              <input type="text" id="editItemModificador" placeholder="daño" value="${item.modificador || ""}">
            </div>
            <div class="form-group">
              <label for="editItemEfecto">Efecto:</label>
              <input type="text" id="editItemEfecto" placeholder="+2" value="${item.efecto || ""}">
            </div>
            <div class="form-group full-width">
              <label for="editItemDescripcion">Descripción:</label>
              <textarea id="editItemDescripcion" rows="2">${item.descripcion || ""}</textarea>
            </div>
          </div>
        `
        break
      case "otros":
        formHTML = `
          <div class="form-grid">
            <div class="form-group">
              <label for="editItemName">Nombre:</label>
              <input type="text" id="editItemName" value="${item.nombre}" required>
            </div>
            <div class="form-group">
              <label for="editItemQuantity">Cantidad:</label>
              <input type="number" id="editItemQuantity" min="1" value="${item.cantidad}">
            </div>
            <div class="form-group">
              <label for="editItemCoste">Coste por unidad:</label>
              <input type="number" id="editItemCoste" min="0" value="${item.coste}">
            </div>
            <div class="form-group full-width">
              <label for="editItemDescripcion">Descripción:</label>
              <textarea id="editItemDescripcion" rows="2">${item.descripcion || ""}</textarea>
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
        <button id="saveBagItemBtn" class="btn" data-bag-index="${bagIndex}" data-item-index="${itemIndex}">Guardar Cambios</button>
      </div>
    `

    // Mostrar modal
    itemModal.classList.add("show-modal")

    // Configurar botón de guardar
    const saveBagItemBtn = document.getElementById("saveBagItemBtn")
    if (saveBagItemBtn) {
      saveBagItemBtn.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        saveBagItemChanges(bagIndex, itemIndex)
        itemModal.classList.remove("show-modal")
      })
    }
  }

  // Función para guardar cambios en un item de una bolsa
  function saveBagItemChanges(bagIndex, itemIndex) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]

    // Obtener los valores del formulario
    const name = document.getElementById("editItemName").value.trim()
    const quantity = Number.parseInt(document.getElementById("editItemQuantity").value) || 1
    const coste = Number.parseInt(document.getElementById("editItemCoste").value) || 0

    if (!name) {
      alert("El nombre del objeto es obligatorio")
      return
    }

    // Actualizar propiedades comunes
    item.nombre = name
    item.cantidad = quantity
    item.coste = coste

    // Actualizar propiedades específicas según la categoría
    switch (item.categoria) {
      case "armaduras":
        const resistenciaMax = Number.parseInt(document.getElementById("editItemResistenciaMax").value) || 10
        let resistenciaActual = Number.parseInt(document.getElementById("editItemResistenciaActual").value) || 10

        // Asegurar que la resistencia actual no sea mayor que la máxima
        if (resistenciaActual > resistenciaMax) {
          resistenciaActual = resistenciaMax
        }

        item.resistenciaMax = resistenciaMax
        item.bloqueoFisico = Number.parseInt(document.getElementById("editItemBloqueoFisico").value) || 0
        item.bloqueoMagico = Number.parseInt(document.getElementById("editItemBloqueoMagico").value) || 0
        item.resistenciaActual = resistenciaActual
        break
      case "armas":
        const armaResistenciaMax = Number.parseInt(document.getElementById("editItemResistenciaMax").value) || 10
        let armaResistenciaActual = Number.parseInt(document.getElementById("editItemResistenciaActual").value) || 10

        // Asegurar que la resistencia actual no sea mayor que la máxima
        if (armaResistenciaActual > armaResistenciaMax) {
          armaResistenciaActual = armaResistenciaMax
        }

        item.manos = Number.parseInt(document.getElementById("editItemManos").value) || 1
        item.tipo = document.getElementById("editItemTipo").value
        item.danio = document.getElementById("editItemDanio").value || "1d6"
        item.resistenciaMax = armaResistenciaMax
        item.resistenciaActual = armaResistenciaActual
        item.estadisticas = document.getElementById("editItemEstadisticas").value || ""
        break
      case "municion":
        item.mejora = document.getElementById("editItemMejora").value || ""
        break
      case "pociones":
        item.modificador = document.getElementById("editItemModificador").value || ""
        item.efecto = document.getElementById("editItemEfecto").value || ""
        break
      case "pergaminos":
        item.tipo = document.getElementById("editItemTipo").value
        item.modificador = document.getElementById("editItemModificador").value || ""
        item.efecto = document.getElementById("editItemEfecto").value || ""
        item.descripcion = document.getElementById("editItemDescripcion").value || ""
        break
      case "otros":
        item.descripcion = document.getElementById("editItemDescripcion").value || ""
        break
    }

    saveCharacter()
    loadBagContent(bagIndex)
  }

  // Función para equipar un item desde una bolsa
  function equipFromBag(bagIndex, itemIndex) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]

    // Solo se pueden equipar armas, armaduras y munición
    if (item.categoria !== "armas" && item.categoria !== "armaduras" && item.categoria !== "municion") {
      alert("Solo se pueden equipar armas, armaduras y munición")
      return
    }

    // Verificar si hay suficientes manos disponibles (solo para armas)
    if (item.categoria === "armas" && item.manos > 0) {
      const manosUsadas = personaje.equipados
        .filter((item) => item.categoria === "armas")
        .reduce((total, item) => total + item.manos, 0)

      const manosDisponibles = 2 // Por defecto, un personaje tiene 2 manos

      if (manosUsadas + item.manos > manosDisponibles) {
        alert(`No tienes suficientes manos disponibles. Tienes ${manosDisponibles - manosUsadas} mano(s) libre(s).`)
        return
      }
    }

    // Si es un item con cantidad, reducir la cantidad
    if (item.cantidad > 1) {
      item.cantidad--

      // Crear una copia del item para equipar
      const itemToEquip = { ...item, cantidad: 1 }
      delete itemToEquip.bolsaId // Eliminar referencia a la bolsa

      personaje.equipados.push(itemToEquip)
    } else {
      // Si solo hay uno, moverlo a equipados
      const itemToEquip = { ...item }
      delete itemToEquip.bolsaId // Eliminar referencia a la bolsa

      personaje.equipados.push(itemToEquip)
      personaje.bolsasEspeciales[bagIndex].contenido.splice(itemIndex, 1)
    }

    saveCharacter()
    loadBagContent(bagIndex)
    loadEquipment()
  }

  // Función para eliminar un item de una bolsa
  function removeBagItem(bagIndex, itemIndex) {
    personaje.bolsasEspeciales[bagIndex].contenido.splice(itemIndex, 1)
    saveCharacter()
    loadBagContent(bagIndex)
  }

  // Función para mostrar el modal de venta de un item de una bolsa
  function showSellBagItemModal(bagIndex, itemIndex) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]
    const sellItemModal = document.getElementById("sellItemModal")
    const sellItemModalContent = document.getElementById("sellItemModalContent")

    // Preparar contenido del modal
    sellItemModalContent.innerHTML = `
      <p>Estás vendiendo: <strong>${item.nombre}</strong></p>
      <p>Cantidad disponible: ${item.cantidad}</p>
      <p>Precio por unidad: ${item.coste}</p>
      
      <div class="form-group">
        <label for="sellQuantity">Cantidad a vender:</label>
        <input type="number" id="sellQuantity" min="1" max="${item.cantidad}" value="${item.cantidad}">
      </div>
      
      <div class="form-group">
        <label for="sellPrice">Precio de venta por unidad:</label>
        <input type="number" id="sellPrice" min="0" value="${item.coste}">
      </div>
      
      <div class="form-group">
        <p>Total a recibir: <span id="sellTotal">${item.coste * item.cantidad}</span> monedas</p>
      </div>
      
      <div class="form-actions">
        <button id="confirmSellBtn" class="btn btn-primary" data-bag-index="${bagIndex}" data-item-index="${itemIndex}">Vender</button>
        <button id="cancelSellBtn" class="btn">Cancelar</button>
      </div>
    `

    // Mostrar modal
    sellItemModal.classList.add("show-modal")

    // Actualizar total al cambiar cantidad o precio
    const sellQuantityInput = document.getElementById("sellQuantity")
    const sellPriceInput = document.getElementById("sellPrice")
    const sellTotalSpan = document.getElementById("sellTotal")

    function updateTotal() {
      const quantity = Number.parseInt(sellQuantityInput.value) || 0
      const price = Number.parseInt(sellPriceInput.value) || 0
      sellTotalSpan.textContent = quantity * price
    }

    sellQuantityInput.addEventListener("input", updateTotal)
    sellPriceInput.addEventListener("input", updateTotal)

    // Configurar botones
    const confirmSellBtn = document.getElementById("confirmSellBtn")
    const cancelSellBtn = document.getElementById("cancelSellBtn")

    confirmSellBtn.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const itemIndex = this.dataset.itemIndex
      const quantity = Number.parseInt(sellQuantityInput.value) || 0
      const price = Number.parseInt(sellPriceInput.value) || 0

      if (quantity <= 0 || quantity > item.cantidad) {
        alert("Cantidad inválida")
        return
      }

      // Vender el item
      sellBagItem(bagIndex, itemIndex, quantity, price)
      sellItemModal.classList.remove("show-modal")
    })

    cancelSellBtn.addEventListener("click", () => {
      sellItemModal.classList.remove("show-modal")
    })
  }

  // Función para vender un item de una bolsa
  function sellBagItem(bagIndex, itemIndex, quantity, price) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]
    const totalPrice = quantity * price

    // Agregar monedas al personaje
    personaje.inventario.monedas += totalPrice

    // Reducir la cantidad del item o eliminarlo
    if (quantity < item.cantidad) {
      item.cantidad -= quantity
    } else {
      personaje.bolsasEspeciales[bagIndex].contenido.splice(itemIndex, 1)
    }

    saveCharacter()
    loadBagContent(bagIndex)
    loadSimpleResources()
  }

  // Función para mostrar el modal de mover un item de una bolsa
  function showMoveBagItemModal(bagIndex, itemIndex) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]
    const moveToBagModal = document.getElementById("moveToBagModal")
    const moveToBagModalContent = document.getElementById("moveToBagModalContent")

    // Preparar lista de bolsas disponibles
    let bagOptions = `
      <div class="form-group">
        <label for="moveQuantity">Cantidad a mover:</label>
        <input type="number" id="moveQuantity" min="1" max="${item.cantidad}" value="${item.cantidad}">
      </div>
      
      <div class="form-group">
        <label>Destino:</label>
        <div class="move-options">
          <div class="move-option">
            <input type="radio" id="moveToInventory" name="moveDestination" value="inventory" checked>
            <label for="moveToInventory">Inventario principal</label>
          </div>
    `

    // Agregar otras bolsas como opciones
    personaje.bolsasEspeciales.forEach((bolsa, idx) => {
      if (idx !== Number(bagIndex)) {
        bagOptions += `
          <div class="move-option">
            <input type="radio" id="moveToBag${idx}" name="moveDestination" value="bag-${idx}">
            <label for="moveToBag${idx}">${bolsa.nombre}</label>
          </div>
        `
      }
    })

    // Opción para crear nueva bolsa
    bagOptions += `
      <div class="move-option">
        <input type="radio" id="moveToNewBag" name="moveDestination" value="new-bag">
        <label for="moveToNewBag">Nueva bolsa</label>
      </div>
    `

    bagOptions += `</div></div>`

    // Campo para nombre de nueva bolsa (inicialmente oculto)
    bagOptions += `
      <div class="form-group hidden" id="newBagNameGroup">
        <label for="newBagName">Nombre de la nueva bolsa:</label>
        <input type="text" id="newBagName" value="Bolsa ${personaje.bolsasEspeciales.length + 1}">
      </div>
    `

    // Preparar contenido del modal
    moveToBagModalContent.innerHTML = `
      <p>Estás moviendo: <strong>${item.nombre}</strong></p>
      ${bagOptions}
      <div class="form-actions">
        <button id="confirmMoveBtn" class="btn btn-primary" data-bag-index="${bagIndex}" data-item-index="${itemIndex}">Mover</button>
        <button id="cancelMoveBtn" class="btn">Cancelar</button>
      </div>
    `

    // Mostrar modal
    moveToBagModal.classList.add("show-modal")

    // Mostrar/ocultar campo de nueva bolsa
    const moveToNewBagRadio = document.getElementById("moveToNewBag")
    const newBagNameGroup = document.getElementById("newBagNameGroup")

    moveToNewBagRadio.addEventListener("change", function () {
      if (this.checked) {
        newBagNameGroup.classList.remove("hidden")
      }
    })

    document.querySelectorAll('input[name="moveDestination"]').forEach((radio) => {
      if (radio.id !== "moveToNewBag") {
        radio.addEventListener("change", function () {
          if (this.checked) {
            newBagNameGroup.classList.add("hidden")
          }
        })
      }
    })

    // Configurar botones
    const confirmMoveBtn = document.getElementById("confirmMoveBtn")
    const cancelMoveBtn = document.getElementById("cancelMoveBtn")

    confirmMoveBtn.addEventListener("click", function () {
      const bagIndex = this.dataset.bagIndex
      const itemIndex = this.dataset.itemIndex
      const quantity = Number.parseInt(document.getElementById("moveQuantity").value) || 0

      if (quantity <= 0 || quantity > item.cantidad) {
        alert("Cantidad inválida")
        return
      }

      // Obtener destino seleccionado
      const selectedDestination = document.querySelector('input[name="moveDestination"]:checked').value

      // Mover el item
      if (selectedDestination === "inventory") {
        moveBagItemToInventory(bagIndex, itemIndex, quantity)
      } else if (selectedDestination === "new-bag") {
        const newBagName =
          document.getElementById("newBagName").value.trim() || `Bolsa ${personaje.bolsasEspeciales.length + 1}`
        moveBagItemToNewBag(bagIndex, itemIndex, quantity, newBagName)
      } else if (selectedDestination.startsWith("bag-")) {
        const targetBagIndex = selectedDestination.split("-")[1]
        moveBagItemToBag(bagIndex, itemIndex, quantity, targetBagIndex)
      }

      moveToBagModal.classList.remove("show-modal")
    })

    cancelMoveBtn.addEventListener("click", () => {
      moveToBagModal.classList.remove("show-modal")
    })
  }

  // Función para mover un item de una bolsa al inventario
  function moveBagItemToInventory(bagIndex, itemIndex, quantity) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]

    // Crear copia del item para el inventario
    const { bolsaId, ...itemForInventory } = item
    itemForInventory.cantidad = quantity

    // Verificar si ya existe un item similar en el inventario
    const existingItemIndex = personaje.inventario[item.categoria].findIndex(
      (i) =>
        i.nombre === item.nombre &&
        (item.categoria !== "armas" || i.manos === item.manos) &&
        (item.categoria !== "armaduras" ||
          (i.resistenciaMax === item.resistenciaMax &&
            i.bloqueoFisico === item.bloqueoFisico &&
            i.bloqueoMagico === i.bloqueoMagico)),
    )

    if (existingItemIndex !== -1) {
      // Si existe, incrementar la cantidad
      personaje.inventario[item.categoria][existingItemIndex].cantidad += quantity
    } else {
      // Si no existe, agregar como nuevo item
      personaje.inventario[item.categoria].push(itemForInventory)
    }

    // Reducir la cantidad del item original o eliminarlo
    if (quantity < item.cantidad) {
      item.cantidad -= quantity
    } else {
      personaje.bolsasEspeciales[bagIndex].contenido.splice(itemIndex, 1)
    }

    saveCharacter()
    loadBagContent(bagIndex)

    // Recargar la categoría actual del inventario si está abierta
    const activeHeader = document.querySelector(".accordion-header.active")
    if (activeHeader) {
      const category = activeHeader.dataset.category
      loadInventoryAccordion(category)
    }
  }

  // Función para mover un item a una bolsa existente
  function moveBagItemToBag(sourceBagIndex, itemIndex, quantity, targetBagIndex) {
    const sourceItem = personaje.bolsasEspeciales[sourceBagIndex].contenido[itemIndex]

    // Crear copia del item para la bolsa destino
    const itemForBag = { ...sourceItem, cantidad: quantity }

    // Verificar si ya existe un item similar en la bolsa destino
    const existingItemIndex = personaje.bolsasEspeciales[targetBagIndex].contenido.findIndex(
      (i) =>
        i.nombre === sourceItem.nombre &&
        i.categoria === sourceItem.categoria &&
        (sourceItem.categoria !== "armas" || i.manos === sourceItem.manos) &&
        (sourceItem.categoria !== "armaduras" ||
          (i.resistenciaMax === sourceItem.resistenciaMax &&
            i.bloqueoFisico === sourceItem.bloqueoFisico &&
            i.bloqueoMagico === sourceItem.bloqueoMagico)),
    )

    if (existingItemIndex !== -1) {
      // Si existe, incrementar la cantidad
      personaje.bolsasEspeciales[targetBagIndex].contenido[existingItemIndex].cantidad += quantity
    } else {
      // Si no existe, agregar como nuevo item
      personaje.bolsasEspeciales[targetBagIndex].contenido.push(itemForBag)
    }

    // Reducir la cantidad del item original o eliminarlo
    if (quantity < sourceItem.cantidad) {
      sourceItem.cantidad -= quantity
    } else {
      personaje.bolsasEspeciales[sourceBagIndex].contenido.splice(itemIndex, 1)
    }

    saveCharacter()
    loadBagContent(sourceBagIndex)
    loadBagContent(targetBagIndex)
  }

  // Función para mover un item a una nueva bolsa
  function moveBagItemToNewBag(bagIndex, itemIndex, quantity, newBagName) {
    const item = personaje.bolsasEspeciales[bagIndex].contenido[itemIndex]

    // Crear nueva bolsa
    const newBag = {
      id: Date.now().toString(),
      nombre: newBagName,
      contenido: [],
    }

    // Crear copia del item para la nueva bolsa
    const itemForNewBag = { ...item, cantidad: quantity }

    // Agregar item a la nueva bolsa
    newBag.contenido.push(itemForNewBag)

    // Agregar la nueva bolsa
    personaje.bolsasEspeciales.push(newBag)

    // Reducir la cantidad del item original o eliminarlo
    if (quantity < item.cantidad) {
      item.cantidad -= quantity
    } else {
      personaje.bolsasEspeciales[bagIndex].contenido.splice(itemIndex, 1)
    }

    saveCharacter()
    loadBagContent(bagIndex)
    loadSpecialBags()
  }

  // Inicializar la aplicación
  loadGrimorio()
  loadEquipment()
  loadSimpleResources()
  setupInventoryAccordion()
  attributeListeners()
  statusControls()
  setupResourceModals()
  setupItemModal()
  setupSellItemModal()
  setupMoveToBagModal()
  setupCreateBagButton()
  loadSpecialBags()

  // Manejar cambios en los atributos y estado
  function attributeListeners() {
    // Manejar cambio en el nivel
    const nivelInput = document.getElementById("nivel")
    if (nivelInput) {
      nivelInput.addEventListener("change", () => {
        personaje.nivel = Number.parseInt(nivelInput.value) || 1
        saveCharacter()
        updateCharacterInList()
      })
    }

    // Manejar cambios en otros atributos
    const atributos = ["clase", "combateCuerpo", "combateDistancia", "lanzamientoHechizos"]
    atributos.forEach((atributo) => {
      const input = document.getElementById(atributo)
      if (input) {
        input.addEventListener("change", () => {
          personaje[atributo] = Number.parseInt(input.value) || 0
          saveCharacter()
        })
      }
    })
  }

  // Configurar botones de incremento/decremento para vida, aguante y maná
  function statusControls() {
    const statusControls = ["vida", "aguante", "mana"]
    statusControls.forEach((status) => {
      const input = document.getElementById(status)
      const decreaseBtn = input?.parentElement?.querySelector(".decrease")
      const increaseBtn = input?.parentElement?.querySelector(".increase")

      if (input) {
        input.addEventListener("change", () => {
          personaje[status] = Number.parseInt(input.value) || 0
          saveCharacter()
        })
      }

      if (decreaseBtn) {
        decreaseBtn.addEventListener("click", () => {
          const currentValue = Number.parseInt(input.value) || 0
          if (currentValue > 0) {
            input.value = currentValue - 1
            personaje[status] = currentValue - 1
            saveCharacter()
          }
        })
      }

      if (increaseBtn) {
        increaseBtn.addEventListener("click", () => {
          const currentValue = Number.parseInt(input.value) || 0
          input.value = currentValue + 1
          personaje[status] = currentValue + 1
          saveCharacter()
        })
      }
    })
  }
})
