import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logojvetools.png';

function Header() {
  const { carrito } = useCarrito();
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const { usuario } = useAuth();

  const [busqueda, setBusqueda] = useState('');
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const navigate = useNavigate();

  const manejarBusqueda = async (e) => {
    if (e.key === 'Enter' && busqueda.trim()) {
      await ejecutarBusqueda();
    }
  };

  const ejecutarBusqueda = async () => {
    const terminoBusqueda = busqueda.trim();
    if (!terminoBusqueda) {
      alert('Por favor ingresa un término de búsqueda');
      return;
    }
    try {
      setCargandoBusqueda(true);
      navigate(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
      setBusqueda('');
    } catch (error) {
      console.error('Error al buscar:', error);
      alert('Error al realizar la búsqueda. Intenta de nuevo.');
    } finally {
      setCargandoBusqueda(false);
    }
  };

  return (
    <header className="bg-gray-900 text-white px-12 py-6 flex justify-between items-center flex-wrap box-border md:px-8 md:py-4 md:gap-4">
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <img 
          src={logo} 
          alt="JVE Tools" 
          className="max-w-xs h-auto w-full" 
        />
      </Link>

      {/* Mensaje de bienvenida */}
      {usuario && (
        <p className="text-white hidden lg:block">
          Bienvenido, {usuario.nombre}
        </p>
      )}

      {/* Search and Cart Container */}
      <div className="flex items-center gap-6 md:flex-row md:flex-nowrap md:justify-center md:w-full md:max-w-md">
        {/* Barra de búsqueda */}
        <div className="flex-shrink-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={manejarBusqueda}
            disabled={cargandoBusqueda}
            className={`px-4 py-2 rounded-full border-none w-64 max-w-full text-base text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-full md:max-w-64 ${
              cargandoBusqueda ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* Carrito */}
        <Link 
          to="/carrito" 
          className="relative text-white no-underline whitespace-nowrap hover:scale-110 transition-transform"
        >
          <FaShoppingCart size={24} />
          {totalProductos > 0 && (
            <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {totalProductos}
            </span>
          )}
        </Link>
      </div>

      {/* Mensaje de bienvenida para móviles */}
      {usuario && (
        <p className="text-white text-center w-full mt-2 lg:hidden">
          Bienvenido, {usuario.nombre}
        </p>
      )}
    </header>
  );
}

export default Header;