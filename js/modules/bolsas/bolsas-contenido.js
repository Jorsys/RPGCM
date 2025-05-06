// Funciones para gestionar el contenido de las bolsas especiales
import {
  obtenerBolsasEspeciales,
  eliminarObjetoDeBolsa,
  moverObjetoAInventario,
  moverObjetoEntreBolsas,
} from "./bolsas-data.js"
import { abrirModalEditarObjeto, abrirModalMoverObjeto } from "./bolsas-modal.js"
import { actualizarPesoTotal } from "../equipamiento.js" // Corregir la importación
import { cargarInventarioAcordeon } from "../inventario.js" // Corregir la importación

// Función para cargar el contenido de una bolsa
function cargarContenidoBolsa(bolsaId) {
  const contenedor = document.getElementById(`bag-content-${bolsaId}`)
  if (!contenedor) return

  const bolsas = obtenerBolsasEspeciales()
  const bolsa = bolsas.find((b) => b.id === bolsaId)

  if (!bolsa) return

  // Limpiar el contenedor
  contenedor.innerHTML = ""

  // Si no hay contenido, mostrar mensaje
  if (!bolsa.contenido || bolsa.contenido.length === 0) {
    contenedor.innerHTML = '<p class="text-center">Esta bolsa está vacía</p>'
    return
  }

  // Crear la tabla para mostrar el contenido
  const table = document.createElement("table")
  table.className = "table table-sm table-hover"
  table.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Cant.</th>
                <th>Peso</th>
                <th>Valor</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <!-- El contenido se agregará dinámicamente -->
        </tbody>
    `

  const tbody = table.querySelector("tbody")

  // Agregar cada objeto a la tabla
  bolsa.contenido.forEach((objeto) => {
    const cantidad = objeto.cantidad || 1
    const pesoTotal = (objeto.peso * cantidad).toFixed(2)
    const valorTotal = objeto.valor * cantidad

    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${objeto.nombre}</td>
            <td>${cantidad}</td>
            <td>${pesoTotal} kg</td>
            <td>${valorTotal} mo</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary edit-bag-item" data-id="${objeto.id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger delete-bag-item" data-id="${objeto.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-outline-secondary move-bag-item" data-id="${objeto.id}" title="Intercambio">
                        <i class="bi bi-arrow-left-right"></i>
                    </button>
                </div>
            </td>
        `

    tbody.appendChild(tr)
  })

  contenedor.appendChild(table)

  // Agregar eventos a los botones
  contenedor.querySelectorAll(".edit-bag-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const objetoId = e.currentTarget.dataset.id
      abrirModalEditarObjeto(bolsaId, objetoId)
    })
  })

  contenedor.querySelectorAll(".delete-bag-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const objetoId = e.currentTarget.dataset.id
      confirmarEliminarObjetoDeBolsa(bolsaId, objetoId)
    })
  })

  contenedor.querySelectorAll(".move-bag-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const objetoId = e.currentTarget.dataset.id
      abrirModalMoverObjeto(bolsaId, objetoId)
    })
  })
}

// Función para confirmar la eliminación de un objeto de una bolsa
function confirmarEliminarObjetoDeBolsa(bolsaId, objetoId) {
  if (confirm("¿Estás seguro de que deseas eliminar este objeto?")) {
    eliminarObjetoDeBolsa(bolsaId, objetoId)
    cargarContenidoBolsa(bolsaId)

    // Actualizar el peso total
    if (typeof actualizarPesoTotal === "function") {
      actualizarPesoTotal()
    }
  }
}

// Función para confirmar mover un objeto al inventario
function confirmarMoverObjetoAInventario(bolsaId, objetoId) {
  if (confirm("¿Estás seguro de que deseas mover este objeto al inventario?")) {
    moverObjetoAInventario(bolsaId, objetoId)
    cargarContenidoBolsa(bolsaId)

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

// Función para confirmar mover un objeto entre bolsas
function confirmarMoverObjetoEntreBolsas(bolsaOrigenId, bolsaDestinoId, objetoId) {
  if (confirm("¿Estás seguro de que deseas mover este objeto a otra bolsa?")) {
    moverObjetoEntreBolsas(bolsaOrigenId, bolsaDestinoId, objetoId)

    // Actualizar el contenido de ambas bolsas
    cargarContenidoBolsa(bolsaOrigenId)
    cargarContenidoBolsa(bolsaDestinoId)

    // Actualizar el peso total
    if (typeof actualizarPesoTotal === "function") {
      actualizarPesoTotal()
    }
  }
}

// Exportar funciones
export {
  cargarContenidoBolsa,
  confirmarEliminarObjetoDeBolsa,
  confirmarMoverObjetoAInventario,
  confirmarMoverObjetoEntreBolsas,
}
