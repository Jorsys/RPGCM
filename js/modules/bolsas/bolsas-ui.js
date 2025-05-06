// Funciones para gestionar la interfaz de usuario de las bolsas especiales
import { obtenerBolsasEspeciales, eliminarBolsaEspecial, calcularPesoBolsa } from "./bolsas-data.js"
import { abrirModalCrearBolsa } from "./bolsas-modal.js"
import { cargarContenidoBolsa } from "./bolsas-contenido.js"
import { abrirModalAgregarObjetoABolsa } from "./bolsas-modal.js"
import { cargarInventarioAcordeon } from "../inventario.js" // Corregir la importación
import { actualizarPesoTotal } from "../equipamiento.js" // Corregir la importación

// Función para cargar las bolsas especiales
function cargarBolsasEspeciales() {
  const contenedorBolsas = document.getElementById("special-bags-container")
  if (!contenedorBolsas) return

  const bolsas = obtenerBolsasEspeciales()

  // Limpiar el contenedor
  contenedorBolsas.innerHTML = ""

  // Si no hay bolsas, mostrar mensaje
  if (bolsas.length === 0) {
    contenedorBolsas.innerHTML = `
            <div class="text-center mb-3">
                <p>No tienes bolsas especiales</p>
                <button class="btn btn-sm btn-primary" id="createBagBtn">
                    <i class="bi bi-plus-circle me-1"></i> Crear bolsa
                </button>
            </div>
        `

    // Agregar evento al botón de crear bolsa
    document.getElementById("createBagBtn").addEventListener("click", abrirModalCrearBolsa)
    return
  }

  // Crear el acordeón para las bolsas
  const accordion = document.createElement("div")
  accordion.className = "accordion mb-3"
  accordion.id = "specialBagsAccordion"

  // Agregar cada bolsa al acordeón
  bolsas.forEach((bolsa, index) => {
    const pesoTotal = calcularPesoBolsa(bolsa.id).toFixed(2)
    const cantidadObjetos = bolsa.contenido ? bolsa.contenido.length : 0

    const accordionItem = document.createElement("div")
    accordionItem.className = "accordion-item"
    accordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading-bag-${bolsa.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse-bag-${bolsa.id}" aria-expanded="false" 
                        aria-controls="collapse-bag-${bolsa.id}">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <span>${bolsa.nombre}</span>
                        <span class="badge bg-secondary me-2">${cantidadObjetos} objetos | ${pesoTotal} kg</span>
                    </div>
                </button>
            </h2>
            <div id="collapse-bag-${bolsa.id}" class="accordion-collapse collapse" 
                 aria-labelledby="heading-bag-${bolsa.id}" data-bs-parent="#specialBagsAccordion">
                <div class="accordion-body p-2">
                    <div class="d-flex justify-content-between mb-2">
                        <button class="btn btn-sm btn-outline-danger delete-bag" data-id="${bolsa.id}">
                            <i class="bi bi-trash"></i> Eliminar bolsa
                        </button>
                        <button class="btn btn-sm btn-outline-primary add-item-to-bag" data-id="${bolsa.id}">
                            <i class="bi bi-plus-circle"></i> Añadir objeto
                        </button>
                    </div>
                    <div class="bag-content" id="bag-content-${bolsa.id}">
                        <!-- El contenido se cargará dinámicamente -->
                    </div>
                </div>
            </div>
        `

    accordion.appendChild(accordionItem)
  })

  // Agregar el botón de crear bolsa
  const createBagBtn = document.createElement("button")
  createBagBtn.className = "btn btn-sm btn-primary w-100"
  createBagBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i> Crear bolsa'
  createBagBtn.id = "createBagBtn"

  // Agregar elementos al contenedor
  contenedorBolsas.appendChild(accordion)
  contenedorBolsas.appendChild(createBagBtn)

  // Agregar eventos a los botones
  document.querySelectorAll(".delete-bag").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bolsaId = e.currentTarget.dataset.id
      confirmarEliminarBolsa(bolsaId)
    })
  })

  document.querySelectorAll(".add-item-to-bag").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bolsaId = e.currentTarget.dataset.id
      abrirModalAgregarObjetoABolsa(bolsaId)
    })
  })

  document.getElementById("createBagBtn").addEventListener("click", abrirModalCrearBolsa)

  // Cargar el contenido de cada bolsa
  bolsas.forEach((bolsa) => {
    cargarContenidoBolsa(bolsa.id)
  })

  // Configurar eventos para abrir el contenido de la bolsa al hacer clic en el acordeón
  document.querySelectorAll(".accordion-button").forEach((btn) => {
    btn.addEventListener("shown.bs.collapse", (e) => {
      const bolsaId = e.target.dataset.bsTarget.replace("#collapse-bag-", "")
      cargarContenidoBolsa(bolsaId)
    })
  })
}

// Función para confirmar la eliminación de una bolsa
function confirmarEliminarBolsa(bolsaId) {
  if (confirm("¿Estás seguro de que deseas eliminar esta bolsa? Su contenido se moverá al inventario.")) {
    eliminarBolsaEspecial(bolsaId)
    cargarBolsasEspeciales()

    // Actualizar el inventario si está disponible
    if (typeof cargarInventarioAcordeon === "function") {
      cargarInventarioAcordeon()
    }

    // Actualizar el peso total
    if (typeof actualizarPesoTotal === "function") {
      actualizarPesoTotal()
    }
  }
}

// Exportar funciones
export { cargarBolsasEspeciales, confirmarEliminarBolsa }
