import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  crearAdministrador,
  eliminarAdministrador,
  obtenerAdministradores
} from '../data/autenticacion'

const formularioInicial = {
  nombre: '',
  email: '',
  password: ''
}

export default function AdminUsuarios() {
  const [administradores, setAdministradores] = useState(obtenerAdministradores)
  const [formulario, setFormulario] = useState(formularioInicial)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function manejarCambio(event) {
    const { name, value } = event.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function manejarCrear(event) {
    event.preventDefault()
    setMensaje('')
    setError('')

    try {
      crearAdministrador(formulario)
      setAdministradores(obtenerAdministradores())
      setFormulario(formularioInicial)
      event.currentTarget.reset()
      setMensaje('Usuario administrador creado correctamente.')
    } catch (errorCreacion) {
      setError(errorCreacion.message)
    }
  }

  function manejarEliminar(administrador) {
    if (!window.confirm(`¿Eliminar el acceso de ${administrador.email}?`)) {
      return
    }

    setMensaje('')
    setError('')

    try {
      setAdministradores(eliminarAdministrador(administrador.id))
      setMensaje('Usuario administrador eliminado.')
    } catch (errorEliminacion) {
      setError(errorEliminacion.message)
    }
  }

  return (
    <main className="container my-5 admin-users-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <p className="section-number">ADMIN / ACCESOS</p>
          <h1 className="mb-0">Usuarios administradores</h1>
        </div>
        <Link to="/admin" className="btn btn-outline-dark">
          Volver al panel
        </Link>
      </div>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-4">
        <section className="col-lg-5" aria-labelledby="crear-admin-heading">
          <div className="admin-card">
            <h2 id="crear-admin-heading">Crear usuario administrador</h2>
            <form className="product-form" onSubmit={manejarCrear}>
              <div className="form-group">
                <label htmlFor="adminName">Nombre</label>
                <input
                  id="adminName"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="adminEmail">Correo electrónico</label>
                <input
                  id="adminEmail"
                  name="email"
                  type="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="adminPassword">Contraseña</label>
                <input
                  id="adminPassword"
                  name="password"
                  type="password"
                  value={formulario.password}
                  onChange={manejarCambio}
                  autoComplete="new-password"
                  minLength="8"
                  required
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Crear administrador
              </button>
            </form>
          </div>
        </section>

        <section className="col-lg-7" aria-labelledby="admin-list-heading">
          <div className="admin-card">
            <h2 id="admin-list-heading">Accesos habilitados</h2>
            <div className="admin-user-list">
              {administradores.map((administrador) => (
                <article className="admin-user-item" key={administrador.id}>
                  <div>
                    <h3>{administrador.nombre}</h3>
                    <p>{administrador.email}</p>
                    <span>{administrador.inicial ? 'Administrador inicial' : 'Administrador'}</span>
                  </div>
                  {administrador.inicial ? (
                    <span className="admin-user-protected">Principal</span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => manejarEliminar(administrador)}
                    >
                      Eliminar acceso
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}