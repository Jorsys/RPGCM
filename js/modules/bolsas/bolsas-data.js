// Funciones para gestionar los datos de las bolsas especiales
import { generateUUID } from "../utils.js" // Importar la función para generar UUIDs

// Función para obtener las bolsas especiales del personaje
function obtenerBolsasEspeciales() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje && personaje.bolsasEspeciales) {
    return personaje.bolsasEspeciales
  }
  return []
}

// Función para guardar las bolsas especiales en el personaje
function guardarBolsasEspeciales(bolsas) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (personaje) {
    personaje.bolsasEspeciales = bolsas
    localStorage.setItem("personajeActual", JSON.stringify(personaje))
  }
}

// Función para crear una nueva bolsa especial
function crearBolsaEspecial(nombre, descripcion = "") {
  const bolsas = obtenerBolsasEspeciales()

  const nuevaBolsa = {
    id: generateUUID(),
    nombre,
    descripcion,
    contenido: [],
  }

  bolsas.push(nuevaBolsa)
  guardarBolsasEspeciales(bolsas)

  return nuevaBolsa
}

// Función para eliminar una bolsa especial
function eliminarBolsaEspecial(id) {
  let bolsas = obtenerBolsasEspeciales()

  // Verificar si la bolsa tiene contenido
  const bolsa = bolsas.find((b) => b.id === id)
  if (bolsa && bolsa.contenido && bolsa.contenido.length > 0) {
    // Mover el contenido al inventario
    const personaje = JSON.parse(localStorage.getItem("personajeActual"))
    if (personaje) {
      if (!personaje.inventario) {
        personaje.inventario = []
      }

      personaje.inventario = [...personaje.inventario, ...bolsa.contenido]
      localStorage.setItem("personajeActual", JSON.stringify(personaje))
    }
  }

  // Eliminar la bolsa
  bolsas = bolsas.filter((b) => b.id !== id)
  guardarBolsasEspeciales(bolsas)
}

// Función para agregar un objeto a una bolsa especial
function agregarObjetoABolsa(bolsaId, objeto) {
  const bolsas = obtenerBolsasEspeciales()
  const index = bolsas.findIndex((b) => b.id === bolsaId)

  if (index !== -1) {
    if (!bolsas[index].contenido) {
      bolsas[index].contenido = []
    }

    bolsas[index].contenido.push(objeto)
    guardarBolsasEspeciales(bolsas)
    return true
  }

  return false
}

// Función para eliminar un objeto de una bolsa especial
function eliminarObjetoDeBolsa(bolsaId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const index = bolsas.findIndex((b) => b.id === bolsaId)

  if (index !== -1 && bolsas[index].contenido) {
    bolsas[index].contenido = bolsas[index].contenido.filter((o) => o.id !== objetoId)
    guardarBolsasEspeciales(bolsas)
    return true
  }

  return false
}

// Función para actualizar un objeto en una bolsa especial
function actualizarObjetoEnBolsa(bolsaId, objeto) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1 && bolsas[bolsaIndex].contenido) {
    const objetoIndex = bolsas[bolsaIndex].contenido.findIndex((o) => o.id === objeto.id)

    if (objetoIndex !== -1) {
      bolsas[bolsaIndex].contenido[objetoIndex] = objeto
      guardarBolsasEspeciales(bolsas)
      return true
    }
  }

  return false
}

// Función para mover un objeto de una bolsa al inventario
function moverObjetoAInventario(bolsaId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1 && bolsas[bolsaIndex].contenido) {
    const objeto = bolsas[bolsaIndex].contenido.find((o) => o.id === objetoId)

    if (objeto) {
      // Eliminar el objeto de la bolsa
      bolsas[bolsaIndex].contenido = bolsas[bolsaIndex].contenido.filter((o) => o.id !== objetoId)
      guardarBolsasEspeciales(bolsas)

      // Agregar el objeto al inventario
      const personaje = JSON.parse(localStorage.getItem("personajeActual"))
      if (personaje) {
        if (!personaje.inventario) {
          personaje.inventario = []
        }

        personaje.inventario.push(objeto)
        localStorage.setItem("personajeActual", JSON.stringify(personaje))

        return true
      }
    }
  }

  return false
}

// Función para mover un objeto entre bolsas
function moverObjetoEntreBolsas(bolsaOrigenId, bolsaDestinoId, objetoId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsaOrigenIndex = bolsas.findIndex((b) => b.id === bolsaOrigenId)
  const bolsaDestinoIndex = bolsas.findIndex((b) => b.id === bolsaDestinoId)

  if (
    bolsaOrigenIndex !== -1 &&
    bolsaDestinoIndex !== -1 &&
    bolsas[bolsaOrigenIndex].contenido &&
    bolsaOrigenId !== bolsaDestinoId
  ) {
    const objetoIndex = bolsas[bolsaOrigenIndex].contenido.findIndex((o) => o.id === objetoId)

    if (objetoIndex !== -1) {
      // Obtener el objeto
      const objeto = { ...bolsas[bolsaOrigenIndex].contenido[objetoIndex] }

      // Eliminar el objeto de la bolsa
      bolsas[bolsaOrigenIndex].contenido.splice(objetoIndex, 1)

      // Agregar el objeto a la bolsa de destino
      if (!bolsas[bolsaDestinoIndex].contenido) {
        bolsas[bolsaDestinoIndex].contenido = []
      }

      bolsas[bolsaDestinoIndex].contenido.push(objeto)

      // Guardar cambios
      guardarBolsasEspeciales(bolsas)
      return true
    }
  }

  return false
}

// Función para mover un objeto del inventario a una bolsa
function moverObjetoDeInventarioABolsa(objetoId, bolsaId) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.inventario) return false

  const objetoIndex = personaje.inventario.findIndex((o) => o.id === objetoId)
  if (objetoIndex === -1) return false

  // Obtener el objeto
  const objeto = { ...personaje.inventario[objetoIndex] }

  // Eliminar el objeto del inventario
  personaje.inventario.splice(objetoIndex, 1)

  // Agregar el objeto a la bolsa
  const bolsas = obtenerBolsasEspeciales()
  const bolsaIndex = bolsas.findIndex((b) => b.id === bolsaId)

  if (bolsaIndex !== -1) {
    if (!bolsas[bolsaIndex].contenido) {
      bolsas[bolsaIndex].contenido = []
    }

    bolsas[bolsaIndex].contenido.push(objeto)

    // Guardar cambios
    personaje.bolsasEspeciales = bolsas
    localStorage.setItem("personajeActual", JSON.stringify(personaje))

    return true
  }

  // Si no se pudo agregar a la bolsa, restaurar el objeto al inventario
  personaje.inventario.push(objeto)
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  return false
}

// Función para calcular el peso total de una bolsa
function calcularPesoBolsa(bolsaId) {
  const bolsas = obtenerBolsasEspeciales()
  const bolsa = bolsas.find((b) => b.id === bolsaId)

  if (bolsa && bolsa.contenido && bolsa.contenido.length > 0) {
    return bolsa.contenido.reduce((total, objeto) => {
      const cantidad = objeto.cantidad || 1
      return total + objeto.peso * cantidad
    }, 0)
  }

  return 0
}

// Exportar funciones
export {
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
  generateUUID,
}
