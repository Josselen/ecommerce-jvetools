import React from 'react';

function Nosotros() {
  return (
    <div className="p-6 bg-[#f4f8fa] text-gray-800 leading-relaxed font-sans">
      {/* Banner superior */}
      <div className="bg-[#117287] text-white p-8 rounded-xl text-center shadow-md mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold m-0">Sobre Nosotros</h1>
      </div>

      {/* Contenido */}
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md space-y-5">
        <p>
          En <strong className="text-[#117287]">JVE Tools</strong> nos especializamos en la venta de herramientas de alta precisión para técnicos en <strong className="text-[#117287]">microelectrónica aplicada a dispositivos móviles</strong>.
        </p>
        <p>
          Nuestro objetivo es brindar soluciones de calidad a profesionales que trabajan con tecnología móvil, ofreciéndoles insumos confiables, duraderos y adaptados a las exigencias del mercado actual.
        </p>
        <p>
          Trabajamos constantemente para ampliar nuestro catálogo, mantenernos actualizados con las últimas innovaciones y brindar atención personalizada a cada cliente.
        </p>
        <p>
          💡 <em>La precisión y la excelencia son nuestros pilares. Confiá en nosotros para llevar tu trabajo al siguiente nivel.</em>
        </p>
      </div>
    </div>
  );
}

export default Nosotros;
