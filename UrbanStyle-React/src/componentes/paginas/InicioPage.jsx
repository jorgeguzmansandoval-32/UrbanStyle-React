import { Link } from 'react-router-dom'

export default function InicioPage() {
  const categories = [
    { name: 'Hombres', text: 'Ropa urbana, oversized y essentials premium.' },
    { name: 'Mujeres', text: 'Look minimalista, elegante y con actitud callejera.' },
    { name: 'Accesorios', text: 'Bolsas, gorras, gafas y detalles que completan el outfit.' },
  ]

  const products = [
    { name: 'Chaqueta Street Lite', price: '$129.900', tag: 'NUEVO' },
    { name: 'Pantalón Cargo Core', price: '$89.900', tag: 'TOP' },
    { name: 'Polerón Urban Flex', price: '$119.900', tag: 'LIMITADO' },
    { name: 'Zapatillas Drift', price: '$149.900', tag: 'DESTACADO' },
  ]

  return (
    <main className="home-page">
      <section className="titulo_bienvenida">
        <div>
          <h1>URBANSTYLE</h1>
          <p>
            Ropa y accesorios para quienes viven la cultura streetwear todos los días.
          </p>
          <div>
            <Link to="/#productos" className="btn btn-primary">Ver colecciones</Link>
            <Link to="/about" className="btn btn-outline-dark">Nuestra historia</Link>
          </div>
        </div>
      </section>

      <section id="categorias" className="explore-section" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#7d7d77', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.8rem', fontWeight: 700 }}>
            Categorías
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 3vw, 3.2rem)', margin: '12px 0 28px' }}>
            Diseñado para moverte con estilo
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px' }}>
            {categories.map((category) => (
              <article key={category.name} style={{ background: '#fff', borderRadius: '18px', padding: '24px', border: '1px solid #eaeae5' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '1.4rem' }}>{category.name}</h3>
                <p style={{ color: '#666', margin: 0 }}>{category.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" className="products-section" style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <div>
              <p style={{ color: '#7d7d77', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.8rem', fontWeight: 700 }}>
                Colección
              </p>
              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', margin: '10px 0 0' }}>Lo más vendido</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px' }}>
            {products.map((product) => (
              <article key={product.name} style={{ background: '#f8f8f5', borderRadius: '18px', padding: '18px', border: '1px solid #ecece7' }}>
                <div style={{ height: '220px', background: 'linear-gradient(135deg, #111 15%, #2d2d2d 40%, #c8ff00 120%)', borderRadius: '14px', marginBottom: '18px' }} />
                <p style={{ color: '#7d7d77', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {product.tag}
                </p>
                <h3 style={{ margin: '0 0 10px', fontSize: '1.3rem' }}>{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#111' }}>{product.price}</strong>
                  <button type="button" className="btn btn-primary" style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
                    Agregar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
