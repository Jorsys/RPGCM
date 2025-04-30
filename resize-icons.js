// Este script es solo para referencia, no se incluye en la aplicación final
// Muestra cómo se podrían generar los iconos más pequeños a partir de los grandes

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const sizes = [72, 96, 128, 144, 152, 384]
const sourceIcon = path.join(__dirname, "icons/icon-512x512.png")

async function resizeIcons() {
  for (const size of sizes) {
    const outputPath = path.join(__dirname, `icons/icon-${size}x${size}.png`)
    await sharp(sourceIcon).resize(size, size).toFile(outputPath)
    console.log(`Created icon: ${outputPath}`)
  }
}

resizeIcons().catch((err) => console.error("Error resizing icons:", err))
