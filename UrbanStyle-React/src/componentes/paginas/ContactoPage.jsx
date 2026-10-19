import PlantillaPagina from './PlantillaPagina'

export default function ContactoPage() {
  return (
    <PlantillaPagina
      title="Contacto"
      description="Hablemos sobre estilos, colaboraciones o soporte del cliente."
    >
      <div className="page-card-panel">
        <p className="page-contact-row"><strong>Email:</strong> hola@urbanstyle.cl</p>
        <p className="page-contact-row"><strong>Instagram:</strong> @urbanstyle</p>
        <p className="page-contact-row"><strong>Horario:</strong> Lunes a Sábado, 9:00 – 18:00</p>
      </div>
    </PlantillaPagina>
  )
}
