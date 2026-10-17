import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style/Style.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import HomePage from './components/pages/HomePage'
import BlogPage from './components/pages/BlogPage'
import AboutPage from './components/pages/AboutPage'
import ContactPage from './components/pages/ContactPage'
import AccountPage from './components/pages/AccountPage'
import CartPage from './components/pages/CartPage'
import NotFoundPage from './components/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
