import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Grid,
    CssBaseline
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const validateForm = () => {
        const errors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
        let isValid = true;

        // Validar nombre
        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            errors.name = 'El nombre debe tener al menos 2 caracteres';
            isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = 'El email es requerido';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Email no valido (ejemplo: usuario@dominio.com)';
            isValid = false;
        }

        // Validar contraseña (REGLAS COMPLETAS)
        if (!formData.password) {
            errors.password = 'La contrasena es requerida';
            isValid = false;
        } else {
            const password = formData.password;
            const requirements: string[] = [];

            if (password.length < 6) {
                requirements.push('6 caracteres');
            }

            if (!/[A-Z]/.test(password)) {
                requirements.push('una mayuscula (A-Z)');
            }
  
            if (!/[a-z]/.test(password)) {
                requirements.push('una minuscula (a-z)');
            }

            if (!/\d/.test(password)) {
                requirements.push('un numero (0-9)');
            }

            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                requirements.push('un caracter especial (!@#$%^&*)');
            }

            if (requirements.length > 0) {
                errors.password = `La contrasena debe contener: ${requirements.join(', ')}`;
                isValid = false;
            }
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contrasenas no coinciden';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await register(formData.name, formData.email, formData.password);

            if (result.success) {
                navigate('/login', {
                    state: {
                        message: result.message || 'Registro exitoso! Por favor inicia sesion.',
                        email: formData.email
                    }
                });
            }
        } catch (err: unknown) {
            let errorMessage = 'Error al registrarse. Por favor intenta nuevamente.';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />

            {/* Lado izquierdo - MARVEL SHOP */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h1"
                        sx={{
                            fontWeight: 'bold',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                            letterSpacing: '0.2em',
                        }}
                    >
                        MARVEL SHOP
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mt: 2,
                            fontStyle: 'italic',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        Unete a nuestra comunidad
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 4,
                            maxWidth: '500px',
                            mx: 'auto',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        }}
                    >
                        Accede a productos exclusivos, ofertas especiales y el mejor merchandising de Marvel.
                    </Typography>
                </Box>
            </Grid>

            {/* Lado derecho - Formulario de Registro */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <PersonAddOutlined />
                    </Box>

                    <Typography component="h1" variant="h5">
                        Crear Cuenta
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                        Registrate para comenzar a comprar
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Nombre completo"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            disabled={isLoading || authLoading}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            disabled={isLoading || authLoading}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contrasena"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!formErrors.password}
                            helperText={formErrors.password}
                            disabled={isLoading || authLoading}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirmar contrasena"
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!formErrors.confirmPassword}
                            helperText={formErrors.confirmPassword}
                            disabled={isLoading || authLoading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 4, mb: 2 }}
                            disabled={isLoading || authLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="primary">
                                    Ya tienes cuenta? Inicia sesion
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default RegisterPage;