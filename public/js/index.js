// Función para generar un UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Variable para almacenar el ID del personaje a eliminar
let personajeAEliminarId = null

// Función para inicializar la página
function inicializarPagina() {
  console.log("Inicializando página...")

  // Cargar lista de personajes
  cargarListaPersonajes()

  // Configurar eventos para los botones principales
  const createBtn = document.getElementById("createCharacterBtn")
  if (createBtn) {
    createBtn.addEventListener("click", abrirModalCrearPersonaje)
    console.log("Event listener añadido al botón crear personaje")
  } else {
    console.error("No se encontró el botón createCharacterBtn")
  }

  const importBtn = document.getElementById("importCharacterBtn")
  if (importBtn) {
    importBtn.addEventListener("click", importarPersonaje)
    console.log("Event listener añadido al botón importar personaje")
  } else {
    console.error("No se encontró el botón importCharacterBtn")
  }

  // Configurar eventos para los modales
  const confirmCreateBtn = document.getElementById("confirmCreateBtn")
  if (confirmCreateBtn) {
    confirmCreateBtn.addEventListener("click", crearPersonaje)
    console.log("Event listener añadido al botón confirmar crear")
  } else {
    console.error("No se encontró el botón confirmCreateBtn")
  }

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", eliminarPersonaje)
    console.log("Event listener añadido al botón confirmar eliminar")
  } else {
    console.error("No se encontró el botón confirmDeleteBtn")
  }

  console.log("Eventos configurados correctamente")
}

// Función para abrir el modal de crear personaje
function abrirModalCrearPersonaje() {
  console.log("Abriendo modal de crear personaje...")

  try {
    // Resetear el formulario
    const form = document.getElementById("createCharacterForm")
    if (form) {
      form.reset()
      console.log("Formulario reseteado")
    }

    // Abrir el modal
    const modalElement = document.getElementById("createCharacterModal")
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement)
      modal.show()
      console.log("Modal abierto correctamente")
    } else {
      console.error("No se pudo abrir el modal - elemento o bootstrap no encontrado")
    }
  } catch (error) {
    console.error("Error al abrir el modal:", error)
  }
}

// Función para cargar la lista de personajes
function cargarListaPersonajes() {
  console.log("Cargando lista de personajes...")

  const contenedor = document.getElementById("characters-list")
  if (!contenedor) {
    console.error("No se encontró el contenedor characters-list")
    return
  }

  const personajesJSON = localStorage.getItem("personajes")

  if (!personajesJSON) {
    localStorage.setItem("personajes", JSON.stringify([]))
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <p class="mb-0">No hay personajes creados. Crea uno nuevo para comenzar.</p>
        </div>
      </div>
    `
    return
  }

  const personajes = JSON.parse(personajesJSON)

  if (personajes.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          <p class="mb-0">No hay personajes creados. Crea uno nuevo para comenzar.</p>
        </div>
      </div>
    `
    return
  }

  // Mostrar la lista de personajes
  let html = ""
  for (let i = 0; i < personajes.length; i++) {
    const personaje = personajes[i]
    html += `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">${personaje.nombre}</h5>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" onclick="seleccionarPersonaje('${personaje.id}')">Seleccionar</a></li>
                <li><a class="dropdown-item" href="#" onclick="exportarPersonaje('${personaje.id}')">Exportar</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="confirmarEliminarPersonaje('${personaje.id}')">Eliminar</a></li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-4 text-muted">Clase:</div>
              <div class="col-8">${personaje.clase || "-"}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted">Nivel:</div>
              <div class="col-8">${personaje.nivel || "1"}</div>
            </div>
            <div class="row mb-2">
              <div class="col-4 text-muted">Atributos:</div>
              <div class="col-8">
                <span class="badge bg-info me-1" title="Percepción">
                  <i class="bi bi-eye"></i> ${personaje.atributos?.percepcion || "0"}
                </span>
                <span class="badge bg-warning me-1" title="Destreza">
                  <i class="bi bi-hand"></i> ${personaje.atributos?.destreza || "0"}
                </span>
                <span class="badge bg-success me-1" title="Agilidad">
                  <i class="bi bi-lightning"></i> ${personaje.atributos?.agilidad || "0"}
                </span>
                <span class="badge bg-danger me-1" title="Inteligencia">
                  <i class="bi bi-brain"></i> ${personaje.atributos?.inteligencia || "0"}
                </span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="d-grid">
              <a href="ficha-personaje.html" class="btn btn-primary btn-sm" onclick="seleccionarPersonaje('${personaje.id}')">
                <i class="bi bi-person-badge"></i> Ver Ficha
              </a>
            </div>
          </div>
        </div>
      </div>
    `
  }
  contenedor.innerHTML = html
  console.log(`Cargados ${personajes.length} personajes`)
}

