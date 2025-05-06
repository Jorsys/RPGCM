// Módulo para editar los valores básicos del personaje

import { guardarPersonaje } from "./personaje.js"

// Función para configurar el botón de editar personaje
export function configurarBotonEditarPersonaje(personaje) {
  // Esta función ya no se usa en ficha-personaje.js
  // Se mantiene por compatibilidad
}

// Función para mostrar el modal de editar personaje desde la lista de personajes
export function mostrarModalEditarPersonajeDesdeListado(personajeName) {
  // Cargar datos del personaje
  const characterData = localStorage.getItem(personajeName + ".json")
  if (!characterData) {
    alert("No se encontró el personaje especificado.")
    return
  }

  const personaje = JSON.parse(characterData)

  // Asegurar que existen todas las propiedades necesarias
  if (!personaje.subatributos) {
    personaje.subatributos = {
      buscar: 0,
      sigilo: 0,
      observar: 0,
      cerradura: 0,
      trampas: 0,
      manipularObjetos: 0,
      acrobacia: 0,
      desarmar: 0,
      equitacion: 0,
      elocuencia: 0,
      resolver: 0,
    }
  }

  // Obtener el modal de edición
  const editCharacterModal = document.getElementById("editCharacterModal")
  const editCharacterForm = document.getElementById("editCharacterForm")

  if (!editCharacterModal || !editCharacterForm) {
    console.error("No se encontró el modal o el formulario de edición")
    return
  }

  // Generar el contenido del formulario
  editCharacterForm.innerHTML = `
    <div class="form-group">
      <label for="editNombre">Nombre:</label>
      <input type="text" id="editNombre" value="${personaje.nombre}" readonly>
    </div>
    <div class="form-group">
      <label for="editRaza">Raza:</label>
      <input type="text" id="editRaza" value="${personaje.raza}">
    </div>
    <div class="form-group">
      <label for="editBrazos">Número de manos:</label>
      <input type="number" id="editBrazos" min="0" value="${personaje.brazos || 2}">
    </div>
    <div class="form-group">
      <label for="editNivel">Nivel:</label>
      <input type="number" id="editNivel" min="1" value="${personaje.nivel}">
    </div>
    <div class="form-group">
      <label for="editClase">Clase:</label>
      <input type="text" id="editClase" value="${personaje.clase}">
    </div>
    <div class="form-group">
      <label for="editCombateCuerpo">Combate cuerpo a cuerpo:</label>
      <input type="number" id="editCombateCuerpo" min="0" value="${personaje.combateCuerpo}">
    </div>
    <div class="form-group">
      <label for="editCombateDistancia">Combate a distancia:</label>
      <input type="number" id="editCombateDistancia" min="0" value="${personaje.combateDistancia}">
    </div>
    <div class="form-group">
      <label for="editLanzamientoHechizos">Lanzamiento de hechizos:</label>
      <input type="number" id="editLanzamientoHechizos" min="0" value="${personaje.lanzamientoHechizos}">
    </div>
    <div class="form-group">
      <label for="editVidaMax">Vida máxima:</label>
      <input type="number" id="editVidaMax" min="1" value="${personaje.vidaMax || personaje.vida || 10}">
    </div>
    <div class="form-group">
      <label for="editAguanteMax">Aguante máximo:</label>
      <input type="number" id="editAguanteMax" min="0" value="${personaje.aguanteMax || personaje.aguante || 10}">
    </div>
    <div class="form-group">
      <label for="editManaMax">Maná máximo:</label>
      <input type="number" id="editManaMax" min="0" value="${personaje.manaMax || personaje.mana || 10}">
    </div>
    
    <h3>Percepción</h3>
    <div class="form-group">
      <label for="editBuscar">Buscar:</label>
      <input type="number" id="editBuscar" min="0" value="${personaje.subatributos.buscar || 0}">
    </div>
    <div class="form-group">
      <label for="editSigilo">Sigilo:</label>
      <input type="number" id="editSigilo" min="0" value="${personaje.subatributos.sigilo || 0}">
    </div>
    <div class="form-group">
      <label for="editObservar">Observar:</label>
      <input type="number" id="editObservar" min="0" value="${personaje.subatributos.observar || 0}">
    </div>
    
    <h3>Destreza</h3>
    <div class="form-group">
      <label for="editCerradura">Cerradura:</label>
      <input type="number" id="editCerradura" min="0" value="${personaje.subatributos.cerradura || 0}">
    </div>
    <div class="form-group">
      <label for="editTrampas">Trampas:</label>
      <input type="number" id="editTrampas" min="0" value="${personaje.subatributos.trampas || 0}">
    </div>
    <div class="form-group">
      <label for="editManipularObjetos">Manipular objetos:</label>
      <input type="number" id="editManipularObjetos" min="0" value="${personaje.subatributos.manipularObjetos || 0}">
    </div>
    
    <h3>Agilidad</h3>
    <div class="form-group">
      <label for="editAcrobacia">Acrobacia:</label>
      <input type="number" id="editAcrobacia" min="0" value="${personaje.subatributos.acrobacia || 0}">
    </div>
    <div class="form-group">
      <label for="editDesarmar">Desarmar:</label>
      <input type="number" id="editDesarmar" min="0" value="${personaje.subatributos.desarmar || 0}">
    </div>
    <div class="form-group">
      <label for="editEquitacion">Equitación:</label>
      <input type="number" id="editEquitacion" min="0" value="${personaje.subatributos.equitacion || 0}">
    </div>
    
    <h3>Inteligencia</h3>
    <div class="form-group">
      <label for="editElocuencia">Elocuencia:</label>
      <input type="number" id="editElocuencia" min="0" value="${personaje.subatributos.elocuencia || 0}">
    </div>
    <div class="form-group">
      <label for="editResolver">Resolver:</label>
      <input type="number" id="editResolver" min="0" value="${personaje.subatributos.resolver || 0}">
    </div>
    
    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
  `

  // Configurar el evento de envío del formulario
  editCharacterForm.onsubmit = (e) => {
    e.preventDefault()

    // Actualizar datos del personaje
    personaje.raza = document.getElementById("editRaza").value
    personaje.brazos = Number.parseInt(document.getElementById("editBrazos").value) || 2
    personaje.nivel = Number.parseInt(document.getElementById("editNivel").value) || 1
    personaje.clase = document.getElementById("editClase").value
    personaje.combateCuerpo = Number.parseInt(document.getElementById("editCombateCuerpo").value) || 0
    personaje.combateDistancia = Number.parseInt(document.getElementById("editCombateDistancia").value) || 0
    personaje.lanzamientoHechizos = Number.parseInt(document.getElementById("editLanzamientoHechizos").value) || 0

    // Actualizar valores máximos
    personaje.vidaMax = Number.parseInt(document.getElementById("editVidaMax").value) || 10
    personaje.aguanteMax = Number.parseInt(document.getElementById("editAguanteMax").value) || 10
    personaje.manaMax = Number.parseInt(document.getElementById("editManaMax").value) || 10

    // Asegurar que los valores actuales no superen los máximos
    if (personaje.vida > personaje.vidaMax) personaje.vida = personaje.vidaMax
    if (personaje.aguante > personaje.aguanteMax) personaje.aguante = personaje.aguanteMax
    if (personaje.mana > personaje.manaMax) personaje.mana = personaje.manaMax

    // Actualizar subatributos
    personaje.subatributos.buscar = Number.parseInt(document.getElementById("editBuscar").value) || 0
    personaje.subatributos.sigilo = Number.parseInt(document.getElementById("editSigilo").value) || 0
    personaje.subatributos.observar = Number.parseInt(document.getElementById("editObservar").value) || 0
    personaje.subatributos.cerradura = Number.parseInt(document.getElementById("editCerradura").value) || 0
    personaje.subatributos.trampas = Number.parseInt(document.getElementById("editTrampas").value) || 0
    personaje.subatributos.manipularObjetos =
      Number.parseInt(document.getElementById("editManipularObjetos").value) || 0
    personaje.subatributos.acrobacia = Number.parseInt(document.getElementById("editAcrobacia").value) || 0
    personaje.subatributos.desarmar = Number.parseInt(document.getElementById("editDesarmar").value) || 0
    personaje.subatributos.equitacion = Number.parseInt(document.getElementById("editEquitacion").value) || 0
    personaje.subatributos.elocuencia = Number.parseInt(document.getElementById("editElocuencia").value) || 0
    personaje.subatributos.resolver = Number.parseInt(document.getElementById("editResolver").value) || 0

    // Calcular atributos derivados
    personaje.atributosDerivedos = {
      percepcion: personaje.subatributos.buscar + personaje.subatributos.sigilo + personaje.subatributos.observar,
      destreza:
        personaje.subatributos.cerradura + personaje.subatributos.trampas + personaje.subatributos.manipularObjetos,
      agilidad: personaje.subatributos.acrobacia + personaje.subatributos.desarmar + personaje.subatributos.equitacion,
      inteligencia: personaje.subatributos.elocuencia + personaje.subatributos.resolver,
    }

    // Guardar cambios
    localStorage.setItem(personaje.nombre + ".json", JSON.stringify(personaje))

    // Actualizar la lista de personajes (por si cambió el nivel)
    const personajesData = JSON.parse(localStorage.getItem("personajes"))
    const personajeIndex = personajesData.personajes.findIndex((p) => p.nombre === personaje.nombre)
    if (personajeIndex !== -1) {
      personajesData.personajes[personajeIndex].nivel = personaje.nivel
      localStorage.setItem("personajes", JSON.stringify(personajesData))
    }

    // Cerrar modal y recargar lista
    editCharacterModal.classList.remove("show-modal")

    // Recargar la lista de personajes
    const event = new Event("personajeEditado")
    document.dispatchEvent(event)

    alert("Personaje actualizado correctamente")
  }

  // Mostrar el modal
  editCharacterModal.classList.add("show-modal")
}

