// Funciones para gestionar el equipamiento del personaje
import { cargarInventarioAcordeon } from "./inventario.js"
import * as bootstrap from "bootstrap"

// Función para cargar el equipamiento
function cargarEquipamiento() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.equipamiento) return

  const equipamiento = personaje.equipamiento

  // Cargar armas
  if (equipamiento.armas) {
    const contenedorArmas = document.getElementById("weapons-container")
    if (contenedorArmas) {
      contenedorArmas.innerHTML = ""

      if (equipamiento.armas.length === 0) {
        contenedorArmas.innerHTML = '<p class="text-center">No tienes armas equipadas</p>'
      } else {
        equipamiento.armas.forEach((arma) => {
          const card = document.createElement("div")
          card.className = "card mb-2"
          card.innerHTML = `
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">${arma.nombre}</h6>
                                <div>
                                    <button class="btn btn-sm btn-outline-danger unequip-weapon" data-id="${arma.id}">
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-primary edit-equipped" data-id="${arma.id}" data-type="arma">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="card-text small mb-0">Daño: ${arma.daño || "-"} | Tipo: ${arma.tipoDaño || "-"}</p>
                        </div>
                    `

          contenedorArmas.appendChild(card)

          // Agregar evento para desequipar
          card.querySelector(".unequip-weapon").addEventListener("click", () => {
            desequiparArma(arma.id)
          })

          // Agregar evento para editar
          card.querySelector(".edit-equipped").addEventListener("click", () => {
            abrirModalEditarEquipado(arma.id, "arma")
          })
        })
      }
    }
  }

  // Cargar armaduras
  if (equipamiento.armaduras) {
    const contenedorArmaduras = document.getElementById("armor-container")
    if (contenedorArmaduras) {
      contenedorArmaduras.innerHTML = ""

      if (equipamiento.armaduras.length === 0) {
        contenedorArmaduras.innerHTML = '<p class="text-center">No tienes armaduras equipadas</p>'
      } else {
        equipamiento.armaduras.forEach((armadura) => {
          const card = document.createElement("div")
          card.className = "card mb-2"
          card.innerHTML = `
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">${armadura.nombre}</h6>
                                <div>
                                    <button class="btn btn-sm btn-outline-danger unequip-armor" data-id="${armadura.id}">
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-primary edit-equipped" data-id="${armadura.id}" data-type="armadura">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="card-text small mb-0">Protección: ${armadura.proteccion || "-"} | Tipo: ${armadura.tipoArmadura || "-"}</p>
                        </div>
                    `

          contenedorArmaduras.appendChild(card)

          // Agregar evento para desequipar
          card.querySelector(".unequip-armor").addEventListener("click", () => {
            desequiparArmadura(armadura.id)
          })

          // Agregar evento para editar
          card.querySelector(".edit-equipped").addEventListener("click", () => {
            abrirModalEditarEquipado(armadura.id, "armadura")
          })
        })
      }
    }
  }

  // Cargar municiones
  if (equipamiento.municiones) {
    const contenedorMuniciones = document.getElementById("ammo-container")
    if (contenedorMuniciones) {
      contenedorMuniciones.innerHTML = ""

      if (equipamiento.municiones.length === 0) {
        contenedorMuniciones.innerHTML = '<p class="text-center">No tienes municiones equipadas</p>'
      } else {
        equipamiento.municiones.forEach((municion) => {
          const card = document.createElement("div")
          card.className = "card mb-2"
          card.innerHTML = `
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">${municion.nombre}</h6>
                                <div>
                                    <span class="badge bg-primary me-1">${municion.cantidad}</span>
                                    <button class="btn btn-sm btn-outline-danger unequip-ammo" data-id="${municion.id}">
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-primary edit-equipped" data-id="${municion.id}" data-type="municion">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="card-text small mb-0">Tipo: ${municion.tipoMunicion || "-"}</p>
                        </div>
                    `

          contenedorMuniciones.appendChild(card)

          // Agregar evento para desequipar
          card.querySelector(".unequip-ammo").addEventListener("click", () => {
            desequiparMunicion(municion.id)
          })

          // Agregar evento para editar
          card.querySelector(".edit-equipped").addEventListener("click", () => {
            abrirModalEditarEquipado(municion.id, "municion")
          })
        })
      }
    }
  }
}

// Función para desequipar un arma
function desequiparArma(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.equipamiento || !personaje.equipamiento.armas) return

  // Encontrar el arma
  const arma = personaje.equipamiento.armas.find((a) => a.id === id)
  if (!arma) return

  // Eliminar el arma del equipamiento
  personaje.equipamiento.armas = personaje.equipamiento.armas.filter((a) => a.id !== id)

  // Agregar el arma al inventario
  if (!personaje.inventario) {
    personaje.inventario = []
  }
  personaje.inventario.push(arma)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarEquipamiento()
  cargarInventarioAcordeon()

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para desequipar una armadura
function desequiparArmadura(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.equipamiento || !personaje.equipamiento.armaduras) return

  // Encontrar la armadura
  const armadura = personaje.equipamiento.armaduras.find((a) => a.id === id)
  if (!armadura) return

  // Eliminar la armadura del equipamiento
  personaje.equipamiento.armaduras = personaje.equipamiento.armaduras.filter((a) => a.id !== id)

  // Agregar la armadura al inventario
  if (!personaje.inventario) {
    personaje.inventario = []
  }
  personaje.inventario.push(armadura)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarEquipamiento()
  cargarInventarioAcordeon()

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para desequipar una munición
function desequiparMunicion(id) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.equipamiento || !personaje.equipamiento.municiones) return

  // Encontrar la munición
  const municion = personaje.equipamiento.municiones.find((m) => m.id === id)
  if (!municion) return

  // Eliminar la munición del equipamiento
  personaje.equipamiento.municiones = personaje.equipamiento.municiones.filter((m) => m.id !== id)

  // Agregar la munición al inventario
  if (!personaje.inventario) {
    personaje.inventario = []
  }
  personaje.inventario.push(municion)

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarEquipamiento()
  cargarInventarioAcordeon()

  // Actualizar el peso total
  actualizarPesoTotal()
}