// Función para crear un nuevo personaje
function crearPersonaje() {
  console.log("=== INICIANDO CREACIÓN DE PERSONAJE ===")

  try {
    // Obtener valores del formulario
    const nombre = document.getElementById("newCharacterName")?.value?.trim()
    const clase = document.getElementById("newCharacterClass")?.value?.trim()
    const nivel = document.getElementById("newCharacterLevel")?.value

    console.log("Datos básicos:", { nombre, clase, nivel })

    if (!nombre) {
      alert("El nombre del personaje es obligatorio")
      return
    }

    // Obtener atributos básicos
    const percepcion = Number.parseInt(document.getElementById("newCharacterPerception")?.value) || 0
    const destreza = Number.parseInt(document.getElementById("newCharacterDexterity")?.value) || 0
    const agilidad = Number.parseInt(document.getElementById("newCharacterAgility")?.value) || 0
    const inteligencia = Number.parseInt(document.getElementById("newCharacterIntelligence")?.value) || 0

    console.log("Atributos básicos:", { percepcion, destreza, agilidad, inteligencia })

    // Obtener atributos de combate
    const combate = Number.parseInt(document.getElementById("newCharacterCombat")?.value) || 0
    const punteria = Number.parseInt(document.getElementById("newCharacterAim")?.value) || 0
    const magia = Number.parseInt(document.getElementById("newCharacterMagic")?.value) || 0

    console.log("Atributos de combate:", { combate, punteria, magia })

    // Obtener atributos vitales
    const vida = Number.parseInt(document.getElementById("newCharacterLife")?.value) || 10
    const aguante = Number.parseInt(document.getElementById("newCharacterStamina")?.value) || 10
    const mana = Number.parseInt(document.getElementById("newCharacterMana")?.value) || 10

    console.log("Atributos vitales:", { vida, aguante, mana })

    // Crear objeto de personaje
    const nuevoPersonaje = {
      id: generateUUID(),
      nombre,
      clase,
      nivel,
      atributos: {
        // Atributos básicos
        percepcion,
        destreza,
        agilidad,
        inteligencia,

        // Atributos derivados de percepción
        buscar: Math.floor(percepcion / 2),
        sigilo: Math.floor(percepcion / 2),
        observar: Math.floor(percepcion / 2),

        // Atributos derivados de destreza
        cerradura: Math.floor(destreza / 2),
        trampas: Math.floor(destreza / 2),
        manipularObjetos: Math.floor(destreza / 2),

        // Atributos derivados de agilidad
        acrobacia: Math.floor(agilidad / 2),
        desarmar: Math.floor(agilidad / 2),
        equitacion: Math.floor(agilidad / 2),

        // Atributos derivados de inteligencia
        elocuencia: Math.floor(inteligencia / 2),
        resolver: Math.floor(inteligencia / 2),

        // Atributos de combate
        combate,
        punteria,
        magia,

        // Atributos vitales
        vida,
        vidaActual: vida,
        aguante,
        aguanteActual: aguante,
        mana,
        manaActual: mana,
      },
      inventario: [],
      equipamiento: {
        armas: [],
        armaduras: [],
        municiones: [],
      },
      recursos: [],
      bolsasEspeciales: [],
      grimorio: [],
    }

    console.log("Personaje creado:", nuevoPersonaje)

    // Obtener la lista actual de personajes
    const personajesJSON = localStorage.getItem("personajes")
    const personajes = personajesJSON ? JSON.parse(personajesJSON) : []

    // Añadir el nuevo personaje
    personajes.push(nuevoPersonaje)

    // Guardar la lista actualizada
    localStorage.setItem("personajes", JSON.stringify(personajes))
    console.log("Lista de personajes guardada en localStorage")

    // Establecer como personaje actual
    localStorage.setItem("personajeActual", JSON.stringify(nuevoPersonaje))
    console.log("Personaje establecido como actual")

    // Cerrar el modal
    const modalElement = document.getElementById("createCharacterModal")
    if (modalElement && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalElement)
      if (modal) {
        modal.hide()
        console.log("Modal cerrado")
      }
    }

    // Actualizar la lista de personajes
    cargarListaPersonajes()

    // Mostrar mensaje de éxito
    alert("Personaje creado con éxito")
    console.log("=== PERSONAJE CREADO EXITOSAMENTE ===")
  } catch (error) {
    console.error("Error al crear personaje:", error)
    alert("Error al crear el personaje: " + error.message)
  }
}

