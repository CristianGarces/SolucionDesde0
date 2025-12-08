export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    succeeded: boolean;
    errors: string[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiration: string;
}

export interface UserInfo {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
}