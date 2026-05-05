import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import avatarBanner from '../assets/avatarBanner.jpg';

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // 1. Nuevo estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirigir si ya está autenticado
    if (isAuthenticated) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        // 2. Validaciones del lado del cliente
        if (!username.trim()) {
            setError("Por favor, ingresa tu usuario.");
            return;
        }

        if (!password.trim()) {
            setError("Por favor, ingresa tu contraseña.");
            return;
        }

        if (password.length < 4) {
            setError("La contraseña es demasiado corta. Verifica tus datos.");
            return;
        }

        setIsLoading(true);

        try {
            await login(username, password);
            navigate("/");
        } catch (err: any) {
            // 3. Manejo de errores más robusto
            // Si tu backend devuelve un mensaje específico (ej. axios: err.response.data.message), puedes usarlo aquí.
            const errorMessage = err?.response?.data?.message || err?.message;
            
            if (err?.response?.status === 403) {
                setError("Usuario o contraseña incorrectos. Intenta de nuevo.");
            } else if (errorMessage) {
                setError(`No se pudo iniciar sesión: ${errorMessage}`);
            } else {
                setError("Error de conexión. Por favor, intenta más tarde.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">

            {/* Mitad Izquierda: Imagen y Copy (Oculto en móviles) */}
            <div className="hidden lg:flex w-1/2 relative bg-inverse-surface overflow-hidden">
                <img
                    src={avatarBanner}
                    alt="Fondo de cartelera"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-inverse-surface via-inverse-surface/50 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end p-16 w-full h-full">
                    <span className="material-symbols-outlined text-primary text-6xl mb-6">theater_comedy</span>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tighter mb-4 font-headline leading-tight">
                        Descubre tu <br/> Próximo <span className="text-primary italic">Evento</span>.
                    </h1>
                    <p className="text-outline-variant text-lg max-w-md font-body leading-relaxed">
                        Únete a nuestra comunidad para acceder a preventas exclusivas, asientos premium y experiencias culturales inolvidables.
                    </p>
                </div>
            </div>

            {/* Mitad Derecha: Formulario de Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-surface-bright">

                {/* Botón de Regreso */}
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold font-body text-sm bg-surface-container px-4 py-2 rounded-full hover:shadow-md">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Volver al inicio
                </Link>

                <div className="w-full max-w-md space-y-10 mt-12 lg:mt-0">

                    {/* Encabezado del Formulario */}
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter font-headline">
                            Iniciar Sesión
                        </h2>
                        <p className="text-on-surface-variant font-body text-lg">
                            Qué gusto verte de nuevo. Ingresa tus datos.
                        </p>
                    </div>

                    {/* Error Message Visualmente Destacado */}
                     {error && (
                         <div className="bg-error/10 border-2 border-error/30 text-on-error-container px-6 py-4 rounded-2xl text-base font-body font-semibold flex items-center gap-4 shadow-lg animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
                             <span className="material-symbols-outlined text-error text-3xl animate-shake">error</span>
                             <div className="flex flex-col gap-1">
                                 <span className="font-bold text-error text-sm uppercase tracking-wide">Error</span>
                                 <span>{error}</span>
                             </div>
                         </div>
                     )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Input Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="username">
                                Usuario o Email
                            </label>
                            <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (error) setError(null); // Limpiar error al escribir
                                    }}
                                    placeholder="ejemplo@correo.com o usuario123"
                                    required
                                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                />
                            </div>
                        </div>

                        {/* Input Contraseña */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="password">
                                Contraseña o CURP
                            </label>
                            <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                                <input
                                    // 4. Cambiamos el tipo dinámicamente según el estado
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError(null); // Limpiar error al escribir
                                    }}
                                    placeholder="••••••••"
                                    required
                                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} // 5. Alternar estado
                                    className="text-outline hover:text-primary transition-colors focus:outline-none p-1 rounded-full hover:bg-surface-container"
                                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {/* 6. Cambiamos el ícono dinámicamente */}
                                    <span className="material-symbols-outlined">
                                        {showPassword ? "visibility" : "visibility_off"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Opciones Adicionales */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-body">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" className="peer w-5 h-5 appearance-none rounded border-2 border-outline-variant checked:bg-primary checked:border-primary transition-colors cursor-pointer" />
                                    <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                                </div>
                                <span className="text-on-surface-variant group-hover:text-on-background transition-colors font-medium">Recordarme</span>
                            </label>
                            <a href="#" className="font-bold text-primary hover:text-primary-dim transition-colors">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dim transition-all shadow-[0_10px_30px_rgba(93,63,211,0.25)] hover:shadow-[0_15px_40px_rgba(93,63,211,0.35)] active:scale-[0.98] flex justify-center items-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar a mi cuenta
                                    <span className="material-symbols-outlined text-xl">login</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Separador Visual */}
                    <div className="flex items-center gap-4 py-4">
                        <div className="h-px flex-1 bg-outline-variant/30"></div>
                        <span className="text-xs font-bold text-outline uppercase tracking-widest font-body">O continuar con</span>
                        <div className="h-px flex-1 bg-outline-variant/30"></div>
                    </div>

                    {/* Botones Sociales */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant/50 rounded-2xl hover:bg-surface-container transition-colors font-bold text-on-background font-body shadow-sm">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant/50 rounded-2xl hover:bg-surface-container transition-colors font-bold text-on-background font-body shadow-sm">
                            <span className="material-symbols-outlined text-on-background text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>apple</span>
                            Apple
                        </button>
                    </div>

                    {/* Enlace a Registro */}
                    <p className="text-center text-on-surface-variant font-medium font-body pt-4">
                        ¿Aún no tienes cuenta?{" "}
                        <Link className="font-bold text-primary hover:text-primary-dim transition-colors border-b-2 border-primary/20 hover:border-primary pb-0.5" to="/registro">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}