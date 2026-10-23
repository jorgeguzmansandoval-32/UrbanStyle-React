
import { Link } from 'react-router-dom'
import Productos from '../Productos'

export default function InicioPage() {
  const categories = [
    {
      name: 'Hombres',
      text: 'Ropa urbana, oversized y essentials premium.'
    },
    {
      name: 'Mujeres',
      text: 'Look minimalista, elegante y con actitud callejera.'
    },
    {
      name: 'Accesorios',
      text: 'Bolsas, gorras, gafas y detalles que completan el outfit.'
    }
  ]

  return (
    <main className="home-page">
      <section className="titulo_bienvenida">
        <div>
          <h1>URBANSTYLE</h1>

          <p>
            Ropa y accesorios para quienes viven la cultura
            streetwear todos los días.
          </p>

          <div className="banner-buttons">
            <Link to="/#productos" className="btn btn-inicio">
              Ver colecciones
            </Link>

            <Link to="/about" className="btn btn-inicio">
              Nuestra historia
            </Link>
          </div>
        </div>
      </section>

      <section
        id="categorias"
        className="explore-section"
        style={{ padding: '64px 24px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            style={{
              color: '#7d7d77',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            Categorías
          </p>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3vw, 3.2rem)',
              margin: '12px 0 28px'
            }}
          >
            Diseñado para moverte con estilo
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '22px'
            }}
          >
            {categories.map((category) => (
              <article
                key={category.name}
                style={{
                  background: '#fff',
                  borderRadius: '18px',
                  padding: '24px',
                  border: '1px solid #eaeae5'
                }}
              >
                <h3
                  style={{
                    margin: '0 0 10px',
                    fontSize: '1.4rem'
                  }}
                >
                  {category.name}
                </h3>

                <p style={{ color: '#666', margin: 0 }}>
                  {category.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Productos />
    </main>
  )
}
