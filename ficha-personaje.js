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
  let loadBagContent
  let editBagName
  let deleteBag
  let showResourceModal

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

  // Configurar el botón de crear hechizo
  const createSpellBtn = document.getElementById("createSpellBtn")
  if (createSpellBtn) {
    createSpellBtn.addEventListener("click", () => {
      const createSpellModal = document.getElementById("createSpellModal")
      if (createSpellModal) {
        // Limpiar formulario
        document.getElementById("spellName").value = ""
        document.getElementById("spellDifficultyValue").value = "6"
        document.getElementById("spellDifficultyDice").value = "1d10"
        document.getElementById("spellDistance").value = "0"
        document.getElementById("spellUse").value = "Ofensivo"
        document.getElementById("spellAction").value = ""
        document.getElementById("spellDescription").value = ""

        // Cambiar el texto del botón
        const addSpellBtn = document.getElementById("addSpellBtn")
        if (addSpellBtn) {
          addSpellBtn.textContent = "Agregar Hechizo"

          // Eliminar cualquier event listener anterior
          const newAddSpellBtn = addSpellBtn.cloneNode(true)
          addSpellBtn.parentNode.replaceChild(newAddSpellBtn, addSpellBtn)

          // Añadir nuevo event listener
          newAddSpellBtn.addEventListener("click", () => {
            const spellName = document.getElementById("spellName").value.trim()
            const difficultyValue = document.getElementById("spellDifficultyValue").value
            const difficultyDice = document.getElementById("spellDifficultyDice").value
            const distance = document.getElementById("spellDistance").value
            const use = document.getElementById("spellUse").value
            const action = document.getElementById("spellAction").value
            const description = document.getElementById("spellDescription").value

            if (spellName) {
              const newSpell = {
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

              addSpell(newSpell)
              createSpellModal.classList.remove("show-modal")
            } else {
              alert("El nombre del hechizo es obligatorio")
            }
          })
        }

        // Mostrar modal
        createSpellModal.classList.add("show-modal")
      }
    })
  }

  // Configurar cierre del modal de crear hechizo
  const closeCreateSpellModal = document.getElementById("closeCreateSpellModal")
  if (closeCreateSpellModal) {
    closeCreateSpellModal.addEventListener("click", () => {
      const createSpellModal = document.getElementById("createSpellModal")
      if (createSpellModal) {
        createSpellModal.classList.remove("show-modal")
      }
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
    const accordionList = document.querySelector(`#${category}-content .accordion-list`)
    if (!accordionList) {
      console.error(`No se encontró el elemento con clase 'accordion-list' en #${category}-content`)
      return
    }

    accordionList.innerHTML = ""

    if (!personaje.inventario[category] || personaje.inventario[category].length === 0) {
      accordionList.innerHTML = "<p>No hay objetos en esta categoría.</p>"
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
            <i class="fas fa-arrow-up action-icon equip-icon" data-category="${category}" data-index="${index}" title="Equipar"></i>
          </td>
        </tr>
      `
    })

    tableHTML += `</tbody></table>`
    accordionList.innerHTML = tableHTML

    // Agregar event listeners a los iconos
    const editInventoryIcons = accordionList.querySelectorAll(".edit-inventory-icon")
    editInventoryIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const category = this.dataset.category
        const index = this.dataset.index
        editInventoryItem(category, index)
      })
    })

    const deleteInventoryIcons = accordionList.querySelectorAll(".delete-inventory-icon")
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

    const equipIcons = accordionList.querySelectorAll(".equip-icon")
    equipIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const category = this.dataset.category
        const index = this.dataset.index
        equipItem(category, index)
      })
    })
  }

  // Configurar botones de añadir items
  function setupAddItemButtons() {
    const addItemBtns = document.querySelectorAll(".add-item-btn")
    addItemBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const category = this.dataset.category
        showAddItemModal(category)
      })
    })
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

  // Arreglar la función setupInventoryAccordion para que cargue correctamente el contenido
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

    // Configurar botones de añadir items
    setupAddItemButtons()
  }

  // Arreglar la función para configurar el botón de crear bolsas especiales
  function setupCreateBagButton() {
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

  // Añadir al final de la función loadSpecialBags
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

  // Cambiar el icono de las cuerdas
  function updateResourceIcons() {
    const cuerdasIcon = document.querySelector("#cuerdas-resource i")
    if (cuerdasIcon) {
      cuerdasIcon.className = "fas fa-circle-notch" // Cambiamos de fa-scroll a fa-circle-notch
    }
  }

  // IMPLEMENTACIÓN DE FUNCIONES FALTANTES

  // Función para editar un item del inventario
  editInventoryItem = (category, index) => {
    const item = personaje.inventario[category][index]
    const itemModal = document.getElementById("itemModal")
    const itemModalContent = document.getElementById("itemModalContent")

    let formHTML = ""
    const title = `Editar ${getCategoryName(category)}`

    switch (category) {
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
              <input type="text" id="itemDanio" value="${item.danio || "1d6"}">
            </div>
            <div class="form-group">
              <label for="itemEstadisticas">Estadísticas modificadas:</label>
              <input type="text" id="itemEstadisticas" value="${item.estadisticas || ""}">
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
              <input type="number" id="itemQuantity" min="1" value="${item.cantidad || 1}">
            </div>
            <div class="form-group">
              <label for="itemCoste">Coste por unidad:</label>
              <input type="number" id="itemCoste" min="0" value="${item.coste || 0}">
            </div>
            <div class="form-group">
              <label for="itemMejora">Mejora:</label>
              <input type="text" id="itemMejora" value="${item.mejora || ""}">
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
              <input type="text" id="itemModificador" value="${item.modificador || ""}">
            </div>
            <div class="form-group">
              <label for="itemEfecto">Efecto:</label>
              <input type="text" id="itemEfecto" value="${item.efecto || ""}">
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
              <input type="text" id="itemModificador" value="${item.modificador || ""}">
            </div>
            <div class="form-group">
              <label for="itemEfecto">Efecto:</label>
              <input type="text" id="itemEfecto" value="${item.efecto || ""}">
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
    }

    // Preparar contenido del modal
    itemModalContent.innerHTML = `
      <h3>${title}</h3>
      ${formHTML}
      <div class="form-actions">
        <button id="saveItemBtn" class="btn" data-category="${category}" data-index="${index}">Guardar Cambios</button>
      </div>
    `

    // Mostrar modal
    itemModal.classList.add("show-modal")

    // Configurar botón de guardar
    const saveItemBtn = document.getElementById("saveItemBtn")
    if (saveItemBtn) {
      saveItemBtn.addEventListener("click", function () {
        const category = this.dataset.category
        const index = this.dataset.index
        saveInventoryItemChanges(category, index)
        itemModal.classList.remove("show-modal")
      })
    }
  }

  // Función para guardar los cambios de un item del inventario
  function saveInventoryItemChanges(category, index) {
    const item = personaje.inventario[category][index]

    // Actualizar propiedades comunes
    item.nombre = document.getElementById("itemName").value.trim()
    item.cantidad = Number.parseInt(document.getElementById("itemQuantity").value) || 1
    item.coste = Number.parseInt(document.getElementById("itemCoste").value) || 0

    // Actualizar propiedades específicas según la categoría
    switch (category) {
      case "armaduras":
        item.resistenciaMax = Number.parseInt(document.getElementById("itemResistenciaMax").value) || 10
        item.bloqueoFisico = Number.parseInt(document.getElementById("itemBloqueoFisico").value) || 0
        item.bloqueoMagico = Number.parseInt(document.getElementById("itemBloqueoMagico").value) || 0
        break
      case "armas":
        item.manos = Number.parseInt(document.getElementById("itemManos").value) || 1
        item.tipo = document.getElementById("itemTipo").value
        item.danio = document.getElementById("itemDanio").value || "1d6"
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

    saveCharacter()
    loadInventoryAccordion(category)
  }

  // Función para eliminar un item del inventario
  removeInventoryItem = (category, index) => {
    // Eliminar el item del inventario
    personaje.inventario[category].splice(index, 1)
    saveCharacter()
    loadInventoryAccordion(category)
  }

  // Función para equipar un item del inventario
  equipItem = (category, index) => {
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

    saveCharacter()
    loadEquipment()
    loadInventoryAccordion(category)
  }

  // Función para cargar el contenido de una bolsa especial
  loadBagContent = (bagIndex) => {
    const bagContent = document.getElementById(`bag-content-${bagIndex}`)
    const bagItemsList = bagContent.querySelector(".bag-items-list")
    const emptyBagMessage = bagContent.querySelector(".empty-bag-message")
    const bolsa = personaje.bolsasEspeciales[bagIndex]

    if (!bagItemsList) return

    bagItemsList.innerHTML = ""

    if (!bolsa.contenido || bolsa.contenido.length === 0) {
      emptyBagMessage.classList.remove("hidden")
      return
    }

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
          <td>${getCategoryName(item.categoria)}</td>
          <td>${item.cantidad || 1}</td>
          <td class="actions-cell">
            <i class="fas fa-arrow-up action-icon move-from-bag-icon" data-bag-index="${bagIndex}" data-item-index="${index}" title="Mover al inventario"></i>
          </td>
        </tr>
      `
    })

    tableHTML += `</tbody></table>`
    bagItemsList.innerHTML = tableHTML

    // Agregar event listeners a los iconos
    const moveFromBagIcons = bagItemsList.querySelectorAll(".move-from-bag-icon")
    moveFromBagIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const bagIndex = this.dataset.bagIndex
        const itemIndex = this.dataset.itemIndex
        moveItemFromBag(bagIndex, itemIndex)
      })
    })
  }

  // Función para mover un item de una bolsa al inventario
  function moveItemFromBag(bagIndex, itemIndex) {
    const bolsa = personaje.bolsasEspeciales[bagIndex]
    const item = bolsa.contenido[itemIndex]

    // Añadir el item al inventario
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

    // Eliminar el item de la bolsa
    bolsa.contenido.splice(itemIndex, 1)

    saveCharacter()
    loadBagContent(bagIndex)

    // Recargar la categoría actual del inventario si está abierta
    const activeHeader = document.querySelector(".accordion-header.active")
    if (activeHeader) {
      const category = activeHeader.dataset.category
      loadInventoryAccordion(category)
    }
  }

  // Función para editar el nombre de una bolsa especial
  editBagName = (bagIndex) => {
    const bolsa = personaje.bolsasEspeciales[bagIndex]

    // Mostrar un prompt para editar el nombre
    const newName = prompt("Introduce el nuevo nombre para la bolsa:", bolsa.nombre)

    if (newName && newName.trim() !== "") {
      bolsa.nombre = newName.trim()
      saveCharacter()
      loadSpecialBags()
    }
  }

  // Función para eliminar una bolsa especial
  deleteBag = (bagIndex) => {
    const bolsa = personaje.bolsasEspeciales[bagIndex]

    // Mover todos los items de la bolsa al inventario
    if (bolsa.contenido && bolsa.contenido.length > 0) {
      bolsa.contenido.forEach((item) => {
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
    }

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

  // Función para mostrar el modal de recursos
  showResourceModal = (resource) => {
    const resourceModal = document.getElementById("resourceModal")
    const resourceModalContent = document.getElementById("resourceModalContent")

    let title = ""
    let currentValue = 0

    switch (resource) {
      case "monedas":
        title = "Monedas"
        currentValue = personaje.inventario.monedas
        break
      case "ganzuas":
        title = "Ganzúas"
        currentValue = personaje.inventario.ganzuas
        break
      case "antorchas":
        title = "Antorchas"
        currentValue = personaje.inventario.antorchas
        break
      case "cuerdas":
        title = "Cuerdas"
        currentValue = personaje.inventario.cuerdas
        break
    }

    // Preparar contenido del modal
    resourceModalContent.innerHTML = `
      <h3>${title}</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="resourceValue">Cantidad:</label>
          <input type="number" id="resourceValue" min="0" value="${currentValue}">
        </div>
      </div>
      <div class="form-actions">
        <button id="saveResourceBtn" class="btn" data-resource="${resource}">Guardar</button>
      </div>
    `

    // Mostrar modal
    resourceModal.classList.add("show-modal")

    // Configurar botón de guardar
    const saveResourceBtn = document.getElementById("saveResourceBtn")
    if (saveResourceBtn) {
      saveResourceBtn.addEventListener("click", function () {
        const resource = this.dataset.resource
        const value = Number.parseInt(document.getElementById("resourceValue").value) || 0

        personaje.inventario[resource] = value
        saveCharacter()
        loadSimpleResources()

        resourceModal.classList.remove("show-modal")
      })
    }
  }

  // Configurar modales de recursos
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

  // Añadir al final del documento, justo antes del cierre de la función principal
  // Inicializar la aplicación
  loadGrimorio()
  loadEquipment()
  loadSimpleResources()
  setupInventoryAccordion()
  setupItemModal()
  setupSellItemModal()
  setupMoveToBagModal()
  setupCreateBagButton()
  loadSpecialBags()
  updateResourceIcons() // Actualizar el icono de las cuerdas

  // Manejar cambios en los atributos y estado
  attributeListeners()
  statusControls()
  setupResourceModals()

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
          personaje[atributo] = input.type === "number" ? Number.parseInt(input.value) || 0 : input.value
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
})
