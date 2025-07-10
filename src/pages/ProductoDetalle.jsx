import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dispararSweetBasico } from "../assets/SweetAlert";
import { useCarrito } from '../context/CarritoContext';

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { agregarProducto } = useCarrito();

  useEffect(() => {
    fetch(`http://localhost:3001/productos/${id}`)
      .then((res) => res.json())
      .then((productoEncontrado) => {
        if (productoEncontrado) {
          setProducto(productoEncontrado);
        } else {
          setError("Producto no encontrado.");
        }
        setCargando(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setError("Hubo un error al obtener el producto.");
        setCargando(false);
      });
  }, [id]);

  function agregarAlCarrito() {
    if (cantidad < 1) return;
    dispararSweetBasico("Producto Agregado", "El producto fue agregado al carrito con éxito", "success", "Cerrar");
    agregarProducto({
      id: producto.id,
      nombre: producto.name,
      precio: Number(producto.price),
      imagen: producto.imagen
    }, cantidad);
  }

  function sumarContador() {
    setCantidad(cantidad + 1);
  }

  function restarContador() {
    if (cantidad > 1) setCantidad(cantidad - 1);
  }

  if (cargando) return <p className="text-center mt-10">Cargando producto...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!producto) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-6">
      <img
        className="w-full md:w-[40%] h-auto max-h-[400px] object-contain bg-gray-100 rounded-lg p-4"
        src={`/productos/${producto.imagen}`}
        alt={producto.name}
      />

      <div className="flex-1 flex flex-col gap-4 text-gray-800">
        <h2 className="text-2xl font-semibold">{producto.name}</h2>
        <p className="text-gray-600 leading-relaxed">{producto.description}</p>
        <p className="text-xl text-[#117287] font-bold">${producto.price}</p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={restarContador}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
          >-</button>
          <span className="text-lg">{cantidad}</span>
          <button
            onClick={sumarContador}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
          >+</button>
        </div>

        <button
          onClick={agregarAlCarrito}
          className="mt-6 bg-[#117287] hover:bg-gray-800 text-white py-2 px-4 rounded font-semibold"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductoDetalle;
