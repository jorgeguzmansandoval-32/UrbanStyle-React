import PageTemplate from './PageTemplate'

export default function AboutPage() {
  return (
    <PageTemplate
      title="Nosotros"
      description="UrbanStyle nació para ofrecer streetwear con identidad, calidad y actitud."
    >
      <div className="page-card-panel">
        <p>
          Somos una marca pensada para personas que buscan vestir con personalidad. Nuestro enfoque combina diseño contemporáneo,
          materiales funcionales y un estilo que conecta con la calle, la música y la cultura urbana.
        </p>
      </div>
    </PageTemplate>
  )
}
