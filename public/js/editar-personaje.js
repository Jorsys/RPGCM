// Importar funciones necesarias
import { cargarPersonajeEdicion, guardarPersonajeEdicion } from "./modules/personaje.js"
import { cargarAtributosEdicion, guardarAtributosEdicion } from "./modules/editar-atributos.js"

// Función para inicializar la página
function inicializarPagina() {
  // Verificar si hay un personaje activo
  const personajeJSON = localStorage.getItem("personajeActual")
  if (!personajeJSON) {
    alert("No hay ningún personaje activo. Serás redirigido a la página principal.")
    window.location.href = "index.html"
    return
  }

  // Cargar los datos del personaje en el formulario
  cargarPersonajeEdicion()
  cargarAtributosEdicion()

  // Configurar eventos
  document.getElementById("guardarPersonaje").addEventListener("click", () => {
    guardarPersonajeEdicion()
    guardarAtributosEdicion()

    // Actualizar el personaje en la lista de personajes
    actualizarPersonajeEnLista()

    alert("Personaje guardado con éxito")
  })

  document.getElementById("volver").addEventListener("click", () => {
    window.location.href = "ficha-personaje.html"
  })
}

// Función para actualizar el personaje en la lista de personajes
function actualizarPersonajeEnLista() {
  const personajeActualJSON = localStorage.getItem("personajeActual")
  if (!personajeActualJSON) return

  const personajeActual = JSON.parse(personajeActualJSON)

  const personajesJSON = localStorage.getItem("personajes")
  if (!personajesJSON) return

  const personajes = JSON.parse(personajesJSON)
  const index = personajes.findIndex((p) => p.id === personajeActual.id)

  if (index !== -1) {
    personajes[index] = personajeActual
    localStorage.setItem("personajes", JSON.stringify(personajes))
  }
}

// Inicializar la página cuando se carga
document.addEventListener("DOMContentLoaded", inicializarPagina)
