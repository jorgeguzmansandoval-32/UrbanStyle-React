import {
  validarAcceso,
  validarDatosEnvio,
  validarRegistroCliente
} from '../data/validaciones'

const clienteValido = {
  name: 'Ana Pérez',
  email: 'ana@example.cl',
  password: 'Secreto123',
  phone: '+56 9 1234 5678',
  address: 'Av. Providencia 123',
  address2: '',
  city: 'Santiago',
  region: 'Metropolitana',
  notes: ''
}

describe('Validaciones de acceso, registro y envío', () => {
  it('acepta credenciales válidas', () => {
    expect(validarAcceso({ email: 'ana@example.cl', password: 'Secreto123' })).toEqual({})
  })

  it('rechaza un correo incompleto', () => {
    expect(validarAcceso({ email: 'ana@', password: 'Secreto123' }).email).toBeTruthy()
  })

  it('rechaza una contraseña demasiado corta', () => {
    expect(validarAcceso({ email: 'ana@example.cl', password: 'corta' }).password).toContain('8')
  })

  it('acepta un perfil completo con teléfono válido', () => {
    expect(validarRegistroCliente(clienteValido)).toEqual({})
  })

  it('indica los datos obligatorios que faltan al registrarse', () => {
    const errores = validarRegistroCliente({})
    expect(errores.name).toBeTruthy()
    expect(errores.email).toBeTruthy()
    expect(errores.phone).toBeTruthy()
    expect(errores.address).toBeTruthy()
    expect(errores.city).toBeTruthy()
    expect(errores.region).toBeTruthy()
  })

  it('rechaza teléfonos con letras o una cantidad inválida de dígitos', () => {
    expect(validarRegistroCliente({ ...clienteValido, phone: 'teléfono12345678' }).phone).toBeTruthy()
    expect(validarRegistroCliente({ ...clienteValido, phone: '12345' }).phone).toBeTruthy()
  })

  it('rechaza una dirección que supera el límite permitido', () => {
    const errores = validarRegistroCliente({ ...clienteValido, address: 'a'.repeat(181) })
    expect(errores.address).toContain('180')
  })

  it('acepta los datos de envío completos', () => {
    expect(validarDatosEnvio(clienteValido)).toEqual({})
  })

  it('valida también el correo si se modifican los datos al pagar', () => {
    expect(validarDatosEnvio({ ...clienteValido, email: 'correo-inválido' }).email).toBeTruthy()
  })

  it('rechaza instrucciones de entrega demasiado extensas', () => {
    const errores = validarDatosEnvio({ ...clienteValido, notes: 'n'.repeat(301) })
    expect(errores.notes).toContain('300')
  })
})
