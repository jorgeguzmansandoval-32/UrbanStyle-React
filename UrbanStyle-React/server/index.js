import dotenv from 'dotenv'
import express from 'express'
import multer from 'multer'
import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  database,
  ensureAdminCredentials,
  publicCustomer,
  projectDirectory
} from './db.js'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const uploadDirectory = path.join(serverDirectory, 'uploads')
const envPath = path.join(projectDirectory, '.env')
dotenv.config({ path: envPath })
const port = Number(process.env.PORT) || 3001
const sessionDurationMs = 8 * 60 * 60 * 1000

fs.mkdirSync(uploadDirectory, { recursive: true })

function persistEnvironmentValue(name, value) {
  const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''
  const remaining = current
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith(`${name}=`))
  remaining.push(`${name}=${value}`)
  fs.writeFileSync(envPath, `${remaining.filter(Boolean).join('\n')}\n`, { mode: 0o600 })
}

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@urbanstyle.cl').trim().toLowerCase()
let adminPassword = process.env.ADMIN_PASSWORD?.trim()

if (!adminPassword) {
  adminPassword = randomBytes(18).toString('base64url')
  persistEnvironmentValue('ADMIN_PASSWORD', adminPassword)
  process.env.ADMIN_PASSWORD = adminPassword
  console.info(`Administrador inicializado (${adminEmail}); credenciales locales guardadas en .env.`)
}

ensureAdminCredentials(adminEmail, adminPassword)

const app = express()
app.disable('x-powered-by')
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'same-origin')
  response.setHeader('X-Frame-Options', 'DENY')
  next()
})
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadDirectory, { fallthrough: false, maxAge: '1d' }))
app.use('/catalogo-images', express.static(path.join(projectDirectory, 'src', 'Imagen'), { maxAge: '1d' }))

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      const extensions = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/avif': '.avif'
      }
      callback(null, `${randomBytes(16).toString('hex')}${extensions[file.mimetype] || ''}`)
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!acceptedTypes.includes(file.mimetype)) {
      callback(new Error('La imagen debe estar en formato JPG, PNG, WEBP o AVIF.'))
      return
    }
    callback(null, true)
  }
})

const findAdmin = database.prepare('SELECT id, email, passwordHash, passwordSalt FROM admin_users WHERE email = ?')
const insertSession = database.prepare('INSERT INTO admin_sessions (tokenHash, adminId, expiresAt) VALUES (?, ?, ?)')
const findSession = database.prepare(`
  SELECT admin_users.id, admin_users.email
  FROM admin_sessions
  JOIN admin_users ON admin_users.id = admin_sessions.adminId
  WHERE admin_sessions.tokenHash = ? AND admin_sessions.expiresAt > ?
`)
const findCustomer = database.prepare('SELECT * FROM customer_users WHERE email = ?')
const findCustomerSession = database.prepare(`
  SELECT customer_users.*
  FROM customer_sessions
  JOIN customer_users ON customer_users.id = customer_sessions.customerId
  WHERE customer_sessions.tokenHash = ? AND customer_sessions.expiresAt > ?
`)

const customerPasswordHash = (password, salt) => scryptSync(password, salt, 64).toString('hex')

function setSessionCookie(response, name, token) {
  response.cookie(name, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/api',
    maxAge: sessionDurationMs
  })
}

function removeSessionCookie(response, name) {
  response.clearCookie(name, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/api'
  })
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

function getCookie(request, name) {
  const cookieHeader = request.headers.cookie || ''
  const cookie = cookieHeader.split(';').map((value) => value.trim()).find((value) => value.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : ''
}

function requireAdmin(request, response, next) {
  const token = getCookie(request, 'urbanstyle_admin')
  if (token.length !== 64) {
    response.status(401).json({ error: 'Debes iniciar sesión como administrador.' })
    return
  }

  const admin = findSession.get(hashToken(token), Date.now())
  if (!admin) {
    response.clearCookie('urbanstyle_admin', { httpOnly: true, sameSite: 'strict', path: '/api' })
    response.status(401).json({ error: 'La sesión de administrador expiró. Inicia sesión nuevamente.' })
    return
  }

  request.admin = admin
  next()
}

function validarProducto(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const category = typeof body.category === 'string' ? body.category.trim() : ''
  const price = Number(body.price)
  const stock = Number(body.stock)
  const discountPercent = Number(body.discountPercent || 0)
  const allowedCategories = ['Chaquetas', 'Cortavientos', 'Polerones', 'Pantalones', 'Poleras', 'Accesorios']

  if (!name || name.length > 80) throw new Error('El nombre es obligatorio y debe tener hasta 80 caracteres.')
  if (!description || description.length > 500) throw new Error('La descripción es obligatoria y debe tener hasta 500 caracteres.')
  if (!allowedCategories.includes(category)) throw new Error('Selecciona una categoría válida.')
  if (!Number.isSafeInteger(price) || price < 1) throw new Error('El precio debe ser un entero mayor a cero.')
  if (!Number.isSafeInteger(stock) || stock < 0) throw new Error('El stock debe ser un entero igual o mayor a cero.')
  if (!Number.isInteger(discountPercent) || discountPercent < 0 || discountPercent > 70) {
    throw new Error('El descuento debe ser un entero entre 0 y 70.')
  }

  return { name, description, price, stock, category, discountPercent }
}

function productWithImage(body, file, existingImage = '') {
  return {
    ...validarProducto(body),
    image: file ? `/uploads/${file.filename}` : existingImage
  }
}

function removeUploadedImage(image) {
  if (!image?.startsWith('/uploads/')) return
  const filename = path.basename(image)
  const imagePath = path.join(uploadDirectory, filename)
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
}

function getProducts() {
  return database.prepare(`
    SELECT id, name, description, price, stock, category, discountPercent, image, createdAt
    FROM products
    ORDER BY id
  `).all()
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'UrbanStyle API' })
})

