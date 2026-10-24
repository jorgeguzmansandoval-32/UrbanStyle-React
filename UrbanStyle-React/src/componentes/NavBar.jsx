import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerCarrito } from '../data/carrito'
import { cerrarSesion, obtenerSesion } from '../data/autenticacion'
import LogoUrbanStyle from './LogoUrbanStyle'

function NavBar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sesion, setSesion] = useState(obtenerSesion)
  const [cantidadEnBolsa, setCantidadEnBolsa] = useState(() =>
    obtenerCarrito().reduce(
      (total, producto) => total + Number(producto.quantity || 0),
      0
    )
  )

  useEffect(() => {
    function actualizarContador() {
      const cantidad = obtenerCarrito().reduce(
        (total, producto) => total + Number(producto.quantity || 0),
        0
      )

      setCantidadEnBolsa(cantidad)
    }

    window.addEventListener('carritoActualizado', actualizarContador)
    window.addEventListener('storage', actualizarContador)

    return () => {
      window.removeEventListener('carritoActualizado', actualizarContador)
      window.removeEventListener('storage', actualizarContador)
    }
  }, [])

  useEffect(() => {
    function actualizarSesion() {
      setSesion(obtenerSesion())
    }

    window.addEventListener('urbanstyleSesionActualizada', actualizarSesion)
    window.addEventListener('storage', actualizarSesion)

    return () => {
      window.removeEventListener('urbanstyleSesionActualizada', actualizarSesion)
      window.removeEventListener('storage', actualizarSesion)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <header>
      <nav className="navbar-custom">
        <div className="logo">
          <LogoUrbanStyle className="navbar-logo-image" />
        </div>
        
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          type="button" 
          aria-label="Abrir menú" 
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/#categorias">Explora</Link></li>
          <li><Link to="/#productos">Shop</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/about">Nosotros</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
          {sesion?.rol === 'admin' && (
            <>
              <li><Link to="/admin">Panel admin</Link></li>
              <li><Link to="/admin/productos">Productos</Link></li>
              <li><Link to="/admin/usuarios">Usuarios admin</Link></li>
            </>
          )}
          {!sesion ? (
            <li><Link to="/account">Cuenta</Link></li>
          ) : (
            <li>
              <button
                type="button"
                className="nav-session-button"
                onClick={manejarCerrarSesion}
              >
                Cerrar sesión
              </button>
            </li>
          )}
          <li className="nav-item-cart">
            <Link to="/cart">
              Bolsa <span className="cart-badge">{cantidadEnBolsa}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default NavBar