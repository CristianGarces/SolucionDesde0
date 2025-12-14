import { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../contexts/CartContext';
import type { ProductResponse } from '../types/product';

interface AddToCartButtonProps {
    product: ProductResponse;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
    const { addItem, getItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    const currentInCart = getItemQuantity(product.id);

    const handleAddToCart = () => {
        if (quantity > 0) {
            addItem(product, quantity);
            setQuantity(1);
        }
    };

    const handleIncrement = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleQuantityChange = (value: number) => {
        if (value >= 1 && value <= product.stock) {
            setQuantity(value);
        }
    };

    if (product.stock === 0) {
        return (
            <Typography color="error" variant="body2">
                Sin stock
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {currentInCart > 0 && (
                <Typography variant="body2" color="text.secondary">
                    En carrito: {currentInCart} unidad{currentInCart !== 1 ? 'es' : ''}
                </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Botón - */}
                <IconButton
                    size="small"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    sx={{ border: 1, borderColor: 'divider' }}
                >
                    <RemoveIcon fontSize="small" />
                </IconButton>

                {/* Input cantidad */}
                <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    inputProps={{
                        min: 1,
                        max: product.stock,
                        style: {
                            width: '50px',
                            textAlign: 'center',
                            padding: '8.5px 0'
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderRadius: 1,
                            },
                        },
                    }}
                />

                {/* Botón + */}
                <IconButton
                    size="small"
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    sx={{ border: 1, borderColor: 'divider' }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>

                {/* Botón Añadir */}
                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleAddToCart}
                    startIcon={<AddIcon />}
                    sx={{ ml: 1, textTransform: 'none' }}
                >
                    Anadir
                </Button>
            </Box>

            <Typography variant="caption" color="text.secondary">
                Stock disponible: {product.stock}
            </Typography>
        </Box>
    );
};

export default AddToCartButton;