import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const baseUrl = process.env.URBANSTYLE_E2E_URL || 'http://127.0.0.1:3001'
const password = 'UrbanStyleE2E!2026'
const email = `e2e-${randomUUID()}@example.test`

async function apiRequest(route, { method = 'GET', body, cookie } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (cookie) headers.Cookie = cookie

  const response = await fetch(new URL(route, baseUrl), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const payload = response.status === 204 ? null : await response.json()
  const setCookie = response.headers.get('set-cookie')
  return {
    status: response.status,
    payload,
    cookie: setCookie?.split(';', 1)[0] || cookie
  }
}

async function runPurchaseFlow() {
  const customer = {
    name: 'Cliente E2E',
    email,
    password,
    phone: '+56 9 1234 5678',
    address: 'Avenida Providencia 123',
    address2: '',
    city: 'Santiago',
    region: 'Metropolitana'
  }

  const unauthenticatedOrder = await apiRequest('/api/orders', {
    method: 'POST',
    body: {
      shippingDetails: customer,
      items: [{ id: 1, quantity: 1 }]
    }
  })
  assert.equal(unauthenticatedOrder.status, 401, 'El servidor aceptó un pedido sin iniciar sesión.')

  const registration = await apiRequest('/api/customers/register', {
    method: 'POST',
    body: customer
  })
  assert.equal(registration.status, 201, `Registro fallido: ${JSON.stringify(registration.payload)}`)

  const logout = await apiRequest('/api/customers/logout', {
    method: 'POST',
    cookie: registration.cookie
  })
  assert.equal(logout.status, 204, 'No se pudo cerrar la sesión de registro.')

  const login = await apiRequest('/api/customers/login', {
    method: 'POST',
    body: { email, password }
  })
  assert.equal(login.status, 200, `Inicio de sesión fallido: ${JSON.stringify(login.payload)}`)
  assert.equal(login.payload.user.email, email)
  assert.ok(login.cookie, 'La API no devolvió cookie de sesión para el cliente.')

  const updatedProfile = {
    ...customer,
    name: 'Cliente E2E Actualizado',
    address: 'Avenida Providencia 456'
  }
  const profileResponse = await apiRequest('/api/customers/me', {
    method: 'PUT',
    cookie: login.cookie,
    body: updatedProfile
  })
  assert.equal(profileResponse.status, 200, `No se pudo actualizar el perfil: ${JSON.stringify(profileResponse.payload)}`)
  assert.equal(profileResponse.payload.user.name, updatedProfile.name)
  assert.equal(profileResponse.payload.user.address, updatedProfile.address)

  const catalog = await apiRequest('/api/products', { cookie: login.cookie })
  assert.equal(catalog.status, 200, 'No se pudo consultar el catálogo.')
  const product = catalog.payload.find((item) =>
    `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase('es-CL').includes('chaqueta urban fur')
  )
  assert.ok(product, 'La búsqueda no encontró Chaqueta Urban Fur.')
  assert.ok(product.stock > 0, 'El producto de prueba no tiene stock disponible.')

  const cart = [{ id: product.id, quantity: 1 }]
  const orderResponse = await apiRequest('/api/orders', {
    method: 'POST',
    cookie: login.cookie,
    body: {
      shippingDetails: updatedProfile,
      items: cart
    }
  })
  assert.equal(orderResponse.status, 201, `No se pudo guardar la compra: ${JSON.stringify(orderResponse.payload)}`)

  const { order } = orderResponse.payload
  assert.ok(order?.id, 'La confirmación no contiene un identificador de pedido.')
  assert.equal(order.status, 'pending_payment')

  const customerOrders = await apiRequest('/api/customers/orders', { cookie: login.cookie })
  assert.equal(customerOrders.status, 200, 'No se pudo cargar el historial del cliente.')
  assert.ok(customerOrders.payload.some((saved) => saved.id === order.id), 'El pedido no aparece en el historial del cliente.')

  const database = new Database(path.join(projectDirectory, 'server', 'data', 'urbanstyle.db'), {
    readonly: true
  })
  try {
    const savedOrder = database.prepare(`
      SELECT customerId, customerEmail, status, itemsJson
      FROM orders
      WHERE id = ?
    `).get(order.id)
    assert.ok(savedOrder, 'El pedido no aparece en SQLite.')
    assert.ok(savedOrder.customerId, 'El pedido no quedó vinculado a la cuenta de cliente.')
    assert.equal(savedOrder.customerEmail, email)
    assert.equal(savedOrder.status, 'pending_payment')
    assert.deepEqual(JSON.parse(savedOrder.itemsJson).map(({ id, quantity }) => ({ id, quantity })), cart)
    assert.equal(database.prepare('SELECT name, address FROM customer_users WHERE id = ?').get(savedOrder.customerId).address, updatedProfile.address)
  } finally {
    database.close()
  }

  const finalLogout = await apiRequest('/api/customers/logout', {
    method: 'POST',
    cookie: login.cookie
  })
  assert.equal(finalLogout.status, 204, 'No se pudo cerrar la sesión al finalizar la prueba.')
}

runPurchaseFlow().catch((error) => {
  console.error('Falló el flujo de compra E2E:', error)
  process.exitCode = 1
})
