interface EventCardProps {
  titulo: string;
  srcImg: string;
  precio?: string;
  lugar?: string;
  categoria?: string;
}


export function EventCard({ titulo, srcImg, precio = "$12.00", lugar = "Cine Multiplex Prime", categoria = "Cine" }: EventCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-3/4 rounded-2xl overflow-hidden mb-6 bg-surface-container relative">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={titulo} 
          src={srcImg}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
          NUEVO
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-tertiary font-bold text-xs tracking-widest uppercase">{categoria}</span>
          <span className="text-on-surface font-black text-lg">{precio}</span>
        </div>
        <h3 className="text-xl font-bold text-on-background line-clamp-1">{titulo}</h3>
        <p className="text-sm text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">location_on</span> {lugar}
        </p>
      </div>
    </div>
  );
}