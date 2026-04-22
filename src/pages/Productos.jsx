import React, { useEffect, useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { demoProducts, demoCategorias } from "../data/demoProducts";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const { agregarProducto } = useCarrito();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categorias`);
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Usando categorías demo:", error);
        setCategorias(demoCategorias);
      }
    };

    cargarCategorias();
  }, [API_URL]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        let url = `${API_URL}/productos?page=${pagina}&limit=6`;
        if (categoriaSeleccionada) {
          url += `&categoria=${categoriaSeleccionada}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar productos");
        const data = await res.json();

        setProductos(Array.isArray(data.productos) ? data.productos : []);
        setTotalPaginas(data.totalPages || 1);
      } catch (error) {
        console.error("Usando productos demo:", error);

        let filtrados = [...demoProducts];
        if (categoriaSeleccionada) {
          filtrados = filtrados.filter(
            (p) => Number(p.categoria) === Number(categoriaSeleccionada)
          );
        }

        const limit = 6;
        const inicio = (pagina - 1) * limit;
        const fin = inicio + limit;
        setProductos(filtrados.slice(inicio, fin));
        setTotalPaginas(Math.max(1, Math.ceil(filtrados.length / limit)));
      }
    };

    cargarProductos();
  }, [API_URL, pagina, categoriaSeleccionada]);

  const aumentar = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const disminuir = (id) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const agregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.id] || 1;

    agregarProducto(
      {
        id: producto.id,
        nombre: producto.name,
        precio: Number(producto.precio_oferta || producto.price),
        imagen: producto.imagen,
      },
      cantidad
    );

    setCantidades((prev) => ({ ...prev, [producto.id]: 1 }));

    Swal.fire({
      title: "Producto agregado",
      text: "¿Deseas ir al carrito?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Sí, ir al carrito",
      cancelButtonText: "Seguir comprando",
    }).then((result) => {
      if (result.isConfirmed) navigate("/carrito");
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-8">
      <aside className="bg-white rounded-2xl shadow p-4 h-fit">
        <h3 className="text-xl font-bold mb-4">Categorías</h3>

        <button
          onClick={() => {
            setCategoriaSeleccionada(null);
            setPagina(1);
          }}
          className={`w-full text-left px-3 py-2 rounded mb-2 ${
            categoriaSeleccionada === null
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Todas
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategoriaSeleccionada(cat.id);
              setPagina(1);
            }}
            className={`w-full text-left px-3 py-2 rounded mb-2 ${
              categoriaSeleccionada === cat.id
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </aside>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Productos Disponibles</h2>
          <span className="text-sm text-gray-500">Demo portfolio</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white rounded-2xl shadow p-4">
              <img
                src={producto.imagen}
                alt={producto.name}
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
                className="w-full h-40 object-contain mb-3"
              />

              <h3 className="text-lg font-semibold mb-2">{producto.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{producto.description}</p>

              {producto.precio_oferta && producto.precio_oferta > 0 && (
                <p className="text-sm text-gray-400 line-through">
                  ${parseFloat(producto.price).toFixed(2)}
                </p>
              )}

              <p
                className={`text-lg font-bold mb-4 ${
                  producto.precio_oferta && producto.precio_oferta > 0
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                $
                {producto.precio_oferta && producto.precio_oferta > 0
                  ? parseFloat(producto.precio_oferta).toFixed(2)
                  : parseFloat(producto.price).toFixed(2)}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => disminuir(producto.id)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  -
                </button>
                <span>{cantidades[producto.id] || 1}</span>
                <button
                  onClick={() => aumentar(producto.id)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  +
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Agregar
                </button>

                <Link
                  to={`/producto/${producto.id}`}
                  className="border border-gray-300 px-4 py-2 rounded-lg"
                >
                  Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-8 justify-center">
          <button
            onClick={() => setPagina((p) => Math.max(p - 1, 1))}
            disabled={pagina === 1}
            className="px-3 py-2 rounded-lg border"
          >
            ⬅ Anterior
          </button>

          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPagina(i + 1)}
              className={`px-3 py-2 rounded-lg border ${
                pagina === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className="px-3 py-2 rounded-lg border"
          >
            Siguiente ➡
          </button>
        </div>
      </section>
    </div>
  );
}

export default Productos;