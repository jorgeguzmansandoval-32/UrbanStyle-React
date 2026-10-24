import {
  agregarAlCarrito,
  cambiarCantidad,
  calcularTotales,
  eliminarDelCarrito,
  obtenerCarrito
} from '../data/carrito'

const inventario = [
  { id: 1, name: 'Prenda de prueba', description: 'Descripción', price: 10000, stock: 2, image: '/prenda.jpg' }
]

describe('Operaciones del carrito', () => {
  beforeEach(() => localStorage.clear())

  it('empieza vacío cuando no hay datos guardados', () => {
    expect(obtenerCarrito()).toEqual([])
  })

  it('agrega el producto al almacenamiento del navegador', () => {
    agregarAlCarrito(1, inventario)
    expect(obtenerCarrito().map((item) => item.name)).toEqual(['Prenda de prueba'])
  })

  it('incrementa la cantidad al agregar dos veces el mismo producto', () => {
    agregarAlCarrito(1, inventario)
    agregarAlCarrito(1, inventario)
    expect(obtenerCarrito()[0].quantity).toBe(2)
  })

  it('no permite agregar más unidades que las disponibles', () => {
    agregarAlCarrito(1, inventario)
    agregarAlCarrito(1, inventario)
    expect(() => agregarAlCarrito(1, inventario)).toThrowError('No hay suficiente stock disponible.')
  })

  it('rechaza identificadores que no existen en el inventario', () => {
    expect(() => agregarAlCarrito(999, inventario)).toThrowError('El producto no existe.')
  })

  it('actualiza cantidades y calcula subtotal, envío y total', () => {
    agregarAlCarrito(1, inventario)
    cambiarCantidad(1, 2, inventario)
    expect(calcularTotales(obtenerCarrito())).toEqual({ subtotal: 20000, envio: 2000, total: 22000 })
  })

  it('elimina el artículo cuando la cantidad se reduce a cero', () => {
    agregarAlCarrito(1, inventario)
    cambiarCantidad(1, 0, inventario)
    expect(obtenerCarrito()).toEqual([])
  })

  it('rechaza cantidades no enteras', () => {
    agregarAlCarrito(1, inventario)
    expect(() => cambiarCantidad(1, 1.5, inventario)).toThrowError('La cantidad debe ser un número entero.')
  })

  it('elimina un artículo y deja el carrito vacío', () => {
    agregarAlCarrito(1, inventario)
    eliminarDelCarrito(1)
    expect(obtenerCarrito()).toEqual([])
  })

  it('mantiene el total en cero cuando no hay artículos', () => {
    expect(calcularTotales([])).toEqual({ subtotal: 0, envio: 0, total: 0 })
  })
})
