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
    Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../api/orderService';
import type { OrderListResponse } from '../../types/order';
import { formatOrderDate, getStatusLabel, getStatusColor } from '../../types/order';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Si es admin, obtiene todos los pedidos, sino solo los suyos
            const data = isAdmin
                ? await orderService.getAllOrders()
                : await orderService.getUserOrders();

            setOrders(data);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar los pedidos';
            setError('Error al cargar los pedidos: ' + errorMsg);
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (id: string) => {
        navigate(`/orders/${id}`);
    };

    const getTotalOrdersValue = () => {
        return orders.reduce((total, order) => total + order.totalAmount, 0);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                        {isAdmin ? 'Gestion de Pedidos' : 'Mis Pedidos'}
                    </Typography>
                    <Typography variant="body1" color="white">
                        {orders.length} pedidos - Total: {getTotalOrdersValue().toFixed(2)} &euro;
                    </Typography>
                </Box>
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

            {/* Lista de pedidos */}
            {!loading && !error && (
                <Box>
                    {orders.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No hay pedidos {isAdmin ? 'registrados' : 'realizados'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                                {isAdmin
                                    ? 'Los pedidos apareceran aqui cuando los usuarios los creen'
                                    : 'Cuando realices un pedido, aparecera aqui'}
                            </Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {orders.map((order) => (
                                <Grid item xs={12} key={order.id}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 4
                                            }
                                        }}
                                    >
                                        {/* Información del pedido */}
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    Pedido #{order.id.substring(0, 8).toUpperCase()}
                                                </Typography>
                                                <Chip
                                                    label={getStatusLabel(order.status)}
                                                    color={getStatusColor(order.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                                                    size="small"
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Fecha
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formatOrderDate(order.createdAt)}
                                                    </Typography>
                                                </Box>

                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Articulos
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {order.itemCount} {order.itemCount === 1 ? 'producto' : 'productos'}
                                                    </Typography>
                                                </Box>

                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Total
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                        {order.totalAmount.toFixed(2)} &euro;
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Botón ver detalles */}
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleViewOrder(order.id)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Ver Detalles
                                            </Button>
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

export default OrdersPage;