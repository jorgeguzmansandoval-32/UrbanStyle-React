
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  obtenerCarrito,
  calcularTotales,
  formatearPrecio
} from '../../data/carrito'

import { registrarPedido } from '../../data/pedidos'

const regiones = {
  'Región Metropolitana de Santiago': [
    'Santiago', 'Cerrillos', 'Maipú',
    'Providencia', 'Puente Alto', 'La Florida'
  ],
  'Valparaíso': [
    'Valparaíso', 'Viña del Mar', 'Quilpué', 'San Antonio'
  ],
  'Biobío': [
    'Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel'
  ]
}

const datosIniciales = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: ''
}

export default function CheckoutPage() {
  const navigate = useNavigate()

  const [carrito] = useState(obtenerCarrito)
  const [formData, setFormData] = useState(datosIniciales)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  const { subtotal, envio, total } = calcularTotales(carrito)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((anterior) => ({
      ...anterior,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {})
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setProcesando(true)

    try {
      const pedido = registrarPedido(formData)

      navigate('/pago-exitoso', {
        replace: true,
        state: { pedidoId: pedido.id }
      })
    } catch (error) {
      setError(error.message)
      setProcesando(false)
    }
  }

  if (carrito.length === 0) {
    return (
      <main className="container my-5">
        <div className="empty-cart text-center">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos antes de continuar.</p>

          <Link to="/" className="btn btn-dark">
            Volver a la tienda
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container my-4 checkout-page">
      <Link to="/cart" className="btn btn-outline-dark mb-3">
        ← Volver al carrito
      </Link>

      <div className="card shadow-sm p-4">
        <h1 className="h3 mb-4">
          Información del cliente y despacho
        </h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">
                Nombre *
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="form-control"
                minLength={3}
                required
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="apellidos" className="form-label">
                Apellidos *
              </label>
              <input
                id="apellidos"
                type="text"
                name="apellidos"
                className="form-control"
                minLength={3}
                required
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label htmlFor="correo" className="form-label">
                Correo electrónico *
              </label>
              <input
                id="correo"
                type="email"
                name="correo"
                className="form-control"
                required
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <h2 className="h4 mt-3">
                Dirección de entrega
              </h2>
            </div>

            <div className="col-md-8">
              <label htmlFor="calle" className="form-label">
                Calle y número *
              </label>
              <input
                id="calle"
                type="text"
                name="calle"
                className="form-control"
                minLength={5}
                required
                value={formData.calle}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="departamento" className="form-label">
                Departamento (opcional)
              </label>
              <input
                id="departamento"
                type="text"
                name="departamento"
                className="form-control"
                value={formData.departamento}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="region" className="form-label">
                Región *
              </label>
              <select
                id="region"
                name="region"
                className="form-select"
                required
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Seleccione región</option>
                {Object.keys(regiones).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="comuna" className="form-label">
                Comuna *
              </label>
              <select
                id="comuna"
                name="comuna"
                className="form-select"
                required
                disabled={!formData.region}
                value={formData.comuna}
                onChange={handleChange}
              >
                <option value="">Seleccione comuna</option>
                {(regiones[formData.region] || []).map((comuna) => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="indicaciones" className="form-label">
                Indicaciones adicionales
              </label>
              <textarea
                id="indicaciones"
                name="indicaciones"
                className="form-control"
                rows="3"
                value={formData.indicaciones}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="summary-card mt-4">
            <h2 className="h4 mb-3">
              Resumen del pedido
            </h2>

            {carrito.map((producto) => (
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

            <hr />

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatearPrecio(subtotal)}</strong>
            </div>

            <div className="summary-row">
              <span>Envío</span>
              <strong>{formatearPrecio(envio)}</strong>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <strong>{formatearPrecio(total)}</strong>
            </div>

            <button
              type="submit"
              className="btn btn-dark btn-lg w-100 mt-4"
              disabled={procesando}
            >
              {procesando
                ? 'Procesando pedido...'
                : 'Confirmar compra simulada'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
