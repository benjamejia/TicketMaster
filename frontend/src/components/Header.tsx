import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between bg-blue-950/90 px-10 text-white backdrop-blur-md border-b border-white/10">
            
            {/* Logo con un toque de estilo */}
            <div className="flex items-center gap-2">
                <div className="size-8 bg-blue-600 rounded-lg rotate-12 flex items-center justify-center shadow-lg shadow-blue-600/50">
                    <span className="font-black text-white -rotate-12">T</span>
                </div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                    Ticket<span className="text-blue-500">Master</span>
                </h1>
            </div>

            {/* Navegación Semántica */}
            <nav>
                <ul className="flex gap-8 font-medium text-sm uppercase tracking-widest">
                    <li>
                        <Link to="/cines" className="transition-colors hover:text-blue-400">Cines</Link>
                    </li>
                    <li>
                        <Link to="/teatros" className="transition-colors hover:text-blue-400">Teatros</Link>
                    </li>
                    <li>
                        <Link to="/museos" className="transition-colors hover:text-blue-400">Museos</Link>
                    </li>
                </ul>
            </nav>

            {/* Acciones */}
            <div className="flex items-center gap-6">
                <button className="text-sm font-bold hover:text-blue-400 transition-colors">
                    Iniciar Sesión
                </button>
                <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-bold transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95">
                    Registrarse
                </button>
            </div>
        </header>
    );
}