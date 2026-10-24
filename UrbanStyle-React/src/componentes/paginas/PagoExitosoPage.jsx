
import { Link, useLocation } from 'react-router-dom'

import { obtenerPedidoPorId } from '../../data/pedidos'
import { formatearPrecio } from '../../data/carrito'

export default function PagoExitosoPage() {
  const { state } = useLocation()

  const pedido = state?.pedidoId
    ? obtenerPedidoPorId(state.pedidoId)
    : null

  if (!pedido) {
    return (
      <main className="container my-5 text-center">
        <div className="card shadow-sm p-4 mx-auto payment-result-card">
          <h2>No se encontró una compra para mostrar</h2>

          <p>
            Para obtener un comprobante, debes completar
            una compra simulada desde el carrito.
          </p>

          <Link to="/" className="btn btn-dark">
            Volver a la tienda
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container my-5 text-center">
      <div className="card shadow-sm p-4 mx-auto payment-result-card payment-result-card-success">

        <div className="mb-4">
          <h1 className="h2">
            ¡Compra registrada correctamente!
          </h1>

          <p className="text-secondary">
            Tu pedido simulado se ha confirmado.
          </p>

          <h2 className="h5">
            N° de orden: {pedido.id.slice(0, 8).toUpperCase()}
          </h2>
        </div>

        <div className="text-start bg-light p-3 rounded mb-3">
          <h3 className="h5">Datos del comprador</h3>

          <p>
            <strong>Cliente:</strong>{' '}
            {pedido.cliente.nombre} {pedido.cliente.apellidos}
          </p>

          <p>
            <strong>Correo:</strong>{' '}
            {pedido.cliente.correo}
          </p>

          <p>
            <strong>Dirección:</strong>{' '}
            {pedido.cliente.calle},{' '}
            {pedido.cliente.comuna},{' '}
            {pedido.cliente.region}
          </p>
        </div>

        <div className="text-start mb-3">
          <h3 className="h5">Productos comprados</h3>

          {pedido.productos.map((producto) => (
            <div
              key={producto.id}
              className="d-flex justify-content-between gap-3 mb-2"
            >
              <span>
                {producto.name} × {producto.quantity}
              </span>

              <strong>
                {formatearPrecio(
                  producto.price * producto.quantity
                )}
              </strong>
            </div>
          ))}
        </div>

        <hr />

        <div className="d-flex justify-content-between mb-2">
          <span>Envío</span>
          <strong>{formatearPrecio(pedido.envio)}</strong>
        </div>

        <div className="d-flex justify-content-between fs-5">
          <strong>Total</strong>
          <strong>{formatearPrecio(pedido.total)}</strong>
        </div>

        <Link to="/" className="btn btn-dark btn-lg mt-4">
          Volver a la tienda
        </Link>
      </div>
    </main>
  )
}
