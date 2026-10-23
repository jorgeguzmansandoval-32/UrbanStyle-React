
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerCarrito,
  cambiarCantidad,
  eliminarDelCarrito,
  calcularTotales,
  formatearPrecio
} from '../../data/carrito'

export default function CarritoPage() {

  const [carrito, setCarrito] = useState(obtenerCarrito)
  const [error, setError] = useState('')

  // Actualizar la información del carrito
  useEffect(() => {
    function actualizarCarrito() {
      setCarrito(obtenerCarrito())
    }

    window.addEventListener('carritoActualizado', actualizarCarrito)
    window.addEventListener('storage', actualizarCarrito)

    return () => {
      window.removeEventListener('carritoActualizado', actualizarCarrito)
      window.removeEventListener('storage', actualizarCarrito)
    }
  }, [])

  // Aumentar o disminuir cantidades
  function modificarCantidad(id, cantidad) {
    setError('')

    try {
      cambiarCantidad(id, cantidad)
      setCarrito(obtenerCarrito())
    } catch (error) {
      setError(error.message)
    }
  }

  // Eliminar productos
  function quitarProducto(id) {
    setError('')

    eliminarDelCarrito(id)
    setCarrito(obtenerCarrito())
  }

  const { subtotal, envio, total } = calcularTotales(carrito)

  return (
    <main className="container my-5 cart-page">

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <h1 className="mb-0">
          Mi carrito
        </h1>

        <Link
          to="/"
          className="btn btn-outline-dark"
        >
          Seguir comprando
        </Link>

      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {carrito.length === 0 ? (

        <div className="empty-cart">

          <h3>
            Tu carrito está vacío
          </h3>

          <p>
            Aún no has agregado productos.
            Explora nuestra colección y elige
            tu estilo favorito.
          </p>

          <Link
            to="/"
            className="btn btn-dark"
          >
            Ver productos
          </Link>

        </div>

      ) : (

        <div className="row g-4">

          {/* PRODUCTOS DEL CARRITO */}
          <div className="col-lg-8">

            <div className="cart-items">

              {carrito.map((producto) => (

                <div
                  className="cart-item"
                  key={producto.id}
                >

                  {producto.image ? (
                    <img
                      src={producto.image}
                      alt={producto.name}
                    />
                  ) : (
                    <div className="placeholder-image">
                      Sin imagen
                    </div>
                  )}

                  <div className="cart-item-info">

                    <h4>{producto.name}</h4>

                    <p>
                      {producto.description ||
                        'Producto de UrbanStyle'}
                    </p>

                    <div className="cart-item-price">
                      {formatearPrecio(producto.price)}
                    </div>

                  </div>

                  <div className="cart-item-actions">

                    <div className="qty-box">

                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={`Disminuir cantidad de ${producto.name}`}
                        onClick={() =>
                          modificarCantidad(
                            producto.id,
                            producto.quantity - 1
                          )
                        }
                      >
                        -
                      </button>

                      <span>{producto.quantity}</span>

                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={`Aumentar cantidad de ${producto.name}`}
                        onClick={() =>
                          modificarCantidad(
                            producto.id,
                            producto.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                    <div className="cart-item-total">
                      {formatearPrecio(
                        producto.price * producto.quantity
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn btn-remove"
                      onClick={() =>
                        quitarProducto(producto.id)
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

              ))}

            </div>
          </div>

          {/* RESUMEN DEL PEDIDO */}
          <div className="col-lg-4">

            <div className="summary-card">

              <h3>Resumen del pedido</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>
                  {formatearPrecio(subtotal)}
                </strong>
              </div>

              <div className="summary-row">
                <span>Envío</span>
                <strong>
                  {formatearPrecio(envio)}
                </strong>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <strong>
                  {formatearPrecio(total)}
                </strong>
              </div>

              <button
                type="button"
                className="btn btn-dark w-100 mt-3 checkout-btn"
                disabled
                title="Disponible cuando implementemos el checkout"
              >
                Finalizar compra
              </button>

            </div>
          </div>

        </div>

      )}

    </main>
  )
}
