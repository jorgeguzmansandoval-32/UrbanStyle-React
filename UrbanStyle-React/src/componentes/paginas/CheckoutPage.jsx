import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ carrito = [], total = 0, limpiarCarrito }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación del procesamiento del pago (80% éxito, 20% error para pruebas)
    const exito = Math.random() > 0.2;
    if (limpiarCarrito) limpiarCarrito();

    if (exito) {
      navigate('/pago-exitoso', { state: { cliente: formData, carrito, total } });
    } else {
      navigate('/pago-error', { state: { cliente: formData, carrito, total } });
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">Información del cliente y despacho</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre *</label>
              <input type="text" name="nombre" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Apellidos *</label>
              <input type="text" name="apellidos" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Correo Electrónico *</label>
              <input type="email" name="correo" className="form-control" required onChange={handleChange} />
            </div>

            <h4 className="mt-4 mb-2">Dirección de entrega de los productos</h4>
            <div className="col-md-8">
              <label className="form-label">Calle y Número *</label>
              <input type="text" name="calle" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Departamento (opcional)</label>
              <input type="text" name="departamento" className="form-control" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Región *</label>
              <select name="region" className="form-select" onChange={handleChange} value={formData.region}>
                <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Bío Bío">Bío Bío</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Comuna *</label>
              <select name="comuna" className="form-select" onChange={handleChange} value={formData.comuna}>
                <option value="Cerrillos">Cerrillos</option>
                <option value="Santiago">Santiago</option>
                <option value="Maipú">Maipú</option>
                <option value="Providencia">Providencia</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Indicaciones para la entrega (opcional)</label>
              <textarea name="indicaciones" className="form-control" rows="2" onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="mb-0">Total a pagar: <strong>${total?.toLocaleString('clp')}</strong></h4>
            <button type="submit" className="btn btn-success btn-lg">Pagar Ahora</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;