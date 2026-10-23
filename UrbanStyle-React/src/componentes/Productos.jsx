
import { useState } from 'react'
import Producto from './Producto'

import chaquetaFur from '../Imagen/catalogo-chaqueta-fur.jpg'
import chaquetaRacing from '../Imagen/catalogo-chaqueta-racing.jpg'
import cortaviento from '../Imagen/catalogo-cortaviento-tech.jpg'
import jeans from '../Imagen/catalogo-jeans-ripped.jpg'
import cargo from '../Imagen/catalogo-pantalon-cargo.jpg'

const productos = [
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

export default function Productos() {

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
