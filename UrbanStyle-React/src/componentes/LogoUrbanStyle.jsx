import logoUrbanStyle from '../Imagen/favicon-urbanstyle.svg'
import { Link } from 'react-router-dom'

export default function LogoUrbanStyle({ className = '', linkClassName = '' }) {
  return (
    <Link
      to="/"
      className={`urbanstyle-logo-link ${linkClassName}`.trim()}
      aria-label="Ir al inicio de UrbanStyle"
    >
      <img
        className={`urbanstyle-logo ${className}`.trim()}
        src={logoUrbanStyle}
        alt="Logo UrbanStyle"
      />
    </Link>
  )
}