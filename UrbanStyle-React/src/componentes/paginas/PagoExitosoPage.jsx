import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PagoExitosoPage = () => {
  const { state } = useLocation();
  const numOrden = `#2024${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="container my-5 text-center">
      <div className="card shadow-sm p-4 mx-auto payment-result-card payment-result-card-success">
        <div className="text-success mb-3">
          <i className="bi bi-check-circle-fill display-1"></i>
          <h2 className="mt-2">¡Se ha realizado la compra!</h2>
          <h5>N° de orden {numOrden}</h5>
        </div>

        {state?.cliente && (
          <div className="text-start bg-light p-3 rounded mb-3">
            <h6><strong>Cliente:</strong> {state.cliente.nombre} {state.cliente.apellidos}</h6>
            <h6><strong>Correo:</strong> {state.cliente.correo}</h6>
            <h6><strong>Dirección de entrega:</strong> {state.cliente.calle}, {state.cliente.comuna}, {state.cliente.region}</h6>
            {state.cliente.indicaciones && <p className="small text-muted mb-0"><strong>Notas:</strong> {state.cliente.indicaciones}</p>}
          </div>
        )}

        <p className="lead">El comprobante de pago e información sobre el envío han sido enviados a tu correo electrónico.</p>
        
        <div className="mt-4">
          <Link to="/" className="btn btn-primary btn-lg">Volver a la Tienda</Link>
        </div>
      </div>
    </div>
  );
};

export default PagoExitosoPage;