// Función para abrir el modal de editar equipado
function abrirModalEditarEquipado(id, tipo) {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.equipamiento) return

  let objeto

  switch (tipo) {
    case "arma":
      objeto = personaje.equipamiento.armas.find((a) => a.id === id)
      break
    case "armadura":
      objeto = personaje.equipamiento.armaduras.find((a) => a.id === id)
      break
    case "municion":
      objeto = personaje.equipamiento.municiones.find((m) => m.id === id)
      break
    default:
      return
  }

  if (!objeto) return

  const modal = new bootstrap.Modal(document.getElementById("editEquippedModal"))
  const form = document.getElementById("editEquippedForm")

  // Limpiar el formulario
  form.reset()

  // Establecer el título del modal
  document.getElementById("editEquippedModalLabel").textContent = `Editar ${tipo}`

  // Establecer los valores del objeto
  document.getElementById("equippedId").value = objeto.id
  document.getElementById("equippedType").value = tipo
  document.getElementById("equippedName").value = objeto.nombre

  // Mostrar campos específicos según el tipo
  const damageDivs = document.querySelectorAll(".damage-field")
  const armorDivs = document.querySelectorAll(".armor-field")
  const ammoDivs = document.querySelectorAll(".ammo-field")

  damageDivs.forEach((div) => (div.style.display = "none"))
  armorDivs.forEach((div) => (div.style.display = "none"))
  ammoDivs.forEach((div) => (div.style.display = "none"))

  switch (tipo) {
    case "arma":
      damageDivs.forEach((div) => (div.style.display = "block"))
      document.getElementById("equippedDamage").value = objeto.daño || ""
      document.getElementById("equippedDamageType").value = objeto.tipoDaño || ""
      break
    case "armadura":
      armorDivs.forEach((div) => (div.style.display = "block"))
      document.getElementById("equippedProtection").value = objeto.proteccion || ""
      document.getElementById("equippedArmorType").value = objeto.tipoArmadura || ""
      break
    case "municion":
      ammoDivs.forEach((div) => (div.style.display = "block"))
      document.getElementById("equippedAmmoType").value = objeto.tipoMunicion || ""
      document.getElementById("equippedQuantity").value = objeto.cantidad || 1
      break
  }

  // Configurar evento para guardar cambios
  form.onsubmit = (e) => {
    e.preventDefault()
    guardarCambiosEquipado()
    modal.hide()
  }

  // Configurar evento para desequipar
  document.getElementById("unequipBtn").onclick = () => {
    switch (tipo) {
      case "arma":
        desequiparArma(id)
        break
      case "armadura":
        desequiparArmadura(id)
        break
      case "municion":
        desequiparMunicion(id)
        break
    }
    modal.hide()
  }

  modal.show()
}

// Función para guardar cambios en un objeto equipado
function guardarCambiosEquipado() {
  const id = document.getElementById("equippedId").value
  const tipo = document.getElementById("equippedType").value
  const nombre = document.getElementById("equippedName").value

  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje || !personaje.equipamiento) return

  switch (tipo) {
    case "arma":
      const daño = document.getElementById("equippedDamage").value
      const tipoDaño = document.getElementById("equippedDamageType").value

      const armaIndex = personaje.equipamiento.armas.findIndex((a) => a.id === id)
      if (armaIndex !== -1) {
        personaje.equipamiento.armas[armaIndex] = {
          ...personaje.equipamiento.armas[armaIndex],
          nombre,
          daño,
          tipoDaño,
        }
      }
      break
    case "armadura":
      const proteccion = document.getElementById("equippedProtection").value
      const tipoArmadura = document.getElementById("equippedArmorType").value

      const armaduraIndex = personaje.equipamiento.armaduras.findIndex((a) => a.id === id)
      if (armaduraIndex !== -1) {
        personaje.equipamiento.armaduras[armaduraIndex] = {
          ...personaje.equipamiento.armaduras[armaduraIndex],
          nombre,
          proteccion,
          tipoArmadura,
        }
      }
      break
    case "municion":
      const tipoMunicion = document.getElementById("equippedAmmoType").value
      const cantidad = Number.parseInt(document.getElementById("equippedQuantity").value) || 1

      const municionIndex = personaje.equipamiento.municiones.findIndex((m) => m.id === id)
      if (municionIndex !== -1) {
        personaje.equipamiento.municiones[municionIndex] = {
          ...personaje.equipamiento.municiones[municionIndex],
          nombre,
          tipoMunicion,
          cantidad,
        }
      }
      break
  }

  // Guardar cambios
  localStorage.setItem("personajeActual", JSON.stringify(personaje))

  // Actualizar la interfaz
  cargarEquipamiento()
}

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

  // Actualizar el elemento en la interfaz
  const pesoTotalElement = document.getElementById("pesoTotal")
  if (pesoTotalElement) {
    pesoTotalElement.textContent = pesoTotal.toFixed(2)
  }
}

// Exportar funciones
export {
  cargarEquipamiento,
  desequiparArma,
  desequiparArmadura,
  desequiparMunicion,
  abrirModalEditarEquipado,
  guardarCambiosEquipado,
  actualizarPesoTotal,
}
