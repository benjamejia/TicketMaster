import { EventCard } from "../components/cards/EventCard";

export function CinePage() {
    const eventos = [
        { id: "c1", titulo: "Sombras en Neón", srcImg: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60", precio: 12.00, lugar: "Cine Multiplex Prime", categoria: "Cine" },
        { id: "c2", titulo: "El Último Horizonte", srcImg: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60", precio: 10.00, lugar: "Cinemex Reforma", categoria: "Cine" },
        { id: "c3", titulo: "Ecos del Silencio", srcImg: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop&q=60", precio: 14.00, lugar: "Cinepolis Luxury", categoria: "Cine" },
        { id: "c4", titulo: "Noches de Jazz", srcImg: "https://images.unsplash.com/photo-1594908900066-3f472751f074?w=500&auto=format&fit=crop&q=60", precio: 15.00, lugar: "Cine Independiente", categoria: "Cine" },
        { id: "c5", titulo: "Ciclos del Alma", srcImg: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=60", precio: 11.00, lugar: "Cine Tonalá", categoria: "Cine" },
        { id: "c6", titulo: "La Fuga de los Sueños", srcImg: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop&q=60", precio: 13.00, lugar: "Cineteca Nacional", categoria: "Cine" },
    ];

    return (
        <div className="flex flex-col w-full">
            {/* Hero Banner */}
            <section className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-tertiary/95 via-tertiary/60 to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=60"
                    alt="Cine"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-12 max-w-screen-2xl mx-auto">
                    <span className="material-symbols-outlined text-white mb-4 text-5xl">movie</span>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Cine</h1>
                    <p className="text-white/80 text-lg max-w-xl">Estrenos, cine de autor y clásicos atemporales. La magia del séptimo arte.</p>
                </div>
            </section>

            {/* Events Grid */}
            <section className="px-8 py-16 max-w-screen-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                    <h2 className="text-2xl font-bold text-on-background tracking-tight uppercase px-4">En Cartelera</h2>
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {eventos.map((evt) => (
                        <EventCard
                            key={evt.id}
                            titulo={evt.titulo}
                            srcImg={evt.srcImg}
                            precio={`$${evt.precio.toFixed(2)}`}
                            lugar={evt.lugar}
                            categoria={evt.categoria}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
