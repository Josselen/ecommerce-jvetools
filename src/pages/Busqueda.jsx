import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { dispararSweetBasico } from '../assets/SweetAlert';

function Busqueda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { agregarProducto } = useCarrito();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const params = new URLSearchParams(location.search);
  const q = params.get('q');

  useEffect(() => {
    const buscarProductos = async () => {
      if (!q || q.trim() === '') {
        setError('No se proporcionó término de búsqueda');
        setCargando(false);
        return;
      }
      try {
        setCargando(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/buscar?q=${encodeURIComponent(q.trim())}`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setProductos(data || []);
      } catch (err) {
        setError(`Error al buscar productos: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };
    buscarProductos();
  }, [q]);

  const agregarAlCarrito = (producto) => {
    agregarProducto(
      {
        id: producto.id,
        nombre: producto.name,
        precio: Number(producto.price),
        imagen: producto.imagen,
      },
      1
    );
    dispararSweetBasico(
      'Producto Agregado',
      'El producto fue agregado al carrito con éxito',
      'success',
      'Cerrar'
    );
  };

  if (cargando)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-600 text-lg">Cargando resultados...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 mt-10">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error en la búsqueda</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()} // o navigate('/') si prefieres
          className="bg-[#117287] text-white px-4 py-2 rounded hover:bg-[#0e5c6a] transition"
        >
          Intentar de nuevo
        </button>
      </div>
    );

  if (!productos || productos.length === 0)
    return (
      <div className="text-center max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-6 mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sin resultados</h2>
        <p className="text-gray-600 mb-1">No se encontraron productos para "{q}".</p>
        <p className="text-gray-600">Intenta con otros términos de búsqueda.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#117287]">
          Resultados para: "{q}"
        </h2>
        <p className="text-gray-700">Se encontraron {productos.length} producto(s)</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100 flex flex-col"
          >
            <div className="bg-gray-50 rounded-t-xl flex justify-center items-center h-48 overflow-hidden">
              <img
                src={producto.imagen ? `/productos/${producto.imagen}` : '/placeholder-image.jpg'}
                alt={producto.name}
                className="object-contain h-full max-w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                {producto.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 text-center line-clamp-2">
                {producto.description}
              </p>
              <p className="text-xl font-bold text-[#117287] text-center mb-4">
                ${parseFloat(producto.price).toFixed(2)}
              </p>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="bg-[#117287] text-white px-4 py-2 rounded hover:bg-[#0e5c6a] transition mt-auto"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Busqueda;
