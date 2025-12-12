import apiClient from './axiosConfig';
import type {
    OrderResponse,
    OrderListResponse,
    UpdateOrderStatusRequest,
    OrderStatus
} from '../types/order';

export const orderService = {
    // Obtener todos los pedidos (solo Admin)
    getAllOrders: async (): Promise<OrderListResponse[]> => {
        const response = await apiClient.get<OrderListResponse[]>('/api/v1/orders');
        return response.data;
    },

    // Obtener pedidos del usuario actual
    getUserOrders: async (): Promise<OrderListResponse[]> => {
        const response = await apiClient.get<OrderListResponse[]>('/api/v1/orders/my-orders');
        return response.data;
    },

    // Obtener pedido por ID (admin o usuario dueño)
    getOrderById: async (id: string): Promise<OrderResponse> => {
        const response = await apiClient.get<OrderResponse>(`/api/v1/orders/${id}`);
        return response.data;
    },

    // Obtener pedido por ID (solo Admin - más datos)
    getOrderByIdForAdmin: async (id: string): Promise<OrderResponse> => {
        const response = await apiClient.get<OrderResponse>(`/api/v1/orders/admin/${id}`);
        return response.data;
    },

    // Actualizar estado del pedido (solo Admin)
    updateOrderStatus: async (id: string, status: OrderStatus): Promise<void> => {
        const request: UpdateOrderStatusRequest = { status };
        await apiClient.put(`/api/v1/orders/${id}/status`, request);
    },

    // Cancelar pedido (usuario dueño)
    cancelOrder: async (id: string): Promise<void> => {
        await apiClient.put(`/api/v1/orders/${id}/cancel`);
    }
};