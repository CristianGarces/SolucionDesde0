import type { RoleResponse } from '../types/role';
import apiClient from './axiosConfig';

export const roleService = {
    getAllRoles: async (): Promise<RoleResponse[]> => {
        const response = await apiClient.get<RoleResponse[]>('/api/v1/roles');
        return response.data;
    },
};