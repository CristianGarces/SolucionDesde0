import { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { categoryService } from '../api/categoryService';
import type { CreateCategoryRequest } from '../types/categories';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState<CreateCategoryRequest>({
        name: '',
        description: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Verificar si es admin
    const isAdmin = user?.role === 'Admin';

    // Redirigir si no es admin
    if (!isAdmin) {
        navigate('/');
        return null;
    }

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
        field: keyof CreateCategoryRequest,
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

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await categoryService.createCategory(formData);

            setSuccess(true);

            setTimeout(() => {
                navigate('/categories');
            }, 2000);

        } catch (err: unknown) {
            console.error('Error creating category:', err);

            const errorData = err as { response?: { data?: { error?: string } } };

            if (errorData.response?.data?.error?.includes('already exists')) {
                setError(`Ya existe una categoria con el nombre "${formData.name}".`);
            } else {
                setError('Error al crear la categoría.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/categories');
    };

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
                    Crear Nueva Categoria
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Categoria creada exitosamente! Redirigiendo a la lista de categorias...
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
                            label="Descripcion *"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            error={!!formErrors.description}
                            helperText={formErrors.description || 'Descripcion detallada de la categoria'}
                            disabled={submitting || success}
                        />

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
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Categoria'
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

export default CreateCategoryPage;