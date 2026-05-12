import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { path: "/", label: "Explorar", icon: "explore" },
        { path: "/theaterCategory", label: "Teatro", icon: "theater_comedy" },
        { path: "/cineCategory", label: "Cine", icon: "movie" },
        { path: "/museumCategory", label: "Museo", icon: "museum" },
    ];

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#1a1625] backdrop-blur-xl border-b border-white/5">
            <div className="flex justify-between items-center px-4 md:px-8 h-16 md:h-20 w-full max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-8 md:gap-12">
                    <Link 
                        to={"/"} 
                        className="flex items-center gap-2 text-xl md:text-2xl font-black text-white tracking-tight"
                    >
                        <span>TicketMaster</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    isActive(link.path)
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="material-symbols-outlined text-base">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/mis-boletos"
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    location.pathname === "/mis-boletos"
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="material-symbols-outlined text-base">confirmation_number</span>
                                <span>Mis Boletos</span>
                            </Link>

                            <div className="h-6 w-px bg-white/10 mx-2" />

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                    <div className="w-7 h-7 bg-[#6366f1]/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#818cf8] text-sm">person</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-200 max-w-[120px] truncate">
                                        {user?.primerNombre || user?.username}
                                    </span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                >
                                    <span className="material-symbols-outlined text-base">logout</span>
                                    <span className="hidden lg:inline">Salir</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                            >
                                <span className="material-symbols-outlined text-base">login</span>
                                <span>Iniciar Sesión</span>
                            </Link>
                            <Link
                                to="/registro"
                                className="flex items-center gap-1.5 bg-[#6366f1] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#818cf8] shadow-lg shadow-[#6366f1]/20 transition-all duration-200"
                            >
                                <span className="material-symbols-outlined text-base">person_add</span>
                                <span>Registrarse</span>
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-white/5"
                >
                    <span className="material-symbols-outlined text-white">
                        {mobileMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-[#1a1625] border-t border-white/5 pb-4">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                                    isActive(link.path)
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="material-symbols-outlined">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-white/5 mt-2 pt-4 px-4">
                        {isAuthenticated ? (
                            <div className="space-y-1">
                                <Link
                                    to="/mis-boletos"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                                        location.pathname === "/mis-boletos"
                                            ? "bg-white/10 text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <span className="material-symbols-outlined">confirmation_number</span>
                                    <span>Mis Boletos</span>
                                </Link>
                                <div className="flex items-center gap-2 px-4 py-3">
                                    <div className="w-8 h-8 bg-[#6366f1]/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#818cf8]">person</span>
                                    </div>
                                    <span className="font-semibold text-gray-200">
                                        {user?.primerNombre || user?.username}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    <span className="material-symbols-outlined">login</span>
                                    <span>Iniciar Sesión</span>
                                </Link>
                                <Link
                                    to="/registro"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full bg-[#6366f1] text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-[#6366f1]/20"
                                >
                                    <span className="material-symbols-outlined">person_add</span>
                                    <span>Crear Cuenta</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
