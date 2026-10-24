import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const databasePath = path.join(projectDirectory, 'server', 'data', 'urbanstyle.db')

if (!fs.existsSync(databasePath)) {
  throw new Error('No se encontró la base SQLite. Inicia la API para crear los datos iniciales.')
}

const database = new Database(databasePath, { readonly: true })
try {
  const products = database.prepare('SELECT name, image FROM products').all()
  if (!products.length) throw new Error('La base SQLite no contiene productos de catálogo.')

  const missingImages = products.filter(({ image }) => {
    if (!image) return false
    let imageDirectory
    if (image.startsWith('/catalogo-images/')) {
      imageDirectory = path.join(projectDirectory, 'src', 'Imagen')
    } else if (image.startsWith('/uploads/')) {
      imageDirectory = path.join(projectDirectory, 'server', 'uploads')
    } else {
      return true
    }
    return !fs.existsSync(path.join(imageDirectory, path.basename(image)))
  })

  if (missingImages.length) {
    throw new Error(`Hay productos con imágenes sin archivo local: ${missingImages.map(({ name }) => name).join(', ')}`)
  }
} finally {
  database.close()
}
