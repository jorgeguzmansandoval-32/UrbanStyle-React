import React from 'react';
import { Link } from 'react-router-dom';

const PagoErrorPage = () => {
  return (
    <div className="container my-5 text-center">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <div className="text-danger mb-3">
          <i className="bi bi-x-circle-fill display-1"></i>
          <h2 className="mt-2">No se pudo realizar el pago</h2>
          <p className="text-muted">Hubo un problema al procesar tu transacción con el banco o medio de pago.</p>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/checkout" className="btn btn-warning btn-lg">Volver a Realizar el Pago</Link>
          <Link to="/carrito" className="btn btn-outline-secondary btn-lg">Revisar Carrito</Link>
        </div>
      </div>
    </div>
  );
};

export default PagoErrorPage;