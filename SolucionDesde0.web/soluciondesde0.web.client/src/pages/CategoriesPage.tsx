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
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../api/categoryService';
import type { CategoryResponse } from '../types/categories';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        fetchCategories();
    }, [isAdmin, navigate]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar categorias';
            setError('Error al cargar las categorias: ' + errorMsg);
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = () => {
        navigate('/categories/create');
    };

    const handleEditCategory = (id: string) => {
        console.log('Editar categoria:', id);
        // navigate(`/categories/edit/${id}`);
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (!window.confirm(`Estas seguro de eliminar la categoria "${name}"?`)) {
            return;
        }

        try {
            await categoryService.deleteCategory(id);
            fetchCategories();
        } catch (err: unknown) {
            console.error('Error deleting category:', err);

            let errorMessage = 'Error al eliminar categoría';

            // Extraer mensaje específico del backend
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as any;
                const responseData = axiosError.response?.data;

                if (responseData?.error) {
                    const backendError = responseData.error;
                    if (backendError.includes('Cannot delete category')) {
                        errorMessage = `No se puede eliminar la categoria porque tiene productos asociados. Elimina primero los productos o cambiales de categoria.`;
                    } else {
                        errorMessage = backendError;
                    }
                }
            }
            alert(errorMessage);
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
                        Gestion de Categorias
                    </Typography>
                    <Typography variant="body1" color="white">
                        {categories.length} categorias registradas
                    </Typography>
                </Box>

                {/* Boton crear categoria */}
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateCategory}
                    sx={{ textTransform: 'none' }}
                >
                    Crear Categoria
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

            {/* Lista de categorias */}
            {!loading && !error && (
                <Box>
                    {categories.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No hay categorias registradas
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                                Crea tu primera categoria usando el boton "Crear Categoria"
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreateCategory}
                            >
                                Crear Primera Categoria
                            </Button>
                        </Paper>
                    ) : (
                         <Grid container spacing={2} rowSpacing={10}>
                            {categories.map((category) => (
                                <Grid item xs={12} md={6} lg={4} key={category.id}>
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {category.name}
                                            </Typography>
                                            <Chip
                                                label={`${category.productCount} productos`}
                                                size="small"
                                                color={category.productCount > 0 ? "primary" : "default"}
                                            />
                                        </Box>

                                        {/* Descripcion */}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 3,
                                                flexGrow: 1,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {category.description || 'Sin descripcion'}
                                        </Typography>

                                        {/* Footer con botones */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', width: '100%' }}>
                                            <Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditCategory(category.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteCategory(category.id, category.name)}
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

export default CategoriesPage;