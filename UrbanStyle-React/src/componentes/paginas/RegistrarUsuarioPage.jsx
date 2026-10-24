import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import regionesChile from '../../data/regionesChile'
import { registrarCliente } from '../../data/autenticacion'

const formularioInicial = {
  nombre: '',
  email: '',
  telefono: '',
  region: '',
  comuna: '',
  password: ''
}

export default function RegistrarUsuarioPage() {
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState(formularioInicial)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  function manejarCambio(event) {
    const { name, value } = event.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {})
    }))
    setErrores((actuales) => ({ ...actuales, [name]: '' }))
    setErrorGeneral('')
  }

  function validarFormulario() {
    const nuevosErrores = {}

    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.'
    }
    if (!/^\d{8,15}$/.test(formulario.telefono.trim())) {
      nuevosErrores.telefono = 'Ingresa un teléfono de 8 a 15 dígitos.'
    }
    if (!formulario.region) nuevosErrores.region = 'Selecciona una región.'
    if (!formulario.comuna) nuevosErrores.comuna = 'Selecciona una comuna.'
    if (!/^[a-zA-Z0-9!@#$%^&,.]{6,50}$/.test(formulario.password)) {
      nuevosErrores.password = 'Usa de 6 a 50 caracteres válidos.'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function manejarRegistro(event) {
    event.preventDefault()
    setErrorGeneral('')

    if (!validarFormulario()) return

    try {
      registrarCliente(formulario)
      navigate('/', { replace: true })
    } catch (errorRegistro) {
      setErrorGeneral(errorRegistro.message)
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial)
    setErrores({})
    setErrorGeneral('')
  }

  const comunas = formulario.region ? regionesChile[formulario.region] : []

  return (
    <main className="registration-page">
      <section className="form-container registration-container">
        <span className="section-number">04 / NUEVA CUENTA</span>
        <h1>Formulario de Registro</h1>

        <form className="registration-form" onSubmit={manejarRegistro} noValidate>
          <div className="form-group">
            <label htmlFor="registro-nombre">Nombre Completo</label>
            <input
              id="registro-nombre"
              name="nombre"
              type="text"
              placeholder="Juan Pérez"
              autoComplete="name"
              value={formulario.nombre}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.nombre)}
              required
            />
            {errores.nombre && <span className="error-mensaje" role="alert">{errores.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="registro-email">Correo Electrónico</label>
            <input
              id="registro-email"
              name="email"
              type="email"
              placeholder="juan.perez@example.com"
              autoComplete="email"
              value={formulario.email}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.email)}
              required
            />
            {errores.email && <span className="error-mensaje" role="alert">{errores.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="registro-telefono">Teléfono de Contacto</label>
            <input
              id="registro-telefono"
              name="telefono"
              type="tel"
              inputMode="numeric"
              placeholder="Ej: 912345678"
              autoComplete="tel"
              value={formulario.telefono}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.telefono)}
              required
            />
            {errores.telefono && <span className="error-mensaje" role="alert">{errores.telefono}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="registro-region">Región</label>
            <select
              id="registro-region"
              name="region"
              value={formulario.region}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.region)}
              required
            >
              <option value="">Selecciona una región</option>
              {Object.keys(regionesChile).map((region) => (
                <option value={region} key={region}>{region}</option>
              ))}
            </select>
            {errores.region && <span className="error-mensaje" role="alert">{errores.region}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="registro-comuna">Comuna</label>
            <select
              id="registro-comuna"
              name="comuna"
              value={formulario.comuna}
              onChange={manejarCambio}
              disabled={!formulario.region}
              aria-invalid={Boolean(errores.comuna)}
              required
            >
              <option value="">
                {formulario.region ? 'Selecciona una comuna' : 'Selecciona primero la región'}
              </option>
              {comunas.map((comuna) => (
                <option value={comuna} key={comuna}>{comuna}</option>
              ))}
            </select>
            {errores.comuna && <span className="error-mensaje" role="alert">{errores.comuna}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="registro-password">Contraseña</label>
            <input
              id="registro-password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              value={formulario.password}
              onChange={manejarCambio}
              aria-invalid={Boolean(errores.password)}
              required
            />
            {errores.password && <span className="error-mensaje" role="alert">{errores.password}</span>}
          </div>

          {errorGeneral && <p className="account-login-message" role="alert">{errorGeneral}</p>}

          <div className="account-login-actions">
            <button type="submit" className="btn btn-dark">Registrarse</button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={limpiarFormulario}
            >
              Limpiar formulario
            </button>
            <Link to="/contact" className="btn btn-outline-secondary">Volver</Link>
          </div>
        </form>
      </section>
    </main>
  )
}