// Función para seleccionar un personaje
function seleccionarPersonaje(id) {
  console.log("Seleccionando personaje:", id)
  const personajesJSON = localStorage.getItem("personajes")
  if (!personajesJSON) return

  const personajes = JSON.parse(personajesJSON)
  const personaje = personajes.find((p) => p.id === id)

  if (personaje) {
    localStorage.setItem("personajeActual", JSON.stringify(personaje))
    console.log("Personaje seleccionado:", personaje)
  }
}

// Función para confirmar la eliminación de un personaje
function confirmarEliminarPersonaje(id) {
  personajeAEliminarId = id
  const modal = new window.bootstrap.Modal(document.getElementById("deleteConfirmModal"))
  modal.show()
}

// Función para eliminar un personaje
function eliminarPersonaje() {
  if (!personajeAEliminarId) return

  const personajesJSON = localStorage.getItem("personajes")
  if (!personajesJSON) return

  const personajes = JSON.parse(personajesJSON)
  const nuevosPersonajes = personajes.filter((p) => p.id !== personajeAEliminarId)

  localStorage.setItem("personajes", JSON.stringify(nuevosPersonajes))

  // Si el personaje eliminado era el actual, eliminar también de personajeActual
  const personajeActualJSON = localStorage.getItem("personajeActual")
  if (personajeActualJSON) {
    const personajeActual = JSON.parse(personajeActualJSON)
    if (personajeActual.id === personajeAEliminarId) {
      localStorage.removeItem("personajeActual")
    }
  }

  // Cerrar el modal
  const modal = window.bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal"))
  modal.hide()

  // Actualizar la lista de personajes
  cargarListaPersonajes()

  // Mostrar mensaje de éxito
  alert("Personaje eliminado con éxito")

  // Resetear la variable
  personajeAEliminarId = null
}

// Función para exportar un personaje específico
function exportarPersonaje(id) {
  const personajesJSON = localStorage.getItem("personajes")
  if (!personajesJSON) return

  const personajes = JSON.parse(personajesJSON)
  const personaje = personajes.find((p) => p.id === id)

  if (!personaje) {
    alert("No se encontró el personaje")
    return
  }

  // Convertir el personaje a una cadena JSON
  const personajeJSON = JSON.stringify(personaje, null, 2)

  // Crear un blob con el contenido JSON
  const blob = new Blob([personajeJSON], { type: "application/json" })

  // Crear un enlace para descargar el archivo
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${personaje.nombre || "personaje"}.json`
  document.body.appendChild(a)
  a.click()

  // Limpiar
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

// Función para importar un personaje
function importarPersonaje() {
  console.log("Iniciando importación de personaje...")

  // Crear un input de tipo file
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"

  // Configurar el evento de cambio
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const personaje = JSON.parse(event.target.result)

        // Validar que el objeto tenga la estructura básica de un personaje
        if (!personaje.nombre) {
          throw new Error("El archivo no contiene un personaje válido")
        }

        // Asegurarse de que el personaje tenga un ID único
        personaje.id = personaje.id || generateUUID()

        // Obtener la lista actual de personajes
        const personajesJSON = localStorage.getItem("personajes")
        const personajes = personajesJSON ? JSON.parse(personajesJSON) : []

        // Comprobar si ya existe un personaje con el mismo ID
        const personajeExistente = personajes.findIndex((p) => p.id === personaje.id)

        if (personajeExistente !== -1) {
          // Reemplazar el personaje existente
          personajes[personajeExistente] = personaje
        } else {
          // Añadir el nuevo personaje
          personajes.push(personaje)
        }

        // Guardar la lista actualizada
        localStorage.setItem("personajes", JSON.stringify(personajes))

        // Establecer como personaje actual
        localStorage.setItem("personajeActual", JSON.stringify(personaje))

        // Actualizar la lista de personajes
        cargarListaPersonajes()

        // Mostrar mensaje de éxito
        alert("Personaje importado con éxito")
      } catch (error) {
        alert("Error al importar el personaje: " + error.message)
      }
    }
    reader.readAsText(file)
  }

  // Simular clic en el input
  input.click()
}

// Exponer funciones al ámbito global para poder usarlas en los onclick
window.seleccionarPersonaje = seleccionarPersonaje
window.confirmarEliminarPersonaje = confirmarEliminarPersonaje
window.exportarPersonaje = exportarPersonaje

// Inicializar la página cuando se carga
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado completamente")

  // Verificar que Bootstrap esté disponible
  if (typeof window.bootstrap === "undefined") {
    console.error("Bootstrap no está disponible")
    alert("Error: Bootstrap no está disponible. La aplicación podría no funcionar correctamente.")
  } else {
    console.log("Bootstrap está disponible")
  }

  // Inicializar la página
  inicializarPagina()
})
