import React, { useState, useEffect } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const { agregarProducto } = useCarrito();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error('Error al obtener categorías:', err);
    }
  };

  const obtenerProductos = async () => {
    try {
      let url = `${API_URL}/productos?page=${pagina}&limit=6`;
      if (categoriaSeleccionada) {
        url += `&categoria=${categoriaSeleccionada}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      console.log('Productos recibidos:', data.productos);
      setProductos(Array.isArray(data.productos) ? data.productos : []);
      setTotalPaginas(data.totalPages || 1);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    obtenerProductos();
  }, [pagina, categoriaSeleccionada]);

  const aumentar = (id) => {
    setCantidades(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const disminuir = (id) => {
    setCantidades(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 1) }));
  };

  const agregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.id] || 1;
    agregarProducto({
      id: producto.id,
      nombre: producto.name,
      precio: Number(producto.price),
      imagen: producto.imagen
    }, cantidad);

    setCantidades(prev => ({ ...prev, [producto.id]: 1 }));

    Swal.fire({
      title: 'Producto agregado',
      text: '¿Deseas ir al carrito?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sí, ir al carrito',
      cancelButtonText: 'Seguir comprando'
    }).then(result => {
      if (result.isConfirmed) {
        navigate('/carrito');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar de categorías */}
      {/* ... (todo tu código JSX sin cambios) */}
    </div>
  );
}

export default Productos;
