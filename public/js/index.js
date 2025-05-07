// Importar funciones necesarias
import { generateUUID } from "./modules/utils.js"
import * as bootstrap from "bootstrap"

// Función para inicializar la página
function inicializarPagina() {
  // Cargar información del personaje actual
  cargarInformacionPersonaje()

  // Configurar eventos para los botones
  document.getElementById("createCharacterBtn").addEventListener("click", abrirModalCrearPersonaje)
  document.getElementById("resetCharacterBtn").addEventListener("click", abrirModalReiniciarPersonaje)
  document.getElementById("exportCharacterBtn").addEventListener("click", exportarPersonaje)
  document.getElementById("importCharacterBtn").addEventListener("click", importarPersonaje)

  // Configurar eventos para los modales
  document.getElementById("confirmResetBtn").addEventListener("click", reiniciarPersonaje)
  document.getElementById("confirmCreateBtn").addEventListener("click", crearPersonaje)
}

// Función para cargar la información del personaje actual
function cargarInformacionPersonaje() {
  const contenedor = document.getElementById("current-character-info")
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))

  if (!personaje) {
    contenedor.innerHTML = `
      <div class="alert alert-info" role="alert">
        <p class="mb-0">No hay ningún personaje activo. Crea uno nuevo para comenzar.</p>
      </div>
    `
    return
  }

  // Mostrar información básica del personaje
  contenedor.innerHTML = `
    <div class="card-text">
      <div class="row mb-2">
        <div class="col-4 text-muted">Nombre:</div>
        <div class="col-8 fw-bold">${personaje.nombre || "Sin nombre"}</div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted">Clase:</div>
        <div class="col-8">${personaje.clase || "-"}</div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted">Nivel:</div>
        <div class="col-8">${personaje.nivel || "1"}</div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted">Atributos Básicos:</div>
        <div class="col-8">
          <span class="badge bg-info me-1" title="Percepción">
            <i class="bi bi-eye"></i> ${personaje.atributos?.percepcion || "0"}
          </span>
          <span class="badge bg-warning me-1" title="Destreza">
            <i class="bi bi-hand"></i> ${personaje.atributos?.destreza || "0"}
          </span>
          <span class="badge bg-success me-1" title="Agilidad">
            <i class="bi bi-lightning"></i> ${personaje.atributos?.agilidad || "0"}
          </span>
          <span class="badge bg-danger me-1" title="Inteligencia">
            <i class="bi bi-brain"></i> ${personaje.atributos?.inteligencia || "0"}
          </span>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted">Atributos de Combate:</div>
        <div class="col-8">
          <span class="badge bg-primary me-1" title="Combate">
            <i class="bi bi-sword"></i> ${personaje.atributos?.combate || "0"}
          </span>
          <span class="badge bg-success me-1" title="Puntería">
            <i class="bi bi-bullseye"></i> ${personaje.atributos?.punteria || "0"}
          </span>
          <span class="badge bg-info me-1" title="Magia">
            <i class="bi bi-stars"></i> ${personaje.atributos?.magia || "0"}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-4 text-muted">Estado:</div>
        <div class="col-8">
          <div class="progress mb-1" style="height: 8px;" title="Vida">
            <div class="progress-bar bg-danger" style="width: ${calcularPorcentaje(
              personaje.atributos?.vidaActual || 0,
              personaje.atributos?.vida || 1,
            )}%"></div>
          </div>
          <div class="progress mb-1" style="height: 8px;" title="Aguante">
            <div class="progress-bar bg-warning" style="width: ${calcularPorcentaje(
              personaje.atributos?.aguanteActual || 0,
              personaje.atributos?.aguante || 1,
            )}%"></div>
          </div>
          <div class="progress" style="height: 8px;" title="Maná">
            <div class="progress-bar bg-primary" style="width: ${calcularPorcentaje(
              personaje.atributos?.manaActual || 0,
              personaje.atributos?.mana || 1,
            )}%"></div>
          </div>
        </div>
      </div>
    </div>
  `
}

