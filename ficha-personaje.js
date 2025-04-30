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
  let loadInventoryAccordion
  let saveEquippedChanges
  let editInventoryItem
  let removeInventoryItem
  let equipItem

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

  // Función para guardar los cambios de un item equipado
  saveEquippedChanges = (index) => {
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

    saveCharacter()
    loadEquipment()
  }

  // Función para cargar el inventario en el acordeón
  loadInventoryAccordion = (category) => {
    const inventoryList = document.getElementById(`${category}List`)
    if (!inventoryList) {
      console.error(`No se encontró el elemento con ID '${category}List'`)
      return
    }

    inventoryList.innerHTML = ""

    if (!personaje.inventario[category] || personaje.inventario[category].length === 0) {
      inventoryList.innerHTML = "<tr><td colspan='4'>No hay objetos en esta categoría.</td></tr>"
      return
    }

    personaje.inventario[category].forEach((item, index) => {
      const row = document.createElement("tr")
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

      row.innerHTML = `
        <td>${item.nombre}</td>
        <td>${detalles}</td>
        <td>${item.coste}</td>
        <td class="actions-cell">
          <i class="fas fa-edit action-icon edit-inventory-icon" data-category="${category}" data-index="${index}" title="Editar"></i>
          <i class="fas fa-trash action-icon delete-inventory-icon" data-category="${category}" data-index="${index}" title="Eliminar"></i>
          <i class="fas fa-arrow-up action-icon equip-icon" data-category="${category}" data-index="${index}" title="Equipar"></i>
        </td>
      `

      inventoryList.appendChild(row)
    })

    // Agregar event listeners a los iconos
    const editInventoryIcons = inventoryList.querySelectorAll(".edit-inventory-icon")
    editInventoryIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const category = this.dataset.category
        const index = this.dataset.index
        editInventoryItem(category, index)
      })
    })

    const deleteInventoryIcons = inventoryList.querySelectorAll(".delete-inventory-icon")
    deleteInventoryIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const category = this.dataset.category
        const index = this.dataset.index
        const itemName = personaje.inventario[category][index].nombre

        showConfirmation(`¿Estás seguro de que deseas eliminar "${itemName}" del inventario?`, () => {
          removeInventoryItem(category, index)
        })
      })
    })

    const equipIcons = inventoryList.querySelectorAll(".equip-icon")
    equipIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const category = this.dataset.category
        const index = this.dataset.index
        equipItem(category, index)
      })
    })
  }

  // Función para editar un item del inventario
  editInventoryItem = (category, index) => {
    // Implementar la lógica para editar un item del inventario
    console.log(`Editar item en la categoría ${category} con índice ${index}`)
  }

  // Función para eliminar un item del inventario
  removeInventoryItem = (category, index) => {
    // Implementar la lógica para eliminar un item del inventario
    console.log(`Eliminar item en la categoría ${category} con índice ${index}`)
  }

  // Función para equipar un item del inventario
  equipItem = (category, index) => {
    // Implementar la lógica para equipar un item del inventario
    console.log(`Equipar item en la categoría ${category} con índice ${index}`)
  }
})
