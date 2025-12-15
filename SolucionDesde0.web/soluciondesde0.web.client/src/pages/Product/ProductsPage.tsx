import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Grid,
    Paper
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../api/productService';
import type { ProductResponse } from '../../types/product';
import ProductCard from '../../components/ProductCard';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';


const ProductsPage = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { totalItems } = useCart();

    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError('Error al cargar los productos: ' + err.message);
            } else {
                setError('Error al cargar los productos: Error desconocido');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = () => {
        navigate('/products/create');
    };

    const handleEditProduct = (id: string) => {
        navigate(`/products/edit/${id}`);
    };

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!window.confirm(`Estas seguro de eliminar el producto "${name}"?`)) {
            return;
        }

        try {
            await productService.deleteProduct(id);
            fetchProducts();
        } catch (err: unknown) {
            console.error('Error deleting product:', err);

            let errorMessage = 'Error al eliminar el producto';

            // Extraer mensaje especifico del backend
            if (err && typeof err === 'object' && 'response' in err) {
                const errorObj = err as { response?: { data?: { error?: string } } };

                if (errorObj.response?.data?.error) {
                    errorMessage = errorObj.response.data.error;
                }
            }
            alert(errorMessage);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                        Catalogo de Productos
                    </Typography>
                    <Typography variant="body1" color= 'white'>
                        {products.length} productos disponibles
                    </Typography>
                </Box>

                {/* Boton segun rol */}
                {isAdmin ? (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateProduct}
                        sx={{ textTransform: 'none' }}
                    >
                        Crear Producto
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('/cart')}
                        sx={{ textTransform: 'none' }}
                    >
                        Carrito ({totalItems})
                    </Button>
                )}
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

            {/* Lista de productos */}
            {!loading && !error && (
                <Box>
                    {products.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No hay productos disponibles
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {isAdmin ? 'Crea tu primer producto usando el boton "Crear Producto"' : 'Pronto habra productos disponibles'}
                                </Typography>
                            </Box>
                        </Paper>
                    ) : (
                        <Grid container spacing={2}>
                            {products.map((product) => (
                                <Grid item xs={12} key={product.id}>
                                    <ProductCard
                                        product={product}
                                        isAdmin={isAdmin}
                                        onEdit={handleEditProduct}
                                        onDelete={handleDeleteProduct}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default ProductsPage;