// Función para mostrar el modal de editar personaje
export function mostrarModalEditarPersonaje(personaje) {
  // Crear modal si no existe
  let editCharacterModal = document.getElementById("editCharacterModal")

  if (!editCharacterModal) {
    editCharacterModal = document.createElement("div")
    editCharacterModal.id = "editCharacterModal"
    editCharacterModal.className = "modal"

    const modalContent = document.createElement("div")
    modalContent.className = "modal-content"

    modalContent.innerHTML = `
      <span class="close" id="closeEditCharacterModal">&times;</span>
      <h2>Editar Personaje</h2>
      <form id="editCharacterForm">
        <div class="form-group">
          <label for="editNombre">Nombre:</label>
          <input type="text" id="editNombre" value="${personaje.nombre}" readonly>
        </div>
        <div class="form-group">
          <label for="editRaza">Raza:</label>
          <input type="text" id="editRaza" value="${personaje.raza}">
        </div>
        <div class="form-group">
          <label for="editNivel">Nivel:</label>
          <input type="number" id="editNivel" min="1" value="${personaje.nivel}">
        </div>
        <div class="form-group">
          <label for="editClase">Clase:</label>
          <input type="text" id="editClase" value="${personaje.clase}">
        </div>
        <div class="form-group">
          <label for="editCombateCuerpo">Combate cuerpo a cuerpo:</label>
          <input type="number" id="editCombateCuerpo" min="0" value="${personaje.combateCuerpo}">
        </div>
        <div class="form-group">
          <label for="editCombateDistancia">Combate a distancia:</label>
          <input type="number" id="editCombateDistancia" min="0" value="${personaje.combateDistancia}">
        </div>
        <div class="form-group">
          <label for="editLanzamientoHechizos">Lanzamiento de hechizos:</label>
          <input type="number" id="editLanzamientoHechizos" min="0" value="${personaje.lanzamientoHechizos}">
        </div>
        <div class="form-group">
          <label for="editVidaMax">Vida máxima:</label>
          <input type="number" id="editVidaMax" min="1" value="${personaje.vidaMax || personaje.vida}">
        </div>
        <div class="form-group">
          <label for="editAguanteMax">Aguante máximo:</label>
          <input type="number" id="editAguanteMax" min="0" value="${personaje.aguanteMax || personaje.aguante}">
        </div>
        <div class="form-group">
          <label for="editManaMax">Maná máximo:</label>
          <input type="number" id="editManaMax" min="0" value="${personaje.manaMax || personaje.mana}">
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
      </form>
    `

    editCharacterModal.appendChild(modalContent)
    document.body.appendChild(editCharacterModal)

    // Configurar cierre del modal
    const closeEditCharacterModal = document.getElementById("closeEditCharacterModal")
    if (closeEditCharacterModal) {
      closeEditCharacterModal.addEventListener("click", () => {
        editCharacterModal.classList.remove("show-modal")
      })
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === editCharacterModal) {
        editCharacterModal.classList.remove("show-modal")
      }
    })

    // Configurar envío del formulario
    const editCharacterForm = document.getElementById("editCharacterForm")
    if (editCharacterForm) {
      editCharacterForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Actualizar datos del personaje
        personaje.raza = document.getElementById("editRaza").value
        personaje.nivel = Number.parseInt(document.getElementById("editNivel").value) || 1
        personaje.clase = document.getElementById("editClase").value
        personaje.combateCuerpo = Number.parseInt(document.getElementById("editCombateCuerpo").value) || 0
        personaje.combateDistancia = Number.parseInt(document.getElementById("editCombateDistancia").value) || 0
        personaje.lanzamientoHechizos = Number.parseInt(document.getElementById("editLanzamientoHechizos").value) || 0

        // Actualizar valores máximos
        const vidaMaxAnterior = personaje.vidaMax || personaje.vida
        const aguanteMaxAnterior = personaje.aguanteMax || personaje.aguante
        const manaMaxAnterior = personaje.manaMax || personaje.mana

        personaje.vidaMax = Number.parseInt(document.getElementById("editVidaMax").value) || 1
        personaje.aguanteMax = Number.parseInt(document.getElementById("editAguanteMax").value) || 0
        personaje.manaMax = Number.parseInt(document.getElementById("editManaMax").value) || 0

        // Ajustar valores actuales si los máximos cambiaron
        if (personaje.vidaMax !== vidaMaxAnterior) {
          // Si el máximo aumentó, aumentar el actual proporcionalmente
          if (personaje.vidaMax > vidaMaxAnterior) {
            personaje.vida = Math.round((personaje.vida / vidaMaxAnterior) * personaje.vidaMax)
          }
          // Si el máximo disminuyó, asegurar que el actual no lo supere
          else if (personaje.vida > personaje.vidaMax) {
            personaje.vida = personaje.vidaMax
          }
        }

        if (personaje.aguanteMax !== aguanteMaxAnterior) {
          if (personaje.aguanteMax > aguanteMaxAnterior) {
            personaje.aguante = Math.round((personaje.aguante / aguanteMaxAnterior) * personaje.aguanteMax)
          } else if (personaje.aguante > personaje.aguanteMax) {
            personaje.aguante = personaje.aguanteMax
          }
        }

        if (personaje.manaMax !== manaMaxAnterior) {
          if (personaje.manaMax > manaMaxAnterior) {
            personaje.mana = Math.round((personaje.mana / manaMaxAnterior) * personaje.manaMax)
          } else if (personaje.mana > personaje.manaMax) {
            personaje.mana = personaje.manaMax
          }
        }

        // Guardar cambios
        guardarPersonaje(personaje)

        // Actualizar interfaz
        document.getElementById("raza").value = personaje.raza
        document.getElementById("nivel").value = personaje.nivel
        document.getElementById("clase").value = personaje.clase
        document.getElementById("combateCuerpo").value = personaje.combateCuerpo
        document.getElementById("combateDistancia").value = personaje.combateDistancia
        document.getElementById("lanzamientoHechizos").value = personaje.lanzamientoHechizos
        document.getElementById("vida").value = personaje.vida
        document.getElementById("vidaMax").value = personaje.vidaMax
        document.getElementById("aguante").value = personaje.aguante
        document.getElementById("aguanteMax").value = personaje.aguanteMax
        document.getElementById("mana").value = personaje.mana
        document.getElementById("manaMax").value = personaje.manaMax

        // Recalcular atributos derivados
        const event = new CustomEvent("recalcularAtributos")
        document.dispatchEvent(event)

        // Cerrar modal
        editCharacterModal.classList.remove("show-modal")
      })
    }
  }

  // Mostrar modal
  editCharacterModal.classList.add("show-modal")
}

