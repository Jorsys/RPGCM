// Módulo para editar los valores básicos del personaje

import { guardarPersonaje } from "./personaje.js"

// Función para configurar el botón de editar personaje
export function configurarBotonEditarPersonaje(personaje) {
  const editCharacterBtn = document.getElementById("editCharacterBtn")

  if (editCharacterBtn) {
    editCharacterBtn.addEventListener("click", () => {
      mostrarModalEditarPersonaje(personaje)
    })
  }
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
          <label for="editVida">Vida:</label>
          <input type="number" id="editVida" min="1" value="${personaje.vida}">
        </div>
        <div class="form-group">
          <label for="editAguante">Aguante:</label>
          <input type="number" id="editAguante" min="0" value="${personaje.aguante}">
        </div>
        <div class="form-group">
          <label for="editMana">Maná:</label>
          <input type="number" id="editMana" min="0" value="${personaje.mana}">
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
        personaje.vida = Number.parseInt(document.getElementById("editVida").value) || 1
        personaje.aguante = Number.parseInt(document.getElementById("editAguante").value) || 0
        personaje.mana = Number.parseInt(document.getElementById("editMana").value) || 0

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
        document.getElementById("aguante").value = personaje.aguante
        document.getElementById("mana").value = personaje.mana

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
      derivedAttributesContainer.innerHTML = `
        <h3>Atributos Derivados</h3>
        <div class="form-group">
          <label for="percepcion">Percepción:</label>
          <input type="number" id="percepcion" min="0" value="0" readonly>
        </div>
        <div class="form-group">
          <label for="destreza">Destreza:</label>
          <input type="number" id="destreza" min="0" value="0" readonly>
        </div>
        <div class="form-group">
          <label for="agilidad">Agilidad:</label>
          <input type="number" id="agilidad" min="0" value="0" readonly>
        </div>
        <div class="form-group">
          <label for="inteligencia">Inteligencia:</label>
          <input type="number" id="inteligencia" min="0" value="0" readonly>
        </div>
      `

      // Insertar antes del botón de submit
      characterForm.insertBefore(derivedAttributesContainer, submitButton)

      // Añadir event listeners para recalcular atributos derivados cuando cambien los atributos base
      const atributosBase = ["combateCuerpo", "combateDistancia", "lanzamientoHechizos"]
      atributosBase.forEach((atributo) => {
        const input = document.getElementById(atributo)
        if (input) {
          input.addEventListener("change", calcularAtributosDerivedosCreacion)
          input.addEventListener("input", calcularAtributosDerivedosCreacion)
        }
      })
    }
  }
}

// Función para calcular atributos derivados en el modal de creación
function calcularAtributosDerivedosCreacion() {
  const combateCuerpo = Number(document.getElementById("combateCuerpo")?.value || 0)
  const combateDistancia = Number(document.getElementById("combateDistancia")?.value || 0)
  const lanzamientoHechizos = Number(document.getElementById("lanzamientoHechizos")?.value || 0)

  const percepcion = combateCuerpo + combateDistancia
  const destreza = combateCuerpo + lanzamientoHechizos
  const agilidad = combateDistancia + lanzamientoHechizos
  const inteligencia = combateCuerpo + combateDistancia + lanzamientoHechizos

  // Actualizar campos
  if (document.getElementById("percepcion")) document.getElementById("percepcion").value = percepcion
  if (document.getElementById("destreza")) document.getElementById("destreza").value = destreza
  if (document.getElementById("agilidad")) document.getElementById("agilidad").value = agilidad
  if (document.getElementById("inteligencia")) document.getElementById("inteligencia").value = inteligencia
}
