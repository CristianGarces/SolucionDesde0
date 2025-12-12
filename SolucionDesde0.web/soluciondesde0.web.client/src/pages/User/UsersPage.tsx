import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Grid,
    Paper,
    Chip,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../api/userService';
import type { UserResponse } from '../../types/user';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';

const UsersPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = currentUser?.role === 'Admin';

    useEffect(() => {
        // Redirigir si no es admin
        if (!isAdmin) {
            navigate('/');
            return;
        }

        fetchUsers();
    }, [isAdmin, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getAllUsers();

            // Filtrar el usuario actual (el que esta logueado)
            const filteredUsers = data.filter(user => user.id !== currentUser?.id);
            setUsers(filteredUsers);

        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar usuarios';
            setError('Error al cargar los usuarios: ' + errorMsg);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        navigate('/users/create');
    };

    const handleEditUser = (id: string) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!window.confirm(`Estas seguro de eliminar al usuario "${name}"?`)) {
            return;
        }

        try {
            const result = await userService.deleteUser(id);

            if (result.success) {
                alert(`Usuario "${name}" eliminado exitosamente`);
                fetchUsers(); 
            } else {
                alert(`Error al eliminar usuario: ${result.errors?.join(', ')}`);
            }
        } catch (err: unknown) {
            console.error('Error deleting user:', err);

            let errorMessage = 'Error al eliminar el usuario';
            if (err && typeof err === 'object' && 'response' in err) {
                const errorObj = err as { response?: { data?: { errors?: string[] } } };
                if (errorObj.response?.data?.errors) {
                    errorMessage = errorObj.response.data.errors.join(', ');
                }
            }

            alert(errorMessage);
        }
    };

    // Funcion para obtener color segun el rol
    const getRoleColor = (roleId: string) => {
        switch (roleId.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'member':
                return 'primary';
            default:
                return 'default';
        }
    };

    // Funcion para mostrar nombre del rol
    const getRoleName = (roleId: string) => {
        switch (roleId.toLowerCase()) {
            case 'admin':
                return 'Administrador';
            case 'member':
                return 'Miembro';
            default:
                return roleId;
        }
    };

    // Si no es admin, no mostrar nada (ya se redirige)
    if (!isAdmin) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                        Gestion de Usuarios
                    </Typography>
                    <Typography variant="body1" color="white">
                        {users.length} usuarios registrados (excluyendote a ti)
                    </Typography>
                </Box>

                {/* Boton crear usuario */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateUser}
                    sx={{ textTransform: 'none' }}
                >
                    Crear Usuario
                </Button>
            </Box>

            {/* Error message */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Lista de usuarios */}
            {!loading && !error && (
                <Box>
                    {users.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No hay otros usuarios registrados
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                                Crea un nuevo usuario usando el boton "Crear Usuario"
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreateUser}
                            >
                                Crear Primer Usuario
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={2} rowSpacing={10}>
                            {users.map((user) => (
                                <Grid item xs={12} md={6} lg={4} key={user.id}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 4
                                            }
                                        }}
                                    >
                                        {/* Header de la tarjeta */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {user.name}
                                            </Typography>
                                        </Box>

                                        {/* Email */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </Box>

                                        {/* Rol */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <ShieldIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Chip
                                                label={getRoleName(user.roleId)}
                                                size="small"
                                                color={getRoleColor(user.roleId)}
                                                variant="outlined"
                                            />
                                        </Box>

                                        {/* Footer con ID y botones */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {user.id.substring(0, 8)}...
                                            </Typography>

                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditUser(user.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default UsersPage;