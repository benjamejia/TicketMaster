import { EventCard } from "../components/cards/EventCard";
import caratulaReyLeon from '../assets/reyLeon.jpg';
import avatarBanner from '../assets/avatarBanner.jpg';
import hamlet from '../assets/hamlet.jpg';
import marmol from '../assets/marmol.jpeg';

interface CategoryPageProps {
    title: string;
    description: string;
    categoryName: string;
}

export function CategoryPage({ title, description, categoryName }: CategoryPageProps) {
    // 1. Simulamos una base de datos de eventos
    const allEvents = [
        { id: 1, titulo: "El Rey León", srcImg: caratulaReyLeon, precio: "$45.00", lugar: "Auditorio Nacional", categoria: "Teatro" },
        { id: 2, titulo: "Avatar: The Way of Water", srcImg: avatarBanner, precio: "$12.00", lugar: "IMAX Prime", categoria: "Cine" },
        { id: 3, titulo: "Mármol y Tiempo", srcImg: marmol, precio: "Gratis", lugar: "Museo Nacional", categoria: "Museo" },
        { id: 4, titulo: "Hamlet: La Nueva Era", srcImg: hamlet, precio: "$30.00", lugar: "Gran Teatro Central", categoria: "Teatro" },
        { id: 5, titulo: "Sombras en Neón", srcImg: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60", precio: "$10.00", lugar: "Cine Multiplex", categoria: "Cine" },
        { id: 6, titulo: "Exposición Van Gogh", srcImg: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&auto=format&fit=crop&q=60", precio: "$15.00", lugar: "Galería de Arte Contemporáneo", categoria: "Museo" },
    ];

    // 2. Filtramos los eventos para que solo queden los de esta categoría
    const filteredEvents = allEvents.filter(evento => evento.categoria === categoryName);

    return (
        <div className="w-full flex flex-col min-h-screen bg-background pt-12 pb-24 px-8 max-w-screen-2xl mx-auto">
            
            {/* Encabezado de la Categoría */}
            <div className="mb-12">
                <h1 className="text-5xl font-extrabold text-on-background tracking-tighter font-headline mb-4 uppercase italic">
                    {title}
                </h1>
                <p className="text-lg text-on-surface-variant font-body max-w-2xl">
                    {description}
                </p>
                <div className="h-0.5 w-full bg-outline-variant/20 mt-8"></div>
            </div>

            {/* Cuadrícula de Eventos Filtrados */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredEvents.map((evento) => (
                        <EventCard 
                            key={evento.id}
                            titulo={evento.titulo} 
                            srcImg={evento.srcImg} 
                            precio={evento.precio} 
                            lugar={evento.lugar} 
                            categoria={evento.categoria}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl border border-outline-variant/20">
                    <p className="text-on-surface-variant font-medium font-body">No hay eventos disponibles en esta categoría por ahora.</p>
                </div>
            )}
        </div>
    );
}