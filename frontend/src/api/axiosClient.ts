import axios from 'axios';
import type { ApiResponse } from '@/types';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// ── Interceptor de request: agregar token JWT ──
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('epayco_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Interceptor de respuesta ──
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const apiResponse: ApiResponse = {
            success: false,
            cod: error.response?.status || 500,
            message:
                error.response?.data?.message ||
                error.message ||
                'Error de conexión con el servidor',
            data: null,
        };

        // Si 401, limpiar sesión
        if (error.response?.status === 401) {
            localStorage.removeItem('epayco_token');
            localStorage.removeItem('epayco_cliente');
        }

        return Promise.reject(apiResponse);
    }
);

export default axiosClient;
