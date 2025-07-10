import React, { useState } from 'react';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Mensaje enviado:', formData);
    alert("¡Gracias por contactarnos! Pronto nos comunicaremos contigo.");
    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
  };

  return (
    <div className="p-6 bg-gray-100 font-sans">
      {/* Banner */}
      <div className="bg-[#117287] text-white p-8 rounded-xl text-center mb-8 shadow-md">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Contacto</h1>
        <p className="text-base md:text-lg">¿Tenés dudas, consultas o querés trabajar con nosotros? ¡Escribinos!</p>
      </div>

      {/* Formulario */}
      <form 
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col gap-4"
      >
        <label className="flex flex-col text-gray-700 font-medium">
          Nombre:
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
            className="mt-1 p-3 border border-gray-300 rounded-lg text-base"
          />
        </label>

        <label className="flex flex-col text-gray-700 font-medium">
          Email:
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="mt-1 p-3 border border-gray-300 rounded-lg text-base"
          />
        </label>

        <label className="flex flex-col text-gray-700 font-medium">
          Asunto:
          <input 
            type="text" 
            name="asunto" 
            value={formData.asunto} 
            onChange={handleChange} 
            required 
            className="mt-1 p-3 border border-gray-300 rounded-lg text-base"
          />
        </label>

        <label className="flex flex-col text-gray-700 font-medium">
          Mensaje:
          <textarea 
            name="mensaje" 
            value={formData.mensaje} 
            onChange={handleChange} 
            required 
            className="mt-1 p-3 border border-gray-300 rounded-lg text-base resize-y min-h-[100px]"
          ></textarea>
        </label>

        <button 
          type="submit"
          className="bg-[#117287] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#0d5a6d] transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Contacto;
