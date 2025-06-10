// Import Bootstrap
const bootstrap = window.bootstrap

function añadirIconosAtributos() {
  // Añadir icono para inteligencia
  const inteligenciaElement = document.getElementById("inteligencia-valor")
  if (inteligenciaElement) {
    const inteligenciaContainer = inteligenciaElement.closest(".col-md-3")
    if (inteligenciaContainer) {
      const label = inteligenciaContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-brain me-1"></i> Inteligencia'
      }
    }
  }

  // Añadir icono para combate
  const combateElement = document.getElementById("combate-valor")
  if (combateElement) {
    const combateContainer = combateElement.closest(".col-md-4")
    if (combateContainer) {
      const label = combateContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-sword me-1"></i> Combate'
      }
    }
  }

  // Añadir icono para acrobacia
  const acrobaciaElement = document.getElementById("acrobacia-valor")
  if (acrobaciaElement) {
    const acrobaciaContainer = acrobaciaElement.closest(".col-md-4")
    if (acrobaciaContainer) {
      const label = acrobaciaContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-person-walking me-1"></i> Acrobacia'
      }
    }
  }

  // Añadir icono para equitación
  const equitacionElement = document.getElementById("equitacion-valor")
  if (equitacionElement) {
    const equitacionContainer = equitacionElement.closest(".col-md-4")
    if (equitacionContainer) {
      const label = equitacionContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-bicycle me-1"></i> Equitación'
      }
    }
  }
}

// Función para cargar los datos del personaje en la ficha
function cargarFichaPersonaje() {
  console.log("Cargando ficha de personaje...")

  try {
    const personajeJSON = localStorage.getItem("personajeActual")
    console.log("Datos del personaje actual:", personajeJSON)

    if (!personajeJSON) {
      console.error("No hay personaje actual")
      alert("No hay ningún personaje seleccionado. Serás redirigido a la página principal.")
      window.location.href = "index.html"
      return
    }

    const personaje = JSON.parse(personajeJSON)
    console.log("Personaje parseado:", personaje)

    // Cargar datos básicos
    const nombreElement = document.getElementById("nombrePersonaje")
    const claseElement = document.getElementById("clasePersonaje")
    const nivelElement = document.getElementById("nivelPersonaje")

    if (nombreElement) nombreElement.textContent = personaje.nombre || "Sin nombre"
    if (claseElement) claseElement.textContent = personaje.clase || "Sin clase"
    if (nivelElement) nivelElement.textContent = personaje.nivel || "1"

    // Cargar atributos vitales
    const vidaElement = document.getElementById("vidaValor")
    const vidaActualElement = document.getElementById("vidaActualValor")
    const aguanteElement = document.getElementById("aguanteValor")
    const aguanteActualElement = document.getElementById("aguanteActualValor")
    const manaElement = document.getElementById("manaValor")
    const manaActualElement = document.getElementById("manaActualValor")

    if (vidaElement) vidaElement.textContent = personaje.vida || "0"
    if (vidaActualElement) vidaActualElement.textContent = personaje.vidaActual || personaje.vida || "0"
    if (aguanteElement) aguanteElement.textContent = personaje.aguante || "0"
    if (aguanteActualElement) aguanteActualElement.textContent = personaje.aguanteActual || personaje.aguante || "0"
    if (manaElement) manaElement.textContent = personaje.mana || "0"
    if (manaActualElement) manaActualElement.textContent = personaje.manaActual || personaje.mana || "0"

    // Cargar atributos de combate
    const combateElement = document.getElementById("combateValor")
    const punteriaElement = document.getElementById("punteriaValor")
    const magiaElement = document.getElementById("magiaValor")

    if (combateElement) combateElement.textContent = personaje.combate || "0"
    if (punteriaElement) punteriaElement.textContent = personaje.punteria || "0"
    if (magiaElement) magiaElement.textContent = personaje.magia || "0"

    // Cargar habilidades derivadas
    const buscarElement = document.getElementById("buscarValor")
    const sigiloElement = document.getElementById("sigiloValor")
    const observarElement = document.getElementById("observarValor")
    const cerraduraElement = document.getElementById("cerraduraValor")
    const trampasElement = document.getElementById("trampasValor")
    const manipularObjetosElement = document.getElementById("manipularObjetosValor")
    const acrobaciaElement = document.getElementById("acrobaciaValor")
    const desarmarElement = document.getElementById("desarmarValor")
    const equitacionElement = document.getElementById("equitacionValor")
    const elocuenciaElement = document.getElementById("elocuenciaValor")
    const resolverElement = document.getElementById("resolverValor")

    if (buscarElement) buscarElement.textContent = personaje.buscar || "0"
    if (sigiloElement) sigiloElement.textContent = personaje.sigilo || "0"
    if (observarElement) observarElement.textContent = personaje.observar || "0"
    if (cerraduraElement) cerraduraElement.textContent = personaje.cerradura || "0"
    if (trampasElement) trampasElement.textContent = personaje.trampas || "0"
    if (manipularObjetosElement) manipularObjetosElement.textContent = personaje.manipularObjetos || "0"
    if (acrobaciaElement) acrobaciaElement.textContent = personaje.acrobacia || "0"
    if (desarmarElement) desarmarElement.textContent = personaje.desarmar || "0"
    if (equitacionElement) equitacionElement.textContent = personaje.equitacion || "0"
    if (elocuenciaElement) elocuenciaElement.textContent = personaje.elocuencia || "0"
    if (resolverElement) resolverElement.textContent = personaje.resolver || "0"

    // Cargar equipamiento
    cargarEquipamiento(personaje.equipamiento)

    // Cargar inventario
    cargarInventario(personaje.inventario)

    // Cargar recursos
    cargarRecursos(personaje.recursos)

    // Cargar bolsas especiales
    cargarBolsas(personaje.bolsasEspeciales)

    // Cargar grimorio
    cargarGrimorio(personaje.grimorio)

    // Configurar botones
    configurarBotones()

    console.log("Ficha de personaje cargada correctamente")
  } catch (error) {
    console.error("Error al cargar la ficha del personaje:", error)
    alert("Error al cargar los datos del personaje")
  }
}

