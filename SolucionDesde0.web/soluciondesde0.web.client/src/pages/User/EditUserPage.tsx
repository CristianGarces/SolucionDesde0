import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../api/userService';
import { roleService } from '../../api/roleService';
import type { UserResponse, UpdateUserRequest } from '../../types/user';
import type { RoleResponse } from '../../types/role';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const EditUserPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [user, setUser] = useState<UserResponse | null>(null);
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState<UpdateUserRequest>({
        name: '',
        email: '',
        roleId: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Verificar si es admin
    const isAdmin = currentUser?.role === 'Admin';

    useEffect(() => {
        // Redirigir si no es admin
        if (!isAdmin) {
            navigate('/users');
            return;
        }

        if (id) {
            fetchUser(id);
            fetchRoles();
        }
    }, [isAdmin, navigate, id]);

    const fetchUser = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getUserById(userId);
            setUser(data);
            setFormData({
                name: data.name,
                email: data.email,
                roleId: data.roleId // Este es el ID del rol (GUID)
            });
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar el usuario';
            setError('Error al cargar el usuario: ' + errorMsg);
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            setLoadingRoles(true);
            const data = await roleService.getAllRoles();
            setRoles(data);
        } catch (err: unknown) {
            console.error('Error loading roles:', err);
            // No mostramos error aqui para no interrumpir la edicion
        } finally {
            setLoadingRoles(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validacion del nombre
        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'El nombre debe tener al menos 2 caracteres';
        }

        // Validacion del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'El email no tiene un formato valido';
        }

        // Validacion del rol
        if (!formData.roleId) {
            errors.roleId = 'Debe seleccionar un rol';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar error
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !id) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            // Crear objeto de actualizacion
            const updateData: UpdateUserRequest = {
                name: formData.name,
                email: formData.email,
                roleId: formData.roleId
            };

            const result = await userService.updateUser(id, updateData);

            if (result.success) {
                setSuccess(true);

                // Redirigir despues de 2 segundos
                setTimeout(() => {
                    navigate('/users');
                }, 2000);
            } else {
                setError(result.errors?.join(', ') || 'Error al actualizar el usuario');
            }

        } catch (err: unknown) {
            console.error('Error updating user:', err);

            let errorMessage = 'Error al actualizar el usuario';

            // Extraer mensaje especifico del backend
            if (err && typeof err === 'object' && 'response' in err) {
                const errorObj = err as { response?: { data?: { errors?: string[] } } };

                if (errorObj.response?.data?.errors) {
                    errorMessage = errorObj.response.data.errors.join(', ');
                }
            }

            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    // Si no es admin, redirigir
    if (!isAdmin) {
        navigate('/users');
        return null;
    }

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando usuario...</Typography>
            </Container>
        );
    }

    if (error && !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/users')}
                    sx={{ mb: 3 }}
                >
                    Volver a Usuarios
                </Button>

                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    onClick={() => navigate('/users')}
                >
                    Volver al listado
                </Button>
            </Container>
        );
    }

    // Funcion para obtener el nombre del rol por su ID
    const getRoleNameById = (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        if (!role) return 'Cargando...';

        return role.name === 'Member' ? 'Miembro' :
            role.name === 'Admin' ? 'Administrador' : role.name;
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Boton volver */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/users')}
                sx={{ mb: 3 }}
            >
                Volver a Usuarios
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Editar Usuario: {user?.name}
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Usuario actualizado exitosamente! Redirigiendo a la lista de usuarios...
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Nombre */}
                        <TextField
                            label="Nombre completo *"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            error={!!formErrors.name}
                            helperText={formErrors.name || 'Nombre del usuario'}
                            disabled={submitting || success}
                        />

                        {/* Email */}
                        <TextField
                            label="Email *"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={!!formErrors.email}
                            helperText={formErrors.email || 'Correo electronico del usuario'}
                            disabled={submitting || success}
                        />

                        {/* Rol */}
                        <FormControl fullWidth error={!!formErrors.roleId} disabled={submitting || success || loadingRoles}>
                            <InputLabel>Rol *</InputLabel>
                            <Select
                                value={formData.roleId}
                                label="Rol *"
                                onChange={(e) => handleInputChange('roleId', e.target.value)}
                            >
                                {loadingRoles ? (
                                    <MenuItem value="">
                                        <em>Cargando roles...</em>
                                    </MenuItem>
                                ) : roles.length === 0 ? (
                                    <MenuItem value="" disabled>
                                        No hay roles disponibles
                                    </MenuItem>
                                ) : (
                                    roles.map((role) => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name === 'Member' ? 'Miembro' :
                                                role.name === 'Admin' ? 'Administrador' : role.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {formErrors.roleId && (
                                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                    {formErrors.roleId}
                                </Typography>
                            )}
                            {!formErrors.roleId && !loadingRoles && user && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2, mt: 0.5 }}>
                                    Rol actual: {getRoleNameById(user.roleId)}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Informacion adicional */}
                        {user && (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>ID del usuario:</strong> {user.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Email original:</strong> {user.email}
                                </Typography>
                            </Box>
                        )}

                        {/* Botones */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={submitting || success}
                                sx={{ minWidth: 120 }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                startIcon={<SaveIcon />}
                                disabled={submitting || success || loadingRoles || roles.length === 0}
                                sx={{ minWidth: 150 }}
                            >
                                {submitting ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </Button>
                        </Box>

                        {/* Nota */}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                            * Campos requeridos
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditUserPage;