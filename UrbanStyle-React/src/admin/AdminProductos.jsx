
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../data/productos'

const formularioInicial = {
  name: '',
  description: '',
  price: '',
  stock: ''
}

export default function AdminProductos() {

  const [productos, setProductos] = useState(obtenerProductos)
  const [formulario, setFormulario] = useState(formularioInicial)
  const [imagen, setImagen] = useState('')
  const [stocks, setStocks] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  // Actualizar los campos del formulario
  function manejarCambio(event) {
    const { name, value } = event.target

    setFormulario({
      ...formulario,
      [name]: value
    })
  }

  // Convertir la imagen seleccionada a base64
  function manejarImagen(event) {
    const archivo = event.target.files[0]

    if (!archivo) {
      setImagen('')
      return
    }

    if (!archivo.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen válido.')
      setImagen('')
      return
    }

    const lector = new FileReader()

    lector.onload = () => {
      setImagen(lector.result)
      setError('')
    }

    lector.onerror = () => {
      setError('No se pudo leer la imagen.')
    }

    lector.readAsDataURL(archivo)
  }

  // CREATE: Guardar un producto nuevo
  function manejarGuardar(event) {
    event.preventDefault()

    setMensaje('')
    setError('')

    try {
      if (!formulario.description.trim()) {
        throw new Error('La descripción es obligatoria.')
      }

      const nuevoProducto = {
        name: formulario.name,
        description: formulario.description,
        price: Number(formulario.price),
        stock: Number(formulario.stock),
        image: imagen
      }

      crearProducto(nuevoProducto)

      setProductos(obtenerProductos())
      setFormulario(formularioInicial)
      setImagen('')

      event.target.reset()

      setMensaje('Producto agregado correctamente.')
    } catch (error) {
      setError(error.message)
    }
  }

  // Cambiar el stock escrito en el listado
  function manejarStock(id, valor) {
    setStocks({
      ...stocks,
      [id]: valor
    })
  }

  // UPDATE: Guardar el nuevo stock
  function guardarStock(producto) {
    setMensaje('')
    setError('')

    try {
      const nuevoStock = stocks[producto.id] ?? producto.stock

      actualizarProducto(producto.id, {
        stock: nuevoStock
      })

      setProductos(obtenerProductos())

      setMensaje('Stock actualizado correctamente.')
    } catch (error) {
      setError(error.message)
    }
  }

  // DELETE: Eliminar un producto
  function manejarEliminar(id) {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este producto?'
    )

    if (!confirmar) {
      return
    }

    setMensaje('')
    setError('')

    try {
      eliminarProducto(id)
      setProductos(obtenerProductos())

      setMensaje('Producto eliminado correctamente.')
    } catch (error) {
      setError(error.message)
    }
  }

  // Formatear precios chilenos
  function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(precio)
  }

  return (
    <main className="container my-5">

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <h1 className="mb-0">
          Panel de administración
        </h1>

        <div className="d-flex gap-2 flex-wrap">

          <Link
            to="/admin/orders"
            className="btn btn-outline-dark"
          >
            Ver compras
          </Link>

          <Link
            to="/"
            className="btn btn-dark"
          >
            Volver al inicio
          </Link>

        </div>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">

        {/* FORMULARIO DE PRODUCTOS */}
        <div className="col-lg-5">

          <div className="admin-card">

            <h3>Crear nuevo producto</h3>

            <form
              className="product-form"
              onSubmit={manejarGuardar}
            >

              <div className="form-group">
                <label htmlFor="productName">
                  Nombre del producto
                </label>

                <input
                  id="productName"
                  type="text"
                  name="name"
                  placeholder="Ej: Camisa Oversize"
                  value={formulario.name}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productDescription">
                  Descripción
                </label>

                <textarea
                  id="productDescription"
                  name="description"
                  rows="3"
                  placeholder="Ej: 100% algodón, elegante y cómoda."
                  value={formulario.description}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productPrice">
                  Precio
                </label>

                <input
                  id="productPrice"
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  placeholder="Ej: 24990"
                  value={formulario.price}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productStock">
                  Stock
                </label>

                <input
                  id="productStock"
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  placeholder="Ej: 12"
                  value={formulario.stock}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productImage">
                  Seleccionar imagen del equipo
                </label>

                <input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={manejarImagen}
                />
              </div>

              {imagen && (
                <img
                  src={imagen}
                  alt="Vista previa del producto"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              )}

              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Guardar producto
              </button>

            </form>
          </div>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div className="col-lg-7">

          <div className="admin-card">

            <h3>Productos actuales</h3>

            <div className="admin-product-list">

              {productos.length === 0 ? (

                <p className="empty-admin">
                  No hay productos disponibles.
                </p>

              ) : (

                productos.map((producto) => (

                  <div
                    className="admin-product-item"
                    key={producto.id}
                  >

                    {producto.image ? (
                      <img
                        src={producto.image}
                        alt={producto.name}
                      />
                    ) : (
                      <div
                        className="placeholder-image"
                        style={{
                          width: '90px',
                          height: '90px',
                          flexShrink: 0
                        }}
                      >
                        Sin imagen
                      </div>
                    )}

                    <div className="admin-product-info">

                      <h4>{producto.name}</h4>

                      <p>{producto.description}</p>

                      <strong>
                        {formatearPrecio(producto.price)}
                      </strong>

                      <div className="mt-2">
                        <label
                          htmlFor={`stock-${producto.id}`}
                          className="form-label"
                        >
                          Stock
                        </label>

                        <input
                          id={`stock-${producto.id}`}
                          className="form-control"
                          type="number"
                          min="0"
                          step="1"
                          value={
                            stocks[producto.id] ??
                            producto.stock
                          }
                          onChange={(event) =>
                            manejarStock(
                              producto.id,
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="d-flex flex-wrap gap-2 mt-3">

                        <button
                          type="button"
                          className="btn btn-dark btn-sm"
                          onClick={() =>
                            guardarStock(producto)
                          }
                        >
                          Guardar stock
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            manejarEliminar(producto.id)
                          }
                        >
                          Eliminar
                        </button>

                      </div>
                    </div>
                  </div>

                ))

              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
