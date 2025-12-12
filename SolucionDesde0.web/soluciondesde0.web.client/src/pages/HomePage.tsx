import { Typography, Button, Box, Container} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const isAdmin = user?.role === 'Admin';

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Botones según rol */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', mb: 6, color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                    Bienvenido, {user?.name}! Que deseas hacer?
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    alignItems: 'center',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    {/* Botón Productos */}
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('/products')}
                        sx={{
                            py: 2.5,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            borderRadius: 2,
                            justifyContent: 'flex-start',
                            pl: 3
                        }}
                    >
                        Productos
                    </Button>

                    {/* Botón Categorías (solo Admin) */}
                    {isAdmin && (
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<CategoryIcon />}
                            onClick={() => navigate('/categories')}
                            sx={{
                                py: 2.5,
                                fontSize: '1.1rem',
                                background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                                borderRadius: 2,
                                justifyContent: 'flex-start',
                                pl: 3
                            }}
                        >
                            Categorias
                        </Button>
                    )}

                    {/* Botón Usuarios (solo Admin) */}
                    {isAdmin && (
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<PeopleIcon />}
                            onClick={() => navigate('/users')}
                            sx={{
                                py: 2.5,
                                fontSize: '1.1rem',
                                background: 'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)',
                                borderRadius: 2,
                                justifyContent: 'flex-start',
                                pl: 3
                            }}
                        >
                            Usuarios
                        </Button>
                    )}

                    {/* Botón Pedidos */}
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ListAltIcon />}
                        sx={{
                            py: 2.5,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                            borderRadius: 2,
                            justifyContent: 'flex-start',
                            pl: 3
                        }}
                    >
                        Pedidos
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default HomePage;