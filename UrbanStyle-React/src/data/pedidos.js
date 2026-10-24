
import {
  obtenerProductos,
  guardarProductos
} from './productos'

import {
  obtenerCarrito,
  guardarCarrito,
  calcularTotales
} from './carrito'

const PEDIDOS_KEY = 'urbanstyle_pedidos'

// READ: Consultar pedidos guardados
export function obtenerPedidos() {
  try {
    const datos = localStorage.getItem(PEDIDOS_KEY)
    const pedidos = JSON.parse(datos || '[]')

    return Array.isArray(pedidos) ? pedidos : []
  } catch (error) {
    console.error('Error al consultar pedidos:', error)
    return []
  }
}

// Consultar un pedido por su identificador
export function obtenerPedidoPorId(id) {
  return obtenerPedidos().find(
    (pedido) => String(pedido.id) === String(id)
  )
}

// Validar información del comprador
export function validarDatosCompra(datos) {
  if (!datos.nombre?.trim() || datos.nombre.trim().length < 3) {
    throw new Error('El nombre debe tener al menos 3 caracteres.')
  }

  if (!datos.apellidos?.trim() || datos.apellidos.trim().length < 3) {
    throw new Error('Los apellidos deben tener al menos 3 caracteres.')
  }

  const correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!correo.test(datos.correo?.trim() || '')) {
    throw new Error('Ingresa un correo electrónico válido.')
  }

  if (!datos.calle?.trim() || datos.calle.trim().length < 5) {
    throw new Error('La dirección debe tener al menos 5 caracteres.')
  }

  if (!datos.region || !datos.comuna) {
    throw new Error('Debes seleccionar una región y una comuna.')
  }
}

// CREATE: Registrar una compra simulada
export function registrarPedido(datosCliente) {
  validarDatosCompra(datosCliente)

  const carrito = obtenerCarrito()

  if (carrito.length === 0) {
    throw new Error('No hay productos en el carrito.')
  }

  const productos = obtenerProductos()
  const cantidades = new Map()

  // Consolidar cantidades por producto
  carrito.forEach((item) => {
    const cantidad = Number(item.quantity)

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('Hay una cantidad inválida en el carrito.')
    }

    const id = String(item.id)

    cantidades.set(
      id,
      (cantidades.get(id) || 0) + cantidad
    )
  })

  // Comprobar el stock antes de modificar los datos
  cantidades.forEach((cantidad, id) => {
    const producto = productos.find(
      (item) => String(item.id) === id
    )

    if (!producto) {
      throw new Error('Uno de los productos ya no existe.')
    }

    if (Number(producto.stock) < cantidad) {
      throw new Error(
        `Stock insuficiente para ${producto.name}.`
      )
    }
  })

  // Obtener precios actuales del catálogo
  const itemsPedido = carrito.map((item) => {
    const producto = productos.find(
      (p) => String(p.id) === String(item.id)
    )

    return {
      id: producto.id,
      name: producto.name,
      image: producto.image,
      price: Number(producto.price),
      quantity: Number(item.quantity)
    }
  })

  const totales = calcularTotales(itemsPedido)

  const pedido = {
    id: crypto.randomUUID(),
    fecha: new Date().toISOString(),
    estado: 'Confirmado',
    cliente: {
      nombre: datosCliente.nombre.trim(),
      apellidos: datosCliente.apellidos.trim(),
      correo: datosCliente.correo.trim(),
      calle: datosCliente.calle.trim(),
      departamento: datosCliente.departamento?.trim() || '',
      region: datosCliente.region,
      comuna: datosCliente.comuna,
      indicaciones: datosCliente.indicaciones?.trim() || ''
    },
    productos: itemsPedido,
    subtotal: totales.subtotal,
    envio: totales.envio,
    total: totales.total
  }

  // Preparar inventario actualizado
  const inventarioActualizado = productos.map((producto) => ({
    ...producto,
    stock: Number(producto.stock) -
      (cantidades.get(String(producto.id)) || 0)
  }))

  const pedidosAnteriores = obtenerPedidos()

  // Guardar el pedido antes de descontar el stock
  localStorage.setItem(
    PEDIDOS_KEY,
    JSON.stringify([...pedidosAnteriores, pedido])
  )

  try {
    guardarProductos(inventarioActualizado)
  } catch (error) {
    // Revertir el pedido si no se pudo guardar el inventario
    try {
      localStorage.setItem(
        PEDIDOS_KEY,
        JSON.stringify(pedidosAnteriores)
      )
    } catch (rollbackError) {
      console.error('Error al revertir el pedido:', rollbackError)
    }

    throw new Error('No se pudo actualizar el inventario.')
  }

  guardarCarrito([])

  return pedido
}
