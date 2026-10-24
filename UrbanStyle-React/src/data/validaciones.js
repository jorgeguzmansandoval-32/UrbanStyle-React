const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validarCampoRequerido(value, label, maxLength) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) return `${label} es obligatorio.`
  if (text.length > maxLength) return `${label} debe tener como máximo ${maxLength} caracteres.`
  return ''
}

function validarEmail(value) {
  const email = typeof value === 'string' ? value.trim() : ''
  if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return 'Ingresa un correo electrónico válido (máximo 254 caracteres).'
  }
  return ''
}

function validarTelefono(value) {
  const phone = typeof value === 'string' ? value.trim() : ''
  const digits = phone.replace(/\D/g, '')
  if (!phone) return 'El teléfono es obligatorio.'
  if (phone.length > 30 || /[^\d\s+().-]/.test(phone) || digits.length < 8 || digits.length > 15) {
    return 'Ingresa un teléfono válido con entre 8 y 15 dígitos.'
  }
  return ''
}

export function validarAcceso({ email, password }) {
  const errors = {}
  const emailError = validarEmail(email)
  if (emailError) errors.email = emailError

  if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
    errors.password = 'La contraseña debe tener entre 8 y 200 caracteres.'
  }
  return errors
}

export function validarRegistroCliente(customer) {
  const errors = {}
  const nameError = validarCampoRequerido(customer.name, 'El nombre', 100)
  if (nameError) errors.name = nameError

  const emailError = validarEmail(customer.email)
  if (emailError) errors.email = emailError

  if (typeof customer.password !== 'string' || customer.password.length < 8 || customer.password.length > 200) {
    errors.password = 'La contraseña debe tener entre 8 y 200 caracteres.'
  }

  const phoneError = validarTelefono(customer.phone)
  if (phoneError) errors.phone = phoneError

  for (const [field, label, maxLength] of [
    ['address', 'La dirección', 180],
    ['city', 'La comuna', 100],
    ['region', 'La región', 100]
  ]) {
    const fieldError = validarCampoRequerido(customer[field], label, maxLength)
    if (fieldError) errors[field] = fieldError
  }

  if (typeof customer.address2 === 'string' && customer.address2.trim().length > 180) {
    errors.address2 = 'La referencia debe tener como máximo 180 caracteres.'
  }
  return errors
}

export function validarDatosEnvio(details) {
  const errors = {}
  const nameError = validarCampoRequerido(details.name, 'El nombre', 100)
  if (nameError) errors.name = nameError

  const emailError = validarEmail(details.email)
  if (emailError) errors.email = emailError

  const phoneError = validarTelefono(details.phone)
  if (phoneError) errors.phone = phoneError

  for (const [field, label, maxLength] of [
    ['address', 'La dirección', 180],
    ['city', 'La comuna', 100],
    ['region', 'La región', 100]
  ]) {
    const fieldError = validarCampoRequerido(details[field], label, maxLength)
    if (fieldError) errors[field] = fieldError
  }

  if (typeof details.address2 === 'string' && details.address2.trim().length > 180) {
    errors.address2 = 'La referencia debe tener como máximo 180 caracteres.'
  }
  if (typeof details.notes === 'string' && details.notes.length > 300) {
    errors.notes = 'Las instrucciones deben tener como máximo 300 caracteres.'
  }
  return errors
}