// Función para calcular el porcentaje
function calcularPorcentaje(actual, total) {
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, (actual / total) * 100))
}

// Función para abrir el modal de crear personaje
function abrirModalCrearPersonaje() {
  const modal = new bootstrap.Modal(document.getElementById("createCharacterModal"))
  document.getElementById("createCharacterForm").reset()
  modal.show()
}

// Función para crear un nuevo personaje
function crearPersonaje() {
  const nombre = document.getElementById("newCharacterName").value
  const clase = document.getElementById("newCharacterClass").value
  const nivel = document.getElementById("newCharacterLevel").value

  // Crear objeto de personaje
  const nuevoPersonaje = {
    id: generateUUID(),
    nombre,
    clase,
    nivel,
    atributos: {
      // Atributos básicos
      percepcion: 0,
      destreza: 0,
      agilidad: 0,
      inteligencia: 0,

      // Atributos derivados
      combate: 0,
      punteria: 0,
      magia: 0,
      vida: 10,
      vidaActual: 10,
      aguante: 10,
      aguanteActual: 10,
      mana: 10,
      manaActual: 10,
    },
    inventario: [],
    equipamiento: {
      armas: [],
      armaduras: [],
      municiones: [],
    },
    recursos: [],
    bolsasEspeciales: [],
    grimorio: [],
  }

  // Guardar el personaje en localStorage
  localStorage.setItem("personajeActual", JSON.stringify(nuevoPersonaje))

  // Cerrar el modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("createCharacterModal"))
  modal.hide()

  // Actualizar la información mostrada
  cargarInformacionPersonaje()

  // Mostrar mensaje de éxito
  alert("Personaje creado con éxito")
}

// Función para abrir el modal de reiniciar personaje
function abrirModalReiniciarPersonaje() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) {
    alert("No hay ningún personaje activo para reiniciar")
    return
  }

  const modal = new bootstrap.Modal(document.getElementById("resetConfirmModal"))
  modal.show()
}

// Función para reiniciar el personaje actual
function reiniciarPersonaje() {
  // Eliminar el personaje del localStorage
  localStorage.removeItem("personajeActual")

  // Cerrar el modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("resetConfirmModal"))
  modal.hide()

  // Actualizar la información mostrada
  cargarInformacionPersonaje()

  // Mostrar mensaje de éxito
  alert("Personaje reiniciado con éxito")
}

// Función para exportar el personaje actual
function exportarPersonaje() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) {
    alert("No hay ningún personaje activo para exportar")
    return
  }

  // Convertir el personaje a una cadena JSON
  const personajeJSON = JSON.stringify(personaje, null, 2)

  // Crear un blob con el contenido JSON
  const blob = new Blob([personajeJSON], { type: "application/json" })

  // Crear un enlace para descargar el archivo
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${personaje.nombre || "personaje"}.json`
  document.body.appendChild(a)
  a.click()

  // Limpiar
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

// Función para importar un personaje
function importarPersonaje() {
  // Crear un input de tipo file
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"

  // Configurar el evento de cambio
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const personaje = JSON.parse(event.target.result)

        // Validar que el objeto tenga la estructura básica de un personaje
        if (!personaje.nombre) {
          throw new Error("El archivo no contiene un personaje válido")
        }

        // Guardar el personaje en localStorage
        localStorage.setItem("personajeActual", JSON.stringify(personaje))

        // Actualizar la información mostrada
        cargarInformacionPersonaje()

        // Mostrar mensaje de éxito
        alert("Personaje importado con éxito")
      } catch (error) {
        alert("Error al importar el personaje: " + error.message)
      }
    }
    reader.readAsText(file)
  }

  // Simular clic en el input
  input.click()
}

// Inicializar la página cuando se carga
document.addEventListener("DOMContentLoaded", inicializarPagina)
