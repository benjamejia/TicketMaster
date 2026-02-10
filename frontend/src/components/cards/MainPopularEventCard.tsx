import avatarBanner from '../../assets/avatarBanner.jpg'

export function MainPopularEventCard() {
    return (
        <section className="relative w-full h-125 overflow-hidden bg-gray-900">
            {/* Imagen con Overlay para legibilidad */}
            <div className="absolute inset-0">
                <img 
                    src={avatarBanner} 
                    className="w-full h-full object-cover opacity-80" 
                    alt="Evento Destacado"
                />
                {/* Gradiente: de negro transparente a negro sólido abajo */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Contenido Centrado Responsivo */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
                <div className="max-w-2xl animate-fade-in-up">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Más Popular
                    </span>
                    
                    <h1 className="mt-4 text-5xl md:text-7xl text-white font-black tracking-tighter italic uppercase">
                        Avatar: The Way of Water
                    </h1>
                    
                    <p className="mt-4 text-gray-300 text-lg max-w-lg hidden md:block">
                        Regresa al mundo de Pandora en una aventura visual sin precedentes. 
                        ¡Asegura tus lugares para la experiencia IMAX ahora mismo!
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-4 transition-all transform active:scale-95 shadow-lg shadow-blue-600/30">
                            Comprar Boletos
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl px-8 py-4 border border-white/30 transition-all">
                            Ver Trailer
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}