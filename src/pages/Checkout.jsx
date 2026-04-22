import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCarrito } from "../context/CarritoContext";

function Checkout() {
  const navigate = useNavigate();
  const { carrito } = useCarrito();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  const handlePago = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !direccion.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    if (carrito.length === 0) {
      Swal.fire("Error", "El carrito está vacío", "error");
      return;
    }

    Swal.fire({
      icon: "info",
      title: "Modo demostración",
      text: "Esta demo pública no procesa pagos reales ni guarda pedidos en base de datos.",
      confirmButtonText: "Entendido",
    });

    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p className="text-gray-600 mb-6">
        Esta es una versión demo del checkout para portfolio.
      </p>

      <form onSubmit={handlePago} className="bg-white rounded-2xl shadow p-6 space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Finalizar compra
        </button>
      </form>
    </div>
  );
}

export default Checkout;