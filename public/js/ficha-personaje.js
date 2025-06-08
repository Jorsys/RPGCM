function añadirIconosAtributos() {
  // Añadir icono para inteligencia
  const inteligenciaElement = document.getElementById("inteligencia-valor")
  if (inteligenciaElement) {
    const inteligenciaContainer = inteligenciaElement.closest(".col-md-3")
    if (inteligenciaContainer) {
      const label = inteligenciaContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-brain me-1"></i> Inteligencia'
      }
    }
  }

  // Añadir icono para combate
  const combateElement = document.getElementById("combate-valor")
  if (combateElement) {
    const combateContainer = combateElement.closest(".col-md-4")
    if (combateContainer) {
      const label = combateContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-sword me-1"></i> Combate'
      }
    }
  }

  // Añadir icono para acrobacia
  const acrobaciaElement = document.getElementById("acrobacia-valor")
  if (acrobaciaElement) {
    const acrobaciaContainer = acrobaciaElement.closest(".col-md-4")
    if (acrobaciaContainer) {
      const label = acrobaciaContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-person-walking me-1"></i> Acrobacia'
      }
    }
  }

  // Añadir icono para equitación
  const equitacionElement = document.getElementById("equitacion-valor")
  if (equitacionElement) {
    const equitacionContainer = equitacionElement.closest(".col-md-4")
    if (equitacionContainer) {
      const label = equitacionContainer.querySelector("strong")
      if (label) {
        label.innerHTML = '<i class="bi bi-bicycle me-1"></i> Equitación'
      }
    }
  }
}
