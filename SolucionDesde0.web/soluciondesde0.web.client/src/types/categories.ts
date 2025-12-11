export interface CategoryResponse {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

export interface CategorySimpleResponse {
    id: string;
    name: string;
    description: string;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateCategoryRequest {
    name: string;
    description: string;
}