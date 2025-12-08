import apiClient from './axiosConfig';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

export const authService = {
    // Login
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/api/v1/Auth/login', credentials);

        // Guardar token en localStorage
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            // También podemos guardar información del usuario del token
            try {
                const payload = JSON.parse(atob(response.data.token.split('.')[1]));
                localStorage.setItem('user_info', JSON.stringify({
                    id: payload.sub,
                    name: payload.name,
                    email: payload.email,
                    role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                }));
            } catch (error) {
                console.warn('Error parsing token:', error);
            }
        }

        return response.data;
    },

    // Register
    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>('/api/v1/Auth/register', userData);
        return response.data;
    },

    // Logout
    logout: (): void => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
    },

    // Verificar si está autenticado
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;

        try {
            // Verificar si el token no ha expirado
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    // Obtener información del usuario
    getUserInfo: () => {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    // Obtener token
    getToken: (): string | null => {
        return localStorage.getItem('auth_token');
    }
};