import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { Link } from 'react-router-dom';

function Carrito() {
  const { carrito, vaciarCarrito, eliminarProducto, incrementarCantidad, disminuirCantidad } = useCarrito();
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Tu Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-600">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {carrito.map(item => (
              <li key={item.id} className="flex flex-col md:flex-row items-center border-b border-gray-300 pb-4 gap-4">
                <img 
                  src={`/productos/${item.imagen}`} 
                  alt={item.nombre} 
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => e.target.src = '/placeholder-image.jpg'}
                />
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-lg font-medium">{item.nombre}</h4>
                  <p className="text-gray-600">Precio unitario: ${item.precio.toFixed(2)}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <button 
                      onClick={() => disminuirCantidad(item.id)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                    >-</button>
                    <span>{item.cantidad}</span>
                    <button 
                      onClick={() => incrementarCantidad(item.id)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                    >+</button>
                  </div>
                  <p className="text-gray-700 mt-2">Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => eliminarProducto(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-6">Total: ${total.toFixed(2)}</h3>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={vaciarCarrito}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition w-full sm:w-auto"
            >
              Vaciar carrito
            </button>
            <Link
              to="/checkout"
              className="bg-[#117287] text-white px-4 py-2 rounded hover:bg-[#0e5c6a] transition text-center w-full sm:w-auto"
            >
              Finalizar compra
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrito;
