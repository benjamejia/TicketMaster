import { MainPopularEventCard } from "../components/cards/MainPopularEventCard";
import { CategoryCard } from "../components/cards/CategoryCard";

export function MainPage() {
    const CATEGORIES = [
        {
            title: "Teatro",
            description: "Dramas, comedias y experimentación.",
            icon: "theater_comedy",
            path: "/theaterCategory",
            gradientClass: "from-primary/90",
            hoverTextClass: "hover:text-primary"
        },
        {
            title: "Cine",
            description: "Estrenos, cine de autor y clásicos.",
            icon: "movie",
            path: "/cineCategory",
            gradientClass: "from-tertiary/90",
            hoverTextClass: "hover:text-tertiary"
        },
        {
            title: "Museo",
            description: "Arte, historia y experiencias inmersivas.",
            icon: "museum",
            path: "/eventos/museos",
            gradientClass: "from-on-surface-variant/90",
            hoverTextClass: "hover:text-on-background"
        }
    ];

    return (
        <div className="flex flex-col w-full">
            <MainPopularEventCard />

            <section className="px-8 py-20 bg-surface-container-low w-full">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-extrabold text-on-background tracking-tight mb-2">Categorías Curadas</h2>
                            <p className="text-on-surface-variant">Seleccionamos lo mejor de la cultura para ti</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CATEGORIES.map((cat) => (
                            <CategoryCard key={cat.title} {...cat} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}