// src/components/cards/CategoryCard.tsx
import { Link } from 'react-router-dom';

interface CategoryCardProps {
    title: string;
    description: string;
    icon: string;
    path: string;
    gradientClass: string; // Clase de Tailwind para el gradiente (ej: "from-primary/90")
    hoverTextClass: string; // Clase para el color de texto al hacer hover (ej: "hover:text-primary")
}

export function CategoryCard({ title, description, icon, path, gradientClass, hoverTextClass }: CategoryCardProps) {
    return (
        <div className="relative group rounded-3xl overflow-hidden bg-surface-container-highest flex flex-col justify-end p-8 h-125">
            {/* El gradiente ahora usa la prop gradientClass */}
            <div className={`absolute inset-0 bg-linear-to-t ${gradientClass} to-transparent z-10`}></div>
            
            <div className="relative z-20">
                <span className="material-symbols-outlined text-white mb-4 text-4xl">{icon}</span>
                <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/80 mb-6">{description}</p>
                
                {/* Usamos Link para la navegación interna */}
                <Link 
                    to={path} 
                    className={`inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full font-bold hover:bg-white ${hoverTextClass} transition-all`}
                >
                    Explorar
                </Link>
            </div>
        </div>
    );
}