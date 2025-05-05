// Módulo para la gestión del grimorio

import { guardarPersonaje } from "./personaje.js"
import { showConfirmation } from "./utils.js"

// Función para cargar el grimorio
export function cargarGrimorio(personaje, confirmModal, confirmMessage) {
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
      editarHechizo(personaje, index)
    })
  })

  // Agregar event listeners a los iconos de eliminar hechizo
  const deleteSpellIcons = document.querySelectorAll(".delete-spell-icon")
  deleteSpellIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index
      const spellName = personaje.grimorio[index].nombre

      showConfirmation(
        `¿Estás seguro de que deseas eliminar el hechizo "${spellName}"?`,
        () => {
          eliminarHechizo(personaje, index)
          cargarGrimorio(personaje, confirmModal, confirmMessage)
        },
        confirmModal,
        confirmMessage,
      )
    })
  })
}

// Función para configurar el botón de crear hechizo
export function configurarBotonCrearHechizo(personaje, confirmModal, confirmMessage) {
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

              agregarHechizo(personaje, newSpell)
              cargarGrimorio(personaje, confirmModal, confirmMessage)
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
}

// Función para agregar un hechizo al grimorio
export function agregarHechizo(personaje, hechizo) {
  personaje.grimorio.push(hechizo)
  guardarPersonaje(personaje)
}

// Función para eliminar un hechizo del grimorio
export function eliminarHechizo(personaje, index) {
  personaje.grimorio.splice(index, 1)
  guardarPersonaje(personaje)
}

// Función para editar un hechizo del grimorio
export function editarHechizo(personaje, index) {
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

        guardarPersonaje(personaje)
        cargarGrimorio(personaje, document.getElementById("confirmModal"), document.getElementById("confirmMessage"))

        // Cerrar el modal
        createSpellModal.classList.remove("show-modal")
      } else {
        alert("El nombre del hechizo es obligatorio")
      }
    })
  }
}
