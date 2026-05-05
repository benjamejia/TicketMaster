import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import avatarBanner from '../assets/avatarBanner.jpg';
import { FEDERAL_ENTITIES, type StateCode } from "../types/types";
import Swal from "sweetalert2";

interface RegisterRequestData {
    username: string;
    password: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    dateOfBirth: string;
    stateOfBirth: string;
    gender: string;
    email: string;
    country: string;
    phoneNumber: number;
}

export function RegisterPage() {
    const [primerNombre, setPrimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [primerApellido, setPrimerApellido] = useState("");
    const [segundoApellido, setSegundoApellido] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [stateOfBirth, setStateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [country, setCountry] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // --- Validaciones existentes ---
        if (!acceptedTerms) {
            setError("Debes aceptar los términos y condiciones.");
            return;
        }

        const phone = parseInt(phoneNumber, 10);
        if (isNaN(phone)) {
            setError("Ingresa un número de teléfono válido.");
            return;
        }

        if (!primerNombre.trim() || !username.trim() || !email.trim() || !password.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setIsLoading(true);

        try {
            const registerData: RegisterRequestData = {
                username,
                password,
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                dateOfBirth,
                stateOfBirth,
                gender,
                email,
                country,
                phoneNumber: phone,
            };

            await register(registerData);

            // --- ALERTA DE ÉXITO ---
            await Swal.fire({
                title: '¡Bienvenido a la cultura!',
                text: 'Tu cuenta ha sido creada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Comenzar ahora',
                confirmButtonColor: '#5D3FD3', // Color primario de tu app
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                }
            });

            navigate("/");
        } catch (err) {
            setError("Error al crear la cuenta. El nombre de usuario podría ya estar en uso.");
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
                    className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-inverse-surface via-inverse-surface/60 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end p-16 w-full h-full">
                    <span className="material-symbols-outlined text-tertiary-container text-6xl mb-6">local_activity</span>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tighter mb-4 font-headline leading-tight">
                        Tu Pasaporte a la <br/> <span className="text-tertiary-container italic">Cultura</span>.
                    </h1>
                    <p className="text-outline-variant text-lg max-w-md font-body leading-relaxed">
                        Crea tu cuenta hoy y obtén acceso anticipado a los eventos más exclusivos de teatro, cine y museos en tu ciudad.
                    </p>
                </div>
            </div>

            {/* Mitad Derecha: Formulario de Registro */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-surface-bright overflow-y-auto">

                {/* Botón de Regreso */}
                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold font-body text-sm bg-surface-container px-4 py-2 rounded-full hover:shadow-md">
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Volver al inicio
                </Link>

                <div className="w-full max-w-md space-y-8 mt-16 lg:mt-0 py-8">

                    {/* Encabezado del Formulario */}
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter font-headline">
                            Crear Cuenta
                        </h2>
                        <p className="text-on-surface-variant font-body text-lg">
                            Únete a Electric Curator en segundos.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-2xl text-sm font-body font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Input Nombre, Apellido y Nombre del Medio */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="primerNombre">
                                    Primer Nombre
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <input
                                        type="text"
                                        id="primerNombre"
                                        value={primerNombre}
                                        onChange={(e) => setPrimerNombre(e.target.value)}
                                        placeholder="María"
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="primerApellido">
                                    Segundo Nombre
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <input
                                        type="text"
                                        id="segundoNombre"
                                        value={segundoNombre}
                                        onChange={(e) => setSegundoNombre(e.target.value)}
                                        placeholder="Rosa"
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">    
                            {/* Contenedor del Primer Apellido */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="primerApellido">
                                    Primer Apellido
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <input
                                        type="text"
                                        id="primerApellido"
                                        value={primerApellido}
                                        onChange={(e) => setPrimerApellido(e.target.value)}
                                        placeholder="García"
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>

                            {/* Contenedor del Segundo Apellido - Ahora es un hermano directo del anterior */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="segundoApellido">
                                    Segundo Apellido
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <input
                                        type="text"
                                        id="segundoApellido"
                                        value={segundoApellido}
                                        onChange={(e) => setSegundoApellido(e.target.value)}
                                        placeholder="García"
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>
                        </div>
                        {/*AQUI*/}
                        {/* Input Fecha de Nacimiento y Género */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="dateOfBirth">
                                    Fecha de Nacimiento
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">calendar_today</span>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="gender">
                                    Género
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">wc</span>
                                    <select
                                        id="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium outline-none font-body appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecciona tu género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Input Usuario */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="username">
                                Usuario
                            </label>
                            <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">person</span>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="TuUsuario"
                                    required
                                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                />
                            </div>
                        </div>

                        {/* Input Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    required
                                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                />
                            </div>
                        </div>

                        {/* Input País y Teléfono */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="country">
                                    País
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">public</span>
                                    <input
                                        type="text"
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="México"
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="phone">
                                    Teléfono
                                </label>
                                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">phone</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="5512345678"
                                        required
                                        className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label 
                            className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" 
                            htmlFor="stateOfBirth"
                            >
                            Estado de nacimiento
                            </label>
                            
                            <div className="relative">
                            <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors shrink-0">
                                public
                                </span>
                                
                                <select
                                id="stateOfBirth"
                                value={stateOfBirth}
                                onChange={(e) => setStateOfBirth(e.target.value as StateCode)}
                                required
                                className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium appearance-none cursor-pointer outline-none font-body pr-6"
                                >
                                <option value="" disabled>Selecciona un estado</option>
                                {FEDERAL_ENTITIES.map((entity) => (
                                    <option key={entity.code} value={entity.code}>
                                    {entity.name}
                                    </option>
                                ))}
                                </select>
                                
                                <span className="material-symbols-outlined text-outline-variant pointer-events-none absolute right-4">
                                expand_more
                                </span>
                            </div>
                            </div>
                        </div>
                        </div>
                        {/* Input Contraseña */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-body ml-1" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="flex items-center px-4 gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all editorial-shadow group">
                                <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    minLength={8}
                                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none font-body"
                                />
                                <button type="button" className="text-outline hover:text-primary transition-colors focus:outline-none p-1">
                                    <span className="material-symbols-outlined">visibility_off</span>
                                </button>
                            </div>
                        </div>

                        {/* Términos y Condiciones */}
                        <div className="pt-2 text-sm font-body">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="peer w-5 h-5 appearance-none rounded border-2 border-outline-variant checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                                    />
                                    <span className="material-symbols-outlined absolute text-white text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                                </div>
                                <span className="text-on-surface-variant leading-tight group-hover:text-on-background transition-colors">
                                    Acepto los <a href="#" className="font-bold text-primary hover:text-primary-dim">Términos de Servicio</a> y la <a href="#" className="font-bold text-primary hover:text-primary-dim">Política de Privacidad</a>.
                                </span>
                            </label>
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
                                    Creando cuenta...
                                </>
                            ) : (
                                <>
                                    Comenzar a explorar
                                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Separador Visual */}
                    <div className="flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-outline-variant/30"></div>
                        <span className="text-xs font-bold text-outline uppercase tracking-widest font-body">O registrarse con</span>
                        <div className="h-px flex-1 bg-outline-variant/30"></div>
                    </div>

                    {/* Botones Sociales */}
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant/50 rounded-2xl hover:bg-surface-container transition-colors font-bold text-on-background font-body shadow-sm">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
                            Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant/50 rounded-2xl hover:bg-surface-container transition-colors font-bold text-on-background font-body shadow-sm">
                            <span className="material-symbols-outlined text-on-background text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>apple</span>
                            Apple
                        </button>
                    </div>

                    {/* Enlace a Login */}
                    <p className="text-center text-on-surface-variant font-medium font-body pt-4 pb-8">
                        ¿Ya tienes una cuenta?{" "}
                        <Link className="font-bold text-primary hover:text-primary-dim transition-colors border-b-2 border-primary/20 hover:border-primary pb-0.5" to="/login">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}