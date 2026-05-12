import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================================================
// SUCURSALES / ESTABLECIMIENTOS
// =====================================================

export interface Sucursal {
  id: number;
  nombreSucursal: string;
  ubicacion: string;
  tipoEstablecimientoId: number;
  tipoEstablecimiento: string;
}

export const getAllSucursales = async (): Promise<Sucursal[]> => {
  const response = await api.get('/sucursales');
  return response.data;
};

export const getSucursalById = async (id: number): Promise<Sucursal | null> => {
  try {
    const response = await api.get(`/sucursales/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getSucursalesByTipo = async (tipoId: number): Promise<Sucursal[]> => {
  const response = await api.get(`/sucursales/tipo/${tipoId}`);
  return response.data;
};

// =====================================================
// FUNCIONES (Eventos/Shows)
// =====================================================

export interface Funcion {
  id: number;
  nombreFuncion: string;
  horario: string;
  fecha: string;
  clasificacion: string;
  idSala: number;
  nombreSala: string;
  idEstablecimiento: number;
  nombreEstablecimiento: string;
  precio: number;
  tipoEstablecimiento: string;
}

export const getAllFunciones = async (): Promise<Funcion[]> => {
  const response = await api.get('/funciones');
  return response.data;
};

export const getFuncionById = async (id: number): Promise<Funcion | null> => {
  try {
    const response = await api.get(`/funciones/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getFuncionesBySala = async (salaId: number): Promise<Funcion[]> => {
  const response = await api.get(`/funciones/sala/${salaId}`);
  return response.data;
};

// =====================================================
// SALAS
// =====================================================

export interface Sala {
  id: number;
  tipoSala: string;
  precio: number;
  nombreSala: string;
  capacidad: number;
  idEstablecimiento: number;
  nombreEstablecimiento: string;
}

export const getAllSalas = async (): Promise<Sala[]> => {
  const response = await api.get('/salas');
  return response.data;
};

export const getSalaById = async (id: number): Promise<Sala | null> => {
  try {
    const response = await api.get(`/salas/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getSalasByEstablecimiento = async (establecimientoId: number): Promise<Sala[]> => {
  const response = await api.get(`/salas/establecimiento/${establecimientoId}`);
  return response.data;
};

// =====================================================
// ASIENTOS
// =====================================================

export interface Asiento {
  id: number;
  fila: string;
  numeroAsiento: number;
  idSala: {
    id: number;
  };
}

export const getAsientosForFunction = async (funcionId: number): Promise<Asiento[]> => {
  const response = await api.get(`/funciones/${funcionId}/asientos`);
  return response.data;
};

export const getAsientosDisponibles = async (funcionId: number): Promise<Asiento[]> => {
  const response = await api.get(`/funciones/${funcionId}/asientos-disponibles`);
  return response.data;
};

export const getAsientosOcupados = async (funcionId: number): Promise<string[]> => {
  const response = await api.get(`/funciones/${funcionId}/asientos-ocupados`);
  return response.data;
};

// =====================================================
// TIPOS DE ESTABLECIMIENTO
// =====================================================

export interface TipoEstablecimiento {
  id: number;
  tipo: string;
}

export const getAllTiposEstablecimiento = async (): Promise<TipoEstablecimiento[]> => {
  const response = await api.get('/tipos-establecimiento');
  return response.data;
};

// =====================================================
// CHECKOUT Y COMPRA
// =====================================================

export interface CheckoutRequest {
  funcionId: number;
  cantidadBoletos: number;
  asientos?: string[];
  monto: number;
  metodoPago: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  confirmationNumber: string;
  ticketId: number;
  transactionId: number;
  qrCode: string;
  emailSent: boolean;
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

export interface TransactionDetail {
  id: number;
  confirmationNumber: string;
  estado: string;
  monto: number;
  metodoPago: string;
  fecha: string;
  qrCode: string;
  ticket: {
    id: number;
    tipoEvento: string;
    ubicacion: string;
    fecha: string;
    cantidadBoletos: number;
    asientos: string[];
    fechaCompra: string;
  };
}

export const getTicketDetails = async (ticketId: number): Promise<TransactionDetail | null> => {
  try {
    const response = await api.get(`/checkout/ticket/${ticketId}`);
    return response.data;
  } catch {
    return null;
  }
};

export interface MyTicket {
  idTicket: number;
  asientos: string[];
  fecha: string;
  nombreFuncion: string;
  ubicacion: string;
  clasificacion: string;
  numeroConfirmacion: string;
  monto: number;
  metodoPago: string;
  codigoQR: string;
  estado: string;
}

export const getMyTickets = async (): Promise<MyTicket[]> => {
  try {
    const response = await api.get('/checkout/my-tickets');
    return response.data;
  } catch {
    return [];
  }
};

export const resendEmailConfirmation = async (
  ticketId: number
): Promise<any> => {
  const response = await api.post(
    `/checkout/resend-email/${ticketId}`
  );
  return response.data;
};

// =====================================================
// AUTENTICACIÓN
// =====================================================

export const login = async (usernameOrCurp: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await api.post('/auth/login', {
      usernameOrCurp,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    throw new Error(
      axiosError.response?.data?.message || 'Error al iniciar sesión'
    );
  }
};

export interface RegisterData {
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

export const register = async (data: RegisterData): Promise<{ token: string }> => {
  try {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('jwt_token', response.data.token);
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
