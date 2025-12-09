import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#d32f2f' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                            MARVEL SHOP
                        </Link>
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {isAuthenticated ? (
                            <>
                                <Typography color="inherit" sx={{ alignSelf: 'center' }}>
                                    Hola, {user?.name}
                                </Typography>
                                <Button color="inherit" onClick={logout}>
                                    Cerrar Sesion
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Iniciar Sesion
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Registrarse
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Outlet />
            </Container>
        </>
    );
};

export default Layout;