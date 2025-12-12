import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Alert,
    CircularProgress,
    Paper
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { categoryService } from '../../api/categoryService';
import type { CategoryResponse, UpdateCategoryRequest } from '../../types/categories';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const EditCategoryPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [category, setCategory] = useState<CategoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState<UpdateCategoryRequest>({
        name: '',
        description: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Verificar si es admin
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        // Redirigir si no es admin
        if (!isAdmin) {
            navigate('/');
            return;
        }

        if (id) {
            fetchCategory(id);
        }
    }, [isAdmin, navigate, id]);

    const fetchCategory = async (categoryId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await categoryService.getCategoryById(categoryId);
            setCategory(data);
            setFormData({
                name: data.name,
                description: data.description
            });
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar la categoria';
            setError('Error al cargar la categoria: ' + errorMsg);
            console.error('Error fetching category:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validacion del nombre
        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'El nombre debe tener al menos 3 caracteres';
        } else if (formData.name.trim().length > 100) {
            errors.name = 'El nombre no puede exceder los 100 caracteres';
        }

        // Validacion de la descripcion
        if (formData.description.trim().length > 500) {
            errors.description = 'La descripcion no puede exceder los 500 caracteres';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof UpdateCategoryRequest,
        value: string
    ) => {
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

            await categoryService.updateCategory(id, formData);

            setSuccess(true);

            // Redirigir despues de 2 segundos
            setTimeout(() => {
                navigate('/categories');
            }, 2000);

        } catch (err: unknown) {
            console.error('Error updating category:', err);

            let errorMessage = 'Error al actualizar la categoría';

            // Extraer mensaje específico del backend 
            if (err && typeof err === 'object' && 'response' in err) {
                const errorObj = err as { response?: { data?: { error?: string } } };

                if (errorObj.response?.data?.error) {
                    const backendError = errorObj.response.data.error;
                    if (backendError.includes('already exists')) {
                        errorMessage = `Ya existe una categoria con el nombre "${formData.name}".`;
                    } else {
                        errorMessage = backendError;
                    }
                }
            }

            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/categories');
    };

    // Si no es admin, no mostrar nada (ya se redirige)
    if (!isAdmin) {
        return null;
    }

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando categoria...</Typography>
            </Container>
        );
    }

    if (error && !category) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/categories')}
                    sx={{ mb: 3 }}
                >
                    Volver a Categorias
                </Button>

                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    onClick={() => navigate('/categories')}
                >
                    Volver al listado
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Boton volver */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/categories')}
                sx={{ mb: 3 }}
            >
                Volver a Categorias
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Editar Categoria: {category?.name}
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        ¡Categoria actualizada exitosamente! Redirigiendo a la lista de categorias...
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
                            label="Nombre de la categoria *"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            error={!!formErrors.name}
                            helperText={formErrors.name || 'Nombre unico para la categoria'}
                            disabled={submitting || success}
                        />

                        {/* Descripcion */}
                        <TextField
                            label="Descripcion"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            error={!!formErrors.description}
                            helperText={formErrors.description || 'Descripcion detallada de la categoria'}
                            disabled={submitting || success}
                        />

                        {/* Informacion adicional */}
                        {category && (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>ID:</strong> {category.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Productos asociados:</strong> {category.productCount}
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
                                disabled={submitting || success}
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

export default EditCategoryPage;