import { Link } from 'react-router-dom'
import PageTemplate from './PageTemplate'

export default function NotFoundPage() {
  return (
    <PageTemplate
      title="Página no encontrada"
      description="La ruta que buscas no existe en UrbanStyle."
    >
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </PageTemplate>
  )
}
