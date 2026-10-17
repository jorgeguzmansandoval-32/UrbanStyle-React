import PageTemplate from './PageTemplate'

export default function CartPage() {
  return (
    <PageTemplate
      title="Bolsa"
      description="Tu carrito de compras está listo para finalizar la compra."
    >
      <div style={{ background: '#fff', border: '1px solid #ecece7', borderRadius: '18px', padding: '24px' }}>
        <p style={{ margin: 0 }}>Todavía no agregaste productos. Explora nuestra colección y arma tu look.</p>
      </div>
    </PageTemplate>
  )
}
