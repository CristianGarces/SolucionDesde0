import { Typography, Box, Container, Paper, Avatar, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
//import EditIcon from '@mui/icons-material/Edit';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5">No hay informacion de usuario disponible</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                Mi Perfil
            </Typography>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                {/* Avatar y nombre */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'primary.main',
                            fontSize: '2rem',
                            mr: 3
                        }}
                    >
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Cuenta verificada en Marvel Shop
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Información del usuario */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Nombre */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Nombre completo
                            </Typography>
                            <Typography variant="body1">
                                {user.name}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Correo electronico
                            </Typography>
                            <Typography variant="body1">
                                {user.email}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Rol */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Rol en el sistema
                            </Typography>
                            <Typography variant="body1" sx={{
                                color: user.role === 'Admin' ? 'error.main' : 'success.main',
                                fontWeight: 'bold'
                            }}>
                                {user.role}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProfilePage;