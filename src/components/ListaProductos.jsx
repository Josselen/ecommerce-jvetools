import React from 'react';
import Swal from 'sweetalert2';

function ListaProductos({ productos = [], onEditar, onEliminar }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/api/productos/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar. Código: ${response.status}`);
        }

        Swal.fire({
          title: 'Eliminado',
          text: 'El producto se ha eliminado correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });

        onEliminar();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto. Revisa la consola para más detalles.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left">Nombre</th>
            <th className="px-6 py-3 text-left">Descripción</th>
            <th className="px-6 py-3 text-left">Precio</th>
            <th className="px-6 py-3 text-left">Imagen</th>
            <th className="px-6 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(productos || []).map((prod) => (
            <tr key={prod.id} className="border-b">
              <td className="px-6 py-4">{prod.name}</td>
              <td className="px-6 py-4">{prod.description}</td>
              <td className="px-6 py-4">${Number(prod.price).toFixed(2)}</td>
              <td className="px-6 py-4">
                {prod.imagen && (
                  <img
                    src={`/productos/${prod.imagen}`}
                    alt={prod.name}
                    className="h-12 w-12 object-contain"
                  />
                )}
              </td>
              <td className="px-6 py-4 flex space-x-2">
                <button
                  onClick={() => onEditar(prod)}
                  className="bg-sky-700 text-white px-3 py-1 rounded-md text-sm hover:bg-sky-800 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProducto(prod.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaProductos;
