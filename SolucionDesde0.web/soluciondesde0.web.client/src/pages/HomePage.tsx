import { Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mt: 8, p: 4 }}>
                <Typography variant="h2" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                    MARVEL SHOP
                </Typography>

                {isAuthenticated ? (
                    <>
                        <Typography variant="h4" color="secondary" gutterBottom>
                            Bienvenido, {user?.name}!
                        </Typography>
                        <Typography variant="h5" paragraph>
                            Has iniciado sesion correctamente en tu tienda Marvel.
                        </Typography>

                        <Box sx={{ mt: 6, display: 'flex', gap: 3, justifyContent: 'center' }}>
                            <Button variant="contained" size="large" component={Link} to="/products">
                                Ver Productos
                            </Button>
                            <Button variant="outlined" size="large" component={Link} to="/profile">
                                Mi Perfil
                            </Button>
                            <Button variant="contained" color="error" size="large" onClick={logout}>
                                Cerrar Sesion
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h5" color="error">
                        Error: No deberias estar aqui sin autenticacion
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default HomePage;