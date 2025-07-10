import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCarrito } from '../context/CarritoContext';

function CarritoFlotante() {
  const { carrito } = useCarrito();
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="md:hidden fixed bottom-5 right-5 bg-purple-800 text-white p-3 rounded-full shadow-lg z-[1000]">
      <Link to="/carrito" className="relative flex items-center justify-center">
        <FaShoppingCart size={24} />
        {totalProductos > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-[1px] rounded-full">
            {totalProductos}
          </span>
        )}
      </Link>
    </div>
  );
}

export default CarritoFlotante;
