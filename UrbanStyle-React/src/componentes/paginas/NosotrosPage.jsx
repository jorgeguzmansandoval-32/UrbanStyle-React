const estudiantes = [
  {
    numero: '01',
    nombre: 'Jorge',
    descripcion: 'Encargado del desarrollo y la estructura del proyecto, se enfocó en crear una experiencia funcional y clara para la venta de prendas.'
  },
  {
    numero: '02',
    nombre: 'Francisco',
    descripcion: 'Responsable de la parte visual y la identidad de la marca, aportó la sensación urbana y contemporánea que define a UrbanStyle.'
  },
  {
    numero: '03',
    nombre: 'Matias',
    descripcion: 'Se enfocó en la lógica del negocio digital, gestionando la experiencia del cliente, catalogación y flujo de compra dentro del sitio.'
  }
]

export default function NosotrosPage() {
  return (
    <main className="nosotros-page">
      <section className="site-page-hero">
        <div className="site-page-hero-inner">
          <span className="section-number">02 / URBANSTYLE</span>
          <h1>
            Más que ropa.
            <br />
            <span>Una identidad.</span>
          </h1>
          <p>
            Conoce la visión detrás de una marca creada para moverse distinto.
          </p>
        </div>
      </section>

      <section className="about-story section-shell">
        <div className="about-story-header">
          <span className="section-number">03 / HISTORIA</span>
          <h2>
            Creado por
            <br />
            <span>tres estudiantes.</span>
          </h2>
        </div>

        <div className="story-intro">
          <p>
            En Duoc UC, tres estudiantes de la carrera de Analista Programador
            desarrollaron UrbanStyle como una propuesta real de e-commerce para
            ropa urbana. En conjunto, combinaron diseño, lógica y creatividad
            para crear una tienda que refleja identidad, actitud y estilo de
            calle.
          </p>
        </div>

        <div className="student-grid">
          {estudiantes.map((estudiante) => (
            <article className="student-card" key={estudiante.numero}>
              <div className="student-number">{estudiante.numero}</div>
              <h3>{estudiante.nombre}</h3>
              <p>{estudiante.descripcion}</p>
            </article>
          ))}
        </div>

        <blockquote className="story-quote">
          <p>
            “UrbanStyle no es solo una tienda de ropa: es una propuesta de
            estilo y creatividad nacida desde la formación de analistas
            programadores, con la visión de llevar la calle al mundo digital.”
          </p>
        </blockquote>
      </section>
    </main>
  )
}