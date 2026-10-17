import PageTemplate from './PageTemplate'

export default function BlogPage() {
  return (
    <PageTemplate
      title="Blog"
      description="Ideas, tendencias y estilo urbano para inspirarte cada día."
    >
      <div className="page-card-list">
        <article className="page-card-item">
          <h3>Streetwear saludable: cómo mezclar comodidad y estilo</h3>
          <p>Descubre cómo combinar piezas sueltas, layers y colores para mantener un look urbano pero sobrio.</p>
        </article>
        <article className="page-card-item">
          <h3>Los tonos que dominan esta temporada</h3>
          <p>Blacks, neutrales y acentos verdes siguen marcando tendencia en la moda casual premium.</p>
        </article>
      </div>
    </PageTemplate>
  )
}
