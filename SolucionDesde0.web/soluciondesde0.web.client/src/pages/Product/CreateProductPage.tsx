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
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import type { CategoryResponse } from '../../types/categories';
import type { CreateProductRequest } from '../../types/product';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { AxiosError } from 'axios';

// Helper function para manejar errores de forma segura
const getErrorMessage = (error: unknown, defaultMessage: string = 'Error desconocido'): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message || defaultMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') return error;
    return defaultMessage;
};

const CreateProductPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState<CreateProductRequest>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryId: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Verificar si es admin
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        // Redirigir si no es admin
        if (!isAdmin) {
            navigate('/products');
            return;
        }

        fetchCategories();
    }, [isAdmin, navigate]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);

            // Seleccionar primera categoria por defecto si existe
            if (data.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    categoryId: data[0].id
                }));
            }
        } catch (err: unknown) {
            const errorMsg = getErrorMessage(err, 'Error desconocido al cargar categorias');
            setError('Error al cargar categorias: ' + errorMsg);
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'El nombre debe tener al menos 3 caracteres';
        } else if (formData.name.trim().length > 200) {
            errors.name = 'El nombre no puede exceder los 200 caracteres';
        }

        if (!formData.description.trim()) {
            errors.description = 'La descripcion es requerida';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'La descripcion debe tener al menos 10 caracteres';
        } else if (formData.description.trim().length > 1000) {
            errors.description = 'La descripcion no puede exceder los 1000 caracteres';
        }

        if (formData.price <= 0) {
            errors.price = 'El precio debe ser mayor a 0';
        }

        if (formData.stock < 0) {
            errors.stock = 'El stock no puede ser negativo';
        }

        if (!formData.categoryId) {
            errors.categoryId = 'Debe seleccionar una categoria';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof CreateProductRequest,
        value: string | number
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

            // Convertir price y stock a numeros
            const productData = {
                ...formData,
                price: parseFloat(formData.price.toString()),
                stock: parseInt(formData.stock.toString())
            };

            await productService.createProduct(productData);

            setSuccess(true);

            // Redirigir despues de 2 segundos
            setTimeout(() => {
                navigate('/products');
            }, 2000);

        } catch (err: unknown) {
            console.error('Error creating product:', err);
            const errorMsg = getErrorMessage(err, 'Error desconocido al crear el producto');
            setError('Error al crear el producto: ' + errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/products');
    };

    // Si no es admin, no mostrar nada (ya se redirige)
    if (!isAdmin) {
        return null;
    }

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Boton volver */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/products')}
                sx={{ mb: 3 }}
            >
                Volver a Productos
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Crear Nuevo Producto
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Producto creado exitosamente! Redirigiendo a la lista de productos...
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
                            label="Nombre del producto *"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            error={!!formErrors.name}
                            helperText={formErrors.name || 'Nombre del producto'}
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
                            helperText={formErrors.description || 'Descripcion detallada del producto'}
                            disabled={submitting || success}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Precio - convertir string a numero */}
                            <TextField
                                label="Precio (€) *"
                                type="number"
                                fullWidth
                                value={formData.price}
                                onChange={(e) => {
                                    const numValue = parseFloat(e.target.value) || 0;
                                    handleInputChange('price', numValue);
                                }}
                                error={!!formErrors.price}
                                helperText={formErrors.price}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.01,
                                        placeholder: '0.00'
                                    }
                                }}
                                disabled={submitting || success}
                            />

                            {/* Stock - convertir string a numero */}
                            <TextField
                                label="Stock *"
                                type="number"
                                fullWidth
                                value={formData.stock}
                                onChange={(e) => {
                                    const numValue = parseInt(e.target.value) || 0;
                                    handleInputChange('stock', numValue);
                                }}
                                error={!!formErrors.stock}
                                helperText={formErrors.stock}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        placeholder: '0'
                                    }
                                }}
                                disabled={submitting || success}
                            />
                        </Box>

                        {/* Categoria */}
                        <FormControl fullWidth error={!!formErrors.categoryId} disabled={submitting || success}>
                            <InputLabel>Categoria *</InputLabel>
                            <Select
                                value={formData.categoryId}
                                label="Categoria *"
                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                            >
                                {categories.length === 0 ? (
                                    <MenuItem value="" disabled>
                                        No hay categorias disponibles
                                    </MenuItem>
                                ) : (
                                    categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name} {category.description && `- ${category.description}`}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {formErrors.categoryId && (
                                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                    {formErrors.categoryId}
                                </Typography>
                            )}
                            {!formErrors.categoryId && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2, mt: 0.5 }}>
                                    {categories.length === 0 ? 'Debe crear categorias primero' : 'Seleccione una categoria'}
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
                                disabled={submitting || success || categories.length === 0}
                                sx={{ minWidth: 150 }}
                            >
                                {submitting ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Producto'
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

export default CreateProductPage;