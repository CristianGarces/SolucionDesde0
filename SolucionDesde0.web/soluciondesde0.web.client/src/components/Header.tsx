import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const {logout } = useAuth();
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleHome = () => {
        navigate('/');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: '#d32f2f', 
                boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)'
            }}
        >
            <Toolbar>
                {/* Espacio para balancear */}
                <Box sx={{ width: 140 }} /> 

                {/* Título centrado */}
                <Typography
                    variant="h5"
                    component="div"
                    onClick={handleHome}
                    sx={{
                        flexGrow: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.9,
                            transform: 'scale(1.02)',
                            transition: 'transform 0.2s'
                        }
                    }}
                >
                    MARVEL SHOP
                </Typography>

                {/* Botones izquierda */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        color="inherit"
                        startIcon={<PersonIcon />}
                        onClick={handleProfile}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Perfil
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Cerrar Sesion
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;