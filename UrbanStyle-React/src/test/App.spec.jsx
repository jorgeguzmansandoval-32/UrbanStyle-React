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
    if (url === '/api/customers/me') return respuestaJson({ error: 'No hay una sesión de cliente activa.' }, 401)
    return respuestaJson({ error: 'Ruta no configurada en la prueba.' }, 404)
  })
}

describe('Interfaz de la tienda', () => {
  beforeEach(() => {
    localStorage.clear()
    prepararApi()
  })

  afterEach(() => cleanup())

  it('muestra la marca, el banner y el catálogo cargado desde la API', async () => {
    render(<App />)

    expect(await screen.findByText(/Streetwear/)).toBeTruthy()
    expect(await screen.findByText('2 prendas seleccionadas')).toBeTruthy()
    expect(screen.getByText('Chaqueta de prueba')).toBeTruthy()
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