app.get('/api/products', (_request, response) => {
  response.json(getProducts())
})

app.post('/api/auth/login', (request, response) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''
  const admin = findAdmin.get(email)

  if (!admin || !password || password.length > 200) {
    response.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    return
  }

  const passwordHash = scryptSync(password, admin.passwordSalt, 64)
  const storedHash = Buffer.from(admin.passwordHash, 'hex')
  if (storedHash.length !== passwordHash.length || !timingSafeEqual(storedHash, passwordHash)) {
    response.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    return
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = Date.now() + sessionDurationMs
  insertSession.run(hashToken(token), admin.id, expiresAt)
  setSessionCookie(response, 'urbanstyle_admin', token)
  response.json({ user: { email: admin.email, role: 'admin' } })
})

app.get('/api/auth/me', requireAdmin, (request, response) => {
  response.json({ user: { email: request.admin.email, role: 'admin' } })
})

app.post('/api/auth/logout', (request, response) => {
  const token = getCookie(request, 'urbanstyle_admin')
  if (token.length === 64) {
    database.prepare('DELETE FROM admin_sessions WHERE tokenHash = ?').run(hashToken(token))
  }
  removeSessionCookie(response, 'urbanstyle_admin')
  response.status(204).end()
})

app.post('/api/customers/register', (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : ''
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''
  const phone = typeof request.body?.phone === 'string' ? request.body.phone.trim() : ''
  const address = typeof request.body?.address === 'string' ? request.body.address.trim() : ''
  const address2 = typeof request.body?.address2 === 'string' ? request.body.address2.trim() : ''
  const city = typeof request.body?.city === 'string' ? request.body.city.trim() : ''
  const region = typeof request.body?.region === 'string' ? request.body.region.trim() : ''

  if (!name || name.length > 100) {
    response.status(400).json({ error: 'Ingresa tu nombre (máximo 100 caracteres).' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    response.status(400).json({ error: 'Ingresa un correo electrónico válido.' })
    return
  }
  if (password.length < 8 || password.length > 200) {
    response.status(400).json({ error: 'La contraseña debe tener entre 8 y 200 caracteres.' })
    return
  }
  if (!phone || !address || !city || !region) {
    response.status(400).json({ error: 'Completa teléfono, dirección, comuna y región.' })
    return
  }

  if (findCustomer.get(email)) {
    response.status(409).json({ error: 'Ya existe una cuenta con ese correo electrónico.' })
    return
  }

  const salt = randomBytes(16).toString('hex')
  const result = database.prepare(`
    INSERT INTO customer_users (email, name, phone, address, address2, city, region, passwordHash, passwordSalt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    email,
    name,
    phone,
    address,
    address2,
    city,
    region,
    customerPasswordHash(password, salt),
    salt
  )
  const token = randomBytes(32).toString('hex')
  database.prepare('INSERT INTO customer_sessions (tokenHash, customerId, expiresAt) VALUES (?, ?, ?)')
    .run(hashToken(token), result.lastInsertRowid, Date.now() + sessionDurationMs)
  const customer = database.prepare('SELECT * FROM customer_users WHERE id = ?').get(result.lastInsertRowid)

  setSessionCookie(response, 'urbanstyle_customer', token)
  response.status(201).json({ user: { ...publicCustomer(customer), role: 'customer' } })
})

app.post('/api/customers/login', (request, response) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''
  const customer = findCustomer.get(email)
  if (!customer || !password || password.length > 200) {
    response.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    return
  }

  const submittedHash = Buffer.from(customerPasswordHash(password, customer.passwordSalt), 'hex')
  const storedHash = Buffer.from(customer.passwordHash, 'hex')
  if (submittedHash.length !== storedHash.length || !timingSafeEqual(submittedHash, storedHash)) {
    response.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    return
  }

  const token = randomBytes(32).toString('hex')
  database.prepare('INSERT INTO customer_sessions (tokenHash, customerId, expiresAt) VALUES (?, ?, ?)')
    .run(hashToken(token), customer.id, Date.now() + sessionDurationMs)
  setSessionCookie(response, 'urbanstyle_customer', token)
  response.json({ user: { ...publicCustomer(customer), role: 'customer' } })
})

app.get('/api/customers/me', (request, response) => {
  const token = getCookie(request, 'urbanstyle_customer')
  const customer = token.length === 64
    ? findCustomerSession.get(hashToken(token), Date.now())
    : null
  if (!customer) {
    response.status(401).json({ error: 'No hay una sesión de cliente activa.' })
    return
  }
  response.json({ user: { ...publicCustomer(customer), role: 'customer' } })
})

app.post('/api/customers/logout', (request, response) => {
  const token = getCookie(request, 'urbanstyle_customer')
  if (token.length === 64) {
    database.prepare('DELETE FROM customer_sessions WHERE tokenHash = ?').run(hashToken(token))
  }
  removeSessionCookie(response, 'urbanstyle_customer')
  response.status(204).end()
})

app.post('/api/orders', (request, response) => {
  const details = request.body?.shippingDetails || {}
  const items = request.body?.items
  const name = typeof details.name === 'string' ? details.name.trim() : ''
  const email = typeof details.email === 'string' ? details.email.trim().toLowerCase() : ''
  const phone = typeof details.phone === 'string' ? details.phone.trim() : ''
  const address = typeof details.address === 'string' ? details.address.trim() : ''
  const address2 = typeof details.address2 === 'string' ? details.address2.trim() : ''
  const city = typeof details.city === 'string' ? details.city.trim() : ''
  const region = typeof details.region === 'string' ? details.region.trim() : ''
  const notes = typeof details.notes === 'string' ? details.notes.trim() : ''

  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    response.status(400).json({ error: 'Ingresa un nombre y correo electrónico válidos.' })
    return
  }
  if (!phone || phone.length > 30 || !address || address.length > 180 ||
      address2.length > 180 || !city || city.length > 100 || !region || region.length > 100 ||
      notes.length > 300) {
    response.status(400).json({ error: 'Revisa teléfono y dirección de envío; hay campos vacíos o demasiado largos.' })
    return
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    response.status(400).json({ error: 'El pedido debe incluir entre 1 y 30 productos.' })
    return
  }

  const quantities = new Map()
  for (const item of items) {
    const id = Number(item?.id)
    const quantity = Number(item?.quantity)
    if (!Number.isSafeInteger(id) || !Number.isSafeInteger(quantity) || quantity < 1) {
      response.status(400).json({ error: 'El pedido contiene productos o cantidades no válidos.' })
      return
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity)
  }

  try {
    const orderItems = []
    for (const [id, quantity] of quantities) {
      const product = database.prepare('SELECT id, name, price, stock, discountPercent FROM products WHERE id = ?').get(id)
      if (!product) throw new Error('Uno de los productos ya no está disponible.')
      if (quantity > product.stock) throw new Error(`Stock insuficiente para ${product.name}.`)

      const discountPercent = Number(product.discountPercent)
      const price = Math.round(product.price * (1 - discountPercent / 100))
      orderItems.push({
        id: product.id,
        name: product.name,
        quantity,
        originalPrice: product.price,
        discountPercent,
        price,
        lineTotal: price * quantity
      })
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const shipping = subtotal > 0 ? 2000 : 0
    const total = subtotal + shipping
    const customerToken = getCookie(request, 'urbanstyle_customer')
    const customer = customerToken.length === 64
      ? findCustomerSession.get(hashToken(customerToken), Date.now())
      : null

    const saveOrder = database.transaction(() => {
      if (customer) {
        database.prepare(`
          UPDATE customer_users
          SET name = ?, phone = ?, address = ?, address2 = ?, city = ?, region = ?
          WHERE id = ?
        `).run(name, phone, address, address2, city, region, customer.id)
      }
      const result = database.prepare(`
        INSERT INTO orders (
          customerId, customerName, customerEmail, customerPhone,
          shippingAddress, shippingAddress2, shippingCity, shippingRegion, shippingNotes,
          itemsJson, subtotal, shipping, total, status
        )
        VALUES (
          @customerId, @name, @email, @phone,
          @address, @address2, @city, @region, @notes,
          @itemsJson, @subtotal, @shipping, @total, 'pending_payment'
        )
      `).run({
        customerId: customer?.id || null,
        name,
        email,
        phone,
        address,
        address2,
        city,
        region,
        notes,
        itemsJson: JSON.stringify(orderItems),
        subtotal,
        shipping,
        total
      })
      return result.lastInsertRowid
    })

    const orderId = saveOrder()
    response.status(201).json({
      order: {
        id: orderId,
        status: 'pending_payment',
        items: orderItems,
        subtotal,
        shipping,
        total
      }
    })
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

app.get('/api/admin/dashboard', requireAdmin, (_request, response) => {
  const products = database.prepare(`
    SELECT COUNT(*) AS productCount, COALESCE(SUM(stock), 0) AS stockUnits,
           SUM(CASE WHEN stock < 5 THEN 1 ELSE 0 END) AS lowStockCount,
           COALESCE(SUM(price * stock), 0) AS inventoryValue
    FROM products
  `).get()
  const orders = database.prepare(`
    SELECT COUNT(*) AS count FROM orders WHERE status = 'pending_payment'
  `).get()
  const customers = database.prepare('SELECT COUNT(*) AS count FROM customer_users').get()
  response.json({
    products: products.productCount,
    stockUnits: products.stockUnits,
    lowStock: products.lowStockCount || 0,
    inventoryValue: products.inventoryValue,
    pendingOrders: orders.count,
    customers: customers.count
  })
})

app.get('/api/admin/orders', requireAdmin, (_request, response) => {
  const orders = database.prepare(`
    SELECT id, customerName, customerEmail, customerPhone, shippingAddress,
           shippingAddress2, shippingCity, shippingRegion, shippingNotes,
           itemsJson, subtotal, shipping, total, status, createdAt
    FROM orders
    ORDER BY id DESC
    LIMIT 100
  `).all().map((order) => ({
    ...order,
    items: JSON.parse(order.itemsJson)
  }))
  response.json(orders)
})

app.post('/api/products', requireAdmin, upload.single('image'), (request, response) => {
  try {
    const product = productWithImage(request.body, request.file)
    const result = database.prepare(`
      INSERT INTO products (name, description, price, stock, category, discountPercent, image)
      VALUES (@name, @description, @price, @stock, @category, @discountPercent, @image)
    `).run(product)
    response.status(201).json(database.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid))
  } catch (error) {
    if (request.file) removeUploadedImage(`/uploads/${request.file.filename}`)
    response.status(400).json({ error: error.message })
  }
})

app.put('/api/products/:id', requireAdmin, upload.single('image'), (request, response) => {
  try {
    const existing = database.prepare('SELECT * FROM products WHERE id = ?').get(Number(request.params.id))
    if (!existing) {
      if (request.file) removeUploadedImage(`/uploads/${request.file.filename}`)
      response.status(404).json({ error: 'Producto no encontrado.' })
      return
    }

    const product = productWithImage(request.body, request.file, existing.image)
    database.prepare(`
      UPDATE products
      SET name = @name, description = @description, price = @price, stock = @stock,
          category = @category, discountPercent = @discountPercent, image = @image
      WHERE id = @id
    `).run({ ...product, id: existing.id })
    if (request.file && existing.image !== product.image) removeUploadedImage(existing.image)
    response.json(database.prepare('SELECT * FROM products WHERE id = ?').get(existing.id))
  } catch (error) {
    if (request.file) removeUploadedImage(`/uploads/${request.file.filename}`)
    response.status(400).json({ error: error.message })
  }
})

app.delete('/api/products/:id', requireAdmin, (request, response) => {
  const product = database.prepare('SELECT id, image FROM products WHERE id = ?').get(Number(request.params.id))
  if (!product) {
    response.status(404).json({ error: 'Producto no encontrado.' })
    return
  }

  database.prepare('DELETE FROM products WHERE id = ?').run(product.id)
  removeUploadedImage(product.image)
  response.status(204).end()
})

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'Ruta de API no encontrada.' })
})

const buildDirectory = path.join(projectDirectory, 'dist')
if (fs.existsSync(buildDirectory)) {
  app.use(express.static(buildDirectory))
  app.get(/.*/, (_request, response) => response.sendFile(path.join(buildDirectory, 'index.html')))
}

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE'
      ? 'La imagen no puede superar los 5 MB.'
      : 'No se pudo procesar el archivo de imagen.' })
    return
  }
  if (error.message?.startsWith('La imagen debe')) {
    response.status(400).json({ error: error.message })
    return
  }
  console.error('Error en UrbanStyle API:', error)
  response.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' })
})

database.prepare('DELETE FROM admin_sessions WHERE expiresAt <= ?').run(Date.now())

app.listen(port, () => {
  console.info(`UrbanStyle API disponible en http://localhost:${port}`)
})
