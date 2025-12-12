export enum OrderStatus {
    Pending = 0,
    Confirmed = 1,
    Processing = 2,
    Shipped = 3,
    Delivered = 4,
    Cancelled = 5
}

export interface OrderResponse {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    shippingAddress?: string;
    shippingCity?: string;
    notes?: string;
    createdAt: string;
    items: OrderItemResponse[];
}

export interface OrderListResponse {
    id: string;
    status: string;
    totalAmount: number;
    itemCount: number;
    createdAt: string;
}

export interface OrderItemResponse {
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

// Para mapear status a nombres en español
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'Pendiente',
    [OrderStatus.Confirmed]: 'Confirmado',
    [OrderStatus.Processing]: 'En Proceso',
    [OrderStatus.Shipped]: 'Enviado',
    [OrderStatus.Delivered]: 'Entregado',
    [OrderStatus.Cancelled]: 'Cancelado'
};

// Para mapear status a colores MUI
export const ORDER_STATUS_COLORS: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    [OrderStatus.Pending]: 'warning',
    [OrderStatus.Confirmed]: 'info',
    [OrderStatus.Processing]: 'primary',
    [OrderStatus.Shipped]: 'secondary',
    [OrderStatus.Delivered]: 'success',
    [OrderStatus.Cancelled]: 'error'
};

// Función para formatear fecha
export const formatOrderDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
};

// Función para obtener el color según el string de status
export const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
        'Pending': 'warning',
        'Confirmed': 'info',
        'Processing': 'primary',
        'Shipped': 'secondary',
        'Delivered': 'success',
        'Cancelled': 'error'
    };
    return statusMap[status] || 'default';
};

// Función para obtener label en español según el string de status
export const getStatusLabel = (status: string): string => {
    const labelMap: Record<string, string> = {
        'Pending': 'Pendiente',
        'Confirmed': 'Confirmado',
        'Processing': 'En Proceso',
        'Shipped': 'Enviado',
        'Delivered': 'Entregado',
        'Cancelled': 'Cancelado'
    };
    return labelMap[status] || status;
};