// Función para cargar el equipamiento
function cargarEquipamiento(equipamiento) {
  console.log("Cargando equipamiento:", equipamiento)

  if (!equipamiento) {
    console.warn("No hay datos de equipamiento")
    return
  }

  // Cargar armas
  const armasLista = document.getElementById("armasLista")
  if (armasLista) {
    if (equipamiento.armas && equipamiento.armas.length > 0) {
      let armasHTML = ""
      equipamiento.armas.forEach((arma) => {
        armasHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${arma.nombre}
            <span class="badge bg-primary rounded-pill">${arma.daño || "-"}</span>
          </li>
        `
      })
      armasLista.innerHTML = armasHTML
    } else {
      armasLista.innerHTML = '<li class="list-group-item text-muted">No hay armas equipadas</li>'
    }
  }

  // Cargar armaduras
  const armadurasLista = document.getElementById("armadurasLista")
  if (armadurasLista) {
    if (equipamiento.armaduras && equipamiento.armaduras.length > 0) {
      let armadurasHTML = ""
      equipamiento.armaduras.forEach((armadura) => {
        armadurasHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${armadura.nombre}
            <span class="badge bg-secondary rounded-pill">${armadura.proteccion || "-"}</span>
          </li>
        `
      })
      armadurasLista.innerHTML = armadurasHTML
    } else {
      armadurasLista.innerHTML = '<li class="list-group-item text-muted">No hay armaduras equipadas</li>'
    }
  }

  // Cargar municiones
  const municionesLista = document.getElementById("municionesLista")
  if (municionesLista) {
    if (equipamiento.municiones && equipamiento.municiones.length > 0) {
      let municionesHTML = ""
      equipamiento.municiones.forEach((municion) => {
        municionesHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${municion.nombre}
            <span class="badge bg-info rounded-pill">${municion.cantidad || "0"}</span>
          </li>
        `
      })
      municionesLista.innerHTML = municionesHTML
    } else {
      municionesLista.innerHTML = '<li class="list-group-item text-muted">No hay municiones equipadas</li>'
    }
  }
}

// Función para cargar el inventario
function cargarInventario(inventario) {
  console.log("Cargando inventario:", inventario)

  const inventarioAccordion = document.getElementById("inventarioAccordion")
  const inventarioVacio = document.getElementById("inventarioVacio")

  if (!inventario || inventario.length === 0) {
    if (inventarioVacio) inventarioVacio.style.display = "block"
    if (inventarioAccordion) inventarioAccordion.innerHTML = ""
    return
  }

  if (inventarioVacio) inventarioVacio.style.display = "none"
  if (!inventarioAccordion) return

  let inventarioHTML = ""

  // Agrupar objetos por tipo
  const objetosPorTipo = {}
  inventario.forEach((objeto) => {
    const tipo = objeto.tipo || "otro"
    if (!objetosPorTipo[tipo]) {
      objetosPorTipo[tipo] = []
    }
    objetosPorTipo[tipo].push(objeto)
  })

  // Crear acordeón para cada tipo
  let index = 0
  for (const tipo in objetosPorTipo) {
    const objetos = objetosPorTipo[tipo]
    const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1)

    inventarioHTML += `
      <div class="accordion-item">
        <h2 class="accordion-header" id="heading${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
            ${tipoCapitalizado} (${objetos.length})
          </button>
        </h2>
        <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#inventarioAccordion">
          <div class="accordion-body p-0">
            <ul class="list-group list-group-flush">
    `

    objetos.forEach((objeto) => {
      inventarioHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${objeto.nombre}</strong>
            ${objeto.descripcion ? `<br><small class="text-muted">${objeto.descripcion}</small>` : ""}
          </div>
          <span class="badge bg-primary rounded-pill">${objeto.cantidad || "1"}</span>
        </li>
      `
    })

    inventarioHTML += `
            </ul>
          </div>
        </div>
      </div>
    `
    index++
  }

  inventarioAccordion.innerHTML = inventarioHTML
}

// Función para cargar los recursos
function cargarRecursos(recursos) {
  console.log("Cargando recursos:", recursos)

  const recursosContainer = document.getElementById("recursosContainer")
  const recursosVacio = document.getElementById("recursosVacio")

  if (!recursos || recursos.length === 0) {
    if (recursosVacio) recursosVacio.style.display = "block"
    if (recursosContainer) recursosContainer.innerHTML = ""
    return
  }

  if (recursosVacio) recursosVacio.style.display = "none"
  if (!recursosContainer) return

  let recursosHTML = '<div class="row">'

  recursos.forEach((recurso) => {
    recursosHTML += `
      <div class="col-md-6 mb-2">
        <div class="card">
          <div class="card-body p-2">
            <h6 class="card-title">${recurso.nombre}</h6>
            <div class="d-flex justify-content-between">
              <span>Cantidad: ${recurso.cantidad || "0"}</span>
              <span>Valor: ${recurso.valor || "0"}</span>
            </div>
          </div>
        </div>
      </div>
    `
  })

  recursosHTML += "</div>"
  recursosContainer.innerHTML = recursosHTML
}

// Función para cargar las bolsas especiales
function cargarBolsas(bolsas) {
  console.log("Cargando bolsas:", bolsas)

  const bolsasContainer = document.getElementById("bolsasContainer")
  const bolsasVacio = document.getElementById("bolsasVacio")

  if (!bolsas || bolsas.length === 0) {
    if (bolsasVacio) bolsasVacio.style.display = "block"
    if (bolsasContainer) bolsasContainer.innerHTML = ""
    return
  }

  if (bolsasVacio) bolsasVacio.style.display = "none"
  if (!bolsasContainer) return

  let bolsasHTML = ""

  bolsas.forEach((bolsa, index) => {
    const contenidoCount = bolsa.contenido ? bolsa.contenido.length : 0
    bolsasHTML += `
      <div class="card mb-2">
        <div class="card-header">
          <h6 class="mb-0">${bolsa.nombre}</h6>
        </div>
        <div class="card-body p-2">
          <p class="card-text small">${bolsa.descripcion || "Sin descripción"}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-info">${contenidoCount} objetos</span>
            <button class="btn btn-sm btn-outline-primary" onclick="verContenidoBolsa(${index})">
              Ver contenido
            </button>
          </div>
        </div>
      </div>
    `
  })

  bolsasContainer.innerHTML = bolsasHTML
}

// Función para cargar el grimorio
function cargarGrimorio(grimorio) {
  console.log("Cargando grimorio:", grimorio)

  const grimorioContainer = document.getElementById("grimorioContainer")
  const grimorioVacio = document.getElementById("grimorioVacio")

  if (!grimorio || grimorio.length === 0) {
    if (grimorioVacio) grimorioVacio.style.display = "block"
    if (grimorioContainer) grimorioContainer.innerHTML = ""
    return
  }

  if (grimorioVacio) grimorioVacio.style.display = "none"
  if (!grimorioContainer) return

  let grimorioHTML = ""

  // Ordenar hechizos por nivel
  const hechizosOrdenados = [...grimorio].sort((a, b) => (a.nivel || 0) - (b.nivel || 0))

  hechizosOrdenados.forEach((hechizo) => {
    grimorioHTML += `
      <div class="card mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">${hechizo.nombre}</h6>
          <span class="badge bg-primary">Nivel ${hechizo.nivel || "1"}</span>
        </div>
        <div class="card-body p-2">
          <p class="card-text small">${hechizo.efecto || "Sin descripción"}</p>
          <div class="text-end">
            <span class="badge bg-info">Coste: ${hechizo.coste || "0"} maná</span>
          </div>
        </div>
      </div>
    `
  })

  grimorioContainer.innerHTML = grimorioHTML
}

// Función para ver el contenido de una bolsa
function verContenidoBolsa(index) {
  console.log("Viendo contenido de bolsa:", index)

  try {
    const personajeJSON = localStorage.getItem("personajeActual")
    if (!personajeJSON) return

    const personaje = JSON.parse(personajeJSON)
    const bolsa = personaje.bolsasEspeciales[index]

    if (!bolsa) {
      console.error("No se encontró la bolsa")
      return
    }

    const contenido = bolsa.contenido || []
    const contenidoTexto =
      contenido.length > 0
        ? contenido.map((item) => `- ${item.nombre} (${item.cantidad || 1})`).join("\n")
        : "La bolsa está vacía"

    alert(`Contenido de ${bolsa.nombre}:\n\n${contenidoTexto}`)
  } catch (error) {
    console.error("Error al ver contenido de bolsa:", error)
  }
}

// Función para configurar los botones
function configurarBotones() {
  console.log("Configurando botones...")

  // Botón para añadir objeto
  const addItemBtn = document.getElementById("addItemBtn")
  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      console.log("Abriendo modal para añadir objeto")
      abrirModalObjeto()
    })
  }

  // Botón para guardar objeto
  const saveItemBtn = document.getElementById("saveItemBtn")
  if (saveItemBtn) {
    saveItemBtn.addEventListener("click", () => {
      console.log("Guardando objeto")
      guardarObjeto()
    })
  }

  // Otros botones de acción
  const addEquipmentBtn = document.getElementById("addEquipmentBtn")
  if (addEquipmentBtn) {
    addEquipmentBtn.addEventListener("click", () => {
      alert("Funcionalidad en desarrollo")
    })
  }

  const addResourceBtn = document.getElementById("addResourceBtn")
  if (addResourceBtn) {
    addResourceBtn.addEventListener("click", () => {
      alert("Funcionalidad en desarrollo")
    })
  }

  const addBagBtn = document.getElementById("addBagBtn")
  if (addBagBtn) {
    addBagBtn.addEventListener("click", () => {
      alert("Funcionalidad en desarrollo")
    })
  }

  const addSpellBtn = document.getElementById("addSpellBtn")
  if (addSpellBtn) {
    addSpellBtn.addEventListener("click", () => {
      alert("Funcionalidad en desarrollo")
    })
  }

  // Configurar el cambio de tipo en el modal
  const itemType = document.getElementById("itemType")
  if (itemType) {
    itemType.addEventListener("change", (e) => {
      mostrarCamposEspecificos(e.target.value)
    })
  }
}

