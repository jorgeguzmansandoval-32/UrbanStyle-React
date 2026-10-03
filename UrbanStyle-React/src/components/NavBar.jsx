import { useState } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header>
      <nav className="navbar-custom">
        <div className="logo">
          <Link to="/" aria-label="UrbanStyle inicio">
            <img 
              src="/favicon.svg" 
              width="48" 
              height="48" 
              alt="Logo UrbanStyle" 
            />
          </Link>
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
          <li data-admin-item="true" style={{ display: 'none' }}>
            <Link to="/admin/productos">Crear productos</Link>
          </li>
          <li data-admin-orders-item="true" style={{ display: 'none' }}>
            <Link to="/admin/orders">Compras</Link>
          </li>
          <li><Link to="/account">Cuenta</Link></li>
          <li className="nav-item-cart">
            <Link to="/cart">
              Bolsa <span className="cart-badge">0</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default NavBar