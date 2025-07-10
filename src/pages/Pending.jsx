//Pending
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Pending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center p-8">
        <div className="text-6xl mb-4">⏳</div>
        <h2 className="text-3xl font-bold mb-4 text-yellow-600">Pago pendiente</h2>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos por email cuando se complete la transacción.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Guarda el número de referencia para hacer seguimiento de tu pago.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#117287] hover:bg-[#0c5b69] text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Pending;