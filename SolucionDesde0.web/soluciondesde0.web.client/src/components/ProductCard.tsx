import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import type { ProductResponse } from '../types/product';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ProductCardProps {
    product: ProductResponse;
    isAdmin?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string, name: string) => void;
}

const ProductCard = ({ product, isAdmin = false, onEdit, onDelete }: ProductCardProps) => {
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                            {product.description}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right', ml: 2 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                            {product.price.toFixed(2)}&euro;
                        </Typography>
                        <Chip
                            label={`Stock: ${product.stock}`}
                            size="small"
                            color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>

                {/* Footer con categoria y botones */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Categoria: {product.categoryName || 'Sin categoria'}
                    </Typography>

                    {/* Botones de accion (solo admin) */}
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