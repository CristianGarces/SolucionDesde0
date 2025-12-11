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
import { useAuth } from '../hooks/useAuth';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import type { CategoryResponse } from '../types/categories';
import type { CreateProductRequest } from '../types/product';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

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
            
            // Seleccionar primera categoría por defecto si existe
            if (data.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    categoryId: data[0].id
                }));
            }
        } catch (err: any) {
            setError('Error al cargar categorías: ' + (err.message || 'Error desconocido'));
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
        }

        if (!formData.description.trim()) {
            errors.description = 'La descripción es requerida';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'La descripción debe tener al menos 10 caracteres';
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

    const handleInputChange = (field: keyof CreateProductRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar error del campo al modificar
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
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

            // Convertir price y stock a números
            const productData = {
                ...formData,
                price: parseFloat(formData.price.toString()),
                stock: parseInt(formData.stock.toString())
            };

            await productService.createProduct(productData);
            
            setSuccess(true);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/products');
            }, 2000);

        } catch (err: any) {
            console.error('Error creating product:', err);
            setError('Error al crear el producto: ' + 
                (err.response?.data?.message || err.message || 'Error desconocido'));
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
                    Crear Nuevo Producto
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        ¡Producto creado exitosamente! Redirigiendo a la lista de productos...
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
                                onChange={(e) => handleInputChange('price', e.target.value)}
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
                                onChange={(e) => handleInputChange('stock', e.target.value)}
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
                        <FormControl fullWidth error={!!formErrors.categoryId} disabled={submitting || success}>
                            <InputLabel>Categoría *</InputLabel>
                            <Select
                                value={formData.categoryId}
                                label="Categoría *"
                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                            >
                                {categories.length === 0 ? (
                                    <MenuItem value="" disabled>
                                        No hay categorías disponibles
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
                                    {categories.length === 0 ? 'Debe crear categorías primero' : 'Seleccione una categoría'}
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