import Database from 'better-sqlite3'
import { randomBytes, scryptSync } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectDirectory = path.resolve(serverDirectory, '..')
const dataDirectory = path.join(serverDirectory, 'data')
fs.mkdirSync(dataDirectory, { recursive: true })

export const database = new Database(path.join(dataDirectory, 'urbanstyle.db'))
database.pragma('journal_mode = WAL')
database.pragma('foreign_keys = ON')

database.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    category TEXT NOT NULL DEFAULT 'Chaquetas',
    discountPercent INTEGER NOT NULL DEFAULT 0 CHECK (discountPercent >= 0 AND discountPercent <= 70),
    image TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    tokenHash TEXT PRIMARY KEY,
    adminId INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    expiresAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS customer_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    address2 TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    region TEXT NOT NULL DEFAULT '',
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customer_sessions (
    tokenHash TEXT PRIMARY KEY,
    customerId INTEGER NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
    expiresAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId INTEGER REFERENCES customer_users(id) ON DELETE SET NULL,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    shippingAddress TEXT NOT NULL,
    shippingAddress2 TEXT NOT NULL DEFAULT '',
    shippingCity TEXT NOT NULL,
    shippingRegion TEXT NOT NULL,
    shippingNotes TEXT NOT NULL DEFAULT '',
    itemsJson TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    shipping INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_payment',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const existingProducts = database.prepare('SELECT COUNT(*) AS count FROM products').get()

if (existingProducts.count === 0) {
  const seedProducts = [
    {
      name: 'Chaqueta Urban Fur',
      description: 'Chaqueta negra de corte urbano con cuello de textura y cierre frontal.',
      price: 45990,
      stock: 12,
      category: 'Chaquetas',
      discountPercent: 15,
      image: '/catalogo-images/catalogo-chaqueta-fur.jpg'
    },
    {
      name: 'Chaqueta Racing Black',
      description: 'Chaqueta bomber negra con gráfica deportiva y detalles reflectantes.',
      price: 59990,
      stock: 8,
      category: 'Chaquetas',
      discountPercent: 10,
      image: '/catalogo-images/catalogo-chaqueta-racing.jpg'
    },
    {
      name: 'Cortaviento Tech Grey',
      description: 'Cortaviento ligero gris con paneles contrastantes y silueta técnica.',
      price: 49990,
      stock: 15,
      category: 'Cortavientos',
      discountPercent: 0,
      image: '/catalogo-images/catalogo-cortaviento-tech.jpg'
    },
    {
      name: 'Jeans Ripped Black',
      description: 'Jeans negros de corte relajado con detalles desgastados y cadenas.',
      price: 39990,
      stock: 10,
      category: 'Pantalones',
      discountPercent: 20,
      image: '/catalogo-images/catalogo-jeans-ripped.jpg'
    },
    {
      name: 'Cargo Utility Grey',
      description: 'Pantalón cargo gris de inspiración utilitaria para un fit urbano.',
      price: 44990,
      stock: 6,
      category: 'Pantalones',
      discountPercent: 0,
      image: '/catalogo-images/catalogo-pantalon-cargo.jpg'
    }
  ]

  const insertProduct = database.prepare(`
    INSERT INTO products (name, description, price, stock, category, discountPercent, image)
    VALUES (@name, @description, @price, @stock, @category, @discountPercent, @image)
  `)
  const seed = database.transaction((products) => {
    for (const product of products) insertProduct.run(product)
  })
  seed(seedProducts)
}

const additionalProducts = [
  {
    name: 'Polerón Street X White',
    description: 'Polerón blanco de manga larga con un gráfico urbano en negro en la espalda.',
    price: 24990,
    stock: 8,
    category: 'Polerones',
    discountPercent: 0,
    image: '/catalogo-images/poleron-street-x-white.jpg'
  },
  {
    name: 'Polera Bear Street Black',
    description: 'Polera negra de corte urbano con un llamativo gráfico de oso en la espalda.',
    price: 29990,
    stock: 8,
    category: 'Poleras',
    discountPercent: 0,
    image: '/catalogo-images/polera-bear-black.jpg'
  },
  {
    name: 'Sweater Knit Supreme Cream',
    description: 'Sweater tejido color crema con cuello alto y diseño gráfico en la espalda.',
    price: 79990,
    stock: 8,
    category: 'Polerones',
    discountPercent: 0,
    image: '/catalogo-images/sweater-knit-supreme-cream.webp'
  },
  {
    name: 'Polerón DC Urban Grey',
    description: 'Polerón urbano gris de cuello amplio con capas y detalles negros.',
    price: 54990,
    stock: 8,
    category: 'Polerones',
    discountPercent: 0,
    image: '/catalogo-images/poleron-dc-urban-grey.webp'
  },
  {
    name: 'Polera Polo York Black',
    description: 'Polera negra tipo polo con cuello blanco y gráfico urbano bordado.',
    price: 34990,
    stock: 8,
    category: 'Poleras',
    discountPercent: 0,
    image: '/catalogo-images/polera-polo-york-black.webp'
  },
  {
    name: 'Mochila Urban Utility Black',
    description: 'Mochila negra de estilo urbano con compartimentos y correas ajustables.',
    price: 39990,
    stock: 8,
    category: 'Accesorios',
    discountPercent: 0,
    image: '/catalogo-images/mochila-urban-utility-black.webp'
  }
]

const insertAdditionalProduct = database.prepare(`
  INSERT INTO products (name, description, price, stock, category, discountPercent, image)
  SELECT @name, @description, @price, @stock, @category, @discountPercent, @image
  WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = @name)
`)
const addCatalogProducts = database.transaction((products) => {
  for (const product of products) insertAdditionalProduct.run(product)
})
addCatalogProducts(additionalProducts)

export function ensureAdminCredentials(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const existingAdmin = database.prepare('SELECT id, email, passwordHash, passwordSalt FROM admin_users LIMIT 1').get()

  if (existingAdmin) {
    const currentHash = scryptSync(password, existingAdmin.passwordSalt, 64).toString('hex')
    if (existingAdmin.email === normalizedEmail && existingAdmin.passwordHash === currentHash) return

    const salt = randomBytes(16).toString('hex')
    const passwordHash = scryptSync(password, salt, 64).toString('hex')
    database.prepare(`
      UPDATE admin_users
      SET email = ?, passwordHash = ?, passwordSalt = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(normalizedEmail, passwordHash, salt, existingAdmin.id)
    database.prepare('DELETE FROM admin_sessions').run()
    return
  }

  const salt = randomBytes(16).toString('hex')
  const passwordHash = scryptSync(password, salt, 64).toString('hex')
  database.prepare(`
    INSERT INTO admin_users (email, passwordHash, passwordSalt)
    VALUES (?, ?, ?)
  `).run(normalizedEmail, passwordHash, salt)
}

export function publicCustomer(customer) {
  return {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    address2: customer.address2,
    city: customer.city,
    region: customer.region
  }
}

export { projectDirectory }
