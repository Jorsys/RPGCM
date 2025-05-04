document.addEventListener("DOMContentLoaded", () => {
  const importFileInput = document.getElementById("importFile")
  const importBtn = document.getElementById("importBtn")
  const exportBtn = document.getElementById("exportBtn")
  const continueBtn = document.getElementById("continueBtn")

  // Función para verificar si existe el archivo AppRol.json
  function checkAppRolFile() {
    if (localStorage.getItem("personajes")) {
      return true
    }
    return false
  }

  // Función para crear un nuevo archivo AppRol.json
  function createAppRolFile() {
    const defaultData = {
      personajes: [],
    }
    // Usar la función de PWA para guardar y sincronizar
    if (window.saveDataAndSync) {
      window.saveDataAndSync("personajes", defaultData)
    } else {
      localStorage.setItem("personajes", JSON.stringify(defaultData))
    }
  }

  // Función para importar archivo JSON
  importBtn.addEventListener("click", () => {
    const file = importFileInput.files[0]
    if (!file) {
      alert("Por favor, selecciona un archivo JSON para importar.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const characterData = JSON.parse(e.target.result)

        // Verificar si es un personaje individual o una lista de personajes
        if (characterData.nombre) {
          // Es un personaje individual
          importSingleCharacter(characterData)
        } else if (characterData.personajes) {
          // Es una lista de personajes
          importCharactersList(characterData)
        } else {
          alert("El formato del archivo no es válido.")
        }
      } catch (error) {
        alert("Error al importar el archivo: " + error.message)
      }
    }
    reader.readAsText(file)
  })

  // Función para importar un personaje individual
  function importSingleCharacter(character) {
    // Obtener la lista actual de personajes
    const personajesData = localStorage.getItem("personajes")
    let personajes = { personajes: [] }

    if (personajesData) {
      personajes = JSON.parse(personajesData)
    }

    // Verificar si ya existe un personaje con ese nombre
    const existingCharacter = personajes.personajes.find((p) => p.nombre === character.nombre)

    if (existingCharacter) {
      if (!confirm(`Ya existe un personaje con el nombre "${character.nombre}". ¿Deseas sobrescribirlo?`)) {
        return
      }
      // Si se confirma, no hacemos nada especial, simplemente se sobrescribirá
    } else {
      // Añadir a la lista de personajes
      personajes.personajes.push({
        nombre: character.nombre,
        raza: character.raza,
        nivel: character.nivel,
      })
    }

    // Guardar la lista actualizada
    localStorage.setItem("personajes", JSON.stringify(personajes))

    // Guardar los datos completos del personaje
    localStorage.setItem(character.nombre + ".json", JSON.stringify(character))

    alert(`Personaje "${character.nombre}" importado correctamente.`)
  }

  // Función para importar una lista de personajes
  function importCharactersList(data) {
    // Simplemente reemplazamos la lista completa
    localStorage.setItem("personajes", JSON.stringify(data))
    alert("Lista de personajes importada correctamente.")
  }

  // Función para exportar personajes
  exportBtn.addEventListener("click", () => {
    if (!checkAppRolFile()) {
      alert("No hay datos para exportar.")
      return
    }

    // Cargar el modal de exportación si no está ya en el DOM
    if (!document.getElementById("exportModal")) {
      fetch("components/modals/export-modal.html")
        .then((response) => response.text())
        .then((html) => {
          const tempDiv = document.createElement("div")
          tempDiv.innerHTML = html
          document.body.appendChild(tempDiv.firstChild)

          // Configurar el modal una vez añadido al DOM
          setupExportModal()
        })
        .catch((error) => {
          console.error("Error al cargar el modal de exportación:", error)
          // Fallback: exportar todos los personajes
          exportAllCharacters()
        })
    } else {
      // Si el modal ya existe, solo lo mostramos y actualizamos
      setupExportModal()
    }
  })

  // Función para configurar el modal de exportación
  function setupExportModal() {
    const exportModal = document.getElementById("exportModal")
    const closeExportModal = document.getElementById("closeExportModal")
    const confirmExportBtn = document.getElementById("confirmExportBtn")
    const exportCharactersList = document.getElementById("exportCharactersList")

    // Cargar la lista de personajes
    const personajesData = JSON.parse(localStorage.getItem("personajes"))
    exportCharactersList.innerHTML = ""

    if (personajesData && personajesData.personajes && personajesData.personajes.length > 0) {
      personajesData.personajes.forEach((personaje, index) => {
        const item = document.createElement("div")
        item.className = "export-character-item"
        item.innerHTML = `
          <input type="checkbox" id="export-char-${index}" data-name="${personaje.nombre}">
          <label for="export-char-${index}">${personaje.nombre} - ${personaje.raza}, Nivel ${personaje.nivel}</label>
        `
        exportCharactersList.appendChild(item)
      })
    } else {
      exportCharactersList.innerHTML = "<p>No hay personajes para exportar.</p>"
    }

    // Configurar eventos del modal
    if (closeExportModal) {
      closeExportModal.addEventListener("click", () => {
        exportModal.classList.remove("show-modal")
      })
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
      if (event.target === exportModal) {
        exportModal.classList.remove("show-modal")
      }
    })

    // Configurar botón de exportar
    if (confirmExportBtn) {
      // Eliminar event listeners anteriores
      const newConfirmBtn = confirmExportBtn.cloneNode(true)
      confirmExportBtn.parentNode.replaceChild(newConfirmBtn, confirmExportBtn)

      newConfirmBtn.addEventListener("click", () => {
        const selectedCharacters = []
        const checkboxes = exportCharactersList.querySelectorAll('input[type="checkbox"]:checked')

        checkboxes.forEach((checkbox) => {
          selectedCharacters.push(checkbox.dataset.name)
        })

        if (selectedCharacters.length === 0) {
          alert("No has seleccionado ningún personaje para exportar.")
          return
        }

        exportSelectedCharacters(selectedCharacters)
        exportModal.classList.remove("show-modal")
      })
    }

    // Mostrar el modal
    exportModal.classList.add("show-modal")
  }

  // Función para exportar los personajes seleccionados
  function exportSelectedCharacters(characterNames) {
    characterNames.forEach((name) => {
      const characterData = localStorage.getItem(name + ".json")
      if (characterData) {
        const blob = new Blob([characterData], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = name + ".json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    })
  }

  // Función de respaldo para exportar todos los personajes
  function exportAllCharacters() {
    const data = localStorage.getItem("personajes")
    const personajesData = JSON.parse(data)

    if (personajesData && personajesData.personajes) {
      personajesData.personajes.forEach((personaje) => {
        const characterData = localStorage.getItem(personaje.nombre + ".json")
        if (characterData) {
          const blob = new Blob([characterData], { type: "application/json" })
          const url = URL.createObjectURL(blob)

          const a = document.createElement("a")
          a.href = url
          a.download = personaje.nombre + ".json"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      })
    }
  }

  // Función para continuar a la pantalla de selección de personajes
  continueBtn.addEventListener("click", () => {
    if (!checkAppRolFile()) {
      createAppRolFile()
    }
    window.location.href = "personaje.html"
  })
})
