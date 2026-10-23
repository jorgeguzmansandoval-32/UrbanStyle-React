
import { useState } from 'react'
import { agregarAlCarrito } from '../data/carrito'

export default function Producto({ producto, numero }) {

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  // Formatear el precio en pesos chilenos
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(precio)
  }

  // Agregar producto al carrito
  function manejarAgregar() {
    setMensaje('')
    setError('')

    try {
      agregarAlCarrito(producto.id)
      setMensaje('Producto añadido a la bolsa.')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="col">
      <article className="card h-100 product-card shadow-sm">

        <div className="premium-product-media">
          <span className="premium-product-tag">
            {numero === 1 ? 'NEW DROP' : 'URBAN PICK'}
          </span>

          <img
            src={producto.image}
            className="card-img-top"
            alt={producto.name}
            loading="lazy"
          />
        </div>

        <div className="card-body d-flex flex-column">
          <div className="premium-product-meta">
            URBANSTYLE / {String(numero).padStart(2, '0')}
          </div>

          <h3 className="card-title">
            {producto.name}
          </h3>

          <p className="card-text text-muted">
            {producto.description}
          </p>

          <div className="mt-auto">
            <p className="fs-5 fw-bold text-success">
              {formatearPrecio(producto.price)}
            </p>

            <button
              type="button"
              className="btn btn-dark w-100 add-cart-btn"
              onClick={manejarAgregar}
              disabled={Number(producto.stock) <= 0}
            >
              Añadir a la bolsa <span>→</span>
            </button>

            {mensaje && (
              <p
                className="text-success small mt-2 mb-0"
                role="status"
              >
                {mensaje}
              </p>
            )}

            {error && (
              <p
                className="text-danger small mt-2 mb-0"
                role="alert"
              >
                {error}
              </p>
            )}

          </div>
        </div>
      </article>
    </div>
  )
}
