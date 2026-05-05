import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

// ---------- Types ----------
interface AuthUser {
    username: string;
}

interface RegisterData {
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

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

// ---------- Backend base URL ----------
// Adjust this if your backend runs on a different host/port.
const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// ---------- Context ----------
const AuthContext = createContext<AuthContextType | null>(null);

// ---------- Provider ----------
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("jwt_token")
    );

    const user = token ? { username: parseUsername(token) } : null;
    const isAuthenticated = token !== null;

    // Attach token to every axios request when present
    useEffect(() => {
        const id = api.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        return () => {
            api.interceptors.request.eject(id);
        };
    }, [token]);

    const login = async (username: string, password: string) => {
        const { data } = await api.post<{ token: string }>("/auth/login", {
            usernameOrCurp: username,
            password,
        });
        setToken(data.token);
        localStorage.setItem("jwt_token", data.token);
    };

    const register = async (data: RegisterData) => {
        const { data: response } = await api.post<{ token: string }>("/auth/register", data);
        setToken(response.token);
        localStorage.setItem("jwt_token", response.token);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("jwt_token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

// ---------- Hook ----------
export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
}

// ---------- Helpers ----------
function parseUsername(token: string): string {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub ?? "unknown";
    } catch {
        return "unknown";
    }
}

// Export the configured axios instance and types for use in other services/components
export { api };
export type { RegisterData };
