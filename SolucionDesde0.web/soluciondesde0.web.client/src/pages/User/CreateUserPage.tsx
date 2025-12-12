import { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../api/userService';
import { roleService } from '../../api/roleService';
import type { RoleResponse } from '../../types/role';
import type { CreateUserRequest } from '../../types/user';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState<CreateUserRequest>({
        name: '',
        email: '',
        password: '',
        roleId: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Verificar si es admin
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        fetchRoles();
    }, [isAdmin, navigate]);

    const fetchRoles = async () => {
        try {
            setLoadingRoles(true);
            const data = await roleService.getAllRoles();
            setRoles(data);

            // Seleccionar primer rol por defecto si existe (Member)
            if (data.length > 0 && !formData.roleId) {
                const memberRole = data.find(role => role.name === 'Member');
                const defaultRoleId = memberRole?.id || data[0].id;
                setFormData(prev => ({
                    ...prev,
                    roleId: defaultRoleId
                }));
            }
        } catch (err: unknown) {
            console.error('Error loading roles:', err);
            setError('Error al cargar los roles disponibles');
        } finally {
            setLoadingRoles(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'El nombre debe tener al menos 2 caracteres';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'El email no tiene un formato valido';
        }

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            errors.password = passwordErrors.join(', ');
        }

        if (!formData.roleId) {
            errors.roleId = 'Debe seleccionar un rol';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];

        if (!password) {
            errors.push('La contrasena es requerida');
            return errors;
        }

        if (password.length < 8) {
            errors.push('La contrasena debe tener al menos 8 caracteres');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('La contrasena debe contener al menos una letra mayuscula');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('La contrasena debe contener al menos una letra minuscula');
        }

        if (!/[0-9]/.test(password)) {
            errors.push('La contrasena debe contener al menos un digito');
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            errors.push('La contrasena debe contener al menos un caracter especial');
        }

        return errors;
    };

    const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const result = await userService.createUser(formData);

            if (result.success) {
                setSuccess(true);

                setTimeout(() => {
                    navigate('/users');
                }, 2000);
            } else {
                setError(result.errors?.join(', ') || 'Error al crear el usuario');
            }

        } catch (err: unknown) {
            console.error('Error creating user:', err);

            let errorMessage = 'Error al crear el usuario';

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

    if (!isAdmin) {
        navigate('/');
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/users')}
                sx={{ mb: 3 }}
            >
                Volver a Usuarios
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Crear Nuevo Usuario
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Usuario creado exitosamente! Redirigiendo a la lista de usuarios...
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

                        {/* Contrasena */}
                        <TextField
                            label="Contrasena *"
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            error={!!formErrors.password}
                            helperText={formErrors.password || 'Minimo 8 caracteres'}
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
                        </FormControl>

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
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Usuario'
                                )}
                            </Button>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                            * Campos requeridos
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateUserPage;