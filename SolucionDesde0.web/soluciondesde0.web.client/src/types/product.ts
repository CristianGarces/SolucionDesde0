export interface ProductResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    categoryName: string;
    createdByUserId: string;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
}

export interface UpdateProductRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
}