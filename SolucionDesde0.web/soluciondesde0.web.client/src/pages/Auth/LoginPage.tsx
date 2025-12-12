import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
import { LockOutlined } from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccessMessage(null);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        await login(formData.email, formData.password);
        navigate('/');
    } catch (err: unknown) {
        let errorMessage = 'Credenciales incorrectas';

        if (err instanceof Error) {
            if (err.message.includes('Network Error')) {
                errorMessage = 'Error de conexion.';
            }
            else if (err.message.includes('400') || err.message.includes('401')) {
                errorMessage = 'Credenciales incorrectas';
            }
            else if (err.message) {
                errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
            }
        }

        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      
      {/* Lado izquierdo - Login Form */}
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
            <LockOutlined />
          </Box>
          
          <Typography component="h1" variant="h5">
            Iniciar Sesion
          </Typography>
          
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {successMessage}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading || authLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || authLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Iniciar Sesion'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  No tienes cuenta? Registrate
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Grid>
      
      {/* Lado derecho - Título MARVEL SHOP */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
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
            Tu tienda oficial de comics y merchandising
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;