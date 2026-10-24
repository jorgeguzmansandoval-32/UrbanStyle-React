
import { useState } from 'react'
import { obtenerProductos } from '../../data/productos'
import Producto from '../Producto'

export default function CategoriasPage() {
  const [categoria, setCategoria] = useState('Todas')

  const productos = obtenerProductos().filter(
    (producto) => Number(producto.stock) > 0
  )

  const categorias = [
    'Todas',
    ...new Set(
      productos
        .map((producto) => producto.categoria)
        .filter(Boolean)
    )
  ]

  const productosFiltrados = categoria === 'Todas'
    ? productos
    : productos.filter(
        (producto) => producto.categoria === categoria
      )

  return (
    <main className="container my-5">
      <div className="mb-4">
        <span className="section-number">
          URBANSTYLE / CATEGORÍAS
        </span>

        <h1 className="fw-bold mt-2">
          Explora nuestras colecciones
        </h1>

        <p className="text-secondary">
          Encuentra las prendas que mejor combinan con tu estilo.
        </p>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {categorias.map((item) => (
          <button
            key={item}
            type="button"
            className={
              categoria === item
                ? 'btn btn-dark'
                : 'btn btn-outline-dark'
            }
            onClick={() => setCategoria(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {productosFiltrados.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 premium-product-grid">
          {productosFiltrados.map((producto, index) => (
            <Producto
              key={producto.id}
              producto={producto}
              numero={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-secondary">
          No hay productos disponibles en esta categoría.
        </div>
      )}
    </main>
  )
}
