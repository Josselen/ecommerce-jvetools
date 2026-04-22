import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { demoProducts } from "../data/demoProducts";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { agregarProducto } = useCarrito();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducto(data);
      } catch (err) {
        console.error("Usando producto demo:", err);
        const local = demoProducts.find((p) => String(p.id) === String(id));
        if (local) {
          setProducto(local);
        } else {
          setError("Producto no encontrado.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id, API_URL]);

  const agregarAlCarritoHandler = () => {
    if (!producto || cantidad < 1) return;

    agregarProducto(
      {
        id: producto.id,
        nombre: producto.name,
        precio: Number(producto.precio_oferta || producto.price),
        imagen: producto.imagen,
      },
      cantidad
    );
  };

  if (cargando) return <p className="p-8">Cargando producto...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!producto) return <p className="p-8">No se encontró el producto</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="bg-white rounded-2xl shadow p-6">
        <img
          src={producto.imagen}
          alt={producto.name}
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
          }}
          className="w-full h-[360px] object-contain"
        />
      </div>

      <div>
        <span className="inline-block mb-3 text-sm text-gray-500">
          Demo portfolio
        </span>

        <h2 className="text-3xl font-bold mb-4">{producto.name}</h2>
        <p className="text-gray-600 mb-5">{producto.description}</p>

        {producto.precio_oferta && producto.precio_oferta > 0 && (
          <p className="text-gray-400 line-through mb-1">
            ${parseFloat(producto.price).toFixed(2)}
          </p>
        )}

        <p className="text-2xl font-bold text-green-600 mb-6">
          $
          {producto.precio_oferta && producto.precio_oferta > 0
            ? parseFloat(producto.precio_oferta).toFixed(2)
            : parseFloat(producto.price).toFixed(2)}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCantidad((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            -
          </button>
          <span>{cantidad}</span>
          <button
            onClick={() => setCantidad((prev) => prev + 1)}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            +
          </button>
        </div>

        <button
          onClick={agregarAlCarritoHandler}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductoDetalle;