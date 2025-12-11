import apiClient from './axiosConfig';
import type {
    CategoryResponse,
    CategorySimpleResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest
} from '../types/categories';

export const categoryService = {
    // Obtener todas las categorías
    getAllCategories: async (): Promise<CategoryResponse[]> => {
        const response = await apiClient.get<CategoryResponse[]>('/api/v1/categories');
        return response.data;
    },

    // Obtener categoría por ID
    getCategoryById: async (id: string): Promise<CategoryResponse> => {
        const response = await apiClient.get<CategoryResponse>(`/api/v1/categories/${id}`);
        return response.data;
    },

    // Crear categoría (solo Admin)
    createCategory: async (categoryData: CreateCategoryRequest): Promise<CategorySimpleResponse> => {
        const response = await apiClient.post<CategorySimpleResponse>('/api/v1/categories', categoryData);
        return response.data;
    },

    // Actualizar categoría (solo Admin)
    updateCategory: async (id: string, categoryData: UpdateCategoryRequest): Promise<CategorySimpleResponse> => {
        const response = await apiClient.put<CategorySimpleResponse>(`/api/v1/categories/${id}`, categoryData);
        return response.data;
    },

    // Eliminar categoría (solo Admin)
    deleteCategory: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/categories/${id}`);
    }
};