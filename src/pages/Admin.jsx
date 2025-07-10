import { useState, useEffect } from 'react';
import FormularioProducto from '../components/FormularioProducto';
import ListaProductos from '../components/ListaProductos';

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  const obtenerProductos = async () => {
    try {
      const res = await fetch('http://localhost:3001/productos?limit=1000&page=1');
      const data = await res.json();
      console.log('Respuesta productos:', data);
      setProductos(Array.isArray(data.productos) ? data.productos : []);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleEditar = (producto) => {
    setProductoEditando(producto);
  };

  const handleCancelarEdicion = () => {
    setProductoEditando(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#117287] mb-8">
          🛠️ Panel de Administración JVE Tools
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-10 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            {productoEditando ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <FormularioProducto
            producto={productoEditando}
            onGuardado={obtenerProductos}
            onCancel={handleCancelarEdicion}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Lista de Productos
          </h2>
          <ListaProductos
            productos={productos}
            onEditar={handleEditar}
            onEliminar={obtenerProductos}
          />
        </div>
      </div>
    </div>
  );
}
