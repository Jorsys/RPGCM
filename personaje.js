document.addEventListener("DOMContentLoaded", () => {
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
  }

  // Mostrar/ocultar campos de raza personalizada
  if (customRaceBtn) {
    customRaceBtn.onclick = () => {
      if (customRaceFields) {
        customRaceFields.classList.toggle("hidden")
      }
    }
  }

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
        vida: Number.parseInt(document.getElementById("vida").value),
        aguante: Number.parseInt(document.getElementById("aguante").value),
        mana: Number.parseInt(document.getElementById("mana").value),
        // Nuevas habilidades
        percepcion: 0,
        busqueda: 0,
        rastreo: 0,
        vigilancia: 0,
        destreza: 0,
        artesania: 0,
        trampas: 0,
        sigilo: 0,
        agilidad: 0,
        acrobacias: 0,
        reflejos: 0,
        esquivar: 0,
        inteligencia: 0,
        conocimiento: 0,
        medicina: 0,
        supervivencia: 0,
        // Resto de propiedades
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
        <button class="btn view-character" data-name="${personaje.nombre}">Ver Ficha</button>
        <i class="fas fa-trash action-icon delete-icon" data-name="${personaje.nombre}" title="Eliminar"></i>
      </div>
    `
      personajesList.appendChild(personajeItem)
    })

    // Agregar event listeners a los botones de ver ficha
    document.querySelectorAll(".view-character").forEach((button) => {
      button.addEventListener("click", function () {
        const characterName = this.getAttribute("data-name")
        window.location.href = `ficha-personaje.html?nombre=${encodeURIComponent(characterName)}`
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
