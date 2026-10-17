import PageTemplate from './PageTemplate'

export default function AccountPage() {
  return (
    <PageTemplate
      title="Cuenta"
      description="Gestiona tu perfil, pedidos y preferencias personales."
    >
      <div className="page-card-panel">
        <p className="page-account-text">Bienvenido de nuevo. Aquí puedes ver tus pedidos y ajustes del perfil.</p>
      </div>
    </PageTemplate>
  )
}
