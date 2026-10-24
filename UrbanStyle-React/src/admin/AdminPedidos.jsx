
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { obtenerPedidos } from '../data/pedidos'
import { formatearPrecio } from '../data/carrito'

export default function AdminPedidos() {

  const [pedidos, setPedidos] = useState(obtenerPedidos)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  // Actualizar la lista de pedidos
  function actualizarPedidos() {
    setPedidos(obtenerPedidos())
  }

  // Formatear fecha en español de Chile
  function formatearFecha(fecha) {
    const valor = new Date(fecha)

    if (Number.isNaN(valor.getTime())) {
      return 'Fecha no disponible'
    }

    return valor.toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  // Obtener nombre completo del comprador
  function nombreCliente(pedido) {
    const cliente = pedido.cliente || {}

    return [
      cliente.nombre,
      cliente.apellidos
    ].filter(Boolean).join(' ') || 'Sin nombre'
  }

  // Estados disponibles
  const estados = [
    'Todos',
    ...new Set(
      pedidos.map((pedido) => pedido.estado || 'Sin estado')
    )
  ]

  // Filtrar por cliente, ID y estado
  const pedidosFiltrados = pedidos
    .filter((pedido) => {

      const texto = busqueda.trim().toLowerCase()

      const coincideBusqueda =
        String(pedido.id).toLowerCase().includes(texto) ||
        nombreCliente(pedido).toLowerCase().includes(texto) ||
        (pedido.cliente?.correo || '')
          .toLowerCase()
          .includes(texto)

      const coincideEstado =
        filtroEstado === 'Todos' ||
        (pedido.estado || 'Sin estado') === filtroEstado

      return coincideBusqueda && coincideEstado
    })
    .sort((a, b) =>
      new Date(b.fecha) - new Date(a.fecha)
    )

  // Estadísticas de los pedidos registrados
  const totalPedidos = pedidos.length

  const ventasTotales = pedidos
    .filter((pedido) => pedido.estado === 'Confirmado')
    .reduce(
      (total, pedido) => total + Number(pedido.total || 0),
      0
    )

  return (
    <main className="container my-5">

      {/* ENCABEZADO */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>
          <span className="section-number">
            URBANSTYLE / ADMINISTRACIÓN
          </span>

          <h1 className="fw-bold mt-2">
            Gestión de pedidos
          </h1>

          <p className="text-secondary">
            Consulta las compras registradas en la tienda.
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-outline-dark"
        >
          ← Volver al dashboard
        </Link>

      </div>

      {/* ESTADÍSTICAS */}
      <div className="row g-3 mb-4">

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-secondary mb-2">
                Pedidos registrados
              </p>

              <h2 className="fw-bold mb-0">
                {totalPedidos}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <p className="text-secondary mb-2">
                Total de compras confirmadas
              </p>

              <h2 className="fw-bold mb-0">
                {formatearPrecio(ventasTotales)}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* FILTROS */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <div className="row g-3 align-items-end">

            <div className="col-md-6">
              <label
                htmlFor="buscarPedido"
                className="form-label"
              >
                Buscar pedido
              </label>

              <input
                id="buscarPedido"
                type="search"
                className="form-control"
                placeholder="Número, cliente o correo"
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
              />
            </div>

            <div className="col-md-4">
              <label
                htmlFor="estadoPedido"
                className="form-label"
              >
                Estado del pedido
              </label>

              <select
                id="estadoPedido"
                className="form-select"
                value={filtroEstado}
                onChange={(event) =>
                  setFiltroEstado(event.target.value)
                }
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-dark w-100"
                onClick={actualizarPedidos}
              >
                Actualizar
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* LISTADO */}
      <div className="card shadow-sm">

        <div className="card-body">
          <h2 className="h4 mb-4">
            Historial de compras
          </h2>

          {pedidosFiltrados.length === 0 ? (

            <div className="alert alert-secondary mb-0">
              No se encontraron pedidos registrados.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>
                    <th>N° Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {pedidosFiltrados.map((pedido) => (

                    <tr key={pedido.id}>

                      <td>
                        <strong>
                          {String(pedido.id)
                            .slice(0, 8)
                            .toUpperCase()}
                        </strong>
                      </td>

                      <td>{formatearFecha(pedido.fecha)}</td>

                      <td>
                        <strong>
                          {nombreCliente(pedido)}
                        </strong>

                        <div className="small text-secondary">
                          {pedido.cliente?.correo}
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-dark">
                          {pedido.estado || 'Sin estado'}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatearPrecio(pedido.total)}
                        </strong>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            setPedidoSeleccionado(pedido)
                          }
                        >
                          Ver detalle
                        </button>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>

            </div>

          )}
        </div>
      </div>

      {/* DETALLE DEL PEDIDO */}
      {pedidoSeleccionado && (

        <div className="card shadow-sm mt-4">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center gap-3 mb-4">

              <h2 className="h4 mb-0">
                Detalle del pedido
              </h2>

              <button
                type="button"
                className="btn btn-outline-dark btn-sm"
                onClick={() => setPedidoSeleccionado(null)}
              >
                Cerrar
              </button>

            </div>

            <p>
              <strong>Número de orden:</strong>{' '}
              {pedidoSeleccionado.id}
            </p>

            <p>
              <strong>Fecha:</strong>{' '}
              {formatearFecha(pedidoSeleccionado.fecha)}
            </p>

            <p>
              <strong>Estado:</strong>{' '}
              {pedidoSeleccionado.estado}
            </p>

            <hr />

            <h3 className="h5 mb-3">
              Datos del comprador
            </h3>

            <p>
              <strong>Nombre:</strong>{' '}
              {nombreCliente(pedidoSeleccionado)}
            </p>

            <p>
              <strong>Correo:</strong>{' '}
              {pedidoSeleccionado.cliente?.correo}
            </p>

            <p>
              <strong>Dirección:</strong>{' '}
              {pedidoSeleccionado.cliente?.calle}
            </p>

            <p>
              <strong>Comuna:</strong>{' '}
              {pedidoSeleccionado.cliente?.comuna}
            </p>

            <p>
              <strong>Región:</strong>{' '}
              {pedidoSeleccionado.cliente?.region}
            </p>

            {pedidoSeleccionado.cliente?.indicaciones && (
              <p>
                <strong>Indicaciones:</strong>{' '}
                {pedidoSeleccionado.cliente.indicaciones}
              </p>
            )}

            <hr />

            <h3 className="h5 mb-3">
              Productos comprados
            </h3>

            <div className="table-responsive">
              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {(pedidoSeleccionado.productos || []).map(
                    (producto) => (
                      <tr key={producto.id}>
                        <td>{producto.name}</td>
                        <td>{producto.quantity}</td>
                        <td>
                          {formatearPrecio(producto.price)}
                        </td>
                        <td>
                          {formatearPrecio(
                            producto.price * producto.quantity
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>

            <div className="text-end mt-3">
              <p>
                Subtotal:{' '}
                <strong>
                  {formatearPrecio(
                    pedidoSeleccionado.subtotal
                  )}
                </strong>
              </p>

              <p>
                Envío:{' '}
                <strong>
                  {formatearPrecio(
                    pedidoSeleccionado.envio
                  )}
                </strong>
              </p>

              <h3 className="h4 fw-bold">
                Total:{' '}
                {formatearPrecio(
                  pedidoSeleccionado.total
                )}
              </h3>
            </div>

          </div>
        </div>

      )}

    </main>
  )
}
