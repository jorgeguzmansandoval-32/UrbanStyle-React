
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
        className="explore-section categories-section"
      >
        <div className="categories-inner">
          <p className="categories-kicker">
            Categorías
          </p>

          <h2 className="categories-title">
            Diseñado para moverte con estilo
          </h2>

          <div className="categories-grid">
            {categories.map((category) => (
              <article
                key={category.name}
                className="category-card"
              >
                <h3 className="category-card-title">
                  {category.name}
                </h3>

                <p className="category-card-description">
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
