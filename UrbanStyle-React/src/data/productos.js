
import chaquetaFur from '../Imagen/catalogo-chaqueta-fur.jpg'
import chaquetaRacing from '../Imagen/catalogo-chaqueta-racing.jpg'
import cortaviento from '../Imagen/catalogo-cortaviento-tech.jpg'
import jeans from '../Imagen/catalogo-jeans-ripped.jpg'
import cargo from '../Imagen/catalogo-pantalon-cargo.jpg'

// Clave utilizada para guardar los productos
const PRODUCTS_KEY = 'urbanstyle_products'

// Productos originales de UrbanStyle
export const productosIniciales = [
  {
    id: 1,
    name: 'Chaqueta Urban Fur',
    description: 'Chaqueta negra de corte urbano con cuello de textura y cierre frontal.',
    price: 45990,
    stock: 12,
    image: chaquetaFur
  },
  {
    id: 2,
    name: 'Chaqueta Racing Black',
    description: 'Chaqueta bomber negra con gráfica deportiva y detalles reflectantes.',
    price: 59990,
    stock: 8,
    image: chaquetaRacing
  },
  {
    id: 3,
    name: 'Cortaviento Tech Grey',
    description: 'Cortaviento ligero gris con paneles contrastantes y silueta técnica.',
    price: 49990,
    stock: 15,
    image: cortaviento
  },
  {
    id: 4,
    name: 'Jeans Ripped Black',
    description: 'Jeans negros de corte relajado con detalles desgastados y cadenas.',
    price: 39990,
    stock: 10,
    image: jeans
  },
  {
    id: 5,
    name: 'Cargo Utility Grey',
    description: 'Pantalón cargo gris de inspiración utilitaria para un fit urbano.',
    price: 44990,
    stock: 6,
    image: cargo
  }
]

// READ: Obtener los productos
export function obtenerProductos() {
  try {
    const datos = localStorage.getItem(PRODUCTS_KEY)

    if (datos !== null) {
      const productos = JSON.parse(datos)

      if (Array.isArray(productos)) {
        return productos
      }
    }
  } catch (error) {
    console.error('Error al obtener productos:', error)
  }

  return [...productosIniciales]
}

// Guardar la lista en localStorage
export function guardarProductos(productos) {
  localStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(productos)
  )
}

// Validar información de un producto
function validarProducto(producto) {
  if (!producto.name || !producto.name.trim()) {
    throw new Error('El nombre es obligatorio')
  }

  if (!Number.isFinite(Number(producto.price)) ||
      Number(producto.price) <= 0) {
    throw new Error('El precio debe ser mayor a cero')
  }

  if (!Number.isInteger(Number(producto.stock)) ||
      Number(producto.stock) < 0) {
    throw new Error('El stock debe ser un entero positivo o cero')
  }
}

// CREATE: Crear un producto
export function crearProducto(nuevoProducto) {
  validarProducto(nuevoProducto)

  const productos = obtenerProductos()

  const nuevoId = productos.reduce(
    (maximo, producto) =>
      Math.max(maximo, Number(producto.id) || 0),
    0
  ) + 1

  const producto = {
    ...nuevoProducto,
    id: nuevoId,
    name: nuevoProducto.name.trim(),
    price: Number(nuevoProducto.price),
    stock: Number(nuevoProducto.stock)
  }

  const productosActualizados = [
    ...productos,
    producto
  ]

  guardarProductos(productosActualizados)

  return producto
}

// UPDATE: Actualizar un producto
export function actualizarProducto(id, datosActualizados) {
  const productos = obtenerProductos()

  const productoExistente = productos.find(
    (producto) => String(producto.id) === String(id)
  )

  if (!productoExistente) {
    throw new Error('Producto no encontrado')
  }

  const productoModificado = {
    ...productoExistente,
    ...datosActualizados,
    id: productoExistente.id
  }

  validarProducto(productoModificado)

  productoModificado.name = productoModificado.name.trim()
  productoModificado.price = Number(productoModificado.price)
  productoModificado.stock = Number(productoModificado.stock)

  const productosActualizados = productos.map(
    (producto) =>
      String(producto.id) === String(id)
        ? productoModificado
        : producto
  )

  guardarProductos(productosActualizados)

  return productoModificado
}

// DELETE: Eliminar un producto
export function eliminarProducto(id) {
  const productos = obtenerProductos()

  const productosActualizados = productos.filter(
    (producto) => String(producto.id) !== String(id)
  )

  if (productosActualizados.length === productos.length) {
    throw new Error('Producto no encontrado')
  }

  guardarProductos(productosActualizados)

  return productosActualizados
}
