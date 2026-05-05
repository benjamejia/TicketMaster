import { useEffect, useState } from "react";
import { EventCard } from "../components/cards/EventCard";
import { getAllFunciones, type Funcion } from "../services/api-service";

interface CategoryPageProps {
    title: string;
    description: string;
    categoryName: string;
}

const PLACEHOLDER_IMAGES: Record<string, string> = {
    "Cine": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
    "Teatro": "https://images.unsplash.com/photo-1503095396549-807759285036?w=500&auto=format&fit=crop&q=60",
    "Museo": "https://images.unsplash.com/photo-1543857778-c4a1a5206609?w=500&auto=format&fit=crop&q=60",
};

function mapFuncionToEvento(funcion: Funcion, categoria: string) {
    return {
        id: String(funcion.id),
        titulo: funcion.nombreFuncion,
        srcImg: PLACEHOLDER_IMAGES[categoria] || "https://images.unsplash.com/photo-1501612780353-7e5432707802?w=500&auto=format&fit=crop&q=60",
        precio: `$${(funcion.precio || 0).toFixed(2)}`,
        lugar: funcion.nombreEstablecimiento || "Por definir",
        categoria,
    };
}

export function CategoryPage({ title, description, categoryName }: CategoryPageProps) {
    const [eventos, setEventos] = useState<{ id: string; titulo: string; srcImg: string; precio: string; lugar: string; categoria: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarEventos = async () => {
            try {
                const funciones = await getAllFunciones();
                const filtered = funciones.filter((f) => {
                    const nombreSala = f.nombreSala?.toLowerCase() || "";
                    const nombreSucursal = f.nombreEstablecimiento?.toLowerCase() || "";
                    const nombreFuncion = f.nombreFuncion?.toLowerCase() || "";
                    const tipoEstablecimiento = f.tipoEstablecimiento?.toLowerCase() || "";
                    const cat = categoryName.toLowerCase();
                    return nombreSala.includes(cat) || nombreSucursal.includes(cat) || nombreFuncion.includes(cat) || tipoEstablecimiento.includes(cat);
                });
                const mapped = filtered.map((f) => mapFuncionToEvento(f, categoryName));
                setEventos(mapped);
            } catch {
                setError("No se pudieron cargar los eventos");
            } finally {
                setLoading(false);
            }
        };
        cargarEventos();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="w-full flex flex-col min-h-screen items-center justify-center bg-background pt-12 pb-24 px-8">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <p className="text-on-surface-variant mt-4">Cargando eventos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex flex-col min-h-screen items-center justify-center bg-background pt-12 pb-24 px-8">
                <span className="material-symbols-outlined text-4xl text-error">error</span>
                <p className="text-on-surface-variant mt-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col min-h-screen bg-background pt-12 pb-24 px-8 max-w-screen-2xl mx-auto">
            
            <div className="mb-12">
                <h1 className="text-5xl font-extrabold text-on-background tracking-tighter font-headline mb-4 uppercase italic">
                    {title}
                </h1>
                <p className="text-lg text-on-surface-variant font-body max-w-2xl">
                    {description}
                </p>
                <div className="h-0.5 w-full bg-outline-variant/20 mt-8"></div>
            </div>

            {eventos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {eventos.map((evento) => (
                        <EventCard 
                            key={evento.id}
                            id={evento.id}
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
