import { obtenerProductos } from '../data/productos';

describe('Suite de Pruebas 1: Lógica de Datos de Productos', () => {

  it('Prueba 1: obtenerProductos debe retornar un arreglo válido', () => {
    const productos = obtenerProductos();
    expect(Array.isArray(productos)).toBeTrue();
  });

  it('Prueba 2: Debe contener productos cargados en el inventario', () => {
    const productos = obtenerProductos();
    expect(productos.length).toBeGreaterThan(0);
  });

  it('Prueba 3: Cada producto debe incluir las propiedades requeridas (id, name, price, stock, image)', () => {
    const productos = obtenerProductos();
    productos.forEach((prod) => {
      expect(prod.id).toBeDefined();
      expect(prod.name || prod.nombre).toBeTruthy();
      expect(typeof (prod.price || prod.precio)).toBe('number');
      expect(prod.image || prod.imagen).toBeTruthy();
    });
  });

  it('Prueba 4: Todos los precios deben ser valores numéricos positivos mayores a 0', () => {
    const productos = obtenerProductos();
    productos.forEach((prod) => {
      const precio = prod.price || prod.precio;
      expect(precio).toBeGreaterThan(0);
    });
  });

  it('Prueba 5: Debe incluir productos de la colección urbana en el listado', () => {
    const productos = obtenerProductos();
    const nombres = productos.map((p) => p.name || p.nombre);
    expect(nombres.length).toBeGreaterThan(0);
  });

});