import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App'

const productosDePrueba = [
  {
    id: 1,
    name: 'Chaqueta de prueba',
    description: 'Una prenda para las pruebas.',
    price: 25000,
    stock: 3,
    image: '',
    category: 'Chaquetas'
  },
  {
    id: 2,
    name: 'Polera de prueba',
    description: 'Otra prenda para las pruebas.',
    price: 12000,
    stock: 2,
    image: '',
    category: 'Poleras'
  }
]

let clienteApi = null
let pedidosApi = []

function respuestaJson(body, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  })
}

function prepararApi() {
  spyOn(window, 'fetch').and.callFake((url, options = {}) => {
    if (url === '/api/products' && !options.method) return respuestaJson(productosDePrueba)
    if (url === '/api/auth/me') return respuestaJson({ error: 'Debes iniciar sesión como administrador.' }, 401)
    if (url === '/api/customers/me' && options.method === 'PUT') return respuestaJson({ user: { ...clienteApi, ...JSON.parse(options.body), role: 'customer' } })
    if (url === '/api/customers/me') return clienteApi
      ? respuestaJson({ user: { ...clienteApi, role: 'customer' } })
      : respuestaJson({ error: 'No hay una sesión de cliente activa.' }, 401)
    if (url === '/api/customers/orders') return clienteApi
      ? respuestaJson(pedidosApi)
      : respuestaJson({ error: 'Debes iniciar sesión como cliente para continuar.' }, 401)
    if (url === '/api/customers/login' && options.method === 'POST') {
      return respuestaJson({ user: { email: 'cliente@example.test', role: 'customer' } })
    }
    return respuestaJson({ error: 'Ruta no configurada en la prueba.' }, 404)
  })
}

describe('Interfaz de la tienda', () => {
  beforeEach(() => {
    localStorage.clear()
    clienteApi = null
    pedidosApi = []
    prepararApi()
  })

  afterEach(() => cleanup())

  it('muestra la marca, el banner y el catálogo cargado desde la API', async () => {
    render(<App />)

    expect(await screen.findByText(/Streetwear/)).toBeTruthy()
    expect(await screen.findByText('2 prendas seleccionadas')).toBeTruthy()
    expect(screen.getByText('Chaqueta de prueba')).toBeTruthy()
  })

  it('mantiene visible el catálogo cuando la sesión de cliente devuelve otro mensaje 401', async () => {
    window.fetch.and.callFake((url) => {
      if (url === '/api/products') return respuestaJson(productosDePrueba)
      if (url === '/api/auth/me') return respuestaJson({ error: 'Sin sesión de administrador.' }, 401)
      if (url === '/api/customers/me') return respuestaJson({ error: 'Debes iniciar sesión como cliente para continuar.' }, 401)
      return respuestaJson({ error: 'Ruta no configurada en la prueba.' }, 404)
    })
    render(<App />)

    expect(await screen.findByText('Chaqueta de prueba')).toBeTruthy()
    expect(screen.queryByText(/No se pudo cargar el catálogo/)).toBeNull()
  })

  it('filtra los productos al elegir una categoría', async () => {
    render(<App />)
    await screen.findByText('2 prendas seleccionadas')

    fireEvent.click(screen.getByRole('button', { name: 'Poleras' }))

    expect(screen.getByText('1 prendas seleccionadas')).toBeTruthy()
    expect(screen.getByText('Polera de prueba')).toBeTruthy()
    expect(screen.queryByText('Chaqueta de prueba')).toBeNull()
  })

  it('busca productos por texto sin distinguir mayúsculas ni tildes', async () => {
    render(<App />)
    await screen.findByText('Chaqueta de prueba')
    fireEvent.change(screen.getByRole('searchbox', { name: /Buscar productos/i }), { target: { value: 'chaqueta' } })

    expect(screen.getByText('1 prendas seleccionadas')).toBeTruthy()
    expect(screen.getByText('Chaqueta de prueba')).toBeTruthy()
    expect(screen.queryByText('Polera de prueba')).toBeNull()
  })

  it('agrega una prenda y actualiza la bolsa', async () => {
    render(<App />)
    await screen.findByText('Chaqueta de prueba')

    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0])

    expect(screen.getByRole('status').textContent).toContain('Prenda agregada')
    expect(screen.getByLabelText('Abrir bolsa de compras, 1 prenda')).toBeTruthy()
  })

  it('exige iniciar sesión como cliente antes de continuar al checkout', async () => {
    render(<App />)
    await screen.findByText('Chaqueta de prueba')
    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0])
    fireEvent.click(screen.getByLabelText('Abrir bolsa de compras, 1 prenda'))
    fireEvent.click(screen.getByRole('button', { name: /Revisar compra/i }))

    expect(await screen.findByRole('dialog', { name: /Bienvenido/i })).toBeTruthy()
    expect(screen.getByText(/Inicia sesión o crea una cuenta de cliente/i)).toBeTruthy()
    expect(screen.queryByRole('dialog', { name: /¿A dónde lo enviamos/i })).toBeNull()
  })

  it('muestra el perfil del cliente y su historial de pedidos', async () => {
    const customer = {
      id: 10,
      email: 'cliente@example.test',
      name: 'Cliente Prueba',
      phone: '+56 9 1234 5678',
      address: 'Av. Providencia 123',
      address2: '',
      city: 'Santiago',
      region: 'Metropolitana'
    }
    clienteApi = customer
    pedidosApi = [{
      id: 42,
      customerName: customer.name,
      status: 'pending_payment',
      createdAt: '2026-10-20 12:00:00',
      shippingCity: customer.city,
      shippingRegion: customer.region,
      items: [{ id: 1, name: 'Chaqueta de prueba', quantity: 1, lineTotal: 25000 }],
      total: 27000
    }]
    render(<App />)

    fireEvent.click(await screen.findByRole('button', { name: 'Mi cuenta' }))
    expect(await screen.findByDisplayValue(customer.email)).toBeTruthy()
    expect(screen.getByDisplayValue(customer.address)).toBeTruthy()

    fireEvent.click(screen.getByRole('tab', { name: /Mis pedidos/i }))
    expect(await screen.findByText('Pedido #42')).toBeTruthy()
    expect(screen.getByText('Pendiente de pago')).toBeTruthy()
    expect(screen.getAllByText(/Chaqueta de prueba/).length).toBe(2)
  })

  it('muestra errores accesibles y no envía el login si los datos son inválidos', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    fireEvent.submit(document.querySelector('.login-dialog form'))

    expect(await screen.findByText(/Correo electrónico: Ingresa un correo/i)).toBeTruthy()
    expect(screen.getByLabelText('Correo electrónico').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText(/Contraseña: La contraseña debe tener/i)).toBeTruthy()
    expect(window.fetch.calls.allArgs().filter(([, options]) => options?.method === 'POST').length).toBe(0)
  })

  it('presenta un mensaje claro cuando el servidor no responde', async () => {
    window.fetch.and.callFake(() => Promise.reject(new Error('Network failure')))
    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('No pudimos conectar con UrbanStyle')
    })
  })
})
