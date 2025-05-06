// Funciones para gestionar los datos del personaje

// Función para cargar los datos del personaje en la ficha
function cargarPersonaje() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Cargar nombre del personaje
  document.getElementById("nombrePersonaje").textContent = personaje.nombre || "Nombre del Personaje"
}

// Función para cargar los datos del personaje en el formulario de edición
function cargarPersonajeEdicion() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Cargar datos básicos
  document.getElementById("nombre").value = personaje.nombre || ""
  document.getElementById("nivel").value = personaje.nivel || "1"
  document.getElementById("clase").value = personaje.clase || ""
}

// Función para guardar los datos del personaje desde el formulario de edición
function guardarPersonajeEdicion() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual")) || {}

  // Guardar datos básicos
  personaje.nombre = document.getElementById("nombre").value
  personaje.nivel = document.getElementById("nivel").value
  personaje.clase = document.getElementById("clase").value

  // Inicializar propiedades si no existen
  if (!personaje.atributos) {
    personaje.atributos = {}
  }
  if (!personaje.inventario) {
    personaje.inventario = []
  }
  if (!personaje.equipamiento) {
    personaje.equipamiento = {
      armas: [],
      armaduras: [],
      municiones: [],
    }
  }
  if (!personaje.recursos) {
    personaje.recursos = []
  }
  if (!personaje.bolsasEspeciales) {
    personaje.bolsasEspeciales = []
  }
  if (!personaje.grimorio) {
    personaje.grimorio = []
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))
}

// Exportar funciones
export { cargarPersonaje, cargarPersonajeEdicion, guardarPersonajeEdicion }
