import { useEffect, useMemo, useState } from 'react'
import {
  agregarAlCarrito,
  cambiarCantidad,
  calcularTotales,
  eliminarDelCarrito,
  formatearPrecio,
  guardarCarrito,
  obtenerCarrito
} from './data/carrito'
import {
  obtenerDescuento,
  obtenerPrecioConDescuento
} from './data/productos'
import {
  validarAcceso,
  validarDatosEnvio,
  validarRegistroCliente
} from './data/validaciones'
import {
  actualizarProductoApi,
  cerrarSesionCliente,
  cerrarSesionAdmin,
  crearPedido,
  crearProductoApi,
  eliminarProductoApi,
  iniciarSesionCliente,
  iniciarSesionAdmin,
  obtenerDashboardAdmin,
  obtenerPedidosAdmin,
  obtenerProductosApi,
  obtenerSesionCliente,
  obtenerSesionAdmin,
  registrarCliente
} from './data/api'
import AdminDashboard from './admin/adminsDashboard'
import logoUrban from './Imagen/LogoUrban.png'
import bannerTienda from './Imagen/UrbanStyle-tienda.jpg'
import tiendaNosotros from './Imagen/local-streetwear-nosotros.jpg'
import './App.css'

const CATEGORIAS = ['Todas', 'Chaquetas', 'Cortavientos', 'Polerones', 'Pantalones', 'Poleras', 'Accesorios']
const FORMULARIO_INICIAL = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 'Chaquetas',
  discountPercent: '0'
}

const ENVIO_INICIAL = {
  name: '',
  email: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  region: '',
  notes: ''
}

function categoriaProducto(producto) {
  if (producto.category) return producto.category

  const nombre = `${producto.name || producto.nombre || ''}`.toLowerCase()
  if (nombre.includes('jeans') || nombre.includes('cargo') || nombre.includes('pantalón')) return 'Pantalones'
  if (nombre.includes('cortaviento')) return 'Cortavientos'
  if (nombre.includes('polerón') || nombre.includes('poleron')) return 'Polerones'
  if (nombre.includes('polera')) return 'Poleras'
  return 'Chaquetas'
}