// Función para añadir atributos derivados al modal de creación de personaje
export function configurarAtributosDerivedosEnCreacion() {
  // Esta función se llamará desde personaje.js para añadir los campos de atributos derivados
  // al modal de creación de personaje
  const characterForm = document.getElementById("characterForm")

  if (characterForm) {
    // Buscar el último elemento del formulario (el botón de submit)
    const submitButton = characterForm.querySelector("button[type='submit']")

    if (submitButton) {
      // Crear contenedor para atributos derivados
      const derivedAttributesContainer = document.createElement("div")

      // Añadir subatributos para Percepción
      derivedAttributesContainer.innerHTML = `
        <h3>Percepción</h3>
        <div class="form-group">
          <label for="buscar">Buscar:</label>
          <input type="number" id="buscar" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="sigilo">Sigilo:</label>
          <input type="number" id="sigilo" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="observar">Observar:</label>
          <input type="number" id="observar" min="0" value="0">
        </div>
        
        <h3>Destreza</h3>
        <div class="form-group">
          <label for="cerradura">Cerradura:</label>
          <input type="number" id="cerradura" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="trampas">Trampas:</label>
          <input type="number" id="trampas" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="manipularObjetos">Manipular objetos:</label>
          <input type="number" id="manipularObjetos" min="0" value="0">
        </div>
        
        <h3>Agilidad</h3>
        <div class="form-group">
          <label for="acrobacia">Acrobacia:</label>
          <input type="number" id="acrobacia" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="desarmar">Desarmar:</label>
          <input type="number" id="desarmar" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="equitacion">Equitación:</label>
          <input type="number" id="equitacion" min="0" value="0">
        </div>
        
        <h3>Inteligencia</h3>
        <div class="form-group">
          <label for="elocuencia">Elocuencia:</label>
          <input type="number" id="elocuencia" min="0" value="0">
        </div>
        <div class="form-group">
          <label for="resolver">Resolver:</label>
          <input type="number" id="resolver" min="0" value="0">
        </div>
      `

      // Insertar antes del botón de submit
      characterForm.insertBefore(derivedAttributesContainer, submitButton)
    }
  }
}

// Función para configurar el cierre del modal de edición
export function configurarCierreModalEdicion() {
  const closeEditCharacterModal = document.getElementById("closeEditCharacterModal")
  const editCharacterModal = document.getElementById("editCharacterModal")

  if (closeEditCharacterModal && editCharacterModal) {
    closeEditCharacterModal.addEventListener("click", () => {
      editCharacterModal.classList.remove("show-modal")
    })

    // También cerrar al hacer clic fuera del modal
    window.addEventListener("click", (event) => {
      if (event.target === editCharacterModal) {
        editCharacterModal.classList.remove("show-modal")
      }
    })
  }
}
