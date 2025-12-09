import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando aplicación...</div>;
    }

    return (
        <Routes>
            {/* Si NO está autenticado, redirigir a /login */}
            <Route path="/" element={
                isAuthenticated ? <HomePage /> : <Navigate to="/login" />
            } />

            {/* Rutas públicas sin layout */}
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" /> : <LoginPage />
            } />

            <Route path="/register" element={
                isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
            } />

            {/* Rutas protegidas con layout */}
            <Route path="/dashboard" element={
                isAuthenticated ? <Layout /> : <Navigate to="/login" />
            }>
                <Route index element={<HomePage />} />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;