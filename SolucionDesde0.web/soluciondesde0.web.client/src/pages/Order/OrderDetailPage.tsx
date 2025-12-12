import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Chip,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../api/orderService';
import type { OrderResponse } from '../../types/order';
import {
    OrderStatus,
    formatOrderDate,
    getStatusLabel,
    getStatusColor,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS
} from '../../types/order';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UpdateIcon from '@mui/icons-material/Update';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';

const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.Pending);

    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        if (!id) {
            navigate('/orders');
            return;
        }

        fetchOrder(id);
    }, [id, navigate]);

    const fetchOrder = async (orderId: string) => {
        try {
            setLoading(true);
            setError(null);

            // Si es admin, usa el endpoint de admin que tiene más información
            const data = isAdmin
                ? await orderService.getOrderByIdForAdmin(orderId)
                : await orderService.getOrderById(orderId);

            setOrder(data);

            // Convertir string status a enum para el select
            const statusEnum = convertStatusToEnum(data.status);
            setSelectedStatus(statusEnum);

        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : 'Error desconocido al cargar el pedido';
            setError('Error al cargar el pedido: ' + errorMsg);
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para convertir string de status a enum
    const convertStatusToEnum = (statusString: string): OrderStatus => {
        const statusMap: Record<string, OrderStatus> = {
            'Pending': OrderStatus.Pending,
            'Confirmed': OrderStatus.Confirmed,
            'Processing': OrderStatus.Processing,
            'Shipped': OrderStatus.Shipped,
            'Delivered': OrderStatus.Delivered,
            'Cancelled': OrderStatus.Cancelled
        };
        return statusMap[statusString] || OrderStatus.Pending;
    };

    const handleStatusUpdate = async () => {
        if (!id || !isAdmin) return;

        try {
            setUpdating(true);
            setError(null);

            await orderService.updateOrderStatus(id, selectedStatus);

            setSuccess(true);
            setTimeout(() => {
                fetchOrder(id); // Recargar datos
                setSuccess(false);
            }, 2000);

        } catch (err: unknown) {
            console.error('Error updating order status:', err);
            setError('Error al actualizar el estado del pedido');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        navigate('/orders');
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando pedido...</Typography>
            </Container>
        );
    }

    if (error && !order) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/orders')}
                    sx={{ mb: 3 }}
                >
                    Volver a Pedidos
                </Button>

                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    onClick={() => navigate('/orders')}
                >
                    Volver al listado
                </Button>
            </Container>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Botón volver */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/orders')}
                sx={{ mb: 3 }}
            >
                Volver a Pedidos
            </Button>

            {/* Header del pedido */}
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Pedido #{order.id.substring(0, 8).toUpperCase()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Chip
                                label={getStatusLabel(order.status)}
                                color={getStatusColor(order.status) as any}
                                size="medium"
                            />
                            <Typography variant="body2" color="text.secondary">
                                Creado el {formatOrderDate(order.createdAt)}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        {order.totalAmount.toFixed(2)} €
                    </Typography>
                </Box>

                {/* Información del pedido */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Información de envío */}
                    {(order.shippingAddress || order.shippingCity) && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Dirección de envío
                                    </Typography>
                                </Box>
                                {order.shippingAddress && (
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        {order.shippingAddress}
                                    </Typography>
                                )}
                                {order.shippingCity && (
                                    <Typography variant="body1" color="text.secondary">
                                        {order.shippingCity}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    )}

                    {/* Notas */}
                    {order.notes && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <NotesIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Notas
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {order.notes}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* Tabla de productos */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Productos ({order.items.length})
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Precio unitario</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Typography fontWeight="medium">
                                            {item.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {item.productId.substring(0, 8)}...
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">{item.unitPrice.toFixed(2)} €</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight="bold">
                                            {item.subtotal.toFixed(2)} €
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} align="right">
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Total
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {order.totalAmount.toFixed(2)} €
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Actualización de estado (solo Admin) */}
                {isAdmin && (
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Actualizar Estado del Pedido
                        </Typography>

                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                ¡Estado actualizado exitosamente!
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Nuevo estado</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Nuevo estado"
                                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                                    disabled={updating}
                                >
                                    {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                                        <MenuItem key={status} value={parseInt(status)}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                startIcon={<UpdateIcon />}
                                onClick={handleStatusUpdate}
                                disabled={updating || selectedStatus === convertStatusToEnum(order.status)}
                                sx={{ textTransform: 'none' }}
                            >
                                {updating ? (
                                    <>
                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                        Actualizando...
                                    </>
                                ) : (
                                    'Actualizar Estado'
                                )}
                            </Button>

                            <Typography variant="body2" color="text.secondary">
                                Estado actual: {getStatusLabel(order.status)}
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default OrderDetailPage;