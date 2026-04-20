import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 dark:bg-inverse-surface/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(16,6,45,0.06)]">
            <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-12">
                    <Link to={"/"} className="text-2xl font-black text-[#32294f] dark:text-background tracking-tighter cursor-pointer">
                        <span> TicketMaster</span>
                    </Link>
                    <div className="hidden md:flex gap-8 items-center">
                        <Link className="font-headline font-semibold tracking-tight text-primary dark:text-primary-container border-b-2 border-primary dark:border-primary-container pb-1 hover:-translate-y-0.5 transition-transform duration-200" to="/">Explorar</Link>
                        <Link className="font-headline font-semibold tracking-tight text-on-surface-variant dark:text-outline-variant hover:text-[#32294f] dark:hover:text-background hover:-translate-y-0.5 transition-transform duration-200" to="/teatro">Teatro</Link>
                        <Link className="font-headline font-semibold tracking-tight text-on-surface-variant dark:text-outline-variant hover:text-[#32294f] dark:hover:text-background hover:-translate-y-0.5 transition-transform duration-200" to="/cine">Cine</Link>
                        <Link className="font-headline font-semibold tracking-tight text-on-surface-variant dark:text-outline-variant hover:text-[#32294f] dark:hover:text-background hover:-translate-y-0.5 transition-transform duration-200" to="/museos">Museo</Link>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="p-2 text-primary scale-95 active:duration-75">
                        <span className="material-symbols-outlined">location_on</span>
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-sm font-bold text-on-surface-variant font-body">
                                {user?.username}
                            </span>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 bg-error text-on-error px-5 py-2.5 rounded-lg font-bold hover:bg-error-dim transition-all scale-95 active:duration-75"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 scale-95 active:duration-75">
                            <span className="material-symbols-outlined">person</span>
                            <span className="hidden sm:inline">Ingresar</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}