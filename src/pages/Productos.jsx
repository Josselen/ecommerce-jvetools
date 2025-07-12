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
      console.log('Productos recibidos:', data.productos); // <- AGREGA ESTA LÍNEA
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
      <div className="w-full md:w-1/4 bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Categorías</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => { setCategoriaSeleccionada(null); setPagina(1); }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                categoriaSeleccionada === null ? 'bg-blue-600 text-white' : 'text-gray-700'
              }`}
            >
              Todas
            </button>
          </li>
          {categorias.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => { setCategoriaSeleccionada(cat.id); setPagina(1); }}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                  categoriaSeleccionada === cat.id ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`}
              >
                {cat.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección de productos */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-center mb-6">Productos Disponibles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map(producto => (
            <div key={producto.id} className="bg-white shadow rounded p-4 flex flex-col justify-between">
              <img
                src={`/productos/${producto.imagen}`}
                alt={producto.name}
                onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                className="w-full h-40 object-contain mb-3"
              />
              <h3 className="text-lg font-semibold mb-1">{producto.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{producto.description}</p>
              
              {/* AGREGA ESTAS LÍNEAS PARA DEBUG */}
    {console.log(`Producto ${producto.id}:`, {
      price: producto.price,
      precio_oferta: producto.precio_oferta,
      tipo_precio_oferta: typeof producto.precio_oferta
    })}
              {/* Precio */}
<div className="mb-3 flex items-center gap-2">
  {producto.precio_oferta && producto.precio_oferta > 0 && (
    <span className="text-red-500 line-through text-sm">
      ${parseFloat(producto.price).toFixed(2)}
    </span>
  )}
  <span
    className={`font-bold text-lg ${
      producto.precio_oferta && producto.precio_oferta > 0 ? 'text-green-600' : 'text-gray-800'
    }`}
  >
    ${
      producto.precio_oferta && producto.precio_oferta > 0
        ? parseFloat(producto.precio_oferta).toFixed(2)
        : parseFloat(producto.price).toFixed(2)
    }
  </span>
  {producto.precio_oferta && producto.precio_oferta > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
      OFERTA
    </span>
  )}
</div>




              <div className="flex items-center justify-center gap-3 mb-3">
                <button
                  onClick={() => disminuir(producto.id)}
                  className="bg-gray-200 px-2 py-1 rounded text-lg"
                >-</button>
                <span>{cantidades[producto.id] || 1}</span>
                <button
                  onClick={() => aumentar(producto.id)}
                  className="bg-gray-200 px-2 py-1 rounded text-lg"
                >+</button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className="bg-[#117287] hover:bg-gray-700 text-white py-2 rounded font-semibold"
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Agregar al carrito
                </button>
                <Link
                  to={`/productos/${producto.id}`}
                  className="bg-[#117287] hover:bg-gray-700 text-white py-2 rounded text-center font-semibold"
                >
                  Detalle del Producto
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => setPagina((p) => Math.max(p - 1, 1))}
            disabled={pagina === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              pagina === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            ⬅ Anterior
          </button>

          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPagina(i + 1)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                pagina === i + 1 ? "bg-blue-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              pagina === totalPaginas ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            Siguiente ➡
          </button>
        </div>
      </div>
    </div>
  );
}

export default Productos;
