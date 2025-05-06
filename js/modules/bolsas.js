// Archivo principal para bolsas especiales
// Este archivo importa y exporta todas las funciones relacionadas con bolsas

import {
  obtenerBolsasEspeciales,
  guardarBolsasEspeciales,
  crearBolsaEspecial,
  eliminarBolsaEspecial,
  agregarObjetoABolsa,
  eliminarObjetoDeBolsa,
  actualizarObjetoEnBolsa,
  moverObjetoAInventario,
  moverObjetoEntreBolsas,
  moverObjetoDeInventarioABolsa,
  calcularPesoBolsa,
} from "./bolsas/bolsas-data.js"

import { cargarBolsasEspeciales, confirmarEliminarBolsa } from "./bolsas/bolsas-ui.js"

import {
  cargarContenidoBolsa,
  confirmarEliminarObjetoDeBolsa,
  confirmarMoverObjetoAInventario,
  confirmarMoverObjetoEntreBolsas,
} from "./bolsas/bolsas-contenido.js"

import {
  abrirModalCrearBolsa,
  abrirModalAgregarObjetoABolsa,
  abrirModalEditarObjeto,
  abrirModalMoverObjeto,
} from "./bolsas/bolsas-modal.js"

// Exportar todas las funciones
export {
  // Funciones de datos
  obtenerBolsasEspeciales,
  guardarBolsasEspeciales,
  crearBolsaEspecial,
  eliminarBolsaEspecial,
  agregarObjetoABolsa,
  eliminarObjetoDeBolsa,
  actualizarObjetoEnBolsa,
  moverObjetoAInventario,
  moverObjetoEntreBolsas,
  moverObjetoDeInventarioABolsa,
  calcularPesoBolsa,
  // Funciones de UI
  cargarBolsasEspeciales,
  confirmarEliminarBolsa,
  // Funciones de contenido
  cargarContenidoBolsa,
  confirmarEliminarObjetoDeBolsa,
  confirmarMoverObjetoAInventario,
  confirmarMoverObjetoEntreBolsas,
  // Funciones de modal
  abrirModalCrearBolsa,
  abrirModalAgregarObjetoABolsa,
  abrirModalEditarObjeto,
  abrirModalMoverObjeto,
}

// Inicializar las bolsas cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("special-bags-container")) {
    cargarBolsasEspeciales()
  }
})
