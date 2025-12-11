import apiClient from './axiosConfig';
import type { ProductResponse, CreateProductRequest, UpdateProductRequest } from '../types/product';

export const productService = {
    // Obtener todos los productos
    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await apiClient.get<ProductResponse[]>('/api/v1/products');
        return response.data;
    },

    // Obtener producto por ID
    getProductById: async (id: string): Promise<ProductResponse> => {
        const response = await apiClient.get<ProductResponse>(`/api/v1/products/${id}`);
        return response.data;
    },

    // Crear producto (solo Admin)
    createProduct: async (productData: CreateProductRequest): Promise<ProductResponse> => {
        const response = await apiClient.post<ProductResponse>('/api/v1/products', productData);
        return response.data;
    },

    // Actualizar producto (solo Admin)
    updateProduct: async (id: string, productData: UpdateProductRequest): Promise<ProductResponse> => {
        const response = await apiClient.put<ProductResponse>(`/api/v1/products/${id}`, productData);
        return response.data;
    },

    // Eliminar producto (solo Admin)
    deleteProduct: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/v1/products/${id}`);
    }
};