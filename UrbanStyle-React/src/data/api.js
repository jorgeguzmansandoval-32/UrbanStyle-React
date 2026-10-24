async function parseResponse(response) {
  if (response.status === 204) return null

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || `Error del servidor (${response.status}).`)
  }
  return payload
}

async function request(url, options = {}) {
  let response
  try {
    response = await fetch(url, {
      credentials: 'same-origin',
      ...options
    })
  } catch {
    throw new Error('No pudimos conectar con UrbanStyle. Verifica tu conexión y que el servidor esté iniciado.')
  }
  return parseResponse(response)
}

export function obtenerProductosApi() {
  return request('/api/products')
}

export async function obtenerSesionAdmin() {
  try {
    const result = await request('/api/auth/me')
    return result.user
  } catch (error) {
    if (error.message === 'Debes iniciar sesión como administrador.' ||
        error.message === 'La sesión de administrador expiró. Inicia sesión nuevamente.') {
      return null
    }
    throw error
  }
}

export async function obtenerSesionCliente() {
  try {
    const result = await request('/api/customers/me')
    return result.user
  } catch (error) {
    if (error.message === 'No hay una sesión de cliente activa.') return null
    throw error
  }
}

export function iniciarSesionAdmin(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
}

export function iniciarSesionCliente(email, password) {
  return request('/api/customers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
}

export function registrarCliente(customer) {
  return request('/api/customers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer)
  })
}

export function cerrarSesionAdmin() {
  return request('/api/auth/logout', { method: 'POST' })
}

export function cerrarSesionCliente() {
  return request('/api/customers/logout', { method: 'POST' })
}

export function obtenerDashboardAdmin() {
  return request('/api/admin/dashboard')
}

export function obtenerPedidosAdmin() {
  return request('/api/admin/orders')
}

export function crearPedido(pedido) {
  return request('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  })
}

function productoComoFormData(producto, imagen) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(producto)) {
    formData.append(key, String(value))
  }
  if (imagen) formData.append('image', imagen)
  return formData
}

export function crearProductoApi(producto, imagen) {
  return request('/api/products', {
    method: 'POST',
    body: productoComoFormData(producto, imagen)
  })
}

export function actualizarProductoApi(id, producto, imagen) {
  return request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: productoComoFormData(producto, imagen)
  })
}

export function eliminarProductoApi(id) {
  return request(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
