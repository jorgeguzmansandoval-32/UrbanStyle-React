import { Link } from 'react-router-dom'
import PlantillaPagina from './PlantillaPagina'

export default function PaginaNoEncontrada() {
  return (
    <PlantillaPagina
      title="Página no encontrada"
      description="La ruta que buscas no existe en UrbanStyle."
    >
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </PlantillaPagina>
  )
}
