import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoriasPage = ({ productos = [] }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const categorias = ['Todas', 'Poleras', 'Polerones', 'Pantalones', 'Accesorios'];

  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(p => p.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase());

  return (
    <div className="container my-4">
      <h2 className="mb-4">Categorías</h2>
      
      {/* Botones de categorías */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`btn ${categoriaSeleccionada === cat ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="row g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(prod => (
            <div key={prod.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img src={prod.imagen || 'https://via.placeholder.com/400x300'} className="card-img-top" alt={prod.nombre} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{prod.nombre}</h5>
                  <p className="card-text text-muted">${prod.precio?.toLocaleString('clp')}</p>
                  <Link to={`/producto/${prod.id}`} className="btn btn-outline-primary mt-auto">Ver detalle</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="alert alert-info">No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriasPage;