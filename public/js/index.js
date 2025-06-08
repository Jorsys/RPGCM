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

      // Contenedores
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

    // Obtener la lista actual de personajes de forma segura
    const personajes = obtenerPersonajes()
    console.log("Lista actual de personajes:", personajes)
    console.log("¿Es array?", Array.isArray(personajes))

    // Añadir el nuevo personaje
    personajes.push(nuevoPersonaje)
    console.log("Personaje añadido a la lista. Nueva longitud:", personajes.length)

    // Guardar la lista actualizada
    const guardadoExitoso = guardarPersonajes(personajes)
    if (!guardadoExitoso) {
      throw new Error("No se pudo guardar la lista de personajes")
    }

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

// Declaración de las funciones necesarias
function generateUUID() {
  // Implementación de generateUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function obtenerPersonajes() {
  // Implementación de obtenerPersonajes
  const personajesJSON = localStorage.getItem("personajes")
  return personajesJSON ? JSON.parse(personajesJSON) : []
}

function guardarPersonajes(personajes) {
  // Implementación de guardarPersonajes
  try {
    localStorage.setItem("personajes", JSON.stringify(personajes))
    return true
  } catch (error) {
    console.error("Error al guardar personajes:", error)
    return false
  }
}

function cargarListaPersonajes() {
  // Implementación de cargarListaPersonajes
  const personajes = obtenerPersonajes()
  const personajesList = document.getElementById("personajesList")
  personajesList.innerHTML = ""
  personajes.forEach((personaje) => {
    const listItem = document.createElement("li")
    listItem.textContent = personaje.nombre
    personajesList.appendChild(listItem)
  })
}
