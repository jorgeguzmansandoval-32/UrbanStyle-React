const defaultProducts = [
  { name: 'Chaqueta Street Lite', price: '$129.900', tag: 'NUEVO' },
  { name: 'Pantalón Cargo Core', price: '$89.900', tag: 'TOP' },
  { name: 'Polerón Urban Flex', price: '$119.900', tag: 'LIMITADO' },
  { name: 'Zapatillas Drift', price: '$149.900', tag: 'DESTACADO' },
]

export default function Productos({ products = defaultProducts }) {
  return (
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
  )
}
