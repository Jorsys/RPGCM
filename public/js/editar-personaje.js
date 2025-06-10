// Función para cargar los datos del personaje en el formulario de edición
function cargarEdicionPersonaje() {
  console.log("Cargando datos para edición...")

  try {
    const personajeJSON = localStorage.getItem("personajeActual")
    console.log("Datos del personaje actual:", personajeJSON)

    if (!personajeJSON) {
      console.error("No hay personaje actual")
      alert("No hay ningún personaje seleccionado. Serás redirigido a la página principal.")
      window.location.href = "index.html"
      return
    }

    const personaje = JSON.parse(personajeJSON)
    console.log("Personaje parseado:", personaje)

    // Cargar datos básicos
    const nombreInput = document.getElementById("nombre")
    const claseInput = document.getElementById("clase")
    const nivelInput = document.getElementById("nivel")

    if (nombreInput) nombreInput.value = personaje.nombre || ""
    if (claseInput) claseInput.value = personaje.clase || ""
    if (nivelInput) nivelInput.value = personaje.nivel || "1"

    // Cargar atributos vitales
    const vidaInput = document.getElementById("vida")
    const aguanteInput = document.getElementById("aguante")
    const manaInput = document.getElementById("mana")

    if (vidaInput) vidaInput.value = personaje.vida || "0"
    if (aguanteInput) aguanteInput.value = personaje.aguante || "0"
    if (manaInput) manaInput.value = personaje.mana || "0"

    // Cargar atributos de combate
    const combateInput = document.getElementById("combate")
    const punteriaInput = document.getElementById("punteria")
    const magiaInput = document.getElementById("magia")

    if (combateInput) combateInput.value = personaje.combate || "0"
    if (punteriaInput) punteriaInput.value = personaje.punteria || "0"
    if (magiaInput) magiaInput.value = personaje.magia || "0"

    // Cargar habilidades derivadas
    const buscarInput = document.getElementById("buscar")
    const sigiloInput = document.getElementById("sigilo")
    const observarInput = document.getElementById("observar")
    const cerraduraInput = document.getElementById("cerradura")
    const trampasInput = document.getElementById("trampas")
    const manipularObjetosInput = document.getElementById("manipularObjetos")
    const acrobaciaInput = document.getElementById("acrobacia")
    const desarmarInput = document.getElementById("desarmar")
    const equitacionInput = document.getElementById("equitacion")
    const elocuenciaInput = document.getElementById("elocuencia")
    const resolverInput = document.getElementById("resolver")

    if (buscarInput) buscarInput.value = personaje.buscar || "0"
    if (sigiloInput) sigiloInput.value = personaje.sigilo || "0"
    if (observarInput) observarInput.value = personaje.observar || "0"
    if (cerraduraInput) cerraduraInput.value = personaje.cerradura || "0"
    if (trampasInput) trampasInput.value = personaje.trampas || "0"
    if (manipularObjetosInput) manipularObjetosInput.value = personaje.manipularObjetos || "0"
    if (acrobaciaInput) acrobaciaInput.value = personaje.acrobacia || "0"
    if (desarmarInput) desarmarInput.value = personaje.desarmar || "0"
    if (equitacionInput) equitacionInput.value = personaje.equitacion || "0"
    if (elocuenciaInput) elocuenciaInput.value = personaje.elocuencia || "0"
    if (resolverInput) resolverInput.value = personaje.resolver || "0"

    console.log("Datos cargados en el formulario correctamente")
  } catch (error) {
    console.error("Error al cargar los datos para edición:", error)
    alert("Error al cargar los datos del personaje")
  }
}

