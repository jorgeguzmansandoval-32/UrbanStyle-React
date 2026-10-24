import React from 'react';
import { Link } from 'react-router-dom';

const OfertasPage = ({ productos = [] }) => {
  // Filtra productos que tengan oferta activa o descuento
  const ofertas = productos.filter(p => p.enOferta || p.descuento > 0);

  return (
    <div className="container my-4">
      <div className="p-4 mb-4 bg-danger text-white rounded-3 shadow">
        <h2>🔥 Ofertas Exclusivas</h2>
        <p className="mb-0">Aprovecha los mejores descuentos en vestuario urbano por tiempo limitado.</p>
      </div>

      <div className="row g-4">
        {ofertas.length > 0 ? (
          ofertas.map(prod => (
            <div key={prod.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 border-danger shadow-sm">
                <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                  {prod.descuento ? `-${prod.descuento}%` : 'OFERTA'}
                </span>
                <img src={prod.imagen || 'https://via.placeholder.com/400x300'} className="card-img-top" alt={prod.nombre} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{prod.nombre}</h5>
                  <div className="mb-2">
                    <span className="text-decoration-line-through text-muted me-2">
                      ${prod.precioOriginal?.toLocaleString('clp') || (prod.precio * 1.2).toLocaleString('clp')}
                    </span>
                    <strong className="text-danger fs-5">${prod.precio?.toLocaleString('clp')}</strong>
                  </div>
                  <Link to={`/producto/${prod.id}`} className="btn btn-danger mt-auto">Aprovechar Oferta</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="alert alert-warning">Por el momento no hay ofertas disponibles. ¡Vuelve pronto!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfertasPage;