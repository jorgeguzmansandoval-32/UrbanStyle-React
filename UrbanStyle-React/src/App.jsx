import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './estilos/Style.css'
import NavBar from './componentes/NavBar'
import Footer from './componentes/Footer'
import InicioPage from './componentes/paginas/InicioPage'
import BlogPage from './componentes/paginas/BlogPage'
import AcercaPage from './componentes/paginas/AcercaPage'
import ContactoPage from './componentes/paginas/ContactoPage'
import CuentaPage from './componentes/paginas/CuentaPage'
import CarritoPage from './componentes/paginas/CarritoPage'
import PaginaNoEncontrada from './componentes/paginas/PaginaNoEncontrada'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AcercaPage />} />
        <Route path="/contact" element={<ContactoPage />} />
        <Route path="/account" element={<CuentaPage />} />
        <Route path="/cart" element={<CarritoPage />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
