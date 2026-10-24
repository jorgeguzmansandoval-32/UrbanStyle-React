const ADMIN_USERS_KEY = 'urbanstyleAdminUsers'
const CLIENT_USERS_KEY = 'urbanstyleClientUsers'
const SESSION_KEY = 'urbanstyleUsuario'

const administradorInicial = {
  id: 'admin-inicial',
  nombre: 'Administrador principal',
  email: 'admin@urbanstyle.cl',
  password: 'Admin123',
  rol: 'admin',
  inicial: true
}

const clienteInicial = {
  email: 'cliente@gmail.com',
  password: 'Cliente123',
  rol: 'cliente'
}

function leerAdministradores() {
  try {
    const almacenados = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || 'null')

    if (Array.isArray(almacenados)) {
      return almacenados
    }
  } catch (error) {
    console.error('No se pudieron leer los administradores:', error)
  }

  return [administradorInicial]
}

function guardarAdministradores(administradores) {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(administradores))
}

function leerClientes() {
  try {
    const almacenados = JSON.parse(localStorage.getItem(CLIENT_USERS_KEY) || '[]')
    return Array.isArray(almacenados) ? almacenados : []
  } catch (error) {
    console.error('No se pudieron leer las cuentas de clientes:', error)
    return []
  }
}

function notificarCambioSesion() {
  window.dispatchEvent(new Event('urbanstyleSesionActualizada'))
}

export function obtenerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    return sesion && typeof sesion === 'object' ? sesion : null
  } catch (error) {
    console.error('No se pudo leer la sesión:', error)
    return null
  }
}

export function iniciarSesion(email, password) {
  const correoNormalizado = email.trim().toLowerCase()
  const administradores = leerAdministradores()
  const usuarios = [...administradores, clienteInicial, ...leerClientes()]
  const usuario = usuarios.find((item) =>
    item.email.toLowerCase() === correoNormalizado && item.password === password
  )

  if (!usuario) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  const sesion = {
    email: usuario.email,
    nombre: usuario.nombre || usuario.email,
    rol: usuario.rol
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion))
  notificarCambioSesion()

  return sesion
}

export function registrarCliente({ nombre, email, password, telefono, region, comuna }) {
  const nombreNormalizado = nombre.trim()
  const correoNormalizado = email.trim().toLowerCase()
  const clientes = leerClientes()
  const usuarios = [...leerAdministradores(), clienteInicial, ...clientes]

  if (!nombreNormalizado || !telefono.trim() || !region || !comuna) {
    throw new Error('Completa todos los campos del formulario.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
    throw new Error('Ingresa un correo electrónico válido.')
  }

  if (usuarios.some((usuario) => usuario.email.toLowerCase() === correoNormalizado)) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.')
  }

  if (!/^[a-zA-Z0-9!@#$%^&,.]{6,50}$/.test(password)) {
    throw new Error('La contraseña debe tener entre 6 y 50 caracteres válidos.')
  }

  const cliente = {
    id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
    nombre: nombreNormalizado,
    email: correoNormalizado,
    password,
    telefono: telefono.trim(),
    region,
    comuna,
    rol: 'cliente'
  }

  localStorage.setItem(CLIENT_USERS_KEY, JSON.stringify([...clientes, cliente]))

  const sesion = {
    nombre: cliente.nombre,
    email: cliente.email,
    rol: 'cliente'
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion))
  notificarCambioSesion()

  return sesion
}

export function cerrarSesion() {
  localStorage.removeItem(SESSION_KEY)
  notificarCambioSesion()
}

export function obtenerAdministradores() {
  return leerAdministradores()
    .filter((usuario) => usuario.rol === 'admin')
    .map(({ password: _password, ...usuario }) => usuario)
}

export function crearAdministrador({ nombre, email, password }) {
  const nombreNormalizado = nombre.trim()
  const correoNormalizado = email.trim().toLowerCase()
  const administradores = leerAdministradores()

  if (!nombreNormalizado) {
    throw new Error('El nombre es obligatorio.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
    throw new Error('Ingresa un correo electrónico válido.')
  }

  if (administradores.some((usuario) => usuario.email.toLowerCase() === correoNormalizado)) {
    throw new Error('Ya existe un administrador con ese correo.')
  }

  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.')
  }

  const nuevoAdministrador = {
    id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
    nombre: nombreNormalizado,
    email: correoNormalizado,
    password,
    rol: 'admin',
    inicial: false,
    creadoEn: new Date().toISOString()
  }

  guardarAdministradores([...administradores, nuevoAdministrador])

  return {
    id: nuevoAdministrador.id,
    nombre: nuevoAdministrador.nombre,
    email: nuevoAdministrador.email,
    rol: nuevoAdministrador.rol,
    inicial: nuevoAdministrador.inicial,
    creadoEn: nuevoAdministrador.creadoEn
  }
}

export function eliminarAdministrador(id) {
  const administradores = leerAdministradores()
  const administrador = administradores.find((usuario) => usuario.id === id)

  if (!administrador) {
    throw new Error('No se encontró el administrador.')
  }

  if (administrador.inicial) {
    throw new Error('No se puede eliminar el administrador inicial.')
  }

  const actualizados = administradores.filter((usuario) => usuario.id !== id)
  guardarAdministradores(actualizados)

  return obtenerAdministradores()
}