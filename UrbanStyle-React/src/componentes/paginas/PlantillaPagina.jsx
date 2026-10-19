export default function PlantillaPagina({ title, description, children }) {
  return (
    <main className="page-template-main">
      <div className="page-template-inner">
        <p className="page-template-kicker">UrbanStyle</p>
        <h1 className="page-template-title">{title}</h1>
        <p className="page-template-description">{description}</p>
        {children}
      </div>
    </main>
  )
}
