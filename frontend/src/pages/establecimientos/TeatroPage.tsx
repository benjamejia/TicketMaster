import { EventCard } from "../../components/cards/EventCard";

export function TeatroPage() {
    const eventos = [
        { id: "t1", titulo: "El Rey León: Soundtrack", srcImg: "https://images.unsplash.com/photo-1503095396549-807759285036?w=500&auto=format&fit=crop&q=60", precio: 45.00, lugar: "Auditorio Nacional", categoria: "Teatro" },
        { id: "t2", titulo: "Hamlet: Versión Libre", srcImg: "https://images.unsplash.com/photo-1585699324551-f6c30889516a?w=500&auto=format&fit=crop&q=60", precio: 30.00, lugar: "Teatro Colón", categoria: "Teatro" },
        { id: "t3", titulo: "La Casa de Bernarda Alba", srcImg: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=60", precio: 25.00, lugar: "Teatro Nacional", categoria: "Teatro" },
        { id: "t4", titulo: "Romeo y Julieta Moderna", srcImg: "https://images.unsplash.com/photo-1460723234454-004284666368?w=500&auto=format&fit=crop&q=60", precio: 35.00, lugar: "Arena Cultural", categoria: "Teatro" },
        { id: "t5", titulo: "Don Quijote en Escena", srcImg: "https://images.unsplash.com/photo-1547153760-18fc36a87747?w=500&auto=format&fit=crop&q=60", precio: 28.00, lugar: "Teatro Municipal", categoria: "Teatro" },
        { id: "t6", titulo: "Bodas de Sangre", srcImg: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60", precio: 22.00, lugar: "Teatro Español", categoria: "Teatro" },
    ];

    return (
        <div className="flex flex-col w-full">
            {/* Hero Banner */}
            <section className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/60 to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1503095396549-807759285036?w=1200&auto=format&fit=crop&q=60"
                    alt="Teatro"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-12 max-w-screen-2xl mx-auto">
                    <span className="material-symbols-outlined text-white mb-4 text-5xl">theater_comedy</span>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Teatro</h1>
                    <p className="text-white/80 text-lg max-w-xl">Dramas, comedias y experimentación escénica. Descubre las mejores obras en cartelera.</p>
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
