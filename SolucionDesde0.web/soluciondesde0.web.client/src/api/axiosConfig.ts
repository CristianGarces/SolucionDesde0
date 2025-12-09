import axios from 'axios';
import { config } from '../config/config';

const apiClient = axios.create({
    baseURL: config.gatewayUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Solo manejar token expirado (401) cuando ya estás autenticado
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;

            // Solo redirigir si no estamos en la página de login
            if (currentPath !== '/login') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_info');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;