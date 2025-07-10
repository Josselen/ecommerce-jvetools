import { useState, useEffect } from 'react';

function FormularioProducto({ producto, onGuardado, onCancel }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
  });

  useEffect(() => {
    setForm(
      producto || {
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
      }
    );
  }, [producto]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      return alert('El nombre es obligatorio.');
    }
    if (form.descripcion.length < 10) {
      return alert('La descripción debe tener al menos 10 caracteres.');
    }
    if (parseFloat(form.precio) <= 0) {
      return alert('El precio debe ser mayor a 0.');
    }

    const url = producto
      ? `http://localhost:3001/productos/${producto.id}`
      : 'http://localhost:3001/productos';
    const method = producto ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      await response.json();
      onGuardado();
      setForm({ nombre: '', descripcion: '', precio: '', imagen: '' });
      onCancel();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-xl mx-auto mb-8"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        {producto ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre del producto"
        value={form.nombre}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      <input
        type="text"
        name="imagen"
        placeholder="URL de la imagen"
        value={form.imagen}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-md transition"
        >
          {producto ? 'Actualizar' : 'Agregar'}
        </button>
        {producto && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioProducto;
