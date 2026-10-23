
import { obtenerProductos } from './productos'

const CART_KEY = 'urbanstyle_cart'

// READ: Obtener el carrito guardado
export function obtenerCarrito() {
  try {
    const datos = localStorage.getItem(CART_KEY)
    const carrito = JSON.parse(datos || '[]')

    return Array.isArray(carrito) ? carrito : []
  } catch (error) {
    console.error('Error al obtener el carrito:', error)
    return []
  }
}

// Guardar los cambios del carrito
export function guardarCarrito(carrito) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito))

  window.dispatchEvent(new Event('carritoActualizado'))
}

// CREATE: Agregar productos al carrito
export function agregarAlCarrito(id) {
  const producto = obtenerProductos().find(
    (item) => String(item.id) === String(id)
  )

  if (!producto) {
    throw new Error('El producto no existe.')
  }

  const carrito = obtenerCarrito()

  const existente = carrito.find(
    (item) => String(item.id) === String(id)
  )

  const cantidadActual = existente
    ? Number(existente.quantity)
    : 0

  if (cantidadActual >= Number(producto.stock)) {
    throw new Error('No hay suficiente stock disponible.')
  }

  if (existente) {
    existente.quantity += 1
  } else {
    carrito.push({
      id: producto.id,
      name: producto.name,
      description: producto.description,
      price: Number(producto.price),
      image: producto.image,
      quantity: 1
    })
  }

  guardarCarrito(carrito)

  return carrito
}

// UPDATE: Modificar la cantidad
export function cambiarCantidad(id, cantidad) {
  const carrito = obtenerCarrito()

  const producto = carrito.find(
    (item) => String(item.id) === String(id)
  )

  if (!producto) {
    throw new Error('Producto no encontrado en el carrito.')
  }

  const nuevaCantidad = Number(cantidad)

  if (!Number.isInteger(nuevaCantidad)) {
    throw new Error('La cantidad debe ser un número entero.')
  }

  if (nuevaCantidad <= 0) {
    return eliminarDelCarrito(id)
  }

  const productoDisponible = obtenerProductos().find(
    (item) => String(item.id) === String(id)
  )

  if (
    !productoDisponible ||
    nuevaCantidad > Number(productoDisponible.stock)
  ) {
    throw new Error('No hay suficiente stock disponible.')
  }

  producto.quantity = nuevaCantidad

  guardarCarrito(carrito)

  return carrito
}

// DELETE: Eliminar un producto del carrito
export function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(
    (item) => String(item.id) !== String(id)
  )

  guardarCarrito(carrito)

  return carrito
}

// Calcular subtotal, envío y total
export function calcularTotales(carrito) {
  const subtotal = carrito.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  )

  const envio = subtotal > 0 ? 2000 : 0

  return {
    subtotal,
    envio,
    total: subtotal + envio
  }
}

// Formatear precios en pesos chilenos
export function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(Number(precio))
}
