//Failure
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Failure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center p-8">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-3xl font-bold mb-4 text-red-600">Pago fallido</h2>
        <p className="text-gray-600 mb-6">
          Hubo un problema con tu pago. Por favor, verifica tus datos e intenta nuevamente.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 bg-[#117287] hover:bg-[#0c5b69] text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Reintentar pago
          </button>
          <button
            onClick={() => navigate('/carrito')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default Failure;