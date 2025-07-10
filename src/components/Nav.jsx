import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext'; 
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

function Nav() {
  const { carrito } = useCarrito();
  const { usuario } = useAuth(); // Obtener el usuario del contexto
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  // Verificar si el usuario es admin
  const isAdmin = usuario && usuario.rol === 'admin';

  return (
    <nav className="bg-cyan-700 text-white px-6 py-4 flex justify-between items-center relative z-10">
      {/* Botón hamburguesa */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-2xl focus:outline-none"
      >
        ☰
      </button>

      {/* Menú de navegación */}
      <ul
        className={`${
          menuAbierto ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-cyan-700 md:bg-transparent md:space-x-6 space-y-2 md:space-y-0 px-6 py-4 md:py-0`}
      >
        <li>
          <Link
            to="/"
            onClick={() => setMenuAbierto(false)}
            className="relative pb-1 transition-colors
              before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-1
              before:h-1 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:origin-left
              hover:text-cyan-300"
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/productos"
            onClick={() => setMenuAbierto(false)}
            className="relative pb-1 transition-colors
              before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-1
              before:h-1 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:origin-left
              hover:text-cyan-300"
          >
            Productos
          </Link>
        </li>
        <li>
          <Link to="/nosotros" onClick={() => setMenuAbierto(false)} className="relative pb-1 transition-colors
              before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-1
              before:h-1 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:origin-left
              hover:text-cyan-300">Nosotros</Link>
        </li>
        <li>
          <Link to="/contacto" onClick={() => setMenuAbierto(false)} className="relative pb-1 transition-colors
              before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-1
              before:h-1 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:origin-left
              hover:text-cyan-300">Contacto</Link>
        </li>
        <li className="relative">
          <Link
            to="/carrito"
            onClick={() => setMenuAbierto(false)}
            className="relative pb-1 transition-colors
              before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-2
              before:h-1.5 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:origin-left
              hover:text-cyan-300 flex items-center gap-2"
          >
            <span className="relative flex items-center">
              <FaShoppingCart />
              {totalProductos > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalProductos}
                </span>
              )}
            </span>
            Carrito
          </Link>
        </li>
        
        {/* Enlace Admin - Solo visible si el usuario es admin */}
        {isAdmin && (
          <li>
            <Link to="/admin" onClick={() => setMenuAbierto(false)} className="relative pb-1 transition-colors
                before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-1
                before:h-1 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
                before:transition-transform before:origin-left
                hover:text-cyan-300">Admin</Link>
          </li>
        )}

        <li>
          <Link to="/login" onClick={() => setMenuAbierto(false)} className="relative pb-1 transition-colors
              before:content-[''] before:absolute before:left-0 before:right-0 before:-bottom-1
              before:h-1 before:rounded-full before:bg-cyan-300 before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:origin-left
              hover:text-cyan-300">Mi Cuenta</Link>
        </li>
      </ul>
      
      {/* Seguinos en redes */}
      <div className="hidden md:flex items-center gap-2 ml-6">
        <span className="text-white">Seguinos en</span>
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-cyan-300 transition"
          aria-label="Facebook"
        >
          <FaFacebook size={22} />
        </a>
        <a
          href="https://instagram.com/jve_tools"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-300 transition"
          aria-label="Instagram"
        >
          <FaInstagram size={22} />
        </a>
        <a
          href="https://wa.me/5491123925772"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-300 transition"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={22} />
        </a>
      </div>
    </nav>
  );
}

export default Nav;