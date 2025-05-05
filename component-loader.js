document.addEventListener("DOMContentLoaded", async () => {
  // Función para cargar un componente HTML
  async function loadComponent(containerId, componentPath) {
    try {
      const response = await fetch(componentPath)
      if (!response.ok) {
        throw new Error(`Error al cargar el componente: ${response.status}`)
      }
      const html = await response.text()
      document.getElementById(containerId).innerHTML = html
    } catch (error) {
      console.error(`Error al cargar el componente ${componentPath}:`, error)
    }
  }

  // Cargar componentes principales
  await loadComponent("header-container", "components/header.html")
  await loadComponent("basic-info-container", "components/basic-info.html")
  await loadComponent("attributes-container", "components/attributes.html")
  await loadComponent("status-container", "components/status.html")

  // Cargar atributos derivados
  const derivedAttributesContainer = document.createElement("div")
  derivedAttributesContainer.id = "derived-attributes-container"

  // Insertar después del contenedor de estado y antes del grimorio
  const statusContainer = document.getElementById("status-container")
  const grimorioContainer = document.getElementById("grimorio-container")

  if (statusContainer && grimorioContainer) {
    statusContainer.parentNode.insertBefore(derivedAttributesContainer, grimorioContainer)
    await loadComponent("derived-attributes-container", "components/attributes-derived.html")
  }

  await loadComponent("grimorio-container", "components/grimorio.html")
  await loadComponent("equipment-container", "components/equipment.html")

  // Cargar componente principal de inventario
  await loadComponent("inventory-container", "components/inventory/main.html")

  // Cargar subcomponentes de inventario
  await loadComponent("resources-container", "components/inventory/resources.html")
  await loadComponent("accordion-container", "components/inventory/accordion.html")
  await loadComponent("special-bags-container-wrapper", "components/inventory/special-bags.html")

  // Cargar modales
  const modalsContainer = document.getElementById("modals-container")

  // Lista de modales a cargar
  const modals = [
    "edit-equipped-modal.html",
    "create-spell-modal.html",
    "item-modal.html",
    "resource-modal.html",
    "sell-item-modal.html",
    "move-to-bag-modal.html",
    "create-bag-modal.html",
    "confirm-modal.html",
  ]

  // Cargar cada modal
  for (const modal of modals) {
    try {
      const response = await fetch(`components/modals/${modal}`)
      if (!response.ok) {
        throw new Error(`Error al cargar el modal: ${response.status}`)
      }
      const html = await response.text()

      // Crear un div temporal para parsear el HTML
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = html

      // Añadir el contenido al contenedor de modales
      while (tempDiv.firstChild) {
        modalsContainer.appendChild(tempDiv.firstChild)
      }
    } catch (error) {
      console.error(`Error al cargar el modal ${modal}:`, error)
    }
  }

  // Disparar un evento para indicar que todos los componentes se han cargado
  document.dispatchEvent(new Event("componentsLoaded"))
})
