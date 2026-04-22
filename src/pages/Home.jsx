import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { demoProducts } from "../data/demoProducts";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Home() {
  const [productos, setProductos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/productos`);
        if (!res.ok) throw new Error("No se pudo cargar la API");
        const data = await res.json();
        setProductos(data.productos?.slice(0, 4) || demoProducts.slice(0, 4));
      } catch (error) {
        console.error("Usando productos demo en Home:", error);
        setProductos(demoProducts.slice(0, 4));
      }
    };

    cargarProductos();
  }, [API_URL]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Carrusel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="rounded-lg overflow-hidden h-[400px] mb-8"
      >
        {[1, 2, 3, 4].map((n) => (
          <SwiperSlide key={n}>
            <img
              src={`/banner/banner${n}.png`}
              alt={`Banner ${n}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Productos destacados */}
      <section className="text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <h2 className="text-2xl font-bold">Productos Destacados</h2>
          <span className="text-sm text-gray-500">Demo Version</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="w-[250px] bg-white rounded-lg shadow-md p-4 text-center"
            >
              <img
                src={
                  producto.imagen?.startsWith("/")
                    ? producto.imagen
                    : `/productos/${producto.imagen}`
                }
                alt={producto.name}
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
                className="w-full h-[160px] object-contain mb-3"
              />
              <h3 className="text-lg font-semibold">{producto.name}</h3>
              <p className="text-gray-700 font-medium mb-2">
                ${Number(producto.precio_oferta || producto.price).toFixed(2)}
              </p>
              <Link
                to={`/productos/${producto.id}`}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white py-1 px-4 rounded-full text-sm font-medium"
              >
                Ver más
              </Link>
            </div>
          ))}
        </div>

        <Link
          to="/productos"
          className="inline-block mt-8 bg-[#117287] hover:bg-[#0d5a6b] text-white font-bold py-2 px-6 rounded-md transition duration-300"
        >
          Ver todos los productos
        </Link>
      </section>

      {/* Cards informativas */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <img
            src="/icons/envio.png"
            alt="Envíos a todo el país"
            className="w-12 h-12 mx-auto mb-3"
          />
          <h3 className="text-[#117287] font-bold text-lg mb-2">
            ENVÍOS A TODO EL PAÍS
          </h3>
          <p className="text-gray-700">
            Hacé tu pedido y te lo enviamos donde sea que estés.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <img
            src="/icons/tarjeta.png"
            alt="Financiación"
            className="w-12 h-12 mx-auto mb-3"
          />
          <h3 className="text-[#117287] font-bold text-lg mb-2">
            FINANCIACIÓN
          </h3>
          <p className="text-gray-700">
            Comprá en cuotas con tarjeta. Fácil y sin vueltas.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <img
            src="/icons/stock.png"
            alt="Stock Garantizado"
            className="w-12 h-12 mx-auto mb-3"
          />
          <h3 className="text-[#117287] font-bold text-lg mb-2">
            STOCK GARANTIZADO
          </h3>
          <p className="text-gray-700">
            Todo nuestro stock está actualizado y reservado para vos.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;