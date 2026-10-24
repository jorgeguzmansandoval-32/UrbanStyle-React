import React from 'react'

function formatoPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(precio)
}

export default function AdminDashboard({ resumen, onManageProducts, onManageOrders }) {
  return (
    <section className="dashboard-overview" aria-labelledby="dashboard-title">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">RESUMEN DE LA TIENDA</span>
          <h3 id="dashboard-title">Dashboard</h3>
        </div>
        <span className="dashboard-live"><span /> Datos del catálogo</span>
      </div>

      <div className="dashboard-metrics">
        <article className="dashboard-metric">
          <span>Prendas activas</span>
          <strong>{resumen.products}</strong>
          <small>Productos disponibles en el catálogo</small>
        </article>
        <article className="dashboard-metric">
          <span>Unidades en stock</span>
          <strong>{resumen.stockUnits}</strong>
          <small>Unidades sumadas del inventario</small>
        </article>
        <article className={`dashboard-metric ${resumen.lowStock ? 'is-warning' : ''}`}>
          <span>Stock bajo</span>
          <strong>{resumen.lowStock}</strong>
          <small>Productos con menos de 5 unidades</small>
        </article>
        <article className="dashboard-metric">
          <span>Valor del inventario</span>
          <strong>{formatoPrecio(resumen.inventoryValue)}</strong>
          <small>Precio de lista × stock actual</small>
        </article>
        <article className="dashboard-metric">
          <span>Pedidos por pagar</span>
          <strong>{resumen.pendingOrders}</strong>
          <small>Pedidos de demostración sin pago</small>
        </article>
        <article className="dashboard-metric">
          <span>Cuentas de clientes</span>
          <strong>{resumen.customers}</strong>
          <small>Perfiles registrados en SQLite</small>
        </article>
      </div>

      <div className="dashboard-footer">
        <p>Los pagos no se procesan; estos pedidos aún requieren pago para iniciar el envío.</p>
        <div>
          <button type="button" onClick={onManageOrders}>Ver pedidos <span aria-hidden="true">→</span></button>
          <button type="button" onClick={onManageProducts}>Gestionar catálogo <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  )
}
