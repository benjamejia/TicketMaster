interface EventCardProps {
  titulo: string;
  srcImg: string;
  fecha?: string; // Opcional por si quieres pasar fechas distintas
  categoria?: string;
}

export function EventCard({ titulo, srcImg, fecha = "16/02/2026", categoria = "Concierto" }: EventCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 w-64">
      
      {/* Contenedor de Imagen con Aspect Ratio fijo */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute top-2 left-2 z-10">
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase text-white shadow-lg">
            {categoria}
          </span>
        </div>
        <img 
          src={srcImg} 
          alt={titulo}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="flex flex-col p-4">
        <h3 className="mb-1 truncate text-lg font-bold text-gray-800" title={titulo}>
          {titulo}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{fecha}</span>
        </div>

        <button className="mt-4 w-full rounded-xl bg-gray-900 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-600">
          Ver Boletos
        </button>
      </div>
    </div>
  );
}