// Función para abrir el modal de objeto
function abrirModalObjeto(id = null) {
  console.log("Abriendo modal de objeto, ID:", id)

  const modalElement = document.getElementById("itemModal")
  if (!modalElement) {
    console.error("No se encontró el modal itemModal")
    return
  }

  const modal = new bootstrap.Modal(modalElement)
  const form = document.getElementById("itemForm")
  const deleteBtn = document.getElementById("deleteItemBtn")
  const equipBtn = document.getElementById("equipItemBtn")
  const moveToBagBtn = document.getElementById("moveToBagBtn")
  const typeSelect = document.getElementById("itemType")

  // Limpiar el formulario
  if (form) form.reset()

  // Ocultar todos los campos específicos
  const weaponFields = document.getElementById("weaponFields")
  const armorFields = document.getElementById("armorFields")
  const ammoFields = document.getElementById("ammoFields")
  const resourceFields = document.getElementById("resourceFields")

  if (weaponFields) weaponFields.style.display = "none"
  if (armorFields) armorFields.style.display = "none"
  if (ammoFields) ammoFields.style.display = "none"
  if (resourceFields) resourceFields.style.display = "none"

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

    // Cargar campos específicos según el tipo
    mostrarCamposEspecificos(objeto.tipo, objeto)

    if (deleteBtn) deleteBtn.style.display = "block"
    if (equipBtn) {
      equipBtn.style.display =
        objeto.tipo === "arma" || objeto.tipo === "armadura" || objeto.tipo === "municion" ? "block" : "none"
    }
    if (moveToBagBtn) moveToBagBtn.style.display = "block"
  } else {
    // Nuevo objeto
    document.getElementById("itemModalLabel").textContent = "Nuevo objeto"
    document.getElementById("itemId").value = ""
    if (deleteBtn) deleteBtn.style.display = "none"
    if (equipBtn) equipBtn.style.display = "none"
    if (moveToBagBtn) moveToBagBtn.style.display = "none"
  }

  modal.show()
}

