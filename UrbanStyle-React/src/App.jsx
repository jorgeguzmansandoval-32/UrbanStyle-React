
import { useEffect } from 'react'

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'

import './estilos/Style.css'

import NavBar from './componentes/NavBar'
import Footer from './componentes/Footer'

import InicioPage from './componentes/paginas/InicioPage'
import BlogPage from './componentes/paginas/BlogPage'
import NosotrosPage from './componentes/paginas/NosotrosPage'
import ContactoPage from './componentes/paginas/ContactoPage'
import CuentaPage from './componentes/paginas/CuentaPage'
import RegistrarUsuarioPage from './componentes/paginas/RegistrarUsuarioPage'
import CarritoPage from './componentes/paginas/CarritoPage'
import CheckoutPage from './componentes/paginas/CheckoutPage'
import PagoExitosoPage from './componentes/paginas/PagoExitosoPage'
import PagoErrorPage from './componentes/paginas/PagoErrorPage'
import CategoriasPage from './componentes/paginas/CategoriasPage'
import OfertasPage from './componentes/paginas/OfertasPage'
import PaginaNoEncontrada from './componentes/paginas/PaginaNoEncontrada'

import AdminProductos from './admin/AdminProductos'
import AdminUsuarios from './admin/AdminUsuarios'
import AdminDashboard from './admin/adminsDashboard'
import AdminPedidos from './admin/AdminPedidos'

import { obtenerSesion } from './data/autenticacion'

// Proteger rutas administrativas
function RutaAdmin({ children }) {
  const location = useLocation()
  const usuario = obtenerSesion()

  if (usuario?.rol !== 'admin') {
    return (
      <Navigate
        to="/account"
        replace
        state={{ from: location }}
      />
    )
  }

  return children
}

// Navegación hacia secciones de la página
function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(
        hash.slice(1)
      )?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [hash, pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />

      <NavBar />

      <Routes>

        {/* TIENDA */}
        <Route path="/" element={<InicioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<NosotrosPage />} />
        <Route path="/contact" element={<ContactoPage />} />
        <Route path="/account" element={<CuentaPage />} />
        <Route path="/registrar" element={<RegistrarUsuarioPage />} />

        {/* CATÁLOGO */}
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/ofertas" element={<OfertasPage />} />

        {/* COMPRAS */}
        <Route path="/cart" element={<CarritoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pago-exitoso" element={<PagoExitosoPage />} />
        <Route path="/pago-error" element={<PagoErrorPage />} />

        {/* ADMINISTRACIÓN */}
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <AdminDashboard />
            </RutaAdmin>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <RutaAdmin>
              <AdminProductos />
            </RutaAdmin>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <RutaAdmin>
              <AdminUsuarios />
            </RutaAdmin>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <RutaAdmin>
              <AdminPedidos />
            </RutaAdmin>
          }
        />

        {/* RUTA NO ENCONTRADA */}
        <Route
          path="*"
          element={<PaginaNoEncontrada />}
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  )
}

export default App
