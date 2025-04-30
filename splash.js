// Mostrar pantalla de splash al cargar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // Crear la pantalla de splash si no existe
  if (!document.querySelector(".splash-screen")) {
    const splash = document.createElement("div")
    splash.className = "splash-screen"

    const logo = document.createElement("img")
    logo.src = "icons/icon-192x192.png"
    logo.alt = "RPG Character Manager"
    logo.className = "splash-logo"

    const title = document.createElement("h1")
    title.className = "splash-title"
    title.textContent = "RPG Character Manager"

    const spinner = document.createElement("div")
    spinner.className = "splash-spinner"

    splash.appendChild(logo)
    splash.appendChild(title)
    splash.appendChild(spinner)

    document.body.appendChild(splash)

    // Ocultar la pantalla de splash después de 2 segundos
    setTimeout(() => {
      splash.style.opacity = "0"
      setTimeout(() => {
        splash.remove()
      }, 500)
    }, 2000)
  }
})
