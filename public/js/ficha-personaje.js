// Importar funciones necesarias
import { cargarPersonaje } from "./modules/personaje.js"
import { cargarEquipamiento } from "./modules/equipamiento.js"
import { cargarInventario } from "./modules/inventario.js"
import { cargarRecursos } from "./modules/recursos.js"
import { cargarBolsasEspeciales } from "./modules/bolsas.js"
import { cargarGrimorio } from "./modules/grimorio.js"
import { cargarAtributosDerivados } from "./modules/atributos-derivados.js"

// Función para inicializar la página
function inicializarPagina() {
  // Verificar si hay un personaje activo
  const personajeJSON = localStorage.getItem("personajeActual")
  if (!personajeJSON) {
    alert("No hay ningún personaje activo. Serás redirigido a la página principal.")
    window.location.href = "index.html"
    return
  }

  // Cargar los datos del personaje
  cargarPersonaje()
  cargarEquipamiento()
  cargarInventario()
  cargarRecursos()
  cargarBolsasEspeciales()
  cargarGrimorio()
  cargarAtributosDerivados()

  // Configurar eventos
  document.getElementById("volver").addEventListener("click", () => {
    window.location.href = "index.html"
  })
}

// Inicializar la página cuando se carga
document.addEventListener("DOMContentLoaded", inicializarPagina)
