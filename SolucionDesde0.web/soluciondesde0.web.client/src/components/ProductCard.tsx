import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { ProductResponse } from '../types/product';

interface ProductCardProps {
    product: ProductResponse;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
                    <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                            {product.description}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Categoria: {product.categoryName || 'Sin categoria'}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;