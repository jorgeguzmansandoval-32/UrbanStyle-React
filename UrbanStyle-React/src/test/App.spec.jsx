import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Suite de Pruebas 2: Componente Interfaz App.jsx', () => {

  it('Prueba 6: Debe renderizar el contenedor principal de la aplicación (.App)', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeTruthy();
  });

  it('Prueba 7: Debe renderizar la marca "UrbanStyle" en el navbar', () => {
    render(<App />);
    const elementosMarca = screen.getAllByText(/UrbanStyle/i);
    expect(elementosMarca.length).toBeGreaterThan(0);
  });

  it('Prueba 8: Debe mostrar el título principal del banner', () => {
    render(<App />);
    const tituloBanner = screen.getByText(/Streetwear Culture/i);
    expect(tituloBanner).toBeTruthy();
  });

  it('Prueba 9: Debe renderizar botones de "Añadir al Carrito" en el catálogo', () => {
    render(<App />);
    const botones = screen.getAllByRole('button');
    expect(botones.length).toBeGreaterThan(0);
  });

  it('Prueba 10: Debe renderizar las imágenes de los productos en el DOM', () => {
    render(<App />);
    const imagenes = screen.getAllByRole('img');
    expect(imagenes.length).toBeGreaterThan(0);
  });

});
