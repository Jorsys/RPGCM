// Función para cargar los datos del personaje en la ficha
function cargarFichaPersonaje() {
  console.log("Cargando ficha de personaje...")

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
    const nombreElement = document.getElementById("nombrePersonaje")
    const claseElement = document.getElementById("clasePersonaje")
    const nivelElement = document.getElementById("nivelPersonaje")

    if (nombreElement) nombreElement.textContent = personaje.nombre || "Sin nombre"
    if (claseElement) claseElement.textContent = personaje.clase || "Sin clase"
    if (nivelElement) nivelElement.textContent = personaje.nivel || "1"

    // Cargar atributos básicos
    const percepcionElement = document.getElementById("percepcionValor")
    const destrezaElement = document.getElementById("destrezaValor")
    const agilidadElement = document.getElementById("agilidadValor")
    const inteligenciaElement = document.getElementById("inteligenciaValor")

    if (percepcionElement) percepcionElement.textContent = personaje.percepcion || "0"
    if (destrezaElement) destrezaElement.textContent = personaje.destreza || "0"
    if (agilidadElement) agilidadElement.textContent = personaje.agilidad || "0"
    if (inteligenciaElement) inteligenciaElement.textContent = personaje.inteligencia || "0"

    // Cargar atributos vitales
    const vidaElement = document.getElementById("vidaValor")
    const aguanteElement = document.getElementById("aguanteValor")
    const manaElement = document.getElementById("manaValor")

    if (vidaElement) vidaElement.textContent = personaje.vida || "0"
    if (aguanteElement) aguanteElement.textContent = personaje.aguante || "0"
    if (manaElement) manaElement.textContent = personaje.mana || "0"

    // Cargar atributos de combate
    const combateElement = document.getElementById("combateValor")
    const punteriaElement = document.getElementById("punteriaValor")
    const magiaElement = document.getElementById("magiaValor")

    if (combateElement) combateElement.textContent = personaje.combate || "0"
    if (punteriaElement) punteriaElement.textContent = personaje.punteria || "0"
    if (magiaElement) magiaElement.textContent = personaje.magia || "0"

    // Cargar habilidades derivadas
    const buscarElement = document.getElementById("buscarValor")
    const sigiloElement = document.getElementById("sigiloValor")
    const observarElement = document.getElementById("observarValor")
    const cerraduraElement = document.getElementById("cerraduraValor")
    const trampasElement = document.getElementById("trampasValor")
    const manipularObjetosElement = document.getElementById("manipularObjetosValor")
    const acrobaciaElement = document.getElementById("acrobaciaValor")
    const desarmarElement = document.getElementById("desarmarValor")
    const equitacionElement = document.getElementById("equitacionValor")
    const elocuenciaElement = document.getElementById("elocuenciaValor")
    const resolverElement = document.getElementById("resolverValor")

    if (buscarElement) buscarElement.textContent = personaje.buscar || "0"
    if (sigiloElement) sigiloElement.textContent = personaje.sigilo || "0"
    if (observarElement) observarElement.textContent = personaje.observar || "0"
    if (cerraduraElement) cerraduraElement.textContent = personaje.cerradura || "0"
    if (trampasElement) trampasElement.textContent = personaje.trampas || "0"
    if (manipularObjetosElement) manipularObjetosElement.textContent = personaje.manipularObjetos || "0"
    if (acrobaciaElement) acrobaciaElement.textContent = personaje.acrobacia || "0"
    if (desarmarElement) desarmarElement.textContent = personaje.desarmar || "0"
    if (equitacionElement) equitacionElement.textContent = personaje.equitacion || "0"
    if (elocuenciaElement) elocuenciaElement.textContent = personaje.elocuencia || "0"
    if (resolverElement) resolverElement.textContent = personaje.resolver || "0"

    console.log("Ficha de personaje cargada correctamente")
  } catch (error) {
    console.error("Error al cargar la ficha del personaje:", error)
    alert("Error al cargar los datos del personaje")
  }
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando ficha de personaje...")
  cargarFichaPersonaje()
})
