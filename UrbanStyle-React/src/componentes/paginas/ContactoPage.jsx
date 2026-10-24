import { Link } from 'react-router-dom'

export default function ContactoPage() {
  return (
    <main className="contacto-page">
      <section className="site-page-hero">
        <div className="site-page-hero-inner">
          <span className="section-number">03 / CONTACTO</span>
          <h1>
            Hablemos
            <br />
            <span>de tu estilo.</span>
          </h1>
          <p>
            Estamos aquí para ayudarte con tus compras, pedidos y dudas.
          </p>
          <Link
            to="/registrar"
            className="premium-btn premium-btn-primary contact-form-link"
          >
            Abrir formulario <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
