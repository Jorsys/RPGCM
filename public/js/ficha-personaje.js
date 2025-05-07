// Importar módulos
import { cargarPersonaje } from "./modules/personaje.js"
import { cargarAtributos } from "./modules/atributos-derivados.js"
import { cargarEquipamiento } from "./modules/equipamiento.js"
import { cargarInventarioAcordeon } from "./modules/inventario.js"
import { cargarRecursos } from "./modules/recursos.js"
import { cargarBolsasEspeciales } from "./modules/bolsas.js"
import { cargarGrimorio } from "./modules/grimorio.js"

// Función para inicializar la ficha de personaje
function inicializarFichaPersonaje() {
  // Cargar datos del personaje
  cargarPersonaje()

  // Cargar atributos derivados
  cargarAtributos()

  // Cargar equipamiento
  cargarEquipamiento()

  // Cargar inventario
  cargarInventarioAcordeon()

  // Cargar recursos
  cargarRecursos()

  // Cargar bolsas especiales
  cargarBolsasEspeciales()

  // Cargar grimorio
  cargarGrimorio()
}

// Inicializar la ficha cuando se carga la página
document.addEventListener("DOMContentLoaded", inicializarFichaPersonaje)

// Exportar funciones
export { inicializarFichaPersonaje }
