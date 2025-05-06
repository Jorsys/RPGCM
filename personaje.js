document.addEventListener("DOMContentLoaded", () => {
  // Importar módulo para configurar atributos derivados en creación
  import("./js/modules/editar-personaje.js")
    .then((module) => {
      // Configurar atributos derivados en el modal de creación
      module.configurarAtributosDerivedosEnCreacion()
      // Configurar cierre del modal de edición
      module.configurarCierreModalEdicion()
    })
    .catch((error) => {
      console.error("Error al cargar el módulo de editar-personaje:", error)
    })

  // Elementos del DOM
  const personajesList = document.getElementById("personajesList")
  const newCharacterBtn = document.getElementById("newCharacterBtn")
  const createCharacterModal = document.getElementById("createCharacterModal")
  const closeModalBtn = document.querySelector(".close")
  const characterForm = document.getElementById("characterForm")
  const razaSelect = document.getElementById("raza")
  const customRaceBtn = document.getElementById("customRaceBtn")
  const customRaceFields = document.getElementById("customRaceFields")
  const backToLoginBtn = document.getElementById("backToLoginBtn")
  const confirmModal = document.getElementById("confirmModal")
  const closeConfirmModal = document.getElementById("closeConfirmModal")
  const confirmYesBtn = document.getElementById("confirmYesBtn")
  const confirmNoBtn = document.getElementById("confirmNoBtn")
  const confirmMessage = document.getElementById("confirmMessage")
  const editCharacterModal = document.getElementById("editCharacterModal")
  const closeEditCharacterModal = document.getElementById("closeEditCharacterModal")

  console.log("DOM cargado correctamente")
  console.log("newCharacterBtn:", newCharacterBtn)
  console.log("createCharacterModal:", createCharacterModal)

  // Variables para la confirmación
  let confirmCallback = null

  // Cargar personajes existentes
  loadCharacters()

  // Cargar razas predefinidas
  loadRaces()

  // Botón para volver a la página de inicio
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }

  // Configurar modal de confirmación
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

  // Configurar modal de edición
  if (closeEditCharacterModal) {
    closeEditCharacterModal.addEventListener("click", () => {
      editCharacterModal.classList.remove("show-modal")
    })
  }

  // Función para mostrar confirmación
  function showConfirmation(message, callback) {
    confirmMessage.textContent = message
    confirmCallback = callback
    confirmModal.classList.add("show-modal")
  }

  // NUEVO: Implementación directa del evento click para el botón de nuevo personaje
  if (newCharacterBtn) {
    console.log("Añadiendo event listener al botón de nuevo personaje")
    newCharacterBtn.onclick = () => {
      console.log("Botón de nuevo personaje clickeado")
      if (createCharacterModal) {
        createCharacterModal.classList.add("show-modal")
      } else {
        console.error("Modal no encontrado")
      }
    }
  } else {
    console.error("Botón de nuevo personaje no encontrado")
  }

  // NUEVO: Implementación directa del evento click para el botón de cerrar
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      console.log("Botón de cerrar clickeado")
      if (createCharacterModal) {
        createCharacterModal.classList.remove("show-modal")
      }
    }
  }

  // NUEVO: Cerrar modal al hacer clic fuera de él
  window.onclick = (event) => {
    if (event.target === createCharacterModal) {
      console.log("Clic fuera del modal")
      createCharacterModal.classList.remove("show-modal")
    }
    if (event.target === confirmModal) {
      confirmModal.classList.remove("show-modal")
    }
    if (event.target === editCharacterModal) {
      editCharacterModal.classList.remove("show-modal")
    }
  }

  // Mostrar/ocultar campos de raza personalizada
  if (customRaceBtn) {
    customRaceBtn.onclick = () => {
      if (customRaceFields) {
        customRaceFields.classList.toggle("hidden")
      }
    }
  }

  // Escuchar evento de personaje editado
  document.addEventListener("personajeEditado", () => {
    loadCharacters()
  })

  // Manejar envío del formulario de creación de personaje
  if (characterForm) {
    characterForm.onsubmit = (e) => {
      e.preventDefault()
      console.log("Formulario enviado")

      // Obtener valores del formulario
      const nombre = document.getElementById("nombre").value
      let raza = razaSelect.value
      let brazos = 2 // Valor por defecto

      // Verificar si se está creando una raza personalizada
      if (!customRaceFields.classList.contains("hidden")) {
        const customRaceName = document.getElementById("customRaceName").value
        if (customRaceName) {
          raza = customRaceName
          brazos = Number.parseInt(document.getElementById("brazos").value)

          // Guardar la nueva raza personalizada
          saveCustomRace(customRaceName, brazos)
        }
      } else {
        // Obtener el número de brazos de la raza seleccionada
        const selectedOption = razaSelect.options[razaSelect.selectedIndex]
        brazos = Number.parseInt(selectedOption.dataset.brazos)
      }

      // Obtener valores de subatributos
      const buscar = Number.parseInt(document.getElementById("buscar")?.value) || 0
      const sigilo = Number.parseInt(document.getElementById("sigilo")?.value) || 0
      const observar = Number.parseInt(document.getElementById("observar")?.value) || 0
      const cerradura = Number.parseInt(document.getElementById("cerradura")?.value) || 0
      const trampas = Number.parseInt(document.getElementById("trampas")?.value) || 0
      const manipularObjetos = Number.parseInt(document.getElementById("manipularObjetos")?.value) || 0
      const acrobacia = Number.parseInt(document.getElementById("acrobacia")?.value) || 0
      const desarmar = Number.parseInt(document.getElementById("desarmar")?.value) || 0
      const equitacion = Number.parseInt(document.getElementById("equitacion")?.value) || 0
      const elocuencia = Number.parseInt(document.getElementById("elocuencia")?.value) || 0
      const resolver = Number.parseInt(document.getElementById("resolver")?.value) || 0

      // Calcular atributos derivados
      const percepcion = buscar + sigilo + observar
      const destreza = cerradura + trampas + manipularObjetos
      const agilidad = acrobacia + desarmar + equitacion
      const inteligencia = elocuencia + resolver

      // Obtener valores máximos de vida, aguante y maná
      const vidaMax = Number.parseInt(document.getElementById("vida").value) || 10
      const aguanteMax = Number.parseInt(document.getElementById("aguante").value) || 10
      const manaMax = Number.parseInt(document.getElementById("mana").value) || 10

      // Crear objeto de personaje con la nueva estructura
      const personaje = {
        nombre: nombre,
        raza: raza,
        brazos: brazos,
        nivel: Number.parseInt(document.getElementById("nivel").value),
        clase: document.getElementById("clase").value,
        combateCuerpo: Number.parseInt(document.getElementById("combateCuerpo").value),
        combateDistancia: Number.parseInt(document.getElementById("combateDistancia").value),
        lanzamientoHechizos: Number.parseInt(document.getElementById("lanzamientoHechizos").value),
        // Valores máximos
        vidaMax: vidaMax,
        aguanteMax: aguanteMax,
        manaMax: manaMax,
        // Valores actuales (inicialmente iguales a los máximos)
        vida: vidaMax,
        aguante: aguanteMax,
        mana: manaMax,
        inventario: {
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
        },
        grimorio: [],
        equipados: [],
        bolsasEspeciales: [],
        atributosDerivedos: {
          percepcion: percepcion,
          destreza: destreza,
          agilidad: agilidad,
          inteligencia: inteligencia,
        },
        subatributos: {
          buscar: buscar,
          sigilo: sigilo,
          observar: observar,
          cerradura: cerradura,
          trampas: trampas,
          manipularObjetos: manipularObjetos,
          acrobacia: acrobacia,
          desarmar: desarmar,
          equitacion: equitacion,
          elocuencia: elocuencia,
          resolver: resolver,
        },
      }

      // Verificar si ya existe un personaje con ese nombre
      const personajesData = JSON.parse(localStorage.getItem("personajes"))
      const existingCharacter = personajesData.personajes.find((p) => p.nombre === nombre)

      if (existingCharacter) {
        alert("Ya existe un personaje con ese nombre. Por favor, elige otro nombre.")
        return
      }

      // Guardar personaje en la lista de personajes
      personajesData.personajes.push({
        nombre: personaje.nombre,
        raza: personaje.raza,
        nivel: personaje.nivel,
      })
      localStorage.setItem("personajes", JSON.stringify(personajesData))

      // Guardar datos completos del personaje en su propio archivo
      localStorage.setItem(personaje.nombre + ".json", JSON.stringify(personaje))

      // Cerrar modal y recargar lista de personajes
      createCharacterModal.classList.remove("show-modal")
      loadCharacters()

      // Limpiar formulario
      characterForm.reset()
      console.log("Personaje creado con éxito")
    }
  }

  // Función para cargar personajes
  function loadCharacters() {
    let personajesData = localStorage.getItem("personajes")
    console.log("Datos cargados de localStorage:", personajesData)

    // Verificar si los datos existen y son válidos
    let personajes = []

    try {
      if (!personajesData) {
        console.log("No hay datos de personajes, creando estructura inicial")
        personajesData = JSON.stringify({ personajes: [] })
        localStorage.setItem("personajes", personajesData)
      }

      const parsedData = JSON.parse(personajesData)

      // Verificar que la estructura es correcta
      if (!parsedData || !parsedData.personajes) {
        console.log("Estructura de datos incorrecta, reinicializando")
        personajesData = JSON.stringify({ personajes: [] })
        localStorage.setItem("personajes", personajesData)
        personajes = []
      } else {
        personajes = parsedData.personajes
      }
    } catch (error) {
      console.error("Error al parsear los datos:", error)
      // Si hay un error, reinicializar los datos
      personajesData = JSON.stringify({ personajes: [] })
      localStorage.setItem("personajes", personajesData)
      personajes = []
    }

    console.log("Personajes cargados:", personajes)

    personajesList.innerHTML = ""
    if (!personajes || personajes.length === 0) {
      personajesList.innerHTML = "<p>No hay personajes creados.</p>"
      return
    }

    personajes.forEach((personaje) => {
      const personajeItem = document.createElement("div")
      personajeItem.className = "personaje-item"
      personajeItem.innerHTML = `
      <div>
        <strong>${personaje.nombre}</strong> - ${personaje.raza}, Nivel ${personaje.nivel}
      </div>
      <div class="personaje-actions">
        <i class="fas fa-eye action-icon view-character" data-name="${personaje.nombre}" title="Ver Ficha"></i>
        <i class="fas fa-edit action-icon edit-character" data-name="${personaje.nombre}" title="Editar Personaje"></i>
        <i class="fas fa-trash action-icon delete-icon" data-name="${personaje.nombre}" title="Eliminar"></i>
      </div>
    `
      personajesList.appendChild(personajeItem)
    })

    // Agregar event listeners a los iconos de ver ficha
    document.querySelectorAll(".view-character").forEach((icon) => {
      icon.addEventListener("click", function () {
        const characterName = this.getAttribute("data-name")
        window.location.href = `ficha-personaje.html?nombre=${encodeURIComponent(characterName)}`
      })
    })

    // Agregar event listeners a los iconos de editar
    document.querySelectorAll(".edit-character").forEach((icon) => {
      icon.addEventListener("click", function () {
        const characterName = this.getAttribute("data-name")
        // Importar el módulo de editar personaje y mostrar el modal
        import("./js/modules/editar-personaje.js")
          .then((module) => {
            module.mostrarModalEditarPersonajeDesdeListado(characterName)
          })
          .catch((error) => {
            console.error("Error al cargar el módulo de editar-personaje:", error)
          })
      })
    })

    // Agregar event listeners a los iconos de eliminar
    document.querySelectorAll(".delete-icon").forEach((icon) => {
      icon.addEventListener("click", function () {
        const characterName = this.getAttribute("data-name")
        showConfirmation(`¿Estás seguro de que deseas eliminar al personaje "${characterName}"?`, () => {
          deleteCharacter(characterName)
        })
      })
    })
  }

  // Función para eliminar un personaje
  function deleteCharacter(characterName) {
    // Eliminar de la lista de personajes
    const personajesData = JSON.parse(localStorage.getItem("personajes"))
    personajesData.personajes = personajesData.personajes.filter((p) => p.nombre !== characterName)
    localStorage.setItem("personajes", JSON.stringify(personajesData))

    // Eliminar archivo del personaje
    localStorage.removeItem(characterName + ".json")

    // Recargar lista de personajes
    loadCharacters()
  }

  // Función para cargar razas
  function loadRaces() {
    let razasData = localStorage.getItem("razas")
    if (!razasData) {
      // Crear razas predefinidas por defecto
      const defaultRazas = {
        predefinidas: [
          { nombre: "Humano", brazos: 2 },
          { nombre: "Elfo", brazos: 2 },
          { nombre: "Enano", brazos: 2 },
          { nombre: "Orco", brazos: 2 },
        ],
        personalizadas: [],
      }
      razasData = JSON.stringify(defaultRazas)
      localStorage.setItem("razas", razasData)
    }

    const razas = JSON.parse(razasData)

    // Limpiar select
    razaSelect.innerHTML = ""

    // Agregar razas predefinidas
    const predefinidaOptgroup = document.createElement("optgroup")
    predefinidaOptgroup.label = "Razas Predefinidas"
    razas.predefinidas.forEach((raza) => {
      const option = document.createElement("option")
      option.value = raza.nombre
      option.textContent = raza.nombre
      option.dataset.tipo = "predefinida"
      option.dataset.brazos = raza.brazos
      predefinidaOptgroup.appendChild(option)
    })
    razaSelect.appendChild(predefinidaOptgroup)

    // Agregar razas personalizadas si existen
    if (razas.personalizadas.length > 0) {
      const personalizadaOptgroup = document.createElement("optgroup")
      personalizadaOptgroup.label = "Razas Personalizadas"
      razas.personalizadas.forEach((raza) => {
        const option = document.createElement("option")
        option.value = raza.nombre
        option.textContent = raza.nombre
        option.dataset.tipo = "personalizada"
        option.dataset.brazos = raza.brazos
        personalizadaOptgroup.appendChild(option)
      })
      razaSelect.appendChild(personalizadaOptgroup)
    }
  }

  // Función para guardar una raza personalizada
  function saveCustomRace(nombre, brazos) {
    const razasData = JSON.parse(localStorage.getItem("razas"))

    // Verificar si ya existe una raza con ese nombre
    const existingRace = [...razasData.predefinidas, ...razasData.personalizadas].find((r) => r.nombre === nombre)

    if (!existingRace) {
      razasData.personalizadas.push({
        nombre: nombre,
        brazos: brazos,
      })

      localStorage.setItem("razas", JSON.stringify(razasData))

      // Recargar lista de razas
      loadRaces()
    }
  }
})
