// Funciones de utilidad para la aplicación

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
    armas: "fa-sword",
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
