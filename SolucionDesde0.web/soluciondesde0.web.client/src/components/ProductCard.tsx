// components/ProductCard.tsx - Versión compacta
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import type { ProductResponse } from '../types/product';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddToCartButton from './AddToCartButton';
import { useAuth } from '../hooks/useAuth';

interface ProductCardProps {
    product: ProductResponse;
    isAdmin?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string, name: string) => void;
}

const ProductCard = ({ product, isAdmin = false, onEdit, onDelete }: ProductCardProps) => {
    const { user } = useAuth();

    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                }
            }}
        >
            <CardContent>
                {/* PRIMERA FILA: Nombre */}
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {product.name}
                </Typography>

                {/* DESCRIPCIÓN */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                </Typography>

                {/* SEGUNDA FILA: Precio, stock y botón (todo en la misma línea) */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    {/* Columna izquierda: Precio y stock */}
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                            {product.price.toFixed(2)}&euro;
                        </Typography>
                        <Chip
                            label={`Stock: ${product.stock}`}
                            size="small"
                            color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                            sx={{ mt: 0.5 }}
                        />
                    </Box>

                    {/* Columna derecha: Botón Añadir al carrito (solo miembros) */}
                    {user?.role === 'Member' && product.stock > 0 && (
                        <Box sx={{ ml: 2 }}>
                            <AddToCartButton product={product} />
                        </Box>
                    )}
                </Box>

                {/* TERCERA FILA: Categoría y botones admin */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'divider'
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Categoria: {product.categoryName || 'Sin categoria'}
                    </Typography>

                    {/* Botones de acción (solo admin) */}
                    {isAdmin && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {onEdit && (
                                <IconButton
                                    size="small"
                                    onClick={() => onEdit(product.id)}
                                    sx={{ color: 'primary.main' }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                            {onDelete && (
                                <IconButton
                                    size="small"
                                    onClick={() => onDelete(product.id, product.name)}
                                    color="error"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;