import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// SERVICIOS DE EVENTOS
// =====================================================

export interface Evento {
  id: string;
  titulo: string;
  srcImg: string;
  precio: number;
  lugar: string;
  categoria: string;
  descripcion?: string;
  fecha?: string;
  duracion?: string;
}

export const getEventosByCategorias = async (categoria: string): Promise<Evento[]> => {
  try {
    const response = await api.get(`/eventos/categoria/${categoria}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo eventos de ${categoria}:`, error);
    return [];
  }
};

export const getEventoById = async (id: string): Promise<Evento | null> => {
  try {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo evento ${id}:`, error);
    return null;
  }
};

export const getAllEventos = async (): Promise<Evento[]> => {
  try {
    const response = await api.get('/eventos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return [];
  }
};

// =====================================================
// SERVICIOS DE CHECKOUT Y COMPRA
// =====================================================

export interface CheckoutRequest {
  tipoEvento: string;
  ubicacion: string;
  fecha: string; // ISO format: yyyy-MM-ddTHH:mm:ss
  cantidadBoletos: number;
  asientos?: string[];
  monto: number;
  metodoPago: 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'PAYPAL';
  phoneNumber: string; // Con código de país: +521234567890
  eventId?: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  confirmationNumber: string;
  ticketId: number;
  transactionId: number;
  qrCode: string; // Base64
  whatsAppSent: boolean;
}

export const processPurchase = async (data: CheckoutRequest): Promise<PurchaseResponse> => {
  try {
    const response = await api.post('/checkout/process', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw new Error(
      axiosError.response?.data?.message || 'Error procesando la compra'
    );
  }
};

export const getTicketDetails = async (ticketId: number) => {
  try {
    const response = await api.get(`/checkout/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo detalles del ticket:', error);
    return null;
  }
};

export const getMyTickets = async () => {
  try {
    const response = await api.get('/checkout/my-tickets');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo mis tickets:', error);
    return [];
  }
};

export const resendWhatsAppConfirmation = async (
  ticketId: number,
  phoneNumber: string
): Promise<any> => {
  try {
    const response = await api.post(
      `/checkout/resend-whatsapp/${ticketId}`,
      { phoneNumber }
    );
    return response.data;
  } catch (error) {
    console.error('Error reenviando confirmación:', error);
    throw error;
  }
};

// =====================================================
// SERVICIOS DE AUTENTICACIÓN
// =====================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
  };
}

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw new Error(
      axiosError.response?.data?.message || 'Error al iniciar sesión'
    );
  }
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw new Error(
      axiosError.response?.data?.message || 'Error al registrarse'
    );
  }
};

export default api;