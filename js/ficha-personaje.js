// Archivo principal que carga los módulos y coordina la aplicación

// Importar módulos
import { cargarPersonaje, actualizarInterfazPersonaje, calcularAtributosDerivados } from "./modules/personaje.js"
import { cargarGrimorio, configurarBotonCrearHechizo } from "./modules/grimorio.js"
import { cargarEquipamiento, configurarCierreModalEquipamiento } from "./modules/equipamiento.js"
import { configurarAcordeonInventario } from "./modules/inventario.js"
import { cargarBolsasEspeciales, configurarBotonCrearBolsa } from "./modules/bolsas.js"

// Esperar a que los componentes se carguen antes de inicializar la aplicación
document.addEventListener("componentsLoaded", () => {
  console.log("ficha-personaje.js: Componentes cargados, inicializando aplicación")

  // Configurar el botón de volver
  const backBtn = document.getElementById("backBtn")
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "personaje.html"
    })
  }

  // Cargar datos del personaje
  const personaje = cargarPersonaje()
  if (!personaje) return

  // Actualizar la interfaz con los datos del personaje
  actualizarInterfazPersonaje(personaje)

  // Configurar modal de confirmación
  const confirmModal = document.getElementById("confirmModal")
  const confirmMessage = document.getElementById("confirmMessage")
  window.confirmCallback = null

  const closeConfirmModal = document.getElementById("closeConfirmModal")
  if (closeConfirmModal) {
    closeConfirmModal.addEventListener("click", () => {
      confirmModal.classList.remove("show-modal")
    })
  }

  const confirmNoBtn = document.getElementById("confirmNoBtn")
  if (confirmNoBtn) {
    confirmNoBtn.addEventListener("click", () => {
      confirmModal.classList.remove("show-modal")
    })
  }

  const confirmYesBtn = document.getElementById("confirmYesBtn")
  if (confirmYesBtn) {
    confirmYesBtn.addEventListener("click", () => {
      if (window.confirmCallback) {
        window.confirmCallback()
      }
      confirmModal.classList.remove("show-modal")
    })
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (event) => {
    if (event.target === confirmModal) {
      confirmModal.classList.remove("show-modal")
    }
  })

  // Calcular atributos derivados
  calcularAtributosDerivados(personaje)

  // Cargar grimorio
  cargarGrimorio(personaje, confirmModal, confirmMessage)
  configurarBotonCrearHechizo(personaje, confirmModal, confirmMessage)

  // Cargar equipamiento
  cargarEquipamiento(personaje, confirmModal, confirmMessage)
  configurarCierreModalEquipamiento()

  // Configurar acordeón de inventario
  configurarAcordeonInventario(personaje, confirmModal, confirmMessage)

  // Cargar bolsas especiales
  cargarBolsasEspeciales(personaje, confirmModal, confirmMessage)
  configurarBotonCrearBolsa(personaje, confirmModal, confirmMessage)

  // Actualizar los iconos de recursos
  const cuerdasIcon = document.querySelector("#cuerdas-resource i")
  if (cuerdasIcon) {
    cuerdasIcon.className = "fas fa-circle-notch" // Cambiamos de fa-scroll a fa-circle-notch
  }

  console.log("ficha-personaje.js: Inicialización completada")
})
