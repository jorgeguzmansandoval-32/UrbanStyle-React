import heroImg from '../assets/hero.png'
import './Home.css'

function Home() {
  return (
    <main>
      <section className="hero">
        <img src={heroImg} alt="Hero Banner" className="hero-image" />
        <div className="hero-content">
          <h1>UrbanStyle</h1>
          <p>Descubre la moda urbana que define tu estilo</p>
          <button className="cta-button">Explorar Colección</button>
        </div>
      </section>

      <section id="categorias" className="categories">
        <h2>Categorías</h2>
        <div className="categories-grid">
          <div className="category-card">
            <h3>Hombres</h3>
            <p>Explora nuestra colección para hombres</p>
          </div>
          <div className="category-card">
            <h3>Mujeres</h3>
            <p>Explora nuestra colección para mujeres</p>
          </div>
          <div className="category-card">
            <h3>Accesorios</h3>
            <p>Complementa tu look con nuestros accesorios</p>
          </div>
        </div>
      </section>

      <section id="productos" className="featured-products">
        <h2>Productos Destacados</h2>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-image"></div>
            <h3>Producto 1</h3>
            <p className="price">$99.99</p>
            <button className="add-to-cart">Añadir al carrito</button>
          </div>
          <div className="product-card">
            <div className="product-image"></div>
            <h3>Producto 2</h3>
            <p className="price">$129.99</p>
            <button className="add-to-cart">Añadir al carrito</button>
          </div>
          <div className="product-card">
            <div className="product-image"></div>
            <h3>Producto 3</h3>
            <p className="price">$149.99</p>
            <button className="add-to-cart">Añadir al carrito</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
