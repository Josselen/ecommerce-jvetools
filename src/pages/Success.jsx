//Success
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import Swal from 'sweetalert2';

function Success() {
  const navigate = useNavigate();
  const { vaciarCarrito } = useCarrito();

  useEffect(() => {
    // Vaciar carrito al completar pago exitoso
    vaciarCarrito();
    
    Swal.fire({
      title: '¡Pago exitoso!',
      text: 'Tu compra se ha procesado correctamente',
      icon: 'success',
      confirmButtonText: 'Continuar comprando'
    }).then(() => {
      navigate('/');
    });
  }, [vaciarCarrito, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold mb-4 text-green-600">¡Pago exitoso!</h2>
        <p className="text-gray-600 mb-6">
          Tu compra se ha procesado correctamente. Recibirás un email de confirmación.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#117287] hover:bg-[#0c5b69] text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
}

export default Success;