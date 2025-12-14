import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Alert,
    Grid,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { orderService } from '../../api/orderService';
import { useCart } from '../../hooks/useCart';

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        items,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice
    } = useCart();

    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingCity, setShippingCity] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

    // NUEVOS: Estados para errores de validacion
    const [shippingAddressError, setShippingAddressError] = useState('');
    const [shippingCityError, setShippingCityError] = useState('');

    const handleCreateOrder = async () => {
        // Resetear errores
        setShippingAddressError('');
        setShippingCityError('');
        setError(null);

        // Validar campos requeridos
        let hasError = false;

        if (!shippingAddress.trim()) {
            setShippingAddressError('La direccion es requerida');
            hasError = true;
        }

        if (!shippingCity.trim()) {
            setShippingCityError('La ciudad es requerida');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        if (items.length === 0) {
            setError('El carrito esta vacio');
            return;
        }

        if (!user) {
            setError('Debes estar autenticado para crear un pedido');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Preparar datos para crear el pedido
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity
                })),
                shippingAddress: shippingAddress || undefined,
                shippingCity: shippingCity || undefined,
                notes: notes || undefined
            };

            // Llamar al servicio para crear el pedido
            const order = await orderService.createOrder(orderData);

            // Limpiar carrito
            clearCart();

            //Guardar el ID del pedido creado
            setCreatedOrderId(order.id);

            // Mostrar exito (pero NO redirigir automaticamente)
            setSuccess(true);

        } catch (err: unknown) {
            console.error('Error creating order:', err);
            setError(err instanceof Error ? err.message : 'Error al crear el pedido');
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (productId: string, currentQuantity: number, stock: number) => {
        if (currentQuantity < stock) {
            updateQuantity(productId, currentQuantity + 1);
        } else {
            alert(`No hay suficiente stock. Disponible: ${stock}`);
        }
    };

    const handleDecrement = (productId: string, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        }
    };

    // Mostrar pantalla de carrito vacio SOLO si no hay exito
    if (items.length === 0 && !success) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/products')}
                    sx={{ mb: 3 }}
                >
                    Volver a Productos
                </Button>

                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Tu carrito esta vacio
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Anade algunos productos para continuar con tu compra
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                    >
                        Ver Productos
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                        Mi Carrito
                    </Typography>
                    <Typography variant="body1" color="white">
                        {totalItems} producto{totalItems !== 1 ? 's' : ''} • Total: {totalPrice.toFixed(2)} &euro;
                    </Typography>
                </Box>

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/products')}
                >
                    Seguir Comprando
                </Button>
            </Box>

            {/* Mensajes de error/exito */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Pantalla de exito despues de crear pedido */}
            {success ? (
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom color="success.main">
                        Pedido creado exitosamente
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Tu pedido ha sido procesado correctamente.
                        {createdOrderId && (
                            <Box sx={{ mt: 1 }}>
                                <strong>Numero de pedido:</strong> {createdOrderId.substring(0, 8).toUpperCase()}
                            </Box>
                        )}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`/orders/${createdOrderId}`)}
                            sx={{ textTransform: 'none' }}
                        >
                            Ver Detalles del Pedido
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setSuccess(false);
                                setCreatedOrderId(null);
                                navigate('/products');
                            }}
                            sx={{ textTransform: 'none' }}
                        >
                            Seguir Comprando
                        </Button>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                        El carrito se ha vaciado automaticamente. Puedes ver el historial de tus pedidos en "Mis Pedidos".
                    </Typography>
                </Paper>
            ) : (
                /* Formulario normal de carrito (cuando no hay exito) */
                <Grid container spacing={3}>
                    {/* Columna izquierda: Productos en el carrito */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Productos ({items.length})
                            </Typography>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="right">Precio unitario</TableCell>
                                            <TableCell align="center">Cantidad</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="right">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow key={item.productId}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography fontWeight="medium">
                                                            {item.productName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.categoryName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {item.unitPrice.toFixed(2)} &euro;
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDecrement(item.productId, item.quantity)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <RemoveIcon fontSize="small" />
                                                        </IconButton>

                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                if (!isNaN(value) && value >= 1 && value <= item.stock) {
                                                                    updateQuantity(item.productId, value);
                                                                }
                                                            }}
                                                            inputProps={{
                                                                min: 1,
                                                                max: item.stock,
                                                                style: {
                                                                    width: '50px',
                                                                    textAlign: 'center'
                                                                }
                                                            }}
                                                            sx={{ mx: 1 }}
                                                        />

                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleIncrement(item.productId, item.quantity, item.stock)}
                                                            disabled={item.quantity >= item.stock}
                                                        >
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Max: {item.stock}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography fontWeight="bold">
                                                        {(item.unitPrice * item.quantity).toFixed(2)} &euro;
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeItem(item.productId)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={clearCart}
                                >
                                    Vaciar Carrito
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Columna derecha: Resumen y formulario */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Resumen del Pedido
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Productos ({totalItems})</Typography>
                                    <Typography>{totalPrice.toFixed(2)} &euro;</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Total
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {totalPrice.toFixed(2)} &euro;
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Informacion de Envio
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Direccion de envio"
                                    value={shippingAddress}
                                    onChange={(e) => {
                                        setShippingAddress(e.target.value);
                                        if (e.target.value.trim()) {
                                            setShippingAddressError('');
                                        }
                                    }}
                                    fullWidth
                                    size="small"
                                    required
                                    error={!!shippingAddressError}
                                    helperText={shippingAddressError}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField
                                    label="Ciudad"
                                    value={shippingCity}
                                    onChange={(e) => {
                                        setShippingCity(e.target.value);
                                        if (e.target.value.trim()) {
                                            setShippingCityError('');
                                        }
                                    }}
                                    fullWidth
                                    size="small"
                                    required
                                    error={!!shippingCityError}
                                    helperText={shippingCityError}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <TextField
                                    label="Notas (opcional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    placeholder="Instrucciones especiales, comentarios..."
                                />
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleCreateOrder}
                                disabled={loading || items.length === 0}
                                sx={{ mt: 3, textTransform: 'none', py: 1.5 }}
                            >
                                {loading ? (
                                    <>
                                        Creando Pedido...
                                    </>
                                ) : (
                                    'Crear Pedido'
                                )}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default CartPage;