function textoParaBusqueda(value) {
  return `${value || ''}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-CL')
}

const ETIQUETAS_CAMPOS = {
  name: 'Nombre',
  email: 'Correo electrónico',
  password: 'Contraseña',
  phone: 'Teléfono',
  address: 'Dirección',
  address2: 'Referencia',
  city: 'Comuna',
  region: 'Región',
  notes: 'Instrucciones de entrega'
}

function ResumenErrores({ errores }) {
  const campos = Object.entries(errores)
  if (!campos.length) return null

  return (
    <div className="validation-summary" role="alert">
      <strong>Revisa estos datos antes de continuar:</strong>
      <ul>
        {campos.map(([campo, mensaje]) => (
          <li key={campo}>{ETIQUETAS_CAMPOS[campo] || campo}: {mensaje}</li>
        ))}
      </ul>
    </div>
  )
}

function ErrorCampo({ campo, errores }) {
  if (!errores[campo]) return null
  return <span className="field-error" id={`error-${campo}`}>{errores[campo]}</span>
}

function TarjetaProducto({ producto, onAgregar, onDetalle }) {
  const descuento = obtenerDescuento(producto)
  const precio = obtenerPrecioConDescuento(producto)
  const nombre = producto.name || producto.nombre
  const imagen = producto.image || producto.imagen

  return (
    <article className="producto-card store-product-card">
      <div className="producto-img-container store-product-image">
        {imagen
          ? <img src={imagen} alt={nombre} className="producto-img" />
          : <div className="product-image-placeholder" aria-label="Imagen no disponible">URBAN<br />STYLE</div>}
        <span className="product-category-label">{categoriaProducto(producto)}</span>
        {descuento > 0 && <span className="product-discount-badge">-{descuento}%</span>}
      </div>
      <div className="product-info">
        <span className="product-stock">{Number(producto.stock) > 0 ? `${producto.stock} disponibles` : 'Agotado'}</span>
        <h3>{nombre}</h3>
        <p className="product-description">{producto.description || 'Una nueva pieza para tu colección.'}</p>
        <div className="product-price-row">
          {descuento > 0 && <del>{formatearPrecio(producto.price ?? producto.precio)}</del>}
          <p className="precio-tag">{formatearPrecio(precio)}</p>
        </div>
        <div className="product-card-actions">
          <button type="button" className="product-detail-button" onClick={() => onDetalle(producto)}>Ver detalle</button>
          <button
            type="button"
            className="btn-comprar"
            disabled={Number(producto.stock) <= 0}
            onClick={() => onAgregar(producto.id)}
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState(obtenerCarrito)
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [busquedaCatalogo, setBusquedaCatalogo] = useState('')
  const [panelActivo, setPanelActivo] = useState('')
  const [productoDetalle, setProductoDetalle] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [productoAviso, setProductoAviso] = useState(null)
  const [bolsaAnimada, setBolsaAnimada] = useState(false)
  const [error, setError] = useState('')
  const [cargandoProductos, setCargandoProductos] = useState(true)
  const [cargandoAdmin, setCargandoAdmin] = useState(false)
  const [enviandoAcceso, setEnviandoAcceso] = useState(false)
  const [enviandoRegistro, setEnviandoRegistro] = useState(false)
  const [enviandoPedido, setEnviandoPedido] = useState(false)
  const [erroresValidacion, setErroresValidacion] = useState({})
  const [formularioLogin, setFormularioLogin] = useState({ email: '', password: '' })
  const [modoAcceso, setModoAcceso] = useState('customer')
  const [formularioRegistro, setFormularioRegistro] = useState({
    ...ENVIO_INICIAL,
    password: ''
  })
  const [datosEnvio, setDatosEnvio] = useState(ENVIO_INICIAL)
  const [pedidoCreado, setPedidoCreado] = useState(null)
  const [resumenAdmin, setResumenAdmin] = useState({
    products: 0,
    stockUnits: 0,
    lowStock: 0,
    inventoryValue: 0,
    pendingOrders: 0,
    customers: 0
  })
  const [pedidosAdmin, setPedidosAdmin] = useState([])
  const [pestanaAdmin, setPestanaAdmin] = useState('dashboard')
  const [formularioProducto, setFormularioProducto] = useState(FORMULARIO_INICIAL)
  const [imagenProducto, setImagenProducto] = useState(null)
  const [stockEditado, setStockEditado] = useState({})
  const isAdmin = usuario?.role === 'admin'

  useEffect(() => {
    let cancelled = false
    Promise.all([obtenerProductosApi(), obtenerSesionAdmin(), obtenerSesionCliente()])
      .then(([productosCargados, adminActual, clienteActual]) => {
        if (cancelled) return
        setProductos(productosCargados)
        const usuarioActual = adminActual || clienteActual
        setUsuario(usuarioActual)
        if (clienteActual) setDatosEnvio({ ...ENVIO_INICIAL, ...clienteActual })
      })
      .catch((loadError) => {
        if (!cancelled) setError(`No se pudo conectar con la tienda: ${loadError.message}`)
      })
      .finally(() => {
        if (!cancelled) setCargandoProductos(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!mensaje) return undefined

    const timeout = window.setTimeout(() => {
      setMensaje('')
      setProductoAviso(null)
    }, 5000)
    return () => window.clearTimeout(timeout)
  }, [mensaje])

  useEffect(() => {
    if (!bolsaAnimada) return undefined

    const timeout = window.setTimeout(() => setBolsaAnimada(false), 700)
    return () => window.clearTimeout(timeout)
  }, [bolsaAnimada])

  useEffect(() => {
    if (panelActivo !== 'admin' || !isAdmin) return
    let cancelled = false
    Promise.all([obtenerDashboardAdmin(), obtenerPedidosAdmin()])
      .then(([resumen, pedidos]) => {
        if (cancelled) return
        setResumenAdmin(resumen)
        setPedidosAdmin(pedidos)
      })
      .catch((dashboardError) => {
        if (!cancelled) setError(`No se pudo cargar la administración: ${dashboardError.message}`)
      })
      .finally(() => {
        if (!cancelled) setCargandoAdmin(false)
      })
    return () => {
      cancelled = true
    }
  }, [panelActivo, isAdmin, productos])

  const productosFiltrados = useMemo(() => {
    const busqueda = textoParaBusqueda(busquedaCatalogo.trim())
    return productos.filter((producto) => {
      const coincideCategoria = categoriaActiva === 'Todas' ||
        categoriaProducto(producto) === categoriaActiva
      const coincideBusqueda = !busqueda || textoParaBusqueda(
        `${producto.name || producto.nombre} ${producto.description || ''} ${categoriaProducto(producto)}`
      ).includes(busqueda)
      return coincideCategoria && coincideBusqueda
    })
  }, [busquedaCatalogo, categoriaActiva, productos])
  const ofertas = useMemo(
    () => productos.filter((producto) => obtenerDescuento(producto) > 0),
    [productos]
  )
  const cantidadEnCarrito = carrito.reduce((total, item) => total + Number(item.quantity), 0)
  const totales = calcularTotales(carrito)

  function actualizarCarrito() {
    setCarrito(obtenerCarrito())
  }

  function actualizarCampo(setter, campo, valor) {
    setter((actual) => ({ ...actual, [campo]: valor }))
    setErroresValidacion((actuales) => {
      if (!actuales[campo]) return actuales
      const siguientes = { ...actuales }
      delete siguientes[campo]
      return siguientes
    })
  }

  function manejarAgregar(id) {
    setError('')
    try {
      agregarAlCarrito(id, productos)
      actualizarCarrito()
      setProductoAviso(productos.find((producto) => String(producto.id) === String(id)) || null)
      setBolsaAnimada(true)
      setMensaje('Prenda agregada a tu bolsa.')
    } catch (e) {
      setError(e.message)
    }
  }

  function manejarCantidad(id, cantidad) {
    setError('')
    try {
      cambiarCantidad(id, cantidad, productos)
      actualizarCarrito()
    } catch (e) {
      setError(e.message)
    }
  }

  async function manejarLogin(event) {
    event.preventDefault()
    setError('')
    setMensaje('')
    setProductoAviso(null)

    const email = formularioLogin.email.trim().toLowerCase()
    const { password } = formularioLogin
    const errores = validarAcceso({ email, password })
    setErroresValidacion(errores)
    if (Object.keys(errores).length) {
      return
    }

    setEnviandoAcceso(true)
    try {
      const result = modoAcceso === 'admin'
        ? await iniciarSesionAdmin(email, password)
        : await iniciarSesionCliente(email, password)
      setUsuario(result.user)
      setFormularioLogin({ email: '', password: '' })
      setPanelActivo('')
      if (result.user.role === 'customer') {
        setDatosEnvio({ ...ENVIO_INICIAL, ...result.user })
      }
      setMensaje(result.user.role === 'admin'
        ? 'Sesión de administrador iniciada.'
        : 'Sesión de cliente iniciada.')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setEnviandoAcceso(false)
    }
  }

  async function manejarRegistroCliente(event) {
    event.preventDefault()
    setError('')
    setMensaje('')
    const errores = validarRegistroCliente(formularioRegistro)
    setErroresValidacion(errores)
    if (Object.keys(errores).length) return

    setEnviandoRegistro(true)
    try {
      const { password, ...customerDetails } = formularioRegistro
      const result = await registrarCliente({ ...customerDetails, password })
      setUsuario(result.user)
      setDatosEnvio({ ...ENVIO_INICIAL, ...result.user })
      setFormularioRegistro({ ...ENVIO_INICIAL, password: '' })
      setPanelActivo('')
      setMensaje('Cuenta creada. Tus datos de envío quedaron guardados.')
    } catch (registrationError) {
      setError(registrationError.message)
    } finally {
      setEnviandoRegistro(false)
    }
  }

  function manejarCambioImagen(event) {
    const archivo = event.target.files?.[0]
    setError('')
    if (!archivo) {
      setImagenProducto(null)
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(archivo.type)) {
      setError('Selecciona una imagen JPG, PNG, WEBP o AVIF.')
      event.target.value = ''
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB.')
      event.target.value = ''
      return
    }
    setImagenProducto(archivo)
  }

  async function manejarCrearProducto(event) {
    event.preventDefault()
    setMensaje('')
    setError('')
    try {
      await crearProductoApi({
        ...formularioProducto,
        price: Number(formularioProducto.price),
        stock: Number(formularioProducto.stock),
        discountPercent: Number(formularioProducto.discountPercent)
      }, imagenProducto)
      const productosActualizados = await obtenerProductosApi()
      setCargandoAdmin(true)
      setProductos(productosActualizados)
      setFormularioProducto(FORMULARIO_INICIAL)
      setImagenProducto(null)
      event.target.reset()
      setProductoAviso(null)
      setMensaje('La prenda se agregó correctamente al catálogo.')
    } catch (e) {
      setError(e.message)
    }
  }

  async function manejarActualizarStock(producto) {
    setMensaje('')
    setError('')
    try {
      await actualizarProductoApi(producto.id, {
        ...producto,
        stock: Number(stockEditado[producto.id] ?? producto.stock)
      })
      const productosActualizados = await obtenerProductosApi()
      setCargandoAdmin(true)
      setProductos(productosActualizados)
      setMensaje('Stock actualizado correctamente.')
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  async function manejarEliminarProducto(id) {
    if (!window.confirm('¿Quieres eliminar esta prenda del catálogo?')) return
    setError('')
    setMensaje('')
    setProductoAviso(null)
    try {
      await eliminarProductoApi(id)
      const productosActualizados = await obtenerProductosApi()
      setCargandoAdmin(true)
      setProductos(productosActualizados)
      setMensaje('La prenda se eliminó del catálogo.')
    } catch (e) {
      setError(e.message)
    }
  }

  function manejarCheckout() {
    setError('')
    setPedidoCreado(null)
    setErroresValidacion({})
    setPanelActivo('checkout')
  }

  async function manejarConfirmarPedido(event) {
    event.preventDefault()
    setError('')
    const detallesEnvio = {
      ...datosEnvio,
      email: usuario?.role === 'customer' ? usuario.email : datosEnvio.email
    }
    const errores = validarDatosEnvio(detallesEnvio)
    setErroresValidacion(errores)
    if (Object.keys(errores).length) return

    setEnviandoPedido(true)
    try {
      const { order } = await crearPedido({
        shippingDetails: detallesEnvio,
        items: carrito.map((item) => ({ id: item.id, quantity: item.quantity }))
      })
      setPedidoCreado(order)
      guardarCarrito([])
      actualizarCarrito()
      setPanelActivo('checkout-success')
    } catch (orderError) {
      setError(orderError.message)
    } finally {
      setEnviandoPedido(false)
    }
  }

  function abrirBolsaDesdeAviso() {
    setMensaje('')
    setProductoAviso(null)
    setPanelActivo('cart')
  }

  async function cerrarSesion() {
    try {
      if (usuario?.role === 'admin') await cerrarSesionAdmin()
      if (usuario?.role === 'customer') await cerrarSesionCliente()
    } catch (logoutError) {
      setError(`No se pudo cerrar la sesión del servidor: ${logoutError.message}`)
    }
    setUsuario(null)
    setDatosEnvio(ENVIO_INICIAL)
    setPanelActivo('')
    setProductoAviso(null)
    setMensaje('Cerraste tu sesión.')
  }

  function abrirAdministracion() {
    if (!isAdmin) return
    setPestanaAdmin('dashboard')
    setCargandoAdmin(true)
    setPanelActivo('admin')
  }

  return (
    <div className="App">
      <header className="store-nav">
        <a className="store-brand" href="#inicio" aria-label="UrbanStyle, inicio">
          <img src={logoUrban} alt="" className="store-logo" />
          <span>URBAN<span className="brand-highlight">STYLE</span></span>
        </a>
        <nav className="store-links" aria-label="Navegación principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#ofertas">Ofertas</a>
          <a href="#coleccion">Colección</a>
          <a href="#nosotros">Nosotros</a>
          {isAdmin && (
            <button type="button" onClick={abrirAdministracion}>Administrar</button>
          )}
        </nav>
        <div className="store-actions">
          {isAdmin && (
            <button className="store-icon-button store-admin-mobile" type="button" onClick={abrirAdministracion}>Admin</button>
          )}
          {usuario ? (
            <>
              <span className="store-user">{usuario.email}</span>
              <button className="store-icon-button" type="button" onClick={cerrarSesion}>Salir</button>
            </>
          ) : (
            <button className="store-icon-button" type="button" onClick={() => setPanelActivo('login')}>
              Iniciar sesión
            </button>
          )}
          <button className={`store-cart-button ${bolsaAnimada ? 'is-highlighted' : ''}`} type="button" onClick={() => setPanelActivo('cart')}>
            Bolsa <span className="cart-badge">{cantidadEnCarrito}</span>
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`floating-cart-button ${bolsaAnimada ? 'is-highlighted' : ''}`}
        onClick={() => setPanelActivo('cart')}
        aria-label={`Abrir bolsa de compras, ${cantidadEnCarrito} ${cantidadEnCarrito === 1 ? 'prenda' : 'prendas'}`}
      >
        <span className="floating-cart-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L21 8H6" />
            <circle cx="10" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
          </svg>
        </span>
        <span className="floating-cart-copy">
          <strong>Tu bolsa</strong>
          <span>{cantidadEnCarrito > 0 ? formatearPrecio(totales.subtotal) : 'Ver selección'}</span>
        </span>
        <span className="floating-cart-count" aria-hidden="true">{cantidadEnCarrito}</span>
      </button>

      {mensaje && (
        <div className={`store-notice ${productoAviso ? 'store-notice-product' : ''}`} role="status" aria-live="polite">
          <span className="notice-icon" aria-hidden="true">{productoAviso ? '✓' : '✦'}</span>
          <div className="notice-content">
            <strong>{productoAviso ? '¡Prenda agregada!' : mensaje}</strong>
            {productoAviso && (
              <>
                <span className="notice-product-name">{productoAviso.name || productoAviso.nombre}</span>
                <span className="notice-product-price">
                  {formatearPrecio(obtenerPrecioConDescuento(productoAviso))}
                </span>
                <button type="button" className="notice-cart-link" onClick={abrirBolsaDesdeAviso}>
                  Ver mi bolsa <span aria-hidden="true">→</span>
                </button>
              </>
            )}
          </div>
          <button className="notice-close" type="button" aria-label="Cerrar aviso" onClick={() => {
            setMensaje('')
            setProductoAviso(null)
          }}>×</button>
        </div>
      )}

      <section className="hero-banner store-hero" id="inicio">
        <img src={bannerTienda} alt="Interior de la tienda UrbanStyle" className="hero-img" />
        <div className="hero-text store-hero-content">
          <p className="eyebrow">NUEVA TEMPORADA · DROP 2026</p>
          <h1>Streetwear<br />Culture</h1>
          <p>Estilo urbano. Actitud propia.</p>
          <a href="#catalogo" className="hero-cta">Explorar colección <span aria-hidden="true">↘</span></a>
        </div>
        <span className="hero-index">01 / URBAN STYLE</span>
      </section>

      <section className="offers-section" id="ofertas">
        <div className="offers-heading">
          <div>
            <span className="eyebrow">ÚLTIMAS UNIDADES · PRECIOS ESPECIALES</span>
            <h2>Ofertas<br /><span>de temporada.</span></h2>
          </div>
          <a href="#catalogo">Ver todo el catálogo <span aria-hidden="true">↗</span></a>
        </div>
        {ofertas.length > 0 ? (
          <div className="productos-grid store-product-grid offers-grid">
            {ofertas.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                onAgregar={manejarAgregar}
                onDetalle={(seleccionado) => {
                  setProductoDetalle(seleccionado)
                  setPanelActivo('detail')
                }}
              />
            ))}
          </div>
        ) : (
          <p className="empty-category">Pronto anunciaremos nuevas ofertas.</p>
        )}
      </section>

      <section className="collection-strip" id="coleccion" aria-label="Explora por categoría">
        <div>
          <span className="eyebrow">ENCUENTRA TU FIT</span>
          <h2>Elige tu<br />categoría.</h2>
        </div>
        <div className="category-tiles">
          {CATEGORIAS.filter((categoria) => categoria !== 'Todas').map((categoria, index) => (
            <button
              type="button"
              className={`category-tile ${categoriaActiva === categoria ? 'is-active' : ''}`}
              key={categoria}
              onClick={() => {
                setCategoriaActiva(categoria)
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span>0{index + 1}</span>
              <strong>{categoria}</strong>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="about-section" id="nosotros">
        <div className="about-intro">
          <span className="eyebrow">QUIÉNES SOMOS</span>
          <h2>Una marca.<br /><span>Una actitud.</span></h2>
          <p>
            UrbanStyle es un proyecto de moda urbana creado para quienes expresan
            su identidad a través de lo que visten. Reunimos prendas de estilo
            streetwear y una experiencia de compra simple, directa y cercana.
          </p>
          <a href="#catalogo">Descubre la colección <span aria-hidden="true">↗</span></a>
        </div>
        <div className="about-creators">
          <img className="about-store-image" src={tiendaNosotros} alt="Exhibición de ropa y accesorios streetwear en una tienda" />
          <div className="about-creators-heading">
            <span className="eyebrow">DETRÁS DE URBANSTYLE</span>
            <p>Creado con visión, dedicación y pasión por el estilo urbano.</p>
          </div>
          <div className="creator-list">
            <div className="creator-card">
              <span>01 / CO-CREADOR</span>
              <strong>Jorge Guzmán</strong>
            </div>
            <div className="creator-card">
              <span>02 / CO-CREADOR</span>
              <strong>Francisco Órdenes</strong>
            </div>
            <div className="creator-card">
              <span>03 / CO-CREADOR</span>
              <strong>Matías Aguilera</strong>
            </div>
          </div>
        </div>
      </section>

      <main className="catalogo-container store-catalog" id="catalogo">
        <div className="catalog-heading">
          <div>
            <span className="eyebrow">HECHO PARA MOVERTE</span>
            <h2 className="catalogo-title">Catálogo Oficial</h2>
          </div>
          <p>{productosFiltrados.length} prendas seleccionadas</p>
        </div>
        <div className="category-filters" aria-label="Filtrar por categoría">
          {CATEGORIAS.map((categoria) => (
            <button
              type="button"
              className={categoriaActiva === categoria ? 'filter-chip is-active' : 'filter-chip'}
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              aria-pressed={categoriaActiva === categoria}
            >
              {categoria}
            </button>
          ))}
        </div>
        <label className="catalog-search">
          <span>Buscar en el catálogo</span>
          <input
            type="search"
            value={busquedaCatalogo}
            onChange={(event) => setBusquedaCatalogo(event.target.value)}
            placeholder="Ej.: chaqueta, polera, jeans…"
            aria-label="Buscar productos por nombre, descripción o categoría"
          />
        </label>

        {error && !panelActivo && <p className="store-error" role="alert">{error}</p>}
        {cargandoProductos ? (
          <p className="loading-message" role="status"><span className="loading-spinner" aria-hidden="true" /> Cargando catálogo…</p>
        ) : productosFiltrados.length ? (
          <div className="productos-grid store-product-grid">
            {productosFiltrados.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                onAgregar={manejarAgregar}
                onDetalle={(seleccionado) => {
                  setProductoDetalle(seleccionado)
                  setPanelActivo('detail')
                }}
              />
            ))}
          </div>
        ) : (
          <p className="empty-category">No hay prendas en esta categoría por ahora.</p>
        )}
      </main>

      <footer className="store-footer">
        <a className="store-brand" href="#inicio">URBAN<span className="brand-highlight">STYLE</span></a>
        <span>Vístete a tu manera. Muévete a tu ritmo.</span>
        <div className="store-footer-links">
          <a href="#nosotros">Nosotros</a>
          <a href="#catalogo">Volver al catálogo ↑</a>
        </div>
      </footer>

      {panelActivo === 'login' && (
        <div className="store-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPanelActivo('')
        }}>
          <section className="store-dialog login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button className="dialog-close" type="button" onClick={() => setPanelActivo('')} aria-label="Cerrar">×</button>
            <span className="eyebrow">{modoAcceso === 'admin' ? 'ACCESO RESTRINGIDO' : 'TU ESPACIO URBANSTYLE'}</span>
            <h2 id="login-title">
              {modoAcceso === 'register'
                ? <>Crea tu<br />cuenta.</>
                : modoAcceso === 'admin'
                  ? <>Acceso<br />administrador.</>
                  : <>Bienvenido<br />de vuelta.</>}
            </h2>
            <div className="auth-tabs" role="tablist" aria-label="Tipo de acceso">
              <button type="button" className={modoAcceso === 'customer' ? 'is-active' : ''} onClick={() => {
                setModoAcceso('customer')
                setError('')
                setErroresValidacion({})
              }}>Cliente</button>
              <button type="button" className={modoAcceso === 'register' ? 'is-active' : ''} onClick={() => {
                setModoAcceso('register')
                setError('')
                setErroresValidacion({})
              }}>Crear cuenta</button>
              <button type="button" className={modoAcceso === 'admin' ? 'is-active' : ''} onClick={() => {
                setModoAcceso('admin')
                setError('')
                setErroresValidacion({})
              }}>Admin</button>
            </div>
            {modoAcceso === 'register' ? (
              <form className="store-form customer-register-form" onSubmit={manejarRegistroCliente} noValidate>
                <ResumenErrores errores={erroresValidacion} />
                <label htmlFor="register-name">Nombre completo</label>
                <input id="register-name" autoComplete="name" maxLength={100} value={formularioRegistro.name} onChange={(event) => actualizarCampo(setFormularioRegistro, 'name', event.target.value)} aria-invalid={Boolean(erroresValidacion.name)} aria-describedby={erroresValidacion.name ? 'error-name' : undefined} required />
                <ErrorCampo campo="name" errores={erroresValidacion} />
                <label htmlFor="register-email">Correo electrónico</label>
                <input id="register-email" type="email" autoComplete="email" maxLength={254} value={formularioRegistro.email} onChange={(event) => actualizarCampo(setFormularioRegistro, 'email', event.target.value)} aria-invalid={Boolean(erroresValidacion.email)} aria-describedby={erroresValidacion.email ? 'error-email' : undefined} required />
                <ErrorCampo campo="email" errores={erroresValidacion} />
                <label htmlFor="register-password">Contraseña (mínimo 8 caracteres)</label>
                <input id="register-password" type="password" autoComplete="new-password" minLength={8} maxLength={200} value={formularioRegistro.password} onChange={(event) => actualizarCampo(setFormularioRegistro, 'password', event.target.value)} aria-invalid={Boolean(erroresValidacion.password)} aria-describedby={erroresValidacion.password ? 'error-password' : undefined} required />
                <ErrorCampo campo="password" errores={erroresValidacion} />
                <label htmlFor="register-phone">Teléfono</label>
                <input id="register-phone" type="tel" autoComplete="tel" maxLength={30} value={formularioRegistro.phone} onChange={(event) => actualizarCampo(setFormularioRegistro, 'phone', event.target.value)} aria-invalid={Boolean(erroresValidacion.phone)} aria-describedby={erroresValidacion.phone ? 'error-phone' : undefined} required />
                <ErrorCampo campo="phone" errores={erroresValidacion} />
                <label htmlFor="register-address">Dirección de envío</label>
                <input id="register-address" autoComplete="street-address" maxLength={180} value={formularioRegistro.address} onChange={(event) => actualizarCampo(setFormularioRegistro, 'address', event.target.value)} aria-invalid={Boolean(erroresValidacion.address)} aria-describedby={erroresValidacion.address ? 'error-address' : undefined} required />
                <ErrorCampo campo="address" errores={erroresValidacion} />
                <label htmlFor="register-address2">Departamento, casa o referencia (opcional)</label>
                <input id="register-address2" maxLength={180} value={formularioRegistro.address2} onChange={(event) => actualizarCampo(setFormularioRegistro, 'address2', event.target.value)} aria-invalid={Boolean(erroresValidacion.address2)} aria-describedby={erroresValidacion.address2 ? 'error-address2' : undefined} />
                <ErrorCampo campo="address2" errores={erroresValidacion} />
                <div className="shipping-form-grid">
                  <div>
                    <label htmlFor="register-city">Comuna</label>
                    <input id="register-city" autoComplete="address-level2" maxLength={100} value={formularioRegistro.city} onChange={(event) => actualizarCampo(setFormularioRegistro, 'city', event.target.value)} aria-invalid={Boolean(erroresValidacion.city)} aria-describedby={erroresValidacion.city ? 'error-city' : undefined} required />
                    <ErrorCampo campo="city" errores={erroresValidacion} />
                  </div>
                  <div>
                    <label htmlFor="register-region">Región</label>
                    <input id="register-region" autoComplete="address-level1" maxLength={100} value={formularioRegistro.region} onChange={(event) => actualizarCampo(setFormularioRegistro, 'region', event.target.value)} aria-invalid={Boolean(erroresValidacion.region)} aria-describedby={erroresValidacion.region ? 'error-region' : undefined} required />
                    <ErrorCampo campo="region" errores={erroresValidacion} />
                  </div>
                </div>
                {error && <p className="store-error" role="alert">{error}</p>}
                <button className="form-submit" type="submit" disabled={enviandoRegistro}>
                  {enviandoRegistro ? 'Creando cuenta…' : 'Crear cuenta'} <span>{enviandoRegistro ? <span className="loading-spinner" aria-hidden="true" /> : '→'}</span>
                </button>
              </form>
            ) : (
              <form className="store-form" onSubmit={manejarLogin} noValidate>
                <ResumenErrores errores={erroresValidacion} />
                <label htmlFor="login-email">Correo electrónico</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={modoAcceso === 'admin' ? 'admin@urbanstyle.cl' : 'tu@correo.com'}
                  value={formularioLogin.email}
                  onChange={(event) => actualizarCampo(setFormularioLogin, 'email', event.target.value)}
                  aria-invalid={Boolean(erroresValidacion.email)}
                  aria-describedby={erroresValidacion.email ? 'error-email' : undefined}
                  required
                />
                <ErrorCampo campo="email" errores={erroresValidacion} />
                <label htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Mínimo 8 caracteres"
                  value={formularioLogin.password}
                  onChange={(event) => actualizarCampo(setFormularioLogin, 'password', event.target.value)}
                  aria-invalid={Boolean(erroresValidacion.password)}
                  aria-describedby={erroresValidacion.password ? 'error-password' : undefined}
                  minLength={8}
                  required
                />
                <ErrorCampo campo="password" errores={erroresValidacion} />
                {error && <p className="store-error" role="alert">{error}</p>}
                <button className="form-submit" type="submit" disabled={enviandoAcceso}>
                  {enviandoAcceso ? 'Validando…' : modoAcceso === 'admin' ? 'Entrar al panel' : 'Iniciar sesión'}
                  <span>{enviandoAcceso ? <span className="loading-spinner" aria-hidden="true" /> : '→'}</span>
                </button>
              </form>
            )}
            {modoAcceso === 'admin' && (
              <div className="demo-disclaimer">
                <strong>Cuenta administradora</strong>
                <p>La primera vez, el servidor crea la cuenta y muestra una clave temporal en la terminal.</p>
                <p>La clave queda guardada localmente en .env, excluido de Git.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {panelActivo === 'cart' && (
        <div className="store-overlay cart-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPanelActivo('')
        }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="drawer-heading">
              <div><span className="eyebrow">TU SELECCIÓN</span><h2 id="cart-title">Tu bolsa <span>({cantidadEnCarrito})</span></h2></div>
              <button className="dialog-close" type="button" onClick={() => setPanelActivo('')} aria-label="Cerrar bolsa">×</button>
            </div>
            {error && <p className="store-error" role="alert">{error}</p>}
            {carrito.length === 0 ? (
              <div className="drawer-empty">
                <span aria-hidden="true">◌</span>
                <h3>Tu bolsa está vacía</h3>
                <p>Encuentra tu próxima prenda favorita en el catálogo.</p>
                <button type="button" className="form-submit" onClick={() => {
                  setPanelActivo('')
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
                }}>Explorar prendas <span>→</span></button>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  {carrito.map((item) => (
                    <article className="drawer-item" key={item.id}>
                      {item.image
                        ? <img src={item.image} alt={item.name} />
                        : <div className="drawer-image-placeholder">US</div>}
                      <div className="drawer-item-info">
                        <h3>{item.name}</h3>
                        <span>
                          {item.discountPercent > 0 && <del>{formatearPrecio(item.originalPrice)}</del>}
                          {item.discountPercent > 0 && ' '}
                          {formatearPrecio(item.price)}
                          {item.discountPercent > 0 && <small className="cart-discount">-{item.discountPercent}%</small>}
                        </span>
                        <div className="quantity-control">
                          <button type="button" aria-label={`Quitar una unidad de ${item.name}`} onClick={() => manejarCantidad(item.id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button type="button" aria-label={`Agregar una unidad de ${item.name}`} onClick={() => manejarCantidad(item.id, item.quantity + 1)}>+</button>
                          <button className="remove-item" type="button" onClick={() => {
                            eliminarDelCarrito(item.id)
                            actualizarCarrito()
                          }}>Eliminar</button>
                        </div>
                      </div>
                      <strong>{formatearPrecio(item.price * item.quantity)}</strong>
                    </article>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>{formatearPrecio(totales.subtotal)}</strong></div>
                  <div><span>Envío</span><strong>{formatearPrecio(totales.envio)}</strong></div>
                  <div className="cart-total"><span>Total</span><strong>{formatearPrecio(totales.total)}</strong></div>
                  <button type="button" className="form-submit" onClick={manejarCheckout}>Revisar compra <span>→</span></button>
                  <p>Revisa el detalle antes de continuar. El pago no está habilitado.</p>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {panelActivo === 'detail' && productoDetalle && (
        <div className="store-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPanelActivo('')
        }}>
          <section className="store-dialog product-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="dialog-close" type="button" onClick={() => setPanelActivo('')} aria-label="Cerrar detalle">×</button>
            <div className="detail-image">
              {productoDetalle.image || productoDetalle.imagen
                ? <img src={productoDetalle.image || productoDetalle.imagen} alt={productoDetalle.name || productoDetalle.nombre} />
                : <div className="product-image-placeholder">URBAN<br />STYLE</div>}
              {obtenerDescuento(productoDetalle) > 0 && <span className="product-discount-badge">-{obtenerDescuento(productoDetalle)}%</span>}
            </div>
            <div className="detail-content">
              <span className="eyebrow">{categoriaProducto(productoDetalle)} · URBANSTYLE</span>
              <h2 id="detail-title">{productoDetalle.name || productoDetalle.nombre}</h2>
              <p>{productoDetalle.description || 'Una nueva pieza para tu colección.'}</p>
              <span className="detail-stock">{Number(productoDetalle.stock) > 0 ? `${productoDetalle.stock} unidades disponibles` : 'Agotado'}</span>
              <div className="product-price-row detail-price">
                {obtenerDescuento(productoDetalle) > 0 && <del>{formatearPrecio(productoDetalle.price ?? productoDetalle.precio)}</del>}
                <strong>{formatearPrecio(obtenerPrecioConDescuento(productoDetalle))}</strong>
              </div>
              <button
                type="button"
                className="form-submit"
                disabled={Number(productoDetalle.stock) <= 0}
                onClick={() => manejarAgregar(productoDetalle.id)}
              >
                Añadir a la bolsa <span>→</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {panelActivo === 'checkout' && (
        <div className="store-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPanelActivo('')
        }}>
          <section className="store-dialog checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <div className="drawer-heading">
              <div><span className="eyebrow">ENVÍO Y RESUMEN</span><h2 id="checkout-title">¿A dónde lo enviamos?</h2></div>
              <button className="dialog-close" type="button" onClick={() => setPanelActivo('cart')} aria-label="Volver a la bolsa">×</button>
            </div>
            {error && <p className="store-error" role="alert">{error}</p>}
            <div className="checkout-items">
              {carrito.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} × {formatearPrecio(item.price)}
                      {item.discountPercent > 0 && ` · oferta -${item.discountPercent}%`}
                    </span>
                  </div>
                  <strong>{formatearPrecio(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <form className="store-form shipping-form" onSubmit={manejarConfirmarPedido} noValidate>
              <h3>Datos de envío</h3>
              <ResumenErrores errores={erroresValidacion} />
              {usuario?.role === 'customer' && (
                <p className="saved-address-hint">Sesión iniciada: usamos los datos de tu cuenta; puedes actualizar la dirección para este pedido.</p>
              )}
              <label htmlFor="shipping-name">Nombre completo</label>
              <input id="shipping-name" autoComplete="name" maxLength={100} value={datosEnvio.name} onChange={(event) => actualizarCampo(setDatosEnvio, 'name', event.target.value)} aria-invalid={Boolean(erroresValidacion.name)} aria-describedby={erroresValidacion.name ? 'error-name' : undefined} required />
              <ErrorCampo campo="name" errores={erroresValidacion} />
              <label htmlFor="shipping-email">Correo electrónico</label>
              <input
                id="shipping-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={usuario?.role === 'customer' ? usuario.email : datosEnvio.email}
                onChange={(event) => actualizarCampo(setDatosEnvio, 'email', event.target.value)}
                aria-invalid={Boolean(erroresValidacion.email)}
                aria-describedby={erroresValidacion.email ? 'error-email' : undefined}
                readOnly={usuario?.role === 'customer'}
                required
              />
              <ErrorCampo campo="email" errores={erroresValidacion} />
              <label htmlFor="shipping-phone">Teléfono de contacto</label>
              <input id="shipping-phone" type="tel" autoComplete="tel" maxLength={30} value={datosEnvio.phone} onChange={(event) => actualizarCampo(setDatosEnvio, 'phone', event.target.value)} aria-invalid={Boolean(erroresValidacion.phone)} aria-describedby={erroresValidacion.phone ? 'error-phone' : undefined} required />
              <ErrorCampo campo="phone" errores={erroresValidacion} />
              <label htmlFor="shipping-address">Dirección</label>
              <input id="shipping-address" autoComplete="street-address" maxLength={180} value={datosEnvio.address} onChange={(event) => actualizarCampo(setDatosEnvio, 'address', event.target.value)} aria-invalid={Boolean(erroresValidacion.address)} aria-describedby={erroresValidacion.address ? 'error-address' : undefined} required />
              <ErrorCampo campo="address" errores={erroresValidacion} />
              <label htmlFor="shipping-address2">Departamento, casa o referencia (opcional)</label>
              <input id="shipping-address2" maxLength={180} value={datosEnvio.address2} onChange={(event) => actualizarCampo(setDatosEnvio, 'address2', event.target.value)} aria-invalid={Boolean(erroresValidacion.address2)} aria-describedby={erroresValidacion.address2 ? 'error-address2' : undefined} />
              <ErrorCampo campo="address2" errores={erroresValidacion} />
              <div className="shipping-form-grid">
                <div>
                  <label htmlFor="shipping-city">Comuna</label>
                  <input id="shipping-city" autoComplete="address-level2" maxLength={100} value={datosEnvio.city} onChange={(event) => actualizarCampo(setDatosEnvio, 'city', event.target.value)} aria-invalid={Boolean(erroresValidacion.city)} aria-describedby={erroresValidacion.city ? 'error-city' : undefined} required />
                  <ErrorCampo campo="city" errores={erroresValidacion} />
                </div>
                <div>
                  <label htmlFor="shipping-region">Región</label>
                  <input id="shipping-region" autoComplete="address-level1" maxLength={100} value={datosEnvio.region} onChange={(event) => actualizarCampo(setDatosEnvio, 'region', event.target.value)} aria-invalid={Boolean(erroresValidacion.region)} aria-describedby={erroresValidacion.region ? 'error-region' : undefined} required />
                  <ErrorCampo campo="region" errores={erroresValidacion} />
                </div>
              </div>
              <label htmlFor="shipping-notes">Instrucciones para la entrega (opcional)</label>
              <textarea id="shipping-notes" rows="2" maxLength={300} value={datosEnvio.notes} onChange={(event) => actualizarCampo(setDatosEnvio, 'notes', event.target.value)} aria-invalid={Boolean(erroresValidacion.notes)} aria-describedby={erroresValidacion.notes ? 'error-notes' : undefined} />
              <ErrorCampo campo="notes" errores={erroresValidacion} />
              <div className="cart-summary checkout-totals">
                <div><span>Subtotal</span><strong>{formatearPrecio(totales.subtotal)}</strong></div>
                <div><span>Envío</span><strong>{formatearPrecio(totales.envio)}</strong></div>
                <div className="cart-total"><span>Total</span><strong>{formatearPrecio(totales.total)}</strong></div>
              </div>
              <p className="checkout-disclaimer">Esto guarda un pedido pendiente de pago para la demostración. No se cobra ni se envía hasta integrar una pasarela de pago.</p>
              <button type="submit" className="form-submit" disabled={!carrito.length || enviandoPedido}>
                {enviandoPedido ? 'Guardando pedido…' : 'Guardar pedido de prueba'}
                <span>{enviandoPedido ? <span className="loading-spinner" aria-hidden="true" /> : '→'}</span>
              </button>
            </form>
          </section>
        </div>
      )}

      {panelActivo === 'checkout-success' && pedidoCreado && (
        <div className="store-overlay">
          <section className="store-dialog checkout-success-dialog" role="dialog" aria-modal="true" aria-labelledby="order-success-title">
            <span className="notice-icon" aria-hidden="true">✓</span>
            <span className="eyebrow">PEDIDO GUARDADO</span>
            <h2 id="order-success-title">Gracias, {datosEnvio.name}.</h2>
            <p>Tu pedido <strong>#{pedidoCreado.id}</strong> quedó registrado como pendiente de pago.</p>
            <div className="order-address">
              <strong>Dirección de entrega</strong>
              <span>{datosEnvio.address}{datosEnvio.address2 ? `, ${datosEnvio.address2}` : ''}</span>
              <span>{datosEnvio.city}, {datosEnvio.region}</span>
              <span>{datosEnvio.email} · {datosEnvio.phone}</span>
            </div>
            <div className="cart-summary checkout-totals">
              <div><span>Subtotal</span><strong>{formatearPrecio(pedidoCreado.subtotal)}</strong></div>
              <div><span>Envío</span><strong>{formatearPrecio(pedidoCreado.shipping)}</strong></div>
              <div className="cart-total"><span>Total</span><strong>{formatearPrecio(pedidoCreado.total)}</strong></div>
            </div>
            <p className="checkout-disclaimer">No se realizó ningún cobro y el pedido aún no se enviará. El estado es solo de demostración.</p>
            <button type="button" className="form-submit" onClick={() => {
              setPedidoCreado(null)
              setPanelActivo('')
            }}>Volver a la tienda <span>→</span></button>
          </section>
        </div>
      )}

      {panelActivo === 'admin' && isAdmin && (
        <div className="store-overlay admin-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPanelActivo('')
        }}>
          <section className="store-dialog admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-title">
            <div className="drawer-heading">
              <div><span className="eyebrow">GESTIÓN DE TIENDA · SQLITE</span><h2 id="admin-title">Administrar catálogo</h2></div>
              <button className="dialog-close" type="button" onClick={() => setPanelActivo('')} aria-label="Cerrar panel de administración">×</button>
            </div>
            {mensaje && <p className="store-success" role="status">{mensaje}</p>}
            {error && <p className="store-error" role="alert">{error}</p>}
            <div className="admin-tabs" role="tablist" aria-label="Secciones de administración">
              <button type="button" className={pestanaAdmin === 'dashboard' ? 'is-active' : ''} onClick={() => setPestanaAdmin('dashboard')}>Dashboard</button>
              <button type="button" className={pestanaAdmin === 'catalog' ? 'is-active' : ''} onClick={() => setPestanaAdmin('catalog')}>Catálogo</button>
              <button type="button" className={pestanaAdmin === 'orders' ? 'is-active' : ''} onClick={() => setPestanaAdmin('orders')}>Pedidos ({pedidosAdmin.length})</button>
            </div>
            {pestanaAdmin === 'dashboard' && (
              cargandoAdmin
                ? <p className="loading-message" role="status"><span className="loading-spinner" aria-hidden="true" /> Cargando resumen y pedidos…</p>
                : <AdminDashboard
                    resumen={resumenAdmin}
                    onManageProducts={() => setPestanaAdmin('catalog')}
                    onManageOrders={() => setPestanaAdmin('orders')}
                  />
            )}
            {pestanaAdmin === 'catalog' && (
              <>
                <form className="store-form admin-product-form" onSubmit={manejarCrearProducto}>
              <h3>Agregar una prenda</h3>
              <div className="admin-form-grid">
                <div><label htmlFor="product-name">Nombre</label><input id="product-name" value={formularioProducto.name} onChange={(event) => setFormularioProducto({ ...formularioProducto, name: event.target.value })} required maxLength={80} /></div>
                <div><label htmlFor="product-category">Categoría</label><select id="product-category" value={formularioProducto.category} onChange={(event) => setFormularioProducto({ ...formularioProducto, category: event.target.value })}>{CATEGORIAS.filter((item) => item !== 'Todas').map((item) => <option key={item}>{item}</option>)}</select></div>
                <div><label htmlFor="product-price">Precio (CLP)</label><input id="product-price" type="number" min="1" step="1" value={formularioProducto.price} onChange={(event) => setFormularioProducto({ ...formularioProducto, price: event.target.value })} required /></div>
                <div><label htmlFor="product-stock">Stock</label><input id="product-stock" type="number" min="0" step="1" value={formularioProducto.stock} onChange={(event) => setFormularioProducto({ ...formularioProducto, stock: event.target.value })} required /></div>
                <div><label htmlFor="product-discount">Descuento (%)</label><input id="product-discount" type="number" min="0" max="70" step="1" value={formularioProducto.discountPercent} onChange={(event) => setFormularioProducto({ ...formularioProducto, discountPercent: event.target.value })} required /></div>
              </div>
              <label htmlFor="product-description">Descripción</label>
              <textarea id="product-description" rows="3" maxLength={240} value={formularioProducto.description} onChange={(event) => setFormularioProducto({ ...formularioProducto, description: event.target.value })} required />
              <label htmlFor="product-image">Imagen del producto (opcional)</label>
              <input id="product-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={manejarCambioImagen} />
              {imagenProducto && <span className="selected-image-name">{imagenProducto.name}</span>}
              <button className="form-submit" type="submit">Agregar al catálogo <span>+</span></button>
            </form>
            <div className="admin-inventory">
              <h3>Inventario <span>{productos.length} prendas</span></h3>
              {productos.map((producto) => (
                <div className="admin-inventory-row" key={producto.id}>
                  <span>{producto.name || producto.nombre}</span>
                  <span>{formatearPrecio(producto.price ?? producto.precio)} · {producto.stock} uds.</span>
                  <label className="inventory-stock-edit">
                    <span className="visually-hidden">Stock para {producto.name}</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={stockEditado[producto.id] ?? producto.stock}
                      onChange={(event) => setStockEditado({ ...stockEditado, [producto.id]: event.target.value })}
                    />
                    <button type="button" onClick={() => manejarActualizarStock(producto)}>Guardar stock</button>
                  </label>
                  <button type="button" onClick={() => manejarEliminarProducto(producto.id)} aria-label={`Eliminar ${producto.name || producto.nombre}`}>Eliminar</button>
                </div>
              ))}
            </div>
                <p className="demo-disclaimer">Productos, cambios de inventario e imágenes quedan guardados en la base SQLite y la carpeta server/uploads.</p>
              </>
            )}
            {pestanaAdmin === 'orders' && (
              <section className="admin-orders" aria-label="Pedidos de clientes">
                <h3>Pedidos registrados <span>{pedidosAdmin.length}</span></h3>
                {cargandoAdmin ? (
                  <p className="loading-message" role="status"><span className="loading-spinner" aria-hidden="true" /> Actualizando pedidos…</p>
                ) : pedidosAdmin.length === 0 ? (
                  <p className="empty-category">Todavía no hay pedidos registrados.</p>
                ) : pedidosAdmin.map((pedido) => (
                  <article className="admin-order-card" key={pedido.id}>
                    <div className="admin-order-heading">
                      <strong>Pedido #{pedido.id} · {pedido.customerName}</strong>
                      <span className="order-status">{pedido.status === 'pending_payment' ? 'Pendiente de pago' : pedido.status}</span>
                    </div>
                    <p>{pedido.customerEmail} · {pedido.customerPhone}</p>
                    <p>{pedido.shippingAddress}{pedido.shippingAddress2 ? `, ${pedido.shippingAddress2}` : ''}, {pedido.shippingCity}, {pedido.shippingRegion}</p>
                    {pedido.shippingNotes && <p>Nota: {pedido.shippingNotes}</p>}
                    <ul>
                      {pedido.items.map((item) => (
                        <li key={`${pedido.id}-${item.id}`}>{item.quantity} × {item.name} — {formatearPrecio(item.lineTotal)}</li>
                      ))}
                    </ul>
                    <div className="admin-order-total">Total con envío: {formatearPrecio(pedido.total)}</div>
                  </article>
                ))}
              </section>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App
