import React, { useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Checkout() {
  const { carrito, vaciarCarrito } = useCarrito();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('mercadopago');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const handlePago = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !direccion.trim()) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (carrito.length === 0) {
      Swal.fire('Error', 'El carrito está vacío', 'error');
      return;
    }

    if (metodoPago === 'mercadopago') {
      setIsLoading(true);
      try {
        const carritoValidado = carrito.map(item => ({
          id: item.id,
          name: item.name || item.nombre || 'Producto',
          precio: parseFloat(item.precio || item.price) || 0,
          cantidad: parseInt(item.cantidad) || 1
        }));

        const res = await fetch(`${API_URL}/create_preference`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            carrito: carritoValidado,
            nombre: nombre.trim(),
            email: email.trim(),
            direccion: direccion.trim()
          }),
        });

        const responseData = await res.json();

        if (responseData.sandbox_init_point || responseData.init_point) {
          Swal.fire({
            title: 'Redirigiendo a MercadoPago...',
            text: 'Por favor espera mientras procesamos tu pago',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          setTimeout(() => {
            window.location.href = responseData.sandbox_init_point || responseData.init_point;
          }, 1500);
        } else {
          throw new Error('No se recibió URL de pago válida');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message || 'Error en el pago', 'error');
      } finally {
        setIsLoading(false);
      }
    } else if (metodoPago === 'transferencia') {
      try {
        const pedidoData = {
          nombre: nombre.trim(),
          email: email.trim(),
          direccion: direccion.trim(),
          metodo_pago: 'transferencia',
          total: total.toFixed(2)
        };

        await fetch(`${API_URL}/api/guardar_pedido`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedidoData)
        });

        Swal.fire({
          icon: 'success',
          title: '¡Pedido registrado!',
          text: 'Tu pedido fue registrado correctamente como pendiente. Envíanos tu comprobante por WhatsApp.',
          confirmButtonText: 'Continuar comprando'
        }).then(() => {
          vaciarCarrito();
          navigate('/productos');
        });
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Error al registrar el pedido', 'error');
      }
    } else if (metodoPago === 'whatsapp') {
      const mensaje = encodeURIComponent(`Hola, quiero enviar el comprobante de mi compra:\n\nNombre: ${nombre}\nEmail: ${email}\nDirección: ${direccion}\nMonto: $${total.toFixed(2)}\nGracias.`);
      const url = `https://wa.me/5491134567890?text=${mensaje}`;
      window.open(url, '_blank');
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-600">Carrito vacío</h2>
        <p className="text-gray-500 mb-4">No tienes productos en tu carrito</p>
        <button
          onClick={() => navigate('/productos')}
          className="bg-[#117287] hover:bg-[#0c5b69] text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#117287]">🛒 Finalizar compra</h2>

      {/* Resumen del carrito */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-700">Resumen de compra:</h3>
        {carrito.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{item.name} x{item.cantidad}</span>
            <span className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-2 border-gray-200" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-[#117287]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handlePago} className="flex flex-col gap-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
          required
          disabled={isLoading}
          className="px-4 py-3 border rounded-lg"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          disabled={isLoading}
          className="px-4 py-3 border rounded-lg"
        />
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección de envío"
          required
          disabled={isLoading}
          className="px-4 py-3 border rounded-lg"
        />

        {/* Opciones de pago */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="metodoPago"
              value="mercadopago"
              checked={metodoPago === 'mercadopago'}
              onChange={() => setMetodoPago('mercadopago')}
            />
            Pago con MercadoPago
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="metodoPago"
              value="transferencia"
              checked={metodoPago === 'transferencia'}
              onChange={() => setMetodoPago('transferencia')}
            />
            Transferencia bancaria directa
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="metodoPago"
              value="whatsapp"
              checked={metodoPago === 'whatsapp'}
              onChange={() => setMetodoPago('whatsapp')}
            />
            Pago al retirar
          </label>
        </div>

        {/* Datos bancarios para transferencia */}
        {metodoPago === 'transferencia' && (
          <div className="p-4 mt-4 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-1">Datos para transferencia:</p>
            <p>🏦 Banco: Banco Nación</p>
            <p>🔖 Alias: JVETOOLS.CBU</p>
            <p>🏷️ CBU: 0000003100098765432100</p>
            <p>💳 Cuenta: 123456789</p>
            <p>💰 Monto: ${total.toFixed(2)}</p>
            <p className="mt-2">📱 Envía el comprobante por WhatsApp para procesar tu pedido.</p>
            <a
              href={`https://wa.me/5491134567890?text=${encodeURIComponent(`Hola, adjunto el comprobante de mi compra por transferencia bancaria:\n\nNombre: ${nombre}\nEmail: ${email}\nDirección: ${direccion}\nMonto: $${total.toFixed(2)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition duration-300"
            >
              Enviar comprobante por WhatsApp
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
            isLoading ? 'bg-gray-400' : 'bg-[#117287] hover:bg-[#0c5b69]'
          }`}
        >
          {isLoading ? 'Procesando...' : 'Confirmar y continuar'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
