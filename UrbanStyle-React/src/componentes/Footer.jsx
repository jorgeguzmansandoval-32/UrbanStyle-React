import LogoUrbanStyle from './LogoUrbanStyle'

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <LogoUrbanStyle
        className="footer-logo-image"
        linkClassName="footer-logo-link"
      />
      <p className="mb-0">&copy; 2026 UrbanStyle. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer
