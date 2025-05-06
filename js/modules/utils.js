// Funciones de utilidad para la aplicación

// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// Función para obtener datos de localStorage
function getFromLocalStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// Función para generar un ID único
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Función para validar que un nombre no esté duplicado
function isNameUnique(name, existingNames) {
  return !existingNames.includes(name)
}

// Función para exportar datos a un archivo JSON
function exportToJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Función para importar datos desde un archivo JSON
function importFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"))
    }

    reader.readAsText(file)
  })
}

// Función para obtener el nombre legible de una categoría
export function getCategoryName(category) {
  const names = {
    armaduras: "Armadura",
    armas: "Arma",
    municion: "Munición",
    pociones: "Poción",
    pergaminos: "Pergamino",
    otros: "Otro",
  }

  return names[category] || category
}

// Función para obtener el icono de una categoría
export function getCategoryIcon(category) {
  const icons = {
    armaduras: "fa-shield-alt",
    armas: "fa-swords",
    municion: "fa-bullseye",
    pociones: "fa-flask",
    pergaminos: "fa-scroll",
    otros: "fa-box",
  }

  return icons[category] || "fa-box"
}

// Función para mostrar confirmación
export function showConfirmation(message, callback, confirmModal, confirmMessage) {
  confirmMessage.textContent = message
  window.confirmCallback = callback
  confirmModal.classList.add("show-modal")
}

// Función para rellenar campos del formulario con verificación de existencia
export function fillField(id, value) {
  const element = document.getElementById(id)
  if (element) {
    element.value = value
  } else {
    console.error(`Elemento con ID ${id} no encontrado`)
  }
}
