export interface UserResponse {
    id: string;
    name: string;
    email: string;
    roleId: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    roleId: string;
}

export interface UpdateUserRequest {
    name: string;
    email: string;
    roleId?: string;
}

export interface CrudUserResponse {
    success: boolean;
    errors?: string[];
}