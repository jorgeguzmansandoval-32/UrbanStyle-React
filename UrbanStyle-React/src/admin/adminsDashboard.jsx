import React from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/productos';

export default function AdminDashboard() {
  const productos = obtenerProductos() || [];

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard General</h2>
        <span className="badge bg-primary fs-6">Panel de Administración</span>
      </div>

      {/* Tarjetas de métricas superiores (Figura 9 del encargo) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary p-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Compras</h5>
              <h2 className="display-6">1,234</h2>
              <p className="card-text small mb-0">Probabilidad de aumento: 20%</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success p-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <h2 className="display-6">{productos.length}</h2>
              <p className="card-text small mb-0">Inventario activo actualmente</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-warning p-3 shadow-sm text-dark">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <h2 className="display-6">890</h2>
              <p className="card-text small mb-0">Usuarios registrados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos a módulos del panel */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5>📦 Productos</h5>
              <p className="text-muted small">Administración de inventario, detalle y productos disponibles.</p>
              <Link to="/admin/productos" className="btn btn-outline-primary mt-auto">Ir a Productos</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5>🧾 Órdenes</h5>
              <p className="text-muted small">Gestión y seguimiento de todas las órdenes de compra.</p>
              <button className="btn btn-outline-secondary mt-auto" disabled>Ver Órdenes</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5>👥 Usuarios administradores</h5>
              <p className="text-muted small">Crea y administra los accesos al panel.</p>
              <Link to="/admin/usuarios" className="btn btn-outline-primary mt-auto">Gestionar usuarios</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}