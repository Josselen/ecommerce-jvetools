import React from 'react';

function BotonWhatsapp() {
  const mensaje = encodeURIComponent("¡Hola! Quisiera consultar por un producto de JVE Tools.");

  return (
    <a
      href={`https://wa.me/5491123925772?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:block fixed bottom-6 right-6 z-50"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
      />
    </a>
  );
}

export default BotonWhatsapp;
