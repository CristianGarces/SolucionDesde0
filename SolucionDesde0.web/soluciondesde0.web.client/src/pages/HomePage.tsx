import { Typography, Button, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h3" gutterBottom>
                Bienvenido a Mi E-Commerce
            </Typography>

            {isAuthenticated ? (
                <>
                    <Typography variant="h5" color="primary" gutterBottom>
                        Hola {user?.name}!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Has iniciado sesion correctamente. Ahora puedes explorar nuestros productos.
                    </Typography>
                    <Button variant="contained" component={Link} to="/products">
                        Ver Productos
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h5" gutterBottom>
                        Por favor inicia sesion para continuar
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button variant="contained" component={Link} to="/login" size="large">
                            Iniciar Sesion
                        </Button>
                        <Button variant="outlined" component={Link} to="/register" size="large">
                            Registrarse
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default HomePage;