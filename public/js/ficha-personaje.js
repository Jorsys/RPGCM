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
    document.getElementById("nombrePersonaje").textContent = personaje.nombre || "Sin nombre"
    document.getElementById("clasePersonaje").textContent = personaje.clase || "Sin clase"
    document.getElementById("nivelPersonaje").textContent = personaje.nivel || "1"

    // Cargar atributos básicos
    document.getElementById("percepcionValor").textContent = personaje.percepcion || "0"
    document.getElementById("destrezaValor").textContent = personaje.destreza || "0"
    document.getElementById("agilidadValor").textContent = personaje.agilidad || "0"
    document.getElementById("inteligenciaValor").textContent = personaje.inteligencia || "0"

    // Cargar atributos vitales
    document.getElementById("vidaValor").textContent = personaje.vida || "0"
    document.getElementById("vidaActualValor").textContent = personaje.vidaActual || "0"
    document.getElementById("aguanteValor").textContent = personaje.aguante || "0"
    document.getElementById("aguanteActualValor").textContent = personaje.aguanteActual || "0"
    document.getElementById("manaValor").textContent = personaje.mana || "0"
    document.getElementById("manaActualValor").textContent = personaje.manaActual || "0"

    // Cargar atributos de combate
    document.getElementById("combateValor").textContent = personaje.combate || "0"
    document.getElementById("punteriaValor").textContent = personaje.punteria || "0"
    document.getElementById("magiaValor").textContent = personaje.magia || "0"

    // Cargar habilidades derivadas
    document.getElementById("buscarValor").textContent = personaje.buscar || "0"
    document.getElementById("sigiloValor").textContent = personaje.sigilo || "0"
    document.getElementById("observarValor").textContent = personaje.observar || "0"
    document.getElementById("cerraduraValor").textContent = personaje.cerradura || "0"
    document.getElementById("trampasValor").textContent = personaje.trampas || "0"
    document.getElementById("manipularObjetosValor").textContent = personaje.manipularObjetos || "0"
    document.getElementById("acrobaciaValor").textContent = personaje.acrobacia || "0"
    document.getElementById("desarmarValor").textContent = personaje.desarmar || "0"
    document.getElementById("equitacionValor").textContent = personaje.equitacion || "0"
    document.getElementById("elocuenciaValor").textContent = personaje.elocuencia || "0"
    document.getElementById("resolverValor").textContent = personaje.resolver || "0"

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

  // Cargar armaduras
  const armadurasLista = document.getElementById("armadurasLista")
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

  // Cargar municiones
  const municionesLista = document.getElementById("municionesLista")
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

// Función para cargar el inventario
function cargarInventario(inventario) {
  console.log("Cargando inventario:", inventario)

  const inventarioAccordion = document.getElementById("inventarioAccordion")
  const inventarioVacio = document.getElementById("inventarioVacio")

  if (!inventario || inventario.length === 0) {
    inventarioVacio.style.display = "block"
    return
  }

  inventarioVacio.style.display = "none"
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
          ${objeto.nombre}
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
    recursosVacio.style.display = "block"
    return
  }

  recursosVacio.style.display = "none"
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
    bolsasVacio.style.display = "block"
    return
  }

  bolsasVacio.style.display = "none"
  let bolsasHTML = ""

  bolsas.forEach((bolsa, index) => {
    bolsasHTML += `
      <div class="card mb-2">
        <div class="card-header">
          <h6 class="mb-0">${bolsa.nombre}</h6>
        </div>
        <div class="card-body p-2">
          <p class="card-text small">${bolsa.descripcion || "Sin descripción"}</p>
          <div class="mt-2">
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
    grimorioVacio.style.display = "block"
    return
  }

  grimorioVacio.style.display = "none"
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

    alert(
      `Contenido de ${bolsa.nombre}:\n\n${bolsa.contenido ? bolsa.contenido.map((item) => `- ${item.nombre} (${item.cantidad || 1})`).join("\n") : "La bolsa está vacía"}`,
    )
  } catch (error) {
    console.error("Error al ver contenido de bolsa:", error)
  }
}

// Función para configurar los botones
function configurarBotones() {
  // Botón para añadir objeto
  document.getElementById("addItemBtn").addEventListener("click", () => {
    const modal = new window.bootstrap.Modal(document.getElementById("itemModal"))
    document.getElementById("itemForm").reset()
    document.getElementById("itemModalLabel").textContent = "Añadir Objeto"
    document.getElementById("itemId").value = ""
    modal.show()
  })

  // Botón para guardar objeto
  document.getElementById("saveItemBtn").addEventListener("click", guardarObjeto)

  // Otros botones de acción
  document.getElementById("addEquipmentBtn").addEventListener("click", () => {
    alert("Funcionalidad en desarrollo")
  })

  document.getElementById("addResourceBtn").addEventListener("click", () => {
    alert("Funcionalidad en desarrollo")
  })

  document.getElementById("addBagBtn").addEventListener("click", () => {
    alert("Funcionalidad en desarrollo")
  })

  document.getElementById("addSpellBtn").addEventListener("click", () => {
    alert("Funcionalidad en desarrollo")
  })
}

// Función para guardar un objeto
function guardarObjeto() {
  try {
    const nombre = document.getElementById("itemName").value
    const tipo = document.getElementById("itemType").value
    const cantidad = Number.parseInt(document.getElementById("itemQuantity").value) || 1
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
      descripcion,
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
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("itemModal"))
    modal.hide()

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

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando ficha de personaje...")
  cargarFichaPersonaje()
})