// Función para mostrar campos específicos según el tipo de objeto
function mostrarCamposEspecificos(tipo, objeto = null) {
  console.log("Mostrando campos específicos para tipo:", tipo)

  // Ocultar todos los campos específicos
  const weaponFields = document.getElementById("weaponFields")
  const armorFields = document.getElementById("armorFields")
  const ammoFields = document.getElementById("ammoFields")
  const resourceFields = document.getElementById("resourceFields")

  if (weaponFields) weaponFields.style.display = "none"
  if (armorFields) armorFields.style.display = "none"
  if (ammoFields) ammoFields.style.display = "none"
  if (resourceFields) resourceFields.style.display = "none"

  // Actualizar etiquetas de peso y valor
  const weightLabel = document.getElementById("weightLabel")
  const valueLabel = document.getElementById("valueLabel")

  switch (tipo) {
    case "arma":
      if (weaponFields) weaponFields.style.display = "block"
      if (weightLabel) weightLabel.textContent = "total"
      if (valueLabel) valueLabel.textContent = "total"
      if (objeto) {
        const weaponType = document.getElementById("weaponType")
        const weaponDamage = document.getElementById("weaponDamage")
        const weaponRange = document.getElementById("weaponRange")
        if (weaponType) weaponType.value = objeto.tipoArma || ""
        if (weaponDamage) weaponDamage.value = objeto.daño || ""
        if (weaponRange) weaponRange.value = objeto.alcance || ""
      }
      break

    case "armadura":
      if (armorFields) armorFields.style.display = "block"
      if (weightLabel) weightLabel.textContent = "total"
      if (valueLabel) valueLabel.textContent = "total"
      if (objeto) {
        const armorType = document.getElementById("armorType")
        const armorProtection = document.getElementById("armorProtection")
        if (armorType) armorType.value = objeto.tipoArmadura || ""
        if (armorProtection) armorProtection.value = objeto.proteccion || 0
      }
      break

    case "municion":
      if (ammoFields) ammoFields.style.display = "block"
      if (weightLabel) weightLabel.textContent = "unitario"
      if (valueLabel) valueLabel.textContent = "unitario"
      if (objeto) {
        const ammoType = document.getElementById("ammoType")
        if (ammoType) ammoType.value = objeto.tipoMunicion || ""
      }
      break

    case "recurso":
      if (resourceFields) resourceFields.style.display = "block"
      if (weightLabel) weightLabel.textContent = "unitario"
      if (valueLabel) valueLabel.textContent = "unitario"
      if (objeto) {
        const resourceCategory = document.getElementById("resourceCategory")
        if (resourceCategory) resourceCategory.value = objeto.categoria || ""
      }
      break

    default:
      if (weightLabel) weightLabel.textContent = "total"
      if (valueLabel) valueLabel.textContent = "total"
      break
  }
}

