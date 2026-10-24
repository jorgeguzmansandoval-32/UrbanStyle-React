import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { iniciarSesion } from '../../data/autenticacion'

export default function CuentaPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  function validarCorreo(valor) {
    if (!valor.trim()) {
      return 'El correo electrónico es obligatorio.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      return 'Ingresa un correo electrónico válido.'
    }

    return ''
  }

  function validarContrasena(valor) {
    return valor.trim()
      ? ''
      : 'La contraseña es obligatoria.'
  }

  function manejarEnvio(event) {
    event.preventDefault()

    const erroresFormulario = {
      correo: validarCorreo(correo),
      contrasena: validarContrasena(contrasena)
    }

    setErrores(erroresFormulario)

    if (erroresFormulario.correo || erroresFormulario.contrasena) {
      setMensaje('')
      return
    }

    try {
      const usuario = iniciarSesion(correo, contrasena)
      const destino = usuario.rol === 'admin'
        ? '/admin'
        : location.state?.from?.pathname || '/'

      navigate(destino, { replace: true })
    } catch (errorInicioSesion) {
      setMensaje(errorInicioSesion.message)
    }
  }

  return (
    <main className="account-page">
      <section className="form-container account-login-container">
        <span className="section-number">04 / CUENTA</span>
        <h1>Login Usuario</h1>

        <form
          id="account-login-form"
          className="account-login-form"
          onSubmit={manejarEnvio}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="juan.perez@example.com"
              autoComplete="email"
              value={correo}
              aria-invalid={Boolean(errores.correo)}
              aria-describedby={errores.correo ? 'errorCorreo' : undefined}
              onChange={(event) => {
                setCorreo(event.target.value)
                setMensaje('')
              }}
              onBlur={() => setErrores((anteriores) => ({
                ...anteriores,
                correo: validarCorreo(correo)
              }))}
            />
            {errores.correo && (
              <span id="errorCorreo" className="error-mensaje" role="alert">
                {errores.correo}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              value={contrasena}
              aria-invalid={Boolean(errores.contrasena)}
              aria-describedby={errores.contrasena ? 'errorContrasena' : undefined}
              onChange={(event) => {
                setContrasena(event.target.value)
                setMensaje('')
              }}
              onBlur={() => setErrores((anteriores) => ({
                ...anteriores,
                contrasena: validarContrasena(contrasena)
              }))}
            />
            {errores.contrasena && (
              <span id="errorContrasena" className="error-mensaje" role="alert">
                {errores.contrasena}
              </span>
            )}
          </div>

          {mensaje && (
            <p className="account-login-message" role="status">
              {mensaje}
            </p>
          )}

          <div className="account-login-actions">
            <button type="submit" className="btn btn-dark">
              Ingresar
            </button>
            <Link to="/registrar" className="btn btn-outline-primary">
              Registrarse
            </Link>
            <Link to="/" className="btn btn-outline-dark">
              Volver
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}
