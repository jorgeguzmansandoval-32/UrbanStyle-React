import chaquetaRacing from '../../Imagen/catalogo-chaqueta-racing.jpg'
import cortaviento from '../../Imagen/catalogo-cortaviento-tech.jpg'
import jeans from '../../Imagen/catalogo-jeans-ripped.jpg'

const tendencias = [
  {
    numero: '01',
    categoria: 'CAPAS TÉCNICAS',
    titulo: 'Capas para moverte',
    descripcion: 'Cortavientos ligeros y siluetas funcionales para vestir por capas sin perder libertad.',
    image: cortaviento,
    imageAlt: 'Cortaviento urbano de corte técnico'
  },
  {
    numero: '02',
    categoria: 'DENIM CON ACTITUD',
    titulo: 'El denim no se queda quieto',
    descripcion: 'Texturas gastadas y cortes relajados dan carácter a las combinaciones de todos los días.',
    image: jeans,
    imageAlt: 'Jeans negros urbanos con detalles desgastados'
  },
  {
    numero: '03',
    categoria: 'SPORT STREET',
    titulo: 'Energía en cada detalle',
    descripcion: 'Gráficas deportivas y acentos contrastantes llevan la inspiración racing a la calle.',
    image: chaquetaRacing,
    imageAlt: 'Chaqueta negra de inspiración racing'
  }
]

export default function BlogPage() {
  return (
    <main className="blog-page">
      <section className="site-page-hero">
        <div className="site-page-hero-inner">
          <span className="section-number">01 / JOURNAL</span>
          <h1>
            Historias de
            <br />
            <span>la calle.</span>
          </h1>
          <p>Inspiración, cultura urbana y novedades de UrbanStyle.</p>
        </div>
      </section>

      <section className="blog-trends section-shell">
        <div className="blog-trends-header">
          <div>
            <span className="section-number">02 / TENDENCIA</span>
            <h2>
              UrbanStyle
              <br />
              <span>Season Edit.</span>
            </h2>
          </div>
          <p>
            La temporada trae capas de corte técnico, suéteres de volumen,
            denim con actitud y acentos brillantes que elevan el streetwear
            cotidiano.
          </p>
        </div>

        <div className="trend-grid" aria-live="polite">
          {tendencias.map((tendencia) => (
            <article className="trend-card" key={tendencia.numero}>
              <div className="trend-card-media">
                <img src={tendencia.image} alt={tendencia.imageAlt} loading="lazy" />
              </div>
              <div className="trend-card-content">
                <div className="trend-card-meta">
                  <span>{tendencia.categoria}</span>
                  <span>{tendencia.numero}</span>
                </div>
                <h3>{tendencia.titulo}</h3>
                <p>{tendencia.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
