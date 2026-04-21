import { EventCard } from "../../components/cards/EventCard";

export function MuseumPage() {
    const exposiciones = [
        { 
            id: "m1", 
            titulo: "Van Gogh: Inmersivo", 
            srcImg: "https://images.unsplash.com/photo-1543857778-c4a1a5206609?w=500&auto=format&fit=crop&q=60", 
            precio: 32.00, 
            lugar: "Museo de Arte Moderno", 
            categoria: "Museo" 
        },
        { 
            id: "m2", 
            titulo: "Egipto Milenario: Tesoros del Nilo", 
            srcImg: "https://images.unsplash.com/photo-1563240669-6c7a3c0c8f6d?w=500&auto=format&fit=crop&q=60", 
            precio: 28.00, 
            lugar: "Museo Arqueológico Nacional", 
            categoria: "Museo" 
        },
        { 
            id: "m3", 
            titulo: "Frida Kahlo: Vida y Obra", 
            srcImg: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&auto=format&fit=crop&q=60", 
            precio: 26.00, 
            lugar: "Palacio de Bellas Artes", 
            categoria: "Museo" 
        },
        { 
            id: "m4", 
            titulo: "Ciencia Futura: IA y Sociedad", 
            srcImg: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60", 
            precio: 20.00, 
            lugar: "Museo de Ciencias", 
            categoria: "Museo" 
        },
        { 
            id: "m5", 
            titulo: "Fotografía Latinoamericana Siglo XX", 
            srcImg: "https://images.unsplash.com/photo-1554188248-986adbb73be0?w=500&auto=format&fit=crop&q=60", 
            precio: 18.00, 
            lugar: "Museo de la Memoria", 
            categoria: "Museo" 
        },
        { 
            id: "m6", 
            titulo: "Arte Precolombino: Raíces de América", 
            srcImg: "https://images.unsplash.com/photo-1582560475097-168d5c5c84c6?w=500&auto=format&fit=crop&q=60", 
            precio: 24.00, 
            lugar: "Museo Antropológico", 
            categoria: "Museo" 
        },
    ];

    return (
        <div className="flex flex-col w-full">
            {/* Hero Banner */}
            <section className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-amber-900/95 via-amber-800/60 to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1543857778-c4a1a5206609?w=1200&auto=format&fit=crop&q=60"
                    alt="Museo"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-12 max-w-screen-2xl mx-auto">
                    <span className="material-symbols-outlined text-white mb-4 text-5xl">museum</span>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Museos</h1>
                    <p className="text-white/80 text-lg max-w-xl">Explora exposiciones de arte, historia y ciencia. Viaja a través del tiempo y la cultura.</p>
                </div>
            </section>

            {/* Events Grid */}
            <section className="px-8 py-16 max-w-screen-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                    <h2 className="text-2xl font-bold text-on-background tracking-tight uppercase px-4">Exposiciones</h2>
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {exposiciones.map((exp) => (
                        <EventCard
                            key={exp.id}
                            titulo={exp.titulo}
                            srcImg={exp.srcImg}
                            precio={`$${exp.precio.toFixed(2)}`}
                            lugar={exp.lugar}
                            categoria={exp.categoria}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}