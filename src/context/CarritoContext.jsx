import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarProducto = (producto, cantidad) => {
    if (cantidad === 0) return;
    console.log(producto, cantidad);

    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      if (existe) {
        return prev.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      } else {
        return [...prev, { ...producto, cantidad }];
      }
    });
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);
  const incrementarCantidad = (id) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };
  
  const disminuirCantidad = (id) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, cantidad: p.cantidad > 1 ? p.cantidad - 1 : 1 } // nunca menor a 1
          : p
      )
    );
  };
  

  return (
    <CarritoContext.Provider value={{ 
        carrito, 
        agregarProducto, 
        vaciarCarrito, 
        eliminarProducto, 
        incrementarCantidad, 
        disminuirCantidad 
      }}>
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);

