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
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import type { ProductResponse, UpdateProductRequest } from '../../types/product';
import type { CategoryResponse } from '../../types/categories';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState<UpdateProductRequest>({
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

        if (id) {
            fetchProduct(id);
            fetchAllCategories();
        }
    }, [isAdmin, navigate, id]);

    const fetchProduct = async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getProductById(productId);
            setProduct(data);
            setFormData({
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                categoryId: data.categoryId
            });
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar el producto';
            setError('Error al cargar el producto: ' + errorMsg);
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err: unknown) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoadingCategories(false);
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
            errors.description = 'La descripción es requerida';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
        } else if (formData.description.trim().length > 1000) {
            errors.description = 'La descripción no puede exceder los 1000 caracteres';
        }

        if (formData.price <= 0) {
            errors.price = 'El precio debe ser mayor a 0';
        }

        if (formData.stock < 0) {
            errors.stock = 'El stock no puede ser negativo';
        }

        if (!formData.categoryId) {
            errors.categoryId = 'Debe seleccionar una categoría';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof UpdateProductRequest,
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

        if (!validateForm() || !id) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const productData = {
                ...formData,
                price: parseFloat(formData.price.toString()),
                stock: parseInt(formData.stock.toString())
            };

            await productService.updateProduct(id, productData);

            setSuccess(true);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/products');
            }, 2000);

        } catch (err: unknown) {
            console.error('Error updating product:', err);

            let errorMessage = 'Error al actualizar el producto';

            // Extraer mensaje específico del backend
            if (err && typeof err === 'object' && 'response' in err) {
                const errorObj = err as { response?: { data?: { error?: string } } };

                if (errorObj.response?.data?.error) {
                    const backendError = errorObj.response.data.error;
                    if (backendError.includes('already exists')) {
                        errorMessage = `Ya existe un producto con el nombre "${formData.name}".`;
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
        navigate('/products');
    };

    // Si no es admin, redirigir
    if (!isAdmin) {
        navigate('/products');
        return null;
    }

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando producto...</Typography>
            </Container>
        );
    }

    if (error && !product) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/products')}
                    sx={{ mb: 3 }}
                >
                    Volver a Productos
                </Button>

                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    onClick={() => navigate('/products')}
                >
                    Volver al listado
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Botón volver */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/products')}
                sx={{ mb: 3 }}
            >
                Volver a Productos
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Editar Producto: {product?.name}
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Producto actualizado exitosamente! Redirigiendo a la lista de productos...
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
                            helperText={formErrors.name || 'Nombre descriptivo del producto'}
                            disabled={submitting || success}
                        />

                        {/* Descripción */}
                        <TextField
                            label="Descripción *"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            error={!!formErrors.description}
                            helperText={formErrors.description || 'Descripción detallada del producto'}
                            disabled={submitting || success}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Precio */}
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

                            {/* Stock */}
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

                        {/* Categoría */}
                        <FormControl fullWidth error={!!formErrors.categoryId} disabled={submitting || success || loadingCategories}>
                            <InputLabel>Categoría *</InputLabel>
                            <Select
                                value={formData.categoryId}
                                label="Categoría *"
                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                            >
                                {loadingCategories ? (
                                    <MenuItem value="">
                                        <em>Cargando categorías...</em>
                                    </MenuItem>
                                ) : categories.length === 0 ? (
                                    <MenuItem value="" disabled>
                                        No hay categorías disponibles
                                    </MenuItem>
                                ) : (
                                    categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {formErrors.categoryId && (
                                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                    {formErrors.categoryId}
                                </Typography>
                            )}
                        </FormControl>

                        {/* Información adicional */}
                        {product && (
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>ID:</strong> {product.id}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Creado por:</strong> Usuario ID: {product.createdByUserId}
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
                                disabled={submitting || success || loadingCategories || categories.length === 0}
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

export default EditProductPage;