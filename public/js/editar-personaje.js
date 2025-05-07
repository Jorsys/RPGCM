// Importar módulos
import { cargarPersonajeEdicion, guardarPersonajeEdicion } from "./modules/personaje.js"
import { cargarAtributosEdicion, guardarAtributosEdicion } from "./modules/editar-atributos.js"

// Función para inicializar la página de edición
function inicializarEdicion() {
  // Cargar datos del personaje
  cargarPersonajeEdicion()

  // Cargar atributos
  cargarAtributosEdicion()

  // Configurar evento para guardar cambios
  document.getElementById("saveBtn").addEventListener("click", guardarCambios)
}

// Función para guardar todos los cambios
function guardarCambios() {
  // Guardar datos del personaje
  guardarPersonajeEdicion()

  // Guardar atributos
  guardarAtributosEdicion()

  // Redirigir a la ficha de personaje
  window.location.href = "ficha-personaje.html"
}

// Inicializar la página cuando se carga
document.addEventListener("DOMContentLoaded", inicializarEdicion)

// Exportar funciones
export { inicializarEdicion, guardarCambios }