// Función para guardar un objeto
function guardarObjeto() {
  console.log("Guardando objeto...")

  try {
    const nombre = document.getElementById("itemName").value
    const tipo = document.getElementById("itemType").value
    const cantidad = Number.parseInt(document.getElementById("itemQuantity").value) || 1
    const peso = Number.parseFloat(document.getElementById("itemWeight").value) || 0
    const valor = Number.parseInt(document.getElementById("itemValue").value) || 0
    const descripcion = document.getElementById("itemDescription").value
    const id = document.getElementById("itemId").value || Date.now().toString()

    if (!nombre) {
      alert("El nombre es obligatorio")
      return
    }

    const objeto = {
      id,
      nombre,
      tipo,
      cantidad,
      peso,
      valor,
      descripcion,
    }

    // Añadir campos específicos según el tipo
    switch (tipo) {
      case "arma":
        const weaponType = document.getElementById("weaponType")
        const weaponDamage = document.getElementById("weaponDamage")
        const weaponRange = document.getElementById("weaponRange")
        if (weaponType) objeto.tipoArma = weaponType.value
        if (weaponDamage) objeto.daño = weaponDamage.value
        if (weaponRange) objeto.alcance = weaponRange.value
        break

      case "armadura":
        const armorType = document.getElementById("armorType")
        const armorProtection = document.getElementById("armorProtection")
        if (armorType) objeto.tipoArmadura = armorType.value
        if (armorProtection) objeto.proteccion = Number.parseInt(armorProtection.value) || 0
        break

      case "municion":
        const ammoType = document.getElementById("ammoType")
        if (ammoType) objeto.tipoMunicion = ammoType.value
        break

      case "recurso":
        const resourceCategory = document.getElementById("resourceCategory")
        if (resourceCategory) objeto.categoria = resourceCategory.value
        break
    }

    const personajeJSON = localStorage.getItem("personajeActual")
    if (!personajeJSON) return

    const personaje = JSON.parse(personajeJSON)

    if (!personaje.inventario) {
      personaje.inventario = []
    }

    // Si es un objeto nuevo, añadirlo
    if (!document.getElementById("itemId").value) {
      personaje.inventario.push(objeto)
    } else {
      // Si es una edición, actualizar el objeto existente
      const index = personaje.inventario.findIndex((item) => item.id === id)
      if (index !== -1) {
        personaje.inventario[index] = objeto
      } else {
        personaje.inventario.push(objeto)
      }
    }

    // Guardar el personaje actualizado
    localStorage.setItem("personajeActual", JSON.stringify(personaje))

    // Actualizar también en la lista de personajes
    const personajesJSON = localStorage.getItem("personajes")
    if (personajesJSON) {
      const personajes = JSON.parse(personajesJSON)
      const index = personajes.findIndex((p) => p.id === personaje.id)
      if (index !== -1) {
        personajes[index] = personaje
        localStorage.setItem("personajes", JSON.stringify(personajes))
      }
    }

    // Cerrar el modal
    const modalElement = document.getElementById("itemModal")
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement)
      if (modal) modal.hide()
    }

    // Recargar el inventario
    cargarInventario(personaje.inventario)

    alert("Objeto guardado correctamente")
  } catch (error) {
    console.error("Error al guardar objeto:", error)
    alert("Error al guardar el objeto")
  }
}

// Exponer funciones al ámbito global
window.verContenidoBolsa = verContenidoBolsa
window.abrirModalObjeto = abrirModalObjeto
window.guardarObjeto = guardarObjeto
window.mostrarCamposEspecificos = mostrarCamposEspecificos

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando ficha de personaje...")
  cargarFichaPersonaje()
})
