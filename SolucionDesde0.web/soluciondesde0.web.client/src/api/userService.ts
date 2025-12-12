import apiClient from './axiosConfig';
import type {
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
    CrudUserResponse
} from '../types/user';

export const userService = {
    // Obtener todos los usuarios (solo Admin)
    getAllUsers: async (): Promise<UserResponse[]> => {
        const response = await apiClient.get<UserResponse[]>('/api/v1/usermanagement');
        return response.data;
    },

    // Obtener usuario por ID (solo Admin)
    getUserById: async (id: string): Promise<UserResponse> => {
        const response = await apiClient.get<UserResponse>(`/api/v1/usermanagement/${id}`);
        return response.data;
    },

    // Crear usuario (solo Admin)
    createUser: async (userData: CreateUserRequest): Promise<CrudUserResponse> => {
        const response = await apiClient.post<CrudUserResponse>('/api/v1/usermanagement', userData);
        return response.data;
    },

    // Actualizar usuario (solo Admin)
    updateUser: async (id: string, userData: UpdateUserRequest): Promise<CrudUserResponse> => {
        const response = await apiClient.put<CrudUserResponse>(`/api/v1/usermanagement/${id}`, userData);
        return response.data;
    },

    // Eliminar usuario (solo Admin)
    deleteUser: async (id: string): Promise<CrudUserResponse> => {
        const response = await apiClient.delete<CrudUserResponse>(`/api/v1/usermanagement/${id}`);
        return response.data;
    }
};