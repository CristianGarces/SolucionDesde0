import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h1" color="error" gutterBottom>
                404
            </Typography>
            <Typography variant="h4" gutterBottom>
                Página no encontrada
            </Typography>
            <Typography variant="body1" paragraph>
                La página que estás buscando no existe.
            </Typography>
            <Button variant="contained" component={Link} to="/">
                Volver al Inicio
            </Button>
        </Box>
    );
};

export default NotFoundPage;