
import { obtenerProductos } from '../../data/productos'
import Producto from '../Producto'

export default function OfertasPage() {
  const productos = obtenerProductos()

  const ofertas = productos.filter(
    (producto) =>
      Number(producto.stock) > 0 &&
      (
        producto.enOferta === true ||
        Number(producto.descuento) > 0
      )
  )

  return (
    <main className="container my-5">
      <div className="mb-4">
        <span className="section-number">
          URBANSTYLE / SPECIAL DROPS
        </span>

        <h1 className="fw-bold mt-2">
          Ofertas exclusivas
        </h1>

        <p className="text-secondary">
          Descubre nuestras prendas seleccionadas
          a precios especiales.
        </p>
      </div>

      {ofertas.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 premium-product-grid">
          {ofertas.map((producto, index) => (
            <Producto
              key={producto.id}
              producto={producto}
              numero={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-secondary">
          Actualmente no tenemos ofertas disponibles.
          Pronto tendremos nuevas promociones.
        </div>
      )}
    </main>
  )
}
