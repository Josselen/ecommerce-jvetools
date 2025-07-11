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
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/productos/${id}`)
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
      {/* ... (todo tu código JSX sin cambios) */}
    </div>
  );
}

export default ProductoDetalle;
