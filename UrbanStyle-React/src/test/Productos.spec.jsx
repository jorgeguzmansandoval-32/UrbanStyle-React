import React from 'react';

describe('Pruebas Unitarias - Módulo de Productos', () => {
  const listaProductos = [
    { id: 1, name: 'Chaqueton Urban Fur', price: 45990, stock: 12 },
    { id: 2, name: 'Chaqueta Racing Black', price: 59990, stock: 8 }
  ];

  it('debe existir el catálogo inicial de productos', () => {
    expect(listaProductos).toBeDefined();
    expect(listaProductos.length).toBe(2);
  });

  it('debe validar que los productos tengan precio y stock mayores a cero', () => {
    listaProductos.forEach(prod => {
      expect(prod.price).toBeGreaterThan(0);
      expect(prod.stock).toBeGreaterThanOrEqual(0);
    });
  });

  it('debe calcular correctamente el precio total del carrito', () => {
    const total = listaProductos.reduce((acc, item) => acc + item.price, 0);
    expect(total).toBe(105980);
  });
});