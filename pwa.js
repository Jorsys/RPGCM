// Registrar el Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration.scope)
      })
      .catch((error) => {
        console.log("Error al registrar el Service Worker:", error)
      })
  })
}

// Variables para la instalación de la PWA
let deferredPrompt
const installContainer = document.getElementById("install-container")
const installBtn = document.getElementById("installBtn")

// Escuchar el evento beforeinstallprompt
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevenir que Chrome muestre la mini-infobar
  e.preventDefault()
  // Guardar el evento para usarlo más tarde
  deferredPrompt = e
  // Mostrar el botón de instalación
  if (installContainer) {
    installContainer.style.display = "flex"
  }
})

// Manejar el clic en el botón de instalación
if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
      return
    }
    // Mostrar el prompt de instalación
    deferredPrompt.prompt()
    // Esperar a que el usuario responda al prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    // Limpiar la variable deferredPrompt ya que no se puede usar dos veces
    deferredPrompt = null
    // Ocultar el botón de instalación
    if (installContainer) {
      installContainer.style.display = "none"
    }
  })
}

// Detectar cuando la app ha sido instalada
window.addEventListener("appinstalled", (evt) => {
  console.log("RPG Character Manager ha sido instalada")
  // Ocultar el botón de instalación
  if (installContainer) {
    installContainer.style.display = "none"
  }

  // Mostrar mensaje de éxito
  showToast("¡Aplicación instalada con éxito!")
})

// Función para mostrar un toast (notificación temporal)
function showToast(message) {
  // Crear elemento toast si no existe
  let toast = document.getElementById("toast")
  if (!toast) {
    toast = document.createElement("div")
    toast.id = "toast"
    toast.style.position = "fixed"
    toast.style.bottom = "20px"
    toast.style.left = "50%"
    toast.style.transform = "translateX(-50%)"
    toast.style.backgroundColor = "#333"
    toast.style.color = "#fff"
    toast.style.padding = "12px 20px"
    toast.style.borderRadius = "4px"
    toast.style.zIndex = "1000"
    toast.style.opacity = "0"
    toast.style.transition = "opacity 0.3s ease-in-out"
    document.body.appendChild(toast)
  }

  // Mostrar mensaje
  toast.textContent = message
  toast.style.opacity = "1"

  // Ocultar después de 3 segundos
  setTimeout(() => {
    toast.style.opacity = "0"
  }, 3000)
}

// Función para detectar si la app está siendo ejecutada en modo standalone
function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  )
}

// Ajustar la UI si la app está en modo standalone
if (isRunningStandalone()) {
  console.log("La aplicación se está ejecutando en modo standalone")
  // Aquí podríamos hacer ajustes específicos para el modo standalone
  document.addEventListener("DOMContentLoaded", () => {
    // Ocultar el banner de instalación
    if (installContainer) {
      installContainer.style.display = "none"
    }

    // Añadir clase al body para estilos específicos de standalone
    document.body.classList.add("standalone-mode")
  })
}

// Sincronización en segundo plano
async function registerBackgroundSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register("sync-personajes")
      console.log("Sincronización en segundo plano registrada")
    } catch (error) {
      console.error("Error al registrar la sincronización en segundo plano:", error)
    }
  } else {
    console.log("La sincronización en segundo plano no está soportada en este navegador")
  }
}

// Función para guardar datos y registrar sincronización
window.saveDataAndSync = (key, data) => {
  // Guardar datos en localStorage
  localStorage.setItem(key, JSON.stringify(data))

  // Registrar sincronización en segundo plano
  registerBackgroundSync()
}

// Detectar cambios en la conexión
window.addEventListener("online", () => {
  console.log("Conexión recuperada")
  // Intentar sincronizar datos pendientes
  registerBackgroundSync()
  showToast("Conexión recuperada")
})

window.addEventListener("offline", () => {
  console.log("Conexión perdida")
  showToast("Sin conexión. Los cambios se guardarán localmente.")

  // Mostrar notificación al usuario
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("RPG Character Manager", {
      body: "Estás offline. Tus cambios se guardarán localmente y se sincronizarán cuando vuelvas a estar en línea.",
      icon: "/icons/icon-192x192.png",
    })
  }
})

// Solicitar permiso para notificaciones
if ("Notification" in window && Notification.permission !== "denied") {
  Notification.requestPermission()
}

// Verificar si hay actualizaciones del Service Worker
function checkForUpdates() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update()
    })
  }
}

// Verificar actualizaciones cada hora
setInterval(checkForUpdates, 3600000)

// Verificar actualizaciones cuando la página se vuelve visible
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    checkForUpdates()
  }
})

// Añadir estilos CSS para el modo standalone
if (isRunningStandalone()) {
  const style = document.createElement("style")
  style.textContent = `
    body.standalone-mode {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  `
  document.head.appendChild(style)
}
