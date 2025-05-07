// Funciones para gestionar el peso del personaje

// Función para actualizar el peso total
function actualizarPesoTotal() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  let pesoTotal = 0

  // Peso del inventario
  if (personaje.inventario) {
    personaje.inventario.forEach((objeto) => {
      const cantidad = objeto.cantidad || 1
      pesoTotal += objeto.peso * cantidad
    })
  }

  // Peso de los recursos
  if (personaje.recursos) {
    personaje.recursos.forEach((recurso) => {
      pesoTotal += recurso.peso * recurso.cantidad
    })
  }

  // Peso del equipamiento
  if (personaje.equipamiento) {
    // Armas
    if (personaje.equipamiento.armas) {
      personaje.equipamiento.armas.forEach((arma) => {
        pesoTotal += arma.peso || 0
      })
    }

    // Armaduras
    if (personaje.equipamiento.armaduras) {
      personaje.equipamiento.armaduras.forEach((armadura) => {
        pesoTotal += armadura.peso || 0
      })
    }

    // Municiones
    if (personaje.equipamiento.municiones) {
      personaje.equipamiento.municiones.forEach((municion) => {
        const cantidad = municion.cantidad || 1
        pesoTotal += (municion.peso || 0) * cantidad
      })
    }
  }

  // Peso de las bolsas especiales
  if (personaje.bolsasEspeciales) {
    personaje.bolsasEspeciales.forEach((bolsa) => {
      if (bolsa.contenido) {
        bolsa.contenido.forEach((objeto) => {
          const cantidad = objeto.cantidad || 1
          pesoTotal += objeto.peso * cantidad
        })
      }
    })
  }

  // Actualizar el elemento en la interfaz
  const pesoTotalElement = document.getElementById("pesoTotal")
  if (pesoTotalElement) {
    pesoTotalElement.textContent = pesoTotal.toFixed(2)
  }
}

// Exportar funciones
export { actualizarPesoTotal }
