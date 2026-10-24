
import { useState } from 'react'
import Producto from './Producto.jsx'
import { obtenerProductos } from '../data/productos'

export default function Productos() {

  const [productos] = useState(obtenerProductos)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('default')

  // Filtrar productos disponibles y buscar por nombre
  const productosFiltrados = productos
    .filter((producto) => producto.stock > 0)
    .filter((producto) =>
      producto.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )

  // Ordenar productos según la opción seleccionada
  if (sortOrder === 'name-asc') {
    productosFiltrados.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  if (sortOrder === 'name-desc') {
    productosFiltrados.sort((a, b) =>
      b.name.localeCompare(a.name)
    )
  }

  if (sortOrder === 'price-asc') {
    productosFiltrados.sort((a, b) =>
      a.price - b.price
    )
  }

  if (sortOrder === 'price-desc') {
    productosFiltrados.sort((a, b) =>
      b.price - a.price
    )
  }

  return (
    <section
      id="productos"
      className="products-section section-shell"
    >
      <div className="section-heading product-heading">
        <div>
          <span className="section-number">
            03 / SELECCIÓN
          </span>

          <h2>
            Lo que está
            <br />
            <span>sonando.</span>
          </h2>
        </div>
      </div>

      {/* Barra de búsqueda y ordenamiento */}
      <div
        className="product-toolbar"
        aria-label="Buscar y ordenar productos"
      >
        <div className="product-search">
          <label htmlFor="searchProducts">
            Buscar por nombre
          </label>

          <input
            type="search"
            id="searchProducts"
            placeholder="Ej: hoodie, chaqueta..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="product-sort">
          <label htmlFor="sortProducts">
            Ordenar por
          </label>

          <select
            id="sortProducts"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
          >
            <option value="default">
              Sin ordenar
            </option>

            <option value="name-asc">
              Nombre A-Z
            </option>

            <option value="name-desc">
              Nombre Z-A
            </option>

            <option value="price-asc">
              Precio: menor a mayor
            </option>

            <option value="price-desc">
              Precio: mayor a menor
            </option>
          </select>
        </div>
      </div>

      {/* Listado de productos */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 premium-product-grid">

        {productosFiltrados.length > 0 ? (

          productosFiltrados.map((producto, index) => (
            <Producto
              key={producto.id}
              producto={producto}
              numero={index + 1}
            />
          ))

        ) : (

          <div className="col-12">
            <div
              className="alert alert-secondary mb-0"
              role="status"
            >
              No se encontraron productos con ese nombre.
            </div>
          </div>

        )}

      </div>
    </section>
  )
}