// Función para guardar los cambios del personaje
function guardarPersonaje() {
  console.log("Guardando cambios del personaje...")

  try {
    const personajeJSON = localStorage.getItem("personajeActual")
    if (!personajeJSON) {
      alert("No hay personaje para guardar")
      return
    }

    const personaje = JSON.parse(personajeJSON)

    // Obtener datos básicos
    const nombreInput = document.getElementById("nombre")
    const claseInput = document.getElementById("clase")
    const nivelInput = document.getElementById("nivel")

    if (nombreInput) personaje.nombre = nombreInput.value
    if (claseInput) personaje.clase = claseInput.value
    if (nivelInput) personaje.nivel = Number.parseInt(nivelInput.value) || 1

    // Obtener atributos vitales
    const vidaInput = document.getElementById("vida")
    const aguanteInput = document.getElementById("aguante")
    const manaInput = document.getElementById("mana")

    if (vidaInput) personaje.vida = Number.parseInt(vidaInput.value) || 0
    if (aguanteInput) personaje.aguante = Number.parseInt(aguanteInput.value) || 0
    if (manaInput) personaje.mana = Number.parseInt(manaInput.value) || 0

    // Obtener atributos de combate
    const combateInput = document.getElementById("combate")
    const punteriaInput = document.getElementById("punteria")
    const magiaInput = document.getElementById("magia")

    if (combateInput) personaje.combate = Number.parseInt(combateInput.value) || 0
    if (punteriaInput) personaje.punteria = Number.parseInt(punteriaInput.value) || 0
    if (magiaInput) personaje.magia = Number.parseInt(magiaInput.value) || 0

    // Obtener habilidades derivadas
    const buscarInput = document.getElementById("buscar")
    const sigiloInput = document.getElementById("sigilo")
    const observarInput = document.getElementById("observar")
    const cerraduraInput = document.getElementById("cerradura")
    const trampasInput = document.getElementById("trampas")
    const manipularObjetosInput = document.getElementById("manipularObjetos")
    const acrobaciaInput = document.getElementById("acrobacia")
    const desarmarInput = document.getElementById("desarmar")
    const equitacionInput = document.getElementById("equitacion")
    const elocuenciaInput = document.getElementById("elocuencia")
    const resolverInput = document.getElementById("resolver")

    if (buscarInput) personaje.buscar = Number.parseInt(buscarInput.value) || 0
    if (sigiloInput) personaje.sigilo = Number.parseInt(sigiloInput.value) || 0
    if (observarInput) personaje.observar = Number.parseInt(observarInput.value) || 0
    if (cerraduraInput) personaje.cerradura = Number.parseInt(cerraduraInput.value) || 0
    if (trampasInput) personaje.trampas = Number.parseInt(trampasInput.value) || 0
    if (manipularObjetosInput) personaje.manipularObjetos = Number.parseInt(manipularObjetosInput.value) || 0
    if (acrobaciaInput) personaje.acrobacia = Number.parseInt(acrobaciaInput.value) || 0
    if (desarmarInput) personaje.desarmar = Number.parseInt(desarmarInput.value) || 0
    if (equitacionInput) personaje.equitacion = Number.parseInt(equitacionInput.value) || 0
    if (elocuenciaInput) personaje.elocuencia = Number.parseInt(elocuenciaInput.value) || 0
    if (resolverInput) personaje.resolver = Number.parseInt(resolverInput.value) || 0

    // Guardar el personaje actual
    localStorage.setItem("personajeActual", JSON.stringify(personaje))

    // Actualizar en la lista de personajes
    const personajesJSON = localStorage.getItem("personajes")
    if (personajesJSON) {
      const personajes = JSON.parse(personajesJSON)
      const index = personajes.findIndex((p) => p.id === personaje.id)
      if (index !== -1) {
        personajes[index] = personaje
        localStorage.setItem("personajes", JSON.stringify(personajes))
      }
    }

    console.log("Personaje guardado correctamente:", personaje)
    alert("Personaje guardado correctamente")

    // Redirigir a la ficha de personaje
    window.location.href = "ficha-personaje.html"
  } catch (error) {
    console.error("Error al guardar el personaje:", error)
    alert("Error al guardar el personaje")
  }
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando edición de personaje...")

  // Cargar datos del personaje
  cargarEdicionPersonaje()

  // Configurar botón de guardar
  const saveBtn = document.getElementById("saveBtn")
  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Botón guardar clickeado")
      guardarPersonaje()
    })
    console.log("Event listener del botón guardar configurado")
  } else {
    console.error("No se encontró el botón de guardar")
  }
})
