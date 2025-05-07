// Funciones para gestionar los atributos derivados del personaje

// Función para cargar los atributos derivados
function cargarAtributosDerivados() {
  const personaje = JSON.parse(localStorage.getItem("personajeActual"))
  if (!personaje) return

  // Cargar atributos básicos
  const percepcion = personaje.atributos?.percepcion || 0
  const destreza = personaje.atributos?.destreza || 0
  const agilidad = personaje.atributos?.agilidad || 0
  const inteligencia = personaje.atributos?.inteligencia || 0

  document.getElementById("percepcion").textContent = percepcion
  document.getElementById("destreza").textContent = destreza
  document.getElementById("agilidad").textContent = agilidad
  document.getElementById("inteligencia").textContent = inteligencia

  // Cargar habilidades de percepción
  const buscar = personaje.atributos?.buscar || 0
  const sigilo = personaje.atributos?.sigilo || 0
  const observar = personaje.atributos?.observar || 0

  document.getElementById("buscar").textContent = buscar
  document.getElementById("sigilo").textContent = sigilo
  document.getElementById("observar").textContent = observar

  // Cargar habilidades de destreza
  const cerradura = personaje.atributos?.cerradura || 0
  const trampas = personaje.atributos?.trampas || 0
  const manipularObjetos = personaje.atributos?.manipularObjetos || 0

  document.getElementById("cerradura").textContent = cerradura
  document.getElementById("trampas").textContent = trampas
  document.getElementById("manipularObjetos").textContent = manipularObjetos

  // Cargar habilidades de agilidad
  const acrobacia = personaje.atributos?.acrobacia || 0
  const desarmar = personaje.atributos?.desarmar || 0
  const equitacion = personaje.atributos?.equitacion || 0

  document.getElementById("acrobacia").textContent = acrobacia
  document.getElementById("desarmar").textContent = desarmar
  document.getElementById("equitacion").textContent = equitacion

  // Cargar habilidades de inteligencia
  const elocuencia = personaje.atributos?.elocuencia || 0
  const resolver = personaje.atributos?.resolver || 0

  document.getElementById("elocuencia").textContent = elocuencia
  document.getElementById("resolver").textContent = resolver
}

// Exportar funciones
export { cargarAtributosDerivados }
